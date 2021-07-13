import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Fade from "@material-ui/core/Fade";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import Grow from "@material-ui/core/Grow";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Backdrop from "@material-ui/core/Backdrop";

import QrCodeScanIcon from "../icons/QrCodeScan";

import QrReader from "react-qr-reader"
import CoinSendDialog from "./CoinSendDialog";
import { HISTORY } from "../utils/constants";
import actions from "../actions/utils";
import api from "../utils/api";
import price_formatter from "../utils/price-formatter";

const styles = theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 0),
            marginBottom: 80,
        }
    },
    backdrop: {
        color: "#fff",
        zIndex: "1400"
    },
    textField: {
        marginBottom: theme.spacing(2)
    },
    circularProgressContainer:{
        textAlign: "center",
        padding: theme.spacing(2)
    },
    fab: {
        position: "fixed",
        backgroundColor: theme.palette.primary.action,
        color: theme.palette.primary.contrastText,
        "&:hover": {
            backgroundColor: theme.palette.primary.actionLighter,
        },
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        "& svg": {
            marginRight: 4
        }
    },
    dialog: {
        "& .MuiDialog-container .MuiDialog-paper": {
            width: 600,
        },
        [theme.breakpoints.down("xs")]: {
            "& .MuiDialog-container .MuiDialog-paper": {
                margin: "0px 0px",
                maxHeight: "100%",
                borderRadius: 0,
            },
        }
    },
    dialogContent: {
        padding: theme.spacing(0)
    },
    underCardButtonContainer: {
        marginTop: theme.spacing(1),
        textAlign: "right",
    },
    underCardButton: {
        minWidth: "calc(50% - 8px)",
        [theme.breakpoints.only("xs")]: {
            margin: theme.spacing(0, 1, 0, 0)
        }
    },
    noAccountImage: {
        padding: theme.spacing(4),
        width: "100%"
    },
});


