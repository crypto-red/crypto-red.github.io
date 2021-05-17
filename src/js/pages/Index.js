import React from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import AppToolbar from "../components/AppToolbar";
import AppDrawer from "../components/AppDrawer";
import AppTabs from "../components/AppTabs";
import Toolbar from '@material-ui/core/Toolbar';

import api from "../utils/api";

import { update_meta_title } from "../utils/meta-tags";
import { PAGE_ROUTES, HISTORY } from "../utils/constants";
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
import Snackbar from "@material-ui/core/Snackbar";

const styles = theme => ({
    root: {
        display: 'flex'
    },
    content: {
        flexGrow: 1
    },
});

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pathname: props.location.pathname,
            _history: HISTORY,
            _unlisten: null,
            _logged_account: null,
            _snackbar_open: false,
            _snackbar_message: "",
            _snackbar_auto_hide_duration: 1975,
            _selected_locales_code: null,
            _selected_currency: null,
            _panic_mode: false,
            _know_if_logged: false,
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

        actions.trigger_snackbar("This app isn't ready.", 3500);

    }

    _handle_events(event) {

        const { _history } = this.state;

        // Make different actions send from a dispatcher binded to this function
        switch(event.type) {

            case "SNACKBAR":
                this._trigger_snackbar(event.data.message, event.data.auto_hide_duration);
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

        const _logged_account = error ? {}: result;
        this.setState({_logged_account, _know_if_logged: true});
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
        const _selected_locales_code = settings.locales || "en-US";
        const _selected_currency = settings.currency || "USD";
        const _panic_mode = settings.panic || false;
        const lang = _selected_locales_code.split("-")[0];

        document.documentElement.lang = lang;
        this.setState({ _selected_locales_code, _selected_currency, _panic_mode });
    };

    _update_settings() {

        // Call the api to get results of current settings and send it to a callback function
        api.get_settings(this._process_settings_query_result);
    }

    _set_new_pathname_or_redirect = (new_pathname) => {
        
        const { pathname, _history, _logged_account } = this.state;

        // Just update pathname meta title and play sound

        // Set pathname
        this.setState({pathname: new_pathname});

        // set meta title
        this._set_meta_title(new_pathname);

    };

    _set_meta_title = (pathname) => {

        pathname = pathname.replace("/", "").replace(/\//g, " > ");
        update_meta_title("C.RED | "+ pathname);
    };

    _trigger_snackbar = (_snackbar_message, _snackbar_auto_hide_duration) => {

        this.setState({_snackbar_message, _snackbar_auto_hide_duration, _snackbar_open: true});
    };

    _close_snackbar = () => {

        this.setState({_snackbar_open: false});
    };

    render() {

        const { pathname, classes } = this.state;
        const { _snackbar_open, _snackbar_message, _snackbar_auto_hide_duration } = this.state;
        const { _logged_account, _panic_mode, _know_if_logged } = this.state;
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

        return (
            <div className={classes.root}>
                <CssBaseline />
                <Snackbar
                    open={_snackbar_open}
                    message={_snackbar_message}
                    autoHideDuration={_snackbar_auto_hide_duration}
                    onClose={this._close_snackbar}
                />
                <AppToolbar know_if_logged={_know_if_logged} logged_account={_logged_account} pathname={pathname} panic_mode={_panic_mode}/>
                <AppDrawer pathname={pathname}/>
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