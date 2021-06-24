import React from "react";
import { withStyles } from "@material-ui/core/styles";

const L = document.documentElement.lang;
import { t } from "../utils/t";

import Fade from "@material-ui/core/Fade";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";

import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import SecurityIcon from "@material-ui/icons/Security";

import Jdenticon from "react-jdenticon";
import api  from "../utils/api";
import { HISTORY } from "../utils/constants";
import InnerToolbar from "../components/InnerToolbar";
import DrawerContent from "../components/DrawerContent";
import actions from "../actions/utils";
import LinkedInIcon from "../icons/LinkedIn";

const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    swipeableDrawer: {
        width: 256,
        flexShrink: 0,
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    drawerPaper: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        width: 256
    },
    drawerButton: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    accountButton: {
        marginLeft: theme.spacing(1),
    },
    accountButtonHidden: {
        marginLeft: theme.spacing(1),
        opacity: 0
    },
    drawerToolbarSpacer: {
        minWidth: 256 - theme.spacing(2+2),
        height: 64,
        lineHeight: "64px",
        [theme.breakpoints.down("sm")]: {
            display: "none"
        },
        marginRight: theme.spacing(1),
        cursor: "pointer"
    },
    swipeableDrawerToolbar: {
        height: 64,
        lineHeight: "64px",
        marginRight: theme.spacing(1),
        cursor: "pointer"
    },
    appLogo: {
        verticalAlign: "middle",
        marginRight: theme.spacing(1)
    },
    appTitle: {
        verticalAlign: "middle",
        fontWeight: "bold",
        fontFamily: "Saira"
    },
    swipeableDrawerAppTitle: {
        verticalAlign: "middle",
        fontWeight: "bold",
        fontFamily: "Saira"
    },
    avatar: {
        backgroundColor: "transparent",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(-1.5),
        padding: theme.spacing(1.5),
        height: 48,
        width: 48,
        cursor: "pointer",
        "& div": {
            display: "inherit"
        }
    },
    jamy: {
        height: "calc(100% - 36px)",
        marginRight: theme.spacing(1),
        verticalAlign: "middle",
    },
    logo: {
        height: "calc(100% - 36px)",
        marginRight: theme.spacing(1),
        verticalAlign: "middle",
    }
});

class AppToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            pathname: props.pathname,
            panic_mode: props.panic_mode,
            logged_account: props.logged_account,
            know_if_logged: props.know_if_logged,
            know_the_settings: props.know_the_settings,
            jamy_state_of_mind: props.jamy_state_of_mind,
            jamy_enabled: props.jamy_enabled,
            _history: HISTORY,
            _swipeable_app_drawer_open: false,
            _account_menu_anchor_element: null,
            _look_much_jamy: false,
            _look_very_much_jamy: false,
            _jamy_mouse_hover: false,
            _jamy_mouse_hover_click: 0,
            _click_much_jamy: false
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState({...new_props});
    }

    _handle_open_swipeable_app_drawer = () => {
        
        this.setState({_swipeable_app_drawer_open: true});
        actions.trigger_sfx("navigation_transition-left");
    };

    _handle_close_swipeable_app_drawer = () => {

        this.setState({_swipeable_app_drawer_open: false});
        actions.trigger_sfx("navigation_transition-left");
    };

    _open_account_menu = (event) => {
      
        this.setState({_account_menu_anchor_element: event.currentTarget});
    };

    _close_account_menu = () => {

        this.setState({_account_menu_anchor_element: null});
    };

    _open_home = () => {

        const { _history } = this.state;
        _history.push("/");
    };

    _open_settings = () => {

        const { _history } = this.state;
        _history.push("/settings");
    };

    _open_accounts = () => {

        const { _history } = this.state;
        _history.push("/accounts");
    };

    _send_feedback = () => {

        window.open("https://github.com/crypto-red/crypto-red.github.io/discussions/categories/feedback");
    };

    _exit_to_app = () => {

        api.reset_all_databases(function(){

            window.location.reload();
        });
    };

    _handle_jamy_mouse_enter = () => {

        this.setState({_jamy_mouse_hover: true, _jamy_mouse_hover_click: 0, _look_much_jamy: false, _look_very_much_jamy: false, _click_much_jamy: false}, () => {

            setTimeout(() => {

                this._show_look_much_jamy();

            }, 8000);
        });
    };

    _handle_jamy_mouse_leave = () => {

        this.setState({_jamy_mouse_hover: false, _jamy_mouse_hover_click: 0, _look_much_jamy: false, _look_very_much_jamy: false, _click_much_jamy: false });
    };

    _show_look_much_jamy = () => {

        if(this.state._jamy_mouse_hover) {

            this.setState({_look_much_jamy: true}, () => {

                actions.jamy_update("suspicious", 7000);
                actions.trigger_snackbar(t(L, "sentences.the longer you look the shiner i get"));
                setTimeout(() => {

                    if(this.state._jamy_mouse_hover) {

                        this.setState({_look_very_much_jamy: true}, () => {

                            actions.jamy_update("happy", 4000);
                            actions.trigger_snackbar(t(L, "sentences.take a picture it last longer"));
                        });
                    }

                }, 7100)
            });
        }
    };

    _show_click_much_jamy = () => {

        if(this.state._jamy_mouse_hover) {

            this.setState({_click_much_jamy: true}, () => {

                actions.jamy_update("angry", 6000);
                actions.trigger_snackbar(t(L, "sentences.stop bitchslapping me"));
                setTimeout(() => {

                    this.setState({_click_much_jamy: false});
                }, 6000)
            });
        }
    };

    _handle_jamy_mouse_click = () => {

        const click = this.state._jamy_mouse_hover_click + 1;
        this.setState({_jamy_mouse_hover_click: click});

        if(click >= 16 && this.state._jamy_mouse_hover) {

            this._show_click_much_jamy();
        }
    };

    render() {

        const { classes, pathname, know_if_logged, know_the_settings, _swipeable_app_drawer_open, _account_menu_anchor_element, logged_account, panic_mode, jamy_state_of_mind, jamy_enabled } = this.state;

        return (
            <div>

                <SwipeableDrawer
                    anchor="left"
                    className={classes.swipeableDrawer}
                    classes={{paper: classes.drawerPaper}}
                    open={_swipeable_app_drawer_open}
                    onOpen={this._handle_open_swipeable_app_drawer}
                    onClose={this._handle_close_swipeable_app_drawer}>
                        <Toolbar className={classes.appBar}>
                            <div className={classes.swipeableDrawerToolbar} onClick={this._open_home}>
                                <span className={classes.swipeableDrawerAppTitle}>WALLET.CRYPTO.RED</span>
                            </div>
                        </Toolbar>
                        <DrawerContent logged_account={logged_account} pathname={pathname} onClose={this._handle_close_swipeable_app_drawer}/>
                </SwipeableDrawer>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" className={classes.drawerButton} color="inherit" aria-label="menu" onClick={this._handle_open_swipeable_app_drawer}>
                            <MenuIcon />
                        </IconButton>
                        <Fade in={know_the_settings}>
                            <div className={classes.drawerToolbarSpacer} onClick={this._open_home}>
                                {
                                    know_the_settings ?
                                        jamy_enabled ?
                                            <Tooltip
                                                title={t(L, "sentences.hey i am jamy")}
                                                aria-label="Jamy"
                                                onMouseEnter={this._handle_jamy_mouse_enter}
                                                onMouseLeave={this._handle_jamy_mouse_leave}
                                                onMouseOut={this._handle_jamy_mouse_leave}
                                                onClick={this._handle_jamy_mouse_click}>
                                                <img src={`/src/images/jamy-${jamy_state_of_mind}.svg`} className={classes.jamy}/>
                                            </Tooltip>:
                                            <img src={"/src/images/logo-transparent.png"} className={classes.logo} />
                                        : null
                                }
                                <span className={classes.appTitle}>WALLET.CRYPTO.RED</span>
                            </div>
                        </Fade>
                        <InnerToolbar know_if_logged={know_if_logged} logged_account={logged_account} pathname={pathname} />
                        <Fade in={know_if_logged}>
                            {
                                logged_account ?
                                    <Tooltip title={logged_account.name} aria-label={t(L, "sentences.account name")}>
                                        <Avatar aria-label={t(L, "words.acronym")}
                                                variant="square"
                                                className={classes.avatar}
                                                onClick={this._open_account_menu}>
                                            <Jdenticon size="24" value={logged_account.name}/>
                                        </Avatar>
                                    </Tooltip> :
                                    <IconButton className={know_if_logged ? classes.accountButton: classes.accountButtonHidden}
                                                edge="end"
                                                aria-haspopup="true"
                                                color="inherit"
                                                onClick={this._open_account_menu}>
                                        <AccountCircleIcon/>
                                    </IconButton>
                            }
                        </Fade>
                        <Menu anchorEl={_account_menu_anchor_element}
                            anchorOrigin={{ vertical: "top", horizontal: "right"}}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "right",}}
                            open={Boolean(_account_menu_anchor_element)}
                            onClose={this._close_account_menu} >
                            <MenuItem onClick={this._open_accounts}>
                                <ListItemIcon>
                                    <AccountCircleIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={t(L, "sentences.all accounts")}/>
                            </MenuItem>
                            <MenuItem onClick={this._open_settings}>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={t(L, "words.settings", {}, {FLC: true})}/>
                            </MenuItem>
                            {
                                Boolean(panic_mode) ?
                                <div>
                                    <Divider />
                                    <MenuItem onClick={this._exit_to_app}>
                                        <ListItemIcon>
                                            <SecurityIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t(L, "words.settings", {}, {TUC: true})}/>
                                    </MenuItem>
                                </div>: null
                            }

                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(AppToolbar);
