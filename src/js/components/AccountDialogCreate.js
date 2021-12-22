import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";
import TimeAgo from 'javascript-time-ago'

import { green, red } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";

import Grow from "@material-ui/core/Grow";
import Fade from "@material-ui/core/Fade";

import Collapse from "@material-ui/core/Collapse";
import Backdrop from "@material-ui/core/Backdrop";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import ChipInput from "material-ui-chip-input"

import { LOCALES } from "../utils/constants";
import * as bip39 from "bip39"
import("zxcvbn").then(zxcvbn => {
    window.zxcvbn = zxcvbn;
});
import api from "../utils/api";

import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import QrCodeIcon from "../icons/QrCode";

import actions from "../actions/utils";
import { triplesec_decrypt } from "../utils/api-crypto";
import QRCodeScanDialog from "../components/QRCodeScanDialog";
import DialogCloseButton from "../components/DialogCloseButton";

const styles = theme => ({
    backdrop: {
        color: "#fff",
        zIndex: "1400"
    },
    dialog: {
        [theme.breakpoints.down("xs")]: {
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
    generationLoader: {
        textAlign: "center"
    },
    generationFabSuccess: {
        boxShadow: "none",
        backgroundColor: green[500],
        "&:hover": {
            backgroundColor: green[700],
        },
        color: "#FFFFFF"
    },
    generationFabError: {
        boxShadow: "none",
        backgroundColor: red[500],
        "&:hover": {
            backgroundColor: red[700],
        },
        color: "#FFFFFF"
    },
    chip: {
        margin: theme.spacing(0.5)
    },
    red: {
        color: red[500]
    },
    green: {
        color: green[500]
    }
});


class AccountDialogCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            open: props.open,
            selected_locales_code: props.selected_locales_code,
            _locales: LOCALES,
            _account_name_input: "",
            _is_account_name_error: false,
            _account_password_input: "",
            _is_account_password_error: false,
            _account_confirmation_input: "",
            _is_account_confirmation_error: false,
            _configuration_view_auto_focus_index: 0,
            _password_evaluation: null,
            _password_warning: null,
            _active_view_index: 0,
            _generation_completed: false,
            _generation_error: false,
            _account_mnemonic_input: [],
            _is_account_mnemonic_input_error: false,
            _is_account_seed_trying_to_be_decrypted: false,
        };
    };

    componentDidMount() {

        this._set_default_bip39_language();
    }

    componentWillReceiveProps(new_props, nextContext) {

        const { selected_locales_code } = this.state;

        this.setState(new_props, () => {

            if(new_props.selected_locales_code !== selected_locales_code) {

                this._set_default_bip39_language();
            }
        });

    }

    _set_default_bip39_language = () => {

        const { _locales, selected_locales_code } = this.state;

        let locale_name = _locales[0].name;

        for(let i = 0; i < _locales.length; i++) {

            if(_locales[i].code === selected_locales_code) {

                locale_name = _locales[i].name;
            }
        }

        bip39.setDefaultWordlist("english");
        ["chinese", "japanese", "spanish", "italian", "french", "korean", "portuguese"].forEach(function(name){

            if(locale_name.toLowerCase().includes(name)) {

                bip39.setDefaultWordlist(name);
            }
        });
    };

    _switch_to_mnemonic_view = () => {

        const that = this;

        function validate_current_step(is_current_step_valid) {

            if(is_current_step_valid) {

                that.setState({_active_view_index: 1});
                actions.trigger_sfx("navigation_transition-right");
                actions.jamy_update("happy");

                setTimeout(() => {

                    if(that.state._password_evaluation.score <= 3) {

                        const time_ago = new TimeAgo(document.documentElement.lang);
                        const time_not_ago = time_ago.format(Date.now() + that.state._password_evaluation.crack_times_seconds.offline_slow_hashing_1e4_per_second * 1000, "mini")

                        actions.jamy_update("suspicious", 3000);
                        actions.trigger_snackbar(t( "components.account_dialog_create.password_evaluation_warning", {time: time_not_ago}), 9000)
                    }

                }, 0);

            }else {

                actions.trigger_sfx("alert_error-01");
                actions.jamy_update("angry");
            }
        }

        this._validate_step_1(validate_current_step);
    };

    _switch_to_generation_view = () => {

        const { _account_name_input, _account_password_input, _account_mnemonic_input } = this.state;
        const that = this;

        function validate_current_step(is_current_step_valid) {

            if(is_current_step_valid) {

                api.create_account(_account_name_input, _account_password_input, _account_mnemonic_input.join(" "), that._process_create_account_result);
                that.setState({_active_view_index: 2});
                actions.trigger_sfx("navigation_transition-right");
                actions.jamy_update("happy");
            }
        }

        this._validate_step_2(validate_current_step);

    };

    _process_create_account_result = (error, account) => {

        if(!error) {

            this.setState({_generation_error: false, _generation_completed: true});

            setTimeout(() => {

                this._reset_fields();
                this.props.onComplete();
            }, 1 * 1000);
        }else {

            this.setState({_generation_error: true, _generation_completed: true});
            this.props.onError();
        }

    };

    _handle_account_name_input_change = (event) => {

        this.setState({_account_name_input: event.target.value, _is_account_name_error: false});
    };

    _eval_password = () => {

        const { _account_password_input } = this.state;

        const _password_evaluation = window.zxcvbn(_account_password_input);

        if(_password_evaluation.feedback.warning || _password_evaluation.feedback.suggestions.length) {

            let suggestions_and_warning = "";

            suggestions_and_warning += _password_evaluation.feedback.warning ? t("sentences." + _password_evaluation.feedback.warning.replaceAll(".", ""), {FAW: true}): "";

            if(_password_evaluation.feedback.suggestions.length) {

                _password_evaluation.feedback.suggestions.forEach((suggestion) => {

                    suggestions_and_warning += "\n" + t("sentences." + suggestion.replaceAll(".", ""), {FAW: true});
                });
            }

            actions.jamy_update("angry", 3000);
            actions.trigger_snackbar(suggestions_and_warning, 10000);
        }else if(_account_password_input.length && _password_evaluation.score >= 4){

            actions.jamy_update("happy", 3000);
            actions.trigger_snackbar(t( "components.account_dialog_create.password_evaluation_good"), 5000);
        }
        this.setState({_password_evaluation});

    };

    _handle_account_password_input_change = (event) => {

        const _account_password_input = event.target.value;

        this.setState({_account_password_input, _is_account_confirmation_error: false, _is_account_password_error: false}, () => {

            setTimeout(() => {

                if(this.state._account_password_input === _account_password_input) {

                    this._eval_password();
                }
            }, 1500);
        });
    };

    _handle_account_confirmation_input_change = (event) => {

        this.setState({_account_confirmation_input: event.target.value, _is_account_confirmation_error: false, _is_account_password_error: false});
    };

    _handle_private_mnemonic_input_change = (chips) => {

        this.setState({ _account_mnemonic_input: chips,  _is_account_mnemonic_input_error: false});
    };

    _handle_private_mnemonic_input_delete = ( chip ) => {

        let {  _account_mnemonic_input } = this.state;
         _account_mnemonic_input.splice( _account_mnemonic_input.indexOf(chip), 1);

        this.setState({ _account_mnemonic_input,  _is_account_mnemonic_input_error: false})
    };

    _handle_private_mnemonic_input_add = (chip) => {

        let {  _account_mnemonic_input } = this.state;

        _account_mnemonic_input = _account_mnemonic_input.concat(chip.replaceAll("　", " ").split(" "));
        this.setState({ _account_mnemonic_input});
    };
    
    _validate_step_1 = (callback_function) => {
        
        const { _account_name_input, _account_password_input, _account_confirmation_input } = this.state;

        const _is_account_name_error = !(_account_name_input.toString().length);
        const _is_account_confirmation_error = !(_account_password_input.toString() === _account_confirmation_input.toString());
        const _is_account_password_error = !(_account_password_input.toString().length);
        
        this.setState({_is_account_name_error, _is_account_confirmation_error, _is_account_password_error}, () => {

            callback_function(!_is_account_name_error && !_is_account_confirmation_error && !_is_account_password_error);
        });
    };

    _validate_step_2 = (callback_function) => {

        const {  _account_mnemonic_input } = this.state;
        const  _is_account_mnemonic_input_error = ( _account_mnemonic_input.length < 12);

        this.setState({ _is_account_mnemonic_input_error}, () => {

            callback_function(!_is_account_mnemonic_input_error);
        });

    };
    
    _generate_a_new_mnemonic = (event) => {

        if(typeof event !== "undefined") {event.preventDefault()}

        const mnemonic_words = bip39.generateMnemonic().replaceAll("　", " ").split(" ");
        actions.trigger_sfx("state-change_confirm-up");
        actions.jamy_update("happy");
        this.setState({ _account_mnemonic_input: mnemonic_words});

    };

    _reset_fields = ()  => {

        setTimeout(() => {

            const state = {
                _account_name_input: "",
                _account_password_input: "",
                _account_confirmation_input: "",
                _active_view_index: 0,
                _configuration_view_auto_focus_index: 0,
                _generation_completed: false,
                _generation_error: false,
                _account_mnemonic_input: [],
                _is_qr_dialog_open: false,
                _is_qr_dialog_for: "password",
                _is_account_seed_trying_to_be_decrypted: false,
            };

            this.setState(state);

        }, 500);
    };

    _on_cancel = (event) => {

        this.props.cancel(event);
        actions.trigger_sfx("state-change_confirm-down");
        this._reset_fields();
    };

    _handle_key_down_input_one = (event) => {

        if(event.keyCode == 13){

            this.setState({_configuration_view_auto_focus_index: 1});
        }
    };

    _handle_key_down_input_two = (event) => {

        if(event.keyCode == 13){

            this.setState({_configuration_view_auto_focus_index: 2});
        }
    };

    _handle_key_down_input_three = (event) => {

        if(event.keyCode == 13){

            this._switch_to_mnemonic_view();
        }
    };

    _on_close = (event) => {

        this.props.onClose(event);
        this._reset_fields();
    };

    _handle_qr_dialog_open = (event) => {

        this.setState({_is_qr_dialog_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _handle_qr_dialog_close = () => {

        this.setState({_is_qr_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
    };

    _on_encrypted_seed_qr = () => {

        this.setState({ _is_qr_dialog_for: "encrypted_seed"}, () => {

            this._handle_qr_dialog_open();
        });
    };

    _on_password_qr = () => {

        this.setState({_is_qr_dialog_open: true, _is_qr_dialog_for: "password"}, () => {

            this._handle_qr_dialog_open();
        });
    };

    _handle_qr_scan = (text) => {

        const {_is_qr_dialog_for, _account_password_input } = this.state;

        if(_is_qr_dialog_for === "password") {

            this.setState({_account_password_input: text, _account_confirmation_input: text});

        }else if(_is_qr_dialog_for === "encrypted_seed") {

            if(text.split(" ").length >= 12) {

                this.setState({ _account_mnemonic_input: text.replaceAll("　", " ").split(" ")});
                actions.trigger_sfx("state-change_confirm-up");
                actions.jamy_update("happy");

            }else {

                this.setState({_is_account_seed_trying_to_be_decrypted: true}, () => {

                    triplesec_decrypt(text, _account_password_input, (error, result) => {

                        if(!error){

                            this.setState({ _account_mnemonic_input: result.replaceAll("　", " ").split(" ")});
                            actions.trigger_sfx("state-change_confirm-up");
                            actions.jamy_update("happy");

                        }else {

                            actions.trigger_snackbar(t("sentences." + error, {FAW: true}));
                        }

                        this.setState({_is_account_seed_trying_to_be_decrypted: false});
                    });
                });
            }
        }
    }

    render() {

        const { classes, open, _active_view_index, _generation_completed,  _account_mnemonic_input, _password_evaluation } = this.state;
        const { _account_name_input, _account_password_input, _account_confirmation_input, _is_account_name_error, _is_account_confirmation_error, _is_account_password_error, _is_account_mnemonic_input_error, _generation_error } = this.state;
        const { _is_qr_dialog_open, _is_account_seed_trying_to_be_decrypted } = this.state;

        const password_feedback = Boolean(_password_evaluation) ?
                <DialogContentText id="create-account-dialog-description">
                    <p>
                        {t( "components.account_dialog_create.password_strength", {score: _password_evaluation.score})}
                    </p>
                </DialogContentText>: null;

        const configuration_view =
            <div className={classes.dialogBody}>
                <DialogContent className={classes.dialogBody} >
                    <form noValidate autoComplete="off">
                        <TextField
                            onChange={this._handle_account_name_input_change}
                            value={_account_name_input}
                            error={_is_account_name_error}
                            helperText={_is_account_name_error ? t( "sentences.account name cannot be empty"): ""}
                            onKeyDown={this._handle_key_down_input_one}
                            id="name"
                            label={t( "words.name", {FLC: true})}
                            type="text"
                            fullWidth
                        />
                        <TextField
                            onChange={this._handle_account_password_input_change}
                            value={_account_password_input}
                            error={_is_account_password_error}
                            helperText={_is_account_password_error ? t( "sentences.wrong password input"): ""}
                            onKeyDown={this._handle_key_down_input_two}
                            id="password"
                            label={t( "words.password", {FLC: true})}
                            type="password"
                            fullWidth
                        />
                        <TextField
                            onChange={this._handle_account_confirmation_input_change}
                            value={_account_confirmation_input}
                            error={_is_account_confirmation_error}
                            helperText={_is_account_confirmation_error ? t( "sentences.wrong password confirmation"): ""}
                            onKeyDown={this._handle_key_down_input_three}
                            id="confirmation"
                            label={t( "words.confirmation", {FLC: true})}
                            type="password"
                            fullWidth
                        />
                        <Collapse in={Boolean(_password_evaluation) && Boolean(_account_password_input.length)} timeout="auto" unmountOnExit>
                            {password_feedback}
                        </Collapse>
                    </form>
                    <DialogContentText id="create-account-dialog-description">
                        <p>{t( "components.account_dialog_create.configuration_view.description")}</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={(event) => {this._on_password_qr(event)}} color="primary" component="span">
                        <QrCodeIcon />
                    </IconButton>
                    <Button onClick={this._switch_to_mnemonic_view} color="primary" autoFocus>
                        {t("words.next")}
                    </Button>
                </DialogActions>
            </div>;

        const mnemonic_view =
            <div className={classes.dialogBody}>
                <DialogContent className={classes.dialogBody} >
                    <form noValidate autoComplete="off">
                        <ChipInput
                            value={ _account_mnemonic_input}
                            onChange={(chips) => {this._handle_private_mnemonic_input_change(chips)}}
                            onDelete={(value) => {this._handle_private_mnemonic_input_delete(value)}}
                            onAdd={(value) => {this._handle_private_mnemonic_input_add(value)}}
                            error={ _is_account_mnemonic_input_error}
                            helperText={( _is_account_mnemonic_input_error) ? t( "sentences.something is incorrect"): ""}
                            allowDuplicates
                            fullWidth
                            label={t( "sentences.bip39 mnemonic")}
                        />
                        <Collapse in={ _account_mnemonic_input.length < 12}>
                            <DialogContentText>
                                <p>
                                    {t( "components.account_dialog_create.mnemonic_view.usual_seed")}
                                </p>
                            </DialogContentText>
                        </Collapse>
                    </form>
                    <DialogContentText id="create-account-dialog-description">
                        <p>{t( "components.account_dialog_create.mnemonic_view.description")}</p>
                        <p><b className={classes.red}>{t( "components.account_dialog_create.mnemonic_view.description_bold")}</b></p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={(event) => {this._on_encrypted_seed_qr(event)}} color="primary" component="span">
                        <QrCodeIcon />
                    </IconButton>
                    <Button onClick={(event) => {this._generate_a_new_mnemonic(event)}}
                            color="primary"
                            autoFocus={!_account_mnemonic_input.length}>
                        {t( "words.random")}
                    </Button>
                    <Button onClick={this._switch_to_generation_view}

                            color="primary"
                            disabled={!_account_mnemonic_input.length}
                            autoFocus={_account_mnemonic_input.length}>
                        {t( "words.next")}
                    </Button>
                </DialogActions>
            </div>;

        const generation_view_inner = !_generation_completed ?
            <div>
                <Grow in><CircularProgress /></Grow>
                <Fade in><p>{t( "components.account_dialog_create.generation_view.generating")}</p></Fade>
            </div>:
            _generation_error ?
            <div>
                <Grow in>
                    <Fab className={classes.generationFabError}>
                        <CloseIcon />
                    </Fab>
                </Grow>
                <Fade in><p>{t( "components.account_dialog_create.generation_view.error")}</p></Fade>
            </div>:
            <div>
                <Grow in>
                    <Fab className={classes.generationFabSuccess}>
                        <CheckIcon />
                    </Fab>
                </Grow>
                <Fade in><p>{t( "components.account_dialog_create.generation_view.success")}</p></Fade>
            </div>

        const generation_view =
            <div className={classes.dialogBody}>
                <DialogContent className={classes.dialogBody}>
                    <p>{t( "components.account_dialog_create.generation_view.description")}</p>
                    <div className={classes.generationLoader}>
                        {generation_view_inner}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => {this._on_close(event)}} color="primary" autoFocus>
                        {t( "words.close")}
                    </Button>
                </DialogActions>
            </div>;

        const views = [
            configuration_view,
            mnemonic_view,
            generation_view
        ];

        return (
            <div>
                <Backdrop className={classes.backdrop} open={_is_account_seed_trying_to_be_decrypted}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <QRCodeScanDialog
                    open={_is_qr_dialog_open}
                    onClose={this._handle_qr_dialog_close}
                    on_scan={(text) => this._handle_qr_scan(text)}/>
                <Dialog
                    className={classes.dialog}
                    open={open}
                    scroll={"paper"}
                    onClose={(event) => {this._on_close(event)}}
                    aria-labelledby="create-account-dialog-title"
                    aria-describedby="create-account-dialog-description"
                >
                    <DialogTitle id="create-account-dialog-title">
                        {t( "sentences.create a new account")}
                        <DialogCloseButton onClick={(event) => {this._on_close(event)}} />
                    </DialogTitle>
                    <Stepper activeStep={_active_view_index} alternativeLabel>
                        <Step completed={(_active_view_index >= 1)}>
                            <StepLabel>{t( "components.account_dialog_create.stepper.configure")}</StepLabel>
                        </Step>
                        <Step completed={(_active_view_index >= 2)} optional={<span>Optional</span>}>
                            <StepLabel>{t( "components.account_dialog_create.stepper.import")}</StepLabel>
                        </Step>
                        <Step completed={(_active_view_index >= 2 && _generation_completed)}>
                            <StepLabel>{t( "components.account_dialog_create.stepper.create")}</StepLabel>
                        </Step>
                    </Stepper>
                    {views[_active_view_index]}
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(AccountDialogCreate);
