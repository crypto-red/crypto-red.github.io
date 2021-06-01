import React from "react";
import { NavLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import Fade from "@material-ui/core/Fade";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CodeIcon from "@material-ui/icons/Code";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import RefreshIcon from "@material-ui/icons/Refresh";
import HelpIcon from "@material-ui/icons/Help";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import InfoIcon from "@material-ui/icons/Info";
import LockIcon from "@material-ui/icons/Lock";

import CryptDialog from "../components/CryptDialog";

import { HISTORY, COINS } from "../utils/constants";
import api from "../utils/api";
import actions from "../actions/utils";

const styles = theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    iconColor: {
        color: theme.palette.secondary.contrastText
    },
    flipExpandMoreIcon: {
        transform: "rotate(180deg)",
        transition: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
    },
    expandMoreIcon: {
        transform: "rotate(0deg)",
        transition: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
    },
    dialogInner: {
        display: "inherit",
        "&:hover div:first-child": {
            backgroundSize: "90% auto"
        }
    },
    dialogImage: {
        display: "inline-block",
        padding: theme.spacing(2),
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "300% auto",
        width: 320,
        transition: "background-size 300ms ease-in-out 0ms",
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    dialogContent: {
        display: "inline-block"
    },
    whiteLinks: {
        margin: theme.spacing(2),
        textAlign: "center",
        color: "#ffffff",
        "& a": {
            color: "inherit"
        }
    }
});

class DrawerContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            pathname: props.pathname,
            logged_account: props.logged_account,
            _history: HISTORY,
            _menu_expanded: "coins", // coins, trade, about
            _current_help_dialog_id: "topup",
            _is_help_dialog_open: false,
            _is_crypt_dialog_open: false,
            _should_open_help_dialogs: {
                topup: false,
                mixer: false,
                convert: false
            },
            _help_dialogs_data: {
                topup: {
                    id: "topup",
                    url: "https://changelly.com/",
                    image: "card-dark.svg",
                    title: "Do you know how to top up?",
                    body: "To add fund to one of your cryptocurrencies, you have to pass trough an exchange.",
                    help_link: "/about/wiki/topup",
                    help_link_content: "Learn more..."
                },
                mixer: {
                    id: "mixer",
                    url: "https://blender.io/",
                    image: "banknote-dark.svg",
                    title: "Do you know how and why to use a mixer?",
                    body: "To obfuscate the source of your coin, you can use a mixer, it will make it difficult to link two wallet together.",
                    help_link: "/about/wiki/mixer",
                    help_link_content: "Learn more..."
                },
                convert: {
                    id: "convert",
                    url: "https://swapspace.co?ref=6264baf9e63aa11df52cd6d3",
                    image: "currency-dark.svg",
                    title: "Do you know how to trade your assets?",
                    body: "To exchange one currency to another, you have to pass trough an swap platform.",
                    help_link: "/about/wiki/convert",
                    help_link_content: "Learn more..."
                },
            }

        };
    };

    componentDidMount() {

        this._update_settings();
    }

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    _process_settings_query_result = (error, settings) => {

        // Set new settings from query result
        const _should_open_help_dialogs = settings.help || {
            topup: true,
            mixer: true,
            convert: true
        };

        this.setState({ _should_open_help_dialogs });
    };

    _update_settings() {

        // Call the api to get results of current settings and send it to a callback function
        api.get_settings(this._process_settings_query_result);
    }

    _handle_menu_expanded_change = (event, _new_menu_expanded) => {

        const { _menu_expanded } = this.state;

        if(_menu_expanded === _new_menu_expanded) {

            this.setState({_menu_expanded: ""})
        }else {

            this.setState({_menu_expanded: _new_menu_expanded})
        }
    };
    _open_coin_id = (id) => {
      
        const { _history, pathname } = this.state;

        let coins_tab = pathname.split("/")[1] === "coins" ?
            pathname.split("/")[3] || "":
            "";

        coins_tab = coins_tab.length >= 1 ? "/" + coins_tab: "";

        _history.push("/coins/"+id+coins_tab);
        this.props.onClose();
    };

    _open_coins_page = () => {
        
        const { _history } = this.state;
        
        _history.push("/coins");
        this.props.onClose();
    };

    _open_dashboard_page = () => {

        const { _history } = this.state;

        _history.push("/dashboard");
        this.props.onClose();
    };

    _open_about_page = (sub_path) => {

        const { _history } = this.state;

        _history.push("/about/"+sub_path);
        this.props.onClose();
    };

    open_link = (event, url) =>{

        window.open(url);
    };

    _open_help_dialog = (_current_help_dialog_id) => {

        this.setState({_current_help_dialog_id, _is_help_dialog_open: true});
    };

    _on_settings_changed = () => {

        actions.trigger_settings_update();
    };

    _on_close_help_dialog = (event, _current_help_dialog_id, _current_help_dialog_checkbox, just_close = false) => {

        const { _help_dialogs_data, _should_open_help_dialogs } = this.state;

        if(_current_help_dialog_checkbox && !just_close) {

            let help = _should_open_help_dialogs;
            help[_current_help_dialog_id] = !_current_help_dialog_checkbox;

            api.set_settings({help}, this._on_settings_changed);
        }

        this.setState({_is_help_dialog_open: false}, () => {

            if(!just_close) {

                const url = _help_dialogs_data[_current_help_dialog_id].url;
                this.open_link(null, url);
            }

            this.props.onClose();
        });


        this.setState({_current_help_dialog_checkbox: false});
    };

    _should_open_help_dialog = (event, help_dialog_id) => {

        const { _should_open_help_dialogs, _help_dialogs_data } = this.state;
        const should_open_help_dialog = _should_open_help_dialogs[help_dialog_id];
        const url = _help_dialogs_data[help_dialog_id].url;

        if(should_open_help_dialog) {

            this._open_help_dialog(help_dialog_id);
        }else {

            this.open_link(null, url);
        }
    };

    _open_crypt_dialog = () => {

        this.setState({_is_crypt_dialog_open: true});
    };

    _close_crypt_dialog = () => {

        this.setState({_is_crypt_dialog_open: false});
    };

    _handle_current_help_dialog_checkbox_change = (event) => {

        this.setState({_current_help_dialog_checkbox: event.target.checked})
    };

    render() {

        const { classes, logged_account, _menu_expanded, _is_help_dialog_open, _help_dialogs_data, _current_help_dialog_id, _current_help_dialog_checkbox, _is_crypt_dialog_open } = this.state;
        
        const coinListItem = COINS.map((coin, coinIndex, coins) => {
           
            return (
                <ListItem button className={classes.nested} key={coin.id} onClick={() => {this._open_coin_id(coin.id)}}>
                    <ListItemAvatar>
                        <Avatar alt={coin.name} src={coin.image_url} variant="square" />
                        </ListItemAvatar>
                    <ListItemText primary={coin.name} />
                </ListItem>
            );
        });

        return (
            <div>
                <CryptDialog
                    open={_is_crypt_dialog_open}
                    onClose={this._close_crypt_dialog}
                    logged_account={logged_account}/>
                <Dialog
                    open={_is_help_dialog_open}
                    onClose={(event) => {this._on_close_help_dialog(event, _current_help_dialog_id, _current_help_dialog_checkbox, true)}}
                    aria-labelledby="help-dialog-title"
                    aria-describedby="help-dialog-description"
                >
                    {
                        Boolean(_help_dialogs_data[_current_help_dialog_id]) ?
                            <div className={classes.dialogInner}>
                                <div className={classes.dialogImage} style={{backgroundImage: `url(/src/images/${_help_dialogs_data[_current_help_dialog_id].image})`}}/>
                                <div className={classes.dialogContent}>
                                    <DialogTitle id="help-dialog-title">{_help_dialogs_data[_current_help_dialog_id].title}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="help-dialog-description">
                                            <span>{_help_dialogs_data[_current_help_dialog_id].body} <NavLink onClick={(event) => {this._on_close_help_dialog(event, _current_help_dialog_id, _current_help_dialog_checkbox, true)}} to={_help_dialogs_data[_current_help_dialog_id].help_link}>{_help_dialogs_data[_current_help_dialog_id].help_link_content}</NavLink></span>
                                        </DialogContentText>
                                        <FormControlLabel
                                            control={<Checkbox checked={_current_help_dialog_checkbox} onChange={this._handle_current_help_dialog_checkbox_change} name="persistent" />}
                                            label="Don't show it again"
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={(event) => {this._on_close_help_dialog(event, _current_help_dialog_id, _current_help_dialog_checkbox, true)}} color="primary">Cancel</Button>
                                        <Button onClick={(event) => {this._on_close_help_dialog(event, _current_help_dialog_id, _current_help_dialog_checkbox)}} color="primary" autoFocus>
                                            GO
                                        </Button>
                                    </DialogActions>
                                </div>
                            </div>: null
                    }
                </Dialog>
                <Fade in timeout={500}>
                    <List>
                        <ListItem button onClick={this._open_dashboard_page}>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button onClick={this._open_coins_page}>
                            <ListItemText primary="All coins" />
                        </ListItem>
                        <ListItem button onClick={(event) => this._handle_menu_expanded_change(event, "coins")}>
                            <ListItemText primary="Coins" />
                            <ExpandMoreIcon  className={_menu_expanded === "coins" ? classes.flipExpandMoreIcon: classes.expandMoreIcon}/>
                        </ListItem>
                        <Collapse in={_menu_expanded === "coins"} timeout="auto" unmountOnExit>
                            <List button component="div" disablePadding>
                                {coinListItem}
                            </List>
                        </Collapse>
                        <ListItem button onClick={(event) => this._handle_menu_expanded_change(event, "trade")}>
                            <ListItemText primary="Trade" />
                            <ExpandMoreIcon  className={_menu_expanded === "trade" ? classes.flipExpandMoreIcon: classes.expandMoreIcon}/>
                        </ListItem>
                        <Collapse in={_menu_expanded === "trade"} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested} onClick={(event) => {this._should_open_help_dialog(event, "topup")}}>
                                    <ListItemIcon><SwapVertIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary="Top up" />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => {this._should_open_help_dialog(event, "mixer")}}>
                                    <ListItemIcon><RefreshIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary="Mixer" />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => {this._should_open_help_dialog(event, "convert")}}>
                                    <ListItemIcon><SwapHorizIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary="Convert" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem button onClick={(event) => this._handle_menu_expanded_change(event, "tools")}>
                            <ListItemText primary="Tools" />
                            <ExpandMoreIcon  className={_menu_expanded === "tools" ? classes.flipExpandMoreIcon: classes.expandMoreIcon}/>
                        </ListItem>
                        <Collapse in={_menu_expanded === "tools"} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested} onClick={(event) => {this._open_crypt_dialog(event)}}>
                                    <ListItemIcon><LockIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary="Crypt" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem button onClick={(event) => this._handle_menu_expanded_change(event, "about")}>
                            <ListItemText primary="About" />
                            <ExpandMoreIcon  className={_menu_expanded === "about"  ? classes.flipExpandMoreIcon: classes.expandMoreIcon}/>
                        </ListItem>
                        <Collapse in={_menu_expanded === "about"} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested} onClick={() => this._open_about_page("info")}>
                                    <ListItemIcon><InfoIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary="Info" />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={() => this._open_about_page("wiki")}>
                                    <ListItemIcon><ChromeReaderModeIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary="Wiki" />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={() => this._open_about_page("faq")}>
                                    <ListItemIcon><HelpIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary="F.A.Q." />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => this.open_link(event, "https://github.com/crypto-red/crypto-red.github.io")}>
                                    <ListItemIcon><CodeIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary="Source code" />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => this.open_link(event, "https://opencollective.com/crypto-red")}>
                                    <ListItemIcon><MonetizationOnIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary="Donations" />
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(DrawerContent);
