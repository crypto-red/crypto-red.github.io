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
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
    />);

    const svg_string_base64 = svg64(svg_string);

    const margin = 64;
    const window_size = size_px + margin + margin;

    let my_window = window.open("", name, `top=${margin},left=${margin},scrollbars=no,resizable=no`);

    const html_image =`<img style="padding:${margin}px ${margin}px;display:block;margin-left:auto;margin-right:auto;width:${size_px}px;height:${size_px};" src="${svg_string_base64}"></img>`;
    const html_string = `<html><head></head><body onload="window.print();setTimeout(function(){window.close();}, 10000)"><h1 style="font-family: Arial;text-align: center">${name}</h1><div>${html_image}</div><p style="font-family: Arial;">https://wallet.crypto.red/</p></body></html>`;

    my_window.document.addEventListener("unload", () => {

        window.focus();
    });

    my_window.document.writeln(html_string);
    my_window.document.close();
    my_window.focus();

    /*let a = document.createElement("a"); //Create <a>
    a.href = svg_string_base64; //Image Base64 Goes here
    a.download = name.replace(" ", "_") + ".svg"; //File name Here
    a.click();*/
}

module.exports = {
    download_qr_code_image: download_qr_code_image,
};