import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import { HISTORY } from "../utils/constants";

import Fade from "@material-ui/core/Fade";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { marked } from "marked";

marked.setOptions({
    xhtml: true
});

import sanitize from "sanitize-html";

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

const VIEWS = t( "components.about_info");

let VIEW_NAMES = [];

Object.entries(VIEWS).forEach(entry => {

    const [key, value] = entry;
    VIEW_NAMES.push(key);
});


class AboutInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            pathname: props.pathname,
            _view_name: props.pathname.split("/")[3] || VIEW_NAMES[0],
            _view_name_index: VIEW_NAMES.indexOf(!~props.pathname.split("/")[3] || VIEW_NAMES[0]) ? 0: VIEW_NAMES.indexOf(props.pathname.split("/")[3] || VIEW_NAMES[0]),
            _history: HISTORY,
            _view_names: VIEW_NAMES,
            _views: t( "components.about_info"),
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

        const new_pathname = "/about/info/" + _view_name;
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

        const { classes, _views, _view_name, _view_name_index } = this.state;

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
                                    <p dangerouslySetInnerHTML={{__html: sanitize(marked.parse(view.content_markdown), {
                                            allowedTags: [ 'img', 'b', 'br', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
                                            allowedAttributes: {
                                                'a': [ 'href' ],
                                                'img': [ 'src' ]
                                            },
                                            selfClosing: [ 'img', 'br', 'hr' ],
                                            allowedSchemesByTag: { img: [ 'data' ], a: ["https"]}
                                        })}}></p>
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

export default withStyles(styles)(AboutInfo);
