import React from "react";
import { withStyles } from "@material-ui/core/styles"

import { t } from "../utils/t";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { red } from "@material-ui/core/colors";
import actions from "../actions/utils";

const styles = theme => ({
    red: {
        color: red[500]
    }
});


class AccountDialogBackup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            account: props.account,
            open: props.open,
            _shown: false
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState({...new_props});
    }

    _show = () => {

        this.setState({_shown: true});
    };

    _on_close = (event, account) => {

        actions.trigger_sfx("state-change_confirm-up");
        setTimeout(() => {this.setState({_shown: false});}, 500);
        this.props.onClose(event, account);
    };

    _on_cancel = () => {

        actions.trigger_sfx("state-change_confirm-down");
        setTimeout(() => {this.setState({_shown: false});}, 500);
        this.props.cancel(event, account);
    };

    render() {

        const { classes, account, open, _shown } = this.state;

        return (
            <Dialog
                open={open}
                onClose={(event) => {this.props.onClose(event, account)}}
                aria-labelledby="backup-account-dialog-title"
                aria-describedby="backup-account-dialog-description"
            >
                {Boolean(account) ?
                    <div>
                        <DialogTitle id="backup-account-dialog-title">
                            {t( "components.account_dialog_backup.seed", {account_name: account.name})}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="backup-account-dialog-description">
                                <p className={classes.red}>{t( "components.account_dialog_backup.store", {account_name: account.name})}</p>
                                {
                                    _shown ?
                                        <p>{account.seed}</p>:
                                        <Button color="primary" fullWidth onClick={this._show}>
                                            {t( "words.show" )}
                                        </Button>
                                }
                            </DialogContentText>
                        </DialogContent>
                    </div>: null
                }
                <DialogActions>
                    <Button onClick={(event) => {this._on_close(event, account)}}  color="primary" autoFocus>
                        {t( "words.close" )}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AccountDialogBackup);
