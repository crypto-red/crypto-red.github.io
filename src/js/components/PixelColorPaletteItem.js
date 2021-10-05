import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Fade from "@material-ui/core/Fade";
import CheckBoldIcon from "../icons/CheckBold";

const styles = theme => ({
    colorPaletteItem: {
        padding: 0,
        borderRadius: 2,
        height: 32,
        width: 32
    },
});


class PixelColorPaletteItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            selected: props.selected || false,
            color: props.color || "#00000000",
            size: props.size || "inherit",
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    _get_rgba_from_hex = (color) => {

        color = color || "#00000000";

        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const a = parseInt(color.slice(7, 9), 16);

        return [r, g, b, a];
    };

    shouldComponentUpdate(new_props) {

        const { selected, color, size } = this.state;

        if(selected !== new_props.selected || color !== new_props.color || size !== new_props.size) {

            return true;
        }else {

            return false;
        }
    }

    render() {

        const { classes, selected, color, size } = this.state;

        const [r, g, b] = color === "#ffffff" ? [196, 196, 196]: this._get_rgba_from_hex(color);
        const is_current_color_dark = r + g + b < 192 * 3;

        return (
            <ButtonBase
                onClick={this.props.onClick ? this.props.onClick: null}
                style={{
                    background: color,
                    boxShadow: `0px 2px 4px -1px rgb(${r} ${g} ${b} / 20%), 0px 4px 5px 0px rgb(${r} ${g} ${b} / 14%), 0px 1px 10px 0px rgb(${r} ${g} ${b} / 12%)`,
                    width: size,
                    height: size,
                }}
                className={classes.colorPaletteItem}>
                {selected ? <Fade in><CheckBoldIcon style={{color: is_current_color_dark ? "white": "black"}} /></Fade>: ""}
            </ButtonBase>
        );
    }
}

export default withStyles(styles)(PixelColorPaletteItem);
