import React from "react";
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState({...new_props}, () => {

            this._get_coin_data();
        });
    };

    componentDidMount() {

        this._get_coin_data();
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

    render() {

        const { classes, transaction, selected_currency, selected_locales_code, open, _coin_data } = this.state;

        const amount_sent_fiat = _coin_data !== null ? transaction.amount_crypto * _coin_data.market_data.current_price[selected_currency.toLowerCase()]: 0;
        const amount_fee_fiat = _coin_data != null ? transaction.fee_crypto * _coin_data.market_data.current_price[selected_currency.toLowerCase()]: 0;

        return (
            <Dialog
                open={open}
                onClose={this.props.onClose}
            >
                {
                    Boolean(transaction) ?
                        <div>
                            <DialogTitle>Confirm transaction</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    <Table>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>Send from</TableCell>
                                                    <TableCell align="right">{transaction.send_from}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>Send to</TableCell>
                                                    <TableCell align="right">{transaction.send_to}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>Memo</TableCell>
                                                    <TableCell align="right">{transaction.memo}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>Amount</TableCell>
                                                    {_coin_data ?
                                                        <TableCell align="right">{price_formatter(parseFloat(transaction.amount_crypto), _coin_data.symbol, selected_locales_code)} ({price_formatter(amount_sent_fiat, selected_currency, selected_locales_code)})</TableCell>
                                                        : null
                                                    }
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>Fee</TableCell>
                                                    {_coin_data ?
                                                        <TableCell align="right">{price_formatter(parseFloat(transaction.fee_crypto), _coin_data.symbol, selected_locales_code)} ({price_formatter(amount_fee_fiat, selected_currency, selected_locales_code)})</TableCell>
                                                        : null
                                                    }
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>Crypto id</TableCell>
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
                    <Button onClick={this.props.onClose} autoFocus>
                        Close
                    </Button>
                    <Button onClick={this.props.onConfirm} variant="contained"  color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(CoinSendDialog);