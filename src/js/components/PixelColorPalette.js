import React from "react";
import { withStyles } from "@material-ui/core/styles";

import PixelColorPaletteItem from "../components/PixelColorPaletteItem";

const styles = theme => ({
    colorPalette: {
        padding: 24,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "stretch",
        gap: 8,
        flexWrap: "wrap"
    }
});


class PixelColorPalette extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            colors: props.colors || [],
            selected_colors: props.selected_colors || [],
            padding: props.padding || 24,
            gap: props.gap || 8,
            size: props.size || 32,
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
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

        const { classes, selected_colors, colors, padding, gap, size } = this.state;

        const selected_colors_set = new Set([...selected_colors]);

        return (
            <div className={classes.colorPalette} style={{ padding: padding, gap: gap}}>
                {colors.map((color, index) => {

                    return <PixelColorPaletteItem key={index}
                                                  color={color}
                                                  size={size}
                                                  selected={selected_colors_set.has(color)}
                                                  onClick={(event) => {this._handle_color_item_click(event, color)}} />
                })}
            </div>
        );
    }
}

export default withStyles(styles)(PixelColorPalette);
