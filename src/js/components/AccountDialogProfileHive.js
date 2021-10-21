import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const styles = theme => ({
    dialogPaper: {
        "& .MuiDialog-paper": {
            borderRadius: 0,
            maxWidth: 800,
            width: "100%",
            backgroundColor: "transparent",
        },
    },
    card: {
    },
    cardHeader: {
        background: theme.palette.secondary.main,
        height: 160,
        padding: 0,
    },
    cardHeaderTop: {
        padding: 8,
        height: 42,
        lineHeight: 42,
        display: "flex",
    },
    cardHeaderBottom: {
        display: "flex",
        padding: 8,
        marginBottom: -58,
        fontWeight: "bold",
        height: 42,
        lineHeight: 42,
    },
    cardHeaderBottomLeft: {

    },
    cardHeaderBottomRight: {

    },
    cardImageBox: {
        width: "50%",
        position: "absolute",
        transform: "translate(calc(100% - 64px), -50%)",
    },
    cardImage: {
        width: 128,
        height: 128,
        borderRadius: "50%",
        display: "inline-block",
        cursor: "pointer",
        margin: "auto",
        backgroundPosition: "center center",
        backgroundColor: theme.palette.primary.light,
        backgroundSize: "cover",
        transition: "box-shadow 160ms cubic-bezier(0, 0, 0.2, 1)",
        "&:hover": {
            boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
        }
    },
    cardContent: {
        marginTop: 64,
    },
    cardContentUserame: {
        fontSize: 24,
        textAlign: "center",
        marginTop: 12,
        padding: "8px 16px",
    },
    cardContentUserDescription: {
        padding: "0px 16px 16px 16px",
        textAlign: "center",
    },
    cardTabsContainer: {

    },
});


class AccountDialogProfileHive extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            open: props.open || false,
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState({...new_props});
    }

    render() {

        const { classes, open } = this.state;

        return (
            <Dialog open={open} onClose={(event) => {this.props.onClose(event)}} className={classes.dialogPaper}>
                <Card className={classes.card}>
                    <CardHeader className={classes.cardHeader}>
                        <div className={classes.cardHeaderTop}></div>
                        <div className={classes.cardHeaderBottom}>
                            <div className={classes.cardHeaderBottomLeft}></div>
                            <div className={classes.cardHeaderBottomRight}></div>
                        </div>
                    </CardHeader>
                    <div className={classes.cardImageBox}>
                        <div className={classes.cardImage}></div>
                    </div>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.cardContentUserame}>@user</div>
                        <div className={classes.cardContentUserDescription}>007 agent for life</div>
                    </CardContent>
                    <div className={classes.cardTabsContainer}>
                        <Tabs>
                            <Tab>About</Tab>
                            <Tab>Posts</Tab>
                        </Tabs>
                    </div>
                </Card>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AccountDialogProfileHive);