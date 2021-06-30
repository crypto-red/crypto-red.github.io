import React from "react";
import { withStyles } from "@material-ui/core/styles"

import { t } from "../utils/t";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { red } from "@material-ui/core/colors";
import actions from "../actions/utils";

const styles = theme => ({
    red: {
        color: red[500]
    }
});


class AccountDialogDelete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            account: props.account,
            open: props.open,
            _account_name_input: "",
            _is_confirmation_disabled: true
        };
    };

    componentWillReceiveProps(nextProps, nextContext) {

        this.setState({...nextProps});
    }

    _on_accept = (event, account) => {

        if(!this.state._is_confirmation_disabled) {

            actions.trigger_sfx("state-change_confirm-up");
            this.props.accept(event, account);
        }
    };

    _on_cancel = (event, account) => {

        actions.trigger_sfx("state-change_confirm-down");
        this.props.cancel(event, account);
    };

    _handle_account_name_input_change = (event) => {

        const _account_name_input = event.target.value;
        const { account } = this.state;
        const _is_confirmation_disabled = !(account.name.toLowerCase() === _account_name_input.toLowerCase());
        this.setState({_account_name_input, _is_confirmation_disabled});
    };

    _handle_key_down_input = (event) => {

        if(event.keyCode === 13){

            const { account } = this.state;
            this._on_accept(event, account);
        }
    };

    render() {

        const { classes, account, open, _is_confirmation_disabled } = this.state;

        return (
            <Dialog
                open={open}
                onClose={(event) => {this.props.onClose(event, account)}}
                aria-labelledby="delete-account-dialog-title"
                aria-describedby="delete-account-dialog-description"
            >
                {Boolean(account) ?
                    <div>
                        <DialogTitle id="delete-account-dialog-title">{t("components.account_dialog_delete.title", {account_name: account.name})}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-account-dialog-description">
                                {t("components.account_dialog_delete.cannot_be_undone", {account_name: account.name})}
                                <br />
                                {t("components.account_dialog_delete.repeat_name")}
                            </DialogContentText>
                            <TextField
                                onChange={this._handle_account_name_input_change}
                                onKeyDown={this._handle_key_down_input}
                                autoFocus
                                id="name"
                                label={t( "words.name", {}, {FLC: true})}
                                type="text"
                                fullWidth
                            />
                        </DialogContent>
                    </div>: null
                }
                <DialogActions>
                    <Button onClick={(event) => {this._on_cancel(event, account)}} color="primary">
                        {t("words.cancel")}
                    </Button>
                    <Button onClick={(event) => {this._on_accept(event, account)}} color="primary" disabled={_is_confirmation_disabled} autoFocus>
                        {t("words.delete")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AccountDialogDelete);
