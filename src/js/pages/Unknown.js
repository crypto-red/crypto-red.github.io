import React from "react";
import { withStyles } from "@material-ui/core/styles";

import actions from "../actions/utils";

const styles = theme => ({
    backgroundImage: {
        minHeight: "calc(100vh - 64px)",
        backgroundImage: "url(/src/images/404-dark-2.svg)",
        position: "relative",
        backgroundSize: "contain",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundOrigin: "content-box",
        padding: theme.spacing(4)
    }
});

class Unknown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes
        };
    };

    componentDidMount() {

        actions.jamy_update("annoyed");
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

        return false;
    }

    render() {

        const { classes } = this.state;

        return (
            <div className={classes.root}>
                <div className={classes.backgroundImage}>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Unknown);
