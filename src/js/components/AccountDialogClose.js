import React from "react";
import { withStyles } from "@material-ui/core/styles"

import { t } from "../utils/t";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import ReactTimeAgo from "react-time-ago";
import actions from "../actions/utils";

const styles = theme => ({

});

class AccountDialogClose extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            account: props.account,
            open: props.open,
        };
    };

    componentWillReceiveProps(nextProps, nextContext) {

        this.setState({...nextProps});
    }

    _on_cancel = (event, account) => {

        actions.trigger_sfx("state-change_confirm-down");
        this.props.cancel(event, account)
    };

    _on_accept = (event, account) => {

        actions.trigger_sfx("state-change_confirm-up");
        this.props.accept(event, account)
    };

    render() {

        const { classes, account, open } = this.state;

        return (
            <Dialog
                open={open}
                onClose={(event) => {this.props.onClose(event, account)}}
                aria-labelledby="close-account-dialog-title"
                aria-describedby="close-account-dialog-description"
            >
                {Boolean(account) ?
                    <div>
                        <DialogTitle id="close-account-dialog-title">
                            {t( "components.account_dialog_close.close", {account_name: account.name})}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="close-account-dialog-description">
                                {t( "components.account_dialog_close.opened", {time_ago: ""})} <ReactTimeAgo date={account.timestamp} locale={document.documentElement.lang}/>
                            </DialogContentText>
                        </DialogContent>
                    </div>: null
                }
                <DialogActions>
                    <Button onClick={(event) => {this._on_cancel(event, account)}} color="primary">
                        {t( "words.cancel" )}
                    </Button>
                    <Button onClick={(event) => {this._on_accept(event, account)}} color="primary" autoFocus>
                        {t( "words.close" )}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AccountDialogClose);
