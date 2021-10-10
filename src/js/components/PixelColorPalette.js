import React from "react";
import { withStyles } from "@material-ui/core/styles";

import PixelColorPaletteItem from "../components/PixelColorPaletteItem";
import EraserIcon from "../icons/Eraser";

const styles = theme => ({
    colorPalette: {
        padding: 24,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "stretch",
        gap: 8,
        flexWrap: "wrap"
    },
    eraseButton: {
        marginBottom: 8,
    },
});


class PixelColorPalette extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            colors: props.colors || [],
            selected_colors:  props.selected_colors || [],
            selected_colors_set: new Set([...props.selected_colors || null]),
            padding: props.padding || 24,
            gap: props.gap || 8,
            size: props.size || 32,
            transparent: props.transparent || true,
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState({
            classes: new_props.classes,
            colors: new_props.colors || [],
            selected_colors:  new_props.selected_colors || [],
            selected_colors_set: new Set([...new_props.selected_colors || null]),
            padding: new_props.padding || 24,
            gap: new_props.gap || 8,
            size: new_props.size || 32,
            transparent: new_props.transparent || true,
        });
    }

    _handle_color_item_click = (event, color) => {

        if(this.props.onColorClick) {

            this.props.onColorClick(event, color);
        }
    };

    shouldComponentUpdate(new_props) {

        const { colors, selected_colors, padding, gap, size } = this.state;

        if(colors !== new_props.colors || selected_colors !== new_props.selected_colors || padding !== new_props.padding || gap !== new_props.gap || size !== new_props.size) {

            return true;
        }else {

            return false;
        }

    }

    render() {

        let { classes, selected_colors_set, colors, padding, gap, size } = this.state;

        return (
            <div className={classes.colorPalette} style={{ padding: padding, gap: gap}}>
                <PixelColorPaletteItem size={32}
                                       className={classes.eraseButton}
                                       icon={<EraserIcon />}
                                       full_width={true}
                                       color={"#00000000"}
                                       selected={selected_colors_set.has("#00000000") || false}
                                       onClick={(event) => {this._handle_color_item_click(event, "#00000000")}}/>
                {colors.map((color, index) => {

                    return <PixelColorPaletteItem key={index}
                                                  color={color}
                                                  size={size}
                                                  selected={selected_colors_set.has(color) || false}
                                                  onClick={(event) => {this._handle_color_item_click(event, color)}} />
                })}
            </div>
        );
    }
}

export default withStyles(styles)(PixelColorPalette);
