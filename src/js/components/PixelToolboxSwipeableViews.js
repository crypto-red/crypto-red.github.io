import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

import Slider from "@material-ui/core/Slider";

import AllLayersIcon from "../icons/AllLayers";
import SelectIcon from "../icons/Select";
import ImageEffectIcon from "../icons/ImageEffect";
import ImageFilterIcon from "../icons/ImageFilter";
import SwipeableViews from "react-swipeable-views";
import {Avatar, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, ListSubheader} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import PixelColorPalette from "./PixelColorPalette";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import {ChromePicker} from "react-color";
import ImagePlusIcon from "../icons/ImagePlus";
import HistoryIcon from "../icons/History";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ImportIcon from "../icons/Import";
import DownloadIcon from "../icons/Download";
import FileDownloadIcon from "../icons/FileDownload";
import LayerSearchIcon from "../icons/LayerSearch";
import LayerOutlineIcon from "../icons/LayerOutline";
import LayerOffOutlineIcon from "../icons/LayerOffOutline";
import ImageOffOutlineIcon from "../icons/ImageOffOutline";
import ImageOutlineIcon from "../icons/ImageOutline";
import LayerEditIcon from "../icons/LayerEdit";
import LayerAddIcon from "../icons/LayerAdd";
import LayerDeleteIcon from "../icons/LayerDelete";
import ContentDuplicateIcon from "../icons/ContentDuplicate";
import MergeIcon from "../icons/Merge";
import EyeIcon from "../icons/Eye";
import EyeOffIcon from "../icons/EyeOff";
import OpacityIcon from "../icons/Opacity";
import FileImportIcon from "../icons/FileImport";
import DrawIcon from "../icons/Draw";
import ColorPickerIcon from "../icons/ColorPicker";
import MoveIcon from "../icons/Move";
import PencilIcon from "../icons/Pencil";
import PencilPerfectIcon from "../icons/PencilPerfect";
import MirrorIcon from "../icons/Mirror";
import ShapesIcon from "../icons/Shapes";
import LineIcon from "../icons/Line";
import RectangleIcon from "../icons/Rectangle";
import EllipseIcon from "../icons/Ellipse";
import ContourIcon from "../icons/Contour";
import PaintIcon from "../icons/Paint";
import BucketIcon from "../icons/Bucket";
import PaletteSwatchIcon from "../icons/PaletteSwatch";
import BorderBottomIcon from "../icons/BorderBottom";
import SelectCompareIcon from "../icons/SelectCompare";
import SelectRemoveDifferenceIcon from "../icons/SelectRemoveDifference";
import SelectAddIcon from "../icons/SelectAdd";
import SelectInImageIcon from "../icons/SelectInImage";
import SelectColorIcon from "../icons/SelectColor";
import MagicIcon from "../icons/Magic";
import SquareSmallIcon from "../icons/SquareSmall";
import SelectionRectangleIcon from "../icons/SelectionRectangle";
import SelectionEllipseIcon from "../icons/SelectionEllipse";
import ImageMoveIcon from "../icons/ImageMove";
import SelectInvertIcon from "../icons/SelectInvert";
import CopyIcon from "@material-ui/icons/FileCopy";
import CutIcon from "../icons/Cut";
import EraserIcon from "../icons/Eraser";

import AlphaIcon from "../icons/Alpha";
import ColorizedIcon from "../icons/Colorized";
import ContrastCircleIcon from "../icons/ContrastCircle";
import DutoneIcon from "../icons/Dutone";
import ImageSmoothIcon from "../icons/ImageSmooth";
import ImageVignetteIcon from "../icons/ImageVignette";
import LessColorIcon from "../icons/LessColor";
import LessColorAutoIcon from "../icons/LessColorAuto";
import RotateLeftIcon from "../icons/RotateLeft";
import RotateRightIcon from "../icons/RotateRight";
import SwapHorizontalIcon from "../icons/SwapHorizontal";
import SwapVerticalIcon from "../icons/SwapVertical";

import MagnifyPlusIcon from "../icons/MagnifyPlus";
import MagnifyMinusIcon from "../icons/MagnifyMinus";
import NavigationIcon from "../icons/Navigation";

import Jdenticon from "react-jdenticon";

