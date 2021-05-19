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

const VIEW_NAMES = [
    "topup",
    "mixer",
    "convert",
    "contribute",
];


class AboutWiki extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            pathname: props.pathname,
            _view_name: props.pathname.split("/")[3] || "topup",
            _view_name_index: VIEW_NAMES.indexOf(!~props.pathname.split("/")[3] || "topup") ? 0: VIEW_NAMES.indexOf(props.pathname.split("/")[3] || "topup"),
            _history: HISTORY,
            _view_names: VIEW_NAMES
        };
    };

    componentWillReceiveProps(new_props) {

        const { pathname, _view_names } = this.state;
        const new_pathname = new_props.pathname;

        const _view_name = new_props.pathname.split("/")[3] || "topup";
        const _view_name_index = !~_view_names.indexOf(_view_name) ? 0: _view_names.indexOf(_view_name);
        this.setState({pathname: new_pathname, _view_name, _view_name_index});

    }

    _handle_view_name_change = (event, view_name_index) => {

        const { _history, _view_names } = this.state;

        const pathname = _history.location.pathname;
        const _view_name = _view_names[view_name_index] || "topup";
        const _view_name_index = !~_view_names.indexOf(_view_name) ? 0: _view_names.indexOf(_view_name);

        const new_pathname = "/about/wiki/" + _view_name;
        _history.push(new_pathname);
        this.setState({_view_name_index});
    };

    _get_tab_props = (index) => {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    render() {

        const { classes, pathname, _view_name, _view_name_index } = this.state;

        const views = {
            topup:
                <Card>
                    <CardHeader title="How to top-up"/>
                    <CardContent>
                        <p>Although we receive nothing if you don't use Changelly, it is a simple service and the second recommended after public ATMs for privacy concerns.</p>
                        <p>You will have to follow the instruction and at the end enter the public address of the coin selected of the account you've chosen and that's it, you can pay by card and do it quickly and simply.</p>
                    </CardContent>
                </Card>,
            mixer:
                <Card>
                    <CardHeader title="How to mix cryptocurrency"/>
                    <CardContent>
                        <p>We currently use Blender.io, it will enable you to mix your coin with other coin it will be like if your coins disappeared in the nether and from completely different sources came (other coins nearly with the same amount) to an address (maybe a completely new one if you create a new account for that) hours or even days later!</p>
                        <p>You just have to create a new account on wallet.crypto.red in order to generate a fresh new and new address and to put that address in the mixer (you can split the amount send to multiples address). Then just send the amount you like from the account you have chosen to use for sending coins.</p>
                        <p>Be careful! Don't send back the coins you received from the mixer onto the new address you've freshly created, it will enable one to know that this address is linked to the previous one (obvious captain).</p>
                    </CardContent>
                </Card>,
            convert:
                <Card>
                    <CardHeader title="How to convert cryptocurrency"/>
                    <CardContent>
                        <p>You have to go to the convert menu item in the drawer at left (burger menu on mobile devices) and use a "swap" services, we currently use SwapSpace.co since it doesn't charge more than the showed swap exchange that it compare for you so you can be sure to pay the less on the market!</p>
                        <p>You have to choose the amount an the currency you want to send along with the currency you want to receive in exchange. Then click on the "VIEW OFFERS" button.</p>
                        <p>Then just choose the exchange you want to use for the conversion you're doing, it should show many offers of all-trusted exchange. So when you have clicked on the "EXCHANGE" button just enter the new address of the currency you will receive, you have to copy the right address from the right account of yours of the cryptocurrency you have chosen to receive in exchange of the amount you'll have to send.</p>
                        <p><b>In other words:</b></p>
                        <ol>
                            <li>Enter the amount and choose the swap service.</li>
                            <li>Enter the recipient address.</li>
                            <li>Transfer your funds to the exchange service.</li>
                            <li>Wait for the exchange to proceed.</li>
                        </ol>
                    </CardContent>
                </Card>,
            contribute:
                <Card>
                    <CardHeader title="How to contribute"/>
                    <CardContent>
                        <p>You can contribute to our repository, this is where our code and application is hosted: <a href="https://github.com/crypto-red/crypto-red.github.io" target="_blank">https://github.com/crypto-red/crypto-red.github.io</a> (everything is transparent on GitHub). You can also donate to us in order to accelerate de development of this project and other projects (since we also fund other projects that we use trough <a href="https://opencollective.com/crypto-red" target="_blank">OpenCollective</a>) trough sending bitcoin in the address shown where our code is hosted.</p>
                    </CardContent>
                </Card>,
        };

        const view = Boolean(_view_name) ? views[_view_name]: <span>Loading...</span>;

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
                        <Tab label="How to top up" {...this._get_tab_props(0)} />
                        <Tab label="How to mix crypto" {...this._get_tab_props(1)} />
                        <Tab label="How to convert crypto" {...this._get_tab_props(2)} />
                        <Tab label="How to contribute" {...this._get_tab_props(3)} />
                    </Tabs>
                </div>
                <Container maxWidth="md" className={classes.containerElement}>
                    <Fade in>
                        <div className={classes.cardContainer}>{view}</div>
                    </Fade>
                    <Tabs
                        orientation="vertical"
                        value={_view_name_index}
                        onChange={this._handle_view_name_change}
                        aria-label="Vertical tabs example"
                        className={classes.verticalTabs}
                    >
                        <Tab label="How to top up" {...this._get_tab_props(0)} />
                        <Tab label="How to mix crypto" {...this._get_tab_props(1)} />
                        <Tab label="How to convert crypto" {...this._get_tab_props(2)} />
                        <Tab label="How to contribute" {...this._get_tab_props(3)} />
                    </Tabs>
                </Container>
            </div>
        );
    }
}

export default withStyles(styles)(AboutWiki);