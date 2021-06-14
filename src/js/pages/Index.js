import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

import Snackbar from "@material-ui/core/Snackbar";
import Toolbar from "@material-ui/core/Toolbar";

import AppToolbar from "../components/AppToolbar";
import AppDrawer from "../components/AppDrawer";
import AppTabs from "../components/AppTabs";

import dispatcher from "../dispatcher";
import actions from "../actions/utils";
import Home from "./Home";
import About from "./About";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import Accounts from "./Accounts";
import Coins from "./Coins";
import Coin from "./Coin";
import Unknown from "./Unknown";

import Slide from "@material-ui/core/Slide";

import api from "../utils/api";
import sound_api from "../utils/sound-api";
import { update_meta_title } from "../utils/meta-tags";
import { PAGE_ROUTES, HISTORY } from "../utils/constants";

const styles = theme => ({
    root: {
        display: "flex"
    },
    content: {
        flexGrow: 1
    },
    snackbar: {
        "& .MuiSnackbarContent-root	": {
            backgroundColor: theme.palette.primary.dark
        }
    },
    snackbarSuccess: {
        "& .MuiSnackbarContent-root	": {
            backgroundColor: "#06230e"
        }
    },
    snackbarWarning: {
        "& .MuiSnackbarContent-root	": {
            backgroundColor: "#202306"
        }
    },
    snackbarError: {
        "& .MuiSnackbarContent-root	": {
            backgroundColor: "#230606"
        }
    },
});

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pathname: props.location.pathname,
            _jamy_state_of_mind: "shocked",
            _history: HISTORY,
            _unlisten: null,
            _logged_account: null,
            _snackbar_open: false,
            _snackbar_message: "",
            _snackbar_auto_hide_duration: 1975,
            _sfx_enabled: true,
            _jamy_enabled: true,
            _vocal_enabled: false,
            _selected_locales_code: null,
            _selected_currency: null,
            _panic_mode: false,
            _know_if_logged: false,
            _logged_once: false,
            _know_the_settings: false,
            is_online: true,
            classes: props.classes,
        };
    };
    
    componentWillReceiveProps(new_props) {

        const new_pathname = new_props.location.pathname;
        const old_pathname = this.state.pathname;

        if(old_pathname !== new_pathname) {

            this._set_new_pathname_or_redirect(new_pathname);
        }
    }

    componentDidMount() {

        this._update_settings();
        this._update_login();
        dispatcher.register(this._handle_events.bind(this));

        setInterval(() => {

            const { is_online } = this.state;
            if(navigator.onLine !== is_online){

                this.setState({is_online: navigator.onLine});
                actions.trigger_snackbar(
            navigator.onLine ? "We're online!": "We're offline!",
                    navigator.onLine ? 3500: 10500
                );
                actions.jamy_update(navigator.onLine ? "happy": "sad");
            }
        }, 1000)
    }

    _trigger_sound = (category, pack, name, volume) => {

        sound_api.play_sound(category, pack, name, volume);
    };

    _handle_events(event) {

        const { _sfx_enabled } = this.state;

        // Make different actions send from a dispatcher bounded to this function
        switch(event.type) {

            case "TRIGGER_SFX":
                if(_sfx_enabled) { this._trigger_sound("sfx", event.data.pack, event.data.name, event.data.volume); }
                break;

            case "SNACKBAR":
                this._trigger_snackbar(event.data.message, event.data.auto_hide_duration);
                break;

            case "JAMY_UPDATE":
                this._update_jamy(event.data.state_of_mind, event.data.duration);
                break;

            case "LOGIN_UPDATE":
                this._update_login();
                break;

            case "SETTINGS_UPDATE":
                this._update_settings();
                break;
        }
    }

    _process_is_logged_result = (error, result) => {

        const { _logged_once } = this.state;
        const _logged_account = error ? {}: result;

        if(!_logged_account && !_logged_once){

            actions.trigger_snackbar("Multi-cryptocurrency wallet in ReactJS.", 3000);

            setTimeout(() => {

                actions.trigger_snackbar("Open-source, for free, for everyone, forever.", 4000);
            }, 4500);

        }

        this.setState({_logged_account, _know_if_logged: true, _logged_once: true});
    };

    _is_logged = () => {

        api.is_logged(this._process_is_logged_result);
    };

    _update_login = () => {

        this.setState({_know_if_logged: false}, () => {

            this._is_logged();
        });
    };

    _process_settings_query_result = (error, settings) => {

        // Set new settings from query result
        const _sfx_enabled = typeof settings.sfx_enabled !== "undefined" ? settings.sfx_enabled: true;
        const _jamy_enabled = typeof settings.jamy_enabled !== "undefined" ? settings.jamy_enabled: true;
        const _selected_locales_code = settings.locales || "en-US";
        const _selected_currency = settings.currency || "USD";
        const _panic_mode = settings.panic || false;
        const lang = _selected_locales_code.split("-")[0];

        document.documentElement.lang = lang;
        this.setState({ _sfx_enabled, _jamy_enabled, _selected_locales_code, _selected_currency, _panic_mode, _know_the_settings: true });
    };

    _update_settings() {

        // Call the api to get results of current settings and send it to a callback function
        api.get_settings(this._process_settings_query_result);
    }

    _set_new_pathname_or_redirect = (new_pathname) => {
        
        const { pathname, _history, _logged_account } = this.state;

        // Set pathname
        this.setState({pathname: new_pathname});

        // set meta title
        this._set_meta_title(new_pathname);
        actions.trigger_sfx("navigation_transition-right", .25);
    };

    _set_meta_title = (pathname) => {

        pathname = pathname.replace("/", "").replace(/\//g, " > ");
        update_meta_title("CR-WALLET | "+ pathname);
    };

    _update_jamy = (state_of_mind, duration) => {

        this.setState({_jamy_state_of_mind: state_of_mind}, () => {

            setTimeout(() => {

                this.setState({_jamy_state_of_mind: "shocked"});
            }, duration);
        });
    }

    _trigger_snackbar = (_snackbar_message, _snackbar_auto_hide_duration) => {

        this.setState({_snackbar_message, _snackbar_auto_hide_duration, _snackbar_open: true});
    };

    _close_snackbar = () => {

        this.setState({_snackbar_open: false});
    };

    render() {

        const { pathname, classes } = this.state;
        const { _snackbar_open, _snackbar_message, _snackbar_auto_hide_duration } = this.state;
        const { _logged_account, _panic_mode, _know_if_logged, _know_the_settings, _jamy_state_of_mind, _jamy_enabled } = this.state;

        // This is the custom router
        let page_component = null;
        let page_name = "";
        let page_tabs = "";
        let page_tabs_component = null;
        const page_compoments = {
            home: <Home></Home>,
            unknown: <Unknown></Unknown>,
            about: <About pathname={pathname}></About>,
            dashboard: <Dashboard></Dashboard>,
            settings: <Settings></Settings>,
            accounts: <Accounts></Accounts>,
            coin: <Coin pathname={pathname}></Coin>,
            coins: <Coins></Coins>
        };

        for(let i = 0; i < PAGE_ROUTES.length; i++) {

            const page_route = PAGE_ROUTES[i];

            if(pathname.match(page_route.page_regex)){

                page_name = page_route.page_name;
                page_tabs = page_route.tabs;
                page_tabs_component = page_tabs !== "" ?
                    <AppTabs pathname={pathname} tabs={page_tabs}/>:
                    null;
                page_component = page_compoments[page_name];
            }
        }

        const snack_bar_msg_lwc = _snackbar_message.toString().toLowerCase();
        let snackbar_class =
            snack_bar_msg_lwc.includes("error") ? classes.snackbarError:
                snack_bar_msg_lwc.includes("waring") ? classes.snackbarWarning:
                    snack_bar_msg_lwc.includes("success") ? classes.snackbarSuccess:
                    classes.snackbar;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <Snackbar
                    className={classes.snackbar}
                    open={_snackbar_open}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                    message={<div>
                        {_jamy_enabled ? <img src={`/src/images/jamy-${_jamy_state_of_mind}.svg`} style={{height: 24, marginRight: 12, verticalAlign: "middle"}}/>: null}
                        <span>{_snackbar_message.toString()}</span>
                    </div>}
                    autoHideDuration={_snackbar_auto_hide_duration}
                    onClose={this._close_snackbar}
                />
                <AppToolbar
                    know_if_logged={_know_if_logged}
                    know_the_settings={_know_the_settings}
                    logged_account={_logged_account}
                    pathname={pathname}
                    panic_mode={_panic_mode}
                    jamy_enabled={_jamy_enabled}
                    jamy_state_of_mind={_jamy_state_of_mind}/>
                <AppDrawer
                    pathname={pathname}
                    logged_account={_logged_account}/>
                <main className={classes.content}>
                    <Toolbar />
                    {page_tabs_component}
                    {page_component}
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Index);
