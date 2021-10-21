import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import {Dialog, CardActionArea, CardHeader, CardContent, Button} from "@material-ui/core";
import KindlyHappyEmojiIcon from "../twemoji/react/1F601";

const styles = theme => ({
    thanksCard: {
        "& .MuiPaper-root": {
            padding: 36,
            backgroundColor: "transparent",
        },
        "& .MuiPaper-root::before": {
            display: "none",
        },
        "& .MuiDialog-paper": {
            maxWidth: 500,
            position: "fixed",
            overflow: "visible",
            margin: "auto",
            display: "block",
        },
    },
    thanksCardHeader: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        background: "#060e23",
        padding: 36,
    },
    thanksCardContent: {
        textAlign: "center",
        padding: 48,
        fontSize: 21,
    },
    thanksEmoji: {
        position: "absolute",
        top: 0,
        transform: "translate(0, -32px)",
        height: 64,
        width: "100%",
        zIndex: 1,
    },
    thanksButton: {
        transform: "translate(0, 16px)",
        zIndex: 1,
    },
    thanksCardImage: {
        height: 128,
        background: "center / contain no-repeat url(../src/images/account-add.svg)",
        marginBottom: 24,
    },
    thanksCardArea: {
        borderRadius: 4,
        backgroundColor: "#fff"
    },
    thanksButtonContainer: {
        position: "absolute",
        width: "100%",
        bottom: 0,
        textAlign: "center",
    }
});


class AccountsDialogThanks extends React.Component {

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
            <Dialog className={classes.thanksCard} open={open} onClick={this.props.accept} onClose={(event) => {this.props.onClose(event)}}>
                <CardActionArea className={classes.thanksCardArea}>
                    <CardHeader className={classes.thanksCardHeader}>
                        Thanks !
                    </CardHeader>
                    <CardContent className={classes.thanksCardContent}>
                        <div className={classes.thanksCardImage} />
                        Thanks for your engagement, we appreciate it a lot,
                        We have a new friend or user, do you want to join with a new person?
                    </CardContent>
                    <KindlyHappyEmojiIcon className={classes.thanksEmoji} />
                    <div className={classes.thanksButtonContainer}>
                        <Button color="primary" variant={"contained"} className={classes.thanksButton}>Invite a friend</Button>
                    </div>
                </CardActionArea>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AccountsDialogThanks);