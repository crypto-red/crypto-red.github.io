import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";

import RedAngryEmojiSvg from "../twemoji/react/1F621";
import AngryEmojiSvg from "../twemoji/react/1F624";
import CoolEmojiSvg from "../twemoji/react/1F60E";
import LoveEmojiSvg from "../twemoji/react/1F60D";
import AngelEmojiSvg from "../twemoji/react/1F607";
import get_svg_in_b64 from "../utils/svgToBase64";

const styles = theme => ({
    reactionMenu: {
        "& .MuiList-root": {
            padding: 0,
        },
        "& .MuiMenu-paper": {
            overflow: "visible !important",
        },
    },
    reactionMenuIconButton: {
        width: 48,
        height: 48,
        transform: "scale(1)",
        transition: "transform 225ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
            transform: "scale(1.5)",
        }
    },
});


class MenuReactionPixelPost extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            keepMounted: props.keepMounted || false,
            event: props.event || null,
            classes: props.classes,
            voted_result: props.voted_result || null,
            _reaction_menu_x: props.event ? props.event.clientX - 120: null,
            _reaction_menu_y: props.event ? props.event.clientY - 20: null,
        };
    };

    componentWillReceiveProps(new_props) {

        const state = {
            keepMounted: new_props.keepMounted || false,
            event: new_props.event || null,
            classes: new_props.classes,
            voted_result: new_props.voted_result || null,
            _reaction_menu_x: new_props.event ? new_props.event.clientX - 120: null,
            _reaction_menu_y: new_props.event ? new_props.event.clientY - 20: null,
        };

        this.setState(state);
    }

    _handle_reaction_menu_close = () => {

        if(this.props.on_close) {

            this.props.on_close();
        }
    };

    render() {

        const { classes, keepMounted } = this.state;
        const { _reaction_menu_x, _reaction_menu_y, voted_result, event } = this.state;

        const voted_percent = Math.round((voted_result / 10000) * 4) / 4;

        return (
            <Menu
                className={classes.reactionMenu}
                PaperProps={{
                    style: {
                        height: 48,
                        width: 240,
                        overflowY: "overlay"
                    },
                }}
                keepMounted={keepMounted}
                open={_reaction_menu_x !== null && _reaction_menu_y !== null && Boolean(event)}
                onClose={this._handle_reaction_menu_close}
                anchorReference="anchorPosition"
                anchorPosition={
                    _reaction_menu_y !== null && _reaction_menu_x !== null
                        ? { top: _reaction_menu_y, left: _reaction_menu_x }
                        : undefined
                }
            >
                <div>
                    <IconButton className={classes.reactionMenuIconButton} onClick={() => {this.props.on_vote(voted_percent !== -1 ? -1: 0)}}>
                        <img src={get_svg_in_b64(<RedAngryEmojiSvg />, voted_percent === -1)}/>
                    </IconButton>
                    <IconButton className={classes.reactionMenuIconButton} onClick={() => {this.props.on_vote(voted_percent !== -0.5 ? -0.5: 0)}}>
                        <img src={get_svg_in_b64(<AngryEmojiSvg />, voted_percent === -0.5)}/>
                    </IconButton>
                    <IconButton className={classes.reactionMenuIconButton} onClick={() => {this.props.on_vote(voted_percent !== 0.5 ? 0.5: 0)}}>
                        <img src={get_svg_in_b64(<CoolEmojiSvg />, voted_percent === 0.5)}/>
                    </IconButton>
                    <IconButton className={classes.reactionMenuIconButton} onClick={() => {this.props.on_vote(voted_percent !== 0.75 ? 0.75: 0)}}>
                        <img src={get_svg_in_b64(<LoveEmojiSvg />, voted_percent === 0.75)}/>
                    </IconButton>
                    <IconButton className={classes.reactionMenuIconButton} onClick={() => {this.props.on_vote(voted_percent !== 1 ? 1: 0)}}>
                        <img src={get_svg_in_b64(<AngelEmojiSvg />, voted_percent === 1)}/>
                    </IconButton>
                </div>
            </Menu>
        );
    }
}

export default withStyles(styles)(MenuReactionPixelPost);
