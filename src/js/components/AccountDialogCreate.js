import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

import { green, red } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';

import Grow from "@material-ui/core/Grow";
import Fade from "@material-ui/core/Fade";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import ChipInput from 'material-ui-chip-input'

import * as bip39 from "bip39"
import zxcvbn from "zxcvbn";
import api from "../utils/api";

import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import { COINS } from "../utils/constants";
import {Collapse} from "@material-ui/core";

const styles = theme => ({
    dialog: {
        [theme.breakpoints.down('sm')]: {
            "& .MuiDialog-container .MuiDialog-paper": {
                margin: "24px 0px",
                borderRadius: 0
            },
        }
    },
    generationLoader: {
        textAlign: "center"
    },
    generationFabSuccess: {
        boxShadow: "none",
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
        color: "#FFFFFF"
    },
    generationFabError: {
        boxShadow: "none",
        backgroundColor: red[500],
        '&:hover': {
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
            _bip39: bip39,
            _zxcvbn: zxcvbn,
            _account_name_input: "",
            _is_account_name_error: false,
            _account_password_input: "",
            _is_account_password_error: false,
            _account_confirmation_input: "",
            _is_account_confimation_error: false,
            _configuration_view_auto_focus_index: 0,
            _password_evaluation: null,
            _active_view_index: 0,
            _generation_completed: false,
            _generation_eror: false,
            _coins: COINS,
            _coin: null,
            _account_mnemonic_input: [],
            _is_account_mnemonic_input_error: false
        };
    };

    componentWillReceiveProps(nextProps, nextContext) {

        this.setState({...nextProps});
    }

    _switch_to_mnemonic_view = () => {

        const that = this;

        function validate_current_step(is_current_step_valid) {

            if(is_current_step_valid) {

                that.setState({_active_view_index: 1});
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
            }
        }

        this._validate_step_2(validate_current_step);

    };

    _process_create_account_result = (error, result) => {

        if(!error) {

            this.setState({_generation_eror: false, _generation_completed: true});
            this.props.onComplete();
        }else {

            this.setState({_generation_eror: true, _generation_completed: true});
        }

    };

    _handle_account_name_input_change = (event) => {
        this.setState({_account_name_input: event.target.value, _is_account_name_error: false});
    };

    _handle_account_password_input_change = (event) => {

        const { _zxcvbn } = this.state;
        const _account_password_input = event.target.value;
        const _password_evaluation = _zxcvbn(_account_password_input);

        this.setState({_account_password_input: event.target.value, _password_evaluation, _is_account_confirmation_error: false, _is_account_password_error: false});
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
         _account_mnemonic_input.push(chip);

        this.setState({ _account_mnemonic_input});
    };
    
    _validate_step_1 = (callback_function) => {
        
        const { _account_name_input, _account_password_input, _account_confirmation_input } = this.state;

        const _is_account_name_error = !(_account_name_input.toString().length);
        const _is_account_confirmation_error = !(_account_password_input.toString() === _account_confirmation_input.toString());
        const _is_account_password_error = !(_account_password_input.toString().length);
        
        this.setState({_is_account_name_error, _is_account_confirmation_error, _is_account_password_error}, function(){

            callback_function(!_is_account_name_error && !_is_account_confirmation_error && !_is_account_password_error);
        });
    };

    _validate_step_2 = (callback_function) => {

        const {  _account_mnemonic_input } = this.state;
        const  _is_account_mnemonic_input_error = ( _account_mnemonic_input.length < 12);

        this.setState({ _is_account_mnemonic_input_error}, function(){

            callback_function(!_is_account_mnemonic_input_error);
        })

    };

    _validate_step_3 = () => {


    };
    
    _generate_a_new_mnemonic = (event) => {

        if(typeof event !== "undefined") {event.preventDefault()};

        const { _bip39 } = this.state;
        const mnemonic_words = _bip39.generateMnemonic().split(" ");
        this.setState({ _account_mnemonic_input: mnemonic_words});

    };

    _on_cancel = (event) => {

        this.props.cancel(event);

        setTimeout(() => {

            const state = {
                _account_name_input: "",
                _account_password_input: "",
                _account_confirmation_input: "",
                _active_view_index: 0,
                _configuration_view_auto_focus_index: 0,
                _generation_completed: false,
                _generation_eror: false,
                _coin: null,
                _account_mnemonic_input: []
            };

            this.setState(state);

        }, 300);
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

        this._on_cancel(event);
    };

    render() {

        const { classes, account, open, _active_view_index, _generation_completed, _coin, _coins,  _account_mnemonic_input, _password_evaluation, _configuration_view_auto_focus_index } = this.state;
        const { _account_name_input, _account_password_input, _account_conformation_input, _is_account_name_error, _is_account_confirmation_error, _is_account_password_error, _is_account_mnemonic_input_error, _generation_eror } = this.state;

        const coin = _coin == null ? COINS[0]: _coin;

        const password_feedback = Boolean(_password_evaluation) ?
                <DialogContentText>
                    <p>
                        Password strength score is {_password_evaluation.score} it would require ~10^{_password_evaluation.guesses_log10.toString().split(".")[0]} attempts (<b className={_password_evaluation.guesses_log10.toString().split(".")[0] >= 13 ? classes.green: classes.red}>or {_password_evaluation.crack_times_display.offline_slow_hashing_1e4_per_second} for multiples hackers to crack it</b>). {_password_evaluation.feedback.suggestions[0]}.
                        <br /> <b>{_password_evaluation.feedback.warning}.</b>
                    </p>
                </DialogContentText>: null;

        const configuration_view =
            <Fade in>
                <div>
                    <DialogContent>
                        <DialogContentText>
                            Provide a name and eventually a STRONG PASSWORD in order to create a new account (You can define it later).
                            Everything that you type never be send to any server, it will stay on your device.
                            Once a name and a pasword to encrypt your backup phrase is set, we will enable you to manually create or import a new backup phrase (called a mnemonic).
                        </DialogContentText>
                        <form noValidate autoComplete="off">
                            <TextField
                                onChange={this._handle_account_name_input_change}
                                value={_account_name_input}
                                error={_is_account_name_error}
                                helperText={_is_account_name_error ? "Account name cannot be empty": ""}
                                onKeyDown={this._handle_key_down_input_one}
                                id="name"
                                label="Name"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                onChange={this._handle_account_password_input_change}
                                value={_account_password_input}
                                error={_is_account_password_error}
                                helperText={_is_account_password_error ? "Wrong password input": ""}
                                onKeyDown={this._handle_key_down_input_two}
                                id="password"
                                label="Password"
                                type="password"
                                fullWidth
                            />
                            <TextField
                                onChange={this._handle_account_confirmation_input_change}
                                value={_account_conformation_input}
                                error={_is_account_confirmation_error}
                                helperText={_is_account_confirmation_error ? "Wrong password confirmation": ""}
                                onKeyDown={this._handle_key_down_input_three}
                                id="confirmation"
                                label="Confirmation"
                                type="password"
                                fullWidth
                            />
                            <Collapse in={Boolean(_password_evaluation) && Boolean(_account_password_input.length)} timeout="auto" unmountOnExit>
                                {password_feedback}
                            </Collapse>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {this._on_cancel(event)}} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this._switch_to_mnemonic_view} variant="contained"  color="primary" autoFocus>
                            Next
                        </Button>
                    </DialogActions>
                </div>
            </Fade>;

        const mnemonic_view =
            <Fade in>
                <div>
                    <DialogContent>
                        <DialogContentText>
                            Use an old backup phrase from another wallet or use a <Link onClick={(event) => {this._generate_a_new_mnemonic(event)}}>new random backup phrase</Link>.
                            The backup phrase is a like a seed password that will create a master key, from this key, it will create derived keys pair for each cryptocurrency.
                            The password you typed in the first step will enable you to log in using a password instead of this  backup phrase each and every time.<br />
                            <b className={classes.red}>Make sure no one is looking before completing the field below and STORE IT ON PAPER.</b>
                        </DialogContentText>
                        <form noValidate autoComplete="off">
                            <ChipInput
                                value={ _account_mnemonic_input}
                                onChange={(chips) => this._handle_private_mnemonic_input_change(chips)}
                                onDelete={(value) => this._handle_private_mnemonic_input_delete(value)}
                                onAdd={(value) => this._handle_private_mnemonic_input_add(value)}
                                error={ _is_account_mnemonic_input_error}
                                helperText={( _is_account_mnemonic_input_error) ? "Something is incorrect": ""}
                                allowDuplicates
                                fullWidth
                                label={"Bip39 mnemonic"}
                            />
                            <Collapse in={ _account_mnemonic_input.length < 12}>
                                <DialogContentText>
                                    <p>
                                        An usual seed for a bip39 mnemonic is 12 words long.
                                    </p>
                                </DialogContentText>
                            </Collapse>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {this._on_cancel(event)}} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this._switch_to_generation_view} variant="contained"  color="primary" autoFocus>
                            Next
                        </Button>
                    </DialogActions>
                </div>
            </Fade>;

        const generation_view_inner = !_generation_completed ?
            <div>
                <Grow in><CircularProgress /></Grow>
                <Fade in><p>Generating...</p></Fade>
            </div>:
            _generation_eror ?
            <div>
                <Grow in>
                    <Fab className={classes.generationFabError}>
                        <CloseIcon />
                    </Fab>
                </Grow>
                <Fade in><p>ERROR: Your account has not been created.</p></Fade>
            </div>:
            <div>
                <Grow in>
                    <Fab className={classes.generationFabSuccess}>
                        <CheckIcon />
                    </Fab>
                </Grow>
                <Fade in><p>Your account will be soon displayed.</p></Fade>
            </div>

        const generation_view =
            <Fade in>
                <div>
                    <DialogContent>
                        <p>We need to create one address for each cryptocurrency listed, theses address are anonymous since they aren't linked to yourself. We'll automatically backup your account on your computer, if you change your password replace the backup file and delete the old one.</p>
                        <div className={classes.generationLoader}>
                            {generation_view_inner}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {this._on_cancel(event)}} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={(event) => {this._on_close(event)}} variant="contained"  color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </div>
            </Fade>;

        const views = [
            configuration_view,
            mnemonic_view,
            generation_view
        ];

        return (
            <Dialog
                className={classes.dialog}
                open={open}
                scroll={"paper"}
                onClose={(event) => {this.props.cancel(event, account)}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" onClose={this.props.cancel}>Create a new account</DialogTitle>
                <Stepper activeStep={_active_view_index} alternativeLabel>
                    <Step completed={(_active_view_index >= 1)}>
                        <StepLabel>Configuration</StepLabel>
                    </Step>
                    <Step completed={(_active_view_index >= 2)} optional={<span>Optional</span>}>
                        <StepLabel>Import</StepLabel>
                    </Step>
                    <Step completed={(_active_view_index >= 2 && _generation_completed)}>
                        <StepLabel>Generation</StepLabel>
                    </Step>
                </Stepper>
                {views[_active_view_index]}
            </Dialog>
        );
    }
}

export default withStyles(styles)(AccountDialogCreate);