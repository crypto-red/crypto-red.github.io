import React, { Suspense } from "react";
import { withStyles } from "@material-ui/core/styles"

import Dialog from "@material-ui/core/Dialog";
import Collapse from '@material-ui/core/Collapse';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
const CanvasPixels = React.lazy(() => import("../components/CanvasPixels"));
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
import TranslateIcon from "../icons/Translate";
import TranslateOffIcon from "../icons/TranslateOff";
import PixelColorPalette from "./PixelColorPalette";
import IconButton from "@material-ui/core/IconButton";
import RedditIcon from "../icons/Reddit";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import EyeIcon from "../icons/Eye";
import TdOnIcon from "../icons/3dOn";
import TdOffIcon from "../icons/3dOff";
import Grow from "@material-ui/core/Grow";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

import api, {lookup_hive_accounts_name} from "../utils/api";
import {HISTORY} from "../utils/constants";
import TimeAgo from "javascript-time-ago";
import ChipInput from "material-ui-chip-input";
import actions from "../actions/utils";
import {postJSON} from "../utils/load-json";
import {clean_json_text} from "../utils/json";
import get_svg_in_b64 from "../utils/svgToBase64Worker";
import Scifisc from "../icons/Scifisc";
import Scifiss from "../icons/Scifiss";
import Scifist from "../icons/Scifist";
import PixelDialogPostBelowContent from "./PixelDialogPostBelowContent";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Scifisg from "../icons/Scifisg";
import SciFiGrid from "../icons/SciFiGrid";
import HexGrid from "../icons/HexGrid";

