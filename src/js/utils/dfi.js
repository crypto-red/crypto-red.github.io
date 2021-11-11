import Parallel from "paralleljs";

_remove_close_pxl_colors = (pxls = [], pxl_colors  = [], bucket_threshold = null, threshold_steps = null, color_number_bonus = 0, best_color_number = null) => {

    const this_state_bucket_threshold = this.state.bucket_threshold;

    function process_function(data) {

        function this_rgb_to_hsl(r, g, b) {

            r /= 255, g /= 255, b /= 255;
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

            return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
        }

        function this_hsl_to_rgb(h, s, l) {

            h /= 360;
            s /= 100;
            l /= 100;

            let r, g, b;
            if (s === 0) {
                r = g = b = l;
            } else {
                function hue_to_rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue_to_rgb(p, q, h + 1 / 3);
                g = hue_to_rgb(p, q, h);
                b = hue_to_rgb(p, q, h - 1 / 3);
            }

            return [r * 255, g * 255, b * 255];
        }

        function this_get_hex_values_from_rgba_values(r, g, b, a) {

            return [
                this_get_hex_value_from_rgb_value(r),
                this_get_hex_value_from_rgb_value(g),
                this_get_hex_value_from_rgb_value(b),
                this_get_hex_value_from_rgb_value(a)
            ];
        }

        function this_get_hex_color_from_rgba_values(r, g, b, a) {

            const [r_hex, g_hex, b_hex, a_hex] = this_get_hex_values_from_rgba_values(r, g, b, a);
            return "#" + r_hex + g_hex + b_hex + a_hex;
        }

        function this_get_rgba_from_hex(color) {

            color = color || "#00000000";

            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            const a = parseInt(color.slice(7, 9), 16);

            return [r, g, b, a];
        }

        function this_reduce_color(rgba_component, color_gain ) {

            if(color_gain === 1) {

                return rgba_component;
            }else {

                rgba_component++;
                let comp_by_gain = Math.round(rgba_component * color_gain) - 1;
                comp_by_gain = comp_by_gain < 0 ? 0: comp_by_gain;

                return Math.round(comp_by_gain / color_gain);
            }
        }

        function this_get_hex_value_from_rgb_value(value) {

            return Math.round(value).toString(16).padStart(2, "0");
        }

        function this_format_color(color) {

            color = typeof color === "undefined" ? "#00000000": color;
            // if color equals #fff -> #ffffff
            color = color.length === 4 ? "#" + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3): color;
            // if color equals #3333 -> #33333333
            color = color.length === 5 ? "#" + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3) + color.charAt(4) + color.charAt(4): color;
            // if color equals #000000 -> #000000ff (Alpha)
            color = color.length === 7 ? color + "ff": color;
            return color;
        }

        function this_match_color (color_a, color_b, threshold) {

            threshold = typeof threshold === "undefined" ? null: threshold;

            if(threshold === 1) {

                return true;
            }else if(threshold === 0){

                return color_a === color_b;
            }else {

                const threshold_256 = Math.round(threshold * 255);

                color_a = this_format_color(color_a);
                color_b = this_format_color(color_b);

                const [r_a, g_a, b_a, a_a] = this_get_rgba_from_hex(color_a);
                const [r_b, g_b, b_b, a_b] = this_get_rgba_from_hex(color_b);

                const a_diff = Math.abs(a_a - a_b);
                const r_diff = Math.abs(r_a - r_b);
                const g_diff = Math.abs(g_a - g_b);
                const b_diff = Math.abs(b_a - b_b);

                const a_diff_ratio = Math.abs(1 - a_diff / 255);

                if(threshold !== null) {

                    return Boolean(r_diff < threshold_256 && g_diff < threshold_256 && b_diff < threshold_256 && a_diff < threshold_256);
                }else {

                    return ((r_diff + g_diff + b_diff) / (255 * 3)) * a_diff_ratio;
                }
            }
        }

        function this_blend_colors (color_a, color_b, amount = 1, should_return_transparent = false, blend_alpha = true) {

            amount = Math.min(Math.max(amount, 0), 1);
            color_a = this_format_color(color_a);
            // If we blend the first color with the second with 0 "force", return transparent
            if(amount === 0 && color_b !== "hover" && should_return_transparent) {

                return "#00000000";
            }

            // Make sure we have a color based on the 4*2 hex char format

            if(color_b === "hover") {

                let [ r, g, b, a ] = this_get_rgba_from_hex(color_a);
                let [ h, s, l ] = this_rgb_to_hsl(r, g, b);

                const [ir, ig, ib] = this_hsl_to_rgb((h + 0) % 360, (s + 0) % 100, (l + 50) % 100);
                color_b = this_get_hex_color_from_rgba_values(ir, ig, ib, 255);
            }

            color_b = this_format_color(color_b);
            // If the second color is transparent, return transparent
            if(color_b === "#00000000" && amount === 1 && should_return_transparent) { return "#00000000"; }

            // Extract RGBA from both colors
            let base = this_get_rgba_from_hex(color_a);
            base[3] /= 255;

            let added = this_get_rgba_from_hex(color_b);
            added[3] /= 255;
            added[3] *= amount;

            let mix = [];
            if (base[3] !== 0 && added[3] !== 0) {

                mix[3] = 1 - (1 - added[3]) * (1 - base[3]); // alpha
                mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3])); // red
                mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3])); // green
                mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3])); // blue
            }else if(added[3] !== 0) {

                mix = added;
            }else {
                mix = base;
            }

            mix[3] *= 255;

            return '#' + this_get_hex_color_from_rgba_values(mix[0], mix[1], mix[2], mix[3]);
        }

        function this_remove_duplicate_pxl_colors(_pxls, _pxl_colors) {

            _pxls = [..._pxls];
            _pxl_colors = [..._pxl_colors];

            // Work with Hashtables and Typed Array so it is fast
            let new_pxl_colors_object = {};
            let new_pxl_colors_object_length = 0;
            let new_pxls = new Array(_pxls.length);

            _pxls.forEach((pxl, iteration) => {

                const color = _pxl_colors[pxl];
                let index_of_color = typeof new_pxl_colors_object[color] === "undefined" ? null: new_pxl_colors_object[color];

                if(index_of_color === null) {

                    index_of_color = new_pxl_colors_object_length;
                    new_pxl_colors_object[color] = index_of_color;
                    new_pxl_colors_object_length++;
                }

                new_pxls[iteration] = index_of_color;
            });

            let new_pxl_colors = new Array(new_pxl_colors_object_length);
            Object.entries(new_pxl_colors_object).forEach((entry) => {

                const [key, value] = entry;
                new_pxl_colors[value] = key;
            })

            return [new_pxls, new_pxl_colors];
        }

        let {
            pxls,
            pxl_colors,
            bucket_threshold,
            threshold_steps,
            color_number_bonus,
            best_color_number,
            this_state_bucket_threshold,
        } = data;

        let indexes_of_colors_proceed = new Set();
        let original_pxls = [...pxls];
        let original_pxl_colors = [...pxl_colors];
        let is_bucket_threshold_auto = bucket_threshold === "auto";
        let is_bucket_threshold_auto_goal_reached = !is_bucket_threshold_auto;
        let bucket_threshold_auto_goal_target = 6;
        let bucket_threshold_auto_goal_attempt = new Set();
        best_color_number = best_color_number !== null ? best_color_number: Math.max(Math.cbrt(original_pxl_colors.length) * (2/3) + color_number_bonus, 16);

        if(best_color_number < 2 || best_color_number > pxl_colors.length) {

            is_bucket_threshold_auto_goal_reached = true;
        }

        let attempt = 1;

        while (!is_bucket_threshold_auto_goal_reached || attempt === 1) {
            attempt++;

            bucket_threshold = is_bucket_threshold_auto ?
                1/(bucket_threshold_auto_goal_target - 2):
                bucket_threshold || this_state_bucket_threshold;
            threshold_steps = threshold_steps || Math.round(bucket_threshold * 255);
            const color_loss = (255 - (255 / (bucket_threshold * 255))) / 255;

            [original_pxls, original_pxl_colors] = [[...pxls], [...pxl_colors]];

            let reduced_pxl_colors = [...pxl_colors].map((color_hex) => {

                let [r, g, b, a] = this_get_rgba_from_hex(color_hex);

                r = this_reduce_color(r, 1 - color_loss);
                g = this_reduce_color(g, 1 - color_loss);
                b = this_reduce_color(b, 1 - color_loss);
                a = this_reduce_color(a, 1 - color_loss);

                return "#" + this_get_hex_value_from_rgb_value(r) + this_get_hex_value_from_rgb_value(g) + this_get_hex_value_from_rgb_value(b) + this_get_hex_value_from_rgb_value(a);

            });

            let [ new_pxls, new_pxl_colors ] = [original_pxls, reduced_pxl_colors];

            for (let i = 1; i <= threshold_steps; i += 1) {

                let threshold = bucket_threshold * (i / threshold_steps);
                const weight_applied_to_color_usage_difference = i / threshold_steps;

                indexes_of_colors_proceed.clear();
                let pxl_colors_usage = new Array(new_pxl_colors.length).fill(0);

                new_pxls.forEach((pxl) => {

                    pxl_colors_usage[pxl]++;
                });

                new_pxl_colors.forEach((color_a, index_of_color_a) => {

                    if(!indexes_of_colors_proceed.has(index_of_color_a)) {

                        const color_a_usage = pxl_colors_usage[index_of_color_a];

                        new_pxl_colors.forEach((color_b, index_of_color_b) => {

                            if(!indexes_of_colors_proceed.has(index_of_color_b)) {

                                const color_b_usage = pxl_colors_usage[index_of_color_b];
                                const color_a_more_used = color_a_usage > color_b_usage;

                                const color_usage_difference = color_a_more_used ? color_a_usage / color_b_usage: color_b_usage / color_a_usage;
                                const weighted_threshold = (threshold + (threshold * (1 - 1 / color_usage_difference) * weight_applied_to_color_usage_difference)) / (1 + weight_applied_to_color_usage_difference);

                                if(this_match_color(color_a, color_b, weighted_threshold)) {

                                    const color = color_a_more_used ?
                                        this_blend_colors(original_pxl_colors[index_of_color_a], original_pxl_colors[index_of_color_b], 1 / (color_usage_difference), true):
                                        this_blend_colors(original_pxl_colors[index_of_color_b], original_pxl_colors[index_of_color_a], 1 / (color_usage_difference), true);

                                    original_pxl_colors[index_of_color_a] = color;
                                    original_pxl_colors[index_of_color_b] = color;
                                    indexes_of_colors_proceed.add(index_of_color_a);
                                    indexes_of_colors_proceed.add(index_of_color_b);
                                }
                            }
                        });
                    }
                });

                [ new_pxls, new_pxl_colors ] = this_remove_duplicate_pxl_colors(new_pxls, original_pxl_colors);
                original_pxl_colors = new_pxl_colors;
            }

            if((original_pxl_colors.length + 2 > best_color_number && original_pxl_colors.length - 2 < best_color_number) || !is_bucket_threshold_auto || bucket_threshold_auto_goal_attempt.has(bucket_threshold_auto_goal_target)) {

                return this_remove_duplicate_pxl_colors(new_pxls, original_pxl_colors);
            }else if(original_pxl_colors.length > best_color_number){

                bucket_threshold_auto_goal_attempt.add(bucket_threshold_auto_goal_target);
                bucket_threshold_auto_goal_target --;
            }else {

                bucket_threshold_auto_goal_attempt.add(bucket_threshold_auto_goal_target);
                bucket_threshold_auto_goal_target ++;
            }
        }

        return [pxls, pxl_colors];
    }

    const p = new Parallel(JSON.parse(JSON.stringify({
        pxls,
        pxl_colors,
        bucket_threshold,
        threshold_steps,
        color_number_bonus,
        best_color_number,
        this_state_bucket_threshold,
    })));

    return p.spawn(process_function).then((results) => {

        console.log(results);
        [pxls, pxl_colors] = results;
        return this._remove_duplicate_pxl_colors(pxls, pxl_colors);
    });
};