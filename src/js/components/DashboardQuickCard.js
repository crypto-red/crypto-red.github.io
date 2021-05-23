import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";
import Skeleton from "@material-ui/lab/Skeleton";

const styles = theme => ({
    relevant: {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.primary.contrastText
    },
    fullWidth: {
        width: "100%"
    }
});


class DashboardQuickCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            text_content: props.text_content,
            label_content: props.label_content,
            relevant: props.relevant || false,
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    render() {

        const { classes, relevant } = this.state;
        const { text_content, label_content } = this.state;

        return (
            <div className={classes.fullWidth}>
                <Fade in>
                    <Card className={relevant ? classes.relevant: null}>
                        <CardContent>
                            <h3>
                                {
                                    text_content !== null ?
                                        text_content:
                                        <Skeleton />
                                }
                            </h3>
                            <span>{label_content}</span>
                        </CardContent>
                    </Card>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardQuickCard);
