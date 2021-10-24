import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import RedAngryEmojiSvg from "../twemoji/react/1F621";
import AngryEmojiSvg from "../twemoji/react/1F624";
import CoolEmojiSvg from "../twemoji/react/1F60E";
import LoveEmojiSvg from "../twemoji/react/1F60D";
import AngelEmojiSvg from "../twemoji/react/1F607";
import FireHearthEmojiSvg from "../twemoji/react/2764Fe0F200D1F525";

import get_svg_in_b64 from "../utils/svgToBase64";

const red_angry_emoji_svg = get_svg_in_b64(<RedAngryEmojiSvg />);
const angry_emoji_svg = get_svg_in_b64(<AngryEmojiSvg />);
const cool_emoji_svg = get_svg_in_b64(<CoolEmojiSvg />);
const love_emoji_svg = get_svg_in_b64(<LoveEmojiSvg />);
const angel_emoji_svg = get_svg_in_b64(<AngelEmojiSvg />);
const fire_earth_emoji_svg = get_svg_in_b64(<FireHearthEmojiSvg />);

const styles = theme => ({
    card: {
        overflow: "visible",
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        height: "auto",
        borderRadius: 4,
        backgroundColor: "transparent",
        "&::before": {
            content: "''",
            background: "#100d4e",
            transform: "translate(-66px, -2.5px)",
            transition: "transform 175ms cubic-bezier(0.4, 0, 0.2, 1)",
            width: 64,
            height: 10,
            position: "absolute",
            right: -4,
            bottom: 0,
        },
        "&[score='0']::before": {background: "hsla(0, 60%, 60%, 1)"},
        "&[score='10']::before": {background: "hsla(10, 60%, 60%, 1)"},
        "&[score=`20`]::before": {background: "hsla(20, 60%, 60%, 1)"},
        "&[score=`30`]::before": {background: "hsla(30, 60%, 60%, 1)"},
        "&[score='40']::before": {background: "hsla(40, 60%, 60%, 1)"},
        "&[score='50']::before": {background: "hsla(50, 60%, 60%, 1)"},
        "&[score='60']::before": {background: "hsla(60, 60%, 60%, 1)"},
        "&[score='70']::before": {background: "hsla(70, 60%, 60%, 1)"},
        "&[score='80']::before": {background: "hsla(80, 60%, 60%, 1)"},
        "&[score='90']::before": {background: "hsla(90, 60%, 60%, 1)"},
        "&[score='100']::before": {background: "hsla(100, 60%, 60%, 1)"},
        "&::after": {
            content: "''",
            zindex: 1,
            width: 24,
            height: 24,
            position: "absolute",
            right: 16,
            bottom: -6,
            opacity: ".0",
            transform: "scale(0)",
            transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1), transform 175ms cubic-bezier(0.4, 0, 0.2, 1)"
        },
        "&:hover::before": {
            transform: "translate(-12px, -2.5px)",
        },
        "&:hover::after": {
            opacity: "1",
            transform: "scale(1.25)",
        },
        "&[dataselected='true']::before": {
            transform: "translate(-12px, -2.5px)",
        },
        "&[dataselected='true']::after": {
            opacity: "1",
            transform: "scale(1.25)",
        },
        "&[score='0']::after": {backgroundImage: `url('${red_angry_emoji_svg}')`},
        "&[score='10']::after": {backgroundImage: `url('${red_angry_emoji_svg}')`},
        "&[score=`20`]::after": {backgroundImage: `url('${angry_emoji_svg}')`},
        "&[score=`30`]::after": {backgroundImage: `url('${angry_emoji_svg}')`},
        "&[score='40']::after": {backgroundImage: `url('${angry_emoji_svg}')`},
        "&[score='50']::after": {backgroundImage: `url('${cool_emoji_svg}')`},
        "&[score='60']::after": {backgroundImage: `url('${cool_emoji_svg}')`},
        "&[score='70']::after": {backgroundImage: `url('${love_emoji_svg}')`},
        "&[score='80']::after": {backgroundImage: `url('${love_emoji_svg}')`},
        "&[score='90']::after": {backgroundImage: `url('${angel_emoji_svg}')`},
        "&[score='100']::after": {backgroundImage: `url('${fire_earth_emoji_svg}')`},
    },
    cardMedia: {
        imageRendering: "pixelated"
    },
    cardContent: {
        position: "relative",
        backgroundColor: "#FAFAFA",
        transition: "background-color 140ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&::before": {
            top: -24,
            content: "attr(datatags)",
            padding: "10px 16px",
            left: 0,
            width: "66%",
            position: "absolute",
            height: 25,
            backgroundColor: "#fafafa",
            clipPath: "polygon(0 0, calc(66%) 0%, 100% 100%, 100% 0%, 100% 100%, 0 100%, 0% 66%, 0% 33%)",
            transition: "background-color 140ms cubic-bezier(0.4, 0, 0.2, 1)",
        },
        "&[dataselected='true']::before": {
            backgroundColor: "#d7dbff",
        },
        "&[dataselected='true']": {
            backgroundColor: "#d7dbff",
        }
    },
    cardActions: {
        borderTop: `1px solid #d7dbff`,
        backgroundColor: "#FAFAFA",
        transform: "translate(0px, -2px)",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, calc(100% - 8px) 100%, calc(100% - 8px) calc(100% - 8px), calc(100% - 48px) calc(100% - 8px), calc(100% - 64px) 100%, 16px 100%, 0px calc(100% - 16px))",
    },
    postValue: {
        color: "#415086",
        fontSize: "0.8125rem",
        marginLeft: theme.spacing(1),
        "& img": {
            marginRight: 4,
            height: "1rem",
            width: "1rem",
            verticalAlign: "text-top",
        }
    },
    cardAfterElement: {
        content: "''",
        width: 32,
        height: 32,
        position: "absolute",
        right: 12,
        cursor: "pointer",
        bottom: -8,
        zIndex: 2,
    }
});

class PixelArtCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            post: props.post,
            selected: props.selected,
        };
    };

    shouldComponentUpdate(new_props) {

        return (new_props.post !== this.state.post || new_props.selected !== this.state.selected);
    }

    componentWillReceiveProps(new_props) {

        this.setState({...new_props});
    }

    render() {

        const { classes, post, selected } = this.state;

        return (
            <Card elevation={0} className={classes.card} score={100} dataselected={selected ? "true": "false"}>
                <CardActionArea>
                    <CardMedia
                        onClick={(event) => {this.props.on_card_media_click(post, event)}}
                        className={classes.cardMedia}
                        component="img"
                        alt="Demo only"
                        image={post.image.base64}
                        title="Demo only"
                    />
                    <CardContent datatags={"Category"} dataselected={selected ? "true": "false"} className={classes.cardContent}  onClick={(event) => {this.props.on_card_content_click(post, event)}}>
                        <Typography gutterBottom variant="h5" component="h2">
                            Demo only
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                            across all continents except Antarctica. (It will be coming soon.)
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className={classes.cardActions}>
                    <span className={classes.postValue}>
                        <span>CHF 152.15</span> /
                        <span>225 Votes</span> /
                        <span onClick={this.props.on_author_click}>@Author</span>
                    </span>
                </CardActions>
                <span onClick={this.props.on_reaction_click} className={classes.cardAfterElement}></span>
            </Card>
        );
    }
}

export default withStyles(styles)(PixelArtCard);
