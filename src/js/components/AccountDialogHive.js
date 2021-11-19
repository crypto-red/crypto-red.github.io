import React from "react";
import { withStyles } from "@material-ui/core/styles"

import { t } from "../utils/t";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import HiveLogoWordmark from "../icons/HiveLogoWordmark";
import ReactDOMServer from "react-dom/server";
import svg64 from "svg64";
import Avatar from "@material-ui/core/Avatar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import fuzzy from "fuzzy";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Divider from "@material-ui/core/Divider";

import { lookup_hive_accounts_with_details, add_hive_master_key } from "../utils/api"
import api from "../utils/api";
import actions from "../actions/utils";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Jdenticon from "react-jdenticon";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

const styles = theme => ({
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
    hiveImageContainer: {
        margin: "0px 16px"
    },
    hiveImage: {
        width: "100%"
    },
    backdrop: {
        color: "#fff",
        zIndex: "1400"
    },
});

class AccountDialogHive extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            account: props.account,
            open: props.open,
            _accounts: [],
            _lookup_loading: false,
            _account_input: null,
            _account_name_input: "",
            _is_account_name_error: false,
            _account_password_input: "",
            _is_account_password_error: false,
            _view_auto_focus_index: 0,
        };
    };

    componentDidMount() {

        this._handle_account_name_input_change(null);
    }

    componentWillReceiveProps(nextProps, nextContext) {

        this.setState({...nextProps});
    }

    _on_close = (event, account) => {

        this.props.onClose(event, account)
    };

    _on_error = (event, account) => {

        this.props.onError(event, account)
    };

    _on_complete = (event, account) => {

        this.props.onComplete(event, account)
    };

    _handle_account_name_input_change = (event) => {

        if(event) {

            this.setState({_account_name_input: event.target.value || "", _is_account_name_error: false, _lookup_loading: true}, () => {

                lookup_hive_accounts_with_details(this.state._account_name_input, 15, (error, results) => {

                    if(!error) {

                        this.setState({_accounts: results, _lookup_loading: false});
                    }
                });
            });
        }
    };

    _handle_account_input_change = (event, value) => {

        if(value) {

            this.setState({_account_input: value.original, _account_name_input: value.original.name});
        }
    };

    _handle_account_password_input_change = (event) => {

        this.setState({_account_password_input: event.target.value, _is_account_password_error: false});
    };

    _handle_key_down_input_one = (event) => {

        if(event.keyCode == 13){

            this.setState({_view_auto_focus_index: 1});
        }
    };

    _handle_key_down_input_two = (event) => {

        if(event.keyCode == 13){

            const { account } = this.state;
            this._try_hive_login(event, account);
        }
    };

    _try_hive_login = (event, account) => {

        const { _account_name_input, _account_password_input } = this.state
        actions.trigger_sfx("ui_loading");

        this.setState({_trying_hive_login: true}, () => {

            add_hive_master_key(_account_name_input, _account_password_input, (err, res) => {

                if(err) {

                    this.setState({_trying_hive_login: false, _is_account_password_error: true});
                }else {

                    api.add_hive_master_key(_account_name_input, _account_password_input, (error, results) => {

                        if(error) {

                            this.setState({_trying_hive_login: false, _is_account_password_error: true}, () => {

                                this._on_error();
                            });

                        }else {

                            this.setState({_trying_hive_login: false, _is_account_password_error: false, _account_name_input: "", _account_password_input: ""}, () => {

                                console.log(results);
                                this._on_complete();
                            });
                        }
                    });
                }
            });
        });
    };

    _fuzzy_filter_accounts = (list, input_value) => {

        const { _account_name_input } = this.state
        const options = {
            pre: "<b style=\"color: #000244;\">"
            , post: "</b>"
            , extract: function(element) { return element.name; }
        };

        return fuzzy.filter(_account_name_input || input_value.inputValue, list, options);
    };

    render() {

        const { classes, account, open, _trying_hive_login } = this.state;
        const { _lookup_loading, _accounts, _view_auto_focus_index, _account_input, _account_name_input, _is_account_name_error, _account_password_input, _is_account_password_error  } = this.state;

        const svg_string = ReactDOMServer.renderToString(<HiveLogoWordmark />);
        const svg_string_base64 = svg64(svg_string);

        return (
            <div>
                <Backdrop className={classes.backdrop} open={_trying_hive_login}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Dialog
                    open={open}
                    className={classes.dialog}
                    onClose={(event) => {this.props.onClose(event, account)}}
                    aria-labelledby="hive-account-dialog-title"
                    aria-describedby="hive-account-dialog-description"
                >
                    {Boolean(account) ?
                        <div>
                            <DialogTitle id="hive-account-dialog-title">
                                {t("components.account_dialog_hive.title")}
                            </DialogTitle>
                            <DialogContent className={classes.dialogBody} >
                                <div className={classes.hiveImageContainer}>
                                    <img src={svg_string_base64} className={classes.hiveImage}/>
                                </div>
                                <div>
                                    <Autocomplete
                                        freeSolo={true}
                                        disablePortal={false}
                                        loading={_lookup_loading}
                                        loadingText={t("words.loading", {ATED: true})}
                                        onInputChange={this._handle_account_name_input_change}
                                        onChange={this._handle_account_input_change}
                                        value={_account_input}
                                        inputValue={_account_name_input}
                                        error={_is_account_name_error}
                                        helperText={_is_account_name_error ? t( "sentences.account name cannot be empty"): ""}
                                        id="hive-name-autocomplete"
                                        fullWidth
                                        filterOptions={this._fuzzy_filter_accounts}
                                        options={_accounts}
                                        getOptionLabel={(option) => {
                                            return typeof option.original !== "undefined" ? option.original.name || "" : option.name || "";
                                        }}
                                        renderOption={(option) =>
                                            <div>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar style={{backgroundColor: "transparent"}} alt={option.original.name || option.original.name} src={(option.original.profile_image || "").replace("/0x0/", "/40x40/")}>
                                                            <Jdenticon size="48" value={option.original.name} />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={<span dangerouslySetInnerHTML={{ __html: "@" + option.string }}></span>} secondary={option.original.name} />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                            </div>

                                        }
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                onKeyDown={this._handle_key_down_input_one}
                                                label={t( "words.name", {FLC: true})}
                                                autoFocus={_view_auto_focus_index === 0}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                                                }}
                                                margin="normal"
                                                fullWidth
                                            />
                                        }
                                    />
                                    <TextField
                                        onChange={this._handle_account_password_input_change}
                                        value={_account_password_input}
                                        error={_is_account_password_error}
                                        helperText={_is_account_password_error ? t( "sentences.wrong password input"): ""}
                                        onKeyDown={this._handle_key_down_input_two}
                                        id="password"
                                        label={"Owner/Master Key"}
                                        type="password"
                                        autoFocus={_view_auto_focus_index === 1}
                                        fullWidth
                                    />
                                </div>
                                <p>
                                    <Button color="primary" variant={""} onClick={() => {window.open("https://signup.hive.io/", "_blank")}}>https://signup.hive.io/</Button>
                                </p>
                            </DialogContent>
                        </div>: null
                    }
                    <DialogActions>
                        <Button color="primary" onClick={(event) => {this._try_hive_login(event, account)}}>
                            {t( "words.open")}
                        </Button>
                        <Button onClick={(event) => {this._on_close(event, account)}} color="primary" autoFocus>
                            {t( "words.close")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(AccountDialogHive);
