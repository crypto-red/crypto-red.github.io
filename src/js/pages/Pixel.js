import React from "react";
import { withStyles } from "@material-ui/core/styles";

import {ChromePicker, CirclePicker, SliderPicker} from "react-color";
import HexagonalColorPicker from "../components/HexagonalColorPicker";
import CanvasPixels from "../components/CanvasPixels";

import Typography from "@material-ui/core/Typography";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import Menu from "@material-ui/core/Menu";
import Divider from "@material-ui/core/Divider";
import Slider from "@material-ui/core/Slider";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import SwipeableViews from "react-swipeable-views";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { HISTORY } from "../utils/constants";

import actions from "../actions/utils";

import PaletteIcon from "../icons/Palette";
import HistoryIcon from "../icons/History";
import ShapesIcon from "../icons/Shapes";
import DrawIcon from "../icons/Draw";
import ColorPickerIcon from "../icons/ColorPicker";
import MoveIcon from "../icons/Move";
import PencilIcon from "../icons/Pencil";
import PencilPerfectIcon from "../icons/PencilPerfect";
import LineIcon from "../icons/Line";
import RectangleIcon from "../icons/Rectangle";
import EllipseIcon from "../icons/Ellipse";
import ContourIcon from "../icons/Contour";
import PaintIcon from "../icons/Paint";
import BucketIcon from "../icons/Bucket";
import PaletteSwatchIcon from "../icons/PaletteSwatch";
import BorderBottomIcon from "../icons/BorderBottom";
import ContentDuplicateIcon from "../icons/ContentDuplicate";
import OpacityIcon from "../icons/Opacity";
import DownloadIcon from "../icons/Download";
import FileDownloadIcon from "../icons/FileDownload";
import FileImportIcon from "../icons/FileImport";
import ImportIcon from "../icons/Import";
import SelectCompareIcon from "../icons/SelectCompare";
import SelectRemoveDifferenceIcon from "../icons/SelectRemoveDifference";
import SelectAddIcon from "../icons/SelectAdd";
import SelectInImageIcon from "../icons/SelectInImage";
import SelectionRectangleIcon from "../icons/SelectionRectangle";
import SelectionEllipseIcon from "../icons/SelectionEllipse";
import LayerEditIcon from "../icons/LayerEdit";
import LayerAddIcon from "../icons/LayerAdd";
import LayerDeleteIcon from "../icons/LayerDelete";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ImageIcon from "@material-ui/icons/Image";
import CopyIcon from "@material-ui/icons/FileCopy";
import EyeIcon from "../icons/Eye";
import EyeOffIcon from "../icons/EyeOff";
import CutIcon from "../icons/Cut";
import ImagePlusIcon from "../icons/ImagePlus";
import AllLayersIcon from "../icons/AllLayers";
import ToolsIcon from "../icons/Tools";
import MagicIcon from "../icons/Magic";
import ImageMoveIcon from "../icons/ImageMove";
import SelectInvertIcon from "../icons/SelectInvert";
import SquareSmallIcon from "../icons/SquareSmall";
import SelectIcon from "../icons/Select";
import SelectColorIcon from "../icons/SelectColor";
import ImageEffectIcon from "../icons/ImageEffect";
import ImageFilterIcon from "../icons/ImageFilter";
import EraserIcon from "../icons/Eraser";
import MirrorIcon from "../icons/Mirror";
import LayerOutlineIcon from "../icons/LayerOutline";
import LayerOffOutlineIcon from "../icons/LayerOffOutline";
import LayerSearchIcon from "../icons/LayerSearch";
import ImageOffOutlineIcon from "../icons/ImageOffOutline";
import ImageOutlineIcon from "../icons/ImageOutline";
import ImageEditIcon from "../icons/ImageEdit";
import MergeIcon from "../icons/Merge";
import CheckBoldIcon from "../icons/CheckBold";

import {List, ListSubheader, ListItem, ListItemIcon, ListItemText, ListItemAvatar, Avatar} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import Grow from "@material-ui/core/Grow";
import Fade from "@material-ui/core/Fade";
import DialogCloseButton from "../components/DialogCloseButton";

