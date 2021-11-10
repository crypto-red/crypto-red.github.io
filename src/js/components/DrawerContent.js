import React from "react";
import { NavLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

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
import Badge from "@material-ui/core/Badge";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PersonIcon from "@material-ui/icons/Person";
import CodeIcon from "@material-ui/icons/Code";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import RefreshIcon from "@material-ui/icons/Refresh";
import HelpIcon from "@material-ui/icons/Help";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import InfoIcon from "@material-ui/icons/Info";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import LockIcon from "@material-ui/icons/Lock";
import AtmIcon from "@material-ui/icons/Atm";
import FeedbackIcon from "@material-ui/icons/Feedback";
import ForumIcon from "@material-ui/icons/Forum";
import ChemistryEmojiIcon from "../twemoji/react/1F9Ea";
import CoolEmojiSvg from "../twemoji/react/1F60E";

import QrCodeScanIcon from "../icons/QrCodeScan";
import CryptDialog from "../components/CryptDialog";

import QRCodeToolsDialog from "../components/QRCodeToolsDialog";
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
    iconLeft: {
        color: theme.palette.secondary.contrastText,
        marginRight: theme.spacing(1),
        height: "1.25em",
    },
    iconRight: {
        color: theme.palette.secondary.contrastText,
        marginLeft: theme.spacing(1),
        height: "1.25em",
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
    },
    coinAvatar: {
        "& .MuiAvatar-img": {
            objectFit: "initial",
        },
    },
    styledBadgeConnected: {
        "& .MuiBadge-badge": {
            backgroundColor: "#44b700",
            color: "#44b700",
            boxShadow: `0 0 0 2px ${theme.palette.secondary.main}`,
            "&::after": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: "$ripple 1.2s infinite ease-in-out",
                border: "1px solid currentColor",
                content: "\"\"",
            },
        },
        "@global": {
            "@keyframes ripple": {
                "0%": {
                    transform: "scale(.8)",
                    opacity: 1,
                },
                "100%": {
                    transform: "scale(2.4)",
                    opacity: 0,
                },
            }
        }
    },
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
            _is_qr_dialog_open: false,
            _should_open_help_dialogs: {
                topup: false,
                mixer: false,
                swap: false
            },
            _help_dialogs_data: t( "components.drawer_content.help_dialogs_data")

        };
    };

    componentDidMount() {

        this._update_settings();
    }

    componentWillReceiveProps(new_props) {

        this.setState({...new_props, _help_dialogs_data: t( "components.drawer_content.help_dialogs_data")});
    }

    _process_settings_query_result = (error, settings) => {

        // Set new settings from query result
        const _should_open_help_dialogs = settings.help || {
            topup: true,
            mixer: true,
            swap: true
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

    _open_pixel_page = () => {

        const { _history } = this.state;

        _history.push("/pixel");
        this.props.onClose();
    };

    _open_gallery_page = () => {

        const { _history } = this.state;

        _history.push("/gallery");
        this.props.onClose();
    };

    _open_about_page = (sub_path) => {

        const { _history } = this.state;

        _history.push("/about/"+sub_path);
        this.props.onClose();
    };

    _open_link = (event, url) =>{

        window.open(url);
    };

    _open_help_dialog = (_current_help_dialog_id) => {

        this.setState({_current_help_dialog_id, _is_help_dialog_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _on_settings_changed = () => {

        actions.trigger_settings_update();
    };

    _on_close_help_dialog = (event, _current_help_dialog_id, _current_help_dialog_checkbox, not_open_link = true, set_dont_show_again = false) => {

        const { _help_dialogs_data, _should_open_help_dialogs } = this.state;

        if(_current_help_dialog_checkbox && set_dont_show_again) {

            let help = _should_open_help_dialogs;
            help[_current_help_dialog_id] = !_current_help_dialog_checkbox;

            api.set_settings({help}, this._on_settings_changed);
        }

        this.setState({_is_help_dialog_open: false}, () => {

            if(!not_open_link) {

                const url = _help_dialogs_data[_current_help_dialog_id].url;
                this._open_link(null, url);
                actions.trigger_sfx("state-change_confirm-up");
            }else {

                actions.trigger_sfx("state-change_confirm-down");
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

            this._open_link(null, url);
        }
    };

    _open_crypt_dialog = () => {

        this.setState({_is_crypt_dialog_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _close_crypt_dialog = () => {

        this.setState({_is_crypt_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
    };
    
    _open_qr_dialog = () => {

        this.setState({_is_qr_dialog_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _close_qr_dialog = () => {

        this.setState({_is_qr_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
    };

    _handle_current_help_dialog_checkbox_change = (event) => {

        const checked = event.target.checked;
        this.setState({_current_help_dialog_checkbox: checked});

        if(checked){

            actions.trigger_sfx("ui_lock");
        }else {

            actions.trigger_sfx("ui_unlock");
        }
    };

    render() {

        const { classes, logged_account, _menu_expanded, _is_help_dialog_open, _help_dialogs_data, _current_help_dialog_id, _current_help_dialog_checkbox, _is_crypt_dialog_open, _is_qr_dialog_open } = this.state;
        
        const coinListItem = COINS.map((coin) => {

            const disabled = Boolean(coin.id.includes("hive") && !(logged_account || {}).hive_username);

            return (
                <ListItem button disabled={disabled} className={classes.nested} key={coin.id} onClick={!disabled ? () => {this._open_coin_id(coin.id)}: null}>
                    <ListItemAvatar>
                        <Avatar className={classes.coinAvatar} alt={coin.name} src={coin.image_url} variant="square" />
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
                <QRCodeToolsDialog
                    open={_is_qr_dialog_open}
                    onClose={this._close_qr_dialog}
                />
                <Dialog
                    open={_is_help_dialog_open}
                    onClose={(event) => {this._on_close_help_dialog(event, _current_help_dialog_id, _current_help_dialog_checkbox)}}
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
                                            label={t( "components.drawer_content.dont_show_again")}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={(event) => {this._on_close_help_dialog(event, _current_help_dialog_id, _current_help_dialog_checkbox, true, true)}} color="primary">{t( "words.close")}</Button>
                                        <Button onClick={(event) => {this._on_close_help_dialog(event, _current_help_dialog_id, _current_help_dialog_checkbox, false, true)}} color="primary" autoFocus>
                                            {t( "components.drawer_content.go")}
                                        </Button>
                                    </DialogActions>
                                </div>
                            </div>: null
                    }
                </Dialog>
                <Fade in timeout={500}>
                    <List>
                        <ListItem button onClick={this._open_gallery_page}>
                            <ChemistryEmojiIcon className={classes.iconLeft}/>
                            <ListItemText primary={"NFTs [Pixel Art]"} />
                        </ListItem>
                        <ListItem button onClick={this._open_dashboard_page}>
                            <ListItemText primary={t( "components.drawer_content.menu.dashboard")} />
                        </ListItem>
                        <ListItem button onClick={this._open_coins_page}>
                            <ListItemText primary={t( "components.drawer_content.menu.all_coins")} />
                        </ListItem>
                        <ListItem button onClick={(event) => this._handle_menu_expanded_change(event, "coins")}>
                            <ListItemText primary={t( "components.drawer_content.menu.coins")} />
                            <ExpandMoreIcon  className={_menu_expanded === "coins" ? classes.flipExpandMoreIcon: classes.expandMoreIcon}/>
                        </ListItem>
                        <Collapse in={_menu_expanded === "coins"} timeout="auto" unmountOnExit>
                            <List button component="div" disablePadding>
                                {coinListItem}
                            </List>
                        </Collapse>
                        <ListItem button onClick={(event) => this._handle_menu_expanded_change(event, "trade")}>
                            <ListItemText primary={t( "components.drawer_content.menu.trade.trade")} />
                            <ExpandMoreIcon  className={_menu_expanded === "trade" ? classes.flipExpandMoreIcon: classes.expandMoreIcon}/>
                        </ListItem>
                        <Collapse in={_menu_expanded === "trade"} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested} onClick={(event) => {this._should_open_help_dialog(event, "topup")}}>
                                    <ListItemIcon><SwapVertIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.trade.top_up")} />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => {this._should_open_help_dialog(event, "mixer")}}>
                                    <ListItemIcon><RefreshIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.trade.mixer")} />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => {this._should_open_help_dialog(event, "swap")}}>
                                    <ListItemIcon><SwapHorizIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.trade.swap")} />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => {this._open_link(event, "https://coinatmradar.com/")}}>
                                    <ListItemIcon><AtmIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.trade.atm")} />
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem button onClick={(event) => this._handle_menu_expanded_change(event, "tools")}>
                            <ListItemText primary={t( "components.drawer_content.menu.tools.tools")} />
                            <ExpandMoreIcon  className={_menu_expanded === "tools" ? classes.flipExpandMoreIcon: classes.expandMoreIcon}/>
                        </ListItem>
                        <Collapse in={_menu_expanded === "tools"} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested} onClick={(event) => {this._open_crypt_dialog(event)}}>
                                    <ListItemIcon><LockIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.tools.crypt")} />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => {this._open_qr_dialog(event)}}>
                                    <ListItemIcon><QrCodeScanIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.tools.qr")} />
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem button onClick={(event) => this._handle_menu_expanded_change(event, "about")}>
                            <ListItemText primary={t( "components.drawer_content.menu.about.about")} />
                            <ExpandMoreIcon  className={_menu_expanded === "about"  ? classes.flipExpandMoreIcon: classes.expandMoreIcon}/>
                        </ListItem>
                        <Collapse in={_menu_expanded === "about"} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested} onClick={() => this._open_about_page("info")}>
                                    <ListItemIcon><InfoIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.about.info")} />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={() => this._open_about_page("wiki")}>
                                    <ListItemIcon><ChromeReaderModeIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.about.wiki")} />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={() => this._open_about_page("faq")}>
                                    <ListItemIcon><HelpIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.about.faq")} />
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem button onClick={(event) => this._handle_menu_expanded_change(event, "more")}>
                            <ListItemText primary={t( "components.drawer_content.menu.more.more")} />
                            <ExpandMoreIcon  className={_menu_expanded === "more"  ? classes.flipExpandMoreIcon: classes.expandMoreIcon}/>
                        </ListItem>
                        <Collapse in={_menu_expanded === "more"} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested} onClick={(event) => this._open_link(event, "https://github.com/crypto-red/crypto-red.github.io/graphs/contributors")}>
                                    <ListItemIcon><PersonIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.more.contributors")} />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => this._open_link(event, "https://github.com/crypto-red/crypto-red.github.io")}>
                                    <ListItemIcon><CodeIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.more.source_code")} />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => this._open_link(event, "https://github.com/crypto-red/crypto-red.github.io/releases")}>
                                    <ListItemIcon><CloudDownloadIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.more.download")} />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => this._open_link(event, "https://t.me/walletcryptored")}>
                                    <Badge className={classes.styledBadgeConnected} overlap="circular" badgeContent=" " variant="dot">
                                        <ListItemIcon><ForumIcon className={classes.iconColor} /></ListItemIcon>
                                    </Badge>
                                    <ListItemText primary="Telegram" />
                                </ListItem>
                                <ListItem button className={classes.nested} onClick={(event) => {this._open_link(event, "https://forms.gle/iuEXqM2Nx61qwmPJ7")}}>
                                    <ListItemIcon><FeedbackIcon className={classes.iconColor} /></ListItemIcon>
                                    <ListItemText primary={t( "components.drawer_content.menu.more.feedback")} />
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
