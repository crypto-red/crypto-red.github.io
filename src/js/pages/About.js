import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import AboutInfo from "../components/AboutInfo";
import AboutWiki from "../components/AboutWiki";
import AboutFaq from "../components/AboutFaq";

import { HISTORY } from "../utils/constants";
const styles = theme => ({
    root: {

    }
});


class About extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            pathname: props.pathname,
            _view_name: props.pathname.split("/")[2] || "info",
            _history: HISTORY
        };
    };

    componentWillReceiveProps(new_props) {

        const { pathname } = this.state;
        const new_pathname = new_props.pathname;

        if(pathname !== new_pathname) {

            const _view_name = new_props.pathname.split("/")[2] || "info";
            this.setState({pathname: new_pathname, _view_name}, function(){

            });
        }
    }

    render() {

        const { classes, pathname, _view_name } = this.state;

        const views = {
            info: <AboutInfo pathname={pathname}/>,
            wiki: <AboutWiki pathname={pathname}/>,
            faq: <AboutFaq pathname={pathname}/>,
        };

        const view = Boolean(_view_name) ? views[_view_name]: <span>Loading...</span>;

        return (
            <div className={classes.root}>
                {view}
            </div>
        );
    }
}

export default withStyles(styles)(About);