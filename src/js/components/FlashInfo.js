import React from "react";
import { withStyles } from "@material-ui/core/styles";

const L = document.documentElement.lang;
import { t } from "../utils/t";

import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import actions from "../actions/utils";

const styles = theme => ({
    flashInfo: {
        position: "relative",
        padding: theme.spacing(1),
        background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.main})`,
        color: theme.palette.primary.contrastText,
        display: "flex",
        [theme.breakpoints.down("sm")]: {
            borderRadius: 0,
        },
    },
    flashInfoImage: {
        padding: theme.spacing(1.5, 2),
        height: 64,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    flashInfoText: {
        fontSize: 18,
        fontWeight: "bold",
        width: "100%",
        margin: "auto 12px auto 0"
    },
    flashInfoButton: {
        height: 42,
        margin: "auto",
        whiteSpace: "nowrap",
        background: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.contrastText,
        },
    }
});


class FlashInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            image: props.image,
            text: props.text,
            button: props.button
        };
    };

    _on_click = (event) => {

        this.props.onClick(event);
        actions.jamy_update("happy", 500);
    };

    render() {

        const { classes } = this.state;
        const { image, text, button } = this.state;

        return (
            <Card className={classes.flashInfo} elevation={4}>
                <img src={image} className={classes.flashInfoImage}/>
                <span className={classes.flashInfoText}>{text}</span>
                <Button onClick={event => this._on_click(event)} className={classes.flashInfoButton} variant="contained" color="primary">{button}</Button>
            </Card>
        );
    }
}

export default withStyles(styles)(FlashInfo);
