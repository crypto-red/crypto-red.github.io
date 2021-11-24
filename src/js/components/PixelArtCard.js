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
        "& > .MuiCardActionArea-root > div:hover, &[dataselected='true'] > .MuiCardActionArea-root > div": {
            "& > div:first-child": {
                background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) calc(0% - 24px), rgba(0, 0, 0, 0.034) calc(22.1% - 24px), rgba(0, 0, 0, 0.123) calc(39.4% - 24px), rgba(0, 0, 0, 0.249) calc(53.1% - 24px), rgba(0, 0, 0, 0.394) calc(64.3% - 24px), rgba(0, 0, 0, 0.54) calc(74.1% - 24px), rgba(0, 0, 0, 0.668) calc(83.6% - 24px), rgba(0, 0, 0, 0.762) calc(94.1% - 24px), rgba(0, 0, 0, 0.79) calc(100% - 24px))`,
            },
            "& div img": {
                opacity: 1,
                transform: "scale(4)",
            },
            "&:first-child::after": {
                content: "''",
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 15%, rgba(255, 255, 255, 0.2) 45%, rgba(255, 255, 255, 0.075) 60%, rgba(255, 255, 255, 0) 75%)",
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                transform: "translateY(-125%)",
                animation: "$scan 1125ms cubic-bezier(0.4, 0, 0.2, 1) 125ms",
                "@global": {
                    "@keyframes scan": {
                        "0%": {transform: "translateY(-125%)"},
                        "100%": {transform: "translateY(85%)"},
                    }
                }
            }
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
        filter: "brightness(0.88) contrast(1.14)",
    },
    cardMediaOverlay: {
        zIndex: 0,
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.034) 22.1%, rgba(0, 0, 0, 0.123) 39.4%, rgba(0, 0, 0, 0.249) 53.1%, rgba(0, 0, 0, 0.394) 64.3%, rgba(0, 0, 0, 0.54) 74.1%, rgba(0, 0, 0, 0.668) 83.6%, rgba(0, 0, 0, 0.762) 94.1%, rgba(0, 0, 0, 0.79) 100%)`,
        transition: "background 240ms cubic-bezier(0.4, 0, 0.2, 1)",
        position: "absolute",
        top: "50%;",
        left: "50%",
        transform: "translate(-50%, -50%)",
        "& > img": {
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
            transform: "translate(-0%, 0px)",
            opacity: 1,
            transition: "transform 120ms cubic-bezier(0.4, 0, 0.2, 1), opacity 80ms cubic-bezier(0.4, 0, 0.2, 1) 20ms"
        },
        "&[dataselected='true']::after": {
            backgroundColor: "#d7dbff",
            transform: "translate(-100%, 0px)",
            opacity: 0,
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
                            <img src={"data:image/png;base64,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"}
                                 style={{color: "#ffffff", pointerEvents: "none", width: 36, height: 36}} width={36} height={36}/>
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
