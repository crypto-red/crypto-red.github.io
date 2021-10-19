import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import FlashInfo from "../components/FlashInfo";
import { HISTORY } from "../utils/constants";

import ShareIcon from "@material-ui/icons/Share";

import ShareDialog from "../components/ShareDialog";
import Fab from "@material-ui/core/Fab";
import Grow from "@material-ui/core/Grow";

import actions from "../actions/utils";

import DollarEmojiSvg from "../twemoji/react/1F911";
import AngelEmojiSvg from "../twemoji/react/1F607";
import PrivacyEmojiSvg from "../twemoji/react/1F575";
import HearthEmojiSvg from "../twemoji/react/2665";
import EarthEmojiSvg from "../twemoji/react/1F30D";

import get_svg_in_b64 from "../utils/svgToBase64";

const quotes = t( "pages.home.quotes");
const random_quote_index = Math.floor(Math.random() * quotes.length);

const styles = theme => ({
    root: {
        position: "relative",
    },
    backgroundImage: {
        width: "100%",
        minHeight: "calc(100vh - 160px)",
        backgroundImage: "url(/src/images/investment-data.svg)",
        position: "absolute",
        backgroundSize: "contain",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundOrigin: "content-box",
        padding: theme.spacing(8),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(4)
        },
    },
    flashInfoContainer: {
        padding: theme.spacing(2, 2, 0, 2),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(0)
        },
    },
    card: {
        margin: theme.spacing(1, 2)
    },
    quoteContainer: {
        margin: theme.spacing(2, 2),
        position: "absolute",
        left: 0,
        bottom: 0,
        backgroundColor: "rgba(192, 192, 192, .5)",
        borderRadius: 4,
    },
    fab: {
        position: "fixed",
        opacity: 1,
        transform: "scale(1)",
        backgroundColor: theme.palette.primary.action,
        color: theme.palette.primary.contrastText,
        transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 204ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 136ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important",
        "@global": {
            "@keyframes pulse": {
                "0%": {
                    opacity: 1,
                    transform: "scale(1)",
                },
                "50%": {
                    opacity: 0,
                    transform: "scale(1.6)",
                },
                "100%": {
                    opacity: 0,
                    transform: "scale(1.6)",
                }
            }
        },
        "&::before": {
            content: "''",
            display: "block",
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            backgroundColor: "inherit",
            borderRadius: "inherit",
            transition: "opacity .3s, transform .3s",
            animation: "$pulse 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite 4s",
            zIndex: -1,
        },
        "&:hover": {
            backgroundColor: theme.palette.primary.actionLighter,
        },
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        "& svg": {
            marginRight: 4
        },
    },
    headerContainer: {
        fontFamily: "'Saira'",
        position: "absolute",
        marginTop: theme.spacing(-2),
        color: "#000000",
        [theme.breakpoints.down("sm")]: {
            marginTop: theme.spacing(-4)
        },
    },
    title: {
        fontSize: 56,
        [theme.breakpoints.down("sm")]: {
            fontSize: 36,
        },
    },
    subtitle: {
        fontSize: 32,
        [theme.breakpoints.down("sm")]: {
            fontSize: 24,
        },
    },
    blue: {
        color: theme.palette.primary.actionLighter,
    },
});


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            _history: HISTORY,
            _is_share_dialog_open: false,
            _quote: t( "pages.home.quotes")[random_quote_index]
        };
    };

    componentDidMount() {

        actions.trigger_loading_update(0);
        setTimeout(() => {

            actions.trigger_loading_update(100);
        }, 250);
    }

    _go_to_url = (event, url) => {

        const { _history } = this.state;
        _history.push(url);
    };


    _handle_share_dialog_close = () => {

        this.setState({_is_share_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
        actions.jamy_update("suspicious");
    };

    _handle_share_dialog_open = () => {

        this.setState({_is_share_dialog_open: true});
        actions.trigger_sfx("hero_decorative-celebration-02");
        actions.jamy_update("happy");
    };

    _handle_speed_dial_close = () => {

        this.setState({_is_speed_dial_open: false});
    };

    _handle_speed_dial_open = () => {

        this.setState({_is_speed_dial_open: true});
    };

    _send_feedback = () => {

        window.open("https://github.com/crypto-red/crypto-red.github.io/discussions/categories/feedback");
    };

    _handle_speed_dial_action = (event, action) => {

        switch (action) {

            case "share":
                this._handle_share_dialog_open();
                break;

            case "feedback":
                this._send_feedback();
                break;
        }
    };

    render() {

        const { classes, _is_share_dialog_open, _quote } = this.state;


        return (
            <div className={classes.root}>
                <div className={classes.flashInfoContainer}>
                    <FlashInfo image="/src/images/wallet.svg" text={t( "pages.home.ready_to_start_cta")} button={t( "words.accounts")} onClick={(event) => this._go_to_url(event, "/accounts")}/>
                </div>
                <div className={classes.backgroundImage}>
                    <div className={classes.headerContainer}>
                        <h1 className={classes.title}>
                            <span>The <span className={classes.blue}>100% free </span></span><img src={get_svg_in_b64(<DollarEmojiSvg />)} className="emoji bounce"/><br />
                            <span>and <span className={classes.blue}>open-source</span></span><br />
                            <span><img src={get_svg_in_b64(<AngelEmojiSvg />)} className="emoji"/> crypto wallet.</span>
                        </h1>
                        <h2 className={classes.subtitle}>
                            Made with <img className={"emoji pulse"} src={get_svg_in_b64(<HearthEmojiSvg />)}/>, since <img src={get_svg_in_b64(<PrivacyEmojiSvg />)} className="emoji"/><br />
                            your <span className={classes.blue}>keys matters</span> <img src={get_svg_in_b64(<EarthEmojiSvg />)} className={"emoji"}/>.
                        </h2>
                    </div>
                    <div className={classes.quoteContainer}>
                        <blockquote>
                            “{_quote.text}”<br />
                            ― {_quote.author}
                        </blockquote>
                    </div>
                </div>
                <Grow in>
                    <Fab className={classes.fab} variant="extended" onClick={this._handle_share_dialog_open}>
                        <ShareIcon /> {t("words.share")}
                    </Fab>
                </Grow>
                <ShareDialog
                    open={_is_share_dialog_open}
                    onClose={this._handle_share_dialog_close}/>
            </div>
        );
    }
}

export default withStyles(styles)(Home);
