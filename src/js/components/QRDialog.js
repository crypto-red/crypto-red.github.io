import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import QrReader from "react-qr-reader"
import actions from "../actions/utils";
import {DialogTitle} from "@material-ui/core";

const styles = theme => ({
    dialog: {
        "& .MuiDialog-container .MuiDialog-paper": {
            width: 600,
        },
        [theme.breakpoints.down("xs")]: {
            "& .MuiDialog-container .MuiDialog-paper": {
                margin: "0px 0px",
                maxHeight: "100%",
                borderRadius: 0,
            },
        }
    },
    dialogContent: {
        padding: theme.spacing(0)
    },
});


class QRDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            open: props.open,
            _is_scanner_dialog_open: false,
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    _handle_on_scanner_scan = (data) => {

        if (data) {

            this.props.on_scan(data);
            actions.trigger_sfx("ui_camera-shutter");
            this.props.onClose();
        }
    };

    _handle_on_scanner_error = () => {

        actions.trigger_snackbar(t( "sentences.cannot load QR code scanner"));
        actions.jamy_update("sad");
        this.props.onClose();
    };

    _close_scanner_dialog = () => {

        this.props.onClose();
        actions.trigger_sfx("navigation_backward-selection-minimal");
    };

    render() {

        const { classes, open } = this.state;

        return (
            <Dialog
                className={classes.dialog}
                open={open}
                onClose={this._close_scanner_dialog}
                aria-labelledby="qr-code-scanner-dialog-title"
                aria-describedby="qr-code-scanner-dialog-description"
            >
                <DialogTitle>{t("components.qr_dialog.title")}</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <QrReader
                        delay={300}
                        onError={this._handle_on_scanner_error}
                        onScan={this._handle_on_scanner_scan}
                        style={{ width: "100%" }}
                    />
                </DialogContent>
            </Dialog>
        );
    }
}

export default withStyles(styles)(QRDialog);
