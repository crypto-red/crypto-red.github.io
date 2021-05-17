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
                        <p>...</p>
                    </CardContent>
                </Card>,
            mixer:
                <Card>
                    <CardHeader title="How to mix cryptocurrency"/>
                    <CardContent>
                        <p>...</p>
                    </CardContent>
                </Card>,
            convert:
                <Card>
                    <CardHeader title="How to convert cryptocurrency"/>
                    <CardContent>
                        <p>...</p>
                    </CardContent>
                </Card>,
            contribute:
                <Card>
                    <CardHeader title="How to contribute"/>
                    <CardContent>
                        <p><a href="https://github.com/crypto-red/crypto-red.github.io" target="_blank">https://github.com/crypto-red/crypto-red.github.io</a>.</p>
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