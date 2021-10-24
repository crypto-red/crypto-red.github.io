import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { Masonry } from "react-virtualized";

import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";

import RedAngryEmojiSvg from "../twemoji/react/1F621";
import AngryEmojiSvg from "../twemoji/react/1F624";
import CoolEmojiSvg from "../twemoji/react/1F60E";
import LoveEmojiSvg from "../twemoji/react/1F60D";
import AngelEmojiSvg from "../twemoji/react/1F607";

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
            classes: props.classes,
            _reaction_menu_x: props.event ? props.event.clientX - 120: null,
            _reaction_menu_y: props.event ? props.event.clientY - 20: null,
        };
    };

    componentWillReceiveProps(new_props) {

        const state = {
            _reaction_menu_x: new_props.event ? new_props.event.clientX - 120: null,
            _reaction_menu_y: new_props.event ? new_props.event.clientY - 20: null,
        };

        this.setState({...state});
    }

    _handle_reaction_menu_close = () => {

        if(this.props.on_close) {

            this.props.on_close();
        }
    };

    render() {

        const { classes } = this.state;
        const { _reaction_menu_x, _reaction_menu_y } = this.state;

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
                keepMounted={false}
                open={_reaction_menu_y !== null}
                onClose={this._handle_reaction_menu_close}
                anchorReference="anchorPosition"
                anchorPosition={
                    _reaction_menu_y !== null && _reaction_menu_x !== null
                        ? { top: _reaction_menu_y, left: _reaction_menu_x }
                        : undefined
                }
            >
                <div>
                    <IconButton className={classes.reactionMenuIconButton}>
                        <RedAngryEmojiSvg />
                    </IconButton>
                    <IconButton className={classes.reactionMenuIconButton}>
                        <AngryEmojiSvg />
                    </IconButton>
                    <IconButton className={classes.reactionMenuIconButton}>
                        <CoolEmojiSvg />
                    </IconButton>
                    <IconButton className={classes.reactionMenuIconButton}>
                        <LoveEmojiSvg />
                    </IconButton>
                    <IconButton className={classes.reactionMenuIconButton}>
                        <AngelEmojiSvg />
                    </IconButton>
                </div>
            </Menu>
        );
    }
}

export default withStyles(styles)(MenuReactionPixelPost);
