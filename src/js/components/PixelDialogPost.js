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
import actions from "../actions/utils";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import Grow from "@material-ui/core/Grow";
import FastNavScroller from "./FastNavScroller";

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
        pointerEvents: "none",
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        left: theme.spacing(62),
        gap: 16,
        width: `calc(100vw - 480px - ${theme.spacing(4)}px)`,
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
            title: "",
            description: "",
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
        };
    };


    componentDidMount() {

        window.addEventListener("resize", this._updated_dimensions);
        document.addEventListener("keydown", this._handle_keydown);
        this._updated_dimensions();
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
        if(new_props.post && this.state.post) {
            set_canvas_again = this.state.post.image.base64 !== new_props.post.image.base64;
        }

        this.setState(new_props, () => {

            this.forceUpdate();
            if(set_canvas_again) {

                this._set_canvas_image();
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

        return false;
    }

    _handle_keydown = (event) => {

        let { post } = this.state;

        if(post) {

            event.preventDefault();

            switch (event.keyCode) {

                case 40:
                    this.props.onClose();
                    break;
                case 37:
                    if(this.props.on_previous) { this.props.on_previous()}
                    break;
                case 39:
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
            actions.trigger_snackbar("Do You Want To Share? Yes or No", 6000);
            actions.jamy_update("happy");
        }, 2000);
    };

    _set_canvas_image = (base64_url = null) => {

        const { _canvas, post } = this.state;
        if(_canvas === null || (!base64_url && !post)) {return}

        base64_url = base64_url === null ? this.state.post.image.base64: base64_url;
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

    _handle_description_change = (event) => {

        const description = event.target.value;
        this.setState({description}, () => {
            this.forceUpdate();
        });
    };

    _handle_title_change = (event) => {

        const title = event.target.value;
        this.setState({title}, () => {
            this.forceUpdate();
        });
    };

    _handle_fab_click = (event) => {

        const { edit, _window_width } = this.state;

        if(_window_width < 1200) {

            this._handle_drawer_open(event);
        }
    };

    _handle_send_click = (event) => {

        const { title, description, base64_url } = this.state;
        if(this.props.onRequestSend) {

            this.props.onRequestSend({
                title,
                description,
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
            title,
            description,
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
            post,
        } = this.state;

        const layers = _layers || [];
        const layer = layers[0] || {colors: []};

        return (
            <div>
                <Dialog
                    keepMounted={keepMounted}
                    BackdropProps={{
                        style: {background: "rgba(0, 0, 0, .666)"}
                    }}
                    fullScreen
                    open={open}
                    PaperComponent={"div"}
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
                                                    R
                                                </Avatar>
                                            }
                                            title="The author"
                                            subheader="A few minutes ago..."
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
                                                        value={title}
                                                        onChange={this._handle_title_change}
                                                        style={{marginBottom: 12}}
                                                    />:
                                                    <Typography gutterBottom variant="h4" component="h3">{title}</Typography>
                                            }
                                            {
                                                edit ?
                                                    <TextField
                                                        id="description_textfield"
                                                        label="Description"
                                                        multiline
                                                        fullWidth
                                                        value={description}
                                                        onChange={this._handle_description_change}
                                                        size="small"
                                                        style={{marginBottom: 12}}
                                                    />:
                                                    <div>
                                                        <ReactMarkdown remarkPlugins={[[gfm, {singleTilde: false}]]}>
                                                            {description}
                                                        </ReactMarkdown>
                                                    </div>
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
