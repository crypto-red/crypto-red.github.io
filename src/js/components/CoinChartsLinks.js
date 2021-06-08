import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";

import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import ForumIcon from "@material-ui/icons/Forum";
import ChatIcon from "@material-ui/icons/Chat";
import GitHubIcon from "@material-ui/icons/GitHub";
import actions from "../actions/utils";

const styles = theme => ({
    hidden: {
        display: "none",
    },
    fullHeight: {
        height: "100%"
    },
    linksCard: {
        height: "100%"
    },
    iconButton: {
        backgroundColor: "rgba(89, 87, 142, .33)",
        "&:hover": {
            backgroundColor: "rgba(89, 87, 142, .33)",
        },
        margin: theme.spacing(1),
    }
});


class CoinChartsLinks extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coin_data: props.coin_data,
            _link_dialog_open: false,
            _link_dialog_name: "",
            _link_dialog_data: []
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }


    _open_coin_page = (page) => {

        const { coin_data } = this.state;

        switch (page)  {

            case "links.homepage[0]":
                window.open(coin_data.links.homepage[0]);
                break;

            case "links.repos_url.github[0]":
                window.open(coin_data.links.repos_url.github[0]);
                break;

            case "links.official_forum_url[0]":
                window.open(coin_data.links.official_forum_url[0]);
                break;

            case "links.chat_url[0]":
                window.open(coin_data.links.chat_url[0]);
                break;
        }
    };

    _shorten_url = (url) => {

        url = url.replace(/(https?\:\/\/(www.)?)/, "");
        url = url.replace(/\/$/, "");

        return url;
    };

    _get_remove_empty_links_from_coin_data = (coin_data) => {

        if(coin_data === null) {
            return null;
        }

        function array_remove(array, value) {

            return array.filter(function(element){
                return element !== value;
            });
        }

        coin_data.links.homepage = array_remove(coin_data.links.homepage, "");
        coin_data.links.blockchain_site = array_remove(coin_data.links.blockchain_site, "");
        coin_data.links.official_forum_url = array_remove(coin_data.links.official_forum_url, "");
        coin_data.links.chat_url = array_remove(coin_data.links.chat_url, "");
        coin_data.links.repos_url.github = array_remove(coin_data.links.repos_url.github, "");

        return coin_data;
    };

    _on_link_dialog_close = (event) => {

        this.setState({_link_dialog_open: false});
    };

    _open_link_dialog = (event, link_dialog_name, link_dialog_data) => {

        this.setState({_link_dialog_open: true, _link_dialog_name: link_dialog_name, _link_dialog_data: link_dialog_data});
        actions.trigger_sfx("alert_high-intensity");
    };

    render() {

        let { classes, coin_data, _link_dialog_open, _link_dialog_name, _link_dialog_data } = this.state;

        coin_data = this._get_remove_empty_links_from_coin_data(coin_data);

        const market_info_card = coin_data !== null ?
            <Fade in={true}>
                <Card className={classes.linksCard}>
                    <CardHeader title="Links" />
                    <CardContent>
                        {coin_data.links.homepage.length ?
                            <Tooltip title="Homepages" aria-label="Homepages">
                                <IconButton color="primary" className={classes.iconButton} onClick={(event) => this._open_link_dialog(event, "Homepages", coin_data.links.homepage)}>
                                    <HomeIcon fontSize="large" />
                                </IconButton>
                            </Tooltip>:
                        null}
                        {coin_data.links.blockchain_site.length ?
                            <Tooltip title="Block Explorer" aria-label="Block Explorer">
                                <IconButton color="primary" className={classes.iconButton} onClick={(event) => this._open_link_dialog(event, "Block Explorers", coin_data.links.blockchain_site)}>
                                    <ExploreIcon fontSize="large" />
                                </IconButton>
                            </Tooltip>:
                        null}
                        {coin_data.links.official_forum_url.length ?
                            <Tooltip title="Forum" aria-label="Forum">
                                <IconButton color="primary" className={classes.iconButton} onClick={(event) => this._open_link_dialog(event, "Forum", coin_data.links.official_forum_url)}>
                                    <ForumIcon fontSize="large" />
                                </IconButton>
                            </Tooltip>:
                        null}
                        {coin_data.links.chat_url.length ?
                            <Tooltip title="Chat" aria-label="Chat">
                                <IconButton color="primary" className={classes.iconButton} onClick={(event) => this._open_link_dialog(event, "Chat", coin_data.links.chat_url)}>
                                    <ChatIcon fontSize="large" />
                                </IconButton>
                            </Tooltip>:
                        null}
                        {coin_data.links.repos_url.github.length ?
                            <Tooltip title="Github" aria-label="Github">
                                <IconButton color="primary" className={classes.iconButton} onClick={(event) => this._open_link_dialog(event, "Github", coin_data.links.repos_url.github)}>
                                    <GitHubIcon fontSize="large" />
                                </IconButton>
                            </Tooltip>:
                        null}
                    </CardContent>
                </Card>
            </Fade> : null;



        return (
            <div className={classes.fullHeight}>
                <Dialog
                    open={_link_dialog_open}
                    onClose={(event) => {this._on_link_dialog_close(event)}}
                    aria-labelledby="show-links-dialog-title"
                    aria-describedby="show-links-dialog-description"
                >
                    <DialogTitle id="show-links-dialog-title">{_link_dialog_name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="show-links-dialog-description">
                            <List>
                                {_link_dialog_data.map((link, index, array) => {

                                    return (
                                        <ListItem>
                                            <ListItemText>
                                                <a href={link} target="_blank">{this._shorten_url(link)}</a>
                                            </ListItemText>
                                        </ListItem>)
                                })}
                            </List>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
                {market_info_card}
            </div>
        );
    }
}

export default withStyles(styles)(CoinChartsLinks);
