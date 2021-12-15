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
import HearthEmojiSvg from "../twemoji/react/2665";
import EarthEmojiSvg from "../twemoji/react/1F30D";

import get_svg_in_b64 from "../utils/svgToBase64";

const quotes = t( "pages.home.quotes");
const random_quote_index = Math.floor(Math.random() * quotes.length);

const styles = theme => ({
    root: {
        position: "relative",
        height: "100%",
    },
    backgroundImage: {
        width: "100%",
        overflow: "hidden",
        minHeight: "calc(100vh - 160px)",
        backgroundImage: "radial-gradient(ellipse farthest-corner, #2e51ff85, #ffffff00 66%), url(/src/images/world_blue.jpg)",
        position: "absolute",
        backgroundSize: "125%",
        backgroundPosition: "-100% 0%",
        backgroundRepeat: "no-repeat",
        backgroundOrigin: "border-box",
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
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
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
        backgroundColor: "rgb(240 248 255 / 50%)",
        width: "max-content",
        [theme.breakpoints.down("sm")]: {
            fontSize: 36,
        },
    },
    subtitle: {
        fontSize: 32,
        backgroundColor: "rgb(240 248 255 / 50%)",
        width: "max-content",
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
                    <FlashInfo image="data:image/png;base64,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" text={t( "pages.home.ready_to_start_cta")} button={t( "words.accounts")} onClick={(event) => this._go_to_url(event, "/accounts")}/>
                </div>
                <div className={classes.backgroundImage}>
                    <div className={classes.headerContainer}>
                        <h1 className={classes.title}>
                            <span>The <span className={classes.blue}>100% free </span></span><img src={get_svg_in_b64(<DollarEmojiSvg />)} className="emoji bounce"/><br />
                            <span>and <span className={classes.blue}>open-source</span></span><br />
                            <span><img src={get_svg_in_b64(<AngelEmojiSvg />)} className="emoji"/> crypto wallet.</span>
                        </h1>
                        <h2 className={classes.subtitle}>
                            Made with <img className={"emoji pulse"} src={get_svg_in_b64(<HearthEmojiSvg />)}/>, <br />
                            your <span className={classes.blue}>keys matters</span> <img src={get_svg_in_b64(<EarthEmojiSvg />)} className={"emoji"}/>.
                        </h2>
                        <img onClick={(e) => {this._go_to_url(e, "/gallery")}} style={{clipPath: "polygon(0% 0%, 0% 100%, calc(100% - 56%) 100%, 100% calc(100% - 56%), 100% calc(100% - 42%), calc(100% - 42%) 100%, 100% 100%, 100% 0%)", cursor: "pointer", width: "min(75vw, 75vh)"}} src={"/src/images/pixelart_card.png"}/>
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
