import React from "react";
import { withStyles } from "@material-ui/core/styles";

import QRCode from "qrcode.react";
import ReactDOMServer from "react-dom/server";
import svg64 from "svg64";


const styles = theme => ({

});


class Base64QRCode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            style: props.style || {},
            size: props.size || 512,
            value: props.value || "",
            level: props.level || "M",
            bg_color: props.bg_color || "transparent",
            fg_color: props.fg_color || "#000000",
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    render() {

        const { style, size, value, level, bg_color, fg_color } = this.state;

        const svg_string = ReactDOMServer.renderToString(<QRCode
            level={level}
            size={size}
            bgColor={bg_color}
            fgColor={fg_color}
            renderAs={"svg"}
            value={value}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        />);

        const svg_string_base64 = svg64(svg_string);

        return (
            <img style={{width: "100%", ...style}} src={`${svg_string_base64}`}/>
        );
    }
}

export default withStyles(styles)(Base64QRCode);
