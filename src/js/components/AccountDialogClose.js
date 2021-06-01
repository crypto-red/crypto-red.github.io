import React from "react";
import { withStyles } from "@material-ui/core/styles"

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import TimeAgo from "react-timeago"

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

    render() {

        const { classes, account, open } = this.state;

        return (
            <Dialog
                open={open}
                onClose={(event) => {this.props.cancel(event, account)}}
                aria-labelledby="close-account-dialog-title"
                aria-describedby="close-account-dialog-description"
            >
                {Boolean(account) ?
                    <div>
                        <DialogTitle id="close-account-dialog-title">Close {account.name}?</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="close-account-dialog-description">
                                This account was opened <TimeAgo date={account.timestamp} />
                            </DialogContentText>
                        </DialogContent>
                    </div>: null
                }
                <DialogActions>
                    <Button onClick={(event) => {this.props.cancel(event, account)}} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={(event) => {this.props.accept(event, account)}} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AccountDialogClose);
