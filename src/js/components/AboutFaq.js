import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

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

const VIEWS = t( "components.about_faq");

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
            _views: t( "components.about_faq"),
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
