import React from "react";
import { withStyles } from "@material-ui/core/styles"

import { t } from "../utils/t";

import Skeleton from "@material-ui/lab/Skeleton";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";

import FileCopyIcon from "@material-ui/icons/FileCopy";
import IconButton from "@material-ui/core/IconButton";

import get_svg_in_b64 from "../utils/svgToBase64";
import IdEmojiIcon from "../twemoji/react/1F194";
const id_emoji_svg = get_svg_in_b64(<IdEmojiIcon />);

import { HISTORY } from "../utils/constants";
import api from "../utils/api";
import price_formatter from "../utils/price-formatter";
import actions from "../actions/utils";
import api_crypto from "../utils/api-crypto";

import clipboard from "clipboard-polyfill";

const styles = theme => ({
    dialog: {
        [theme.breakpoints.down("xs")]: {
            "& .MuiDialog-container .MuiDialog-paper": {
                margin: "0px 0px",
                maxHeight: "100%",
                borderRadius: 0
            },
        }
    },
    dialogBody: {
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
    },
    tableCellBold: {
        fontWeight: "bold"
    },
    breakWord: {
        wordBreak: "break-all"
    },
    underline: {
        textDecoration: "underline"
    },
    copyButton: {
        marginLeft: theme.spacing(1),
    },
    displayInlineFlex: {
        display: "inline-flex",
    },
});


class TransactionDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            transaction: props.transaction,
            logged_account: props.logged_account,
            selected_locales_code: props.selected_locales_code,
            selected_currency: props.selected_currency,
            open: props.open,
            _address: null,
            _coin_data: null,
            _nacl_decrypted_memo: null,
            _history: HISTORY
        };
    };

    componentWillReceiveProps(new_props) {

        const { logged_account, transaction } = this.state;

        this.setState({...new_props}, () => {

            if(logged_account !== new_props.logged_account || transaction !== new_props.transaction) {

                this._get_coin_data();
                this._get_address_by_seed();
            }
        });
    };

    componentDidMount() {

        this._get_coin_data();
        this._get_address_by_seed();
    }

    _get_address_by_seed = () => {

        const { logged_account, transaction } = this.state;

        if(logged_account && transaction) {

            const address = api.get_address_by_seed(transaction.crypto_id, logged_account.seed, logged_account.hive_username);
            this.setState({_address: address, _nacl_decrypted_memo: null}, () => {

                this._try_decrypt_memo_with_nacl();
            });
        }
    };

    _handle_decrypt_memo_with_nacl_text_result = (error, result) => {

        if(!error && result) {

            this.setState({_nacl_decrypted_memo: result});
        }else {

            this.setState({_nacl_decrypted_memo: null});
        }
    };

    _try_decrypt_memo_with_nacl = () => {

        const { logged_account, transaction } = this.state;

        if(logged_account && transaction) {

            const public_key = api.get_public_key_by_seed(transaction.crypto_id, logged_account.seed);
            const private_key = api.get_private_key_by_seed(transaction.crypto_id, logged_account.seed);
            api_crypto.nacl_decrypt(transaction.memo, public_key, private_key, this._handle_decrypt_memo_with_nacl_text_result);
        }

    }

    _on_close = (event, account) => {

        this.props.onClose(event, account);
    };

    _on_cancel = (event, account) => {

        this.props.cancel(event, account);
    };

    _get_coin_data() {

        const { transaction } = this.state;

        if(transaction) {

            this.setState({_coin_data: null}, () => {

                api.get_coin_data(transaction.crypto_id, this._set_coin_data);
            });
        }
    }

    _set_coin_data = (error, data) => {

        if(!error && data) {

            this.setState({_coin_data: data});
        }else {

            actions.jamy_update("sad");
            actions.trigger_snackbar(error);
        }
    };

    _open_link = (event, link) => {

        actions.trigger_sfx("state-change_confirm-up");
        const { _history } = this.state;
        _history.push(link);
    };

    _copy_send_from_public_key = (event, send_from_public_key) => {

        if(send_from_public_key !== null) {

            clipboard.writeText(send_from_public_key).then(
                function () {

                    actions.trigger_snackbar(t( "sentences.public key successfully copied"));
                    actions.trigger_sfx("navigation_forward-selection");
                    actions.jamy_update("happy");
                },
                function () {

                    actions.trigger_snackbar(t( "sentences.cannot copy this public key"));
                    actions.trigger_sfx("navigation_backward-selection");
                    actions.jamy_update("annoyed");
                }
            );
        }else {

            actions.trigger_snackbar(t( "sentences.cannot copy a null public key"));
            actions.trigger_sfx("navigation_backward-selection");
            actions.jamy_update("annoyed");
        }
    };

    render() {

        const { classes, transaction, selected_currency, selected_locales_code, open, _coin_data, _address, _nacl_decrypted_memo } = this.state;

        const amount_sent_fiat = _coin_data !== null ? transaction.amount_crypto * _coin_data.market_data.current_price[selected_currency.toLowerCase()]: 0;
        const amount_fee_fiat = _coin_data !== null ? transaction.fee * _coin_data.market_data.current_price[selected_currency.toLowerCase()]: 0;

        return (
            <Dialog
                open={open}
                onClose={(event) => {this._on_close(event, transaction)}}
                className={classes.dialog}
                aria-labelledby="show-transaction-memo-dialog-title"
                aria-describedby="show-transaction-memo-dialog-description"
            >
                {
                    Boolean(transaction) ?
                        <div className={classes.dialogBody}>
                            <DialogTitle id="show-transaction-memo-dialog-title" className={classes.breakWord}>
                                <img src={id_emoji_svg} className="emoji" style={{marginRight: 8}}/>
                                {t( "components.transaction_dialog.title", {transaction_id: transaction.id})}
                            </DialogTitle>
                            <DialogContent className={classes.dialogBody} >
                                <DialogContentText id="show-transaction-memo-dialog-description">
                                    <Table>
                                        <Table aria-label="main-info-table">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{ t( "components.transaction_dialog.send_at")}</TableCell>
                                                    <TableCell align="right">{new Intl.DateTimeFormat(selected_locales_code, {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"}).format(new Date(transaction.timestamp))}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{ t( "components.transaction_dialog.send_from")}</TableCell>
                                                    <TableCell align="right">{transaction.send_from}</TableCell>
                                                </TableRow>
                                                {
                                                    typeof transaction.send_from_public_key !== "undefined" ?
                                                    <TableRow>
                                                        <TableCell align="left" className={classes.tableCellBold}>{ t( "components.transaction_dialog.send_from_public_key")}</TableCell>
                                                        <TableCell align="right">
                                                            <div className={classes.displayInlineFlex}>
                                                                <span>{transaction.send_from_public_key}</span>
                                                                {_address === transaction.send_to ?
                                                                    <IconButton
                                                                        className={classes.copyButton}
                                                                        size="small"
                                                                        aria-label={t( "sentences.copy public key")}
                                                                        onClick={(event) => this._copy_send_from_public_key(event, transaction.send_from_public_key)}
                                                                        edge="end"
                                                                    >
                                                                        <FileCopyIcon fontSize="inherit" />
                                                                    </IconButton>: null
                                                                }
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>: null
                                                }
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{ t( "components.transaction_dialog.send_to")}</TableCell>
                                                    <TableCell align="right">{transaction.send_to}</TableCell>
                                                </TableRow>
                                                {
                                                    typeof transaction.send_to_public_key !== "undefined" ?
                                                    <TableRow>
                                                        <TableCell align="left" className={classes.tableCellBold}>{ t( "components.transaction_dialog.send_to_public_key")}</TableCell>
                                                        <TableCell align="right">{transaction.send_to_public_key}</TableCell>
                                                    </TableRow>: null
                                                }
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{ t( "components.transaction_dialog.memo")}</TableCell>
                                                    <TableCell align="right" className={classes.breakWord}>
                                                        {transaction.memo}
                                                        {_nacl_decrypted_memo ?
                                                            <span><br/>NaCl: "<b>{_nacl_decrypted_memo}</b>"</span>
                                                            : null
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{ t( "components.transaction_dialog.amount")}</TableCell>
                                                    {_coin_data ?
                                                        <TableCell align="right">{price_formatter(parseFloat(transaction.amount_crypto), _coin_data.symbol, selected_locales_code)} ({price_formatter(amount_sent_fiat, selected_currency, selected_locales_code)})</TableCell>
                                                        : <TableCell align="right"><Skeleton /></TableCell>
                                                    }
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{ t( "components.transaction_dialog.fees")}</TableCell>
                                                    {_coin_data ?
                                                        <TableCell align="right">{price_formatter(parseFloat(transaction.fee), _coin_data.symbol, selected_locales_code)} ({price_formatter(amount_fee_fiat, selected_currency, selected_locales_code)})</TableCell>
                                                        : <TableCell align="right"><Skeleton /></TableCell>
                                                    }
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{ t( "components.transaction_dialog.crypto_id")}</TableCell>
                                                    <TableCell align="right" className={classes.underline} onClick={(event) => {this._open_link(event, "/coins/" + transaction.crypto_id + "/transactions")}}>{transaction.crypto_id}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Table>
                                </DialogContentText>
                            </DialogContent>
                        </div>: null
                }

                <DialogActions>
                    {
                        transaction ?
                            _address === transaction.send_to ?
                                <Button onClick={(event) => {this._open_link(event, `/coins/${transaction.crypto_id}/send/${transaction.send_from}`)}} color="primary">
                                    {t("words.send back")}
                                </Button> :
                                <Button onClick={(event) => {this._open_link(event, `/coins/${transaction.crypto_id}/send/${transaction.send_to}`)}}>
                                    {t("words.send again")}
                                </Button>
                        : null
                    }
                    <Button onClick={(event) => {this._on_cancel(event, transaction)}}  color="primary" autoFocus>
                        {t("words.close")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(TransactionDialog);
