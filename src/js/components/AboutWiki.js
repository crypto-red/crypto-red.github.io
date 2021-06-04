import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { HISTORY } from "../utils/constants";

import Fade from "@material-ui/core/Fade";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

const styles = theme => ({
    root: {
    },
    containerElement: {
        padding: theme.spacing(2),
        display: "flex",
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(2, 0),
            display: "inherit"
        }
    },
    horizontalTabsContainer: {
        [theme.breakpoints.up('lg')]: {
            display: "none"
        },
        width: "100vw",
        marginTop: theme.spacing(2)
    },
    horizontalTabs: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main
        }
    },
    verticalTabs: {
        [theme.breakpoints.down('md')]: {
            display: "none"
        },
        marginLeft: theme.spacing(2),
        height: "fit-content",
        display: "inline-table",
        borderLeft: `1px solid ${theme.palette.divider}`,
        "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main,
            left: 0
        }
    },
    cardContainer: {
        width: "inherit"
    }
});

const VIEWS = {
    topup: {
        title: "How to top-up",
        content_markdown: "Although we receive nothing if you don't use Changelly, it is a simple service and the second recommended after public ATMs for privacy concerns.\n" +
            "\n" +
            "You will have to follow the instruction and at the end enter the public address of the coin selected of the account you've chosen and that's it, you can pay by card and do it quickly and simply."
    },
    mixer: {
        title: "How to mix cryptocurrency",
        content_markdown: "We currently use Blender.io, it will enable you to mix your coin with other coin it will be like if your coins disappeared in the nether and from completely different sources came (other coins nearly with the same amount) to an address (maybe a completely new one if you create a new account for that) hours or even days later!\n" +
            "\n" +
            "You just have to create a new account on wallet.crypto.red in order to generate a fresh new and new address and to put that address in the mixer (you can split the amount send to multiples address). Then just send the amount you like from the account you have chosen to use for sending coins.\n" +
            "\n" +
            "Be careful! Don't send back the coins you received from the mixer onto the new address you've freshly created, it will enable one to know that this address is linked to the previous one (obvious captain)."
    },
    swap: {
        title: "How to swap cryptocurrency",
        content_markdown: "You have to go to the convert menu item in the drawer at left (burger menu on mobile devices) and use a \"swap\" services, we currently use SwapSpace.co since it doesn't charge more than the showed swap exchange that it compare for you so you can be sure to pay the less on the market!\n" +
            "\n" +
            "You have to choose the amount an the currency you want to send along with the currency you want to receive in exchange. Then click on the \"VIEW OFFERS\" button.\n" +
            "\n" +
            "Then just choose the exchange you want to use for the conversion you're doing, it should show many offers of all-trusted exchange. So when you have clicked on the \"EXCHANGE\" button just enter the new address of the currency you will receive, you have to copy the right address from the right account of yours of the cryptocurrency you have chosen to receive in exchange of the amount you'll have to send.\n" +
            "\n" +
            "**In other words:**\n" +
            "\n" +
            "1.  Enter the amount and choose the swap service.\n" +
            "2.  Enter the recipient address.\n" +
            "3.  Transfer your funds to the exchange service.\n" +
            "4.  Wait for the exchange to proceed."

    },
    crypt: {
        title: "Encrypt and decrypt messages",
        content_markdown: "In order to decrypt a message someone has sent to you, you'll have to know both your public and private key linked to the message which is an obfuscated text, since the software knows it, if you go onto tools then crypto then decrypt then autofill keys, the keys will be magically filled into our cryptographic system. You'll only have to copy the obfuscated message received and click autofill then show.\n" +
            "\n" +
            "In order to encrypt a message to someone, you'll have to know the receiver's public key, just look at a transaction from this person and copy the public key which you'll have to enter in the cryptographic tool (Encrypt tab) in tools then crypt along with the message. If you click autofill keys on encrypt section, it will be meant to be sent to yourself."

    },
    contribute: {
        title: "How to contribute",
        content_markdown: "You can contribute to our repository, this is where our code and application is hosted: [https://github.com/crypto-red/crypto-red.github.io](https://github.com/crypto-red/crypto-red.github.io) (everything is transparent on GitHub). You can also donate to us in order to accelerate de development of this project and other projects (since we also fund other projects that we use trough [OpenCollective](https://opencollective.com/crypto-red)) trough sending bitcoin in the address shown where our code is hosted."

    }
};

let VIEW_NAMES = [];

Object.entries(VIEWS).forEach(entry => {

    const [key, value] = entry;
    VIEW_NAMES.push(key);
});


class AboutWiki extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            pathname: props.pathname,
            _view_name: props.pathname.split("/")[3] || "topup",
            _view_name_index: VIEW_NAMES.indexOf(!~props.pathname.split("/")[3] || "topup") ? 0: VIEW_NAMES.indexOf(props.pathname.split("/")[3] || "topup"),
            _history: HISTORY,
            _view_names: VIEW_NAMES,
            _views: VIEWS,
        };
    };

    componentWillReceiveProps(new_props) {

        const { _view_names } = this.state;
        const new_pathname = new_props.pathname;

        const _view_name = new_props.pathname.split("/")[3] || "topup";
        const _view_name_index = !~_view_names.indexOf(_view_name) ? 0: _view_names.indexOf(_view_name);
        this.setState({pathname: new_pathname, _view_name, _view_name_index});

    }

    _handle_view_name_change = (event, view_name_index) => {

        const { _history, _view_names } = this.state;

        const _view_name = _view_names[view_name_index] || "topup";
        const _view_name_index = !~_view_names.indexOf(_view_name) ? 0: _view_names.indexOf(_view_name);

        const new_pathname = "/about/wiki/" + _view_name;
        _history.push(new_pathname);
        this.setState({_view_name_index});
    };

    _get_tab_props = (index, direction) => {
        return {
            id: `${direction}-tab-${index}`,
            "aria-controls": `${direction}-tabpanel-${index}`,
        };
    }

    render() {

        const { classes, pathname, _views, _view_name, _view_name_index } = this.state;

        const view = _views[_view_name];

        let horizontal_tabs = [];
        let vertical_tabs = [];
        Object.entries(_views).forEach((entry, index) => {

            const [key, value] = entry;
            horizontal_tabs.push(<Tab label={value.title} {...this._get_tab_props(index, "horizontal")} />);
            vertical_tabs.push(<Tab label={value.title} {...this._get_tab_props(index, "vertical")} />);
        })

        return (
            <div className={classes.root}>
                <div className={classes.horizontalTabsContainer}>
                    <Tabs
                        orientation="horizontal"
                        value={_view_name_index}
                        onChange={this._handle_view_name_change}
                        variant="scrollable"
                        scrollButtons="on"
                        className={classes.horizontalTabs}
                    >
                        {horizontal_tabs}
                    </Tabs>
                </div>
                <Container maxWidth="md" className={classes.containerElement}>
                    <Fade in>
                        <div className={classes.cardContainer}>
                            <Card>
                                <CardHeader title={view.title}/>
                                <CardContent>
                                    <ReactMarkdown remarkPlugins={[[gfm, {singleTilde: false}]]}>
                                        {view.content_markdown}
                                    </ReactMarkdown>
                                </CardContent>
                            </Card>
                        </div>
                    </Fade>
                    <Tabs
                        orientation="vertical"
                        value={_view_name_index}
                        onChange={this._handle_view_name_change}
                        className={classes.verticalTabs}
                    >
                        {vertical_tabs}
                    </Tabs>
                </Container>
            </div>
        );
    }
}

export default withStyles(styles)(AboutWiki);
