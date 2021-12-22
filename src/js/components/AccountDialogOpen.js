import React from "react";
import { withStyles } from "@material-ui/core/styles"

import { t } from "../utils/t";

import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";

import QRCodeScanDialog from "../components/QRCodeScanDialog";
import DialogCloseButton from "../components/DialogCloseButton";

import QrCodeIcon from "../icons/QrCode";
import actions from "../actions/utils";

const styles = theme => ({
    backdrop: {
        color: "#fff",
        zIndex: "1400 !important"
    },
});


class AccountDialogOpen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            account: props.account,
            open: props.open,
            error: props.error,
            _is_qr_dialog_open: false,
            _account_password_input: "",
            _loading: false,
            _persistent: false,
        };
    };

    componentWillReceiveProps(new_props) {

        if(new_props.open === false) {

            this.setState({_loading: false});
        }
        this.setState(new_props);
    }

    _on_complete = (event) => {

        const { _account_password_input, account, _persistent } = this.state;

        this.setState({_account_password_input: "", _persistent: false, _loading: true});
        actions.trigger_sfx("ui_loading");
        this.props.onComplete(event, account, _account_password_input, _persistent);
    };

    _handle_account_password_input_change = (event) => {

        const _account_password_input = event.target.value;
        this.setState({_account_password_input});
    };

    _handle_key_down_input = (event) => {

        if(event.keyCode === 13){

            this._on_complete(event);
        }
    };

    _handle_persistent_checkbox_change = (event) => {

        const _persistent = event.target.checked;
        this.setState({_persistent});
        actions.trigger_sfx("ui_tap-variant-01");

        if(_persistent) {

            actions.jamy_update("flirty", 3000);
            actions.trigger_snackbar(t( "components.account_dialog_open.warning_password_stored_browser"), 3500);
        }
    };

    _on_cancel = (event) => {

        setTimeout(() => {

            const state = {
                _account_password_input: "",
                _persistent: false,
            };

            this.setState(state);

        }, 500);
        this.props.cancel(event);
    };

    _handle_qr_dialog_open = (event) => {

        this.setState({_is_qr_dialog_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _handle_qr_dialog_close = (event) => {

        this.setState({_is_qr_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
    };

    _set_password = (password) => {

        this.setState({_account_password_input: password});
    };

    render() {

        const { classes, account, open, error, _account_password_input, _loading, _persistent, _is_qr_dialog_open } = this.state;

        return (
            <div>
                <Backdrop className={classes.backdrop} open={_loading && !error}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <QRCodeScanDialog
                    disablePortal
                    open={_is_qr_dialog_open}
                    onClose={this._handle_qr_dialog_close}
                    on_scan={(password) => this._set_password(password)}/>
                <Dialog
                    disablePortal
                    open={open}
                    onClose={(event) => {this.props.onClose(event, account)}}
                    aria-labelledby="open-account-dialog-title"
                    aria-describedby="open-account-dialog-description"
                >
                    {Boolean(account) ?
                        <div>
                            <DialogTitle id="open-account-dialog-title">{t("components.account_dialog_open.title", {account_name: account.name})}</DialogTitle>
                            <DialogCloseButton onClick={(event) => {this.props.onClose(event, account)}} />
                            <DialogContent>
                                <DialogContentText id="open-account-dialog-description">
                                    {t( "components.account_dialog_open.open_account", {account_name: account.name})}
                                    <br />
                                    {t( "components.account_dialog_open.write_password")}
                                </DialogContentText>
                                <TextField
                                    onChange={this._handle_account_password_input_change}
                                    onKeyDown={this._handle_key_down_input}
                                    value={_account_password_input}
                                    error={error}
                                    helperText={error ? t( "sentences.wrong password"): ""}
                                    autoFocus
                                    id="password"
                                    label={t( "words.password", {FLC: true})}
                                    type="password"
                                    fullWidth
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={_persistent} onChange={this._handle_persistent_checkbox_change} name="persistent" />}
                                    label={t( "sentences.stay logged")}
                                />
                            </DialogContent>
                        </div>: null
                    }
                    <DialogActions>
                        <IconButton onClick={(event) => {this._handle_qr_dialog_open(event)}} color="primary" component="span">
                            <QrCodeIcon />
                        </IconButton>
                        <Button onClick={(event) => {this._on_complete(event)}} color="primary" autoFocus>
                            {t( "words.open")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(AccountDialogOpen);
