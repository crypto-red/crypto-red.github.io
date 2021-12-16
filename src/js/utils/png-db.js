import {xxHash32} from "js-xxhash";
import pool from "../utils/worker-pool";

let stuff = () => {

    let img_rel_list = new Set();
    let img_objs_array = [];

    const get_id = (base64) => {

        return xxHash32(base64, 0).toString(16);
    };

    const has = (id) => {

        return img_rel_list.has(id)
    };

    const add = (r) => {

        img_rel_list.add(r.id);
        img_objs_array[r.id] = r;
    };

    const get_new_img_obj = (base64, callback) => {

        const id = get_id(base64);
        if(has(id)) {

            callback(img_objs_array[id]);
        } else {

            console.log("1");
            format_png_base64(base64, id,(r) => {

                add(r);
                callback(r);
            });
        }
    };

    const format_png_base64 = (base64, id, callback_function) => {

        const process_function_string = `return async function(base64, id) {
            
            var img_obj = {id:id};
        
            const to_image = async (base64) =>
                new Promise(ok => {
                    const image = new Image();
                    image.addEventListener("load", () => ok(image));
                    image.src = base64;
              });
              
     
            var image = await to_image(base64);

            var canvas = new OffscreenCanvas(image.width, image.height);
            var ctx = canvas.getContext('2d');
    
            ctx.drawImage(image, 0, 0);
   
            img_obj.width = img.naturalWidth;
            img_obj.height = img.naturalHeight;
            img_obj.image_data = ctx.getImageData(0, 0, img.width, img.height);
            
            Object.freeze(img_obj);
            return img_obj;
        }`;


        let process_function = new Function(process_function_string)();

        (async () => {

            let result = await pool.exec(process_function, [
                base64,
                id
            ]).catch((error) => {

                let img_obj = {id:id};
                let img = new Image();
                img.onload = () => {

                    let canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;

                    let ctx = canvas.getContext('2d');

                    ctx.drawImage(img, 0, 0);

                    img_obj.width = img.naturalWidth;
                    img_obj.height = img.naturalHeight;
                    img_obj.image_data = ctx.getImageData(0, 0, img.width, img.height);
                    Object.freeze(img_obj);
                    callback_function(img_obj);
                };

                img.src = base64;

            }).timeout(120000);

            if(result) {

                callback_function(result);
            }

        })();
    };

    return {has, get_new_img_obj, get_id};
}

module.exports = stuff;