const styles = theme => ({
    root: {
        minHeight: "100%",
        minWidth: "100%",
        position: "relative",
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
        backgroundColor: theme.palette.primary.darker,
    },
    contentCanvas: {
        width: "100%",
        height: "calc(100vh - 64px)",
        display: "flex",
        overflow: "hidden",
        [theme.breakpoints.down("sm")]: {
            height: "calc(100vh - 56px)",
        }
    },
    contentDrawer: {
        display: "flex",
        [theme.breakpoints.up("lg")]: {
            display: "none",
        },
    },
    coordinate: {
        padding: "0px 0px 8px 0px",
        display: "block",
        textAlign: "right",
        color: "#aaa",
        [theme.breakpoints.down("md")]: {
            display: "none",
        },
    },
    contentDrawerFixed: {
        [theme.breakpoints.down("md")]: {
            display: "none",
        },
        width: 360,
        display: "flex",
    },
    drawerPaper: {
        boxShadow: "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
        border: "none",
        width: 360,
        overflowX: "overlay",
    },
    swipeableDrawerPaper: {
        maxWidth: "100%",
    },
    drawerContainer: {
        overflowY: "overlay",
        overflowX: "hidden",
        "& > div": {
            overflowX: "auto !important",
            overflowY: "visible !important",
            display: "inline-table !important",
            width: "100% !important",
        },
        '& div .react-swipeable-view-container > div[data-swipeable="true"]': {
            overflow: "visible !important",
            alignItems: "normal",
        },
        '& > div > .react-swipeable-view-container': {
            display: "flex !important",
        },
    },
    listSubHeader: {
        alignSelf: "flex-start",
        color: theme.palette.secondary.light,
        backgroundColor: "#eeeeee",
        "& span svg": {
            verticalAlign: "sub",
            marginRight: theme.spacing(1),
            display: "none",
        }
    },
    listItemIcon: {
        color: theme.palette.secondary.dark
    },
    tabs: {
        "& .MuiTab-root": {
            minWidth: "auto",
            flex: "auto",
        },
        "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.secondary.main
        }
    },
    tab: {
        color: theme.palette.secondary.main,
        "&.Mui-selected": {
            color: theme.palette.secondary.dark,
        },
    },
    backdrop: {
        zIndex: 2000,
        color: "#fff",
    },
    menu: {
        "& .MuiList-padding": {
            padding: 0,
        },
    },
    layerThumbnail: {
        width: "auto",
        height: theme.spacing(8),
        "& .MuiAvatar-img": {
            width: "auto",
            borderRadius: 2,
            background: "repeating-conic-gradient(#80808055 0% 25%, #00000000 0% 50%) 50% / 8px 8px",
        },
        marginRight: theme.spacing(2),
    },
    layerSelected: {
        borderRight: `4px solid ${theme.palette.primary.action}`,
        paddingRight: 12,
    },
    fab: {
        [theme.breakpoints.up("lg")]: {
            display: "none",
        },
        zIndex: 100,
        position: "fixed",
        backgroundColor: theme.palette.primary.action,
        color: theme.palette.primary.contrastText,
        "&:hover": {
            backgroundColor: theme.palette.primary.actionLighter,
        },
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        "& svg": {
            marginRight: 4
        }
    },
    listOfTools: {
        paddingTop: 0,
    },
    buttonColor: {
        padding: 0,
        borderRadius: 2,
        height: 32,
        width: 32
    },
    chromePicker: {
        fontFamily: "Open Sans !important",
    },
});


