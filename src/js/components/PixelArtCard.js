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
        willChange: "top, left, width, height",
        pointerEvents: "auto",
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
            "& > div > div > img": {
                opacity: 1,
                transform: "translate(-50%, -50%) scale(4)",
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
            transform: "translate(-50%, -50%) scale(1)",
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
            backgroundColor: "#fafafa",
            transform: "translate(-100%, 0px)",
            opacity: 0,
        },
        "&[dataselected='true']": {
            backgroundColor: "#fafafa",
            backgroundImage: `url("data:image/png;base64,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")`,
            backgroundRepeat: "repeat-x",
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
        color: "currentColor",
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
            image_width: props.image_width || 0,
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

                //this.forceUpdate();
            });
        }, this.state.fade_in)
    }

    shouldComponentUpdate(new_props) {

        return (
            new_props.id !== this.state.id ||
            new_props.index !== this.state.index ||
            new_props.key !== this.state.key ||
            new_props.style.left !== this.state.style.left ||
            new_props.style.top !== this.state.style.top ||
            new_props.style.height !== this.state.style.height ||
            new_props.image_height !== this.state.image_height ||
            new_props.image_width !== this.state.image_width ||
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

        const { key, image_width, image_height, rowIndex, columnIndex, style, classes, post, selected, selected_currency, selected_locales_code, hbd_market, is_loading, _shown  } = this.state;

        const vote_number = (post.active_votes || []).length;
        const tags = post.tags ? post.tags: [];

        const hbd_price = hbd_market ? hbd_market.current_price || 0: 0;
        const balance_fiat = (post.dollar_payout || 0) * hbd_price;

        const selected_style = selected ? {zIndex: 2}: {zIndex: 0};
        const herited_style = {...style, ...selected_style};

        return (
            <Card key={key} ref={this.props.ref} elevation={4} className={classes.card}
                  style={{...herited_style}}
                  score={Math.round(post.voting_ratio / 10) * 10}
                  dataselected={selected ? "true": "false"}>
                <CardActionArea>
                    <div style={{contain: "layout style paint size", width: image_width ,height: image_height, display: "block", position: "relative", overflow: "hidden"}}>
                        <div className={"pixelated"}>
                            <CardMedia
                                className={classes.cardMedia}
                                component="img"
                                alt={post.title}
                                image={post.image}
                                title={post.title}
                            />
                        </div>
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
                    <CardContent style={{backgroundPosition: `${post.timestamp / 1000 % 100}% 100%`}} datatags={post.timestamp ? new TimeAgo(document.documentElement.lang).format(post.timestamp): null} dataselected={selected ? "true": "false"} className={classes.cardContent}  onClick={(event) => {this.props.on_card_content_click(post, event)}}>
                        <Typography gutterBottom variant={"h5"} component="h2">
                            <ReactMarkdown remarkPlugins={[[gfm, {singleTilde: false}]]}>{postprocess_text(post.title)}</ReactMarkdown>
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" style={{position: "relative"}}>
                            {post.summary}
                        </Typography>
                    </CardContent>
                    {is_loading ? <LinearProgress color="primary" variant="indeterminate" className={classes.progress}/>: null}
                </CardActionArea>
                <CardActions className={classes.cardActions} style={selected ? {color: "#fafafa", backgroundPosition: `${post.timestamp / 1000 % 100}% 100%`, backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAACCAYAAAAXfqhyAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5QsZFCkTC0vcDAAAAmBJREFUSMeVVltuBCEMs5kepwfuZRf3IwQcYFR1pdEQ4jiPgWT5/fNRE8APQAHssW597ZX1hxPDPnTdcP4IaB8AF91VVrX1NwQ0hQz3Z/LEa3FCaw8C2AnixJ8441KN42ZTZNi6b7IASBPXHG84oL5TN3Gu3+T85T423JtuMw+Z8YgAmq8jELXxPKFPOXSae0XXQqcG4KkcwaOFTf2jhUmOZ/h4lu2KReiP4wbH45xvHIbbbNf+igdXfpWY8AD6ksmaecwYn1UTPLU+86A8APNAcHxHCqSdg/JWkTnk1LWCD10zu9Mm5LbxH9hxoBq1zjX/5vcYzhhTt3JqR36DI32r5nb4tLjybr1yZhyKerd55164t7pGDQZGWSeVe1ztL3GEb614775xlSsWpQbWa7Z6XOIg3rj2/rLjZGfVfKX8tTf+OYyuA4JV3pt135p5f2/06Jdm3q2pug4Ls/PdcDc5cCyNPTuwYMPuMmQcS9WiH/IWe5FRh1HJdRtG2IaMVH0dQ+Yfwyi33VemWAbTMNIYPBzDSFzDKJsppm4NIx9ABe8DqDRkG1SJmXYMHffhxuKr2rivNQwqvyquveD2gUrzxW2fIy6e8S4ci2943scfgLjEOejB1UBiHV9N23cOmZA1FNkXTt36Q+I8S4diEzhdOAp2nFXJmGX8vPNnBn0OIsZaw0aacZLGz3FHZusVujiHy8p7AN2nxeg1ot+r4Ttzhjz6Sx0Ty1oDv1yCzLd/J9cBjZh8ACGJJEEKUljiErs8txlHxhQ+p50sf/E4KVW2nLO/eH22bwFstZKxqlb9F43IO/OS+g6dAAAAAElFTkSuQmCC")`}: {}}>
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
