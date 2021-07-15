import ReactDOMServer from 'react-dom/server'
import QRCode from "qrcode.react";
import React from "react";
import svg64 from "svg64";

function download_qr_code_image(text_string, size_px = 512, level="M", name = "image.svg") {

    const svg_string = ReactDOMServer.renderToString(<QRCode
        level={level}
        size={size_px}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        renderAs={"svg"}
        value={text_string}
    />);

    const svg_string_base64 = svg64(svg_string);

    let a = document.createElement("a"); //Create <a>
    a.href = svg_string_base64; //Image Base64 Goes here
    a.download = name; //File name Here
    a.click();
}

module.exports = {
    download_qr_code_image: download_qr_code_image,
};