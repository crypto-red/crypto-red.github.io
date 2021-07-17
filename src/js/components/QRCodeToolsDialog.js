import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import TextField from "@material-ui/core/TextField";
import actions from "../actions/utils";
import {DialogTitle} from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import QRCodeScanDialog from "../components/QRCodeScanDialog";
import Base64QRCodeDialog from "../components/Base64QRCodeDialog";

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


class QRCodeToolsDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            open: props.open,
            _is_base64_qr_code_dialog_open: false,
            _is_qr_code_scan_dialog_open: false,
            _qr_code_text: ""
        };

    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    _set_scan_result = (value) => {

        if (value) {

            this.setState({_qr_code_text: value})
        }
    };

    _on_qr_code_scan = () => {

        this.setState({_is_qr_code_scan_dialog_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _on_qr_code_create = () => {

        this.setState({_is_base64_qr_code_dialog_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _handle_qr_code_text_change = (event) => {
      
        this.setState({_qr_code_text: event.target.value});
    };

    _on_close = () => {

        this.props.onClose();
    };

    _handle_base64_qr_code_dialog_close = () => {

        this.setState({_is_base64_qr_code_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
    };

    _handle_qr_code_scan_dialog_close = () => {

        this.setState({_is_qr_code_scan_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
    };

    render() {

        const { classes, open, _qr_code_text } = this.state;
        const { _is_base64_qr_code_dialog_open, _is_qr_code_scan_dialog_open } = this.state;

        return (
            <div>
                <Base64QRCodeDialog
                    open={_is_base64_qr_code_dialog_open}
                    onClose={this._handle_base64_qr_code_dialog_close}
                    value={_qr_code_text}/>
                <QRCodeScanDialog
                    open={_is_qr_code_scan_dialog_open}
                    onClose={this._handle_qr_code_scan_dialog_close}
                    on_scan={(value) => this._set_scan_result(value)}/>
                <Dialog
                    className={classes.dialog}
                    open={open}
                    onClose={this._on_close}
                >
                    <DialogTitle>{t("components.qr_code_tools_dialog.title")}</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label={t(`components.qr_code_tools_dialog.text_field`)}
                            value={_qr_code_text}
                            onChange={this._handle_qr_code_text_change}
                            multiline
                            rows={4}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {this._on_qr_code_scan(event)}} color="primary">
                            {t("words.scan")}
                        </Button>
                        <Button onClick={(event) => {this._on_qr_code_create(event)}} color="primary">
                            {t("words.create")}
                        </Button>
                        <Button onClick={(event) => {this._on_close(event)}} color="primary">
                            {t( "words.close")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(QRCodeToolsDialog);
