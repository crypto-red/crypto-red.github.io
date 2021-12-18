import {xxHash32} from "js-xxhash";
import pool from "../utils/worker-pool";

window.img_rel_list = new Set();
window.img_objs_array = [];

let stuff = () => {

    const get_id = (base64) => {

        return xxHash32(base64, 0).toString(16);
    };

    const has = (id) => {

        return window.img_rel_list.has(id)
    };

    const add = (r) => {

        window.img_rel_list.add(r.id);
        window.img_objs_array[r.id] = r;
    };

    const get_new_img_obj = (base64, callback) => {

        const id = get_id(base64);
        if(has(id)) {

            callback(img_objs_array[id]);
        } else {

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
            
            var pxl_colors = [];
            var pxl_colors_rgba = [];
            var pxl_colors_set = new Set();
            var pxls = new Uint16Array(img_obj.image_data.width * img_obj.image_data.height);
            var image_dd = img_obj.image_data.data;

            // Compute and sort colors by index and pixel by color index
            for (var i = 0; i < image_dd.length; i += 4) {

                var color_hex = "#";
                var colors_rgba = new Uint8ClampedArray(4);

                for (var c = 0; c < 4; c++) {

                    colors_rgba[c] = image_dd[i+c];
                    color_hex += Math.round(colors_rgba[c]).toString(16).padStart(2, "0");
                }

                const deja_vu_color_hex = pxl_colors_set.has(color_hex);
                var color_hex_index = deja_vu_color_hex ? pxl_colors.indexOf(color_hex): -1;

                if (color_hex_index === -1) {

                    color_hex_index = pxl_colors.push(color_hex)-1;
                    pxl_colors_rgba.push(colors_rgba);
                    pxl_colors_set.add(color_hex);
                }
                pxls[i / 4] = color_hex_index;
            }

            // Compute occurrence by color index
            var pxl_colors_occurrence = new Uint16Array(pxl_colors.length).fill(0);
            pxls.forEach((p) => {

                pxl_colors_occurrence[p]++;
            });

            function rgba_to_hsla(rgba) {

            var r = parseFloat(rgba[0] / 255);
            var g = parseFloat(rgba[1] / 255);
            var b = parseFloat(rgba[2] / 255);
            var a = parseFloat(rgba[3] / 255);
                        
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;

                if(max == min){
                    h = s = 0; // achromatic
                }else{
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch(max){
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }

                return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100), Math.round(a * 100) / 100];
            }

            function blend_colors(basei, addedi, amount, alpha_addition = false) {

                var base = [parseFloat(basei[0]), parseFloat(basei[1]), parseFloat(basei[2]), parseFloat(basei[3])];
                var added = [parseFloat(addedi[0]), parseFloat(addedi[1]), parseFloat(addedi[2]), parseFloat(addedi[3])];

                // Extract RGBA from both colors
                base[3] /= 255;
                added[3] /= 255;
                added[3] *= amount;

                var mix = [];
                if (base[3] !== 0 && added[3] !== 0) {

                    mix[3] = !alpha_addition ? 1 - (1 - added[3]) * (1 - base[3]): (added[3] + base[3]); // alpha
                    mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3])); // red
                    mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3])); // green
                    mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3])); // blue
                }else if(added[3] !== 0) {

                    mix = added;
                }else {

                    mix = base;
                }

                mix[3] = !alpha_addition ? mix[3]: mix[3] / 2;
                mix[3] = Math.round(mix[3] * 255);

                return mix;
            }

            // From the up to 10 most used colors compute the most dominant PRIMARY COLOR
            var top_color_indexes = pxl_colors_occurrence.sort((a, b) => a - b).map(c => pxl_colors_occurrence.indexOf(c));
            var occurrence_accumulator = 0;
            var occurrence_accumulator_all = 0;
            var top_color_data = [];
            var top_color_data_all = [];
            top_color_indexes.forEach((tci, i) => {

                var occurrence = pxl_colors_occurrence[tci];
                var color_rgba = pxl_colors_rgba[tci];
                
                if(i <= top_color_indexes.length / 4) {
                    
                    top_color_data.push({color_rgba: color_rgba, occurrence: occurrence});
                    occurrence_accumulator += occurrence;
                }

                top_color_data_all.push({color_rgba: color_rgba, occurrence: occurrence});
                occurrence_accumulator_all += occurrence;
            });

            var primary_rgba_color = [0, 0, 0, 0];
            top_color_data.forEach((tc) => {

                primary_rgba_color = blend_colors(primary_rgba_color, tc.color_rgba, tc.occurrence / occurrence_accumulator, true);
            });
            
            var primary_hsla_color = rgba_to_hsla(primary_rgba_color);

            // From the dominant color compute the SECONDARY
            var secondary_hsla_color = [
                (primary_hsla_color[0] + 180) % 360,
                primary_hsla_color[1],
                primary_hsla_color[2],
                primary_hsla_color[3],
            ];

            // From the up to 10 most used colors select the BRIGHTEST COLOR
            var brightest_hsla_color = [0, 0, 0, 1];
            top_color_data_all.forEach((tc) => {

                var hsla = rgba_to_hsla(tc.color_rgba);
                if(hsla[2] > brightest_hsla_color[2]) { brightest_hsla_color = hsla}
            });
            
            // From the up to 10 most used colors select the DARKEST COLOR
            var darkest_hsla_color = [0, 0, 100, 1];
            top_color_data_all.forEach((tc) => {

                var hsla = rgba_to_hsla(tc.color_rgba);
                if(hsla[2] < darkest_hsla_color[2]) { darkest_hsla_color = hsla}
            });
            
            img_obj.colors = pxl_colors.map((pch, i) => {
                return {rgba: pxl_colors_rgba[i], hex: pch, percent: pxl_colors_occurrence[i] / occurrence_accumulator_all};
            });
            
            img_obj.pxl_colors = pxl_colors;
            img_obj.pxls = pxls;
            
            img_obj.theme = {
                primary_hsla_color: primary_hsla_color,
                secondary_hsla_color: secondary_hsla_color,
                brightest_hsla_color: brightest_hsla_color,
                darkest_hsla_color: darkest_hsla_color,
            };
            
            return Object.freeze(img_obj);
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

                    let pxl_colors = [];
                    let pxl_colors_rgba = [];
                    let pxl_colors_set = new Set();
                    let pxls = new Uint16Array(img_obj.image_data.width * img_obj.image_data.height);
                    let image_dd = img_obj.image_data.data;

                    // Compute and sort colors by index and pixel by color index
                    for (let i = 0; i < image_dd.length; i += 4) {

                        let color_hex = "#";
                        let colors_rgba = new Uint8ClampedArray(4);

                        for (let c = 0; c < 4; c++) {

                            colors_rgba[c] = image_dd[i+c];
                            color_hex += Math.round(colors_rgba[c]).toString(16).padStart(2, "0");
                        }

                        const deja_vu_color_hex = pxl_colors_set.has(color_hex);
                        let color_hex_index = deja_vu_color_hex ? pxl_colors.indexOf(color_hex): -1;

                        if (color_hex_index === -1) {

                            color_hex_index = pxl_colors.push(color_hex)-1;
                            pxl_colors_rgba.push(colors_rgba);
                            pxl_colors_set.add(color_hex);
                        }
                        pxls[i / 4] = color_hex_index;
                    }

                    // Compute occurrence by color index
                    let pxl_colors_occurrence = new Uint16Array(pxl_colors.length).fill(0);
                    pxls.forEach((p) => {

                        pxl_colors_occurrence[p]++;
                    });

                    function rgba_to_hsla(rgba) {

                        let r = parseFloat(rgba[0] / 255);
                        let g = parseFloat(rgba[1] / 255);
                        let b = parseFloat(rgba[2] / 255);
                        let a = parseFloat(rgba[3] / 255);

                        let max = Math.max(r, g, b), min = Math.min(r, g, b);
                        let h, s, l = (max + min) / 2;

                        if(max == min){
                            h = s = 0; // achromatic
                        }else{
                            let d = max - min;
                            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                            switch(max){
                                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                                case g: h = (b - r) / d + 2; break;
                                case b: h = (r - g) / d + 4; break;
                            }
                            h /= 6;
                        }

                        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100), Math.round(a * 100) / 100];
                    }

                    function blend_colors(basei, addedi, amount, alpha_addition = false) {

                        let base = [parseFloat(basei[0]), parseFloat(basei[1]), parseFloat(basei[2]), parseFloat(basei[3])];
                        let added = [parseFloat(addedi[0]), parseFloat(addedi[1]), parseFloat(addedi[2]), parseFloat(addedi[3])];

                        // Extract RGBA from both colors
                        base[3] /= 255;
                        added[3] /= 255;
                        added[3] *= amount;

                        let mix = [];
                        if (base[3] !== 0 && added[3] !== 0) {

                            mix[3] = !alpha_addition ? 1 - (1 - added[3]) * (1 - base[3]): (added[3] + base[3]); // alpha
                            mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3])); // red
                            mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3])); // green
                            mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3])); // blue
                        }else if(added[3] !== 0) {

                            mix = added;
                        }else {

                            mix = base;
                        }

                        mix[3] = !alpha_addition ? mix[3]: mix[3] / 2;
                        mix[3] = Math.round(mix[3] * 255);

                        return mix;
                    }

                    // From the up to 10 most used colors compute the most dominant PRIMARY COLOR
                    const top_color_indexes = pxl_colors_occurrence.sort((a, b) => a - b).map(c => pxl_colors_occurrence.indexOf(c));
                    let occurrence_accumulator = 0;
                    let occurrence_accumulator_all = 0;
                    let top_color_data = [];
                    let top_color_data_all = [];
                    top_color_indexes.forEach((tci, i) => {

                        const occurrence = pxl_colors_occurrence[tci];
                        const color_rgba = pxl_colors_rgba[tci];

                        if(i <= top_color_indexes.length / 4) {

                            top_color_data.push({color_rgba, occurrence});
                            occurrence_accumulator += occurrence;
                        }

                        top_color_data_all.push({color_rgba, occurrence});
                        occurrence_accumulator_all += occurrence;
                    });

                    let primary_rgba_color = [0, 0, 0, 0];
                    top_color_data.forEach((tc) => {

                        primary_rgba_color = blend_colors(primary_rgba_color, tc.color_rgba, tc.occurrence / occurrence_accumulator, true);
                    });

                    const primary_hsla_color = rgba_to_hsla(primary_rgba_color);

                    // From the dominant color compute the SECONDARY
                    const secondary_hsla_color = [
                        (primary_hsla_color[0] + 180) % 360,
                        primary_hsla_color[1],
                        primary_hsla_color[2],
                        primary_hsla_color[3],
                    ];

                    // From the up to 10 most used colors select the BRIGHTEST COLOR
                    let brightest_hsla_color = [0, 0, 0, 1];
                    top_color_data_all.forEach((tc) => {

                        const hsla = rgba_to_hsla(tc.color_rgba);
                        if(hsla[2] > brightest_hsla_color[2]) { brightest_hsla_color = hsla}
                    });

                    // From the up to 10 most used colors select the DARKEST COLOR
                    let darkest_hsla_color = [0, 0, 100, 1];
                    top_color_data_all.forEach((tc) => {

                        const hsla = rgba_to_hsla(tc.color_rgba);
                        if(hsla[2] < darkest_hsla_color[2]) { darkest_hsla_color = hsla}
                    });

                    img_obj.colors = pxl_colors.map((pch, i) => {
                        return {rgba: pxl_colors_rgba[i], hex: pch, percent: pxl_colors_occurrence[i] / occurrence_accumulator_all};
                    });

                    img_obj.pxl_colors = pxl_colors;
                    img_obj.pxls = pxls;

                    img_obj.theme = {
                        primary_hsla_color,
                        secondary_hsla_color,
                        brightest_hsla_color,
                        darkest_hsla_color,
                    };

                    callback_function(Object.freeze(img_obj));

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