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

const quotes = t( "pages.home.quotes");
const random_quote_index = Math.floor(Math.random() * quotes.length);

const styles = theme => ({
    backgroundImage: {
        minHeight: "calc(100vh - 160px)",
        backgroundImage: "url(/src/images/investment-data.svg)",
        position: "relative",
        backgroundSize: "contain",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundOrigin: "content-box",
        padding: theme.spacing(8)
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
        backgroundColor: theme.palette.primary.action,
        color: theme.palette.primary.contrastText,
        "&:hover": {
            backgroundColor: theme.palette.primary.action,
        },
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        "& svg": {
            marginRight: 4
        }
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
            <div>
                <div className={classes.flashInfoContainer}>
                    <FlashInfo image="/src/images/wallet.svg" text={t( "pages.home.ready_to_start_cta")} button={t( "words.accounts")} onClick={(event) => this._go_to_url(event, "/accounts")}/>
                </div>
                <div className={classes.backgroundImage}>
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