class Pixel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            _history: HISTORY,
            _view_name_index: 0,
            _previous_view_name_index: 0,
            _view_names: ["palette", "image", "layers", "tools", "selection", "effects", "filters"],
            _canvas: null,
            _offset_el: null,
            _loading: false,
            _can_undo: false,
            _can_redo: false,
            _current_color: "#ffffff",
            _second_color: "#000000",
            _pxl_current_opacity: 1,
            _width: 32,
            _height: 32,
            _anchor_el: null,
            _hue: 360,
            _game_ended: false,
            _tool: "PENCIL",
            _select_mode: "REPLACE",
            _pencil_mirror_mode: "NONE",
            _filters: [],
            _position: {x: -1, y: -1},
            _is_something_selected: false,
            _hide_canvas_content: false,
            _show_original_image_in_background: false,
            _show_transparent_image_in_background: true,
            _is_image_import_mode: false,
            _layers: [{name: "Layer 0", hidden: false}],
            _layer_index: 0,
            _mine_player_direction: "UP",
            _is_edit_drawer_open: false,
            _saturation: 60,
            _luminosity: 60,
        };
    };

    componentDidMount() {

        document.addEventListener("keydown", this._handle_keydown);
        actions.trigger_loading_update(0);
        setTimeout(() => {

            actions.trigger_loading_update(100);
        }, 250);
    }

    componentWillUnmount() {

        document.removeEventListener("keydown", this._handle_keydown);
    }

    _handle_view_name_change = (event, view_name_index) => {

        const { _view_names } = this.state;

        const _view_name = _view_names[view_name_index] || _view_names[0];
        const _view_name_index = _view_names.indexOf(_view_name) === -1 ? 0: _view_names.indexOf(_view_name);

        this.setState({_previous_view_name_index: this.state._view_name_index, _view_name_index});
    };

    _hsl_to_hex = (h, s, l) => {

        const { _canvas } = this.state;

        if(!_canvas) { return "#000000" }

        return _canvas._hsl_to_hex(h, s, l);
    };

    _rgba_from_hex = (hex) => {

        const { _canvas } = this.state;

        if(!_canvas) { return [0, 0, 0, 0] }

        return _canvas.get_rgba_from_hex(hex);
    };

    _handle_keydown = (event) => {

        const { _tool, _view_name_index, _view_names } = this.state;

        if(_tool === "MINE"){

            event.preventDefault();

            switch (event.keyCode) {

                case 38:
                    this.setState({_mine_player_direction: "UP"});
                    break;
                case 40:
                    this.setState({_mine_player_direction: "DOWN"});
                    break;
                case 37:
                    this.setState({_mine_player_direction: "LEFT"});
                    break;
                case 39:
                    this.setState({_mine_player_direction: "RIGHT"});
                    break;
            }
        }else {
            event.preventDefault();

            switch (event.keyCode) {

                case 37:
                    e.preventDefault();
                    this.setState({_previous_view_name_index: this.state._view_name_index, _view_name_index: _view_name_index-1 < 0 ? _view_names.length-1: _view_name_index-1});
                    break;
                case 39:
                    e.preventDefault();
                    this.setState({_previous_view_name_index: this.state._view_name_index, _view_name_index: _view_name_index+1 > _view_names.length-1 ? 0: _view_name_index+1});
                    break;
            }

            if (event.ctrlKey && event.key === "z") {

                this._undo();
            }else if(event.ctrlKey && event.key === "y") {

                this._redo();
            }

        }

    };

    _handle_image_load = () => {

        this.setState({_loading: true});
    };

    _switch_with_second_color = () => {

        const {_current_color, _second_color } = this.state;
        this.setState({_current_color: _second_color, _second_color: _current_color});
    };

    _handle_image_load_complete = () => {

        this.setState({_loading: false});
    };

    _download_png = (scale) => {

        const { _canvas } = this.state;
        let a = document.createElement("a"); //Create <a>
        a.href = "" + _canvas.get_base64_png_data_url(scale); //Image Base64 Goes here
        a.download = "Image.png"; //File name Here
        a.click();
    };

    _undo = () => {

        const { _canvas } = this.state;
        _canvas.undo();
    };

    _redo = () => {

        const { _canvas } = this.state;
        _canvas.redo();
    };

    _bw = () => {

        const { _canvas } = this.state;
        _canvas.to_greyscale();
    };

    _sepia = () => {

        const { _canvas } = this.state;
        _canvas.to_sepia();
    };

    _filter = (name) => {

        const { _canvas, _slider_value } = this.state;
        _canvas.to_filter(name, _slider_value);
    };

    _to_alpha = () => {

        const { _canvas, _current_color, _slider_value } = this.state;
        _canvas.to_alpha(_current_color, _slider_value);
    }

    _less_colors = () => {

        const { _canvas, _slider_value } = this.state;
        _canvas.to_less_color(_slider_value);
    };

    _less_colors_auto = () => {

        const { _canvas } = this.state;
        _canvas.to_less_color("auto");
    };

    _to_vignette = () => {

        const { _canvas, _current_color, _slider_value } = this.state;
        _canvas.to_vignette(_current_color, _slider_value);
    };

    _to_dutone = () => {

        const { _canvas, _current_color, _slider_value } = this.state;
        _canvas.to_dutone(_slider_value, "#000000ff", _current_color);
    };

    _to_auto_contrast = () => {

        const { _canvas, _slider_value } = this.state;
        _canvas.auto_adjust_contrast(_slider_value);
    };

    _colorize = () => {

        const { _canvas, _hue, _current_color, _slider_value } = this.state;

        const [r, g, b, a] = _canvas.get_rgba_from_hex(_current_color);
        const [h, s, l] = _canvas.rgb_to_hsl(r, g, b);

        _canvas.to_color(_hue, _slider_value, s === 0 ? null: s, l === 0 ? null: l);
    }

    _smooth_adjust = () => {

        const { _canvas } = this.state;

        _canvas.smooth_adjust();
    }

    _mirror_horizontal = () => {

        const { _canvas } = this.state;
        _canvas.to_mirror(true);

    };

    _mirror_vertical = () => {

        const { _canvas } = this.state;
        _canvas.to_mirror(false);

    };

    _to_rotation = (right = true) => {

        const { _canvas } = this.state;
        _canvas.to_rotation(right);
    };

    _to_selection_border = () => {

        const { _canvas } = this.state;
        _canvas.to_selection_border();
    }

    _to_selection_bucket = () => {

        const { _canvas } = this.state;
        _canvas.to_selection_bucket();
    }

    _to_selection_crop = () => {

        const { _canvas } = this.state;
        _canvas.to_selection_crop();
    }

    _to_selection_changes = () => {

        const { _canvas } = this.state;
        _canvas.to_selection_changes(0, 25, -10);
    }

    _to_selection_invert = () => {

        const { _canvas } = this.state;
        _canvas.to_selection_invert();
    }

    _grow_current_selection = () => {

        const { _canvas } = this.state;
        _canvas.to_selection_size(1);
    };

    _shrink_current_selection = () => {

        const { _canvas } = this.state;
        _canvas.to_selection_size(-1);
    };

    _set_canvas_ref = (element) => {

        if(element === null) {return}
        this.setState({_canvas: element, _filters: element.get_filter_names()});
    };

    _handle_file_upload = (event) => {

        const { _canvas } = this.state;
        let img = new Image;
        img.src = URL.createObjectURL(event.target.files[0] || event.path[0].files[0]);

        img.onload = () => {

            _canvas.set_canvas_from_image(img, this._on_canvas_image_loaded);
        };

    };

    _new_layer = () => {

        const { _canvas } = this.state;
        _canvas.new_layer();
    };

    _handle_file_import = (event) => {

        const { _canvas } = this.state;
        let img = new Image;
        img.src = URL.createObjectURL(event.target.files[0] || event.path[0].files[0]);

        img.onload = () => {

            console.log(img);
            _canvas.import_image_on_canvas(img, this._on_canvas_image_imported);
        };

    };

    _confirm_import = () => {

        const { _canvas } = this.state;
        _canvas.confirm_import();
    };

    _import_image = () => {

        let input = document.createElement("input");
        input.addEventListener("change", (event) => {this._handle_file_import(event)});
        input.setAttribute("type", "file");
        input.click();
    };

    _upload_image = () => {

        let input = document.createElement("input");
        input.addEventListener("change", (event) => {this._handle_file_upload(event)});
        input.setAttribute("type", "file");
        input.click();
    };

    _handle_position_change = (position) => {

        this.setState({_x: position.x, _y: position.y});
    }

    _handle_can_undo_redo_change = (_can_undo, _can_redo) => {

        this.setState({_can_undo, _can_redo})
    }

    _handle_size_change = (_width, _height) => {

        this.setState({_width, _height})
    }

    _handle_current_color_change = (color) => {

        this.setState({_current_color: color.hex ? color.hex: color});
    };

    _handle_something_selected_change = (is_something_selected) => {

        this.setState({_is_something_selected: is_something_selected});
    };

    _handle_color_menu_open = (event, color) => {

        this.setState({_anchor_el: event.currentTarget});
    };

    _handle_color_menu_close = () => {

        this.setState({_anchor_el: null});

    }

    _set_value_from_slider = (event, value) => {

        this.setState({_slider_value: value});
    };

    _set_saturation_from_slider = (event, value) => {

        this.setState({_saturation: value});
    };

    _set_luminosity_from_slider = (event, value) => {

        this.setState({_luminosity: value});
    };

    _set_hue_from_slider = (event, value) => {

        this.setState({_hue: value});

    };

    _handle_hue_change = (value) => {

        this.setState({_hue: value});
    };

    _set_tool = (name) => {

        this.setState({_tool: name.toUpperCase()});
    }

    _set_select_mode = (mode) => {

        this.setState({_select_mode: mode.toUpperCase()});
    }

    _set_pencil_mirror_mode = (mode) => {

        this.setState({_pencil_mirror_mode: mode.toUpperCase()});
    }

    _show_hide_canvas_content = () => {

        this.setState({_hide_canvas_content: !this.state._hide_canvas_content});
    }

    _show_hide_background_image = () => {

        this.setState({_show_original_image_in_background: !this.state._show_original_image_in_background});
    }

    _show_hide_transparent_image = () => {

        this.setState({_show_transparent_image_in_background: !this.state._show_transparent_image_in_background});
    }

    _handle_image_import_mode_change = (is_image_import_mode) => {

        this.setState({_is_image_import_mode: is_image_import_mode});
    };

    _handle_layers_change = (layer_index, layers) => {

        this.setState({_layer_index: layer_index, _layers: layers});
    };

    _handle_game_end = () => {

        this.setState({_game_ended: true}, () => {

            setTimeout(() => {

                this.setState({_game_ended: false});

            }, 5000);
        });
    };

    _change_active_layer = (index) => {

        const { _canvas } = this.state;
        _canvas.change_active_layer(index);
    };

    _toggle_layer_visibility = (index) => {

        const { _canvas } = this.state;
        _canvas.toggle_layer_visibility(index);
    };

    _change_layer_opacity = (index) => {

        const { _canvas, _slider_value } = this.state;
        _canvas.change_layer_opacity(index, _slider_value);
    }

    _merge_down_layer = (index) => {

        const { _canvas } = this.state;
        _canvas.merge_down_layer(index);
    };

    _delete_layer = (index) => {

        const { _canvas } = this.state;
        _canvas.delete_layer(index);
    };

    _duplicate_layer = (index) => {

        const { _canvas } = this.state;
        _canvas.duplicate_layer(index);
    };

    _copy_selection = () => {

        const { _canvas } = this.state;
        _canvas.copy_selection();
    };

    _cut_selection = () => {

        const { _canvas } = this.state;
        _canvas.cut_selection();
    };

    _erase_selection = () => {

        const { _canvas } = this.state;
        _canvas.erase_selection();
    };

    _handle_edit_drawer_open = () => {

        this.setState({_is_edit_drawer_open: true});
    };

    _handle_edit_drawer_close = () => {

        this.setState({_is_edit_drawer_open: false});
    };

    render() {

        const {
            classes,
            _anchor_el,
            _view_name_index,
            _previous_view_name_index,
            _loading,
            _view_names,
            _layers,
            _layer_index,
            _is_image_import_mode,
            _hide_canvas_content,
            _show_original_image_in_background,
            _show_transparent_image_in_background,
            _can_undo,
            _can_redo,
            _current_color,
            _second_color,
            _slider_value,
            _tool,
            _width,
            _height,
            _hue,
            _filters,
            _select_mode,
            _pencil_mirror_mode,
            _x, _y,
            _is_something_selected,
            _mine_player_direction,
            _game_ended,
            _is_edit_drawer_open,
            _saturation,
            _luminosity,
        } = this.state;

        const actions = {
            "palette": [],
            "image": [
                {
                    icon: <HistoryIcon />,
                    text: "History",
                    tools: [
                        {icon: <ArrowBackIcon />, disabled: !_can_undo ,text: "Undo", on_click: () => {this._undo()}},
                        {icon: <ArrowForwardIcon />, disabled: !_can_redo , text: "Redo", on_click: () => {this._redo()}},
                    ]
                },
                {
                    icon: <ImportIcon />,
                    text: "Upload",
                    tools: [
                        {icon: <ImagePlusIcon />, text: "Upload image", on_click: () => {this._upload_image()}},
                    ]
                },
                {
                    icon: <DownloadIcon />,
                    text: "Download",
                    tools: [
                        {icon: <FileDownloadIcon />, text: "Download (small size)", on_click: () => {this._download_png(1)}},
                        {icon: <FileDownloadIcon />, text: "Download (big size)", on_click: () => {this._download_png(32)}},
                    ]
                },
            ],
            "layers": [
                {
                    icon: <LayerSearchIcon />,
                    text: `Layer tools`,
                    tools: [
                        {icon: _hide_canvas_content ? <LayerOutlineIcon />: <LayerOffOutlineIcon />, text: _hide_canvas_content ? "Show canvas content": "Hide canvas content", on_click: () => {this._show_hide_canvas_content()}},
                        {icon: _show_original_image_in_background ? <ImageOffOutlineIcon />: <ImageOutlineIcon />, text: _show_original_image_in_background ? "Hide bg img": "Show bg img", on_click: () => {this._show_hide_background_image()}},
                        {icon: _show_transparent_image_in_background ? <ImageOffOutlineIcon />: <ImageOutlineIcon />, text: _show_transparent_image_in_background ? "Hide chessboard": "Show chessboard", on_click: () => {this._show_hide_transparent_image()}},
                    ]
                },
                {
                    icon: <LayerEditIcon />,
                    text: `Layer actions`,
                    tools: [
                        {icon: <LayerAddIcon />, text: "New layer", on_click: () => {this._new_layer(_layer_index+1)}},
                        {icon: <LayerDeleteIcon />, text: "Delete layer", on_click: () => {this._delete_layer(_layer_index)}},
                        {icon: <ContentDuplicateIcon />, text: "Duplicate layer", on_click: () => {this._duplicate_layer(_layer_index)}},
                        {icon: <MergeIcon />, text: "Merge down layer", on_click: () => {this._merge_down_layer(_layer_index)}},
                        {icon: _layers[_layer_index].hidden ? <EyeIcon />: <EyeOffIcon />, text: _layers[_layer_index].hidden ? `Show`: `Hide`, on_click: () => {this._toggle_layer_visibility(_layer_index)}},
                        {icon: <OpacityIcon />, text: `Opacity: ${_layers[_layer_index].opacity} -> ${_slider_value}`, on_click: () => {this._change_layer_opacity(_layer_index)}},
                    ]
                },
                {
                    icon: <ImportIcon />,
                    text: "Import image",
                    tools: [
                        {icon: <FileImportIcon />, text: "Import image", on_click: () => {this._import_image()}},
                        {icon: <FileImportIcon />, text: "Confirm import", disabled: !_is_image_import_mode,on_click: () => {this._confirm_import()}},
                    ]
                },
            ],
            "tools": [
                {
                    icon: <DrawIcon />,
                    text: "Drawing tools",
                    tools: [
                        {icon: <ColorPickerIcon />, disabled: _tool === "PICKER", text: "Picker", on_click: () => {this._set_tool("PICKER")}},
                        {icon: <MoveIcon />, disabled: _tool === "MOVE", text: "Move", on_click: () => {this._set_tool("MOVE")}},
                        {icon: <PencilIcon />, disabled: _tool === "PENCIL", text: "Pencil", on_click: () => {this._set_tool("PENCIL")}},
                        {icon: <PencilPerfectIcon />, disabled: _tool === "PENCIL PERFECT", text: "Pencil perfect", on_click: () => {this._set_tool("PENCIL PERFECT")}},
                        {icon: <MirrorIcon />, disabled: _tool === "SET PENCIL MIRROR", text: "Set pencil mirror", on_click: () => {this._set_tool("SET PENCIL MIRROR")}},
                    ]
                },
                {
                    icon: <ShapesIcon />,
                    text: "Shapes tools",
                    tools: [
                        {icon: <LineIcon />, disabled: _tool === "LINE", text: "Line", on_click: () => {this._set_tool("LINE")}},
                        {icon: <RectangleIcon />, disabled: _tool === "RECTANGLE", text: "Rectangle", on_click: () => {this._set_tool("RECTANGLE")}},
                        {icon: <EllipseIcon />, disabled: _tool === "ELLIPSE", text: "Ellipse", on_click: () => {this._set_tool("ELLIPSE")}},
                        {icon: <ContourIcon />, disabled: _tool === "CONTOUR", text: "Contour", on_click: () => {this._set_tool("CONTOUR")}},
                    ]
                },
                {
                    icon: <PaintIcon />,
                    text: "Paint tools",
                    tools: [
                        {icon: <BucketIcon />, disabled: _tool === "BUCKET", text: "Bucket", on_click: () => {this._set_tool("BUCKET")}},
                        {icon: <BucketIcon />, disabled: _tool === "HUE BUCKET", text: "Magic bucket", on_click: () => {this._set_tool("HUE BUCKET")}},
                        {icon: <PaletteSwatchIcon />, disabled: _tool === "EXCHANGE", text: "Exchange", on_click: () => {this._set_tool("EXCHANGE")}},
                        {icon: <BorderBottomIcon />, disabled: _tool === "BORDER", text: "Border", on_click: () => {this._set_tool("BORDER")}},
                    ]
                },
                {
                    icon: <MirrorIcon />,
                    text: "Set pencil mirrors",
                    tools: [
                        {icon: <MirrorIcon />, disabled: _pencil_mirror_mode === "NONE",text: "None", on_click: () => {this._set_pencil_mirror_mode("NONE")}},
                        {icon: <MirrorIcon />, disabled: _pencil_mirror_mode === "VERTICAL", text: "Vertical", on_click: () => {this._set_pencil_mirror_mode("VERTICAL")}},
                        {icon: <MirrorIcon />, disabled: _pencil_mirror_mode === "HORIZONTAL", text: "Horizontal", on_click: () => {this._set_pencil_mirror_mode("HORIZONTAL")}},
                        {icon: <MirrorIcon />, disabled: _pencil_mirror_mode === "BOTH", text: "Both", on_click: () => {this._set_pencil_mirror_mode("BOTH")}},
                    ]
                },
            ],
            "selection": [
                {
                    icon: <SelectCompareIcon />,
                    text: "Select mode",
                    tools: [
                        {icon: <SelectRemoveDifferenceIcon />, disabled: _select_mode === "REMOVE" ,text: "Select remove", on_click: () => {this._set_select_mode("REMOVE")}},
                        {icon: <SelectAddIcon />, disabled: _select_mode === "ADD", text: "Select add", on_click: () => {this._set_select_mode("ADD")}},
                        {icon: <SelectIcon />, disabled: _select_mode === "REPLACE", text: "Select replace", on_click: () => {this._set_select_mode("REPLACE")}},
                    ]
                },
                {
                    icon: <SelectInImageIcon />,
                    text: "Select tool",
                    tools: [
                        {icon: <SelectIcon />, disabled: _tool === "SELECT PATH", text: "Select path", on_click: () => {this._set_tool("SELECT PATH")}},
                        {icon: <SelectColorIcon />, disabled: _tool === "SELECT COLOR", text: "Select color", on_click: () => {this._set_tool("SELECT COLOR")}},
                        {icon: <MagicIcon />, disabled: _tool === "SELECT COLOR THRESHOLD", text: "Select color threshold", on_click: () => {this._set_tool("SELECT COLOR THRESHOLD")}},
                        {icon: <SquareSmallIcon />, disabled: _tool === "SELECT PIXEL", text: "Select pixel", on_click: () => {this._set_tool("SELECT PIXEL")}},
                        {icon: <SquareSmallIcon />, disabled: _tool === "SELECT PIXEL PERFECT", text: "Select pixel perfect", on_click: () => {this._set_tool("SELECT PIXEL PERFECT")}},
                        {icon: <SelectIcon />, disabled: _tool === "SELECT LINE", text: "Select line", on_click: () => {this._set_tool("SELECT LINE")}},
                        {icon: <SelectionRectangleIcon />, disabled: _tool === "SELECT RECTANGLE", text: "Select rectangle", on_click: () => {this._set_tool("SELECT RECTANGLE")}},
                        {icon: <SelectionEllipseIcon />, disabled: _tool === "SELECT ELLIPSE", text: "Select ellipse", on_click: () => {this._set_tool("SELECT ELLIPSE")}},
                    ]
                },
                {
                    icon: <ImageMoveIcon />,
                    text: "Select actions",
                    tools: [
                        {icon: <SelectInImageIcon />, disabled: !_is_something_selected, text: "Shrink", on_click: () => {this._shrink_current_selection()}},
                        {icon: <SelectInImageIcon />, disabled: !_is_something_selected, text: "Grow", on_click: () => {this._grow_current_selection()}},
                        {icon: <BorderBottomIcon />, disabled: !_is_something_selected, text: "Border", on_click: () => {this._to_selection_border()}},
                        {icon: <BucketIcon />, disabled: !_is_something_selected, text: "Bucket", on_click: () => {this._to_selection_bucket()}},
                        {icon: <SelectInImageIcon />, disabled: !_is_something_selected, text: "Crop", on_click: () => {this._to_selection_crop()}},
                        {icon: <SelectInvertIcon />, disabled: !_is_something_selected, text: "Invert", on_click: () => {this._to_selection_invert()}},
                        {icon: <CopyIcon />, disabled: !_is_something_selected, text: "Copy", on_click: () => {this._copy_selection()}},
                        {icon: <CutIcon />, disabled: !_is_something_selected, text: "Cut", on_click: () => {this._cut_selection()}},
                        {icon: <EraserIcon />, disabled: !_is_something_selected, text: "Erase", on_click: () => {this._erase_selection()}},
                    ]
                },
            ],
            "effects": [
                {
                    icon: <ImageEffectIcon />,
                    text: "Effects",
                    tools: [
                        {icon: null, text: "Smooth", on_click: () => {this._smooth_adjust()}},
                        {icon: null, text: "Auto contrast", on_click: () => {this._to_auto_contrast()}},
                        {icon: null, text: "Vignette", on_click: () => {this._to_vignette()}},
                        {icon: null, text: "Less colors", on_click: () => {this._less_colors()}},
                        {icon: null, text: "Less colors auto", on_click: () => {this._less_colors_auto()}},
                        {icon: null, text: "Dutone", on_click: () => {this._to_dutone()}},
                        {icon: null, text: "Colorize", on_click: () => {this._colorize()}},
                        {icon: null, text: "To alpha", on_click: () => {this._to_alpha()}},
                        {icon: null, text: "Mirror vertical", on_click: () => {this._mirror_vertical()}},
                        {icon: null, text: "Mirror horizontal", on_click: () => {this._mirror_horizontal()}},
                        {icon: null, text: "Rotate 90°", on_click: () => {this._to_rotation(true)}},
                        {icon: null, text: "Rotate - 90°", on_click: () => {this._to_rotation(false)}},
                    ]
                }
            ],
            "filters": [
                {
                    icon: <ImageFilterIcon />,
                    text: "Filters",
                    tools: _filters.map( (name) => {
                        return {icon: null, text: name, on_click: () => {this._filter(name)}}
                    }).concat([
                    {icon: null, text: "Black & White", on_click: () => {this._bw()}},
                    {icon: null, text: "Sepia", on_click: () => {this._sepia()}},
            ]),
                },
            ],
        };

        let colors = [];
        for (let i = 1; i <= 96; i++) {

            colors.push(this._hsl_to_hex((i / 96) * 360, _saturation, _luminosity));
        }

        const [r_1, g_1, b_1] = _current_color === "#ffffff" ? [196, 196, 196]: this._rgba_from_hex(_current_color);
        const is_current_color_dark = r_1 + g_1 + b_1 < 152 * 3;

        const [r_2, g_2, b_2] = _second_color === "#ffffff" ? [196, 196, 196]: this._rgba_from_hex(_second_color);
        const is_second_color_dark = r_2 + g_2 + b_2 < 152 * 3;

        const drawer_content = (
            <div style={{display: "contents"}}>
                <div style={{boxShadow: "rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px", zIndex: 1}}>
                    <div style={{padding: "16px 24px 12px 24px", position: "relative", zIndex: -1}}>
                        <span className={classes.coordinate}>{`X: ${_x}, Y: ${_y}`}</span>
                        <Typography id="strength-slider" gutterBottom>
                            Effect strength:
                        </Typography>
                        <Slider
                            defaultValue={2/16}
                            step={1/16}
                            min={0}
                            max={1}
                            onChangeCommitted={this._set_value_from_slider}
                            aria-labelledby="strength-slider"
                        />
                    </div>
                    <Tabs className={classes.tabs}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="fullWidth"
                          selectionFollowsFocus
                          value={_view_name_index}
                          onChange={this._handle_view_name_change}>
                        <Tab className={classes.tab} icon={<PaletteIcon />} />
                        <Tab className={classes.tab} icon={<ImageIcon />} />
                        <Tab className={classes.tab} icon={<AllLayersIcon />} />
                        <Tab className={classes.tab} icon={<ToolsIcon />} />
                        <Tab className={classes.tab} icon={<SelectIcon />} />
                        <Tab className={classes.tab} icon={<ImageEffectIcon />} />
                        <Tab className={classes.tab} icon={<ImageFilterIcon />} />
                    </Tabs>
                </div>
                <div className={classes.drawerContainer}>
                    <SwipeableViews
                        containerStyle={{overflow: "visible"}}
                        animateHeight={true}
                        index={_view_name_index}
                        onChangeIndex={this._handle_view_name_change}
                    >
                        {
                            Object.entries(actions).map(a => a[1]).map((view, index) => {

                                if(_view_name_index !== index && _previous_view_name_index !== index) { return <List style={{overflow: "visible"}} className={classes.listOfTools} />; }

                                return (
                                    <List style={{overflow: "visible"}} className={classes.listOfTools}>

                                        {
                                            _view_names[index] === "layers" ?
                                                <div>
                                                    <ListSubheader className={classes.listSubHeader}>
                                                        <span><AllLayersIcon /></span>
                                                        <span>All layers</span>
                                                    </ListSubheader>
                                                    {[..._layers].reverse().map((layer, index, array) => {
                                                        const index_reverse_order = (array.length - 1) - index;
                                                        return (
                                                            <ListItem
                                                                className={_layer_index === index_reverse_order ? classes.layerSelected: null}
                                                                button onClick={() => this._change_active_layer(index_reverse_order)}>
                                                                <ListItemAvatar>
                                                                    <Avatar variant="square" className={classes.layerThumbnail} src={layer.thumbnail} />
                                                                </ListItemAvatar>
                                                                <ListItemText primary={layer.name} />
                                                            </ListItem>
                                                        );
                                                    })}
                                                </div>: null
                                        }

                                        {

                                            _view_names[index] === "palette" ?
                                                <div>
                                                    <Menu
                                                        className={classes.menu}
                                                        anchorEl={_anchor_el}
                                                        keepMounted
                                                        open={Boolean(_anchor_el)}
                                                        onClose={this._handle_color_menu_close}
                                                        style={{padding: 0}}
                                                    >
                                                        <ChromePicker className={classes.chromePicker}
                                                                      color={ _current_color }
                                                                      onChange={ this._handle_current_color_change }
                                                                      disableAlpha />
                                                    </Menu>

                                                    <Button variant={"contained"} style={{fontWeight: "bold", color: is_current_color_dark ? "white": "black", boxShadow: `0px 2px 4px -1px rgb(${r_1} ${g_1} ${b_1} / 20%), 0px 4px 5px 0px rgb(${r_1} ${g_1} ${b_1} / 14%), 0px 1px 10px 0px rgb(${r_1} ${g_1} ${b_1} / 12%)`, margin: 24, boxSizing: "content-box", background: _current_color, borderRadius: 4, height: 48, width: 96}} onClick={(event) => {this._handle_color_menu_open(event, _current_color)}}>
                                                        Primary
                                                    </Button>
                                                    <Button variant={"contained"} style={{fontWeight: "bold", color: is_second_color_dark ? "white": "black", boxShadow: `0px 2px 4px -1px rgb(${r_2} ${g_2} ${b_2} / 20%), 0px 4px 5px 0px rgb(${r_2} ${g_2} ${b_2} / 14%), 0px 1px 10px 0px rgb(${r_2} ${g_2} ${b_2} / 12%)`, margin: 24, boxSizing: "content-box", background: _second_color, borderRadius: 4, height: 48, width: 96}} onClick={(event) => {this._switch_with_second_color()}}>
                                                        Secondary
                                                    </Button>

                                                    <div style={{padding: "8px 24px", position: "relative"}}>
                                                        <Typography id="luminosity-slider" gutterBottom>Luminosity</Typography>
                                                        <Slider defaultValue={_luminosity} step={10} valueLabelDisplay="auto" min={0} max={100} onChangeCommitted={this._set_luminosity_from_slider} aria-labelledby="luminosity-slider"/>

                                                        <Typography id="saturation-slider" gutterBottom>Saturation</Typography>
                                                        <Slider defaultValue={_saturation} step={10} valueLabelDisplay="auto" min={0} max={100} onChangeCommitted={this._set_saturation_from_slider} aria-labelledby="strength-slider"
                                                        />
                                                    </div>


                                                    <div style={{ padding: 24, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignContent: "stretch", gap: "8px", flexWrap: "wrap"}}>
                                                        {colors.map((color, index) => {

                                                            const [r, g, b] = this._rgba_from_hex(color);

                                                            return (

                                                                    <ButtonBase
                                                                        key={index}
                                                                        style={{
                                                                            background: color,
                                                                            boxShadow: `0px 2px 4px -1px rgb(${r} ${g} ${b} / 20%), 0px 4px 5px 0px rgb(${r} ${g} ${b} / 14%), 0px 1px 10px 0px rgb(${r} ${g} ${b} / 12%)`
                                                                        }}
                                                                        className={classes.buttonColor} onClick={() => {this._handle_current_color_change(color)}}>
                                                                        {color === _current_color ? <Fade in><CheckBoldIcon style={{color: is_current_color_dark ? "white": "black"}} /></Fade>: ""}
                                                                    </ButtonBase>
                                                            )
                                                        })}
                                                    </div>

                                                </div>: null
                                        }

                                        {
                                            view.map((action_set) => {
                                                return (
                                                    <div>
                                                        <ListSubheader className={classes.listSubHeader}>
                                                            <span>{action_set.icon}</span>
                                                            <span>{action_set.text}</span>
                                                        </ListSubheader>
                                                        {action_set.tools.map((tool) => {
                                                            return (
                                                                <ListItem button disabled={tool.disabled || false} onClick={tool.on_click}>
                                                                    <ListItemIcon className={classes.listItemIcon}>
                                                                        {tool.icon}
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={tool.text} />
                                                                </ListItem>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })
                                        }
                                    </List>
                                );

                            })
                        }
                    </SwipeableViews>
                </div>
            </div>
        );

        return (
            <div>
                <Backdrop className={classes.backdrop} open={_loading} />
                <Grow in>
                    <Fab className={classes.fab} variant="extended" onClick={this._handle_edit_drawer_open}>
                        <ImageEditIcon /> Edit
                    </Fab>
                </Grow>
                <div className={classes.root}>
                    <div className={classes.content}>
                        <div className={classes.contentInner}>
                            <CanvasPixels
                                key={"canvas"}
                                className={classes.contentCanvas}
                                ref={this._set_canvas_ref}
                                tool={_tool}
                                hide_canvas_content={_hide_canvas_content}
                                show_original_image_in_background={_show_original_image_in_background}
                                show_transparent_image_in_background={_show_transparent_image_in_background}
                                select_mode={_select_mode}
                                pencil_mirror_mode={_pencil_mirror_mode}
                                hue={_hue}
                                bucket_threshold={_slider_value}
                                color_loss={_slider_value}
                                pxl_current_opacity={1}
                                onImageLoadComplete={this._handle_image_load_complete}
                                onImageLoad={this._handle_image_load}
                                onCanUndoRedoChange={this._handle_can_undo_redo_change}
                                onSizeChange={this._handle_size_change}
                                onCurrentColorChange={this._handle_current_color_change}
                                onSomethingSelectedChange={this._handle_something_selected_change}
                                onImageImportModeChange={this._handle_image_import_mode_change}
                                onPositionChange={this._handle_position_change}
                                onLayersChange={this._handle_layers_change}
                                onGameEnd={this._handle_game_end}
                                mine_player_direction={_mine_player_direction}
                                pxl_width={_width}
                                pxl_height={_height}
                                pxl_current_color={_current_color}
                                convert_scale={1}
                                default_size={96}
                                max_size={96*2}
                                fast_drawing={true}
                                px_per_px={4}/>
                            <SwipeableDrawer
                                className={classes.contentDrawer}
                                disableBackdropTransition={true}
                                open={_is_edit_drawer_open}
                                onOpen={this._handle_edit_drawer_open}
                                onClose={this._handle_edit_drawer_close}
                                classes={{
                                    paper: classes.swipeableDrawerPaper
                                }}
                                variant="temporary"
                                anchor="top"
                            >
                                <DialogCloseButton onClick={this._handle_edit_drawer_close} />
                                {drawer_content}
                            </SwipeableDrawer>
                            <Drawer
                                className={classes.contentDrawerFixed}
                                variant="permanent"
                                anchor="right"
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                            >
                                <Toolbar />
                                {drawer_content}
                            </Drawer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Pixel);
