import {sha512_256} from "../utils/api-crypto"

let img_rel_list = new Set([]);
let img_objs_array = [];

const format_png_base64 = (base64, callback_function) => {

    let img = new Image();
    let img_obj = {
        img_data_id: sha512_256(base64),
        image_data: [],
        height: 0,
        width: 0,
    };

    img.onload = () => {

        let canvas = null;

        try {

            canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
        }catch (e) {

            canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
        }

        let ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        img_obj.width = img.naturalWidth;
        img_obj.height = img.naturalHeight;
        img_obj.image_data = ctx.getImageData(0, 0, img.width, img.height);
        Object.freeze(img_obj);
        callback_function(img_obj);
    };

    img.src = base64;
};

const has = (base64) => {

    return img_rel_list.has(base64);
}

const get_new_img_obj = (base64, callback) => {

    if(has(base64)) {

        callback(img_objs_array[base64]);
    } else {

        format_png_base64(base64, (r) => {

            img_objs_array[base64] = r;
            callback(r);
        });
    }
}

module.exports = {
    get_new_img_obj: get_new_img_obj,
    has: has,
}