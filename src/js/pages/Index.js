import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import { AutoRotatingCarousel, Slide } from "material-auto-rotating-carousel";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from "@material-ui/core/Toolbar";

import AppToolbar from "../components/AppToolbar";
import AppDrawer from "../components/AppDrawer";
import AppTabs from "../components/AppTabs";

import dispatcher from "../dispatcher";
import actions from "../actions/utils";
import Home from "./Home";
import Pixel from "./Pixel";
import About from "./About";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import Accounts from "./Accounts";
import Coins from "./Coins";
import Coin from "./Coin";
import Gallery from "./Gallery";
import Unknown from "./Unknown";

import JamyAngry from "../icons/JamyAngry";
import JamyAnnoyed from "../icons/JamyAnnoyed";
import JamyFlirty from "../icons/JamyFlirty";
import JamyHappy from "../icons/JamyHappy";
import JamySad from "../icons/JamySad";
import JamyShocked from "../icons/JamyShocked";
import JamySuspicious from "../icons/JamySuspicious";

import api from "../utils/api";
import sound_api from "../utils/sound-api";
import { update_meta_title } from "../utils/meta-tags";
import { PAGE_ROUTES, HISTORY } from "../utils/constants";

const styles = theme => ({
    root: {
        display: "flex"
    },
    carouselImage: {
        padding: 32,
        maxWidth: "100%",
    },
    content: {
        flexGrow: 1
    },
    snackbar: {
        "& .MuiSnackbarContent-root	": {
            backgroundColor: theme.palette.primary.actionDarker
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
    jamyContainer: {
        display: "initial",
        height: "auto",
        width: "auto",
    },
    jamy: {
        height: 24,
        width: "auto",
        marginRight: 12,
        verticalAlign: "middle",
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
            _language: null,
            _logged_account: null,
            _snackbar_open: false,
            _snackbar_message: "",
            _snackbar_auto_hide_duration: 1975,
            _sfx_enabled: false,
            _jamy_enabled: false,
            _vocal_enabled: false,
            _onboarding_enabled: false,
            _onboarding_autoplay_enabled: true,
            _onboarding_showed_once_in_session: false,
            _selected_locales_code: null,
            _selected_currency: null,
            _panic_mode: false,
            _know_if_logged: false,
            _loaded_progress_percent: 100,
            _know_the_settings: false,
            /*is_online: true,*/
            classes: props.classes,
            _width: 0,
            _height: 0
        };
    };
    
    componentWillReceiveProps(new_props) {

        const new_pathname = new_props.location.pathname;
        const old_pathname = this.state.pathname;

        if(old_pathname !== new_pathname) {

            this._set_new_pathname_or_redirect(new_pathname);
        }
    }

    _update_dimensions = () => {

        let w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            _width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            _height = w.innerHeight|| documentElement.clientHeight || body.clientHeight;

        this.setState({_width, _height});
    };

    componentDidMount() {

        this._set_new_pathname_or_redirect(this.state.pathname);
        this._update_settings();
        this._update_login();
        dispatcher.register(this._handle_events.bind(this));

        window.addEventListener("resize", this._update_dimensions);
        this._update_dimensions();

        /*setInterval(() => {

            const { is_online } = this.state;
            if(navigator.onLine !== is_online){

                this.setState({is_online: navigator.onLine});
                actions.trigger_snackbar(
            navigator.onLine ? t("sentences.online"): t("sentences.offline"),
                    navigator.onLine ? 3500: 10500
                );
                actions.jamy_update(navigator.onLine ? "happy": "sad");
            }
        }, 1000);*/

        // Make Jamy blink every 32 sec in average.
        setInterval(() => {

            if(!Math.floor(Math.random() * 32)) {

                const { _jamy_state_of_mind } = this.state;

                this.setState({_jamy_state_of_mind: "suspicious"}, () => {

                    setTimeout(() => {

                        if(this.state._jamy_state_of_mind === "suspicious") {

                            this.setState({_jamy_state_of_mind});
                        }

                    }, 75);

                });

            }

        }, 1000);
    }

    componentWillUnmount() {

        this.state._unlisten();
        window.removeEventListener("resize", this._update_dimensions);
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

            case "LOADING_UPDATE":
                this.setState({_loaded_progress_percent: event.data.percent});
                break;
        }
    }

    _process_is_logged_result = (error, result) => {

        const _logged_account = error ? null: result;

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

        if(!error) {

            // Set new settings from query result
            const _sfx_enabled = typeof settings.sfx_enabled !== "undefined" ? settings.sfx_enabled: false;
            const _jamy_enabled = typeof settings.jamy_enabled !== "undefined" ? settings.jamy_enabled: false;
            const _selected_locales_code =  typeof settings.locales !== "undefined" ? settings.locales: "en-US";
            const _language = _selected_locales_code.split("-")[0];
            const _selected_currency = typeof settings.currency !== "undefined" ? settings.currency: "USD";
            const _panic_mode = typeof settings.panic !== "undefined" ? settings.panic: false;
            const _onboarding_enabled = typeof settings.onboarding !== "undefined" ? settings.onboarding: true;

            document.documentElement.lang = _language;
            this.setState({ _onboarding_enabled, _sfx_enabled, _jamy_enabled, _selected_locales_code, _language, _selected_currency, _panic_mode, _know_the_settings: true });
        }
    };

    _update_settings() {

        // Call the api to get results of current settings and send it to a callback function
        api.get_settings(this._process_settings_query_result);
    }

    _set_new_pathname_or_redirect = (new_pathname) => {
        
        const { pathname, _history, _logged_account } = this.state;

        if(new_pathname === "/index.html") {

            _history.push("/");
        }else {

            // Set pathname
            this.setState({pathname: new_pathname});

            // set meta title
            this._set_meta_title(new_pathname);
            actions.trigger_sfx("navigation_transition-right", .25);
        }
    };

    _set_meta_title = (pathname) => {

        pathname = pathname.replace("/", "").replace(/\//g, " > ");
        update_meta_title("W.C.R. | "+ pathname);
    };

    _update_jamy = (state_of_mind, duration) => {

        this.setState({_jamy_state_of_mind: state_of_mind}, () => {

            setTimeout(() => {

                this.setState({_jamy_state_of_mind: "shocked"}, () => {

                    setTimeout(() => {

                        this.setState({_jamy_state_of_mind: "suspicious"}, () => {

                            setTimeout(() => {

                                this.setState({_jamy_state_of_mind: "shocked"});

                            }, 75);

                        });

                    }, 750);

                });
            }, duration);
        });
    }

    _trigger_snackbar = (_snackbar_message, _snackbar_auto_hide_duration) => {

        const { _snackbar_open } = this.state;

        if(_snackbar_open) {

            this.setState({_snackbar_open: false}, () => {

                setTimeout(() => {

                    this.setState({_snackbar_message, _snackbar_auto_hide_duration, _snackbar_open: true});
                }, 500);
            });
        }else {

            this.setState({_snackbar_message, _snackbar_auto_hide_duration, _snackbar_open: true});
        }
    };

    _close_snackbar = (event, reason) => {

        if (reason === "clickaway") {
            return;
        }

        this.setState({_snackbar_open: false});
    };

    _accept_close_carousel = () => {

        this.setState({_onboarding_enabled: false, _onboarding_showed_once_in_session: true});
        api.set_settings({onboarding: false});
        actions.trigger_settings_update();
    };

    _close_carousel = () => {

        this.setState({_onboarding_enabled: false, _onboarding_showed_once_in_session: true});
    };

    _stop_carousel_autoplay = () => {

        this.setState({_onboarding_autoplay_enabled: false});
    };

    render() {

        const { pathname, classes } = this.state;
        const { _snackbar_open, _snackbar_message, _snackbar_auto_hide_duration } = this.state;
        const { _onboarding_enabled, _onboarding_showed_once_in_session, _onboarding_autoplay_enabled, _width, _language } = this.state;
        const { _logged_account, _panic_mode, _know_if_logged, _loaded_progress_percent, _know_the_settings, _jamy_state_of_mind, _jamy_enabled } = this.state;

        const JAMY = {
            angry: <JamyAngry className={classes.jamy} />,
            annoyed: <JamyAnnoyed className={classes.jamy} />,
            flirty: <JamyFlirty className={classes.jamy} />,
            happy: <JamyHappy className={classes.jamy} />,
            sad: <JamySad className={classes.jamy} />,
            shocked: <JamyShocked className={classes.jamy} />,
            suspicious: <JamySuspicious className={classes.jamy} />,
        }

        // This is the custom router
        let page_component = null;
        let page_name = "";
        let page_tabs = "";
        let page_tabs_component = null;
        const page_compoments = {
            home: <Home></Home>,
            pixel: <Pixel></Pixel>,
            unknown: <Unknown></Unknown>,
            about: <About pathname={pathname}></About>,
            dashboard: <Dashboard></Dashboard>,
            settings: <Settings></Settings>,
            accounts: <Accounts></Accounts>,
            coin: <Coin pathname={pathname}></Coin>,
            coins: <Coins></Coins>,
            gallery: <Gallery pathname={pathname}></Gallery>,
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

        if(!_language) {

            return null;
        }

        return (
            <div>
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
                            {_jamy_enabled ? <span className={classes.jamyContainer}>{JAMY[_jamy_state_of_mind]}</span>: null}
                            <span>{_snackbar_message.toString()}</span>
                        </div>}
                        action={
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this._close_snackbar}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                        autoHideDuration={_snackbar_auto_hide_duration}
                        onClose={this._close_snackbar}
                    />
                    <div>
                        <AutoRotatingCarousel
                            label={t( "pages.index.carousel.button_label")}
                            onClose={this._close_carousel}
                            onStart={this._accept_close_carousel}
                            mobile={_width <= 960}
                            open={_onboarding_enabled && !_onboarding_showed_once_in_session}
                            autoplay={_onboarding_autoplay_enabled}
                            interval={6000}
                        >
                            {t( "pages.index.carousel.slides").map((slide, index) =>
                                <Slide
                                    key={index}
                                    onClick={this._stop_carousel_autoplay}
                                    media={<img className={classes.carouselImage} src={slide.img} />}
                                    mediaBackgroundStyle={{ backgroundColor: "#fff" }}
                                    style={{ backgroundColor: "#060f23" }}
                                    title={slide.title}
                                    subtitle={slide.subtitle}
                                />
                            )}
                        </AutoRotatingCarousel>
                    </div>
                    <AppToolbar
                        loaded_progress_percent={_loaded_progress_percent}
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
            </div>
        );
    }
}

export default withStyles(styles)(Index);
