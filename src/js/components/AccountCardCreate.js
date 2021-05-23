import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { grey } from "@material-ui/core/colors";

import AddIcon from "@material-ui/icons/Add";

import Jdenticon from "react-jdenticon";

const styles = theme => ({
    accountCard: {
        cursor: "pointer",
        border: "4px dashed rgba(128, 128, 128, 0.3)"
    },
    createNewCardActionArea: {
        textAlign: "center",
        color: grey[500]
    },
    cardAction: {
        display: "flow-root"
    },
    floatRight: {
        float: "right"
    },
    avatar: {
        backgroundColor: "transparent"
    },

});


class AccountCardCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    render() {

        const { classes } = this.state;

        return (
            <Card className={classes.accountCard}  variant="outlined" onClick={(event) => {this.props.onCreate(event)}}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="Acronyme" className={classes.avatar}>
                            <Jdenticon size="48" value="_new" />
                        </Avatar>
                    }
                    title={"New account"}
                    subheader={"Today"}
                />
                <CardContent>
                    <h2 className={classes.createNewCardActionArea}>
                        No balance
                    </h2>
                </CardContent>
                <CardActions className={classes.cardAction}>
                    <Button startIcon={<AddIcon />}
                            className={classes.floatRight}
                            color="primary">
                        New
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(styles)(AccountCardCreate);