const styles = theme => ({
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
            imageRendering: "pixelated",
        },
        marginRight: theme.spacing(2),
    },
    layerSelected: {
        borderRight: `4px solid ${theme.palette.primary.action}`,
        paddingRight: 12,
    },
    listOfTools: {
        paddingTop: 0,
    },
    chromePicker: {
        fontFamily: "Open Sans !important",
    },
    flipExpandMoreIcon: {
        transform: "rotate(180deg)",
        transition: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
    },
    expandMoreIcon: {
        transform: "rotate(0deg)",
        transition: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
    },
    ListItemText: {
        "& .MuiTypography-colorTextSecondary": {
            color: "rgb(25 25 51 / 54%)"
        }
    }
});


class PixelToolboxSwipeableViews extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            canvas: props.canvas,
            view_names: props.view_names,
            view_name_index: props.view_name_index,
            current_color: props.current_color,
            second_color: props.second_color,
            slider_value: props.slider_value,
            layers: props.layers,
            layer_index: props.layer_index,
            can_undo: props.can_undo,
            can_redo: props.can_redo,
            width: props.width,
            height: props.height,
            is_image_import_mode: props.is_image_import_mode,
            hide_canvas_content: props.hide_canvas_content,
            show_original_image_in_background: props.show_original_image_in_background,
            show_transparent_image_in_background: props.show_transparent_image_in_background,
            tool: props.tool,
            filters: props.filters,
            select_mode: props.select_mode,
            pencil_mirror_mode: props.pencil_mirror_mode,
            is_something_selected: props.is_something_selected,
            previous_view_name_index: props.previous_view_name_index,
            hue: props.hue,
            _layer_opened: false,
            _anchor_el: null,
            _saturation: 60,
            _luminosity: 60,
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    shouldComponentUpdate(new_props) {

        const {
            view_name_index,
            previous_view_name_index,
            view_names,
            layers,
            layer_index,
            is_image_import_mode,
            hide_canvas_content,
            show_original_image_in_background,
            show_transparent_image_in_background,
            can_undo,
            can_redo,
            current_color,
            second_color,
            slider_value,
            tool,
            width,
            height,
            filters,
            select_mode,
            pencil_mirror_mode,
            is_something_selected,
        } = this.state;

        if (
            view_name_index !== new_props.view_name_index ||
            previous_view_name_index !== new_props.previous_view_name_index ||
            view_names !== new_props.view_names ||
            layers !== new_props.layers ||
            layer_index !== new_props.layer_index ||
            is_image_import_mode !== new_props.is_image_import_mode ||
            hide_canvas_content !== new_props.hide_canvas_content ||
            hide_canvas_content !== new_props.hide_canvas_content ||
            show_original_image_in_background !== new_props.show_original_image_in_background ||
            show_transparent_image_in_background !== new_props.show_transparent_image_in_background ||
            can_undo !== new_props.can_undo ||
            can_redo !== new_props.can_redo ||
            current_color !== new_props.current_color ||
            second_color !== new_props.second_color ||
            slider_value !== new_props.slider_value ||
            tool !== new_props.tool ||
            width !== new_props.width ||
            height !== new_props.height ||
            filters !== new_props.filters ||
            select_mode !== new_props.select_mode ||
            pencil_mirror_mode !== new_props.pencil_mirror_mode ||
            is_something_selected !== new_props.is_something_selected
        ) {

            return true;
        }else {

            return false;
        }

    }

    _hsl_to_hex = (h, s, l) => {

        const { canvas } = this.state;

        if(!canvas) { return "#000000" }

        return canvas._hsl_to_hex(h, s, l);
    };

    _rgba_from_hex = (hex) => {

        const { canvas } = this.state;

        if(!canvas) { return [0, 0, 0, 0] }

        return canvas.get_rgba_from_hex(hex);
    };

    _download_png = (scale) => {

        const { canvas } = this.state;
        let a = document.createElement("a"); //Create <a>
        a.href = "" + canvas.get_base64_png_data_url(scale); //Image Base64 Goes here
        a.download = "Image.png"; //File name Here
        a.click();
    };

    _less_colors_stepped = (increase = 1) => {

        const { canvas } = this.state;

        let colors_removed = 0;
        let less_color_step = increase;
        while (colors_removed === 0 || increase !== 0) {

            colors_removed = canvas.to_less_color(less_color_step / 64).colors_removed;
            less_color_step += increase;
            increase -= colors_removed > 0 ? 1: 0;
        }
    };

    _colorize = () => {

        const { canvas, current_color, slider_value } = this.state;

        const [r, g, b, a] = canvas.get_rgba_from_hex(current_color);
        const [h, s, l] = canvas.rgb_to_hsl(r, g, b);

        canvas.to_color(h, slider_value, s === 0 ? null: s, l === 0 ? null: l);
    }

    _import_image = () => {

        if(this.props.on_import_image) {

            this.props.on_import_image();
        }
    };

    _upload_image = () => {

        if(this.props.on_upload_image) {

            this.props.on_upload_image();
        }
    };

    _handle_current_color_change = (color) => {

        if(this.props.on_current_color_change) {

            this.props.on_current_color_change(color);
        }
    };

    _handle_view_name_change = (view_name_index, previous_name_index = null) => {

        if(this.props.on_view_name_change) {

            this.props.on_view_name_change(view_name_index, previous_name_index);
        }
    };

    _handle_color_menu_open = (event) => {

        this.setState({_anchor_el: event.currentTarget}, () => {

            this.forceUpdate();
        });
    };

    _handle_color_menu_close = () => {

        this.setState({_anchor_el: null}, () => {

            this.forceUpdate();
        });
    };

    _set_saturation_from_slider = (event, value) => {

        this.setState({_saturation: value}, () => {

            this.forceUpdate();
        });
    };

    _set_luminosity_from_slider = (event, value) => {

        this.setState({_luminosity: value}, () => {

            this.forceUpdate();
        });
    };

    _set_tool = (name) => {

        if(this.props.set_tool) {

            this.props.set_tool(name);
        }
    }

    _set_select_mode = (mode) => {

        if(this.props.set_select_mode) {

            this.props.set_select_mode(mode);
        }
    }

    _set_pencil_mirror_mode = (mode) => {

        if(this.props.set_pencil_mirror_mode) {

            this.props.set_pencil_mirror_mode(mode);
        }
    }

    _switch_with_second_color = () => {

        if(this.props.switch_with_second_color) {

            this.props.switch_with_second_color();
        }
    };

    _show_hide_canvas_content = () => {

        if(this.props.show_hide_canvas_content) {

            this.props.show_hide_canvas_content();
        }
    }

    _show_hide_background_image = () => {

        if(this.props.show_hide_background_image) {

            this.props.show_hide_background_image();
        }
    }

    _show_hide_transparent_image = () => {

        if(this.props.show_hide_transparent_image) {

            this.props.show_hide_transparent_image();
        }
    }

    _set_width_from_slider = (event, value) => {

        if(this.props.set_width_from_slider) {

            this.props.set_width_from_slider(event, value);
        }
    };

    _set_height_from_slider = (event, value) => {

        if(this.props.set_height_from_slider) {

            this.props.set_height_from_slider(event, value);
        }
    };

    _change_active_layer = (index) => {

        const { canvas, layer_index, _layer_opened } = this.state;

        if(layer_index !== index) {

            if(_layer_opened) {

                this.setState({_layer_opened: false}, () => {

                    this.forceUpdate();
                });
            }

            canvas.change_active_layer(index);
        }else {

            this.setState({_layer_opened: !_layer_opened}, () => {

                this.forceUpdate();
            });
        }
    };

    render() {
        
        const {
            classes,
            canvas,
            _anchor_el,
            view_name_index,
            previous_view_name_index,
            view_names,
            layers,
            layer_index,
            _previous_layer_index,
            is_image_import_mode,
            hide_canvas_content,
            show_original_image_in_background,
            show_transparent_image_in_background,
            can_undo,
            can_redo,
            current_color,
            second_color,
            slider_value,
            tool,
            width,
            height,
            filters,
            select_mode,
            pencil_mirror_mode,
            is_something_selected,
            _saturation,
            _luminosity,
            _layer_opened,
        } = this.state;

        const actions = {
            "palette": [],
            "image": [
                {
                    icon: <NavigationIcon />,
                    text: "Navigation",
                    tools: [
                        {icon: <MoveIcon />, disabled: tool === "MOVE", text: "Move", on_click: () => {this._set_tool("MOVE")}},
                        {icon: <MagnifyPlusIcon />, text: "Zoom in", on_click: () => {canvas.zoom_of(1.5)}},
                        {icon: <MagnifyMinusIcon />, text: "Zoom out", on_click: () => {canvas.zoom_of(0.75)}},
                    ]
                },
                {
                    icon: <HistoryIcon />,
                    text: "History",
                    tools: [
                        {icon: <ArrowBackIcon />, disabled: !can_undo ,text: "Undo", sub: "[CTRL + Z]", on_click: () => {canvas.undo()}},
                        {icon: <ArrowForwardIcon />, disabled: !can_redo , text: "Redo", sub: "[CTRL + Y]", on_click: () => {canvas.redo()}},
                    ]
                },
                {
                    icon: <ImportIcon />,
                    text: "Upload",
                    tools: [
                        {icon: <ImagePlusIcon />, text: "Open image", sub: "[CTRL + O]", on_click: () => {this._upload_image()}},
                    ]
                },
                {
                    icon: <DownloadIcon />,
                    text: "Download",
                    tools: [
                        {icon: <FileDownloadIcon />, text: "Download (small size)", sub: "[CTRL + Q]", on_click: () => {this._download_png(1)}},
                        {icon: <FileDownloadIcon />, text: "Download (big size)", sub: "[CTRL + S]", on_click: () => {this._download_png(32)}},
                    ]
                },
            ],
            "layers": [
                {
                    icon: <LayerSearchIcon />,
                    text: `Layer tools`,
                    tools: [
                        {icon: hide_canvas_content ? <LayerOutlineIcon />: <LayerOffOutlineIcon />, text: hide_canvas_content ? "Show canvas content": "Hide canvas content", on_click: () => {this._show_hide_canvas_content()}},
                        {icon: show_original_image_in_background ? <ImageOffOutlineIcon />: <ImageOutlineIcon />, text: show_original_image_in_background ? "Hide bg img": "Show bg img", on_click: () => {this._show_hide_background_image()}},
                        {icon: show_transparent_image_in_background ? <ImageOffOutlineIcon />: <ImageOutlineIcon />, text: show_transparent_image_in_background ? "Hide chessboard": "Show chessboard", on_click: () => {this._show_hide_transparent_image()}},
                    ]
                },
                {
                    icon: <LayerEditIcon />,
                    text: `Layer actions`,
                    tools: [
                        {icon: <LayerAddIcon />, text: "New layer", on_click: () => {canvas.new_layer(layer_index+1)}},
                        {icon: <LayerDeleteIcon />, text: "Delete layer", on_click: () => {canvas.delete_layer(layer_index)}},
                        {icon: <ContentDuplicateIcon />, text: "Duplicate layer", on_click: () => {canvas.duplicate_layer(layer_index)}},
                        {icon: <MergeIcon />, text: "Merge down layer", on_click: () => {canvas.merge_down_layer(layer_index)}},
                        {icon: layers[layer_index].hidden ? <EyeIcon />: <EyeOffIcon />, text: layers[layer_index].hidden ? `Show`: `Hide`, on_click: () => {canvas.toggle_layer_visibility(layer_index)}},
                        {icon: <OpacityIcon />, text: `Opacity: ${layers[layer_index].opacity} -> ${slider_value}`, on_click: () => {canvas.change_layer_opacity(layer_index)}},
                    ]
                },
                {
                    icon: <ImportIcon />,
                    text: "Import image",
                    tools: [
                        {icon: <FileImportIcon />, text: "Import image", sub: "[CTRL + I]", on_click: () => {this._import_image()}},
                        {icon: <FileImportIcon />, text: "Confirm import", sub: "[Enter]", disabled: !is_image_import_mode, on_click: () => {canvas.confirm_import()}},
                    ]
                },
            ],
            "tools": [
                {
                    icon: <DrawIcon />,
                    text: "Drawing tools",
                    tools: [
                        {icon: <ColorPickerIcon />, disabled: tool === "PICKER", text: "Picker", sub: "[CTRL (HOLD)]", on_click: () => {this._set_tool("PICKER")}},
                        {icon: <PencilIcon />, disabled: tool === "PENCIL", text: "Pencil", sub: "[P]", on_click: () => {this._set_tool("PENCIL")}},
                        {icon: <PencilPerfectIcon />, disabled: tool === "PENCIL PERFECT", text: "Pencil perfect", sub: "[N]", on_click: () => {this._set_tool("PENCIL PERFECT")}},
                        {icon: <MirrorIcon />, disabled: tool === "SET PENCIL MIRROR", text: "Set pencil mirror", sub: "[M]", on_click: () => {this._set_tool("SET PENCIL MIRROR")}},
                    ]
                },
                {
                    icon: <ShapesIcon />,
                    text: "Shapes tools",
                    tools: [
                        {icon: <LineIcon />, disabled: tool === "LINE", text: "Line", sub: "[L]", on_click: () => {this._set_tool("LINE")}},
                        {icon: <RectangleIcon />, disabled: tool === "RECTANGLE", text: "Rectangle", sub: "[R]", on_click: () => {this._set_tool("RECTANGLE")}},
                        {icon: <EllipseIcon />, disabled: tool === "ELLIPSE", text: "Ellipse", sub: "[E]", on_click: () => {this._set_tool("ELLIPSE")}},
                        {icon: <ContourIcon />, disabled: tool === "CONTOUR", text: "Free path", sub: "[F]", on_click: () => {this._set_tool("CONTOUR")}},
                    ]
                },
                {
                    icon: <PaintIcon />,
                    text: "Paint tools",
                    tools: [
                        {icon: <BucketIcon />, disabled: tool === "BUCKET", text: "Bucket", sub: "[B]", on_click: () => {this._set_tool("BUCKET")}},
                        {icon: <BucketIcon />, disabled: tool === "HUE BUCKET", text: "Hue bucket", sub: "[H]", on_click: () => {this._set_tool("HUE BUCKET")}},
                        {icon: <PaletteSwatchIcon />, disabled: tool === "EXCHANGE", text: "Exchange", sub: "[X]", on_click: () => {this._set_tool("EXCHANGE")}},
                        {icon: <BorderBottomIcon />, disabled: tool === "BORDER", text: "Border", sub: "[U]", on_click: () => {this._set_tool("BORDER")}},
                    ]
                },
                {
                    icon: <MirrorIcon />,
                    text: "Set pencil mirrors",
                    tools: [
                        {icon: <MirrorIcon />, disabled: pencil_mirror_mode === "NONE",text: "None", on_click: () => {this._set_pencil_mirror_mode("NONE")}},
                        {icon: <MirrorIcon />, disabled: pencil_mirror_mode === "VERTICAL", text: "Vertical", on_click: () => {this._set_pencil_mirror_mode("VERTICAL")}},
                        {icon: <MirrorIcon />, disabled: pencil_mirror_mode === "HORIZONTAL", text: "Horizontal", on_click: () => {this._set_pencil_mirror_mode("HORIZONTAL")}},
                        {icon: <MirrorIcon />, disabled: pencil_mirror_mode === "BOTH", text: "Both", on_click: () => {this._set_pencil_mirror_mode("BOTH")}},
                    ]
                },
            ],
            "selection": [
                {
                    icon: <SelectCompareIcon />,
                    text: "Select mode",
                    tools: [
                        {icon: <SelectRemoveDifferenceIcon />, disabled: select_mode === "REMOVE", text: "Select remove", sub: "[CTRL (HOLD)]", on_click: () => {this._set_select_mode("REMOVE")}},
                        {icon: <SelectAddIcon />, disabled: select_mode === "ADD", text: "Select add", sub: "[SHIFT (HOLD)]", on_click: () => {this._set_select_mode("ADD")}},
                        {icon: <SelectIcon />, disabled: select_mode === "REPLACE", text: "Select replace", on_click: () => {this._set_select_mode("REPLACE")}},
                    ]
                },
                {
                    icon: <SelectInImageIcon />,
                    text: "Select tool",
                    tools: [
                        {icon: <SelectIcon />, disabled: tool === "SELECT PATH", text: "Select path", sub: "[CTRL + F]", on_click: () => {this._set_tool("SELECT PATH")}},
                        {icon: <SelectColorIcon />, disabled: tool === "SELECT COLOR", text: "Select color", sub: "[CTRL + G]", on_click: () => {this._set_tool("SELECT COLOR")}},
                        {icon: <MagicIcon />, disabled: tool === "SELECT COLOR THRESHOLD", text: "Select color threshold", sub: "[CTRL + K]", on_click: () => {this._set_tool("SELECT COLOR THRESHOLD")}},
                        {icon: <SquareSmallIcon />, disabled: tool === "SELECT PIXEL", text: "Select pixel", sub: "[CTRL + P]", on_click: () => {this._set_tool("SELECT PIXEL")}},
                        {icon: <SquareSmallIcon />, disabled: tool === "SELECT PIXEL PERFECT", text: "Select pixel perfect", sub: "[CTRL + N]", on_click: () => {this._set_tool("SELECT PIXEL PERFECT")}},
                        {icon: <SelectIcon />, disabled: tool === "SELECT LINE", text: "Select line", sub: "[CTRL + L]", on_click: () => {this._set_tool("SELECT LINE")}},
                        {icon: <SelectionRectangleIcon />, disabled: tool === "SELECT RECTANGLE", text: "Select rectangle", sub: "[CTRL + R]", on_click: () => {this._set_tool("SELECT RECTANGLE")}},
                        {icon: <SelectionEllipseIcon />, disabled: tool === "SELECT ELLIPSE", text: "Select ellipse", sub: "[CTRL + E]", on_click: () => {this._set_tool("SELECT ELLIPSE")}},
                    ]
                },
                {
                    icon: <ImageMoveIcon />,
                    text: "Apply to selection",
                    tools: [
                        {icon: <SelectInImageIcon />, disabled: !is_something_selected, text: "Shrink", on_click: () => {canvas.to_selection_size(-1)}},
                        {icon: <SelectInImageIcon />, disabled: !is_something_selected, text: "Grow", on_click: () => {canvas.to_selection_size(1)}},
                        {icon: <BorderBottomIcon />, disabled: !is_something_selected, text: "Border", on_click: () => {canvas.to_selection_border()}},
                        {icon: <BucketIcon />, disabled: !is_something_selected, text: "Bucket", on_click: () => {canvas.to_selection_bucket()}},
                        {icon: <SelectInImageIcon />, disabled: !is_something_selected, text: "Crop", on_click: () => {canvas.to_selection_crop()}},
                        {icon: <SelectInvertIcon />, disabled: !is_something_selected, text: "Invert", on_click: () => {canvas.to_selection_invert()}},
                        {icon: <CopyIcon />, disabled: !is_something_selected, text: "Copy", on_click: () => {canvas.copy_selection()}},
                        {icon: <CutIcon />, disabled: !is_something_selected, text: "Cut", on_click: () => {canvas.cut_selection()}},
                        {icon: <EraserIcon />, disabled: !is_something_selected, text: "Erase", on_click: () => {canvas.erase_selection()}},
                    ]
                },
            ],
            "effects": [
                {
                    icon: <ImageEffectIcon />,
                    text: "Effects",
                    tools: [
                        {icon: <ImageSmoothIcon />, text: "Smooth", sub: "Run smooth effect once", on_click: () => {canvas.smooth_adjust(1)}},
                        {icon: <ContrastCircleIcon />, text: "To auto contrast", sub: "Effect strength have an impact", on_click: () => {canvas.auto_adjust_contrast(slider_value)}},
                        {icon: <ImageVignetteIcon />, text: "To vignette", sub: "Current color and effect strength have an impact", on_click: () => {canvas.to_vignette(current_color, slider_value)}},
                        {icon: <LessColorIcon />, text: "To less colors", sub: "Effect strength have an impact", on_click: () => {canvas.to_less_color(slider_value)}},
                        {icon: <LessColorAutoIcon />, text: "Less colors auto", sub: "Apply to current layer", on_click: () => {canvas.to_less_color("auto")}},
                        {icon: <DutoneIcon />, text: "To dutone", sub: "Current color and effect strength have an impact", on_click: () => {canvas.to_dutone(slider_value, second_color, current_color)}},
                        {icon: <ColorizedIcon />, text: "To colorized", sub: "Current color and effect strength have an impact", on_click: () => {this._colorize()}},
                        {icon: <AlphaIcon />, text: "To alpha", sub: "Current color and effect strength have an impact", on_click: () => {canvas.to_alpha(current_color, slider_value)}},
                        {icon: <SwapVerticalIcon />, text: "Mirror vertical", sub: "Apply to current layer", on_click: () => {canvas.to_mirror(false)}},
                        {icon: <SwapHorizontalIcon />, text: "Mirror horizontal", sub: "Apply to current layer", on_click: () => {canvas.to_mirror(true)}},
                        {icon: <RotateRightIcon />, text: "Rotate 90°", sub: "Apply to all layers", on_click: () => {this._to_rotation(true)}},
                        {icon: <RotateLeftIcon />, text: "Rotate - 90°", sub: "Apply to all layers",on_click: () => {this._to_rotation(false)}},
                    ]
                }
            ],
            "filters": [
                {
                    icon: <ImageFilterIcon />,
                    text: `Filters (Strength: ${slider_value*100}%)`,
                    tools: filters.map( (name) => {
                        return {icon: <Jdenticon value={name} size={"24"}/>, text: name, on_click: () => {canvas.to_filter(name, slider_value)}}
                    }).concat([
                        {icon: <Jdenticon value={"Black & White"} size={"24"}/>, text: "Black & White", on_click: () => {canvas.to_greyscale()}},
                        {icon: <Jdenticon value={"Sepia"} size={"24"}/>, text: "Sepia", on_click: () => {canvas.to_sepia()}},
                    ]),
                },
            ],
        };

        let colors = [];
        for (let i = 1; i <= 128; i++) {

            colors.push(this._hsl_to_hex((i / 128) * 360, _saturation, _luminosity));
        }

        const [r_1, g_1, b_1] = current_color === "#ffffff" ? [196, 196, 196]: this._rgba_from_hex(current_color);
        const is_current_color_dark = r_1 + g_1 + b_1 < 152 * 3;

        const [r_2, g_2, b_2] = second_color === "#ffffff" ? [196, 196, 196]: this._rgba_from_hex(second_color);
        const is_second_color_dark = r_2 + g_2 + b_2 < 152 * 3;

        return (
            <SwipeableViews
                containerStyle={{overflow: "visible"}}
                animateHeight={false}
                animateTransitions={false}
                disableLazyLoading={true}
                index={view_name_index}
                onChangeIndex={this._handle_view_name_change}
                disabled={true}
            >
                {
                    Object.entries(actions).map(a => a[1]).map((view, index) => {

                        if(view_name_index !== index && previous_view_name_index !== index) { return <List style={{overflow: "visible"}} />; }

                        return (
                            <List key={index} style={{overflow: "visible", paddingTop: 0}} >

                                {
                                    view_names[index] === "layers" ?
                                        <div>
                                            <ListSubheader className={classes.listSubHeader}>
                                                <span><AllLayersIcon /></span>
                                                <span>All layers</span>
                                            </ListSubheader>
                                            {[...layers].reverse().map((layer, index, array) => {

                                                const index_reverse_order = (array.length - 1) - index;
                                                layer.colors = layer.colors || [];
                                                layer.data = layer.data || {};

                                                return (
                                                    <div key={index_reverse_order}>
                                                        <ListItem
                                                            divider
                                                            className={layer_index === index_reverse_order ? classes.layerSelected: null}
                                                            button onClick={() => this._change_active_layer(index_reverse_order)}>
                                                            <ListItemAvatar>
                                                                <Avatar variant="square" className={classes.layerThumbnail} src={layer.thumbnail} />
                                                            </ListItemAvatar>
                                                            <ListItemText primary={layer.name} />
                                                            <ExpandMoreIcon  className={_layer_opened && layer_index === index_reverse_order ? classes.flipExpandMoreIcon: classes.expandMoreIcon}/>
                                                        </ListItem>
                                                        {
                                                            layer_index === index_reverse_order || _previous_layer_index === index_reverse_order ?
                                                                <Collapse timeout={{ appear: 250, enter: 250, exit: 250 }} in={_layer_opened && layer_index === index_reverse_order} className={classes.layerSelected}>
                                                                    <div style={{padding: "12px 0px 12px 32px"}}>
                                                                        <span>Colours: ({layer.colors.length}/{layer.data.number_of_color})</span>
                                                                        <PixelColorPalette
                                                                            padding="12px 0px"
                                                                            gap="8px"
                                                                            colors={layer.colors}
                                                                            selected_colors={[current_color]}
                                                                            onColorClick={(event, color) => {this._handle_current_color_change(color)}}
                                                                        />
                                                                        {
                                                                            layer.colors.length >= 2 ?
                                                                                <div style={{padding: "12px 0px"}}>
                                                                                    <Button color="primary"
                                                                                            onClick={this._less_colors_stepped}>...Less colors</Button>
                                                                                </div>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                    <Divider style={{marginLeft: 24}}/>
                                                                    <div style={{padding: "12px 0px 12px 32px"}}>
                                                                        <span>Actions:</span>
                                                                        <div style={{padding: "12px 0px"}}>
                                                                            <Button color="primary" onClick={() => {canvas.current_layer_up()}}>Move Layer up</Button>
                                                                            <Button color="primary" onClick={() => {canvas.current_layer_down()}}>Move Layer down</Button>
                                                                        </div>
                                                                    </div>
                                                                </Collapse>:
                                                                null
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>: null
                                }

                                {

                                    view_names[index] === "palette" ?
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
                                                              color={ current_color }
                                                              onChange={ this._handle_current_color_change }
                                                              disableAlpha />
                                            </Menu>

                                            <div>
                                                <Button variant={"contained"}
                                                        style={{fontWeight: "bold", color: is_current_color_dark ? "white": "black", boxShadow: `0px 2px 4px -1px rgb(${r_1} ${g_1} ${b_1} / 20%), 0px 4px 5px 0px rgb(${r_1} ${g_1} ${b_1} / 14%), 0px 1px 10px 0px rgb(${r_1} ${g_1} ${b_1} / 12%)`, margin: 24, boxSizing: "content-box", background: current_color, borderRadius: 4, height: 48, width: 96}}
                                                        onClick={(event) => {this._handle_color_menu_open(event, current_color)}}>
                                                    Primary
                                                </Button>
                                                <Button variant={"contained"}
                                                        style={{fontWeight: "bold", color: is_second_color_dark ? "white": "black", boxShadow: `0px 2px 4px -1px rgb(${r_2} ${g_2} ${b_2} / 20%), 0px 4px 5px 0px rgb(${r_2} ${g_2} ${b_2} / 14%), 0px 1px 10px 0px rgb(${r_2} ${g_2} ${b_2} / 12%)`, margin: 24, boxSizing: "content-box", background: second_color, borderRadius: 4, height: 48, width: 96}}
                                                        onClick={(event) => {this._switch_with_second_color()}}>
                                                    Secondary
                                                </Button>
                                            </div>

                                            <div style={{padding: "8px 24px", position: "relative", overflow: "hidden", boxSizing: "border-box"}}>
                                                <Typography id="luminosity-slider" gutterBottom>Luminosity</Typography>
                                                <Slider defaultValue={_luminosity} step={10} valueLabelDisplay="auto" min={0} max={100} onChangeCommitted={this._set_luminosity_from_slider} aria-labelledby="luminosity-slider"/>

                                                <Typography id="saturation-slider" gutterBottom>Saturation</Typography>
                                                <Slider defaultValue={_saturation} step={10} valueLabelDisplay="auto" min={0} max={100} onChangeCommitted={this._set_saturation_from_slider} aria-labelledby="strength-slider"
                                                />
                                            </div>

                                            <PixelColorPalette
                                                padding="24px"
                                                gap="8px"
                                                colors={colors}
                                                selected_colors={[current_color]}
                                                onColorClick={(event, color) => {this._handle_current_color_change(color)}}
                                            />

                                        </div>: null
                                }

                                {
                                    view.map((action_set, index) => {
                                        return (
                                            <div key={index}>
                                                <ListSubheader className={classes.listSubHeader}>
                                                    <span>{action_set.icon}</span>
                                                    <span>{action_set.text}</span>
                                                </ListSubheader>
                                                {action_set.tools.map((tool) => {
                                                    return (
                                                        <ListItem button divider disabled={tool.disabled || false} onClick={tool.on_click}>
                                                            <ListItemIcon className={classes.listItemIcon}>
                                                                {tool.icon}
                                                            </ListItemIcon>
                                                            <ListItemText className={classes.ListItemText} primary={tool.text} secondary={tool.sub}/>
                                                        </ListItem>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })
                                }

                                {
                                    view_names[index] === "image" ?
                                        <div>
                                            <ListSubheader className={classes.listSubHeader}>
                                                <span><ImagePlusIcon /></span>
                                                <span>Create new</span>
                                            </ListSubheader>
                                            <div style={{padding: "8px 24px", position: "relative", overflow: "hidden", boxSizing: "border-box"}}>
                                                <Typography id="width-slider" gutterBottom>Width</Typography>
                                                <Slider defaultValue={width} step={8} valueLabelDisplay="auto" min={0} max={256} onChangeCommitted={this._set_width_from_slider} aria-labelledby="width-slider"/>
                                                <Typography id="height-slider" gutterBottom>Height</Typography>
                                                <Slider defaultValue={height} step={8} valueLabelDisplay="auto" min={0} max={256} onChangeCommitted={this._set_height_from_slider} aria-labelledby="height-slider"/>
                                            </div>
                                        </div>
                                        : null
                                }

                            </List>
                        );

                    })
                }
            </SwipeableViews>
        );
    }
}

export default withStyles(styles)(PixelToolboxSwipeableViews);
