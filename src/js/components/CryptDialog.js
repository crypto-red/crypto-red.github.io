import React from "react";
import Link from "react-router-dom/Link";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Collapse from "@material-ui/core/Collapse";

import api_crypto from "../utils/api-crypto";
import api from "../utils/api";
import actions from "../actions/utils";
import clipboard from "clipboard-polyfill";

const styles = theme => ({
    dialog: {
        [theme.breakpoints.down("sm")]: {
            "& .MuiDialog-container .MuiDialog-paper": {
                margin: "0px 0px",
                maxHeight: "100%",
                borderRadius: 0
            },
        }
    },
    dialogBody: {
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
    },
    breakAllWords: {
        wordBreak: "break-all"
    }
});


class CryptDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            open: props.open,
            logged_account: props.logged_account,
            _message_input: "",
            _is_message_input_error: false,
            _public_key_input: "",
            _is_public_key_input_error: false,
            _private_key_input: "",
            _is_private_key_input_error: false,
            _result_text: "",
            _is_result_dialog_open: false,
            _is_autofill_dialog_open: false,
            _view_name_index: 0,
        };
    };

    componentWillReceiveProps(nextProps, nextContext) {

        this.setState({...nextProps});
    }

    _handle_account_name_input_change = (event) => {

        this.setState({_account_name_input: event.target.value, _is_account_name_error: false});
    };

    _reset_state = () => {

        setTimeout(() => {

            const state = {
                _message_input: "",
                _is_message_input_error: false,
                _public_key_input: "",
                _is_public_key_input_error: false,
                _private_key_input: "",
                _is_private_key_input_error: false,
                _result_text: "",
                _is_result_dialog_open: false,
                _is_autofill_dialog_open: false,
                _view_name_index: 0,
            };

            this.setState(state);

        }, 500);
    };

    _on_close = (event) => {

        this._reset_state();
        this.props.onClose(event);
    };

    _on_cancel = (event) => {

        this._reset_state();
        this.props.cancel(event);
    };

    _on_autofill_fields = (event) => {

        this.setState({_is_autofill_dialog_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _handle_autofill_dialog_close = (event) => {

        this.setState({_is_autofill_dialog_open: false});
    };

    _handle_autofill_dialog_cancel = (event) => {

        this.setState({_is_autofill_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
    };

    _handle_result_text_result = (error, result) => {

        if(!error && result) {

            this.setState({_result_text: result, _is_result_dialog_open: true});
            actions.trigger_sfx("hero_decorative-celebration-01");
            actions.jamy_update("happy");
        }else {

            actions.trigger_sfx("alert_error-01");
            actions.jamy_update("angry");
            actions.trigger_snackbar(error);
        }
    };

    _on_show_result = (event) => {

        const { _view_name_index } = this.state;
        const { _message_input, _public_key_input, _private_key_input } = this.state;

        const _is_message_input_error = !_message_input.length;
        const _is_public_key_input_error = !_public_key_input.length;
        const _is_private_key_input_error = !_private_key_input.length && _view_name_index === 1;

        if(!_is_message_input_error && !_is_public_key_input_error && !_is_private_key_input_error) {

            if(!_view_name_index) {

                api_crypto.nacl_encrypt(_message_input, _public_key_input, this._handle_result_text_result);

            }else {

                api_crypto.nacl_decrypt(_message_input, _public_key_input, _private_key_input, this._handle_result_text_result);
            }
        }else {

            actions.trigger_sfx("alert_error-01");
            actions.jamy_update("angry");
        }

        this.setState({_is_message_input_error, _is_public_key_input_error, _is_private_key_input_error});

    };

    _reset_result_state = () => {

        setTimeout(() => {

            this.setState({_result_text: ""});

        }, 500);
    };

    _handle_result_dialog_close = (event) => {

        this.setState({_is_result_dialog_open: false});
        this._reset_result_state()
    };

    _handle_result_dialog_cancel = (event) => {

        this.setState({_is_result_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
        this._reset_result_state();
    };

    _set_key_pair = (event, coin_id) => {

        const { logged_account, _view_name_index } = this.state;

        if(logged_account) {

            const _public_key_input = api.get_public_key_by_seed(coin_id, logged_account.seed);
            const _private_key_input = _view_name_index === 1 ? api.get_private_key_by_seed(coin_id, logged_account.seed): "";

            if(_view_name_index === 0) {

                actions.jamy_update("flirty");
                actions.trigger_snackbar(t( "components.crypt_dialog.warning_encrypt_to_yourself"), 5000);
            }else {

                actions.jamy_update("happy");
            }

            this.setState({_public_key_input, _is_public_key_input_error: false, _private_key_input, _is_private_key_input_error: false, _is_autofill_dialog_open: false});
            actions.trigger_sfx("hero_decorative-celebration-03");
        }
    };

    _handle_view_name_change = (event, _view_name_index) => {

        this.setState({_view_name_index, _message_input: "", _is_message_input_error: false, _public_key_input: "", _is_public_key_input_error: false, _private_key_input: "", _is_private_key_input_error: false});
    };

    _handle_message_input_change = (event) => {

        this.setState({_message_input: event.target.value, _is_message_input_error: false});
    };

    _handle_public_key_input_change = (event) => {

        this.setState({_public_key_input: event.target.value, _is_public_key_input_error: false});
    };

    _handle_private_key_input_change = (event) => {

        this.setState({_private_key_input: event.target.value, _is_private_key_input_error: false});
    };

    _handle_result_text_copy = (event, text) => {

        if(text !== null || text !== "") {

            clipboard.writeText(text).then(
                function () {

                    actions.trigger_snackbar(t( "sentences.text successfully copied"));
                    actions.trigger_sfx("navigation_forward-selection");
                },
                function () {

                    actions.trigger_snackbar(t( "sentences.cannot copy this text"));
                    actions.trigger_sfx("navigation_backward-selection");
                }
            );
        }else {

            actions.trigger_snackbar(t( "sentences.cannot copy non-existent text"));
            actions.trigger_sfx("navigation_backward-selection");
        }
    };

    render() {

        const { classes, open, logged_account } = this.state;
        const { _message_input, _is_message_input_error, _public_key_input, _is_public_key_input_error, _private_key_input, _is_private_key_input_error } = this.state;
        const { _is_result_dialog_open, _is_autofill_dialog_open, _result_text } = this.state;
        const { _view_name_index } = this.state;

        return (
            <div>
                <Dialog
                    open={_is_result_dialog_open}
                    onClose={this._handle_result_dialog_close}
                    aria-labelledby="crypto-text-result-dialog-title"
                    aria-describedby="crypto-text-result-dialog-description"
                >
                    <DialogTitle id="crypto-text-result-dialog-title">
                        {_view_name_index ?
                            t( "components.crypt_dialog.result_dialog.decrypt_title", {length: _result_text.length}):
                            t( "components.crypt_dialog.result_dialog.encrypt_title", {length: _result_text.length})}
                    </DialogTitle>
                    <DialogContent className={classes.dialogBody}>
                        <DialogContentText id="crypto-text-result-dialog-description" className={classes.breakAllWords}>
                            {_result_text}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {this._handle_result_text_copy(event, _result_text)}} color="primary">
                            {t( "words.copy")}
                        </Button>
                        <Button onClick={this._handle_result_dialog_cancel} color="primary" autoFocus>
                            {t( "words.ok")}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    maxWidth="xs"
                    open={_is_autofill_dialog_open}
                    onClose={this._handle_autofill_dialog_close}
                    aria-labelledby="crypto-text-autofill-dialog-title"
                    aria-describedby="crypto-text-autofill-dialog-description"
                >
                    <DialogTitle id="crypto-text-autofill-dialog-title">
                        {t( "components.crypt_dialog.autofill_dialog.title")}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t( "components.crypt_dialog.autofill_dialog.body")}
                        </DialogContentText>
                        <Divider />
                        <List component="nav" aria-label="Crypto keypair autofill list">
                            <ListItem onClick={(event) => {this._set_key_pair(event, "v-systems")}} button>
                                <ListItemText primary="v-systems"/>
                            </ListItem>
                        </List>
                        <Divider />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this._handle_autofill_dialog_cancel} color="primary" autoFocus>
                            {t( "words.close")}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    className={classes.dialog}
                    open={open}
                    scroll={"paper"}
                    onClose={(event) => {this._on_close(event)}}
                    aria-labelledby="crypto-text-dialog-title"
                    aria-describedby="crypto-text-dialog-description"
                >
                    <DialogTitle id="crypto-text-dialog-title">{_view_name_index ? t( "components.crypt_dialog.title_decrypt"): t( "components.crypt_dialog.title_encrypt")}</DialogTitle>
                    <div className={classes.dialogBody}>
                        <Tabs
                            value={_view_name_index}
                            onChange={this._handle_view_name_change}
                            aria-label="Crypt tabs"
                            indicatorColor="primary"
                            variant="fullWidth"
                            selectionFollowsFocus
                        >
                            <Tab label={t("words.encrypt")} />
                            <Tab label={t("words.decrypt")} />
                        </Tabs>
                        <DialogContent className={classes.dialogBody} >
                            <DialogContentText id="crypto-text-dialog-description">
                                {t( "components.crypt_dialog.body")} <Link to={"/about/wiki/crypt"} onClick={(event) => {this._on_close(event)}}>{t( "components.crypt_dialog.why_link_text")}</Link>
                            </DialogContentText>
                            <form noValidate autoComplete="off">
                                <TextField
                                    onChange={this._handle_message_input_change}
                                    value={_message_input}
                                    error={_is_message_input_error}
                                    helperText={_is_message_input_error ? t( "sentences.something is incorrect"): ""}
                                    id="message"
                                    label={t( "words.message", {FLC: true})}
                                    type="text"
                                    fullWidth
                                />
                                <TextField
                                    onChange={this._handle_public_key_input_change}
                                    value={_public_key_input}
                                    error={_is_public_key_input_error}
                                    helperText={_is_public_key_input_error ? t( "sentences.something is incorrect"): ""}
                                    id="public-key"
                                    label={t( "words.public key", {FLC: true})}
                                    type="text"
                                    fullWidth
                                />
                                <Collapse in={_view_name_index === 1}>
                                    <TextField
                                        onChange={this._handle_private_key_input_change}
                                        value={_private_key_input}
                                        error={_is_private_key_input_error}
                                        helperText={( _is_private_key_input_error) ? t( "sentences.something is incorrect"): ""}
                                        id="private-key"
                                        label={t( "words.private key", {FLC: true})}
                                        type="password"
                                        fullWidth
                                    />
                                </Collapse>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={(event) => {this._on_autofill_fields(event)}} color="primary" disabled={!logged_account} autoFocus>
                                {_view_name_index ? t( "components.crypt_dialog.autofill_my_keys"): t( "components.crypt_dialog.autofill_my_key")}
                            </Button>
                            <Button onClick={(event) => {this._on_show_result(event)}} color="primary" disabled={_is_message_input_error || _is_public_key_input_error || _is_private_key_input_error}>
                                {t( "words.show")}
                            </Button>
                            <Button onClick={(event) => {this._on_cancel(event)}} color="primary">
                                {t( "words.close")}
                            </Button>
                        </DialogActions>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(CryptDialog);
