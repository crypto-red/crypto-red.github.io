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

import { HISTORY } from "../utils/constants";
import api from "../utils/api";

const styles = theme => ({
    dialog: {
        [theme.breakpoints.down("sm")]: {
            "& .MuiDialog-container .MuiDialog-paper": {
                margin: "24px 0px",
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
    underline: {
        textDecoration: "underline"
    }
});


class AddressDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coin_id: props.coin_id,
            logged_account: props.logged_account,
            open: props.open,
            _address: null,
            _public_key: null,
            _private_key: null,
            _history: HISTORY
        };
    };

    componentWillReceiveProps(new_props) {

        const { coin_id, logged_account } = this.state;

        this.setState({...new_props}, () => {

            if(logged_account) {

                if( coin_id !== new_props.coin_id || logged_account.name !== new_props.logged_account ) {

                    this._get_address_and_keys_data();
                }
            }
        });
    };

    componentDidMount() {

        this._get_address_and_keys_data();
    }

    _reset_state = () => {

        setTimeout(() => {

            this.setState({
                _address: null,
                _public_key: null,
                _private_key: null,
            });

        }, 500);
    };

    _on_close = (event, account) => {

        this._reset_state();
        this.props.onClose(event, account);
    };

    _on_cancel = (event, account) => {

        this._reset_state();
        this.props.cancel(event, account);
    };

    _get_address_and_keys_data() {

        const { coin_id, logged_account } = this.state;

        if(coin_id && logged_account) {

            const _address = api.get_address_by_seed(coin_id, logged_account.seed);
            const _public_key = api.get_public_key_by_seed(coin_id, logged_account.seed);
            const _private_key = api.get_private_key_by_seed(coin_id, logged_account.seed);

            this.setState({_address, _public_key, _private_key});
        }
    }

    _open_link = (event, link) => {

        const { _history } = this.state;
        _history.push(link);
    };

    render() {

        const { classes, _address, _public_key, _private_key, coin_id, open } = this.state;

        return (
            <Dialog
                open={open}
                onClose={(event) => {this._on_close(event, coin_id)}}
                className={classes.dialog}
                aria-labelledby="show-address-and-keys-dialog-title"
                aria-describedby="show-address-and-keys-dialog-description"
            >
                {
                    (_address && _public_key && _private_key) ?
                        <div className={classes.dialogBody}>
                            <DialogTitle id="show-address-and-keys-dialog-title" className={classes.breakWord}>{t( "components.address_dialog.title", {coin_id})}</DialogTitle>
                            <DialogContent className={classes.dialogBody}>
                                <DialogContentText id="show-address-and-keys-dialog-description">
                                    <Table>
                                        <Table aria-label="main-info-table">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{t( "words.address", {}, {FLC: true})}</TableCell>
                                                    <TableCell align="right">{_address}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{t( "words.public key", {}, {FLC: true})}</TableCell>
                                                    <TableCell align="right">{_public_key}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{t( "words.private key", {}, {FLC: true})}</TableCell>
                                                    <TableCell align="right">{_private_key}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.tableCellBold}>{t( "words.crypto id", {}, {FLC: true})}</TableCell>
                                                    <TableCell align="right" className={classes.underline} onClick={(event) => {this._open_link(event, "/coins/" + coin_id + "/transactions")}}>{coin_id}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Table>
                                </DialogContentText>
                            </DialogContent>
                        </div>: null
                }

                <DialogActions>
                    <Button onClick={(event) => {this._on_cancel(event, coin_id)}} color="primary" autoFocus>
                        {t( "words.close")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AddressDialog);
