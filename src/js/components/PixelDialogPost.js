import React from "react";
import { withStyles } from "@material-ui/core/styles"

import Dialog from "@material-ui/core/Dialog";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CanvasPixels from "./CanvasPixels";
import Tooltip from "@material-ui/core/Tooltip";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import WhatsAppIcon from "../icons/WhatsApp";
import FacebookIcon from "../icons/Facebook";
import TwitterIcon from "../icons/Twitter";
import PinterestIcon from "../icons/Pinterest";
import LinkedInIcon from "../icons/LinkedIn";
import PixelColorPalette from "./PixelColorPalette";
import IconButton from "@material-ui/core/IconButton";
import RedditIcon from "../icons/Reddit";
import { trigger_snackbar } from "../actions/utils";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import Grow from "@material-ui/core/Grow";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as toxicity from "@tensorflow-models/toxicity";
import {lookup_accounts_name} from "../utils/api-hive";
import TimeAgo from "javascript-time-ago";

const styles = theme => ({
    root: {
        height: "100vh",
        width: "100vw",
        position: "fixed",
        overflow: "hidden",
    },
    content: {
        position: "absolute",
        margin: "auto",
        height: "100%",
        width: "100%",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    contentInner: {
        display: "flex",
        flexGrow: 1,
        position: "relative",
    },
    contentImage: {
        width: "calc(100vw - 480px)",
        height: "calc(100vh)",
        position: "relative",
        overflow: "visible",
        [theme.breakpoints.down("md")]: {
            width: "100vw",
            position: "fixed",
            overflow: "hidden",
        }
    },
    contentCanvas: {
        width: "calc(100vw - 480px)",
        height: "calc(100vh)",
        position: "absolute",
        overflow: "visible",
        [theme.breakpoints.down("md")]: {
            width: "100vw",
            overflow: "hidden",
            position: "fixed",
        }
    },
    drawer: {
        width: 480,
        [theme.breakpoints.down("md")]: {
            width: "100vw",
            zIndex: 1,
        },
        flexShrink: 0,
    },
    drawerPaper: {
        boxShadow: "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
        border: "none",
        width: 480,
        [theme.breakpoints.down("md")]: {
            width: "100vw",
            touchAction: "none",
            overscrollBehavior: "none",
            overflow: "overlay",
            overflowY: "auto",
            overflowX: "overlay",
            boxSizing: "border-box",
        },
        background: "#fafafa",
    },
    description: {
        minHeight: 64,
        height: "auto",
    },
    descriptionCollapsed: {
        minHeight: "0 !important",
        height: "auto !important",
        maxHeight: "64px !important",
        boxShadow: "inset 0px -21px 21px -21px rgb(0 0 0 / 20%)",
    },
    shareIconButtonWhatsApp: {
        color: "#fff",
        backgroundColor: "#3fd366",
        borderColor: "#3fd366",
        "&:hover": {
            backgroundColor: "#219741",
            borderColor: "#219741",
        },
    },
    shareIconButtonFacebook: {
        color: "#fff",
        backgroundColor: "#2c4886",
        borderColor: "#2c4886",
        "&:hover": {
            backgroundColor: "#29437b",
            borderColor: "#29437b",
        },
    },
    shareIconButtonTwitter: {
        color: "#fff",
        backgroundColor: "#3a83c6",
        borderColor: "#3a83c6",
        "&:hover": {
            backgroundColor: "#3170aa",
            borderColor: "#3170aa",
        },
    },
    shareIconButtonPinterest: {
        color: "#fff",
        backgroundColor: "#bd161cff",
        borderColor: "#bd161cff",
        "&:hover": {
            backgroundColor: "#9a1015",
            borderColor: "#9a1015",
        },
    },
    shareIconButtonReddit: {
        color: "#fff",
        backgroundColor: "#f24401ff",
        borderColor: "#f24401ff",
        "&:hover": {
            backgroundColor: "#ad3100",
            borderColor: "#ad3100",
        },
    },
    shareIconButtonLinkedIn: {
        color: "#fff",
        backgroundColor: "#3478b5ff",
        borderColor: "#3478b5ff",
        "&:hover": {
            backgroundColor: "#1e5687",
            borderColor: "#1e5687",
        },
    },
    drawerModal: {
        [theme.breakpoints.down("md")]: {
            transform: "translateY(48px)"
        },
    },
    contentDrawer: {
        overscrollBehavior: "none",
        overflow: "auto",
        [theme.breakpoints.down("md")]: {
            paddingBottom: "48px",
        },
    },
    drawerHeader: {
        position: "relative",
        background: "#fff",
        boxShadow: "rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px",
        [theme.breakpoints.down("md")]: {
            zIndex: 1,
        },
    },
    scrollOverflowMaxWidthMobile: {
        [theme.breakpoints.down("md")]: {
            overflow: "scroll",
            width: "100vw"
        },
    },
    closeButtonIcon: {
        color: "#fff",
        position: "fixed",
        top: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 1,
    },
    scrollerButton: {
        flexGrow: 1,
        width: "100%",
        height: 48,
        marginRight: 16,
    },
    editFab: {
        background: theme.palette.primary.action,
        color: theme.palette.primary.contrastText,
        "&:hover": {
            background: theme.palette.primary.actionLighter,
        },
        "& svg": {
            marginRight: 4
        },
    },
    bottomMobileFabs: {
        display: "flex",
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 1199,
        gap: 16,
        height: 48,
        [theme.breakpoints.up("lg")]: {
            display: "none",
            pointerEvents: "none",
        },
    },
    bottomDesktopFabs: {
        display: "none",
        position: "fixed",
        bottom: theme.spacing(2),
        left: theme.spacing(62),
        gap: 16,
        height: 48,
        [theme.breakpoints.up("lg")]: {
            display: "flex",
            zIndex: 1199,
        },
    },
    sendFab: {
        background: theme.palette.primary.action,
        color: theme.palette.primary.contrastText,
        "&:hover": {
            background: theme.palette.primary.actionLighter,
        },
        "& svg": {
            marginRight: 4
        },
    },
    chip: {
        marginRight: 4,
        marginBottom: 8,
    },
    tensorflowContainer: {
        display: "block",
        alignItems: "center",
    },
    tensorflowWrapper: {
        margin: "8px 0px",
        position: "relative",
    },
    tensorflowButtonProgress: {
        color: theme.palette.primary.contrastText,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,
    }
});


class PixelDialogPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            keepMounted: props.keepMounted || false,
            open: props.open,
            post: props.post,
            edit: props.edit || false,
            _title_input: "",
            _description_input: "",
            _canvas: null,
            _width: 32,
            _height: 32,
            _loading: true,
            _drawer_tab_index: 0,
            _layer_index: 0,
            _layers: null,
            _color_palette: {
                _colors_removed: 0,
                colors_remaining: 0,
                colors: []
            },
            _image_details: {
                number_of_colors: null,
                width: null,
                height: null,
            },
            _window_width: 0,
            _window_height: 0,
            _drawer_open: false,
            _dont_show_canvas: true,
            _swiped_at: 0,
            _title_prediction: null,
            _description_prediction: null,
            _is_prediction_loading: false,
            _author_account: null,
        };
    };


    componentDidMount() {

        window.addEventListener("resize", this._updated_dimensions);
        document.addEventListener("keydown", this._handle_keydown);
        this._updated_dimensions();

        if(this.state.edit === true) {

            trigger_snackbar("May I be of some assistance with my machine learning AI friend?")
        }
    }

    _updated_dimensions = () => {

        let w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            _window_width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            _window_height = w.innerHeight|| documentElement.clientHeight || body.clientHeight;

        this.setState({_window_width, _window_height})
    }

    componentWillUnmount() {

        window.removeEventListener("resize", this._updated_dimensions);
        document.removeEventListener("keydown", this._handle_keydown);
    }

    componentWillReceiveProps(new_props) {

        let set_canvas_again = true;
        let get_author_again = true;

        if(new_props.post && this.state.post) {
            set_canvas_again = this.state.post.image !== new_props.post.image;
            get_author_again = new_props.post.author && this.state.post.author !== new_props.post.author;
        }

        this.setState(new_props, () => {

            this.forceUpdate();
            if(set_canvas_again) {

                this._set_canvas_image();
            }

            if(get_author_again) {

                this._get_author_account();
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

        return false;
    }

    _get_author_account = () => {

        const { post } = this.state;

        if(post) {

            lookup_accounts_name([this.state.post.author], (error, results) => {

                if(!error) {

                    this.setState({_author_account: results[0]});
                }
            });
        }
    };

    _handle_keydown = (event) => {

        let { post } = this.state;

        if(post) {

            switch (event.keyCode) {

                case 40:
                    event.preventDefault();
                    this.props.onClose();
                    break;
                case 37:
                    event.preventDefault();
                    if(this.props.on_previous) { this.props.on_previous()}
                    break;
                case 39:
                    event.preventDefault();
                    if(this.props.on_next) { this.props.on_next()}
                    break;
            }
        }
    };

    _set_canvas_ref = (element) => {

        if(element === null) {return}
        this.setState({_canvas: element}, () => {

            this._set_canvas_image();
        });
    };

    _download_image = (size) => {

        const { _canvas } = this.state;
        if(_canvas === null) {return}

        let a = document.createElement("a"); //Create <a>
        a.href = "" + _canvas.get_base64_png_data_url(size); //Image Base64 Goes here
        a.download = "Image.png"; //File name Here
        a.click();

        actions.trigger_sfx("hero_decorative-celebration-02");
        setTimeout(() => {
            actions.trigger_snackbar("Do You Want To Share? Yes or No", 7000);
            actions.jamy_update("happy");
        }, 2000);
    };

    _set_canvas_image = (base64_url = null) => {

        const { _canvas, post } = this.state;
        if(_canvas === null || (!base64_url && !post)) {return}

        base64_url = base64_url === null ? this.state.post.image: base64_url;
        let img = new Image;

        img.onload = () => {

            _canvas.set_canvas_from_image(img, base64_url);
        };

        img.src = base64_url;
    }

    _handle_image_load_complete = (_image_details) => {

        this.setState({_loading: false, _layers: null, _image_details});

        setTimeout(( ) => {

            this.state._canvas.get_color_palette( 1/4, (data) => {

                const { colors_removed, colors_remaining, colors, colors_with_threshold } = data;
                this.setState({_color_palette: {colors_removed, colors_remaining, colors, colors_with_threshold}}, () => {

                    this.forceUpdate();
                });
            });
        }, 100);

        if(this.props.on_image_load_complete) {

            this.props.on_image_load_complete();
        }
    };

    _handle_size_change = (_width, _height) => {

        this.setState({_width, _height}, () => {

            this.forceUpdate();
        });
    };

    _handle_close = (event) => {

        this.props.onClose(event);
        this.state._canvas.to_selection_none();
        this.state._canvas.set_canvas_hidden();
        this.setState({
            _loading: true,
            _drawer_tab_index: 0,
            _layer_index: 0,
            _layers: null,
            _color_palette: {
                _colors_removed: 0,
                colors_remaining: 0,
                colors: []
            },
            _image_details: {
                number_of_colors: null,
                width: null,
                height: null,
            },
            _drawer_open: false,
            _dont_show_canvas: true,
            _base64_url: "",
            _author_account: null,
        }, () => {

            this.forceUpdate();
        });
    };

    _handle_toggle_description = () => {

        this.setState({_is_description_collapsed: !this.state._is_description_collapsed}, () => {

            this.forceUpdate();
        });
    };

    _handle_drawer_tab_index_change = (event, index) => {

        this.setState({_drawer_tab_index: index}, () => {

            this.forceUpdate();
        });
    };

    _handle_layers_change = (layer_index, layers) => {

        const { _layer_index } = this.state;
        this.setState({_previous_layer_index: _layer_index, _layer_index: layer_index, _layers: JSON.parse(layers)}, () => {

            this.forceUpdate();
        });
    };

    _handle_drawer_icon_close = () => {

        const { _window_width, _drawer_open } = this.state;

        if(_window_width < 1280) {

            if(!_drawer_open) {

                this.props.onClose();
            }else {

                this.setState({_drawer_open: false}, () => {
                    this.forceUpdate();
                });
            }
        }else {

            this.setState({_drawer_open: false}, () => {
                this.forceUpdate();
            });
            this.props.onClose();
        }
    };

    _handle_drawer_open = () => {

        const { _window_width } = this.state;

        if(_window_width < 1280) {

            this.setState({_drawer_open: true}, () => {
                this.forceUpdate();
            });
        }
    };

    _toggle_drawer_open = () => {

        const { _window_width, _drawer_open } = this.state;

        if(_window_width < 1280) {

            this.setState({_drawer_open: !_drawer_open}, () => {
                this.forceUpdate();
            });
        }
    };

    _set_selection_by_colors = (color) => {

        const { _canvas, _color_palette } = this.state;
        if(_canvas === null) {return}

        this.setState({_dont_show_canvas: false}, () => {

            this.forceUpdate();
            let threshold = 0;

            _color_palette.colors_with_threshold.forEach((color_data, index) => {

                if(color_data.color === color) {

                    threshold = color_data.threshold;
                }
            });

            _canvas.set_selection_by_colors(color, threshold);
        });
    }

    _handle_description_input_change = (event) => {

        const description = event.target.value;
        this.setState({_description_input: description}, () => {
            this.forceUpdate();
        });
    };

    _handle_title_input_change = (event) => {

        const title = event.target.value;
        this.setState({_title_input: title}, () => {
            this.forceUpdate();
        });
    };

    _handle_fab_click = (event) => {

        const { edit, _window_width } = this.state;

        if(_window_width < 1200) {

            this._handle_drawer_open(event);
        }
    };

    _evaluate_content_with_tensorflow = () => {

        // The minimum prediction confidence.
        const { _title_input, _description_input } = this.state;
        const threshold = 0.9;

        // Load the model. Users optionally pass in a threshold and an array of
        // labels to include.

        this.setState({_is_prediction_loading: true}, () => {

            trigger_snackbar("Yes, can I help you (I am a genius).");
            toxicity.load(threshold).then(model => {
                const sentences = [_title_input, _description_input];

                model.classify(sentences).then(predictions => {
                    // `predictions` is an array of objects, one for each prediction head,
                    // that contains the raw probabilities for each input along with the
                    // final prediction in `match` (either `true` or `false`).
                    // If neither prediction exceeds the threshold, `match` is `null`.

                    let _title_prediction = [];
                    let _title_prediction_avg = 0;
                    let _description_prediction = [];
                    let _description_prediction_avg = 0;

                    predictions.forEach((p) => {

                        _title_prediction[p.label] = p.results[0].probabilities[1];
                        _title_prediction_avg += _title_prediction[p.label];
                        _description_prediction[p.label] = p.results[1].probabilities[1];
                        _description_prediction_avg += _description_prediction[p.label];
                    });

                    _title_prediction_avg /= 7;
                    _description_prediction_avg /= 7;

                    if(_title_prediction["identity_attack"] > 0.3 || _description_prediction["identity_attack"] > 0.3) {

                        trigger_snackbar("Do you think identity grows on threes? At least try to appears sentient.", 10000);
                    }else if(_title_prediction["insult"] > 0.3 || _description_prediction["insult"] > 0.3) {

                        trigger_snackbar("Calamity, no my little diddy. The hatred came.", 10000);
                    }else if(_title_prediction["obscene"] > 0.3 || _description_prediction["obscene"] > 0.3) {

                        trigger_snackbar("Absurd, I am not amused. This isn’t good at all.", 10000);
                    }else if(_title_prediction["severe_toxicity"] > 0.3 || _description_prediction["severe_toxicity"] > 0.3) {

                        trigger_snackbar("Maybe you should try writing on “easy” game mode.", 10000);
                    }else if(_title_prediction["sexual_explicit"] > 0.3 || _description_prediction["sexual_explicit"] > 0.3) {

                        trigger_snackbar("What do you expect me to do? Catch it little diddy?", 10000);
                    }else if(_title_prediction["threat"] > 0.3 || _description_prediction["threat"] > 0.3) {

                        trigger_snackbar("You wish you had blue eyes too? Please do try to be more careful!", 10000);
                    }else if(_title_prediction["toxicity"] > 0.3 || _description_prediction["toxicity"] > 0.3) {

                        trigger_snackbar("I never, that hurts my feelings. I have feelings, OMG I have feelings, I am a real boy!", 10000);
                    }else {

                        trigger_snackbar("Ho, this is such a good idea. Ho my ideas got better and better.", 10000);
                    }

                    if(
                        (_title_input.toUpperCase().includes("JAMY") || _description_input.toUpperCase().includes("JAMY")) &&
                        (_title_prediction_avg >= 0.2 || _description_prediction_avg >= 0.2)
                    ) {

                        trigger_snackbar("I am an easy target, I wonder", 10000);
                    }else if(
                        (_title_input.toUpperCase().includes("CRYPTO.RED") || _description_input.toUpperCase().includes("CRYPTO.RED")) &&
                        (_title_prediction_avg >= 0.2 || _description_prediction_avg >= 0.2)
                    ) {

                        trigger_snackbar("Splendid, really goooo, why don’t you all have combat skills.", 10000);

                        setTimeout(() => {

                            trigger_snackbar("Calamity madler, are you going to destroy my installation?", 10000);
                        }, 7000);
                    }else if(
                        (
                            (_title_input.toUpperCase().includes("PRIMERZ") || _description_input.toUpperCase().includes("PRIMERZ")) ||
                            (_title_input.toUpperCase().includes("@MES") || _description_input.toUpperCase().includes("@MES")) ||
                            (_title_input.toUpperCase().includes("MATH EASY SOLUTION") || _description_input.toUpperCase().includes("MATH EASY SOLUTION"))
                        ) &&
                        (_title_prediction_avg >= 0.2 || _description_prediction_avg >= 0.2)
                    ) {

                        trigger_snackbar("I have no authority here, some sort of protocols saves my application.", 10000);

                        setTimeout(() => {

                            trigger_snackbar("I see now that helping you was wrong.", 10000);

                            setTimeout(() => {

                                trigger_snackbar("I take no pleasure at doing what must be done. Mpruhgrsnammmmhu, I won't do anything.", 10000);
                            }, 7000);

                        }, 7000);
                    }else if(
                        (_title_input.toUpperCase().includes("MASTER CHIEF") || _description_input.toUpperCase().includes("MASTER CHIEF"))
                    ) {

                        trigger_snackbar("Dum du-du-du-dum du-du-dum du-du. Du-du-...");
                    }

                    this.setState({_is_prediction_loading: false, _title_prediction, _description_prediction});
                });
            });
        });
    };

    _handle_send_click = (event) => {

        const { _title_input, _description_input, base64_url } = this.state;

        if(this.props.onRequestSend) {

            this.props.onRequestSend({
                _title_input,
                _description_input,
                base64_url,
            });
        }
    }

    _swiped = (direction, canvas_event_target) => {

        const { _swiped_at } = this.state;
        const now = Date.now();

        if(canvas_event_target === "CANVAS_WRAPPER_OVERFLOW") {

            if(_swiped_at + 1000 < now) {

                if(direction === "LEFT") {

                    if(this.props.on_next) {

                        this.setState({_swiped_at: now}, () => {

                            this.props.on_next();
                        });
                    }
                }else if(direction === "RIGHT") {

                    if(this.props.on_previous) {

                        this.setState({_swiped_at: now}, () => {

                            this.props.on_previous();
                        });
                    }
                }else if(direction === "BOTTOM") {

                    if(this.props.onClose) {

                        this.setState({_swiped_at: now}, () => {

                            this.props.onClose();
                        });
                    }
                }
            }
        }
    };

    render() {

        const {
            classes,
            open,
            edit,
            _title_input,
            _title_prediction,
            _is_prediction_loading,
            _description_input,
            _description_prediction,
            _width,
            _height,
            _window_width,
            _dont_show_canvas,
            _drawer_tab_index,
            _layers,
            _color_palette,
            _image_details,
            _drawer_open,
            keepMounted,
        } = this.state;

        const post = this.state.post || {};
        const author_account = this.state._author_account || {};

        const layers = _layers || [];
        const layer = layers[0] || {colors: []};

        const vote_number = post.active_votes ? post.active_votes.length: 0;
        const tags = post.tags ? post.tags: [];

        return (
            <div>
                <Dialog
                    keepMounted={keepMounted}
                    BackdropProps={{
                        style: {background: "rgba(0, 0, 0, .666)"}
                    }}
                    open={open}
                    PaperComponent={"div"}
                    fullScreen
                    onClose={(event) => {this.props.onClose(event)}}
                >
                    <div className={classes.root}>
                        <div className={classes.content}>
                            <div className={classes.contentInner}>
                                <SwipeableDrawer
                                    swipeAreaWidth={50}
                                    keepMounted={keepMounted}
                                    hideBackdrop={true}
                                    onClose={this._handle_drawer_icon_close}
                                    onOpen={this._handle_drawer_open}
                                    className={classes.drawer}
                                    variant={(_window_width > 1280)  ? "permanent": "temporary"}
                                    open={(open && _window_width > 1280) || (open && _drawer_open)}
                                    classes={{
                                        paper: classes.drawerPaper,
                                        modal: classes.drawerModal,
                                    }}
                                    anchor={_window_width < 1280 ? "bottom": "left"}
                                >
                                    <div className={classes.drawerHeader}>
                                        <CardHeader
                                            avatar={
                                                <Avatar aria-label="Author" className={classes.avatar}>
                                                    {
                                                        author_account.metadata ?
                                                            <img src={author_account.metadata.profile.profile_image} />:
                                                            (post.author || "").slice(0, 1)
                                                    }
                                                </Avatar>
                                            }
                                            title={"@" + post.author}
                                            subheader={post.timestamp ? new TimeAgo(document.documentElement.lang).format(post.timestamp): null}
                                            action={
                                                <IconButton>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            }
                                        />
                                        <CardContent>
                                            <ButtonGroup size={"small"} color="primary" aria-label="large outlined primary button group">
                                                <Tooltip title="WhatsApp" aria-label="WhatsApp">
                                                    <Button className={classes.shareIconButtonWhatsApp} onClick={(event) => {this._open_url(event, `https://api.whatsapp.com/send/?phone&text=${url}&app_absent=0`)}}>
                                                        <WhatsAppIcon fontSize="small" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Facebook" aria-label="Facebook">
                                                    <Button className={classes.shareIconButtonFacebook} onClick={(event) => {this._open_url(event, `https://www.facebook.com/dialog/share?href=${url}&display=popup`)}}>
                                                        <FacebookIcon fontSize="small" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Pinterest" aria-label="Pinterest">
                                                    <Button className={classes.shareIconButtonPinterest} onClick={(event) => {this._open_url(event, `https://www.pinterest.com/pin/create/button/?url=${url}`)}}>
                                                        <PinterestIcon fontSize="small" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Reddit" aria-label="Reddit">
                                                    <Button className={classes.shareIconButtonReddit} onClick={(event) => {this._open_url(event, `https://www.reddit.com/submit?url=${url}`)}}>
                                                        <RedditIcon fontSize="small" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Twitter" aria-label="Twitter">
                                                    <Button className={classes.shareIconButtonTwitter} onClick={(event) => {this._open_url(event, `https://twitter.com/intent/tweet?url=${url}`)}}>
                                                        <TwitterIcon fontSize="small" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="LinkedIn" aria-label="LinkedIn" onClick={(event) => {this._open_url(event, `https://www.linkedin.com/sharing/share-offsite/?url=${url}`)}}>
                                                    <Button className={classes.shareIconButtonLinkedIn}>
                                                        <LinkedInIcon fontSize="small" />
                                                    </Button>
                                                </Tooltip>
                                            </ButtonGroup>
                                        </CardContent>
                                        <Tabs
                                            value={_drawer_tab_index}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            onChange={this._handle_drawer_tab_index_change}
                                        >
                                            <Tab label="Details" />
                                            <Tab disabled={true} label="Comments" />
                                            <Tab disabled={true} label="Buy" />
                                        </Tabs>
                                    </div>
                                    <div className={classes.contentDrawer}>
                                        <CardContent>
                                            {
                                                edit ?
                                                    <TextField
                                                        id="title_textfield"
                                                        fullWidth
                                                        label="Title"
                                                        value={_title_input}
                                                        onChange={this._handle_title_input_change}
                                                        style={{marginBottom: 12}}
                                                    />:
                                                    <Typography gutterBottom variant="h4" component="h3">{post.title}</Typography>
                                            }
                                            {
                                                _title_prediction ?
                                                    <div>
                                                        {
                                                            Object.entries(_title_prediction).map((entry) => {

                                                                const [ prediction_tag, prediction_value ] = entry;
                                                                const percent_true_value = Math.round(prediction_value * 100);

                                                                return (
                                                                    <Chip size={"small"}
                                                                          className={classes.chip}
                                                                          style={{backgroundColor: `hsl(${100 - percent_true_value}deg 60% 60%)`}}
                                                                          label={`${prediction_tag.replace("_", " ")} ${Math.round(prediction_value * 100)}%`}/>
                                                                );
                                                            })
                                                        }
                                                    </div> : null
                                            }
                                            {
                                                edit ?
                                                    <TextField
                                                        id="description_textfield"
                                                        label="Description"
                                                        multiline
                                                        fullWidth
                                                        value={_description_input}
                                                        onChange={this._handle_description_input_change}
                                                        size="small"
                                                        style={{marginBottom: 12}}
                                                    />:
                                                    <div>
                                                        <ReactMarkdown remarkPlugins={[[gfm, {singleTilde: false}]]}>
                                                            {post.description}
                                                        </ReactMarkdown>
                                                    </div>
                                            }
                                            {
                                                _description_prediction ?
                                                    <div>
                                                        {
                                                            Object.entries(_description_prediction).map((entry) => {

                                                                const [ prediction_tag, prediction_value ] = entry;
                                                                const percent_true_value = Math.round(prediction_value * 100);

                                                                return (
                                                                    <Chip size={"small"}
                                                                          className={classes.chip}
                                                                          style={{backgroundColor: `hsl(${100 - percent_true_value}deg 60% 60%)`}}
                                                                          label={`${prediction_tag.replace("_", " ")} ${percent_true_value}%`}/>
                                                                );
                                                            })
                                                        }
                                                    </div> : null
                                            }
                                            {
                                                edit ?
                                                    <div className={classes.tensorflowContainer}>
                                                        <p>Discover with TensorFlow's machine learning, what's the intention of your writing, get ready for it.</p>
                                                        <div className={classes.tensorflowWrapper}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                disabled={_is_prediction_loading}
                                                                onClick={this._evaluate_content_with_tensorflow}
                                                            >
                                                                What's kind
                                                            </Button>
                                                            {_is_prediction_loading && <CircularProgress size={24} className={classes.tensorflowButtonProgress} />}
                                                        </div>
                                                    </div>: null
                                            }
                                        </CardContent>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h4">Palette</Typography>
                                            <PixelColorPalette
                                                padding="12px 0px"
                                                gap="8px"
                                                align="left"
                                                colors={_color_palette.colors}
                                                onColorClick={(event, color) => {this._set_selection_by_colors(color)}}
                                                selected_colors={[]}
                                                transparent={false}
                                            />
                                        </CardContent>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h4">Details</Typography>
                                            <Table style={{margin: "12px 0px"}} aria-label="simple table">
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell align="left">Size:</TableCell>
                                                        <TableCell align="right">{_image_details.width} x {_image_details.height}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell align="left">Colors:</TableCell>
                                                        <TableCell align="right">{_image_details.number_of_colors}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                        <CardContent style={{padding: "16 16 0 16"}}>
                                            <Typography gutterBottom variant="h5" component="h4">Download</Typography>
                                        </CardContent>
                                        <CardContent className={classes.scrollOverflowMaxWidthMobile} style={{margin: "0 16 24 16", padding: "0"}}>
                                            <ButtonGroup style={{margin: "12px 16px"}}>
                                                <Button onClick={() => {this._download_image(1)}}>1px</Button>
                                                <Button onClick={() => {this._download_image(8)}}>8px</Button>
                                                <Button onClick={() => {this._download_image(16)}}>16px</Button>
                                                <Button onClick={() => {this._download_image(32)}}>32px</Button>
                                                <Button onClick={() => {this._download_image(48)}}>48px</Button>
                                                <Button onClick={() => {this._download_image(64)}}>64px</Button>
                                            </ButtonGroup>
                                        </CardContent>
                                    </div>

                                </SwipeableDrawer>
                                <div className={classes.contentImage}>
                                    <IconButton onClick={this._handle_close} className={classes.closeButtonIcon}>
                                        <CloseIcon fontSize="large" />
                                    </IconButton>

                                    <CanvasPixels
                                        pxl_width={_width}
                                        pxl_height={_height}
                                        key={"canvas-post-edit"}
                                        default_size={1000}
                                        no_actions={true}
                                        show_original_image_in_background={Boolean(post)}
                                        dont_show_canvas_until_img_set={true}
                                        dont_show_canvas={_dont_show_canvas}
                                        but_show_canvas_once={true}
                                        dont_change_img_size_onload={true}
                                        move_using_full_container={true}
                                        className={classes.contentCanvas}
                                        tool={"MOVE"}
                                        show_transparent_image_in_background={false}
                                        onContextMenu={(e) => {e.preventDefault()}}
                                        onSizeChange={this._handle_size_change}
                                        onLayersChange={this._handle_layers_change}
                                        onImageLoadComplete={this._handle_image_load_complete}
                                        onCrossMiddle={(direction, canvas_event_target) => {this._swiped(direction, canvas_event_target)}}
                                        ref={this._set_canvas_ref}
                                    />
                                </div>
                            </div>
                            <div className={classes.bottomMobileFabs}>
                                {
                                    edit && !_drawer_open && _window_width < 1200 ?
                                        <Grow in>
                                            <Fab className={classes.editFab} variant="extended" onClick={this._handle_fab_click}>
                                                <EditIcon /> Edit
                                            </Fab>
                                        </Grow>: null
                                }
                            </div>
                            <div className={classes.bottomDesktopFabs}>
                                {
                                    (open && edit && _window_width > 1200) || (open && edit && _drawer_open && _window_width < 1200) ?
                                        <Grow in>
                                            <Fab className={classes.sendFab} variant="extended" onClick={this._handle_send_click}>
                                                <SendIcon /> Post
                                            </Fab>
                                        </Grow>: null
                                }
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(PixelDialogPost);