class CoinSend extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coin_id: props.coin_id,
            coin_data: props.coin_data,
            pathname: props.pathname,
            logged_account: props.logged_account,
            we_know_if_logged: props.we_know_if_logged,
            selected_currency: props.selected_currency,
            selected_locales_code: props.selected_locales_code,
            _history: HISTORY,
            _address: "",
            _fee: 0,
            _send_transaction_info: null,
            _is_scanner_dialog_open: false,
            _is_backdrop_shown: false,
            _send_address_input: "",
            _send_amount_input: "",
            _send_message_input: "",
            _send_address_input_error: false,
            _send_amount_input_error: false,
            _send_message_input_error: false,
            _coin_balance: null,
        };
    };

    componentDidMount() {

        this._get_address_by_seed();
        this._get_coin_balance();
        this._get_send_transaction_info();
        this._reset_local_props_from_new_pathname();
    }

    componentWillReceiveProps(new_props) {

        const { pathname, logged_account } = this.state;

        this.setState(new_props, () => {

            if(new_props.logged_account) {

                if(pathname !== new_props.pathname || logged_account !== new_props.logged_account) {

                    this._get_address_by_seed();
                    this._get_coin_balance();
                    this._get_send_transaction_info();
                    this._reset_local_props_from_new_pathname();
                }
            }
        });
    }

    _reset_local_props_from_new_pathname = () => {

        const { pathname } = this.state;
        const address = pathname.match(/\/send\/?([a-zA-Z0-9]+)?\/?/)[1] || "";

        this.setState({_send_address_input: address, _send_amount_input: "", _send_message_input: ""});
    };

    _handle_get_balance_result = (error, result) => {

        if(!error) {

            this.setState({_coin_balance: result});
        }else {

            console.log(error);
        }

        actions.trigger_loading_update(100);
    };

    _get_coin_balance() {

        const { coin_id, logged_account } = this.state;

        if(logged_account) {

            actions.trigger_loading_update(0);
            api.get_balance_by_seed(coin_id, logged_account.seed, this._handle_get_balance_result);
        }else {

            actions.trigger_loading_update(100);
        }
    }

    _get_address_by_seed = () => {

        const { coin_id, logged_account } = this.state;

        if(logged_account) {

            const address = api.get_address_by_seed(coin_id, logged_account.seed);
            this.setState({_address: address});
        }
    };

    _get_send_transaction_info = () => {

        const { coin_id } = this.state;

        const send_transaction_info = api.get_send_transaction_info(coin_id);
        this.setState({_send_transaction_info: send_transaction_info});
    };

    _open_accounts_page = () => {

        const { _history } = this.state;
        _history.push("/accounts");
    };

    _handle_on_scanner_scan = (data) => {

        if (data) {
            this.setState({
                _send_address_input: data
            });

            this.setState({_is_scanner_dialog_open: false});
            actions.trigger_sfx("ui_camera-shutter");
        }
    };

    _handle_on_scanner_error = () => {

        actions.trigger_snackbar(t( "sentences.cannot load QR code scanner"));
        actions.jamy_update("sad");
        this._close_scanner_dialog();
    };

    _open_scanner_dialog = () => {

        this.setState({_is_scanner_dialog_open: true});
        actions.trigger_sfx("navigation_selection-complete-celebration");
    };

    _close_scanner_dialog = () => {

        this.setState({_is_scanner_dialog_open: false});
        actions.trigger_sfx("navigation_backward-selection-minimal");
    };

    _handle_send_address_input_change = (event) => {

        const _send_address_input = event.target.value;
        this.setState({_send_address_input, _send_address_input_error: false});
    }

    _handle_send_amount_input_change = (event) => {

        const _send_amount_input = event.target.value;
        this.setState({_send_amount_input, _send_amount_input_error: false});

    }

    _handle_send_message_input_change = (event) => {

        const { _send_transaction_info } = this.state;
        const _send_message_input = event.target.value;
        const _send_message_input_error = _send_message_input.length > _send_transaction_info.max_message_length;

        this.setState({_send_message_input, _send_message_input_error});

    }

    _confirm_and_open_coin_send_dialog = () => {

        const { _send_address_input, _send_amount_input } = this.state;
        const _send_address_input_error = !_send_address_input.length;
        const _send_amount_input_error = _send_amount_input < 0;
        const _is_confirmation_dialog_open = !_send_address_input_error && !_send_amount_input_error;

        this.setState({_is_confirmation_dialog_open, _send_address_input_error, _send_amount_input_error}, () => {

            if(_is_confirmation_dialog_open){

                this._estimate_transacation_fee();
                actions.trigger_sfx("alert_high-intensity");
            }else {

                actions.trigger_sfx("alert_error-01");
            }
        });
    }

    _clear_form = () => {

        this.setState({
            _send_address_input: "",
            _send_amount_input: "",
            _send_message_input: "",
            _send_address_input_error: false,
            _send_amount_input_error: false,
            _send_message_input_error: false
        });

    };

    _handle_send_transaction_result = (error, response) => {

        this.setState({_is_backdrop_shown: false, _is_confirmation_dialog_open: false});

        if(!error) {

            actions.trigger_snackbar(t( "sentences.transaction sent"));
            actions.trigger_sfx("hero_decorative-celebration-03");
            actions.jamy_update("happy");
            this._clear_form();
        }else {

            actions.trigger_snackbar(error);
            actions.trigger_sfx("alert_error-01");
            actions.jamy_update("angry");
        }
    }

    _handle_estimate_transacation_fee_result = (error, response) => {

        if(!error) {

            this.setState({_fee: response});
        }else {

            actions.trigger_snackbar(error);
        }
    }

    _send_transaction = () => {

        const { coin_id, logged_account, _send_address_input, _send_amount_input, _send_message_input } = this.state;
        api.send_transaction(coin_id, logged_account.seed, _send_address_input, _send_amount_input, _send_message_input, this._handle_send_transaction_result);
    }

    _estimate_transacation_fee = () => {

        const { coin_id, logged_account, _send_address_input, _send_amount_input, _send_message_input } = this.state;
        api.estimate_transaction_fee(coin_id, logged_account.seed, _send_address_input, _send_amount_input, _send_message_input, this._handle_estimate_transacation_fee_result);
    }

    _on_coin_send_dialog_confirm = () => {

        this.setState({_is_backdrop_shown: true});
        actions.trigger_sfx("ui_loading");
        actions.jamy_update("flirty");
        this._send_transaction();
    }

    _on_coin_send_dialog_close = () => {

        this.setState({_is_confirmation_dialog_open: false});
        actions.jamy_update("annoyed");
    }

    _on_coin_send_dialog_cancel = () => {

        this.setState({_is_confirmation_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
    }

    render() {

        const { classes, logged_account, we_know_if_logged, _address, _is_scanner_dialog_open, _is_confirmation_dialog_open, _send_transaction_info } = this.state;
        const { _send_address_input, _send_amount_input, _send_message_input, coin_id, _is_backdrop_shown } = this.state;
        const { _send_address_input_error, _send_amount_input_error, _send_message_input_error, _coin_balance, _fee } = this.state;
        const { selected_locales_code, selected_currency, coin_data } = this.state;

        const amount_sent_fiat = coin_data !== null ? _send_amount_input * coin_data.market_data.current_price[selected_currency.toLowerCase()]: 0;

        return (
            <div>
                <Backdrop className={classes.backdrop} open={_is_backdrop_shown}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                {
                    logged_account ?
                        <CoinSendDialog open={_is_confirmation_dialog_open}
                                        selected_locales_code={selected_locales_code}
                                        selected_currency={selected_currency}
                                        transaction={{
                                            send_from: _address,
                                            send_to: _send_address_input,
                                            memo: _send_message_input,
                                            amount_crypto: _send_amount_input,
                                            crypto_id: coin_id,
                                            fee_crypto: _fee,
                                        }}
                                        onConfirm={this._on_coin_send_dialog_confirm}
                                        cancel={this._on_coin_send_dialog_cancel}
                                        onClose={this._on_coin_send_dialog_close}/>:
                        null
                }
                <Dialog
                    className={classes.dialog}
                    open={_is_scanner_dialog_open}
                    onClose={this._close_scanner_dialog}
                    aria-labelledby="qr-code-scanner-dialog-title"
                    aria-describedby="qr-code-scanner-dialog-description"
                >
                    <DialogTitle id="qr-code-scanner-dialog-title">{t( "sentences.scan an address")}</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <QrReader
                            delay={300}
                            onError={this._handle_on_scanner_error}
                            onScan={this._handle_on_scanner_scan}
                            style={{ width: "100%" }}
                        />
                    </DialogContent>
                </Dialog>
                {we_know_if_logged ?
                    <Fade in>
                        <Container maxWidth="sm" className={classes.container}>
                            <Card>
                                <CardHeader
                                    title={t( "words.send", {FLC: true})}
                                />
                                <CardContent>

                                    {logged_account ?
                                        <div>
                                            { _send_transaction_info ?
                                                <form className={classes.root} noValidate autoComplete="off">
                                                    <TextField
                                                        className={classes.textField}
                                                        onChange={this._handle_send_address_input_change}
                                                        value={_send_address_input}
                                                        error={_send_address_input_error}
                                                        helperText={_send_address_input_error ? t( "sentences.incorrect address"): ""}
                                                        id="address"
                                                        label={t( "words.address", {FLC: true})}
                                                        type="text"
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        className={classes.textField}
                                                        onChange={this._handle_send_amount_input_change}
                                                        value={_send_amount_input}
                                                        error={_send_amount_input_error}
                                                        helperText={_send_amount_input_error ? t( "sentences.incorrect amount"): ""}
                                                        id="amount"
                                                        label={t( "words.amount", {FLC: true})}
                                                        type="number"
                                                        fullWidth
                                                    />
                                                    <span>
                                                        {price_formatter(amount_sent_fiat, selected_currency, selected_locales_code)}
                                                    </span>
                                                    <TextField
                                                        className={classes.textField}
                                                        onChange={this._handle_send_message_input_change}
                                                        value={_send_message_input}
                                                        error={_send_message_input_error}
                                                        helperText={_send_message_input_error ? t( "sentences.incorrect message"): ""}
                                                        disabled={_send_transaction_info.max_message_length === 0}
                                                        id="message"
                                                        label={t( "words.message", {FLC: true})}
                                                        type="text"
                                                        multiline
                                                        fullWidth
                                                    />
                                                </form>: null
                                            }
                                            {_coin_balance !== null ? <p>{t("components.coin_send.title", {balance: _coin_balance})}</p>: <p>{t("sentences.loading")}</p>}
                                            {_send_transaction_info !== null ? <p>{t("components.coin_send.body", {average_transaction_time: _send_transaction_info.average_transaction_time, max_message_length: _send_transaction_info.max_message_length, send_message_input_length: _send_message_input.length})}</p>: null}
                                        </div>:
                                        <div>
                                            <img className={classes.noAccountImage} src="/src/images/account.svg"/>
                                            <p>{t("sentences.you must open an account")}</p>
                                        </div>
                                    }
                                </CardContent>
                            </Card>
                            <div className={classes.underCardButtonContainer}>
                                {
                                    logged_account ?
                                        <Button className={classes.underCardButton} variant="contained" color="primary" onClick={this._confirm_and_open_coin_send_dialog}>
                                            {t( "words.send")}
                                        </Button>
                                        :
                                        <Button className={classes.underCardButton} color="primary" variant="contained" onClick={this._open_accounts_page}>
                                            {t( "sentences.open an account")}
                                        </Button>
                                }
                            </div>
                        </Container>
                    </Fade>:
                    null
                }
                {
                    logged_account ?
                        logged_account.name ?
                            <Grow in>
                                <Fab className={classes.fab} variant="extended" onClick={this._open_scanner_dialog}>
                                    <QrCodeScanIcon /> {t("components.coin_send.fab_scan")}
                                </Fab>
                            </Grow>: null: null
                }
            </div>
        );
    }
}

export default withStyles(styles)(CoinSend);
