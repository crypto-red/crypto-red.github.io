import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
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

const styles = theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 0)
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
            backgroundColor: theme.palette.primary.action,
        },
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    dialog: {
        "& .MuiDialog-container .MuiDialog-paper": {
            width: 600,
        },
        [theme.breakpoints.down("sm")]: {
            "& .MuiDialog-container .MuiDialog-paper": {
                margin: "24px 0px",
                borderRadius: 0,
                width: "100vw",
            },
        }
    },
    dialogContent: {
        padding: theme.spacing(0)
    }
});


class CoinSend extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coin_id: props.coin_id,
            coin_data: props.coin_data,
            logged_account: props.logged_account,
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
    }

    componentWillReceiveProps(new_props) {

        this.setState(new_props, () => {

            this._get_address_by_seed();
            this._get_coin_balance();
            this._get_send_transaction_info();
        });
    }

    _handle_get_balance_result = (error, result) => {

        if(!error) {

            this.setState({_coin_balance: result});
        }else {

            console.log(error);
        }
    };


    _get_coin_balance() {

        const { coin_id, logged_account } = this.state;

        if(logged_account) {

            api.get_balance_by_seed(coin_id, logged_account.seed, this._handle_get_balance_result);
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

            this._close_scanner_dialog();
        }
    };

    _handle_on_scanner_error = () => {

        actions.trigger_snackbar("Cannot load QR Code scanner");
        this._close_scanner_dialog();
    };

    _open_scanner_dialog = () => {

        this.setState({_is_scanner_dialog_open: true});
    };

    _close_scanner_dialog = () => {

        this.setState({_is_scanner_dialog_open: false});
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

            this._estimate_transacation_fee();
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

            actions.trigger_snackbar("Transaction sent");
            this._clear_form();
        }else {

            actions.trigger_snackbar(error);
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
        this._send_transaction();
    }

    _on_coin_send_dialog_close = () => {


        this.setState({_is_confirmation_dialog_open: false});
    }

    render() {

        const { classes, logged_account, _address, _is_scanner_dialog_open, _is_confirmation_dialog_open, _send_transaction_info } = this.state;
        const { _send_address_input, _send_amount_input, _send_message_input, coin_id, _is_backdrop_shown } = this.state;
        const { _send_address_input_error, _send_amount_input_error, _send_message_input_error, _coin_balance, _fee } = this.state;
        const { selected_locales_code, selected_currency } = this.state;

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
                    <DialogTitle id="qr-code-scanner-dialog-title">Scan an address</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <QrReader
                            delay={300}
                            onError={this._handle_on_scanner_error}
                            onScan={this._handle_on_scanner_scan}
                            style={{ width: "100%" }}
                        />
                    </DialogContent>
                </Dialog>
                <Container maxWidth="sm" className={classes.container}>
                    <Fade in>
                        <Card>
                            <CardHeader
                                title="Send"
                            />
                            {
                                logged_account ?
                                    <CardContent>
                                        {_coin_balance !== null ? <p>Balance: {_coin_balance}</p>: <p>Loading...</p>}
                                        {_send_transaction_info !== null ? <p>The average transaction time is {_send_transaction_info.average_transaction_time}, and the message is limited to {_send_transaction_info.max_message_length} characters ({_send_message_input.length}). Fees will be calculated in the next step.</p>: null}
                                        { _send_transaction_info ?
                                            <form className={classes.root} noValidate autoComplete="off">
                                                <TextField
                                                    autoFocus
                                                    className={classes.textField}
                                                    onChange={this._handle_send_address_input_change}
                                                    value={_send_address_input}
                                                    error={_send_address_input_error}
                                                    helperText={_send_address_input_error ? "Incorrect address": ""}
                                                    id="address"
                                                    label="Address"
                                                    type="text"
                                                    fullWidth
                                                />
                                                <TextField
                                                    className={classes.textField}
                                                    onChange={this._handle_send_amount_input_change}
                                                    value={_send_amount_input}
                                                    error={_send_amount_input_error}
                                                    helperText={_send_amount_input_error ? "Incorrect amount": ""}
                                                    id="amount"
                                                    label="Amount"
                                                    type="number"
                                                    fullWidth
                                                />
                                                <TextField
                                                    className={classes.textField}
                                                    onChange={this._handle_send_message_input_change}
                                                    value={_send_message_input}
                                                    error={_send_message_input_error}
                                                    helperText={_send_message_input_error ? "Incorrect message": ""}
                                                    disabled={_send_transaction_info.max_message_length === 0}
                                                    id="message"
                                                    label="Message"
                                                    type="text"
                                                    multiline
                                                    fullWidth
                                                />
                                                <Button fullWidth variant="contained"  color="primary" onClick={this._confirm_and_open_coin_send_dialog}>SEND</Button>
                                            </form>: null
                                        }
                                    </CardContent>:
                                    <CardContent>
                                        <Button fullWidth color="primary" variant="contained" onClick={this._open_accounts_page}>
                                            Open an account
                                        </Button>
                                    </CardContent>
                            }
                        </Card>
                    </Fade>
                </Container>
                {
                    logged_account ?
                        logged_account.name ?
                            <Grow in>
                                <Fab className={classes.fab} onClick={this._open_scanner_dialog}>
                                    <QrCodeScanIcon />
                                </Fab>
                            </Grow>: null: null
                }
            </div>
        );
    }
}

export default withStyles(styles)(CoinSend);
