import React from "react";
import { withStyles } from "@material-ui/core/styles";

import {HISTORY} from "../utils/constants";
import Dialog from "@material-ui/core/Dialog";
import Tooltip from "@material-ui/core/Tooltip";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import {lookup_hive_accounts_name, lookup_hive_account_reputation_by_name, lookup_hive_account_follow_count_by_name} from "../utils/api-hive";
import IconButton from "@material-ui/core/IconButton";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const styles = theme => ({
    dialogRoot: {
        overflow: "overlay",
    },
    dialogPaper: {
        borderRadius: 0,
        width: "100%",
        backgroundColor: "transparent",
        display: "block",
        "& .MuiDialog-paper": {
            display: "block",
            zIndex: "1305",
            margin: "32px auto 0 auto",
            maxWidth: 800,
            width: "100%",
        },
    },
    cardHeader: {
        position: "relative",
        background: theme.palette.secondary.main,
        height: 160,
        padding: 0,
    },
    cardHeaderImage: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
    },
    cardHeaderContent: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(rgb(0 0 0 / 80%) 24px, rgb(0 0 0 / 0%), rgb(0 0 0 / 80%) calc(100% - 24px))"
    },
    cardHeaderTop: {
        display: "flex",
        position: "absolute",
        justifyContent: "space-between",
        padding: 8,
        top: 0,
        width: "100%",
        height: 42,
        lineHeight: "42px",
    },
    cardHeaderBottom: {
        display: "flex",
        position: "absolute",
        justifyContent: "space-between",
        padding: 8,
        bottom: 0,
        width: "100%",
        fontWeight: "bold",
        height: 42,
        lineHeight: "42px",
    },
    cardHeaderBottomLeft: {
        display: "flex",
        color: theme.palette.primary.contrastText,
    },
    cardHeaderBottomRight: {
        display: "flex",
        color: theme.palette.primary.contrastText,
    },
    cardImageBox: {
        pointerEvents: "none",
        width: "100%",
        position: "absolute",
        transform: "translate(0, -50%)",
        textAlign: "center",
        left: 0,
    },
    cardImage: {
        width: 128,
        height: 128,
        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);",
        display: "inline-block",
        cursor: "pointer",
        pointerEvents: "all",
        zIndex: 1,
        margin: "auto",
        backgroundPosition: "center center",
        backgroundColor: theme.palette.primary.light,
        backgroundSize: "cover",
        transform: "scale(1)",
        transition: "transform 160ms cubic-bezier(0, 0, 0.2, 1), clip-path 160ms cubic-bezier(0, 0, 0.2, 1)",
        "&:hover": {
            clipPath: "circle(50%)",
            transform: "scale(2)",
        }
    },
    reputation: {
        margin: "-16px auto auto -16px",
        position: "absolute",
        boxSizing: "content-box",
        cursor: "pointer",
        pointerEvents: "all",
        width: 19,
        zIndex: -1,
        height: 19,
        padding: 8,
        display: "inline-block",
        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);",
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
    },
    cardContent: {
        marginTop: 64,
    },
    cardContentUserame: {
        fontSize: 24,
        textAlign: "center",
        padding: "8px 16px",
    },
    cardContentUserDescription: {
        padding: "0px 16px 16px 16px",
        textAlign: "center",
    },
    cardContentUserLocation: {
        textAlign: "right",
    }
});


class AccountDialogProfileHive extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            keepMounted: props.keepMounted || false,
            classes: props.classes,
            open: props.open || false,
            account_name: props.account_name,
            _account: {},
            _reputation: 0,
            _follow_count: {},
            _posts: [],
            _history: HISTORY,
        };
    };

    componentDidMount() {

        if(this.state.account_name) {

            this._get_account();
            this._get_account_reputation();
            this._get_account_follow_count();
        }
    }

    componentWillReceiveProps(new_props) {

        let get_account = new_props.account_name !== this.state.account_name;

        this.setState({...new_props}, () => {

            if(get_account) {

                this._get_account();
                this._get_account_reputation();
                this._get_account_follow_count();
            }

        });
    }

    _get_account = () => {

        const { account_name } = this.state;

        if(account_name) {

            lookup_hive_accounts_name(account_name.replace("@", ""), (error, result) => {

                if(!error) {

                    this.setState({_account: result});
                }
            });
        }
    };

    _get_account_reputation = () => {

        const { account_name } = this.state;

        if(account_name) {

            lookup_hive_account_reputation_by_name(account_name.replace("@", ""), (error, result) => {

                if(!error) {

                    this.setState({_reputation: result});
                }
            });
        }
    };

    _get_account_follow_count = () => {

        const { account_name } = this.state;

        if(account_name) {

            lookup_hive_account_follow_count_by_name(account_name.replace("@", ""), (error, result) => {

                if(!error) {

                    this.setState({_follow_count: result});
                }
            });
        }
    };

    _view_posts = () => {

        const {_account, _history } = this.state;

        _history.push(`/gallery/newest/search/@${_account.name}`)
    }

    render() {

        const { classes, open, _posts, _account, _reputation, _follow_count, account_name, _reaction_click_event, keepMounted } = this.state;

        return (
            <div className={classes.dialogRoot}>
                <Dialog open={open}
                        onClose={this.props.onClose}
                        className={classes.dialogPaper}
                        keepMounted={keepMounted}>
                    <CardActionArea>
                        <div className={classes.cardHeader}>
                            <div className={classes.cardHeaderImage} style={{backgroundSize: "cover !important", backgroundImage: _account.cover_image ? `url(${_account.cover_image})`: ""}}></div>
                            <div className={classes.cardHeaderContent}>
                                <div className={classes.cardHeaderTop}>
                                    <div className={classes.cardHeaderTopLeft}></div>
                                    <div className={classes.cardHeaderTopRight}></div>
                                </div>
                                <div className={classes.cardHeaderBottom}>
                                    <Tooltip title="Followers" aria-label="Followers">
                                        <Button variant={"outlined"} className={classes.cardHeaderBottomLeft} startIcon={<KeyboardArrowDownIcon />}>
                                            {_follow_count.followers}
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Following" aria-label="Following">
                                        <Button variant={"outlined"} className={classes.cardHeaderBottomRight} endIcon={<KeyboardArrowUpIcon/>}>
                                            {_follow_count.following}
                                        </Button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </CardActionArea>
                    <div className={classes.cardImageBox}>
                        <div className={classes.cardImage} style={{backgroundSize: "cover !important", backgroundImage: _account.profile_image ? `url(${_account.profile_image})`: ""}}></div>
                        <Tooltip title="Reputation" aria-label="Reputation">
                            <div className={classes.reputation}>{_reputation}</div>
                        </Tooltip>
                    </div>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.cardContentUserame}>{"@" + (account_name || "").replace("@", "")}</div>
                        <div className={classes.cardContentUserDescription}>{_account.about ? _account.about: "..."}</div>
                        {_account.location &&
                            <div className={classes.cardContentUserLocation}>
                                <span>{_account.location}</span>
                                <IconButton onClick={() => {window.open(`https://www.google.com/maps/search/${_account.location}`, "_blank")}}>
                                    <LocationOnIcon/>
                                </IconButton>
                            </div>
                        }
                    </CardContent>
                    <CardActionArea>
                        <Button fullWidth variant={"contained"} color={"primary"} onClick={this._view_posts}>View posts</Button>
                    </CardActionArea>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(AccountDialogProfileHive);