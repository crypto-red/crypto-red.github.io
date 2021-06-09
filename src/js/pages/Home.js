import React from "react";
import { withStyles } from "@material-ui/core/styles";

import FlashInfo from "../components/FlashInfo";
import { HISTORY } from "../utils/constants";

import ShareIcon from "@material-ui/icons/Share";

import ShareDialog from "../components/ShareDialog";
import Fab from "@material-ui/core/Fab";
import Grow from "@material-ui/core/Grow";
import actions from "../actions/utils";

const quotes = [
    {author: "Charlie Chaplin", text: "You, the people have the power - the power to create machines. The power to create happiness! You, the people, have the power to make this life free and beautiful, to make this life a wonderful adventure."},
    {author: "Unknown", text: "Know that the heavens were created to descend into the five elemental manifestations. One piece, a small mirror of all others. It is all the same. All the same. Each piece of existence is its own small universe."},
    {author: "Nikola Tesla", text: "What we now want is closer contact and better understanding between individuals and communities all over the earth, and the elimination of egoism and pride which is always prone to plunge the world into primeval barbarism and strife... Peace can only come as a natural consequence of universal enlightenment..."},
    {author: "Eric Schmidt", text: "Bitcoin is a remarkable cryptographic achievement and the ability to create something that is not duplicate in the digital world has enormous value."},
    {author: "Oscar Wilde", text: "Man is least himself when he talks in his own person. Give him a mask, and he will tell you the truth."},
    {author: "Elon Musk", text: "Being able to talk to people over long distances, to transmit images, flying, accessing vast amounts of data like an oracle. These are all things that would have been considered magic a few hundred years ago. So engineering is for all intents and purposes, magic, and who wouldn't want to be a magician?"},
    {author: "Unknown", text: "If the word government literally means \"to control the mind,\" wouldn't learning to control your own mind negate the opportunity for outside government? You see, it's the simple act of asking questions that exemplifies the Achilles heel of the control system; you can condition animals, but if humans ask questions, they can learn the path to freedom."},
    {author: "Unknown", text: "Truth cannot be taught. It must be experienced therefore always consider the inner light of understanding before the outer light of common dogma."},
    {author: "Gandhi", text: "There are many causes I would die for. There is not a single cause I would kill for."},
    {author: "Unknown", text: "You know what, sometimes I really do not know what needs to be done here on earth to get the people moving because they are still sitting in their chair. And I do not refer to violent rebellion of some kind. No, I am talking about making connection. Unite."},
];

const random_quote_index = Math.floor(Math.random() * quotes.length);
const quote = quotes[random_quote_index];

const styles = theme => ({
    backgroundImage: {
        minHeight: "calc(100vh - 160px)",
        backgroundImage: "url(/src/images/logo-transparent.png)",
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
            _quote: quote
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
                    <FlashInfo image="/src/images/wallet.svg" text="Ready to start now? Create a new anonymous wallet!" button="ACCOUNTS" onClick={(event) => this._go_to_url(event, "/accounts")}/>
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
                        <ShareIcon /> Share
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
