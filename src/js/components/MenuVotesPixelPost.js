import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Menu from "@material-ui/core/Menu";

import RedAngryEmojiSvg from "../twemoji/react/1F621";
import AngryEmojiSvg from "../twemoji/react/1F624";
import NormalEmojiSvg from "../twemoji/react/1F600";
import CoolEmojiSvg from "../twemoji/react/1F60E";
import LoveEmojiSvg from "../twemoji/react/1F60D";
import AngelEmojiSvg from "../twemoji/react/1F607";
import get_svg_in_b64 from "../utils/svgToBase64";
import MenuItem from "@material-ui/core/MenuItem";

const red_angry_emoji = get_svg_in_b64(<RedAngryEmojiSvg />);
const angry_emoji = get_svg_in_b64(<AngryEmojiSvg />);
const normal_emoji = get_svg_in_b64(<NormalEmojiSvg />);
const cool_emoji = get_svg_in_b64(<CoolEmojiSvg />);
const love_emoji = get_svg_in_b64(<LoveEmojiSvg />);
const angel_emoji = get_svg_in_b64(<AngelEmojiSvg />);

const styles = theme => ({

});


class MenuVotesPixelPost extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            keepMounted: props.keepMounted || false,
            event: props.event || null,
            classes: props.classes,
            votes: props.votes || [],
            anchor: props.anchor || [],
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    _handle_reaction_menu_close = () => {

        if(this.props.on_close) {

            this.props.on_close();
        }
    };

    render() {

        const { classes, anchor, votes,keepMounted } = this.state;

        return (
            <Menu
                id="long-menu"
                keepMounted={keepMounted}
                anchorEl={anchor}
                open={Boolean(anchor)}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center"
                }}
                onClose={this.props.on_close}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: 'auto',
                    },
                }}
            >
                {Boolean(anchor) && votes.map((vote) => (
                    <MenuItem key={vote.voter} style={{justifyContent: "space-between"}}>
                        <span style={{marginRight: 8}}>@{vote.voter}</span>
                        <span><img style={{height: 24, verticalAlign: "middle"}} src={
                            Math.floor(vote.percent / 100) < -50 ?
                                red_angry_emoji:
                            Math.floor(vote.percent / 100) < 0 ?
                                angry_emoji:
                            Math.floor(vote.percent / 100) < 25 ?
                                normal_emoji:
                            Math.floor(vote.percent / 100) < 50 ?
                                cool_emoji:
                            Math.floor(vote.percent / 100) < 75 ?
                                love_emoji:
                                angel_emoji
                        }
                        /></span>
                    </MenuItem>
                ))}
            </Menu>
        );
    }
}

export default withStyles(styles)(MenuVotesPixelPost);
