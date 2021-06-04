import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { HISTORY } from "../utils/constants";

import Fade from "@material-ui/core/Fade";
import Container from "@material-ui/core/Container";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const styles = theme => ({
    root: {
    },
    containerElement: {
        padding: theme.spacing(2),
        display: "flex",
        [theme.breakpoints.down("md")]: {
            padding: theme.spacing(2, 0),
            display: "inherit"
        }
    },
    horizontalTabsContainer: {
        [theme.breakpoints.up("lg")]: {
            display: "none"
        },
        [theme.breakpoints.between('md', "lg")]: {
            width: "calc(100vw - 256px)"
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
        [theme.breakpoints.down("md")]: {
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
    accordionContainer: {
        width: "inherit"
    }
});

const VIEWS = {
    organization: {
        name: "Orgnaization",
        qa: [
            {question: "Who is crypto.red?", answer: "Crypto.red is an open-source project coded by a single programmer from scratch (which is/was a bit of a mad developer and designer) who realised one of his mission was to provide something life-hackers would love. He also make sure to maintain a good networking with non-dangerous hackers and bring other open-source projects money earned."},
            {question: "Who can contribute to this project?", answer: "Anyone, see https://github.com/crypto-red to get involved."},
            {question: "Who decide what to code?", answer: "Our team which is on GitHub (https://github.com/crypto-red) must agree together, meanwhile, one may duplicate the project for its own need."},
            {question: "Who have funded this project?", answer: "Anonymous."},
        ]
    },
    security: {
        name: "Security",
        qa: [
            {question: "How does my coin are stored?", answer: "Your coin are stored on the behalf of your seed (private key in particular), which can only be used with the access to the blockchain respectively to the wallet in question. Many exchanges keep your coins when you're not withdrawing them, we do not."},
            {question: "How does my data are encrypted?", answer: "Your data are encrypted trough Triplesec, see (https://keybase.io/triplesec) to get more information."},
            {question: "Where does my data are stored?", answer: "Your seed (you're whole account) can generate all your crypto wallet it is stored in clear on your computer (with PouchDB on your browser) in persistent mode when logged and encrypted in non-persistent mode or when logged out."},
            {question: "What if I loose my seed?", answer: "If you loose your seed, (You should write it down on paper) you can only get it back if you're account has not be cleared from your browser, you may need to log in or not."},
            {question: "What if I loose my password?", answer: "No worries, only your seed is needed to get back everything."},
            {question: "Can I print my password / seed?", answer: "When you're using the persistent mode for connection or if you print / store a document on your computer or printer, it may mostly last forever even if you format your storing device."},
        ]
    },
    privacy: {
        name: "Privacy",
        qa: [
            {question: "What is public on my account?", answer: "Your public key (blockchain address). You should not link your identity with your wallet's address if you want a complete privacy. You can also use a crypto mixer to obfuscate the source of your funding on a new wallet."}
        ]
    },
    fees: {
        name: "Fees",
        qa: [
            {question: "What are the fees of using it?", answer: "We have an affiliate link for selling and trading cryptocurrency, theses partners rewards us with a part of their profit, meanwhile they compare where you can buy and trade cryptocurrency at the best exchange rate without increasing the operation cost for you."}
        ]
    },
    usage: {
        name: "Usage",
        qa: [
            {question: "Should I use it if it can present a risk for my fund?", answer: "You should download a stable version from torrent download if you want to use it with a lot of money on it."}
        ],
    }
};

let VIEW_NAMES = [];

Object.entries(VIEWS).forEach(entry => {

    const [key, value] = entry;
    VIEW_NAMES.push(key);
});

class AboutFaq extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            pathname: props.pathname,
            _view_name: props.pathname.split("/")[3] || VIEW_NAMES[0],
            _view_name_index: VIEW_NAMES.indexOf(!~props.pathname.split("/")[3] || VIEW_NAMES[0]) ? 0: VIEW_NAMES.indexOf(props.pathname.split("/")[3] || VIEW_NAMES[0]),
            _history: HISTORY,
            _view_names: VIEW_NAMES,
            _views: VIEWS,
            _accordion_expanded: ""
        };
    };

    componentWillReceiveProps(new_props) {

        const { _view_names } = this.state;
        const new_pathname = new_props.pathname;

        const _view_name = new_props.pathname.split("/")[3] || VIEW_NAMES[0];
        const _view_name_index = !~_view_names.indexOf(_view_name) ? 0: _view_names.indexOf(_view_name);
        this.setState({pathname: new_pathname, _view_name, _view_name_index});

    }

    _handle_view_name_change = (event, view_name_index) => {

        const { _history, _view_names } = this.state;

        const _view_name = _view_names[view_name_index] || VIEW_NAMES[0];
        const _view_name_index = !~_view_names.indexOf(_view_name) ? 0: _view_names.indexOf(_view_name);

        const new_pathname = "/about/faq/" + _view_name;
        _history.push(new_pathname);
        this.setState({_view_name_index});
    };

    _handle_accordion_expanded_change = (event, _new_accordion_expanded) => {

        const { _accordion_expanded } = this.state;

        if(_accordion_expanded === _new_accordion_expanded) {

            this.setState({_accordion_expanded: ""})
        }else {

            this.setState({_accordion_expanded: _new_accordion_expanded})
        }
    };

    _get_tab_props = (index, direction) => {
        return {
            id: `${direction}-tab-${index}`,
            "aria-controls": `${direction}-tabpanel-${index}`,
        };
    }

    render() {

        const { classes, _view_name, _view_names, _view_name_index, _accordion_expanded, _views } = this.state;

        let horizontal_tabs = [];
        let vertical_tabs = [];
        Object.entries(_views).forEach((entry, index) => {

            const [key, value] = entry;
            horizontal_tabs.push(<Tab label={value.name} {...this._get_tab_props(index, "horizontal")} />);
            vertical_tabs.push(<Tab label={value.name} {...this._get_tab_props(index, "vertical")} />);
        })

        const accordions = [];
        _views[_view_name].qa.map((value, index) => {

            accordions.push(
                <Fade in timeout={index*200}>
                    <Accordion key={`${_view_name}-${index}`}
                               expanded={_accordion_expanded === `_view_name-${_view_name}-${index}`}
                               onChange={(event) => this._handle_accordion_expanded_change(event, `_view_name-${_view_name}-${index}`)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <span className={classes.heading}>{value.question}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>{value.answer}</p>
                        </AccordionDetails>
                    </Accordion>
                </Fade>
            );
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
                        <div className={classes.accordionContainer}>
                            {accordions}
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

export default withStyles(styles)(AboutFaq);
