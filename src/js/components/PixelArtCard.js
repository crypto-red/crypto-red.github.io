import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import LinearProgress from "@material-ui/core/LinearProgress";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

import EyeIcon from "../icons/Eye";

import RedAngryEmojiSvg from "../twemoji/react/1F621";
import AngryEmojiSvg from "../twemoji/react/1F624";
import CoolEmojiSvg from "../twemoji/react/1F60E";
import LoveEmojiSvg from "../twemoji/react/1F60D";
import AngelEmojiSvg from "../twemoji/react/1F607";
import FireHearthEmojiSvg from "../twemoji/react/2764Fe0F200D1F525";

import get_svg_in_b64 from "../utils/svgToBase64";
import price_formatter from "../utils/price-formatter";
import ReactDOM from "react-dom";
import TimeAgo from "javascript-time-ago";
import Chip from "@material-ui/core/Chip";
import {HISTORY} from "../utils/constants";
import {postprocess_text} from "../utils/api-hive";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

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
        boxSizing: "content-box",
        width: "100%",
        height: "auto",
        borderRadius: 4,
        backgroundColor: "transparent",
        "&::before": {
            content: "''",
            background: "#100d4e",
            transform: "translate(-66px, -2.5px)",
            transition: "transform 180ms cubic-bezier(0.4, 0, 0.2, 1)",
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
        "& > .MuiCardActionArea-root > div:hover > img, &[dataselected='true'] > .MuiCardActionArea-root > div > img": {
            transform: "scale(1.30) translateY(-12px)",
            filter: "brightness(1) contrast(1)",
        },
        "& > .MuiCardActionArea-root": {
            overflow: "hidden",
        },
        "& > .MuiCardActionArea-root > div:hover > div, &[dataselected='true'] > .MuiCardActionArea-root > div > div": {
            background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) calc(0% - 24px), rgba(0, 0, 0, 0.034) calc(22.1% - 24px), rgba(0, 0, 0, 0.123) calc(39.4% - 24px), rgba(0, 0, 0, 0.249) calc(53.1% - 24px), rgba(0, 0, 0, 0.394) calc(64.3% - 24px), rgba(0, 0, 0, 0.54) calc(74.1% - 24px), rgba(0, 0, 0, 0.668) calc(83.6% - 24px), rgba(0, 0, 0, 0.762) calc(94.1% - 24px), rgba(0, 0, 0, 0.79) calc(100% - 24px))`,
            "& svg": {
                opacity: 1,
                transform: "scale(4)",
            },
        },
        "&[dataselected='true'] > .MuiCardActionArea-root > div:first-child": {
            "& div:last-child": {
                transform: "translate(0px, 0px)",
                opacity: 1,
            }
        }
    },
    cardMedia: {
        imageRendering: "pixelated",
        transition: "transform 240ms cubic-bezier(0.4, 0, 0.2, 1), filter 240ms cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "scale(1)",
        filter: "brightness(0.5) contrast(1)",
    },
    cardMediaOverlay: {
        zIndex: 0,
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.034) 22.1%, rgba(0, 0, 0, 0.123) 39.4%, rgba(0, 0, 0, 0.249) 53.1%, rgba(0, 0, 0, 0.394) 64.3%, rgba(0, 0, 0, 0.54) 74.1%, rgba(0, 0, 0, 0.668) 83.6%, rgba(0, 0, 0, 0.762) 94.1%, rgba(0, 0, 0, 0.79) 100%)`,
        transition: "background 240ms cubic-bezier(0.4, 0, 0.2, 1)",
        position: "absolute",
        top: "50%;",
        left: "50%",
        transform: "translate(-50%, -50%)",
        "& > svg": {
            transform: "scale(1)",
            transition: "transform 240ms cubic-bezier(0.4, 0, 0.2, 1), opacity 240ms cubic-bezier(0.4, 0, 0.2, 1)",
            position: "absolute",
            left: "50%",
            top: "50%",
            opacity: 0,
        },
        width: "100%",
        height: "100%",
    },
    nsTags: {
        position: "absolute",
        pointerEvents: "none",
        left: 0,
        top: 0,
        padding: theme.spacing(1),
        "& > span": {
            borderRadius: 2,
            marginRight: 6,
            padding: 4,
            fontSize: 10,
            backgroundColor: theme.palette.secondary.dark,
            color: "#ffffff",
        },
    },
    cardContent: {
        zIndex: 1,
        position: "relative",
        backgroundColor: "#FAFAFA",
        transition: "background-color 120ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&::after": {
            zIndex: -1,
            top: -32,
            content: "attr(datatags)",
            padding: "16px 8px 16px 16px",
            left: 0,
            width: "66%",
            position: "absolute",
            lineHeight: "8px",
            backgroundColor: "#fafafa",
            clipPath: "polygon(0 0, calc(66%) 0%, 100% 100%, 100% 0%, 100% 100%, 0 100%, 0% 66%, 0% 33%)",
            transform: "translate(0px, 0px)",
            transition: "linear-gradient(180deg, rgba(0, 0, 0, 0) 88%, rgba(0, 0, 0, 0.78))",
        },
        "&[dataselected='true']::after": {
            backgroundColor: "#d7dbff",
            transform: "translate(-100%, 0px)",
        },
        "&[dataselected='true']": {
            backgroundColor: "#d7dbff",
        },
        "& > *": {
            opacity: .5,
            transition: "opacity 120ms cubic-bezier(0.4, 0, 0.2, 1)"
        },
        "&[dataselected='true'] > *, &:hover > *": {
            opacity: 1,
        },
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
    },
    progress: {
        marginBottom: -4,
        transform: "translate(0px, -2px)",
        zIndex: 1,
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.primary.action
        },
        opacity: 1,
        backgroundColor: "#3729c177",
    },
    postTags: {
        zIndex: 1,
        position: "absolute",
        left: 0,
        bottom: 0,
        lineHeight: "32px",
        boxSizing: "content-box",
        padding: "8px",
        transform: "translate(0px, 100%)",
        opacity: 0,
        transition: "transform 240ms cubic-bezier(0.4, 0, 0.2, 1) 120ms, opacity 240ms cubic-bezier(0.4, 0, 0.2, 1) 120ms",
    },
    postTag: {
        zIndex: 2,
        marginRight: 4,
        cursor: "pointer",
    },
});

class PixelArtCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            image_height: props.image_height || 0,
            key: props.key,
            rowIndex: props.rowIndex,
            columnIndex: props.columnIndex,
            style: props.style || {},
            fade_in: props.fade_in || 0,
            classes: props.classes,
            post: props.post,
            is_loading: props.is_loading || false,
            selected: props.selected,
            hbd_market: props.hbd_market,
            selected_currency: props.selected_currency,
            selected_locales_code: props.selected_locales_code,
            _shown: props.fade_in ? false: true,
            _history: HISTORY,
        };
    };

    componentDidMount() {

        setTimeout(() => {

            this.setState({_shown: true},() =>{

                this.forceUpdate();
            });
        }, this.state.fade_in)
    }

    shouldComponentUpdate(new_props) {

        if(new_props.selected && !this.state.selected) {

            ReactDOM.findDOMNode(this).focus();
        }

        return (
            new_props.key !== this.state.key ||
            new_props.image_height !== this.state.image_height ||
            new_props.rowIndex !== this.state.rowIndex ||
            new_props.columnIndex !== this.state.columnIndex ||
            new_props.post !== this.state.post ||
            new_props.selected !== this.state.selected ||
            new_props.is_loading !== this.state.is_loading ||
            new_props.hbd_market !== this.state.hbd_market
        );
    }

    componentWillReceiveProps(new_props) {

        this.setState({...new_props});
    }

    render() {

        const { key, image_height, rowIndex, columnIndex, style, classes, post, selected, selected_currency, selected_locales_code, hbd_market, is_loading, _shown  } = this.state;

        const vote_number = (post.active_votes || []).length;
        const tags = post.tags ? post.tags: [];

        const hbd_price = hbd_market ? hbd_market.current_price || 0: 0;
        const balance_fiat = (post.dollar_payout || 0) * hbd_price;

        const selected_style = selected ? {zIndex: 2}: {zIndex: 0};
        const herited_style = {...style, ...selected_style};

        return (
            <Card key={key} ref={this.props.ref} elevation={4} className={classes.card}
                  style={_shown ? {...herited_style, opacity: 1, transition: `opacity 175ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`}: {...herited_style, opacity: 0, transition: "opacity 0ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"}}
                  score={Math.round(post.voting_ratio / 10) * 10}
                  dataselected={selected ? "true": "false"}>
                <CardActionArea>
                    <div style={{height: image_height, display: "block", position: "relative", overflow: "hidden"}}>
                        <CardMedia
                            className={classes.cardMedia}
                            component="img"
                            alt={post.title}
                            image={post.image}
                            title={post.title}
                        />
                        <div className={classes.cardMediaOverlay} onClick={(event) => {this.props.on_card_media_click(post, event)}}>
                            <div className={classes.nsTags}>
                                {Object.entries(post.responsabilities).map((entry) => {

                                    const [ key, value ] = entry;

                                    const r_text = {
                                        unsourced: "He/She did not paint or take this photo himself or the source image doesn't belong to him/her.",
                                        opinion: "This post is NOT a press-release or a checked-fact. It is only his/her experience and / or a personal perception-description.",
                                        hurt: "This post contains nudity, hate, madness, or anything that may disturb someone else's freedom of expression. (NSFW)"
                                    };

                                    if(["unsourced", "opinion","hurt"].includes(key)) {

                                        return (
                                            <Tooltip title={r_text[key] + (value ? " [TRUE]": " [FALSE]")}>
                                                <span style={value ? {}: {textDecoration: "line-through"}}>{key}</span>
                                            </Tooltip>
                                        );
                                    }
                                })}
                            </div>
                            <EyeIcon style={{color: "#ffffff", pointerEvents: "none"}} width={36} height={36}/>
                        </div>
                        <div className={classes.postTags}>
                            {
                                tags.map((tag, index) => {
                                    return index ? <Chip clickable className={classes.postTag} key={tag} variant={"default"} size={"small"} label={`#${tag}`} onClick={() => {this.props.on_card_tag_click(tag)}}/> : null;
                                })
                            }
                        </div>
                    </div>
                    <CardContent datatags={post.timestamp ? new TimeAgo(document.documentElement.lang).format(post.timestamp): null} dataselected={selected ? "true": "false"} className={classes.cardContent}  onClick={(event) => {this.props.on_card_content_click(post, event)}}>
                        <Typography gutterBottom variant={"h5"} component="h2">
                            <ReactMarkdown remarkPlugins={[[gfm, {singleTilde: false}]]}>{postprocess_text(post.title)}</ReactMarkdown>
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" style={{position: "relative"}}>
                            {post.summary}
                        </Typography>
                    </CardContent>
                    {is_loading ? <LinearProgress color="primary" variant="indeterminate" className={classes.progress}/>: null}
                </CardActionArea>
                <CardActions className={classes.cardActions}>
                    <span className={classes.postValue}>
                        <span>{price_formatter(balance_fiat, selected_currency, selected_locales_code)}</span> /
                        <span style={{cursor: "pointer"}} onClick={(event) => {this.props.on_votes_click(event, post.active_votes)}}> {vote_number} Votes</span> /
                        <span style={{cursor: "pointer"}} onClick={() => {this.props.on_author_click(post.author)}}> @{post.author}</span>
                    </span>
                </CardActions>
                <span onClick={(event) => {this.props.on_reaction_click(event, post)}} className={classes.cardAfterElement}></span>
            </Card>
        );
    }
}

export default withStyles(styles)(PixelArtCard);
