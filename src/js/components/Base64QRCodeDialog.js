import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import Base64QRCode from "../components/Base64QRCode";

import download_qr_code_image from "../utils/download-qr-code-image";

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
    dialogTitleEllipsify: {
        "& h2": {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap"
        },
    },
});


class Base64QRCodeDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            open: props.open,
            value: props.value
        };
    };

    componentWillReceiveProps(new_props) {

        if(!new_props.open) {

            this.setState({open: new_props.open});

        }else {

            this.setState(new_props);
        }
    }

    _close_dialog = () => {

        this.props.onClose();
    };

    _download_qr_code = () => {

        const { value } = this.state;

        download_qr_code_image(value, 1024, "M", "QR", "PNG", true);
    };

    render() {

        const { classes, open, value } = this.state;

        return (
            <Dialog
                className={classes.dialog}
                open={open}
                onClose={this._close_dialog}
            >
                <DialogTitle className={classes.dialogTitleEllipsify}>
                    {t("components.base64_qr_code_dialog.title", {value: value})}
                </DialogTitle>
                <DialogContent>
                    <Base64QRCode value={value}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => {this._download_qr_code(event)}} color="primary">
                        {t("words.download")}
                    </Button>
                    <Button onClick={(event) => {this._close_dialog(event)}} color="primary">
                        {t("words.close")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(Base64QRCodeDialog);