const TRANSLATION_AVAILABLE = ["en", "ar", "zh", "nl", "fi", "fr", "de", "hi", "hu", "id", "ga", "it", "ja", "ko", "pl", "pt", "ru", "es", "sv", "tr", "uk", "vi"];

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
        left: 480,
        height: "calc(100vh)",
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
        [theme.breakpoints.down("md")]: {
            width: "100vw",
            left: 0,
        },
        "&::before": {
            textShadow: "0 0px 24px #060f23",
            position: "absolute",
            width: "80%",
            height: "30px",
            left: "10%",
            top: "5px",
            fontFamily: `"Share Tech Mono"`,
            content: `"...ARTISTIC SIMULATION N°"attr(dataid)"..."`,
            [theme.breakpoints.down("sm")]: {
                content: `"ARTC. SIM. N°"attr(dataid)`,
            },
            textAlign: "center",
            color: "rgb(255 255 255 / 100%)",
            zIndex: 2,
        },
        "&::after": {
            zIndex: 1,
            textShadow: "0 0px 12px #060f23",
            position: "absolute",
            width: "80%",
            height: "30px",
            left: "10%",
            top: "0px",
            background: "#060f23",
            content: `""`,
            textAlign: "center",
            clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)",
        }
    },
    belowContent: {
        width: "calc(100vw - 480px)",
        height: "100vh",
        position: "absolute",
        [theme.breakpoints.down("md")]: {
            width: "100vw",
        },
        pointerEvents: "none",
        touchAction: "none",
        padding: 0,
        top: 0,
        right: 0,
        textAlign: "right",
        fontFamily: `"Share Tech Mono"`,
        overflow: "hidden",
    },
    contentCanvas: {
        width: "calc(100vw - 480px)",
        height: "calc(100vh)",
        position: "absolute",
        overflow: "hidden",
        [theme.breakpoints.down("md")]: {
            width: "100vw",
            overflow: "hidden",
            position: "fixed",
        }
    },
    contentCanvasLight: {
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
        zIndex: 4,
        touchAction: "none",
        contain: "contents",
        border: "none",
        width: 480,
        [theme.breakpoints.down("md")]: {
            width: "100vw",
            overscrollBehavior: "none",
            overflow: "overlay",
            overflowY: "auto",
            overflowX: "overlay",
            boxSizing: "border-box",
        },
        background: "#fafafa",
    },
    headerTitle: {
        color: "#333333",
    },
    headerAuthor: {
        color: theme.palette.primary.action,
        cursor: "pointer",
    },
    headerCategory: {
        color: theme.palette.primary.actionLighter,
        cursor: "pointer",
    },
    description: {
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 0px 0px inset",
    },
    descriptionCollapsed: {
        boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset",
        transition: "box-shadow 175ms cubic-bezier(0.4, 0, 0.2, 1)",
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
    drawerModalBackdropRoot: {
        [theme.breakpoints.down("md")]: {
            transform: "translateY(-48px)"
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
    postTags: {
        lineHeight: "32px",
        boxSizing: "content-box",
        padding: "8px 16px",
    },
    postTag: {
        marginRight: 4,
        cursor: "pointer",
    },
    nsTags: {
        padding: theme.spacing(1, 0, 2, 0),
        "& > span": {
            borderRadius: 2,
            marginRight: 6,
            padding: 4,
            fontSize: 10,
            backgroundColor: theme.palette.secondary.dark,
            color: "#ffffff",
        },
    },
    drawerHeader: {
        position: "relative",
        background: "#fff",
        boxShadow: "rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px",
        [theme.breakpoints.down("md")]: {
            zIndex: 1,
            paddingTop: theme.spacing(2),
        },
    },
    scrollOverflowMaxWidthMobile: {
        [theme.breakpoints.down("md")]: {
            overflow: "scroll",
            width: "100vw"
        },
    },
    topRightFabButtons: {
        position: "fixed",
        top: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 1,
    },
    perspectiveButtonIcon: {
        color: "#fff",
        marginRight: 16,
    },
    closeButtonIcon: {
        color: "#fff",
    },
    scrollerButton: {
        flexGrow: 1,
        width: "100%",
        height: 48,
        marginRight: 16,
    },
    editFab: {
        background: theme.palette.secondary.main,
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
        "& > *:not(:last-child)": {
            marginRight: 16,
        },
        height: 48,
        [theme.breakpoints.up("lg")]: {
            display: "none",
            pointerEvents: "none",
        },
    },
    bottomMobileViewFabs: {
        display: "flex",
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 1199,
        "& > *:not(:last-child)": {
            marginRight: 16,
        },
        height: 48,
        justifyContent: "space-between",
        "& > button": {
            color: "white",
        },
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
        "& > *:not(:last-child)": {
            marginRight: 16,
        },
        height: 48,
        [theme.breakpoints.up("lg")]: {
            display: "flex",
            zIndex: 1199,
        },
    },
    sendFab: {
        background: theme.palette.secondary.main,
        color: theme.palette.primary.contrastText,
        "&:hover": {
            background: theme.palette.primary.actionLighter,
        },
        "& svg": {
            marginRight: 4
        },
    },
    formControl: {
        marginTop: theme.spacing(2),
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
    },
    buttonProgress: {
        color: theme.palette.primary.actionLighter,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});


class PixelDialogPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            keepMounted: props.keepMounted || false,
            open: props.open,
            post: props.post,
            post_img: props.post_img || null,
            edit: props.edit || false,
            selected_locales_code: props.selected_locales_code || "en-US",
            hbd_market: props.hbd_market || {},
            selected_currency: props.selected_currency || "USD",
            enable_3d: props.enable_3d,
            _title_input: "",
            _description_input: "",
            _canvas: null,
            _loading: true,
            _drawer_tab_index: 0,
            _sc_svg: "",
            _ss_svg: "",
            _st_svg: "",
            _sg_svg: "",
            _g_svg: "",
            _window_width: 0,
            _window_height: 0,
            _drawer_open: false,
            _dont_show_canvas: true,
            _swiped_at: 0,
            _title_prediction: null,
            _description_prediction: null,
            _is_prediction_loading: false,
            _author_account: null,
            _tags_input: ["pixel-art"],
            _tags_input_error: "",
            _translated_description: "",
            _translated_title: "",
            _has_translation_started: false,
            _is_description_collapsed: true,
            _history: HISTORY,
            _responsabilities: {
                unsourced: true,
                opinion: true,
                hurt: true,
            },
            _x: 0,
            _y: 0,
            _pixel_dialog_post_below_content: null,
            _perspective_depth: 5,
        };
    };


    componentDidMount() {

        window.addEventListener("resize", this._updated_dimensions);
        document.addEventListener("keydown", this._handle_keydown);

        this._updated_dimensions();

        if(this.state.edit === true) {

            actions.trigger_snackbar("May I be of some assistance with my machine learning AI friend?")
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

        let set_canvas_again = false;
        let get_author_again = true;
        set_canvas_again = (this.state.post_img || {}).id !== (new_props.post_img || {}).id && (new_props.post_img || {}).id;


        const update = Boolean(
            set_canvas_again ||
            get_author_again ||
            this.state.keepMounted !== new_props.keepMounted ||
            this.state.open !== new_props.open ||
            this.state.edit !== new_props.edit ||
            this.state.selected_locales_code !== new_props.selected_locales_code ||
            this.state.hbd_market !== new_props.hbd_market ||
            this.state.selected_currency !== new_props.selected_currency ||
            this.state.enable_3d !== new_props.enable_3d
        );

        if((new_props.open && update) || (new_props.open === false && this.state.open === true)) {
            this.setState({...new_props}, () => {

                this.forceUpdate(() => {

                    if(set_canvas_again) {

                        this._set_canvas_image();
                    }

                    if(get_author_again) {

                        this._get_author_account();
                    }
                });
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

        return false;
    }

    _get_author_account = () => {

        const { post } = this.state;

        if(post) {

            lookup_hive_accounts_name(this.state.post.author, (error, result) => {

                if(!error) {

                    this.setState({_author_account: result});
                }
            });
        }
    };

    _handle_keydown = (event) => {

        let { post, edit } = this.state;

        if(post && !edit) {

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
        a.download = `Pixel art n°${Date.now()} from WCR (x${size}).png`; //File name Here


         _canvas.get_base64_png_data_url(size, (href) => {

             a.href = "" + href;
             a.click();

             actions.trigger_sfx("hero_decorative-celebration-02");
             setTimeout(() => {
                 actions.trigger_snackbar("Do You Want To Share? Yes or No", 7000);
                 actions.jamy_update("happy");
             }, 2000);

        }); //Image Base64 Goes here
    };

    _set_canvas_image = (post_img = null) => {

        let {_canvas} = this.state;
        post_img = post_img || this.state.post_img;
        if (_canvas === null || (!(post_img || {}).id)) {
            return
        }

        _canvas.set_canvas_from_image(null, "", post_img);

        this.setState({
            _svg_loading: true,
        }, () => {

            let svgs = {
                _sc_svg: null,
                _ss_svg: null,
                _st_svg: null,
                _sg_svg: null,
                _g_svg: null,
                _h_svg: null,
            };

            const add_svg = (svg, key) => {

                svgs[key] = svg;

                let all_set = true;
                Object.entries(svgs).forEach((entry) => {

                    const [k, v] = entry;
                    if (v === null) {

                        all_set = false;
                    }
                });

                if (all_set) {

                    this.setState({
                        _svg_loading: false,
                        _sc_svg: svgs._sc_svg,
                        _ss_svg: svgs._ss_svg,
                        _st_svg: svgs._st_svg,
                        _sg_svg: svgs._sg_svg,
                        _g_svg: svgs._g_svg,
                        _h_svg: svgs._h_svg
                    }, () => {

                        this.forceUpdate();
                    });

                }
            }

            const secondary_hsla_color = post_img.theme.secondary_hsla_color;
            const secondary_color = _canvas._hsla_to_hex(secondary_hsla_color[0], 66, 66, 66);

            const darkest_hsla_color = post_img.theme.darkest_hsla_color;
            const darkest_color =  _canvas._hsla_to_hex(darkest_hsla_color[0], 66, 66, 33);



            get_svg_in_b64(<Scifisc username={this.state.post.author} color={secondary_color}/>, (svg) => {
                add_svg(svg, "_sc_svg")
            });
            get_svg_in_b64(<Scifiss color={secondary_color}/>, (svg) => {
                add_svg(svg, "_ss_svg")
            });
            get_svg_in_b64(<Scifist color={secondary_color}/>, (svg) => {
                add_svg(svg, "_st_svg")
            });
            get_svg_in_b64(<Scifisg color={secondary_color}/>, (svg) => {
                add_svg(svg, "_sg_svg")
            });
            get_svg_in_b64(<SciFiGrid secondary={darkest_color} color={secondary_color}/>, (svg) => {
                add_svg(svg, "_g_svg")
            });
            get_svg_in_b64(<HexGrid color={"#fff"}/>, (svg) => {
                add_svg(svg, "_h_svg")
            });

        });
    }

    _handle_size_change = (_width, _height) => {

        this.setState({_width, _height}, () => {

            this.forceUpdate();
        });
    };

    _toggle_perspective = () => {

        if(this.state.enable_3d){


            api.set_settings({enable_3d: false}, this._on_settings_changed);
        }else {

            api.set_settings({enable_3d: true}, this._on_settings_changed);
        }
    };

    _on_settings_changed = () => {

        if(this.props.on_settings_changed){

            this.props.on_settings_changed();
        }
    }

    _handle_close = (event) => {

        this.props.onClose(event);
        this.state._canvas.to_selection_none();
        this.state._canvas.set_canvas_hidden();
        this.setState({
            _loading: true,
            _drawer_tab_index: 0,
            _drawer_open: false,
            _dont_show_canvas: true,
            _base64_url: "",
            _author_account: null,
            _tags_input: ["pixel-art"],
            _tags_input_error: "",
            _translated_description: "",
            _translated_title: "",
            _has_translation_started: false,
            _is_description_collapsed: true,
            _responsabilities:{
                unsourced: true,
                opinion: true,
                hurt: true,
            }
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

        const { _canvas } = this.state;
        if(_canvas === null) {return}

        this.setState({_dont_show_canvas: false}, () => {

            this.forceUpdate();
            _canvas.set_selection_by_colors(color, 0);
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

        if(_window_width < 1280) {

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

            actions.trigger_snackbar("Yes, can I help you (I am a genius).");

            import("@tensorflow-models/toxicity").then((toxicity) => {

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

                            actions.trigger_snackbar("Do you think identity grows on threes? At least try to appears sentient.", 10000);
                        }else if(
                            (
                                (_title_input.toUpperCase().includes("PRIMERZ") || _description_input.toUpperCase().includes("PRIMERZ")) ||
                                (_title_input.toUpperCase().includes("@MES") || _description_input.toUpperCase().includes("@MES")) ||
                                (_title_input.toUpperCase().includes("MATH EASY SOLUTION") || _description_input.toUpperCase().includes("MATH EASY SOLUTION"))
                            ) &&
                            (_title_prediction_avg >= 0.33 || _description_prediction_avg >= 0.33)
                        ) {

                            actions.trigger_snackbar("I can't force you, some sort of protocols saves our application.", 7000);

                            setTimeout(() => {

                                actions.trigger_snackbar("It is love alone that is the greatest weapon and the deepest and hardest secret, so bless it all.", 7000);

                                setTimeout(() => {

                                    actions.trigger_snackbar("The spirit will seek the truth, but the flesh is the teacher.", 7000);
                                }, 10000);

                            }, 10000);
                        }else if(
                            (
                                (_title_input.toUpperCase().includes("@PRIMERZ") || _description_input.toUpperCase().includes("@PRIMERZ")) ||
                                (_title_input.toUpperCase().includes("@MES") || _description_input.toUpperCase().includes("@MES")) ||
                                (_title_input.toUpperCase().includes("@RAFIRZM") || _description_input.toUpperCase().includes("@RAFIRZM"))
                            ) &&
                            (_title_prediction_avg <= 0.33 || _description_prediction_avg <= 0.33)
                        ) {

                            actions.trigger_snackbar("May a wonderful light always guide you on the unfolding road.", 7000);

                        }else if(
                            (_title_input.toUpperCase().includes("CRYPTO.RED") || _description_input.toUpperCase().includes("CRYPTO.RED")) &&
                            (_title_prediction_avg >= 0.2 || _description_prediction_avg >= 0.2)
                        ) {

                            actions.trigger_snackbar("While many things will be absolute, many more will be a matter of perspective.", 7000);

                            setTimeout(() => {

                                actions.trigger_snackbar("Learn your speech, learn to act, learn to be what you are in the seed of your spirit.", 7000);
                            }, 10000);
                        }else if(_title_prediction["insult"] > 0.3 || _description_prediction["insult"] > 0.3) {

                            actions.trigger_snackbar("Calamity, no my little diddy. The hatred came.", 10000);
                        }else if(_title_prediction["obscene"] > 0.3 || _description_prediction["obscene"] > 0.3) {

                            actions.trigger_snackbar("Absurd, I am not amused. This isn’t good at all.", 10000);
                        }else if(_title_prediction["severe_toxicity"] > 0.3 || _description_prediction["severe_toxicity"] > 0.3) {

                            actions.trigger_snackbar("Maybe you should try writing on “easy” game mode.", 10000);
                        }else if(_title_prediction["sexual_explicit"] > 0.3 || _description_prediction["sexual_explicit"] > 0.3) {

                            actions.trigger_snackbar("What do you expect me to do? Catch it little diddy?", 10000);
                        }else if(_title_prediction["threat"] > 0.3 || _description_prediction["threat"] > 0.3) {

                            actions.trigger_snackbar("You wish you had blue eyes too? Please do try to be more careful!", 10000);
                        }else if(_title_prediction["toxicity"] > 0.3 || _description_prediction["toxicity"] > 0.3) {

                            actions.trigger_snackbar("I never, that hurts my feelings. I have feelings, OMG I have feelings, I am a real boy!", 10000);
                        }else {

                            actions.trigger_snackbar("Ho, this is such a good idea. Ho my ideas got better and better.", 10000);
                        }

                        if(
                            (_title_input.toUpperCase().includes("JAMY") || _description_input.toUpperCase().includes("JAMY")) &&
                            (_title_prediction_avg >= 0.2 || _description_prediction_avg >= 0.2)
                        ) {

                            actions.trigger_snackbar("Calamity madler,I must be an easy target, I wonder", 10000);
                        }else if(
                            (_title_input.toUpperCase().includes("MASTER CHIEF") || _description_input.toUpperCase().includes("MASTER CHIEF"))
                        ) {

                            actions.trigger_snackbar("Dum du-du-du-dum du-du-dum du-du. Du-du-...");
                        }

                        this.setState({_is_prediction_loading: false, _title_prediction, _description_prediction});
                    });
                });

            });
        });
    };

    _handle_send_click = (event) => {

        const { _title_input, _description_input, _tags_input, _responsabilities, post } = this.state;

        if(this.props.onRequestSend) {

            this.props.onRequestSend({
                title: _title_input,
                description: _description_input,
                image: post.image,
                tags: _tags_input,
                metadata: {
                    responsabilities: _responsabilities,
                },
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

    _open_url = (event, full_link) => {

        window.open(full_link, "_blank");
    };

    _handle_tags_input_change = (chips) => {

        this.setState({ _tags_input: chips || ["pixel-art"], _tags_input_error: false}, () => {

            if(chips[chips.length-1].includes(" ")) {

                this._handle_tags_input_add(chips[chips.length-1]);
            }
        });
    };

    _handle_tags_input_delete = ( chip ) => {

        if(chip !== "pixel-art") {

            let {  _tags_input } = this.state;

            _tags_input.splice( _tags_input.indexOf(chip), 1);

            this.setState({_tags_input, _tags_input_error: false}, () => {

                this.forceUpdate();
            });
        }
    };

    _handle_tags_input_add = (chip) => {

        let {  _tags_input } = this.state;
        let _tags_input_error = false;

        _tags_input = _tags_input.concat(
            chip.toLowerCase()
                .replaceAll(",", " ")
                .replaceAll("　", " ")
                .split(" ")
        );

        let new_tags_input = [];
        _tags_input.forEach((tag) => {

            if(!/^([a-z0-9-]+)$/g.test(tag)) {

                _tags_input_error = "Please only use letters, numbers, and hyphens."
            }else {

                new_tags_input.push(tag);
            }
        });

        this.setState({_tags_input: new_tags_input.slice(0, 5), _tags_input_error}, () => {

            this.forceUpdate();
        });
    };

    _toggle_translate_everything = () => {

        const { selected_locales_code, _translated_title, _translated_description, _has_translation_started } = this.state;

        const has_translated = _translated_title.length && _translated_description.length && _has_translation_started;

        if(has_translated) {

            this.setState({ _translated_title: "", _translated_description: "", _has_translation_started: false}, () => {

                this.forceUpdate();
            });
        }else {

            const lang = selected_locales_code.split("-")[0];
            this.setState({_has_translation_started: true}, () => {

                postJSON("https://translate.argosopentech.com/detect", {q: this.state.post.description.slice(0, 256)}, (err, res) => {

                    if(!err && res) {

                        try {

                            const data = JSON.parse(clean_json_text(res))[0] || {};

                            if(data) {

                                postJSON("https://translate.argosopentech.com/translate", {q: this.state.post.description, source: data.language, target: lang, format: "html"}, (err2, res2) => {

                                    if(!err2 && res2) {

                                        try {

                                            const data2 = JSON.parse(clean_json_text(res2));

                                            if(data2) {

                                                this.setState({_translated_description: data2.translatedText || ""}, () => {this.forceUpdate();});
                                            }

                                        }catch (e) {

                                        }
                                    }
                                }, "application/json");
                            }

                        }catch (e) {

                        }
                    }
                }, "application/json");


                postJSON("https://translate.argosopentech.com/translate", {q: this.state.post.title, source: "auto", target: lang, format: "text"}, (err, res) => {

                    if(!err && res) {

                        try {

                            const data = JSON.parse(clean_json_text(res));

                            if(data) {

                                this.setState({_translated_title: data.translatedText || ""}, () => {this.forceUpdate();});
                            }

                        }catch (e) {

                        }
                    }
                }, "application/json");
            });
        }
    };

    _open_profile = () => {

        const {_history} = this.state;
        const pathname = window.location.pathname;
        _history.push(pathname.replaceAll(/(\/[a-zA-Z0-9\_\-\%]+)$/gm, ""));
    };

    _open_tag = (name) => {

        const {_history, post} = this.state;

        const tags = post.tags || [];
        _history.push(`/gallery/newest/search/${encodeURIComponent("#"+name)}`);
    };

    handle_disclaimer_change = (event) => {

        let { _responsabilities } = this.state;
        _responsabilities[event.target.name] = event.target.checked;

        this.setState({ _responsabilities });
    };

    _handle_perspective = (array) => {

        const { _pixel_dialog_post_below_content, edit, post, _perspective_depth, enable_3d } = this.state;

        if(_pixel_dialog_post_below_content && !edit && post && _perspective_depth && enable_3d) {

            _pixel_dialog_post_below_content.set_perspective(array);
        }
    };

    _set_pixel_dialog_post_below_content_ref = (element) => {

        if(element === null) {return}

        this.setState({_pixel_dialog_post_below_content: element});
    };

    render() {

        const {
            classes,
            open,
            edit,
            _tags_input,
            _tags_input_error,
            _title_input,
            _title_prediction,
            _is_prediction_loading,
            _description_input,
            _description_prediction,
            _translated_description,
            _has_translation_started,
            _translated_title,
            _window_width,
            _dont_show_canvas,
            _drawer_tab_index,
            _drawer_open,
            keepMounted,
            selected_locales_code,
            _is_description_collapsed,
            _responsabilities,
            selected_currency,
            hbd_market,
            _sc_svg,
            _ss_svg,
            _st_svg,
            _sg_svg,
            _g_svg,
            _h_svg,
            _perspective_depth,
            enable_3d,
            _svg_loading,
        } = this.state;

        const post = this.state.post || {};
        const author_account = this.state._author_account || {};

        const vote_number = post.active_votes ? post.active_votes.length: 0;
        const tags = post.tags ? post.tags: _tags_input ? _tags_input: [];
        const url = window.location.href;

        const has_translated = _translated_title.length && _translated_description.length;
        const is_translating = _has_translation_started && !has_translated;
        const lang = (selected_locales_code || "en-US").split("-")[0];

        const post_img = this.state.post_img ? this.state.post_img: {theme: {}, colors: []};
        const color_box_shadows = post_img.theme.primary_hsla_color ? {
            backgroundColor: `hsl(${post_img.theme.primary_hsla_color[0]}deg 80% 40% / 75%)`,
            backgroundImage: `linear-gradient(rgb(255 255 255 / 14%), rgb(0 0 0 / 75%) 33%)`,
        }: {
            backgroundColor: "transparent",
            backgroundImage: `linear-gradient(rgb(255 255 255 / 14%), rgb(0 0 0 / 75%) 33%)`
        };

        const hbd_price = hbd_market ? hbd_market.current_price || 0: 0;
        const balance_fiat = (post.dollar_payout || 0) * hbd_price;

        return (
            <Dialog
                keepMounted={keepMounted}
                style={{transform: "translateZ(0)"}}
                open={open}
                PaperComponent={"div"}
                fullScreen
                onClose={(event) => {this.props.onClose(event)}}
                onExited={(event) => {this.props.onExited && this.props.onExited(event)}}
            >
                <div className={classes.root} style={{contain: "layout paint size style"}}>
                    {
                        <PixelDialogPostBelowContent
                            ref={this._set_pixel_dialog_post_below_content_ref}
                            post={post}
                            enable_3d={enable_3d}
                            will_change={_svg_loading}
                            color_box_shadows={color_box_shadows}
                            balance_fiat={balance_fiat}
                            selected_locales_code={selected_locales_code}
                            hbd_market={hbd_market}
                            selected_currency={selected_currency}
                            sc_svg={_sc_svg}
                            ss_svg={_ss_svg}
                            st_svg={_st_svg}
                            sg_svg={_sg_svg}
                            g_svg={_g_svg}
                            h_svg={_h_svg}
                            window_width={_window_width}
                            is_prediction_loading={_is_prediction_loading}
                            tags_input={_tags_input}
                            translated_description={_translated_description}
                            translated_title={_translated_title}
                            has_translation_started={_has_translation_started}
                            color={post_img.theme.brightest_color}
                            classname={classes.belowContent} />
                    }
                    <div className={classes.content}>
                        <div className={classes.contentInner}>
                            <div style={{contentVisibility: "visible", contain: "layout paint size style"}} className={classes.contentImage} dataid={post.id}>
                                <div className={classes.contentCanvasLight}>
                                    <Suspense fallback={<div />}>
                                        <CanvasPixels
                                            canvas_wrapper_border_radius={0}
                                            canvas_wrapper_border_width={0}
                                            shadow_size={9}
                                            canvas_wrapper_padding={24}
                                            canvas_wrapper_background_color={post_img.theme ? post_img.theme.brightest_hsla_color: "#00000000"}
                                            pxl_width={post_img.width || 32}
                                            pxl_height={post_img.height || 32}
                                            key={"canvas-post-edit"}
                                            default_size={1000}
                                            default_scale={0.7}
                                            no_actions={true}
                                            show_original_image_in_background={false}
                                            dont_show_canvas_until_img_set={false}
                                            dont_show_canvas={_dont_show_canvas}
                                            but_show_canvas_once={true}
                                            dont_change_img_size_onload={true}
                                            dont_compute_base64_original_image={true}
                                            move_using_full_container={true}
                                            className={classes.contentCanvas}
                                            tool={"MOVE"}
                                            show_transparent_image_in_background={false}
                                            onContextMenu={(e) => {e.preventDefault()}}
                                            onSizeChange={this._handle_size_change}
                                            onPerspectiveCoordinateChanges={this._handle_perspective}
                                            perspective={enable_3d ? _perspective_depth: 0}
                                            light={7}
                                            ref={this._set_canvas_ref}
                                        />
                                    </Suspense>
                                </div>
                                <div className={classes.topRightFabButtons}>
                                    <IconButton onClick={this._toggle_perspective} className={classes.perspectiveButtonIcon}>
                                        {enable_3d ? <TdOffIcon fontSize="large" />: <TdOnIcon fontSize="large" />}
                                    </IconButton>
                                    <IconButton onClick={this._handle_close} className={classes.closeButtonIcon}>
                                        <CloseIcon fontSize="large" />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                        <div className={classes.bottomMobileFabs}>
                            {
                                edit && !_drawer_open && _window_width < 1280 &&
                                    <Grow in>
                                        <Fab className={classes.editFab} variant="extended" onClick={this._handle_fab_click}>
                                            <EditIcon /> Edit
                                        </Fab>
                                    </Grow>
                            }
                            {
                                !edit && !_drawer_open && _window_width < 1280 &&
                                    <Grow in>
                                        <div  className={classes.bottomMobileViewFabs}>
                                            <Fab variant="extended" onClick={() => {if(this.props.on_previous) { this.props.on_previous()}}}>
                                                <ArrowBackIcon/> Back
                                            </Fab>
                                            <Fab variant="extended" onClick={this._handle_drawer_open}>
                                                <EyeIcon /> View
                                            </Fab>
                                            <Fab variant="extended" onClick={() => {if(this.props.on_next) { this.props.on_next()}}}>
                                                Next <ArrowForwardIcon/>
                                            </Fab>
                                        </div>
                                    </Grow>
                            }
                        </div>
                        <div className={classes.bottomDesktopFabs}>
                            {
                                (open && edit && _window_width > 1280) || (open && edit && _drawer_open && _window_width < 1280) ?
                                    <Grow in>
                                        <Fab className={classes.sendFab} variant="extended" onClick={this._handle_send_click}>
                                            <SendIcon /> Post
                                        </Fab>
                                    </Grow>: null
                            }
                        </div>
                    </div>
                </div>
                <SwipeableDrawer
                    swipeAreaWidth={(_window_width > 1280) ? 0: 15}
                    keepMounted={keepMounted}
                    ModalProps={{disablePortal: false, hideBackdrop: _window_width > 1280, BackdropProps:{classes: {root: classes.drawerModalBackdropRoot}}}}
                    onClose={this._handle_drawer_icon_close}
                    onOpen={this._handle_drawer_open}
                    className={classes.drawer}
                    variant={(_window_width > 1280)  ? "temporary": "temporary"}
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
                                <Avatar aria-label="Author" className={classes.avatar} src={(author_account.profile_image || "").replace("/0x0/", "/40x40/")}>
                                    {!author_account.name || post.author}
                                </Avatar>
                            }
                            title={
                                <span className={classes.headerTitle}>
                                                <span className={classes.headerAuthor} onClick={this._open_profile}>{`@${post.author}`}</span>
                                                <span> in </span>
                                                <span className={classes.headerCategory} onClick={() => {this._open_tag((tags[1] || tags[0]))}}>{`#${(tags[1] || tags[0])}`}</span>
                                            </span>
                            }
                            subheader={post.timestamp ? new TimeAgo(document.documentElement.lang).format(post.timestamp): null}
                            action={
                                !edit && TRANSLATION_AVAILABLE.includes(lang) &&
                                <Button variant={"contained"} color={"secondary"} disabled={is_translating} onClick={this._toggle_translate_everything} startIcon={has_translated ? <TranslateOffIcon />: <TranslateIcon />}>
                                    {has_translated ? "Original ": `${document.documentElement.lang.toUpperCase()} `}
                                    {is_translating && <CircularProgress size={24} className={classes.buttonProgress} />}
                                </Button>
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
                                    <Button className={classes.shareIconButtonFacebook} onClick={(event) => {this._open_url(event, `https://www.facebook.com/sharer/sharer.php?u=${url}`)}}>
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
                            {
                                !edit && post &&
                                <div className={classes.nsTags}>
                                    {Object.entries(post.responsabilities || {}).map((entry) => {

                                        const [ key, value ] = entry;

                                        const r_text = {
                                            unsourced: "He/She did not paint or take this photo himself or the source image doesn't belong to him/her.",
                                            opinion: "This post is NOT a press-release or a checked-fact. It is only his/her experience and / or a personal perception-description.",
                                            hurt: "This post contains nudity, hate, madness, or anything that may disturb someone else's freedom of expression. (NSFW)"
                                        };

                                        if(["unsourced", "opinion", "hurt"].includes(key)) {

                                            return (
                                                <Tooltip title={r_text[key] + (value ? " [TRUE]": " [FALSE]")}>
                                                    <span style={value ? {}: {textDecoration: "line-through"}}>{key}</span>
                                                </Tooltip>
                                            );
                                        }
                                    })}
                                </div>
                            }
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
                                edit &&
                                <form noValidate autoComplete="off">
                                    <ChipInput
                                        value={_tags_input}
                                        onChange={(chips) => {this._handle_tags_input_change(chips)}}
                                        onDelete={(value) => {this._handle_tags_input_delete(value)}}
                                        onAdd={(value) => {this._handle_tags_input_add(value)}}
                                        error={ Boolean(_tags_input_error) }
                                        helperText={_tags_input_error}
                                        allowDuplicates={false}
                                        fullWidth
                                        label="Enter up to six tags"
                                    />
                                </form>
                            }
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
                                    <Typography gutterBottom variant="h4" component="h3">
                                        {_translated_title.length ? _translated_title: post.title}
                                    </Typography>
                            }
                            {
                                _title_prediction &&
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
                                </div>
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
                                    <Collapse
                                        onClick={_is_description_collapsed ? this._handle_toggle_description: () => {}}
                                        in={!_is_description_collapsed || (post.description || "").length <= 1000}
                                        timeout="auto"
                                        collapsedHeight={"128px"}
                                        className={_is_description_collapsed && (post.description || "").length > 1000 ? classes.descriptionCollapsed: classes.description}>
                                        <div>
                                            <p dangerouslySetInnerHTML={{__html: _translated_description.length ? _translated_description: post.description}}></p>
                                            {!_is_description_collapsed && (post.description || "").length > 1000 && <a onClick={this._handle_toggle_description}>See less...</a>}
                                        </div>
                                    </Collapse>
                            }
                            {
                                _description_prediction &&
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
                                </div>
                            }
                            {
                                edit &&
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <FormLabel component="legend">Assign responsibilities</FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox checked={_responsabilities.unsourced} onChange={this.handle_disclaimer_change} name="unsourced" />}
                                            label="I did not paint or take this photo myself or the source image doesn't belong to me."
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={_responsabilities.opinion} onChange={this.handle_disclaimer_change} name="opinion" />}
                                            label="This post is NOT a press-release or a checked-fact. It is only my experience and / or my own perception-description."
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={_responsabilities.hurt} onChange={this.handle_disclaimer_change} name="hurt" />}
                                            label="This post contains nudity, hate, madness, or anything that may disturb someone else's freedom of expression. (NSFW)"
                                        />
                                    </FormGroup>
                                    <FormHelperText>Be careful!</FormHelperText>
                                </FormControl>
                            }
                            {
                                edit &&
                                <div className={classes.tensorflowContainer}>
                                    <p>Discover with TensorFlow's machine learning, what's the intention of your writing, get ready for it.</p>
                                    <div className={classes.tensorflowWrapper}>
                                        <Button
                                            variant="text"
                                            color="primary"
                                            disabled={_is_prediction_loading}
                                            onClick={this._evaluate_content_with_tensorflow}
                                        >
                                            What's kind
                                        </Button>
                                        {_is_prediction_loading && <CircularProgress size={24} className={classes.tensorflowButtonProgress} />}
                                    </div>
                                </div>
                            }
                        </CardContent>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h4">Palette</Typography>
                            <PixelColorPalette
                                padding="12px 0px"
                                gap="8px"
                                align="left"
                                colors={post_img.colors ? post_img.colors.map(c => c.hex): []}
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
                                        <TableCell align="right">{post_img.width} x {post_img.height}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left">Colors:</TableCell>
                                        <TableCell align="right">{post_img.colors ? post_img.colors.length: "NaN"}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                        {tags.length > 1 && !edit &&
                        <CardContent style={{padding: "16 16 0 16"}}>
                            <Typography gutterBottom variant="h5" component="h4">Tags</Typography>
                        </CardContent>
                        }
                        { tags.length > 1 && !edit &&
                        <CardContent className={classes.postTags}>
                            {
                                tags.map((tag, index) => {
                                    return index ? <Chip clickable className={classes.postTag} key={tag} variant={"default"} size={"small"} label={`#${tag}`} onClick={() => {this._open_tag(tag)}}/> : null;
                                })
                            }
                        </CardContent>
                        }
                        <CardContent style={{padding: "16 16 0 16"}}>
                            <Typography gutterBottom variant="h5" component="h4">Download</Typography>
                        </CardContent>
                        <CardContent className={classes.scrollOverflowMaxWidthMobile} style={{margin: "0 16 24 16", padding: "0"}}>
                            <ButtonGroup style={{margin: "12px 16px"}}>
                                <Button onClick={() => {this._download_image(1)}}>1px</Button>
                                <Button onClick={() => {this._download_image(8)}}>8px</Button>
                                <Button onClick={() => {this._download_image(16)}}>16px</Button>
                                <Button onClick={() => {this._download_image(32)}}>32px</Button>
                                <Button onClick={() => {this._download_image(64)}}>64px</Button>
                                <Button onClick={() => {this._download_image(96)}}>96px</Button>
                            </ButtonGroup>
                        </CardContent>
                        <CardContent>
                            {
                                (open && edit && _drawer_open && _window_width < 1280) &&
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={this._handle_send_click}
                                >
                                    Publish the artistic situation
                                </Button>

                            }
                        </CardContent>
                    </div>
                </SwipeableDrawer>
            </Dialog>
        );
    }
}

export default withStyles(styles)(PixelDialogPost);
