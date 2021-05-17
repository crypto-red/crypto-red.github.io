import React from "react";
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextField from '@material-ui/core/TextField';
import {red} from "@material-ui/core/colors";

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

    _accept = (event, account) => {

        const { _is_confirmation_disabled } = this.state;

        if(!_is_confirmation_disabled) {

            this.props.accept(event, account);
        }
    };

    _handle_account_name_input_change = (event) => {

        const _account_name_input = event.target.value;
        const { account } = this.state;
        const _is_confirmation_disabled = !Boolean(account.name.toLowerCase() == _account_name_input.toLowerCase());
        this.setState({_account_name_input, _is_confirmation_disabled});
    };

    _handle_key_down_input = (event) => {

        if(event.keyCode == 13){

            const { account } = this.state;
            this._accept(event, account);
        }
    };

    render() {

        const { classes, account, open, _is_confirmation_disabled } = this.state;

        return (
            <Dialog
                open={open}
                onClose={(event) => {this.props.cancel(event, account)}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {Boolean(account) ?
                    <div>
                        <DialogTitle id="alert-dialog-title">Delete {account.name}?</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                This action <b className={classes.red}>CANNOT</b> be undone. This will delete the <b>{account.name}</b> account, wallets, and notes permanently.
                                <br />
                                Please Type in the name of the account to confirm.
                            </DialogContentText>
                            <TextField
                                onChange={this._handle_account_name_input_change}
                                onKeyDown={this._handle_key_down_input}
                                autoFocus
                                id="name"
                                label="Name"
                                type="text"
                                fullWidth
                            />
                        </DialogContent>
                    </div>: null
                }
                <DialogActions>
                    <Button onClick={(event) => {this.props.cancel(event, account)}} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={(event) => {this._accept(event, account)}} variant="contained" color="primary" disabled={_is_confirmation_disabled}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AccountDialogDelete);