import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import images from "../utils/images";
import PixelArtCard from "../components/PixelArtCard";
import MenuReactionPixelPost from "../components/MenuReactionPixelPost";
import {lookup_hive_accounts_name} from "../utils/api";

const styles = theme => ({
    dialogPaper: {
        overflow: "overlay",
        "& .MuiDialog-paper": {
            borderRadius: 0,
            width: "100%",
            backgroundColor: "transparent",
            display: "block",
        },
    },
    card: {
        zIndex: "1305",
        margin: "32px auto 0 auto",
        maxWidth: 800,
        width: "100%",
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
        width: "100%",
        position: "absolute",
        transform: "translate(0, -50%)",
        textAlign: "center",
        left: 0,
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
        width: "100%",
    },
    posts: {
        zIndex: "1305",
        maxWidth: 800,
        margin: "auto",
        width: "100%",
        display: "grid",
        gridAutoRows: "min-content",
        gridTemplateColumns: "1fr",
        marginTop: 12,
        gap: 12,
        "& > div": {
            height: "min-content",
        }
    },
});


class AccountDialogProfileHive extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            open: props.open || false,
            account_name: props.account_name,
            _account: {},
            _images: images,
            _posts: [],
            _reaction_click_event: null
        };
    };

    componentDidMount() {

    }

    componentWillReceiveProps(new_props) {

        let get_account = new_props.account_name !== this.state.account_name;

        this.setState({...new_props}, () => {

            if(get_account) {

                this._get_account();
            }

        });
    }

    _load_images = () => {

        this.state._images.forEach((base64) => {

            const img = new Image();

            img.onload = () => {
                const width = img.width;
                const height = img.height;

                this._push_loaded_image({base64, width, height});
            };

            img.src = base64;
        });
    };

    _push_loaded_image = (loaded_image) =>{

        let { _images, _posts } = this.state;

        _posts.push({
            image: loaded_image,
        });

        const all_images_loaded = (_images.length === _posts.length);

        if(all_images_loaded) {

            this.setState({_posts}, () => {

                this._on_all_images_loaded();
            });
        }else {

            this.setState({_posts});
        }
    };

    _on_all_images_loaded = () => {};

    _set_reaction_click_event = (event) => {

        this.setState({_reaction_click_event: {...event}});
    }

    _set_reaction_click_event_null = () => {

        this.setState({_reaction_click_event: null});
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

    render() {

        const { classes, open, _posts, _account, account_name, _reaction_click_event } = this.state;

        return (
            <Dialog PaperComponent={"div"}
                    fullScreen
                    open={open}
                    onClose={(event) => {this.props.onClose(event)}}
                    className={classes.dialogPaper}
                    keepMounted>
                <Card className={classes.card}>
                    <CardHeader className={classes.cardHeader} style={{backgroundSize: "cover !important", backgroundImage: _account.metadata ? `url(${_account.metadata.profile.cover_image})`: ""}}>
                        <div className={classes.cardHeaderTop}></div>
                        <div className={classes.cardHeaderBottom}>
                            <div className={classes.cardHeaderBottomLeft}></div>
                            <div className={classes.cardHeaderBottomRight}></div>
                        </div>
                    </CardHeader>
                    <div className={classes.cardImageBox}>
                        <div className={classes.cardImage} style={{backgroundSize: "cover !important", backgroundImage: _account.metadata ? `url(${_account.metadata.profile.profile_image})`: ""}}></div>
                    </div>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.cardContentUserame}>{"@" + (account_name || "").replace("@", "")}</div>
                        <div className={classes.cardContentUserDescription}>{_account.metadata ? _account.metadata.profile.about: "..."}</div>
                    </CardContent>
                    <div className={classes.cardTabsContainer}>
                        <Tabs variant="fullWidth" textColor="primary" value={0}>
                            <Tab label={"Author"}></Tab>
                            <Tab disabled label={"Highlighted"}></Tab>
                            <Tab disabled label={"Owner"}></Tab>
                        </Tabs>
                    </div>
                </Card>
                <div className={classes.posts}>
                    {
                        _posts.map((post) => {

                            return (
                                <div>
                                    <PixelArtCard on_reaction_click={this._set_reaction_click_event} post={post} selected={false}/>
                                </div>
                            );
                        })
                    }
                </div>
                <MenuReactionPixelPost event={_reaction_click_event} on_close={this._set_reaction_click_event_null}/>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AccountDialogProfileHive);