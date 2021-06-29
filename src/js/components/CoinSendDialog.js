import React from "react";
import { withStyles } from "@material-ui/core/styles"

import { t } from "../utils/t";

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

import api from "../utils/api";
import price_formatter from "../utils/price-formatter";

const styles = theme => ({
    tableCellBold: {
        fontWeight: "bold"
    },
    breakWord: {
        wordBreak: "break-all"
    },
    dialog: {
        [theme.breakpoints.down("sm")]: {
            "& .MuiDialog-container .MuiDialog-paper": {
                margin: "24px 0px",
                borderRadius: 0
            },
        }
    }
});


class CoinSendDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            transaction: props.transaction,
            open: props.open,
            selected_locales_code: props.selected_locales_code,
            selected_currency: props.selected_currency,
            _coin_data: null,
            _address: null
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState({...new_props}, () => {

            this._get_coin_data();
            this._get_address_by_seed();
        });
    };

    componentDidMount() {

        this._get_coin_data();
        this._get_address_by_seed();
    }

    _on_close = (event, account) => {

        this.props.onClose(event, account);
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

        this.setState({_coin_data: data});
    };

    _get_address_by_seed = () => {

        const { transaction, logged_account } = this.state;

        if(logged_account && transaction) {

            const address = api.get_address_by_seed(transaction.crypto_id, logged_account.seed);
            this.setState({_address: address});
        }
    };

    render() {

        const { classes, transaction, selected_currency, selected_locales_code, open, _coin_data } = this.state;

        const amount_sent_fiat = _coin_data !== null ? transaction.amount_crypto * _coin_data.market_data.current_price[selected_currency.toLowerCase()]: 0;
        const amount_fee_fiat = _coin_data != null ? transaction.fee_crypto * _coin_data.market_data.current_price[selected_currency.toLowerCase()]: 0;

        return (
            <Dialog
                open={open}
                onClose={this.props.onClose}
                className={classes.dialog}
            >
                {
                    Boolean(transaction) ?
                        <div>
                            <DialogTitle>{t( "sentences.send this transaction")}</DialogTitle>
                            <DialogContent dividers>
                                <DialogContentText>
                                    <Table>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{t("words.send from", {}, {FLC: true})}</TableCell>
                                                    <TableCell align="right" className={classes.breakWord}>{transaction.send_from}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{t("words.send to", {}, {FLC: true})}</TableCell>
                                                    <TableCell align="right" className={classes.breakWord}>{transaction.send_to}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{t("words.memo", {}, {FLC: true})}</TableCell>
                                                    <TableCell align="right" className={classes.breakWord}>{transaction.memo}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{t("words.amount", {}, {FLC: true})}</TableCell>
                                                    {_coin_data ?
                                                        <TableCell align="right">{price_formatter(parseFloat(transaction.amount_crypto), _coin_data.symbol, selected_locales_code)} ({price_formatter(amount_sent_fiat, selected_currency, selected_locales_code)})</TableCell>
                                                        : null
                                                    }
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{t("words.fee", {}, {FLC: true})}</TableCell>
                                                    {_coin_data ?
                                                        <TableCell align="right">{price_formatter(parseFloat(transaction.fee_crypto), _coin_data.symbol, selected_locales_code)} ({price_formatter(amount_fee_fiat, selected_currency, selected_locales_code)})</TableCell>
                                                        : null
                                                    }
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{t("words.crypto id", {}, {FLC: true})}</TableCell>
                                                    <TableCell align="right">{transaction.crypto_id}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Table>
                                </DialogContentText>
                            </DialogContent>
                        </div>: null
                }

                <DialogActions>
                    <Button onClick={this.props.cancel} color="primary">
                        {t( "words.cancel")}
                    </Button>
                    <Button onClick={this.props.onConfirm} color="primary" autoFocus>
                        {t( "words.confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(CoinSendDialog);
