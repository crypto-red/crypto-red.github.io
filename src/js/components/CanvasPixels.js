/*
The MIT License (MIT)

Copyright (c) 2021 Vipertech
Copyright (c) 2021 Crypto red

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

let raf =
    window.oRequestAnimationFrame      ||
    window.mozRequestAnimationFrame    ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

let caf =
    window.oCancelAnimationFrame      ||
    window.mozCancelAnimationFrame    ||
    window.webkitCancelAnimationFrame ||
    window.msCancelAnimationFrame;

window.caf_id = null;
window.last_raf_time = Date.now()

window.animLoop = ( render ) => {

    function loop() {

        let now = Date.now();
        let running = false;

        let deltaT = now - window.last_raf_time;
        // do not render frame when deltaT is too high
        if ( deltaT > 160 ) {
            running = true;
        }

        if ( window.caf_id === null ) {

            window.caf_id = raf(render);
            window.last_raf_time = now;

        }else if(!running){

            render();
            window.caf_id = null;
            window.last_raf_time = now;

        }else if(running && caf_id !== null){

            window.caf_id = raf(render);
            window.last_raf_time = now;
        }else {

            setTimeout(loop(), 16);
        }
    }
    loop();
};

import React from "react";

class CanvasPixels extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            className: props.className || null,
            tool: props.tool || "PENCIL",
            select_mode: props.select_mode || "REPLACE",
            pencil_mirror_mode: props.pencil_mirror_mode || "NONE",
            hue: props.hue || 0,
            pxl_width: props.pxl_width || 32,
            pxl_height: props.pxl_height || 32,
            pxl_current_color: props.pxl_current_color || "#00000000",
            pxl_current_opacity: props.pxl_current_opacity || 1,
            bucket_threshold: props.bucket_threshold || 0,
            color_loss: props.color_loss || 0.25,
            default_size: props.default_size || 96,
            max_size: props.max_size || props.default_size * 2 || 192,
            px_per_px: props.px_per_px || 1,
            fast_drawing: props.fast_drawing || false,
            canvas_cursor: props.canvas_cursor || 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAAXNSR0IArs4c6QAAAFxJREFUSIntlkEKACEQw6b7/z/Hq7cdqeAcmrtJQRCrDACc824YZ8B3cU/iiSc+M27x7IULDqrq3Z0kdaVdnwA6XqA14Mh3svTXuA246QtzyB8u8cQTHx23cF+4BaK1P/6WF9EdAAAAAElFTkSuQmCC") 15 15, auto',
            canvas_border_radius: props.canvas_border_radius || 0,
            canvas_wrapper_background_color: props.canvas_wrapper_background_color || "#ffffff",
            canvas_wrapper_border_radius: props.canvas_wrapper_border_radius || 4,
            canvas_wrapper_padding: props.canvas_wrapper_padding || 72,
            show_original_image_in_background: typeof props.show_original_image_in_background === "undefined" ? true: props.show_original_image_in_background,
            show_transparent_image_in_background: typeof props.show_transparent_image_in_background === "undefined" ? true: props.show_transparent_image_in_background,
            hide_canvas_content: props.hide_canvas_content || false,
            default_scale: props.default_scale || 0.75,
            scale: props.scale || props.default_scale || 0.75,
            scale_move_x: 0,
            scale_move_y: 0,
            _scale_move_timestamp: 0,
            _previous_scale_move_x: 0,
            _previous_scale_move_y: 0,
            _previous_scale_move_timestamp: 0,
            _moves_speeds: [],
            _moves_speed_average_now: 1,
            mine_player_direction: props.mine_player_direction || "UP",
            _mine_index: null,
            _previous_mine_player_index: null,
            _mine_player_index: null,
            _pencil_mirror_index: -1,
            _previous_pencil_mirror_axes_indexes: new Set(),
            _previous_pencil_mirror_axes_hover_indexes: new Set(),
            _is_there_new_dimension: false,
            _was_canvas_content_hidden: false,
            _base64_original_images: [],
            _original_image_index: -1,
            _old_layers: [{id: Date.now(), name: "Layer 0", hidden: false, opacity: 1, data: {}}],
            _layers: [{id: Date.now(), name: "Layer 0", hidden: false, opacity: 1, data: {}}],
            _layer_index: 0,
            _s_pxl_colors: [["#00000000"]],
            _old_pxl_colors: ["#00000000"],
            _s_pxls: [new Array(props.pxl_width * props.pxl_height).fill(0)],
            _old_pxls: new Array(props.pxl_width * props.pxl_height).fill(0),
            _json_state_history: `{"previous_history_position": 0, "history_position": 0, "state_history": []}`,
            _old_pxl_width: 0,
            _old_pxl_height: 0,
            _pxls_hovered: null,
            _old_pxls_hovered: null,
            _canvas: null,
            _canvas_container: null,
            _canvas_wrapper: null,
            _canvas_wrapper_overflow: null,
            _mouse_down: false,
            _state_history_length: 42,
            _last_action_timestamp: Date.now(),
            _last_paint_timestamp: Date.now(),
            _lazy_lazy_compute_time_ms: 10 * 1000,
            _undo_buffer_time_ms: 500,
            _mouse_inside: false,
            _paint_hover_old_pxls_snapshot: new Array(props.pxl_width * props.pxl_height).fill(0),
            _select_hover_old_pxls_snapshot: [],
            _paint_or_select_hover_actions_latest_index: -1,
            _paint_or_select_hover_pxl_indexes: new Set(),
            _shape_index_a: -1,
            _select_shape_index_a: -1,
            _shape_index_b: -1,
            _select_shape_index_b: -1,
            _pxl_indexes_of_old_shape: new Set(),
            _pxl_indexes_of_selection: new Set(),
            _pxl_indexes_of_selection_drawn: new Set(),
            _imported_image_previous_start_x: 0,
            _imported_image_previous_start_y: 0,
            _imported_image_start_x: 0,
            _imported_image_start_y: 0,
            _imported_image_pxls: [],
            _imported_image_width: 0,
            _imported_image_height: 0,
            _imported_image_scale_delta_x: 0,
            _imported_image_scale_delta_y: 0,
            _imported_image_previous_scale_delta_x: 0,
            _imported_image_previous_scale_delta_y: 0,
            _is_on_resize_element: false,
            _imported_image_pxl_colors: [],
            _is_image_import_mode: false,
            _previous_imported_image_pxls_positioned: [],
            _previous_image_imported_resizer_index: -1,
            _pxls_explosion: [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,0,3,0,0,0,2,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,2,1,2,1,0,1,0,0,0,0,0,0,0,1,2,3,1,1,0,0,0,1,0,0,0,0,1,1,3,2,0,0,1,2,3,1,1,0,0,0,0,1,0,2,2,1,0,1,2,0,1,0,0,0,0,0,0,1,1,0,1,2,0,2,0,0,0,0,0,0,0,0,0,0,1,1,3,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,2,1,2,2,0,0,0,0,0,0,0,0,0,1,2,0,1,3,2,1,1,0,0,0,0,0,0,0,1,3,3,4,3,3,2,0,1,0,0,0,0,0,1,1,2,3,3,1,1,4,1,1,1,1,0,0,1,0,2,3,3,1,3,1,3,3,2,0,1,0,0,1,1,2,2,3,3,4,3,3,3,2,1,0,0,0,0,0,1,3,2,2,2,3,3,2,2,0,0,0,0,0,0,0,3,3,1,1,2,3,3,1,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,1,1,0,0,0,0,0,0,0,0,1,2,2,3,4,2,1,0,0,0,0,0,1,1,1,1,3,3,3,4,4,3,1,1,0,0,0,1,1,2,2,4,4,3,4,3,3,3,1,0,0,0,1,2,3,3,4,3,3,3,4,4,3,1,1,0,1,2,2,3,3,3,3,3,4,4,2,1,2,1,1,1,2,3,3,4,5,4,3,4,2,3,3,2,1,1,1,2,3,4,4,5,5,3,3,2,3,4,2,1,1,0,1,2,4,4,3,2,3,4,3,4,5,4,1,0,0,0,0,1,2,3,2,3,4,4,4,4,3,1,0,0,0,0,1,1,1,1,4,5,3,1,2,3,1,0,0,0,0,0,1,2,3,2,3,2,1,1,1,1,0,0,0,0,0,1,1,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,1,1,0,0,0,0,0,0,0,0,1,2,2,3,4,2,1,0,0,0,0,0,1,1,1,1,3,3,3,4,4,3,1,1,0,0,0,1,1,2,2,4,4,3,4,3,3,3,1,0,0,0,1,2,3,3,4,3,3,3,4,4,3,1,1,0,1,2,2,3,3,3,3,3,4,4,2,1,2,1,1,1,2,3,3,4,5,4,3,4,2,3,3,2,1,1,1,2,3,4,4,5,5,3,3,2,3,4,2,1,1,0,1,2,4,4,3,2,3,4,3,4,5,4,1,0,0,0,0,1,2,3,2,3,4,4,4,4,3,1,0,0,0,0,1,1,1,1,4,5,3,1,2,3,1,0,0,0,0,0,1,2,3,2,3,2,1,1,1,1,0,0,0,0,0,1,1,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
                [0,0,0,1,1,1,0,2,1,1,1,0,0,0,0,1,1,0,1,3,0,2,2,2,3,1,0,1,1,0,1,3,0,2,2,2,2,0,2,2,2,2,3,1,0,0,2,2,2,0,0,0,0,2,2,0,0,2,2,0,0,2,1,1,0,0,0,0,0,0,0,0,2,0,0,2,0,1,4,0,0,0,0,0,0,0,0,2,1,1,2,2,2,0,0,0,0,0,0,0,0,0,2,3,1,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,2,0,0,0,0,0,0,5,1,0,0,0,0,1,3,2,0,0,0,0,0,0,1,1,0,2,2,0,1,1,2,2,0,0,0,0,0,0,0,0,2,2,0,0,2,0,2,0,0,0,0,0,0,0,2,2,3,1,0,2,2,2,0,0,2,2,2,2,2,2,0,1,1,0,0,2,1,3,2,0,2,2,2,3,1,2,0,0,2,0,0,1,1,0,2,2,0,0,1,1,0,0,0],
                [0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,1,1,0,1,2,0,0,0,0,2,1,0,1,1,0,1,2,0,0,0,0,0,0,0,0,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1,0,0,0,0,1,2,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,2,0,0,0,0,0,2,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0],
                [0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],            ],
            _pxl_colors_explosion: [
                ["#00000000","#ff0000ff","#ff3a00ff","#ff8200ff"],
                ["#00000000","#ff0000ff","#ff3a00ff","#ff8200ff"],
                ["#00000000","#ff0000ff","#ff3a00ff","#ff8200ff","#ffc900ff"],
                ["#00000000","#ff0000ff","#ff3a00ff","#ff8200ff","#ffc900ff","#ffe900ff"],
                ["#00000000","#8a0000ff","#1a1a1aff","#ff0000ff","#808080ff","#ff8200ff","#ff3a00ff"],
                ["#00000000","#8a0000ff","#1a1a1aff","#ff0000ff","#ff8200ff","#ff3a00ff"],
                ["#00000000","#8a0000ff","#ff0000ff","#ff8200ff","#ff3a0099"],
                ["#00000000","#8a000066"],
            ],
            _explosion_started_timestamp: 0,
            _explosion_width: 15,
            _explosion_height: 15,
            _previous_explosion_pxls_positioned: [],
            _explosion_time: 750,
            _explosion_index: -1,
            _selection_pair_highlight: true,
            _old_selection_pair_highlight: true,
            _pointer_events: [],
            _latest_pointers_distance: 0,
            _latest_pointers_client_x_center: 0,
            _latest_pointers_client_y_center: 0,
            _previous_single_pointer_down_timestamp: 0,
            _previous_single_pointer_down_x_y: [-1, -1],
            _image_move_from: [-1, -1],
            _canvas_container_width: 0, 
            _canvas_container_height: 0,
            _updated_at: Date.now(),
            _screen_zoom_ratio: 1
        };
    };

    componentDidMount() {

        setInterval(() => {
            this._maybe_save_state();
        }, 250);

        setInterval(() => {
            this.set_move_speed_average_now();
        }, 200);

        setInterval(() => {
            this._maybe_update_mine_player();
        }, 1000 / 29.97);

        setInterval(() => {
            this._maybe_update_selection_highlight();
        }, 1000 * 2/5);

        const body_css =
            "body {"+
                "touch-action:none;"+
            "}";

        const pixelated_css =
            ".Canvas-Pixels, .Canvas-Wrapper, .MuiTouchRipple-root {"+
                "-ms-interpolation-mode: -webkit-optimize-contrast;" +
                "image-rendering: nearest-neighbor;" +
                "image-rendering: optimizeSpeed;" +
                "image-rendering: -moz-crisp-edges;" +
                "image-rendering: -webkit-optimize-contrast;" +
                "image-rendering: optimize-contrast;" +
                "image-rendering: -o-pixelated;" +
                "-ms-interpolation-mode: nearest-neighbor;" +
                "image-rendering: pixelated;" +
                "-ms-touch-action: none;" +
                "touch-action: none;"+
            "}";

        const canvas_wrapper_css =
            ".Canvas-Wrapper {"+
                "transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1) 50ms;"+
            "}"+
            ".Canvas-Wrapper.MOVE:not(.Canvas-Focused), .Canvas-Wrapper.PICKER:not(.Canvas-Focused) {"+
                "cursor: grab;"+
            "}"+
            ".Canvas-Wrapper.MOVE:active:not(.Canvas-Focused), .Canvas-Wrapper.PICKER:active:not(.Canvas-Focused) {"+
                "cursor: grabbing;"+
            "}";

        const canvas_style = document.createElement("style");
        canvas_style.innerHTML = body_css + pixelated_css + canvas_wrapper_css;
        document.head.appendChild(canvas_style);
        this._notify_layers_and_compute_thumbnails_change();

        window.addEventListener("resize", this._updated_dimensions.bind(this));
        this._updated_dimensions();
        this._update_canvas_container_size();
    }

    _updated_dimensions = () => {

        let w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            _width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            _height = w.innerHeight|| documentElement.clientHeight || body.clientHeight;

        this._update_canvas_container_size();
    }

    _maybe_update_mine_player = () => {

        const { tool } = this.state;

        if(tool === "MINE") {

            const {pxl_width, pxl_height} = this.state;
            let {_mine_index, _mine_player_index, mine_player_direction} = this.state;

            if(_mine_player_index === null) {

                _mine_player_index = Math.floor(Math.random() * ((pxl_width * pxl_height)-1));
                _mine_index = -1;

            }else {

                let mine_player_x = _mine_player_index % pxl_width;
                let mine_player_y = (_mine_player_index - mine_player_x) / pxl_width;

                switch (mine_player_direction) {

                    case "UP":
                        mine_player_y--;
                        break;
                    case "RIGHT":
                        mine_player_x++;
                        break;
                    case "DOWN":
                        mine_player_y++;
                        break;
                    case "LEFT":
                        mine_player_x--;
                        break;
                }

                mine_player_x = mine_player_x % pxl_width;
                mine_player_x = mine_player_x < 0 ? pxl_width + mine_player_x: mine_player_x;
                mine_player_y = mine_player_y % pxl_height;
                mine_player_y = mine_player_y < 0 ? pxl_height + mine_player_y: mine_player_y;

                _mine_player_index = mine_player_x + mine_player_y * pxl_width;

                if(_mine_index === _mine_player_index) {

                    this.setState({_explosion_started_timestamp: Date.now(), _explosion_index: _mine_index});
                    this._notify_game_end();
                }
            }

            this.setState({
                _mine_player_index,
                _mine_index
            }, () => {

                this._update_canvas();
            });

        }

    };

    _maybe_update_selection_highlight = () => {

        const { tool, _is_image_import_mode } = this.state;

        if(tool.toUpperCase().includes("SELECT") || _is_image_import_mode) {

            this.setState({_selection_pair_highlight: !this.state._selection_pair_highlight}, () => {

                this._update_canvas();
            });
        }

    };

    componentWillReceiveProps(new_props) {

        if(this.state.tool === "MINE" && new_props.tool !== "MINE") {

            this.setState({_mine_player_index: null, _mine_index: null}, () => {

                this._update_canvas();
            });
        }

        if(this.state.pencil_mirror_mode !== "NONE" && new_props.pencil_mirror_mode === "NONE" || (this.state.tool.includes("PENCIL") && !new_props.tool.includes("PENCIL"))) {

            this.setState({_pencil_mirror_index: -1}, () => {

                this._update_canvas();
            });
        }

        if(this.state.tool !== new_props.tool && !new_props.tool.includes("SELECT")) {

            this.setState({_pxl_indexes_of_selection: new Set(), _pxl_indexes_of_selection_drawn: new Set([...this.state._pxl_indexes_of_selection])}, () => {

                this._update_canvas();
            });
        }

        if(this.state.pxl_width !== new_props.pxl_width || this.state.pxl_height !== new_props.pxl_height) {

            this.setState({
                _pxl_indexes_of_selection: new Set(),
                _layers: [{id: Date.now(), name: "Layer 0", hidden: false, opacity: 1, data: {}}],
                _layer_index: 0,
                _s_pxls: [new Array(new_props.pxl_width * new_props.pxl_height).fill(0)],
                _old_pxls: new Array(new_props.pxl_width * new_props.pxl_height).fill(0),
                _s_pxl_colors: [["#00000000"]],
                _old_pxl_colors: ["#00000000"],
            }, () => {

                this._update_screen_zoom_ratio();
            });
        }


        if(
            this.state.pxl_width !== new_props.pxl_width || this.state.pxl_height !== new_props.pxl_height ||
            this.state.hide_canvas_content !== new_props.hide_canvas_content ||
            this.state.pencil_mirror_mode !== new_props.pencil_mirror_mode ||
            this.state.tool !== new_props.tool
        ) {

            this.setState(new_props, () =>{

                this._update_canvas();
                this._request_force_update();
            });
        }else {

            this.setState(new_props);
        }
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {

        return false;
    }

    force_click = () => {

        this._handle_canvas_mouse_down(null, 1);
    };

    zoom_of = (of = 1, page_x = null, page_y = null, move_x = 0, move_y = 0) => {

        let { scale, scale_move_x, scale_move_y, _canvas_wrapper_overflow, _canvas_container, _canvas_wrapper } = this.state;

        let new_scale = scale * of;

        if(!(new_scale > 6) && !(new_scale < 1/6)) {

            let ratio = 1 - scale / new_scale;
            let ratio2 = new_scale / scale;

            let pos_x_in_canvas_container, pos_y_in_canvas_container;

            if(page_x !== null && page_y !== null) {

                let _canvas_container_rect = _canvas_container.getBoundingClientRect();

                pos_x_in_canvas_container = (page_x - _canvas_container_rect.x);
                pos_y_in_canvas_container = (page_y - _canvas_container_rect.y);
            }else {

                pos_x_in_canvas_container = _canvas_container.clientWidth / 2;
                pos_y_in_canvas_container = _canvas_container.clientHeight / 2;
            }

            let new_scale_move_x = (scale_move_x - (pos_x_in_canvas_container * ratio)) * ratio2 + move_x;
            let new_scale_move_y = (scale_move_y - (pos_y_in_canvas_container * ratio)) * ratio2 + move_y;

            this.setState({
                scale: new_scale,
                _moves_speed_average_now: of !== 1 ? 6: this.state._moves_speed_average_now,
            }, () => {

                let { _canvas_wrapper } = this.state;

                const for_middle_x = (_canvas_container.clientWidth - _canvas_wrapper.offsetWidth) / 2;
                const for_middle_y = (_canvas_container.clientHeight - _canvas_wrapper.offsetHeight) / 2;

                const scale_move_x_max = -128 + _canvas_container.clientWidth - (_canvas_container.clientWidth - _canvas_wrapper.offsetWidth) / 2;
                const scale_move_y_max = -128 + _canvas_container.clientHeight - (_canvas_container.clientHeight - _canvas_wrapper.offsetHeight) / 2;

                new_scale_move_y -= for_middle_y;
                new_scale_move_x -= for_middle_x;

                let new_scale_move_x_rigged = (Math.min(Math.abs(new_scale_move_x), scale_move_x_max)) * (new_scale_move_x < 0 ? -1: 1) + for_middle_x;
                let new_scale_move_y_rigged = (Math.min(Math.abs(new_scale_move_y), scale_move_y_max)) * (new_scale_move_y < 0 ? -1: 1) + for_middle_y;

                this._set_moves(new_scale_move_x_rigged, new_scale_move_y_rigged);
            });
        }
    };

    current_layer_up = () => {

        let { _layers, _layer_index, _s_pxl_colors, _s_pxls } = this.state;

        if(_layer_index < _layers.length-1) {

            _layers.splice(_layer_index+1, 0, _layers.splice(_layer_index, 1)[0]);
            _s_pxl_colors.splice(_layer_index+1, 0, _s_pxl_colors.splice(_layer_index, 1)[0]);
            _s_pxls.splice(_layer_index+1, 0, _s_pxls.splice(_layer_index, 1)[0]);


            this.setState({_layers, _s_pxl_colors, _s_pxls, _layer_index: _layer_index +1}, () => {

                this._update_canvas();
                this._notify_layers_and_compute_thumbnails_change();
            });
        }
    };

    current_layer_down = () => {

        let { _layers, _layer_index, _s_pxl_colors, _s_pxls } = this.state;

        if(_layer_index > 0) {

            _layers.splice(_layer_index-1, 0, _layers.splice(_layer_index, 1)[0]);
            _s_pxl_colors.splice(_layer_index-1, 0, _s_pxl_colors.splice(_layer_index, 1)[0]);
            _s_pxls.splice(_layer_index-1, 0, _s_pxls.splice(_layer_index, 1)[0]);


            this.setState({_layers, _s_pxl_colors, _s_pxls, _layer_index: _layer_index -1}, () => {

                this._update_canvas();
                this._notify_layers_and_compute_thumbnails_change();
            });
        }
    };

    new_layer = (at_index) => {

        const {pxl_width, pxl_height} = this.state;
        let { _layers, _s_pxl_colors, _s_pxls } = this.state;
        at_index = typeof at_index === "undefined" ? _s_pxl_colors.length: at_index;

        _s_pxl_colors.splice(at_index, 0, ["#00000000"]);
        _s_pxls.splice(at_index, 0, new Array(pxl_width * pxl_height).fill(0));
        _layers.splice(at_index, 0, {id: Date.now(), name: `Layer ${at_index}`, hidden: false, opacity: 1, data: {}});

        this.setState({
            _layers,
            _layer_index: at_index,
            _s_pxl_colors,
            _old_pxl_colors: ["#00000000"],
            _s_pxls,
            _old_pxls: new Array(pxl_width * pxl_height).fill(0),
            _last_action_timestamp: Date.now(),
        }, () => {

            this._notify_layers_and_compute_thumbnails_change();
        });
    };

    duplicate_layer = (at_index) => {

        const {pxl_width, pxl_height} = this.state;
        let { _layers, _s_pxl_colors, _s_pxls } = this.state;
        at_index = typeof at_index === "undefined" ? _s_pxl_colors.length: at_index;

        _s_pxl_colors.splice(at_index + 1, 0, [..._s_pxl_colors[at_index]]);
        _s_pxls.splice(at_index + 1, 0, [..._s_pxls[at_index]]);
        _layers.splice(at_index + 1, 0, {
            id: Date.now(),
            name: `${_layers[at_index].name} (copy)`,
            hidden: _layers[at_index].hidden,
            opacity: _layers[at_index].opacity,
            data: _layers[at_index].data,
            thumbnail: _layers[at_index].thumbnail
        });

        this.setState({
            _layers,
            _layer_index: at_index + 1,
            _s_pxl_colors,
            _old_pxl_colors: ["#00000000"],
            _s_pxls,
            _old_pxls: new Array(pxl_width * pxl_height).fill(0),
            _last_action_timestamp: Date.now(),
        }, () => {

            this._notify_layers_change();
        });

    };

    delete_layer = (at_index) => {

        const { pxl_width, pxl_height } = this.state;
        let { _layers, _s_pxl_colors, _s_pxls, _layer_index } = this.state;

        if(_layers.length > 1) {

            _s_pxl_colors.splice(at_index, 1);
            _s_pxls.splice(at_index, 1);
            _layers.splice(at_index, 1);

            _layer_index = at_index-1;
            _layer_index = _layer_index < 0 ? 0: _layer_index;

            this.setState({
                _layers,
                _layer_index,
                _s_pxl_colors,
                _old_pxl_colors: _s_pxl_colors[_layer_index],
                _s_pxls,
                _old_pxls: _s_pxls[_layer_index],
                _last_action_timestamp: Date.now(),
            }, () => {

                this._update_canvas();
                this._notify_layers_change();
            });
        }

    };

    change_active_layer = (at_index) => {

        const { pxl_width, pxl_height, _s_pxl_colors, _s_pxls } = this.state;

        this.setState({
            _layer_index: at_index,
            _old_pxl_colors: _s_pxl_colors[at_index],
            _old_pxls: _s_pxls[at_index],
            _last_action_timestamp: Date.now(),
        }, () => {

            this._notify_layers_change();
        });
    };

    toggle_layer_visibility = (at_index) => {

        let { _layers } = this.state;

        let layer = {..._layers[at_index]};
        layer.hidden = !layer.hidden;

        _layers[at_index] = layer;

        this.setState({
            _layers
        }, () => {

            this._update_canvas();
            this._notify_layers_change();
        });
    };

    change_layer_opacity = (at_index, opacity) => {

        let { _layers } = this.state;

        let layer = {..._layers[at_index]};
        layer.opacity = opacity;

        _layers[at_index] = layer;

        this.setState({
            _layers
        }, () => {

            this._update_canvas();
            this._notify_layers_and_compute_thumbnails_change();
        });
    };

    merge_down_layer = (at_index) => {

        let { _layers, _s_pxls, _s_pxl_colors } = this.state;

        _layers = [..._layers];
        _s_pxls = [..._s_pxls];
        _s_pxl_colors = [..._s_pxl_colors];

        const { pxl_width, pxl_height } = this.state;

        if(typeof _layers[at_index] !== "undefined" && typeof _layers[at_index - 1] !== "undefined") {

            const new_layer = {
                id: Date.now(),
                name: `Merged layers ${at_index}+${at_index-1}`,
                hidden: _layers[at_index].hidden &&  _layers[at_index-1].hidden,
                data: {},
                opacity: 1
            };

            let new_layer_pxls = new Array(pxl_width * pxl_height);
            let new_layer_pxl_colors = [];

            const top_layer_pxls = _s_pxls[at_index];
            const bottom_layer_pxls = _s_pxls[at_index - 1];

            const top_layer_pxl_colors = _s_pxl_colors[at_index];
            const top_layer_opacity = _layers[at_index].opacity;
            const bottom_layer_pxl_colors = _s_pxl_colors[at_index - 1];
            const bottom_layer_opacity = _layers[at_index - 1].opacity;

            bottom_layer_pxls.forEach((pxl, pxl_index) => {

                const top_layer_pxl_color_index = top_layer_pxls[pxl_index];
                const top_layer_pxl_color = top_layer_pxl_colors[top_layer_pxl_color_index];
                const bottom_layer_pxl_color = bottom_layer_pxl_colors[pxl];

                let new_layer_pxl_color = this._blend_colors("#00000000", bottom_layer_pxl_color, bottom_layer_opacity, false);
                new_layer_pxl_color = this._blend_colors(new_layer_pxl_color, top_layer_pxl_color, top_layer_opacity, false);

                if(!new_layer_pxl_colors.includes(new_layer_pxl_color)) {

                    new_layer_pxl_colors.push(new_layer_pxl_color);
                }

                const new_layer_pxl_color_index = new_layer_pxl_colors.indexOf(new_layer_pxl_color);
                new_layer_pxls[pxl_index] = new_layer_pxl_color_index;
            });

            _layers.splice(at_index-1, 2, new_layer);
            _s_pxls.splice(at_index-1, 2, new_layer_pxls);
            _s_pxl_colors.splice(at_index-1, 2, new_layer_pxl_colors);

            this.setState({
                _layer_index: at_index-1,
                _layers,
                _s_pxls,
                _old_pxls: new Array(pxl_width * pxl_height).fill(-1),
                _s_pxl_colors,
                _old_pxl_colors: [],
                _last_action_timestamp: Date.now(),
            }, () => {

                this._notify_layers_and_compute_thumbnails_change();
                this._update_canvas();
            });

        }
    };

    _notify_game_end = () => {

        if(this.props.onGameEnd) {

            this.props.onGameEnd();
        }

    };

    _notify_layers_change = () => {

        if(this.props.onLayersChange) {

            const { _layer_index, _layers, _s_pxl_colors } = this.state;

            this.props.onLayersChange(_layer_index, JSON.stringify(_layers.map((layer, index) => {

                layer.colors = _s_pxl_colors[index].slice(0, 128);
                return layer;
            })));
            this._notify_estimate_size();
        }
    };

    _notify_layers_and_compute_thumbnails_change = () => {

        const { _json_state_history } = this.state;
        const { previous_history_position, history_position, state_history } = JSON.parse(_json_state_history);

        let { _layers } = this.state;

        _layers = _layers.map((layer, index) => {

            if(previous_history_position !== history_position) {

                if(typeof state_history[previous_history_position]._layers[index] !== "undefined" && typeof state_history[history_position]._layers[index] !== "undefined") {

                    if(
                        state_history[previous_history_position]._s_pxls[index] !== state_history[history_position]._s_pxls[index] ||
                        state_history[previous_history_position]._s_pxl_colors[index] !== state_history[history_position]._s_pxl_colors[index] ||
                        state_history[previous_history_position]._layers[index].opacity !== state_history[history_position]._layers[index].opacity ||
                        state_history[previous_history_position]._layers[index].hidden !== state_history[history_position]._layers[index].hidden ||
                        state_history[previous_history_position]._layers[index].id !== state_history[history_position]._layers[index].id
                    ) {

                        layer.thumbnail = this.get_layer_base64_png_data_url(index);
                        layer.data = this.get_layer_data(index);
                    }
                }else {

                    layer.thumbnail = this.get_layer_base64_png_data_url(index);
                    layer.data = this.get_layer_data(index);
                }
            }else if(parseInt(history_position) === 0) {

                layer.thumbnail = this.get_layer_base64_png_data_url(index);
                layer.data = this.get_layer_data(index);
            }

            return layer;
        });

        this.setState({_layers}, () => {

            this._notify_layers_change();
        });

    };

    get_layer_data = (layer_index) => {

        const { _s_pxl_colors } = this.state;

        return {
            number_of_color: _s_pxl_colors[layer_index].length
        };
    };

    get_layer_base64_png_data_url(layer_index) {

        const { pxl_width, pxl_height, _s_pxl_colors, _s_pxls } = this.state;
        const scale = 1;

        let canvas = document.createElement("canvas");
        canvas.width = pxl_width * scale;
        canvas.height = pxl_height * scale;

        let ctx = canvas.getContext('2d');

        _s_pxls[layer_index].forEach((pxl, index) => {

            const pixel_color_hex = _s_pxl_colors[layer_index][pxl];
            const pos_x = index % pxl_width;
            const pos_y = (index - pos_x) / pxl_width;

            ctx.fillStyle = pixel_color_hex;
            ctx.fillRect(pos_x * scale, pos_y * scale, 1 * scale, 1 * scale);
        });

        return canvas.toDataURL();
    };

    _pxls_to_png = (pxls, pxl_colors, scale) => {

        const { pxl_width, pxl_height } = this.state;
        let canvas = document.createElement("canvas");
        canvas.width = pxl_width * scale;
        canvas.height = pxl_height * scale;

        let ctx = canvas.getContext('2d');

        pxls.forEach((pxl, index) => {

            const pixel_color_hex = pxl_colors[pxl];

            const pos_x = index % pxl_width;
            const pos_y = (index - pos_x) / pxl_width;

            ctx.fillStyle = pixel_color_hex;
            ctx.fillRect(pos_x * scale, pos_y * scale, 1 * scale, 1 * scale);
        });

        return canvas.toDataURL();

    };

    get_base64_png_data_url(scale) {


        const { pxl_width, pxl_height, _s_pxl_colors, _layers, _layer_index, _s_pxls } = this.state;

        let canvas = document.createElement("canvas");
        canvas.width = pxl_width * scale;
        canvas.height = pxl_height * scale;

        let ctx = canvas.getContext('2d');

        _s_pxls[0].forEach((pxl, index) => {

            let layer_pixel_colors = [];
            let start_i = -1;
            start_i++;

            for (let i = _s_pxl_colors.length - 1; i >= 0; i--) {

                const layer_pixel_color = _s_pxl_colors[i][_s_pxls[i][index]];
                layer_pixel_colors[i] = layer_pixel_color;
                const [r, g, b, a] = layer_pixel_color;

                if(a === 255) {

                    start_i = i;
                    break;
                }

            }

            let pixel_color_hex = "#00000000";

            for (let i = start_i; i < _s_pxl_colors.length ; i++) {

                if(!_layers[i].hidden) {

                    const layer_pixel_color = layer_pixel_colors[i];

                    pixel_color_hex = this._blend_colors(pixel_color_hex, layer_pixel_color, _layers[i].opacity, false);
                }
            }

            const pos_x = index % pxl_width;
            const pos_y = (index - pos_x) / pxl_width;

            ctx.fillStyle = pixel_color_hex;
            ctx.fillRect(pos_x * scale, pos_y * scale, 1 * scale, 1 * scale);
        });

        return canvas.toDataURL();

    }

    _format_color = (color) => {

        color = typeof color === "undefined" ? "#00000000": color;

        // if color equals #fff -> #ffffff
        color = color.length === 4 ? "#" + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3): color;

        // if color equals #3333 -> #33333333
        color = color.length === 5 ? "#" + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3) + color.charAt(4) + color.charAt(4): color;

        // if color equals #000000 -> #000000ff (Alpha)
        color = color.length === 7 ? color + "ff": color;

        return color;

    }

    _reduce_color = (rgba_component, color_gain ) => {

        if(color_gain === 1) {

            return rgba_component;
        }else {

            rgba_component++;
            let comp_by_gain = Math.round(rgba_component * color_gain) - 1;
            comp_by_gain = comp_by_gain < 0 ? 0: comp_by_gain;

            return Math.round(comp_by_gain / color_gain);
        }
    }

    _get_pixels_palette_and_list_from_image_data = (image_data, force_full_compute = false, color_loss = 0, color_loss_bw = true) => {

        const { max_size, _lazy_lazy_compute_time_ms } = this.state;

        const too_much_pixel_cpu_would_go_brrrrr = image_data.data.length / 4 > (max_size * max_size); // Can be three time bigger than the default max convert size
        const color_gain = 1 - color_loss;


        const _get_color_hex_from_image_data_r_index = (image_data, index, color_gain = 1, color_loss_bw = true) => {

            if(!color_loss_bw && image_data.data[index] === image_data.data[index + 1] && image_data.data[index + 1] === image_data.data[index + 2]) {

                color_gain = 1;
            }

            let r = this._reduce_color(image_data.data[index], color_gain).toString(16);
            let g = this._reduce_color(image_data.data[index+1], color_gain).toString(16);
            let b = this._reduce_color(image_data.data[index+2], color_gain).toString(16);
            let a = this._reduce_color(image_data.data[index+3], color_gain).toString(16);

            r = r.length === 1 ? "0" + r: r;
            g = g.length === 1 ? "0" + g: g;
            b = b.length === 1 ? "0" + b: b;
            a = a.length === 1 ? "0" + a: a;

            let color_hex = "#" + r + g + b + a;

            color_hex = color_hex.toLowerCase();

            return color_hex;
        };

        let new_pxl_colors = [];
        let new_pxls;

        if(!too_much_pixel_cpu_would_go_brrrrr || force_full_compute) { // We can parse all pixel

            new_pxls = new Array(image_data.width * image_data.height);

            for (let i = 0; i < image_data.data.length; i += 4) {

                const color_hex = _get_color_hex_from_image_data_r_index(image_data, i, color_gain, color_loss_bw);

                // Push color hex in palette if necessary
                if (!new_pxl_colors.includes(color_hex)) {

                    new_pxl_colors.push(color_hex);
                }
                const color_hex_index = new_pxl_colors.indexOf(color_hex);
                new_pxls[i / 4] = color_hex_index;
            }

        }else { // We will only compute n LEVEL lines of pixel

            let start = Date.now();
            new_pxls = [];

            let skip_lines = 0;

            for (let line = 0; line < max_size; line++) {

                if(start + _lazy_lazy_compute_time_ms < Date.now()) { break }

                const first_pixel_in_this_row = Math.round(skip_lines) * image_data.width * 4;

                for (let i = 0; i < image_data.width * 4; i += 4) {

                    const color_hex = _get_color_hex_from_image_data_r_index(image_data,  i + first_pixel_in_this_row, color_gain);

                    // Push color hex in palette if necessary
                    if(!new_pxl_colors.includes(color_hex)) {

                        new_pxl_colors.push(color_hex);
                    }
                    const color_hex_index = new_pxl_colors.indexOf(color_hex);
                    new_pxls[(line * image_data.width) + (i / 4)] = color_hex_index;
                }

                skip_lines += image_data.height / max_size;
            }

        }

        return {
            too_much_pixel_cpu_would_go_brrrrr: too_much_pixel_cpu_would_go_brrrrr,
            ratio_pixel_per_color: new_pxls.length / new_pxl_colors.length,
            new_pxl_colors,
            new_pxls,
        };
    }

    _ctx_sharpen = (ctx, w, h, mix) => {
        var x, sx, sy, r, g, b, a, dstOff, srcOff, wt, cx, cy, scy, scx,
            weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
            katet = Math.round(Math.sqrt(weights.length)),
            half = (katet * 0.5) | 0,
            dstData = ctx.createImageData(w, h),
            dstBuff = dstData.data,
            srcBuff = ctx.getImageData(0, 0, w, h).data,
            y = h;

        while (y--) {
            x = w;
            while (x--) {
                sy = y;
                sx = x;
                dstOff = (y * w + x) * 4;
                r = 0;
                g = 0;
                b = 0;
                a = 0;

                for (cy = 0; cy < katet; cy++) {
                    for (cx = 0; cx < katet; cx++) {
                        scy = sy + cy - half;
                        scx = sx + cx - half;

                        if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                            srcOff = (scy * w + scx) * 4;
                            wt = weights[cy * katet + cx];

                            r += srcBuff[srcOff] * wt;
                            g += srcBuff[srcOff + 1] * wt;
                            b += srcBuff[srcOff + 2] * wt;
                            a += srcBuff[srcOff + 3] * wt;
                        }
                    }
                }

                dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
                dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
                dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
                dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
            }
        }

        ctx.putImageData(dstData, 0, 0);
    }

    _get_new_ctx_from_canvas = (width, height, pixelated = true, image_smoothing = "") => {

        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        let context = canvas.getContext('2d');
        //context.clearRect(0, 0, canvas.width, canvas.height);

        if(pixelated) {

            context.mozImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.msImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;

        }else if(image_smoothing.length) {

            context.imageSmoothingQuality = image_smoothing;
        }

        return [context, canvas];
    }

    copy_selection = () => {

        this.import_image_on_canvas_from_selection();
    };

    cut_selection = () => {

        this.import_image_on_canvas_from_selection();
        this.erase_selection();
        this.to_selection_none();
    };

    erase_selection = () => {

        let { _s_pxls, _s_pxl_colors, _layer_index, _pxl_indexes_of_selection, pxl_width, pxl_height } = this.state;

        if(_pxl_indexes_of_selection.size > 0) {

            if(!_s_pxl_colors[_layer_index].includes("#00000000")) {

                _s_pxl_colors[_layer_index].push("#00000000");
            }

            const transparent_color_index = _s_pxl_colors[_layer_index].indexOf("#00000000");

            _pxl_indexes_of_selection.forEach((pxl_index) => {

                const x = pxl_index % pxl_width;
                const y = (pxl_index - x) / pxl_width;

                _s_pxls[_layer_index][pxl_index] = transparent_color_index;
            });

            this.setState({
                _s_pxls,
                _s_pxl_colors,
                _last_action_timestamp: Date.now()
            }, () => {

                this._update_canvas();
            });
        }
    };

    import_image_on_canvas_from_selection = () => {

        let { _s_pxls, _s_pxl_colors, _layer_index, _pxl_indexes_of_selection, pxl_width, pxl_height } = this.state;

        if(_pxl_indexes_of_selection.size > 0) {

            let top_left = [pxl_width, pxl_height];
            let bottom_right = [-1, -1];

            _pxl_indexes_of_selection.forEach((pxl_index) => {

                const x = pxl_index % pxl_width;
                const y = (pxl_index - x) / pxl_width;

                if(x < top_left[0]) { top_left[0] = x }
                if(y < top_left[1]) { top_left[1] = y }

                if(x > bottom_right[0]) { bottom_right[0] = x }
                if(y > bottom_right[1]) { bottom_right[1] = y }

            });

            const new_width = 1 + bottom_right[0] - top_left[0];
            const new_height = 1 + bottom_right[1] - top_left[1];

            let pxls = _s_pxls[_layer_index];
            let new_pxls =  new Array(new_width * new_height);
            let new_pxl_colors = _s_pxl_colors[_layer_index];

            for (let i = 0; i < new_width * new_height; i++) {

                let x = i % new_width;
                let y = (i - x) / new_width;

                x += top_left[0];
                y += top_left[1];

                const index = y * pxl_width + x;

                if(_pxl_indexes_of_selection.has(index)) {

                    new_pxls[i] = pxls[index];
                }else {

                    if(!new_pxl_colors.includes("#00000000")) {

                        new_pxl_colors.push("#00000000");
                    }

                    new_pxls[i] = new_pxl_colors.indexOf("#00000000");
                }
            }

            [ new_pxls, new_pxl_colors ] = this._remove_duplicate_pxl_colors(new_pxls, new_pxl_colors);

            this.setState({
                _imported_image_start_x: top_left[0],
                _imported_image_start_y: top_left[1],
                _imported_image_scale_delta_x: 0,
                _imported_image_scale_delta_y: 0,
                _imported_image_pxls: new_pxls,
                _imported_image_width: new_width,
                _imported_image_height: new_height,
                _imported_image_pxl_colors: new_pxl_colors,

            }, () => {

                this._notify_image_import_complete();
                this._notify_is_image_import_mode();
                this._update_canvas();
            });
        }

    };

    import_image_on_canvas = (image_obj) => {

        if(this.props.onImageImport) {

            this.props.onImageImport();
        }

        setTimeout(() => {

            const { pxl_width, pxl_height } = this.state;

            // Draw the original image in an invisible canvas
            let width = image_obj.width;
            let height = image_obj.height;

            if(pxl_width > width && pxl_height > height) {

                let [canvas_ctx] = this._get_new_ctx_from_canvas(width, height, false);
                canvas_ctx.drawImage(image_obj, 0, 0, width, height);
                const image_data = canvas_ctx.getImageData(0, 0, width, height);
                const { new_pxl_colors, new_pxls } = this._get_pixels_palette_and_list_from_image_data(image_data, true);

                this.setState({
                    _imported_image_start_x: 0,
                    _imported_image_start_y: 0,
                    _imported_image_scale_delta_x: 0,
                    _imported_image_scale_delta_y: 0,
                    _imported_image_pxls: new_pxls,
                    _imported_image_width: width,
                    _imported_image_height: height,
                    _imported_image_pxl_colors: new_pxl_colors,

                }, () => {
                    this._notify_image_import_complete();
                    this._notify_is_image_import_mode();
                    this._update_canvas();
                });

            }

        }, 50);

    };

    _get_imported_image_scaled = (_imported_image_pxls, _imported_image_pxl_colors, _imported_image_width, _imported_image_height, _imported_image_scale_delta_x, _imported_image_scale_delta_y) => {


        if(_imported_image_pxls.length) {

            let [canvas_ctx, canvas] = this._get_new_ctx_from_canvas(_imported_image_width, _imported_image_height, true);


            _imported_image_pxls.forEach((pxl, index) => {

                const pos_x = index % _imported_image_width;
                const pos_y = (index - pos_x) / _imported_image_width;

                const color = _imported_image_pxl_colors[pxl];
                canvas_ctx.fillStyle = color;
                canvas_ctx.fillRect(pos_x, pos_y, 1, 1);
            });

            const scaled_width = _imported_image_width + _imported_image_scale_delta_x;
            const scaled_height = _imported_image_height + _imported_image_scale_delta_y;

            let [canvas_resized_ctx] = this._get_new_ctx_from_canvas(scaled_width, scaled_height, true);
            canvas_resized_ctx.drawImage(canvas, 0, 0, _imported_image_width, _imported_image_height, 0, 0, scaled_width, scaled_height);
            const resized_image_data = canvas_resized_ctx.getImageData(0, 0, scaled_width, scaled_height);
            const { new_pxls, new_pxl_colors } = this._get_pixels_palette_and_list_from_image_data(resized_image_data, true);
            return [ new_pxls, new_pxl_colors, scaled_width, scaled_height ];

        }else {

            return [_imported_image_pxls, _imported_image_pxl_colors, _imported_image_width, _imported_image_height];
        }
    };

    set_canvas_from_image = (image_obj) => {

        if(this.props.onImageLoad) {

            this.props.onImageLoad();
        }

        setTimeout(() => {

            const { default_size, max_size, color_loss, _base64_original_images, _original_image_index } = this.state;

            // Draw the original image in an invisible canvas
            let width = image_obj.width;
            let height = image_obj.height;

            let [canvas_ctx, canvas] = this._get_new_ctx_from_canvas(width, height, false);
            canvas_ctx.drawImage(image_obj, 0, 0, width, height);

            const image_data = canvas_ctx.getImageData(0, 0, width, height);

            // From the result in colors and pixels color index find if the image is resized bigger but from a pixelart image
            const merge_color_threshold = 3/16;
            let { new_pxl_colors, new_pxls, ratio_pixel_per_color, too_much_pixel_cpu_would_go_brrrrr } = this._get_pixels_palette_and_list_from_image_data(image_data, false, (256 - 256 / (merge_color_threshold * 256)) / 256);
            const base64_original_image = new_pxl_colors.indexOf("#00000000") !== -1 ? canvas.toDataURL("image/png"): canvas.toDataURL("image/jpeg");
            [ new_pxls, new_pxl_colors ] = this._remove_close_pxl_colors(new_pxls, new_pxl_colors, 3/16);
            ratio_pixel_per_color = new_pxls.length / new_pxl_colors.length;

            let a_better_scale = 1;
            let enough_sure = max_size * max_size > height * width;

            if(!enough_sure) {

                let best_min_occ = 1/0;
                let occ_list = [];
                let occ = 0;
                let last_occ = -1;

                occ_list[1] = 0;
                new_pxls.forEach((value, index) => {

                    // If like the last occurrence increment the min occurrence variable
                    if(last_occ === value || index === 0) {

                        occ++;
                    }else {

                        // If we found a smaller occurrence pattern that finished, the best one is this one
                        if(occ < best_min_occ) {

                            best_min_occ = occ;
                        }

                        // Reset occurrence to zero since there is a new pattern
                        occ_list[occ] = typeof occ_list[occ] !== "undefined" ? occ_list[occ] + 1 : 1;

                        occ = 1;
                    }

                    // Set the last occurrence the new one
                    last_occ = value;
                });

                let most_frequent_following_repetition_number_in_px = 1;
                let most_frequent_following_repetition_number_in_px_with_bonus = 1;
                let most_frequent_following_occurrence = 1;
                let most_frequent_following_repetition_number = 1;
                const ideal_size_percent_of_than_real_size = Math.sqrt((width * height) / (default_size * default_size));
                const occurrence_is_probably_lower_than = 32;

                Object.entries(occ_list).forEach((value, index) => {

                    let [occurrence, repetition_number] = value;
                    occurrence = parseInt(occurrence);

                    if(occurrence > occurrence_is_probably_lower_than) { return; }
                    // The bonus is computed so it prefer larger occurrence (up to 128px following themselves) because we could have a table with small lines, faded angle or even noise above square representing pixel
                    // The bigger the image is based on one dimension, the bigger the bonus will be since it best encourage big occurrences in big images
                    const occurrence_position_evaluation_on_max_occurrence = occurrence > occurrence_is_probably_lower_than ? 1: (occurrence_is_probably_lower_than+10) / (occurrence+10);
                    const occurrence_position_on_ideal_size_times_smaller = occurrence > occurrence_is_probably_lower_than ? 1: occurrence_position_evaluation_on_max_occurrence * ideal_size_percent_of_than_real_size;
                    const bonus_for_longer_occurrence_in_px = occurrence > occurrence_is_probably_lower_than ? 0: occurrence_position_on_ideal_size_times_smaller * Math.pow(occurrence, 1 + (1 - 1 / occurrence_position_evaluation_on_max_occurrence));

                    const is_better_repetition_number_in_px = most_frequent_following_repetition_number_in_px_with_bonus < (repetition_number * occurrence + bonus_for_longer_occurrence_in_px);

                    if(occurrence !== 1 && is_better_repetition_number_in_px) {

                        most_frequent_following_occurrence = occurrence;
                        most_frequent_following_repetition_number = repetition_number;
                        most_frequent_following_repetition_number_in_px = repetition_number * occurrence;
                        most_frequent_following_repetition_number_in_px_with_bonus = repetition_number * occurrence + bonus_for_longer_occurrence_in_px;

                    }

                });

                // We can check if the occurrence of only 1px is less than the most frequent following occurrence in total pixel size.
                // Yet the problem we face is that the X occurrence of Y pixel might be way smaller in a big image if there is 1px size line or annoying circle shape
                // So the solution is to multiply the total amount of pixel repeated in the best occurrence by the decrease of size ideally

                const most_frequent_following_occurrence_intelligent = most_frequent_following_repetition_number_in_px * ideal_size_percent_of_than_real_size * 4 > occ_list[1] ?
                    most_frequent_following_occurrence: 1;

                // Find if there is a gape: occurrence nearly not existing from the occurrence 1 to the occurrence X of which X is greater than length of occurrence 1
                let a_better_frequent_following_occurrence_intelligent = most_frequent_following_occurrence_intelligent;

                // If there is less times occurrence of one pixel than the biggest occurrence
                // We can deduce the gap if surpassing the number of 1px occurrence, the scale is so
                if(occ_list[1] < occ_list.length) {

                    let counter = 0;
                    while(true) {

                        if (typeof occ_list[counter] === "undefined" || occ_list[counter] === 0) {

                            counter++;
                        }else {

                            if(counter > occ_list[1]) {

                                a_better_frequent_following_occurrence_intelligent = counter;
                                enough_sure = true;
                            }

                            break;
                        }
                    }
                }

                // We have cheated the selection of occurrence with a bonus, now we check if there isn't an occurrence smaller which correlate
                let adjusted_following_occurrence = a_better_frequent_following_occurrence_intelligent;


                Object.entries(occ_list).forEach((entry, index) => {

                    let [key, value] = entry; // Key is the occurrence series and value the number of occurrence
                    key = parseInt(key);

                    if(index > 1 && value > occ_list[adjusted_following_occurrence] && key < a_better_frequent_following_occurrence_intelligent) {

                        adjusted_following_occurrence = key;
                    }
                });

                // We'll check if there is a near occurrence that match image width
                if(image_obj.width % adjusted_following_occurrence !== 0) {

                    let difference = 1;
                    while(
                        image_obj.width % (adjusted_following_occurrence + difference) !== 0 && image_obj.width % (adjusted_following_occurrence - difference) !== 0 &&
                        image_obj.height % (adjusted_following_occurrence + difference) !== 0 && image_obj.height % (adjusted_following_occurrence - difference) !== 0 &&
                        difference < 16
                        ) {

                        if(
                            image_obj.width % (adjusted_following_occurrence - difference) === 0 &&
                            image_obj.height % (adjusted_following_occurrence - difference) === 0) {

                            adjusted_following_occurrence -= difference;
                        }else if(
                            image_obj.width % (adjusted_following_occurrence + difference) === 0 &&
                            image_obj.height % (adjusted_following_occurrence + difference) === 0
                        ) {

                            adjusted_following_occurrence += difference;
                        }

                        difference++;

                    }
                }

                a_better_scale =  1 / adjusted_following_occurrence;
            }

            const a_better_scale_size = (height * a_better_scale) * (width * a_better_scale);
            const is_low_color_number_xor_small_enough = // Can be either 3 times less color and 3 times bigger or 2 times less color and 2 time bigger
                (ratio_pixel_per_color > 4 * 4 * Math.sqrt(a_better_scale_size) && a_better_scale_size <= (default_size * default_size) * 4) ||
                (ratio_pixel_per_color > 3 * 3 * Math.sqrt(a_better_scale_size) && a_better_scale_size <= (default_size * default_size) * 3) ||
                (ratio_pixel_per_color > 2 * 2 * Math.sqrt(a_better_scale_size) && a_better_scale_size <= (default_size * default_size) * 2) ||
                (ratio_pixel_per_color > 1 * 1 * Math.sqrt(a_better_scale_size) && a_better_scale_size <= (default_size * default_size) * 1);
            const is_big_enough = a_better_scale_size > new_pxl_colors.length;

            let is_crop_necessary = false;

            if(!is_low_color_number_xor_small_enough && !enough_sure || !is_big_enough) { // The image must be lowered

                let scale = 1;

                while (Math.round(width * scale) * Math.round(height * scale) > (default_size * default_size)) { // Decrement the scale until it fits the maximum size (limit)

                    scale -= 0.01;
                }


                width = width * scale;
                height = height * scale;
            }else {

                if(height * width > default_size * default_size) {

                    width *= a_better_scale;
                    height *= a_better_scale;
                    is_crop_necessary = true;
                }
            }

            let canvas_resized_ctx;

            if(is_crop_necessary) {

                let adjusted_following_occurrence = 1 / a_better_scale;

                const initial_width = width / a_better_scale;
                const initial_height = height / a_better_scale;

                const initial_width_cropped = initial_width - initial_width % adjusted_following_occurrence;
                const initial_height_cropped = initial_height - initial_height % adjusted_following_occurrence;

                const cropped_width = Math.floor(initial_width_cropped / adjusted_following_occurrence);
                const cropped_height = Math.floor(initial_height_cropped / adjusted_following_occurrence);

                const sw = initial_width_cropped;
                const sh = initial_height_cropped;
                const sx = Math.floor((initial_width - initial_width_cropped) / 2);
                const sy = Math.floor((initial_height - initial_height_cropped) / 2);

                width = Math.floor(cropped_width);
                height = Math.floor(cropped_height);

                [canvas_resized_ctx] = this._get_new_ctx_from_canvas(width, height, true);
                canvas_resized_ctx.drawImage(image_obj, sx, sy, sw, sh, 0, 0, width, height);

            }else {

                width = Math.floor(width);
                height = Math.floor(height);

                [canvas_resized_ctx] = this._get_new_ctx_from_canvas(width, height, true);
                canvas_resized_ctx.drawImage(image_obj, 0, 0, width, height);
            }

            const canvas_resized_image_data = canvas_resized_ctx.getImageData(0, 0, width, height);
            const new_pxl_data = this._get_pixels_palette_and_list_from_image_data(canvas_resized_image_data, true, 0);

            let full_new_pxl_colors = new_pxl_data.new_pxl_colors;
            let full_new_pxls = new_pxl_data.new_pxls;

            let new_base64_original_images = _base64_original_images;

            if(!new_base64_original_images.includes(base64_original_image)) {

                new_base64_original_images.push(base64_original_image);
            }

            const _layer_index = 0;
            let ns_pxl_colors = [];
            ns_pxl_colors[_layer_index] = full_new_pxl_colors;
            let ns_pxls = [];
            ns_pxls[_layer_index] = full_new_pxls;

            this.setState({
                pxl_width: width,
                pxl_height: height,
                _pxl_indexes_of_selection: new Set(),
                _base64_original_images: new_base64_original_images,
                _original_image_index: -1,
                _layers: [{id: Date.now(), name: "Layer 0", hidden: false, opacity: 1, data: {}}],
                _s_pxl_colors: ns_pxl_colors,
                _s_pxls: ns_pxls,
                _layer_index,
                _old_pxls_hovered: null,
                _pxls_hovered: null,
                _old_pxl_colors: [],
                _old_pxls: new Array(full_new_pxls.length).fill(-1),
                _is_there_new_dimension: true,
            }, () => {

                this._request_force_update(() => {

                    this.setState({_original_image_index: new_base64_original_images.indexOf(base64_original_image), _last_action_timestamp: Date.now()});
                    this._notify_size_change();
                    this._notify_layers_change();
                    this._update_canvas();
                    this._notify_image_load_complete();
                });
            });

        }, 50);

    };

    _set_canvas_ref = (element) => {

        if(element === null) {return}

        element.context2d = element.getContext("2d");

        element.addEventListener("mousemove", this._handle_canvas_mouse_move, {capture: false});
        element.addEventListener("mousedown", this._handle_canvas_mouse_down, {capture: false});
        element.addEventListener("mouseup", this._handle_canvas_mouse_up, {capture: false});
        element.addEventListener("mouseleave", this._handle_canvas_mouse_leave, {capture: false});

        this.setState({_canvas: element});
    };

    _set_canvas_container_ref = (element) => {

        if(element === null) {return}

        element.addEventListener("wheel", this._handle_canvas_container_wheel, {capture: false});
        element.addEventListener("pointerdown", this._handle_canvas_container_pointer_down, {capture: false});
        element.addEventListener("pointermove", this._handle_canvas_container_pointer_move, {capture: false});
        element.addEventListener("pointerup", this._handle_canvas_container_pointer_up, {capture: false});
        element.addEventListener("pointercancel", this._handle_canvas_container_pointer_up, {capture: false});
        element.addEventListener("pointerout", this._handle_canvas_container_pointer_up, {capture: false});
        element.addEventListener("pointerleave", this._handle_canvas_container_pointer_up, {capture: false});

        let events = ['onclick', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'ondblclick', 'onfocus', 'onblur'];

        events.forEach(function (event) {
            element[event] = function () {
                return false;
            };
        });

        this.setState({_canvas_container: element}, () => {

            this._update_canvas_container_size();
        });
    };

    _set_canvas_wrapper_ref = (element) => {

        if(element === null) {return}

        element.addEventListener("mousemove", this._handle_canvas_wrapper_mouse_move, {capture: false});

        this.setState({_canvas_wrapper: element});
    };

    _set_canvas_wrapper_overflow_ref = (element) => {

        if(element === null) {return}
        this.setState({_canvas_wrapper_overflow: element});
    };

    _to_canvas_middle = () => {

        const {_canvas_container, _canvas_wrapper, default_scale} = this.state;

        if(_canvas_container && _canvas_wrapper) {

            const for_middle_x = (_canvas_container.clientWidth - _canvas_wrapper.offsetWidth) / 2;
            const for_middle_y = (_canvas_container.clientHeight - _canvas_wrapper.offsetHeight) / 2;

            this.setState({
                scale_move_x: for_middle_x,
                scale_move_y: for_middle_y,
                _scale_move_timestamp: 0,
                _previous_scale_move_x: for_middle_x,
                _previous_scale_move_y: for_middle_y,
                _previous_scale_move_timestamp: 0,
                scale: default_scale,
                _moves_speed_average_now: 6,
            }, () => {

                this._request_force_update();
            });
        }
    };

    componentWillUnmount() {

        const { _canvas, _canvas_container, _canvas_wrapper } = this.state;

        _canvas.removeEventListener("mousemove", this._handle_canvas_mouse_move);
        _canvas.removeEventListener("mousedown", this._handle_canvas_mouse_down);
        _canvas.removeEventListener("mouseup", this._handle_canvas_mouse_up);
        _canvas.removeEventListener("mouseleave", this._handle_canvas_mouse_leave);
        _canvas_wrapper.removeEventListener("mousemove", this._handle_canvas_wrapper_mouse_move);
        _canvas_container.removeEventListener("wheel", this._handle_canvas_container_wheel);
        _canvas_container.removeEventListener("pointerdown", this._handle_canvas_container_pointer_down);
        _canvas_container.removeEventListener("pointermove", this._handle_canvas_container_pointer_move);
        _canvas_container.removeEventListener("pointerup", this._handle_canvas_container_pointer_up);
        _canvas_container.removeEventListener("pointercancel", this._handle_canvas_container_pointer_up);
        _canvas_container.removeEventListener("pointerout", this._handle_canvas_container_pointer_up);
        _canvas_container.removeEventListener("pointerleave", this._handle_canvas_container_pointer_up);
    }

    _get_canvas_pos_from_event = (event) => {

        let { pxl_width, pxl_height, _canvas } = this.state;

        const rect = _canvas.getBoundingClientRect();

        const pos_x_in_canvas = event.pageX - rect.left;
        const pos_y_in_canvas = event.pageY - rect.top;

        let pos_x = Math.floor(pxl_width * (pos_x_in_canvas / rect.width));
        let pos_y = Math.floor(pxl_height * (pos_y_in_canvas / rect.height));

        pos_x = pos_x !== Math.max(Math.min(pos_x, pxl_width - 1), 0) ? -1: pos_x;
        pos_y = pos_y !== Math.max(Math.min(pos_y, pxl_height - 1), 0) ? -1: pos_y;

        if(pos_x === -1 || pos_y === -1) {

            pos_x = -1;
            pos_y = -1;
        }

        return [ pos_x, pos_y ];
    };

    _match_color = (color_a, color_b, threshold) => {

        threshold = typeof threshold === "undefined" ? null: threshold;

        if(threshold === 1) {

            return true;
        }else if(threshold === 0){

            return color_a === color_b;
        }else {

            const threshold_256 = Math.round(threshold * 255);

            color_a = this._format_color(color_a);
            color_b = this._format_color(color_b);

            const [r_a, g_a, b_a, a_a] = this._get_rgba_from_hex(color_a);
            const [r_b, g_b, b_b, a_b] = this._get_rgba_from_hex(color_b);

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
    };

    exchange_pixel_color = (old_color, new_color) => {

        this._exchange_pixel_color(old_color, new_color);
    };

    _exchange_pixel_color = (old_color, new_color) => {

        const { _s_pxl_colors, _s_pxls, _layer_index } = this.state;


        let pxl_colors_copy = [..._s_pxl_colors[_layer_index]];
        let pxls_copy = [..._s_pxls[_layer_index]];

        const pxl_color_index = pxl_colors_copy.indexOf(old_color);

        const pxl_color = pxl_colors_copy[pxl_color_index];
        const pxl_color_new = this._blend_colors(pxl_color, new_color, 1, true);

        // Eventually add current color to color list
        if(!pxl_colors_copy.includes(pxl_color_new)){

            pxl_colors_copy.push(pxl_color_new);
        }

        const new_color_index = pxl_colors_copy.indexOf(pxl_color_new);

        pxls_copy = pxls_copy.map((pxl) => {

            return pxl === pxl_color_index ? new_color_index: pxl;
        });

        [pxls_copy, pxl_colors_copy] = this._remove_duplicate_pxl_colors(pxls_copy, pxl_colors_copy);

        let ns_pxl_colors = this.state._s_pxl_colors;
        ns_pxl_colors[_layer_index] = pxl_colors_copy;

        let ns_pxls = this.state._s_pxls;
        ns_pxls[_layer_index] = pxls_copy;

        this.setState({_s_pxls: ns_pxls, _s_pxl_colors: ns_pxl_colors, _last_action_timestamp: Date.now()}, () => {

            this._update_canvas();
        });

    };

    _handle_canvas_mouse_down = (event = null, event_which = null) => {

        event.stopPropagation();
        event.preventDefault();

        const { hide_canvas_content, tool, pxl_width, pxl_height, pxl_current_color, pxl_current_opacity, bucket_threshold, select_mode } = this.state;
        event_which = event_which !== null ? event_which: event.which;

        let [ pos_x, pos_y ] = [ -1, -1 ];

        if(this.state._pxls_hovered !== null && event === null) {

            const hover_pos_x = this.state._pxls_hovered % pxl_width;
            const hover_pos_y = (this.state._pxls_hovered - hover_pos_x) / pxl_width;
            [ pos_x, pos_y ] = [hover_pos_x, hover_pos_y];

        }else if(event) {

            [ pos_x, pos_y ] = this._get_canvas_pos_from_event(event);
        }

        if(pos_x === -1 || pos_y === -1) { return; }

        let { _shape_index_a, _select_shape_index_a, _shape_index_b, _select_shape_index_b } = this.state;
        let { _pxl_indexes_of_selection } = this.state;
        const pxl_index = (pos_y * pxl_width) + pos_x;
        const { _s_pxls, _s_pxl_colors, _layer_index, hue, _layers } = this.state;
        const pxl_color_index = _s_pxls[_layer_index][pxl_index];

        if (event_which === -1) {

            this.setState({_pxls_hovered: pxl_index}, () => {

                this._update_canvas();
            });
            return;
        }

        if (event_which === 1) {

            // Left mouse button was clicked
            this.setState({_mouse_down: Date.now()});
        }else {

            if(event_which === 3) {

                if(this.props.onRightClick) {

                    this.props.onRightClick(event, {
                        pos_x: pos_x,
                        pos_y: pos_y,
                        pxl_color: _s_pxl_colors[_layer_index][pxl_color_index]
                    });
                }
            }

            _shape_index_a = -1;
            _select_shape_index_a = -1;
            _shape_index_b = -1;
            _select_shape_index_b = -1;
        }

        const { _imported_image_pxls, scale } = this.state;

        if(!hide_canvas_content) {

            const pxls_copy_immutable = [..._s_pxls[_layer_index]];
            let pxls_copy = [..._s_pxls[_layer_index]];
            let pxl_colors_copy = [..._s_pxl_colors[_layer_index]];

            const pxl_color = pxl_colors_copy[pxl_color_index];
            const pxl_color_new = this._blend_colors(pxl_color, pxl_current_color, pxl_current_opacity, true);

            // Eventually add current color to color list
            if(!pxl_colors_copy.includes(pxl_color_new)){

                pxl_colors_copy.push(pxl_color_new);
            }

            const new_color_index = pxl_colors_copy.indexOf(pxl_color_new);

            if(_imported_image_pxls.length > 0 && event_which === 1){

                this.setState({_imported_image_move_from: [pos_x, pos_y]});

            }else if((event_which === 2) || (tool === "MOVE" && (event_which === 1 || event_which === -1))){

                this.setState({_image_move_from: [event.x, event.y]});

            }else if(tool === "MINE" && event_which === 1){

                this.setState({_mine_index: pxl_index});

            }else if(tool === "PICKER" && event_which === 1) {

                const pixel_color_hex = this.get_pixel_color_from_pos(pos_x, pos_y);
                this._notify_current_color_change(pixel_color_hex);
                this._notify_relevant_action_event(event, pixel_color_hex, 1);
            }else if (tool === "EXCHANGE" && event_which === 1) {

                const pixel_color_hex = _s_pxl_colors[_layer_index][pxl_color_index];
                this._exchange_pixel_color(pixel_color_hex, pxl_current_color);
                this._notify_relevant_action_event(event, pxl_current_color, 1);

            }else if(tool === "LINE" || tool === "RECTANGLE" || tool === "ELLIPSE"){

                if(_shape_index_a === -1) {

                    if(event_which === 1) {

                        this.setState({_shape_index_a: pxl_index}, () => {

                            this._update_canvas();
                        });
                    }else {

                        this.setState({_shape_index_a}, () => {

                            this._update_canvas();
                        });
                    }
                }else {

                    const palette_and_list =
                        tool === "LINE" ?
                            this._get_pixels_palette_and_list_from_line(pxls_copy, _shape_index_a, pxl_index, pxl_colors_copy, pxl_current_color, pxl_current_opacity):
                            tool === "RECTANGLE" ?
                                this._get_pixels_palette_and_list_from_rectangle(pxls_copy, _shape_index_a, pxl_index, pxl_colors_copy, pxl_current_color, pxl_current_opacity):
                                tool === "ELLIPSE" ?
                                    this._get_pixels_palette_and_list_from_ellipse(pxls_copy, _shape_index_a, pxl_index, pxl_colors_copy, pxl_current_color, pxl_current_opacity):
                                    this._get_pixels_palette_and_list_from_ellipse(pxls_copy, _shape_index_a, pxl_index, pxl_colors_copy, pxl_current_color, pxl_current_opacity);


                    pxls_copy = palette_and_list[0];
                    pxl_colors_copy = palette_and_list[1];

                    let ns_pxl_colors = this.state._s_pxl_colors;
                    ns_pxl_colors[_layer_index] = pxl_colors_copy;

                    let ns_pxls = this.state._s_pxls;
                    ns_pxls[_layer_index] = pxls_copy;

                    this.setState({_s_pxls: ns_pxls, _s_pxl_colors: ns_pxl_colors, _shape_index_a: -1, _last_action_timestamp: Date.now()}, () => {

                        this._update_canvas();
                    });
                    this._notify_relevant_action_event(event, "#ffffffff", .6);
                }


            }else if(tool === "SELECT LINE" || tool === "SELECT RECTANGLE" || tool === "SELECT ELLIPSE"){

                if(_select_shape_index_a === -1) {

                    if(event_which === 1) {

                        this.setState({_select_shape_index_a: pxl_index}, () => {

                            this._update_canvas();
                        });
                    }else {

                        this.setState({_select_shape_index_a}, () => {

                            this._update_canvas();
                        });
                    }
                }else {

                    const pixel_indexes =
                        tool === "SELECT LINE" ?
                            this._get_pixels_palette_and_list_from_line(pxls_copy, _select_shape_index_a, pxl_index)[2]:
                            tool === "SELECT RECTANGLE" ?
                                this._get_pixels_palette_and_list_from_rectangle(pxls_copy, _select_shape_index_a, pxl_index)[2]:
                                tool === "SELECT ELLIPSE" ?
                                    this._get_pixels_palette_and_list_from_ellipse(pxls_copy, _select_shape_index_a, pxl_index)[2]:
                                    this._get_pixels_palette_and_list_from_ellipse(pxls_copy, _select_shape_index_a, pxl_index)[2];

                    if(select_mode === "REPLACE") {

                        _pxl_indexes_of_selection.clear();
                    }

                    pixel_indexes.forEach((pxl) => {

                        if(select_mode === "ADD" || select_mode === "REPLACE") {

                            _pxl_indexes_of_selection.add(pxl);
                        }else {

                            _pxl_indexes_of_selection.delete(pxl);
                        }
                    });

                    this.setState({_pxl_indexes_of_selection, _select_shape_index_a: -1, _last_action_timestamp: Date.now()}, () => {

                        this._update_canvas();
                        this._notify_is_something_selected();
                    });
                }


            }else if((tool === "SELECT PIXEL" || tool === "SELECT PATH") && event_which === 1) {


                if(select_mode === "REPLACE") {

                    _pxl_indexes_of_selection.clear();
                }

                if(select_mode === "ADD" || select_mode === "REPLACE") {

                    _pxl_indexes_of_selection.add(pxl_index);
                }else {

                    _pxl_indexes_of_selection.delete(pxl_index);
                }

                if(tool === "SELECT PIXEL") {

                    // Update pixels list and pixel colours
                    this.setState({ _pxl_indexes_of_selection, _paint_or_select_hover_actions_latest_index: pxl_index, _last_action_timestamp: Date.now()}, () => {

                        this._update_canvas();
                        this._notify_is_something_selected();
                    });
                }else if(tool === "SELECT PATH") {

                    // Update pixels list and pixel colours
                    this.setState({ _pxl_indexes_of_selection, _paint_or_select_hover_actions_latest_index: pxl_index, _last_action_timestamp: 1 / 0}, () => {

                        this._update_canvas();
                        this._notify_is_something_selected();
                    });
                }


            }else if((tool === "SET PENCIL MIRROR") && event_which === 1) {

                this.setState({ _pencil_mirror_index: pxl_index, _last_action_timestamp: Date.now()}, () => {

                    this._update_canvas();
                });

            }else if((tool === "PENCIL" || tool === "PENCIL PERFECT" || tool === "CONTOUR") && event_which === 1) {

                const { pencil_mirror_mode, _pencil_mirror_index } = this.state;

                const pencil_mirror_x = _pencil_mirror_index % pxl_width;
                const pencil_mirror_y = (_pencil_mirror_index - pencil_mirror_x) / pxl_width;

                let pixel_stack = new Set([[pos_x, pos_y]]);

                if(pencil_mirror_mode === "VERTICAL" || pencil_mirror_mode === "BOTH") {

                    const y = pos_y - (pos_y - pencil_mirror_y) * 2;
                    const x = pos_x;

                    if(x >= 0 && x < pxl_width && y >= 0 && y <= pxl_height) {

                        pixel_stack.add([x, y]);
                        const index = y * pxl_width + x;

                        const v_pxl_color_index = _s_pxls[_layer_index][index];
                        const v_pxl_color = pxl_colors_copy[v_pxl_color_index];
                        const v_pxl_color_new = this._blend_colors(v_pxl_color, pxl_current_color, pxl_current_opacity, true);

                        // Eventually add current color to color list
                        if(!pxl_colors_copy.includes(v_pxl_color_new)){

                            pxl_colors_copy.push(v_pxl_color_new);
                        }

                        pxls_copy[index] = pxl_colors_copy.indexOf(v_pxl_color_new);
                    }
                }

                if(pencil_mirror_mode === "HORIZONTAL" || pencil_mirror_mode === "BOTH") {

                    pixel_stack.forEach((pixel_pos) => {

                        const y = pixel_pos[1];
                        const x = pixel_pos[0] - (pixel_pos[0] - pencil_mirror_x) * 2;

                        if(x >= 0 && x < pxl_width && y >= 0 && y <= pxl_height) {

                            const index = y * pxl_width + x;

                            const v_pxl_color_index = _s_pxls[_layer_index][index];
                            const v_pxl_color = pxl_colors_copy[v_pxl_color_index];
                            const v_pxl_color_new = this._blend_colors(v_pxl_color, pxl_current_color, pxl_current_opacity, true);

                            // Eventually add current color to color list
                            if (!pxl_colors_copy.includes(v_pxl_color_new)) {

                                pxl_colors_copy.push(v_pxl_color_new);
                            }


                            pxls_copy[index] = pxl_colors_copy.indexOf(v_pxl_color_new);
                        }
                    });
                }

                // Pixel index Z is of the color index associated
                pxls_copy[pxl_index] = new_color_index;

                let ns_pxl_colors = this.state._s_pxl_colors;
                ns_pxl_colors[_layer_index] = pxl_colors_copy;

                let ns_pxls = this.state._s_pxls;
                ns_pxls[_layer_index] = pxls_copy;

                // Update pixels list and pixel colours
                this.setState({
                    _s_pxls: ns_pxls,
                    _s_pxl_colors: ns_pxl_colors,
                    _paint_or_select_hover_pxl_indexes: new Set([pxl_index]),
                    _paint_or_select_hover_actions_latest_index: pxl_index,
                    _last_action_timestamp: Date.now()
                }, () => {

                    this._update_canvas();
                });

            }else if ((tool === "BUCKET" || tool === "HUE BUCKET" || tool === "SELECT COLOR THRESHOLD" || tool === "BORDER") && event_which === 1) {

                const { _old_pxls } = this.state;
                const old_pxls_copy = [..._old_pxls];

                const pixel_start = [pos_x, pos_y];
                const index_color_start = old_pxls_copy[pxl_index];
                const pxl_color_start = pxl_colors_copy[index_color_start];

                let interpolated_colors_hue_bucket = [];

                const [c_s_r, c_s_g, c_s_b, c_s_a] = this._get_rgba_from_hex(pxl_color_start);
                const [c_s_h, c_s_s, c_s_l] = this._rgb_to_hsl(c_s_r, c_s_g, c_s_b);
                const hue_difference_with_color_start = c_s_h < hue ? hue - c_s_h: 360 - c_s_h + hue;

                let pixel_stack = [pixel_start];
                let colored_pxl_indexes = new Set();

                const match_color_start = (index) => {

                    if(bucket_threshold === 0) {

                        return index_color_start === old_pxls_copy[index];
                    }else {

                        if(!colored_pxl_indexes.has(index) && index >= 0 && index < pxl_width * pxl_height) {

                            const color_a = pxl_color_start || "#00000000";
                            const color_b = pxl_colors_copy[old_pxls_copy[index]] || "#00000000";

                            return this._match_color(color_a, color_b, bucket_threshold);
                        }else {

                            return false;
                        }
                    }
                }

                const color_pixel = (index, paint = true) => {

                    if((!colored_pxl_indexes.has(index) || paint) && index >= 0 && index < pxl_width * pxl_height) {

                        if(tool === "HUE BUCKET") {

                            if(paint) {

                                const hue_bucket_old_color = pxl_colors_copy[pxls_copy_immutable[index]];

                                if(typeof interpolated_colors_hue_bucket[hue_bucket_old_color] === "undefined") {

                                    let [r, g, b, a] = this._get_rgba_from_hex(hue_bucket_old_color);
                                    let [h, s, l] = this._rgb_to_hsl(r, g, b);

                                    h = (h + hue_difference_with_color_start) % 360;

                                    [r, g, b] = this._hsl_to_rgb(h, s, l);
                                    const hue_bucket_new_color = "#" + this._get_hex_value_from_rgb_value(r) + this._get_hex_value_from_rgb_value(g) + this._get_hex_value_from_rgb_value(b) + this._get_hex_value_from_rgb_value(a);

                                    // Eventually add current color to color list
                                    if(!pxl_colors_copy.includes(hue_bucket_new_color)){

                                        pxl_colors_copy.push(hue_bucket_new_color);
                                    }

                                    const hue_bucket_new_color_index = pxl_colors_copy.indexOf(hue_bucket_new_color);
                                    interpolated_colors_hue_bucket[hue_bucket_old_color] = hue_bucket_new_color_index;


                                    pxls_copy[index] = hue_bucket_new_color_index;

                                }else {

                                    pxls_copy[index] = interpolated_colors_hue_bucket[hue_bucket_old_color];
                                }
                            }

                            colored_pxl_indexes.add(index);

                        }else if(tool === "BUCKET" || tool === "BORDER"){

                            if(paint) {

                                const current_pxl_color_index = pxls_copy[index];
                                const current_pxl_color = pxl_colors_copy[current_pxl_color_index];
                                const current_pxl_new_color = this._blend_colors(current_pxl_color, pxl_current_color, pxl_current_opacity);

                                // Eventually add current color to color list
                                if(!pxl_colors_copy.includes(current_pxl_new_color)){

                                    pxl_colors_copy.push(current_pxl_new_color);
                                }

                                const current_pxl_new_color_index = pxl_colors_copy.indexOf(current_pxl_new_color);
                                pxls_copy[index] = current_pxl_new_color_index;
                            }

                            colored_pxl_indexes.add(index);

                        }else if(tool === "SELECT COLOR THRESHOLD"){

                            colored_pxl_indexes.add(index);
                        }
                    }
                };

                let reach_left = false;
                let reach_right = false;

                while(pixel_stack.length) {

                    // Get current pixel position
                    let [x, y] = pixel_stack.pop();

                    let current_pxl_index = (y * pxl_width) + x;

                    // Go up as long as the color matches and are inside the canvas
                    while (y >= 0 && match_color_start(current_pxl_index)) {

                        current_pxl_index -= pxl_width;
                        y--;
                    }

                    current_pxl_index += pxl_width;
                    y++;

                    reach_left = false;
                    reach_right = false;

                    // Go down as long as the color matches and in inside the canvas
                    while (y < pxl_height && match_color_start(current_pxl_index)) {

                        y++;
                        if(tool === "BORDER") {

                            color_pixel(current_pxl_index, false);
                        }else {

                            color_pixel(current_pxl_index, true);
                        }

                        if (x > 0) {

                            if (match_color_start(current_pxl_index - 1)) {

                                if (!reach_left) {

                                    // Add pixel to stack
                                    pixel_stack.push([x - 1, y - 1]);
                                    reach_left = true;
                                }

                            } else if (reach_left) {

                                reach_left = false;
                            }
                        }

                        if (x + 1 < pxl_width) {

                            if (match_color_start(current_pxl_index + 1)) {

                                if (!reach_right) {

                                    // Add pixel to stack
                                    pixel_stack.push([x + 1, y - 1]);
                                    reach_right = true;
                                }

                            } else if (reach_right) {

                                reach_right = false;
                            }
                        }

                        current_pxl_index += pxl_width;

                    }

                }

                if(tool === "BORDER") {

                    let pxls_of_the_border = this._get_border_from_selection(colored_pxl_indexes);

                    pxls_of_the_border.forEach((pxl_index) => {

                        color_pixel(pxl_index, true);
                    });

                    [pxls_copy, pxl_colors_copy] = this._remove_duplicate_pxl_colors(pxls_copy, pxl_colors_copy);

                    let ns_pxl_colors = this.state._s_pxl_colors;
                    ns_pxl_colors[_layer_index] = pxl_colors_copy;

                    let ns_pxls = this.state._s_pxls;
                    ns_pxls[_layer_index] = pxls_copy;

                    // Update pixels list and pixel colours
                    this.setState({_s_pxls: ns_pxls, _s_pxl_colors: ns_pxl_colors, _last_action_timestamp: Date.now()}, () => {

                        this._update_canvas();
                    });

                }else if(tool === "SELECT COLOR THRESHOLD") {

                    if(select_mode === "REPLACE") {

                        _pxl_indexes_of_selection.clear();
                    }

                    [...colored_pxl_indexes].forEach((pxl_index) => {

                        if(select_mode === "ADD" || select_mode === "REPLACE") {

                            _pxl_indexes_of_selection.add(pxl_index);
                        }else {

                            _pxl_indexes_of_selection.delete(pxl_index);
                        }
                    });

                    this.setState({_pxl_indexes_of_selection, _last_action_timestamp: Date.now()}, () => {

                        this._update_canvas();
                        this._notify_is_something_selected();
                    });

                }else if(tool === "BUCKET" || tool === "HUE BUCKET"){

                    [pxls_copy, pxl_colors_copy] = this._remove_duplicate_pxl_colors(pxls_copy, pxl_colors_copy);

                    let ns_pxl_colors = this.state._s_pxl_colors;
                    ns_pxl_colors[_layer_index] = pxl_colors_copy;

                    let ns_pxls = this.state._s_pxls;
                    ns_pxls[_layer_index] = pxls_copy;

                    // Update pixels list and pixel colours
                    this.setState({_s_pxls: ns_pxls, _s_pxl_colors: ns_pxl_colors, _last_action_timestamp: Date.now()}, () => {

                        this._update_canvas();
                    });
                    this._notify_relevant_action_event(event, pxl_current_color, 1);
                }

            }else if ((tool === "SELECT COLOR") && event_which === 1) {

                const { _s_pxls } = this.state;
                const _pxls_copy = [..._s_pxls[_layer_index]];
                const index_color_start = _pxls_copy[pxl_index];

                if(select_mode === "REPLACE") {

                    _pxl_indexes_of_selection.clear();
                }

                [..._pxls_copy].forEach((pxl, pxl_index) => {

                    if(pxl === index_color_start) {

                        if(select_mode === "ADD" || select_mode === "REPLACE") {

                            _pxl_indexes_of_selection.add(pxl_index);
                        }else {

                            _pxl_indexes_of_selection.delete(pxl_index);
                        }
                    }
                });

                this.setState({_pxl_indexes_of_selection, _last_action_timestamp: Date.now()}, () => {

                    this._update_canvas();
                    this._notify_is_something_selected();
                });

            }
        }
    };

    _get_pixels_palette_and_list_from_line = (pxls, index_a, index_b, pxl_colors = [], pxl_color_new = null, pxl_current_opacity = null) => {

        pxls = [...pxls];
        pxl_colors = [...pxl_colors];
        let pxl_indexes = [];

        const { pxl_width } = this.state;

        let x_behind = index_a % pxl_width;
        let y_behind = (index_a - x_behind) / pxl_width;

        const last_x_after = index_b % pxl_width;
        const last_y_after = (index_b - last_x_after) / pxl_width;

        // PAINT HACK: compute the pixel between the previous and latest paint by hover pixel (Bresenham’s Line Algorithm)
        let dx = Math.abs(last_x_after - x_behind);
        let dy = Math.abs(last_y_after - y_behind);
        let sx = (x_behind < last_x_after) ? 1 : -1;
        let sy = (y_behind < last_y_after) ? 1 : -1;
        let err = dx - dy;

        while(true){

            const current_pxl_index = y_behind * pxl_width + x_behind;

            if(pxl_colors !== [] && pxl_color_new !== null && pxl_current_opacity !== null) { // We can compute pxls and pxl_colors

                const current_pxl_color_index = pxls[current_pxl_index];
                const current_pxl_color = pxl_colors[current_pxl_color_index];
                const current_pxl_new_color = this._blend_colors(current_pxl_color, pxl_color_new, pxl_current_opacity);

                // Eventually add current color to color list
                if(!pxl_colors.includes(current_pxl_new_color)){

                    pxl_colors.push(current_pxl_new_color);
                }

                const current_pxl_new_color_index = pxl_colors.indexOf(current_pxl_new_color);
                pxls[current_pxl_index] = current_pxl_new_color_index;
            }

            pxl_indexes.push(current_pxl_index);

            if(x_behind === last_x_after && y_behind === last_y_after) { break; }

            const e2 = 2 * err;

            if (e2 > - dy) {

                err -= dy;
                x_behind  += sx;
            }
            if (e2 < dx) {

                err += dx;
                y_behind  += sy;
            }
        }

        return [ pxls, pxl_colors, pxl_indexes ];
    }

    _get_pixels_palette_and_list_from_rectangle = (pxls, index_a, index_b, pxl_colors = [], pxl_color_new = null, pxl_current_opacity = null) => {

        pxls = [...pxls];
        pxl_colors = [...pxl_colors];
        let pxl_indexes = [];

        const { pxl_width } = this.state;

        const x_behind = index_a % pxl_width;
        const y_behind = (index_a - x_behind) / pxl_width;

        const x_after = index_b % pxl_width;
        const y_after = (index_b - x_after) / pxl_width;

        const rectangle_width = Math.abs(x_behind - x_after) + 1;
        const rectangle_height = Math.abs(y_behind - y_after) + 1;
        const pixel_number_in_rectangle = rectangle_width * rectangle_height;

        const rectangle_top_left_x = Math.max(x_behind, x_after) - (rectangle_width - 1);
        const rectangle_top_left_y = Math.max(y_behind, y_after) - (rectangle_height - 1);

        for(let i = 0; i < pixel_number_in_rectangle; i++){

            const inside_rectangle_x = i % rectangle_width;
            const inside_rectangle_y = (i - inside_rectangle_x) / rectangle_width;

            const current_pxl_index = (rectangle_top_left_y + inside_rectangle_y) * pxl_width + (rectangle_top_left_x + inside_rectangle_x);

            if(pxl_colors !== [] && pxl_color_new !== null && pxl_current_opacity !== null) { // We can compute pxls and pxl_colors

                const current_pxl_color_index = pxls[current_pxl_index];
                const current_pxl_color = pxl_colors[current_pxl_color_index];
                const current_pxl_new_color = this._blend_colors(current_pxl_color, pxl_color_new, pxl_current_opacity);

                // Eventually add current color to color list
                if(!pxl_colors.includes(current_pxl_new_color)){

                    pxl_colors.push(current_pxl_new_color);
                }

                const current_pxl_new_color_index = pxl_colors.indexOf(current_pxl_new_color);
                pxls[current_pxl_index] = current_pxl_new_color_index;
            }

            pxl_indexes.push(current_pxl_index);

        }

        return [ pxls, pxl_colors, pxl_indexes ];
    }

    _get_pixels_palette_and_list_from_path = (pxls, path_indexes, pxl_colors = [], pxl_color_new = null, pxl_current_opacity = null) => {

        const { pxl_width, pxl_height } = this.state;
        pxls = [...pxls];
        pxl_colors = [...pxl_colors];
        path_indexes = new Set([...path_indexes]);

        let pxl_indexes = new Set();

        let [ctx] = this._get_new_ctx_from_canvas(pxl_width, pxl_height);
        ctx.lineWidth = 0;
        ctx.beginPath();

        path_indexes.forEach((pxl_index, index) => {

            const x = pxl_index % pxl_width;
            const y = (pxl_index - x) / pxl_width

            if(index === 0) {

                ctx.moveTo(x, y);
            }else {

                ctx.lineTo(x, y);
            }

        });

        ctx.strokeStyle = "#ffffffff";
        ctx.fillStyle = "#ffffffff";
        ctx.stroke();
        ctx.fill();

        const canvas_image_data = ctx.getImageData(0, 0, pxl_width, pxl_height);
        const new_pxl_data = this._get_pixels_palette_and_list_from_image_data(canvas_image_data, true, 0);

        let full_new_pxl_colors = new_pxl_data.new_pxl_colors;
        let full_new_pxls = new_pxl_data.new_pxls;

        for(let i = 0; i < full_new_pxls.length; i++){

            const inside_shape_x = i % pxl_width;
            const inside_shape_y = (i - inside_shape_x) / pxl_width;

            const current_pxl_index = inside_shape_y * pxl_width + inside_shape_x;

            if(full_new_pxls[current_pxl_index] === full_new_pxl_colors.indexOf("#ffffffff") || path_indexes.has(i)) {

                pxl_indexes.add(current_pxl_index);
            }
        }

        for(let i = 0; i < full_new_pxls.length; i++){

            if(!path_indexes.has(i)) {

                let up, right, bottom, left;

                up = i - pxl_width; up = up < 0 ? -1: up;
                right = i + 1; right = right % pxl_width === 0 ? -1: right;
                bottom = i + pxl_width; bottom = bottom > (pxl_width * pxl_height) ? -1: bottom;
                left = i - 1; left = left % pxl_width === pxl_width - 1 ? -1: left;

                if(pxl_indexes.has(up) && pxl_indexes.has(right) && pxl_indexes.has(bottom) && pxl_indexes.has(left)) {

                    pxl_indexes.add(i);
                }
            }
        }

        //pxl_indexes = this._to_selection_size(-1, pxl_indexes);

        if( pxl_colors !== [] && pxl_color_new !== null && pxl_current_opacity !== null) {

            pxl_indexes.forEach((current_pxl_index) => {

                const current_pxl_color_index = pxls[current_pxl_index];
                const current_pxl_color = pxl_colors[current_pxl_color_index];
                const current_pxl_new_color = this._blend_colors(current_pxl_color, pxl_color_new, pxl_current_opacity);

                // Eventually add current color to color list
                if(!pxl_colors.includes(current_pxl_new_color)){

                    pxl_colors.push(current_pxl_new_color);
                }

                const current_pxl_new_color_index = pxl_colors.indexOf(current_pxl_new_color);
                pxls[current_pxl_index] = current_pxl_new_color_index;

            });
        }

        return [ pxls, pxl_colors, [...pxl_indexes] ];
    }

    _get_pixels_palette_and_list_from_ellipse = (pxls, index_a, index_b, pxl_colors = [], pxl_color_new = null, pxl_current_opacity = null) => {

        const { pxl_width, pxl_height, px_per_px } = this.state;
        pxls = [...pxls];
        pxl_colors = [...pxl_colors];

        let pxl_indexes = [];

        let x_behind = index_a % pxl_width;
        let y_behind = (index_a - x_behind) / pxl_width;
        let x_after = (index_b % pxl_width);
        let y_after = (( index_b - x_after) / pxl_width);

        let ellipse_width = Math.abs(x_behind - x_after) + 1;
        let ellipse_height = Math.abs(y_behind - y_after) + 1;

        const ellipse_top_left_x = Math.max(x_behind, x_after) - (ellipse_width - 1);
        const ellipse_top_left_y = Math.max(y_behind, y_after) - (ellipse_height - 1);

        let ellipse_rayon_x = (ellipse_width) / 2.0;
        let ellipse_rayon_y = (ellipse_height) / 2.0;

        const ellipse_middle_x = ellipse_rayon_x + ellipse_top_left_x;
        const ellipse_middle_y = ellipse_rayon_y + ellipse_top_left_y;

        let [ellipse_context] = this._get_new_ctx_from_canvas(pxl_width, pxl_height);

        ellipse_context.save();
        ellipse_context.translate(ellipse_middle_x, ellipse_middle_y);
        ellipse_context.rotate(0);
        ellipse_context.scale(ellipse_rayon_x, ellipse_rayon_y);
        ellipse_context.arc(0, 0, 1, 0, 2 * Math.PI);
        ellipse_context.restore();

        ellipse_context.fillStyle = "#ffffffff";
        ellipse_context.fill();

        const canvas_image_data = ellipse_context.getImageData(0, 0, pxl_width, pxl_height);
        const new_pxl_data = this._get_pixels_palette_and_list_from_image_data(canvas_image_data, true, 0);

        let full_new_pxl_colors = new_pxl_data.new_pxl_colors;
        let full_new_pxls = new_pxl_data.new_pxls;

        for(let i = 0; i < full_new_pxls.length; i++){

            const inside_ellipse_x = i % ellipse_width;
            const inside_ellipse_y = (i - inside_ellipse_x) / ellipse_width;

            const current_pxl_index = (ellipse_top_left_y + inside_ellipse_y) * pxl_width + (ellipse_top_left_x + inside_ellipse_x);

            if(full_new_pxls[current_pxl_index] === full_new_pxl_colors.indexOf("#ffffffff")) {

                const current_pxl_color_index = pxls[current_pxl_index];

                if(pxl_colors !== [] && pxl_color_new !== null && pxl_current_opacity !== null) { // We can compute pxls and pxl_colors

                    const current_pxl_color = pxl_colors[current_pxl_color_index];
                    const current_pxl_new_color = this._blend_colors(current_pxl_color, pxl_color_new, pxl_current_opacity);

                    // Eventually add current color to color list
                    if(!pxl_colors.includes(current_pxl_new_color)){

                        pxl_colors.push(current_pxl_new_color);
                    }

                    const current_pxl_new_color_index = pxl_colors.indexOf(current_pxl_new_color);
                    pxls[current_pxl_index] = current_pxl_new_color_index;
                }
                pxl_indexes.push(current_pxl_index);
            }

        }

        return [ pxls, pxl_colors, pxl_indexes ];
    }

    _should_remove_not_perfect_second_latest_pixel_from_array = (array) => {

        const { pxl_width } = this.state;
        const _paint_or_select_hover_pxl_indexes = [...array];

        if(_paint_or_select_hover_pxl_indexes.length >= 3) {

            const first_latest_pixel = _paint_or_select_hover_pxl_indexes[_paint_or_select_hover_pxl_indexes.length - 1];
            const first_latest_pixel_x = first_latest_pixel % pxl_width;
            const first_latest_pixel_y = (first_latest_pixel - first_latest_pixel_x) / pxl_width;

            const second_latest_pixel = _paint_or_select_hover_pxl_indexes[_paint_or_select_hover_pxl_indexes.length - 2];
            const second_latest_pixel_x = second_latest_pixel % pxl_width;
            const second_latest_pixel_y = (second_latest_pixel - second_latest_pixel_x) / pxl_width;

            const third_latest_pixel = _paint_or_select_hover_pxl_indexes[_paint_or_select_hover_pxl_indexes.length - 3];
            const third_latest_pixel_x = third_latest_pixel % pxl_width;
            const third_latest_pixel_y = (third_latest_pixel - third_latest_pixel_x) / pxl_width;

            const first_third_absolute_difference_x = Math.abs(first_latest_pixel_x - third_latest_pixel_x);
            const first_third_absolute_difference_y = Math.abs(first_latest_pixel_y - third_latest_pixel_y);

            if(
                first_third_absolute_difference_x === 1 &&
                first_third_absolute_difference_y === 1) {

                if(
                    (first_latest_pixel_x === second_latest_pixel_x && second_latest_pixel_y === third_latest_pixel_y) ||
                    (first_latest_pixel_y === second_latest_pixel_y && second_latest_pixel_x === third_latest_pixel_x) ||
                    (third_latest_pixel_x ===  second_latest_pixel_x && second_latest_pixel_y === first_latest_pixel_y) ||
                    (third_latest_pixel_y ===  second_latest_pixel_y && second_latest_pixel_x === first_latest_pixel_x)
                ) {

                    return true;
                }
            }
        }

        return false;

    };

    get_pixel_color_from_pos = (x, y) => {

        const { pxl_width, _s_pxls, _s_pxl_colors, _layers } = this.state;

        const pxl_index = y * pxl_width + x;

        let layer_pixel_colors = [];
        let start_i = -1;
        start_i++;

        for (let i = _s_pxl_colors.length - 1; i >= 0; i--) {

            const layer_pixel_color = _s_pxl_colors[i][_s_pxls[i][pxl_index]];
            layer_pixel_colors[i] = layer_pixel_color;
            const [r, g, b, a] = layer_pixel_color;

            if(a === 255) {

                start_i = i;
                break;
            }

        }

        let pixel_color_hex = "#00000000";

        for (let i = start_i; i < _s_pxl_colors.length ; i++) {

            if(!_layers[i].hidden) {

                const layer_pixel_color = layer_pixel_colors[i];

                pixel_color_hex = this._blend_colors(pixel_color_hex, layer_pixel_color, _layers[i].opacity, false);
            }
        }

        return pixel_color_hex;
    };

    _handle_canvas_container_wheel = (event) => {

        let { scale, scale_move_x, scale_move_y, _canvas_wrapper, _canvas_wrapper_overflow, _canvas_container } = this.state;
        let _canvas_container_rect = _canvas_container.getBoundingClientRect();

        event.preventDefault();
        let delta = Math.max(Math.min(0.125, Math.abs(event.deltaY * -0.01)), 0.25);
        delta = event.deltaY * -0.01 > 0 ? delta: -delta;

        const scale_change_ratio_on_one = Math.pow(scale < 1 ? 1 / scale: scale, 1.5);

        let new_scale = scale + delta * scale * ( 0.75 / scale_change_ratio_on_one );

        if(!(new_scale > 6) && !(new_scale < 1/6)) {

            let ratio = 1 - scale / new_scale;
            let ratio2 = new_scale / scale;

            const pos_x_in_canvas_container = (event.pageX - _canvas_container_rect.x);
            const pos_y_in_canvas_container = (event.pageY - _canvas_container_rect.y);

            let new_scale_move_x = (scale_move_x - (pos_x_in_canvas_container * ratio)) * ratio2;
            let new_scale_move_y = (scale_move_y - (pos_y_in_canvas_container * ratio)) * ratio2;

            this.setState({
                scale: new_scale,
                _moves_speed_average_now: 6,
            }, () => {

                let { _canvas_wrapper } = this.state;

                const for_middle_x = (_canvas_container.clientWidth - _canvas_wrapper.offsetWidth) / 2;
                const for_middle_y = (_canvas_container.clientHeight - _canvas_wrapper.offsetHeight) / 2;

                const scale_move_x_max = -128 + _canvas_container.clientWidth - (_canvas_container.clientWidth - _canvas_wrapper.offsetWidth) / 2;
                const scale_move_y_max = -128 + _canvas_container.clientHeight - (_canvas_container.clientHeight - _canvas_wrapper.offsetHeight) / 2;

                new_scale_move_y -= for_middle_y;
                new_scale_move_x -= for_middle_x;

                let new_scale_move_x_rigged = (Math.min(Math.abs(new_scale_move_x), scale_move_x_max)) * (new_scale_move_x < 0 ? -1: 1) + for_middle_x;
                let new_scale_move_y_rigged = (Math.min(Math.abs(new_scale_move_y), scale_move_y_max)) * (new_scale_move_y < 0 ? -1: 1) + for_middle_y;

                this._set_moves(new_scale_move_x_rigged, new_scale_move_y_rigged);
            });
        }
    };

    _handle_canvas_container_pointer_down = (event) => {

        if(event.pointerType !== "mouse") {

            let { _pointer_events, _previous_single_pointer_down_timestamp, _previous_single_pointer_down_x_y } = this.state;

            _pointer_events.push(event);

            const [x, y] = _previous_single_pointer_down_x_y;

            if(_previous_single_pointer_down_timestamp + 400 > Date.now() && _pointer_events.length === 1 && Math.abs(x - event.x) < 25 && Math.abs(y - event.y) < 25) {

                setTimeout(() => {

                    this._handle_canvas_mouse_down(event, 3);
                }, 250);
                _previous_single_pointer_down_timestamp = Date.now();
                event.preventDefault();

            }else if(_pointer_events.length === 1) {

                this._handle_canvas_mouse_down(event, -1);
                _previous_single_pointer_down_timestamp = Date.now();
                event.preventDefault();
            }

            this.setState({_pointer_events: [..._pointer_events], _previous_single_pointer_down_timestamp, _previous_single_pointer_down_x_y: [event.x, event.y]});
        }
    };

    _handle_canvas_container_pointer_move = (event) => {

        const { _latest_pointers_client_x_center, _latest_pointers_client_y_center } = this.state;
        let { _pointer_events, _latest_pointers_distance } = this.state;

        for (let i = 0; i < _pointer_events.length; i++) {
            if (event.pointerId === _pointer_events[i].pointerId) {
                _pointer_events[i] = event;
                break;
            }
        }

        if(event.pointerType !== "mouse") {

            event.preventDefault();
            event.stopPropagation();

            if (_pointer_events.length === 2) {

                const x_diff = _pointer_events[0].clientX - _pointer_events[1].clientX;
                const y_diff = _pointer_events[0].clientY - _pointer_events[1].clientY;
                const anchor_diff = Math.sqrt((x_diff * x_diff) + (y_diff * y_diff));
                const page_x_center = (_pointer_events[0].pageX + _pointer_events[1].pageX) / 2;
                const page_y_center = (_pointer_events[0].pageY + _pointer_events[1].pageY) / 2;
                const client_x_center = (_pointer_events[0].clientX + _pointer_events[1].clientX) / 2;
                const client_y_center = (_pointer_events[0].clientY + _pointer_events[1].clientY) / 2;
                const move_x = _latest_pointers_client_x_center > 0 ? _latest_pointers_client_x_center - client_x_center: 0;
                const move_y = _latest_pointers_client_y_center > 0 ? _latest_pointers_client_y_center - client_y_center: 0;
                const move_diff = Math.sqrt((move_x * move_x) + (move_y * move_y));
                const anchor_diff_diff = Math.abs(_latest_pointers_distance - anchor_diff);

                const of = _latest_pointers_distance > 0 ? anchor_diff / _latest_pointers_distance : 1;

                this.zoom_of(of, page_x_center, page_y_center, -move_x, -move_y);

                this.setState({
                    _pointer_events: [..._pointer_events],
                    _latest_pointers_distance: anchor_diff,
                    _latest_pointers_client_x_center: client_x_center,
                    _latest_pointers_client_y_center: client_y_center,
                });

            }else if(_pointer_events.length === 1) {

                this._handle_canvas_mouse_move(event, -1);

                this.setState({
                    _pointer_events: [..._pointer_events],
                });
            }
        }

    };

    _handle_canvas_container_pointer_up = (event) => {

        let { _pointer_events, _latest_pointers_distance, _latest_pointers_client_x_center, _latest_pointers_client_y_center } = this.state;

        for (let i = 0; i < _pointer_events.length; i++) {
            if (_pointer_events[i].pointerId === event.pointerId) {
                _pointer_events.splice(i, 1);
                break;
            }
        }

        if (_pointer_events.length < 2) {

            _latest_pointers_distance = 0;
            _latest_pointers_client_x_center = 0;
            _latest_pointers_client_y_center = 0;
        }

        if(_pointer_events.length === 0) {

            //this._handle_canvas_mouse_up(event);
        }

        this.setState({
            _pointer_events: [..._pointer_events],
            _latest_pointers_distance,
            _latest_pointers_client_x_center,
            _latest_pointers_client_y_center,
        });
    };

    _handle_canvas_wrapper_mouse_move = (event) => {

        event.preventDefault();

        if(this.state._mouse_inside === true) {

            this.setState({_mouse_inside: false}, () => {

                this._request_force_update();
            });
        }

        const { _pxls_hovered, tool } = this.state;

        if((!_pxls_hovered || _pxls_hovered <= 0) && event.which === 1 && (tool === "MOVE" || tool === "PICKER")) {

            this.zoom_of(1, null, null, event.movementX, event.movementY);
        }
    };

    _handle_canvas_mouse_move = (event, event_which = null) => {

        event.stopPropagation();
        event.preventDefault();

        event_which = event_which !== null ? event_which: event.which;
        const { tool, pxl_width, pxl_height, _pxls_hovered, _mouse_down, scale, pxl_current_color, hide_canvas_content } = this.state;

        const [ pos_x, pos_y ] = this._get_canvas_pos_from_event(event);

        if((event_which === 2) || ((tool === "MOVE") && (event_which === 1 || event_which === -1))) {

            const [from_x, from_y] = this.state._image_move_from;
            const x_difference_px = -event.movementX //from_x - event.x;
            const y_difference_px = -event.movementY  //from_y - event.y;

            const _image_move_from = [event.x, event.y];

            let { _canvas_wrapper, _canvas_container, _canvas_wrapper_overflow } = this.state;
            let { scale_move_x, scale_move_y } = this.state;

            const for_middle_x = (_canvas_container.clientWidth - _canvas_wrapper.offsetWidth) / 2;
            const for_middle_y = (_canvas_container.clientHeight - _canvas_wrapper.offsetHeight) / 2;

            const scale_move_x_max = -128 + _canvas_container.clientWidth - (_canvas_container.clientWidth - _canvas_wrapper.offsetWidth) / 2;
            const scale_move_y_max = -128 + _canvas_container.clientHeight - (_canvas_container.clientHeight - _canvas_wrapper.offsetHeight) / 2;

            let new_scale_move_x = scale_move_x - x_difference_px;
            let new_scale_move_y = scale_move_y - y_difference_px;
            new_scale_move_y -= for_middle_y;
            new_scale_move_x -= for_middle_x;

            let new_scale_move_x_rigged = (Math.min(Math.abs(new_scale_move_x), scale_move_x_max)) * (new_scale_move_x < 0 ? -1: 1) + for_middle_x;
            let new_scale_move_y_rigged = (Math.min(Math.abs(new_scale_move_y), scale_move_y_max)) * (new_scale_move_y < 0 ? -1: 1) + for_middle_y;

            this.setState({_image_move_from}, () => {

                this._set_moves(new_scale_move_x_rigged, new_scale_move_y_rigged);

            });
        }

        if(pos_x === -1 || pos_y === -1) { return; }
        let { _pxl_indexes_of_selection, _imported_image_pxls } = this.state;
        const pxl_index = (pos_y * pxl_width) + pos_x;

        if(pxl_index !== _pxls_hovered && !hide_canvas_content) {

            if(_imported_image_pxls.length > 0){

                let { _imported_image_scale_delta_x, _imported_image_scale_delta_y, _imported_image_start_x, _imported_image_start_y, _imported_image_width, _imported_image_height } = this.state;
                const _imported_image_final_width = _imported_image_width + _imported_image_scale_delta_x;
                const _imported_image_final_height = _imported_image_height + _imported_image_scale_delta_y;

                const [from_x, from_y] = this.state._imported_image_move_from;
                const old_pxl_index = (from_y * pxl_width) + from_x;

                const image_imported_resizer_index = (_imported_image_start_x + _imported_image_final_width) + (_imported_image_start_y + _imported_image_final_height) * pxl_width;
                const _is_on_resize_element = pxl_index === image_imported_resizer_index || old_pxl_index === image_imported_resizer_index;

                if(event_which === 1 && _mouse_down) {

                    const x_difference = pos_x - from_x;
                    const y_difference = pos_y - from_y;
                    let _imported_image_move_from = [pos_x, pos_y];

                    if(!_is_on_resize_element) {

                        _imported_image_start_x += x_difference;
                        _imported_image_start_x = _imported_image_start_x < -_imported_image_final_width ? -_imported_image_final_width: _imported_image_start_x;
                        _imported_image_start_x = _imported_image_start_x >= pxl_width ? pxl_width: _imported_image_start_x;

                        _imported_image_start_y += y_difference;
                        _imported_image_start_y = _imported_image_start_y < -_imported_image_final_height ? -_imported_image_final_height: _imported_image_start_y;
                        _imported_image_start_y = _imported_image_start_y >= pxl_height ? pxl_height: _imported_image_start_y;
                    }else {

                        let _new_imported_image_scale_delta_x = _imported_image_scale_delta_x + x_difference;
                        let _new_imported_image_scale_delta_y = _imported_image_scale_delta_y + y_difference;

                        _new_imported_image_scale_delta_x = Math.max(_new_imported_image_scale_delta_x, -(_imported_image_width - 1));
                        _new_imported_image_scale_delta_y = Math.max(_new_imported_image_scale_delta_y, -(_imported_image_height - 1));

                        _imported_image_move_from = [
                            from_x + (_new_imported_image_scale_delta_x - _imported_image_scale_delta_x),
                            from_y + (_new_imported_image_scale_delta_y - _imported_image_scale_delta_y),
                        ];

                        _imported_image_scale_delta_x = _new_imported_image_scale_delta_x;
                        _imported_image_scale_delta_y = _new_imported_image_scale_delta_y;
                    }

                    this.setState({
                        _pxls_hovered: pxl_index,
                        _is_on_resize_element,
                        _mouse_inside: true,
                        _imported_image_start_x,
                        _imported_image_start_y,
                        _imported_image_scale_delta_x,
                        _imported_image_scale_delta_y,
                        _imported_image_move_from,
                    }, () => {

                        this._request_force_update(() => {

                            this._update_canvas();
                            this._notify_position_change(event, {x:pos_x, y: pos_y});
                        });
                    });
                }else {

                    this.setState({
                        _pxls_hovered: pxl_index,
                        _is_on_resize_element,
                        _mouse_inside: true
                    }, () => {

                        this._request_force_update(() => {

                            this._update_canvas();
                            this._notify_position_change(event, {x:pos_x, y: pos_y});
                        });
                    });
                }

            }else if((tool === "PENCIL" || tool === "PENCIL PERFECT" || tool === "CONTOUR") && event_which === 1 && _mouse_down){

                let { _last_action_timestamp, _paint_or_select_hover_pxl_indexes, _paint_or_select_hover_actions_latest_index, _s_pxls, _s_pxl_colors, _layer_index, pxl_current_opacity } = this.state;
                const { _paint_hover_old_pxls_snapshot } = this.state;
                const _paint_or_select_hover_pxl_indexes_copy = [..._paint_or_select_hover_pxl_indexes];

                // PAINT HACK: compute the pixel between the previous and latest paint by hover pixel (Bresenham’s Line Algorithm)
                if(_paint_or_select_hover_actions_latest_index === -1) {

                    _paint_or_select_hover_actions_latest_index = pxl_index;
                }

                const palette_and_list = this._get_pixels_palette_and_list_from_line(_s_pxls[_layer_index], _paint_or_select_hover_actions_latest_index, pxl_index, _s_pxl_colors[_layer_index], pxl_current_color, pxl_current_opacity);
                _s_pxls[_layer_index] = palette_and_list[0];
                _s_pxl_colors[_layer_index] = palette_and_list[1];

                const { pencil_mirror_mode, _pencil_mirror_index } = this.state;

                const pencil_mirror_x = _pencil_mirror_index % pxl_width;
                const pencil_mirror_y = (_pencil_mirror_index - pencil_mirror_x) / pxl_width;

                if(tool === "CONTOUR") {

                    _last_action_timestamp = 1 / 0;
                    const new_drawn_pxl_indexes = palette_and_list[2];

                    _paint_or_select_hover_pxl_indexes = new Set([..._paint_or_select_hover_pxl_indexes, ...new_drawn_pxl_indexes]);
                    _paint_or_select_hover_pxl_indexes = [..._paint_or_select_hover_pxl_indexes];
                    _paint_or_select_hover_pxl_indexes = new Set(_paint_or_select_hover_pxl_indexes);


                }else if(tool === "PENCIL"){

                    _last_action_timestamp = Date.now();
                    const new_drawn_pxl_indexes = palette_and_list[2];

                    _paint_or_select_hover_pxl_indexes = new Set([..._paint_or_select_hover_pxl_indexes, ...new_drawn_pxl_indexes]);
                    _paint_or_select_hover_pxl_indexes = [..._paint_or_select_hover_pxl_indexes];
                    _paint_or_select_hover_pxl_indexes = new Set(_paint_or_select_hover_pxl_indexes);

                }else if(tool === "PENCIL PERFECT") {

                    _last_action_timestamp = Date.now();
                    const new_drawn_pxl_indexes = palette_and_list[2];

                    _paint_or_select_hover_pxl_indexes = new Set([..._paint_or_select_hover_pxl_indexes, ...new_drawn_pxl_indexes]);
                    _paint_or_select_hover_pxl_indexes = [..._paint_or_select_hover_pxl_indexes];

                    if(this._should_remove_not_perfect_second_latest_pixel_from_array(_paint_or_select_hover_pxl_indexes)) {

                        const second_latest_pixel_drawn = _paint_or_select_hover_pxl_indexes[_paint_or_select_hover_pxl_indexes.length - 2];
                        _paint_or_select_hover_pxl_indexes.splice(- 2, 1);

                        let pixel_index_stack = new Set(new Array([second_latest_pixel_drawn]));

                        [...pixel_index_stack].forEach((pixel_stacked) => {

                            const [s_pos_x, s_pos_y] = pixel_stacked;

                            const y = s_pos_y - (s_pos_y - pencil_mirror_y) * 2;
                            const x = s_pos_x;

                            if(x >= 0 && x < pxl_width && y >= 0 && y <= pxl_height) {

                                pixel_index_stack.add(y * pxl_width + x);

                            }
                        });

                        [...pixel_index_stack].forEach((pixel_stacked) => {

                            const [s_pos_x, s_pos_y] = pixel_stacked;

                            const y = s_pos_y;
                            const x = s_pos_x - (s_pos_x - pencil_mirror_x) * 2;

                            if(x >= 0 && x < pxl_width && y >= 0 && y <= pxl_height) {

                                pixel_index_stack.add(y * pxl_width + x);
                            }
                        });

                        pixel_index_stack.forEach((second_latest_pixel_drawn) => {

                            _s_pxls[_layer_index][second_latest_pixel_drawn] = _paint_hover_old_pxls_snapshot[second_latest_pixel_drawn];
                        });
                    }

                    _paint_or_select_hover_pxl_indexes = new Set(_paint_or_select_hover_pxl_indexes);
                }

                let pixel_stack = new Set([..._paint_or_select_hover_pxl_indexes]
                    .filter((index) => {

                        return !_paint_or_select_hover_pxl_indexes_copy.includes(index);
                    })
                    .map((index) => {

                        const x = index % pxl_width;
                        const y = (index - x) / pxl_width;
                        return [x, y];
                    }));

                if(pencil_mirror_mode === "VERTICAL" || pencil_mirror_mode === "BOTH") {

                    [...pixel_stack].forEach((pixel_stacked) => {

                        const [s_pos_x, s_pos_y] = pixel_stacked;

                        const y = s_pos_y - (s_pos_y - pencil_mirror_y) * 2;
                        const x = s_pos_x;

                        if(x >= 0 && x < pxl_width && y >= 0 && y <= pxl_height) {

                            pixel_stack.add([x, y]);
                        }
                    });
                }

                if(pencil_mirror_mode === "HORIZONTAL" || pencil_mirror_mode === "BOTH") {

                    [...pixel_stack].forEach((pixel_pos) => {

                        const y = pixel_pos[1];
                        const x = pixel_pos[0] - (pixel_pos[0] - pencil_mirror_x) * 2;

                        if(x >= 0 && x < pxl_width && y >= 0 && y <= pxl_height) {

                            pixel_stack.add([x, y]);
                        }
                    });
                }

                [...pixel_stack].forEach((pixel_pos) => {

                    const y = pixel_pos[1];
                    const x = pixel_pos[0];

                    if(x >= 0 && x < pxl_width && y >= 0 && y <= pxl_height) {

                        const index = y * pxl_width + x;

                        const v_pxl_color_index = _s_pxls[_layer_index][index];
                        const v_pxl_color = _s_pxl_colors[_layer_index][v_pxl_color_index];
                        const v_pxl_color_new = this._blend_colors(v_pxl_color, pxl_current_color, pxl_current_opacity, true);

                        // Eventually add current color to color list
                        if (!_s_pxl_colors[_layer_index].includes(v_pxl_color_new)) {

                            _s_pxl_colors[_layer_index].push(v_pxl_color_new);
                        }


                        _s_pxls[_layer_index][index] = _s_pxl_colors[_layer_index].indexOf(v_pxl_color_new);
                    }
                });

                // Update pixels list and pixel colours
                this.setState({
                    _pxls_hovered: pxl_index,
                    _mouse_inside: true,
                    _paint_or_select_hover_pxl_indexes,
                    _s_pxls,
                    _s_pxl_colors,
                    _paint_or_select_hover_actions_latest_index: pxl_index,
                    _last_action_timestamp
                }, () =>{

                    this._request_force_update(() => {

                        this._update_canvas();
                        this._notify_position_change(event, {x:pos_x, y: pos_y});
                    });
                });

            }else if((tool === "SELECT PIXEL" || tool === "SELECT PIXEL PERFECT" || tool === "SELECT PATH") && event_which === 1 && _mouse_down) {

                let { _last_action_timestamp, _s_pxls, _paint_or_select_hover_actions_latest_index, _paint_or_select_hover_pxl_indexes, select_mode, _layer_index } = this.state;
                const { _select_hover_old_pxls_snapshot } = this.state;

                // PAINT HACK: compute the pixel between the previous and latest paint by hover pixel (Bresenham’s Line Algorithm)
                if(_paint_or_select_hover_actions_latest_index === -1) {

                    _paint_or_select_hover_actions_latest_index = pxl_index;
                }

                const palette_and_list = this._get_pixels_palette_and_list_from_line(_s_pxls[_layer_index], _paint_or_select_hover_actions_latest_index, pxl_index);
                const new_drawn_pxl_indexes = palette_and_list[2];

                if(tool === "SELECT PATH") {

                    _last_action_timestamp = 1 / 0;

                    _paint_or_select_hover_pxl_indexes = new Set([..._paint_or_select_hover_pxl_indexes, ...new_drawn_pxl_indexes]);
                    _paint_or_select_hover_pxl_indexes = [..._paint_or_select_hover_pxl_indexes];

                    /*if(this._should_remove_not_perfect_second_latest_pixel_from_array(_paint_or_select_hover_pxl_indexes)) {

                        const pixel_index_to_remove = _paint_or_select_hover_pxl_indexes[_paint_or_select_hover_pxl_indexes.length - 2];

                        if(!_select_hover_old_pxls_snapshot.includes(pixel_index_to_remove) && (select_mode === "ADD" || select_mode === "REPLACE")) {

                            _pxl_indexes_of_selection.delete(pixel_index_to_remove);
                        }

                        _paint_or_select_hover_pxl_indexes.splice(- 2, 1);
                    }*/

                    _paint_or_select_hover_pxl_indexes = new Set(_paint_or_select_hover_pxl_indexes);

                }else if(tool === "SELECT PIXEL"){

                    _last_action_timestamp = Date.now();

                    _paint_or_select_hover_pxl_indexes = new Set([..._paint_or_select_hover_pxl_indexes, ...new_drawn_pxl_indexes]);

                }else if(tool === "SELECT PIXEL PERFECT") {

                    _last_action_timestamp = Date.now();

                    _paint_or_select_hover_pxl_indexes = new Set([..._paint_or_select_hover_pxl_indexes, ...new_drawn_pxl_indexes]);
                    _paint_or_select_hover_pxl_indexes = [..._paint_or_select_hover_pxl_indexes];

                    if(this._should_remove_not_perfect_second_latest_pixel_from_array(_paint_or_select_hover_pxl_indexes)) {

                        const pixel_index_to_remove = _paint_or_select_hover_pxl_indexes[_paint_or_select_hover_pxl_indexes.length - 2];

                        if(!_select_hover_old_pxls_snapshot.includes(pixel_index_to_remove) && (select_mode === "ADD" || select_mode === "REPLACE")) {

                            _pxl_indexes_of_selection.delete(pixel_index_to_remove);
                        }

                        _paint_or_select_hover_pxl_indexes.splice(- 2, 1);
                    }

                    _paint_or_select_hover_pxl_indexes = new Set(_paint_or_select_hover_pxl_indexes);

                }

                if(select_mode === "REPLACE") {

                    _pxl_indexes_of_selection.clear();
                }

                _paint_or_select_hover_pxl_indexes.forEach((new_drawn_index) => {

                    if(select_mode === "ADD" || select_mode === "REPLACE") {

                        _pxl_indexes_of_selection.add(new_drawn_index);
                    }else {

                        _pxl_indexes_of_selection.delete(new_drawn_index);
                    }

                });

                this.setState({
                    _pxls_hovered: pxl_index,
                    _mouse_inside: true,
                    _pxl_indexes_of_selection,
                    _paint_or_select_hover_pxl_indexes,
                    _paint_or_select_hover_actions_latest_index: pxl_index,
                    _last_action_timestamp}, () => {

                    this._request_force_update(() => {

                        this._update_canvas();
                        this._notify_is_something_selected();
                        this._notify_position_change(event, {x:pos_x, y: pos_y});
                    });
                });

            }else {

                const { _s_pxls, _layer_index } = this.state;

                this.setState({
                    _pxls_hovered: pxl_index,
                    _mouse_inside: true,
                    _paint_or_select_hover_actions_latest_index: -1,
                    _paint_hover_old_pxls_snapshot: [..._s_pxls[_layer_index]],
                    _select_hover_old_pxls_snapshot: [..._pxl_indexes_of_selection],
                    _paint_or_select_hover_pxl_indexes: new Set(),
                }, () => {

                    this._request_force_update(() => {

                        this._update_canvas();
                        this._notify_position_change(event, {x:pos_x, y: pos_y});
                    });
                });

            }
        }
    };

    _handle_canvas_mouse_leave = () => {

        this._handle_canvas_mouse_up();

        this.setState({_mouse_down: false, _mouse_inside: false, _pxls_hovered: null}, () => {

            this._update_canvas();
            this._request_force_update();
        });

        this._notify_position_change(null, {x:-1, y: -1});
    }

    _handle_canvas_mouse_up = (event) => {

        let { _paint_or_select_hover_pxl_indexes, tool, _imported_image_pxls } = this.state;

        if(_imported_image_pxls.length > 0){

            this.setState({_imported_image_move_from: [-1, -1], _mouse_down: false});

        }else if(_paint_or_select_hover_pxl_indexes.size > 0 && tool === "CONTOUR") {

            let { _s_pxls, _s_pxl_colors, _layer_index, pxl_current_color, pxl_current_opacity } = this.state;

            const first_drawn_pixel = [..._paint_or_select_hover_pxl_indexes][0];
            const last_drawn_pixel = [..._paint_or_select_hover_pxl_indexes][_paint_or_select_hover_pxl_indexes.size-1];

            const palette_and_list = this._get_pixels_palette_and_list_from_line(_s_pxls[_layer_index], first_drawn_pixel, last_drawn_pixel, _s_pxl_colors[_layer_index], pxl_current_color, pxl_current_opacity);
            const closing_path_line = palette_and_list[2];

            _paint_or_select_hover_pxl_indexes = [..._paint_or_select_hover_pxl_indexes, ...closing_path_line];

            [_s_pxls[_layer_index], _s_pxl_colors[_layer_index]] = this._get_pixels_palette_and_list_from_path(_s_pxls[_layer_index], _paint_or_select_hover_pxl_indexes, _s_pxl_colors[_layer_index], pxl_current_color, pxl_current_opacity);

            this.setState({
                _s_pxls,
                _s_pxl_colors,
                _mouse_down: false,
                _paint_or_select_hover_pxl_indexes: new Set(),
                _last_action_timestamp: Date.now()
            }, () => {

                this._update_canvas();
            });

        }else if(_paint_or_select_hover_pxl_indexes.size > 0 && tool === "SELECT PATH") {

            let { _s_pxls, _pxl_indexes_of_selection, select_mode, _layer_index } = this.state;

            const first_drawn_pixel = [..._paint_or_select_hover_pxl_indexes][0];
            const last_drawn_pixel = [..._paint_or_select_hover_pxl_indexes][_paint_or_select_hover_pxl_indexes.size-1];

            const palette_and_list = this._get_pixels_palette_and_list_from_line(_s_pxls[_layer_index], first_drawn_pixel, last_drawn_pixel);
            const closing_path_line = palette_and_list[2];

            _paint_or_select_hover_pxl_indexes = [..._paint_or_select_hover_pxl_indexes, ...closing_path_line];

            const palette_and_list_from_path = this._get_pixels_palette_and_list_from_path(_s_pxls[_layer_index], _paint_or_select_hover_pxl_indexes);


            if(select_mode === "REPLACE") {

                _pxl_indexes_of_selection.clear();
            }

            palette_and_list_from_path[2].forEach((pxl) => {

                if(select_mode === "ADD" || select_mode === "REPLACE") {

                    _pxl_indexes_of_selection.add(pxl);
                }else {

                    _pxl_indexes_of_selection.delete(pxl);
                }

            });

            this.setState({
                _pxl_indexes_of_selection,
                _mouse_down: false,
                _paint_or_select_hover_pxl_indexes: new Set(),
                _last_action_timestamp: Date.now()
            }, () => {

                this._update_canvas();
                this._notify_is_something_selected();
            });


        }else {

            this.setState({_mouse_down: false});
        }

    };

    _blend_colors(color_a, color_b, amount = 1, should_return_transparent = false) {

        amount = Math.min(Math.max(amount, 0), 1);
        color_a = this._format_color(color_a);
        // If we blend the first color with the second with 0 "force", return transparent
        if(amount === 0 && color_b !== "hover" && should_return_transparent) {

            return "#00000000";
        }

        // Make sure we have a color based on the 4*2 hex char format

        if(color_b === "hover") {

            let [ r, g, b, a ] = this._get_rgba_from_hex(color_a);
            let [ h, s, l ] = this._rgb_to_hsl(r, g, b);

            /*if(a < 20 || (s + Math.abs(50 - l)) < 30) {

                const value_for_rgb = a < 20 ? 128: l > 50 ? 0: 255;

                color_b = "#" + this._get_hex_value_from_rgb_value(value_for_rgb) + this._get_hex_value_from_rgb_value(value_for_rgb) + this._get_hex_value_from_rgb_value(value_for_rgb) + this._get_hex_value_from_rgb_value(255);
            }else {

                color_b = "#" + this._get_hex_value_from_rgb_value(255 - r) + this._get_hex_value_from_rgb_value(255 - g) + this._get_hex_value_from_rgb_value(255 - b) + this._get_hex_value_from_rgb_value(255);
            }*/

            const [ir, ig, ib] = this._hsl_to_rgb((h + 0) % 360, (s + 0) % 100, (l + 50) % 100);
            color_b = this._get_hex_color_from_rgba_values(ir, ig, ib, 255);
        }

        color_b = this._format_color(color_b);
        // If the second color is transparent, return transparent
        if(color_b === "#00000000" && amount === 1 && should_return_transparent) { return "#00000000"; }

        // Extract RGBA from both colors
        let base = this._get_rgba_from_hex(color_a);
        base[3] /= 255;

        let added = this._get_rgba_from_hex(color_b);
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

        return '#' + this._get_hex_value_from_rgb_value(mix[0]) + this._get_hex_value_from_rgb_value(mix[1]) + this._get_hex_value_from_rgb_value(mix[2]) + this._get_hex_value_from_rgb_value(mix[3]);
    }

    _notify_estimate_size = () => {

        if(this.props.on_kb_change) {

            const base64 = this.get_base64_png_data_url(1)
            const bytes = 3 * Math.ceil((base64.length/4));

            this.props.on_kb_change(bytes / 1000);
        }
    };

    _update_canvas = () => {

        // Potentially cancel the latest animation frame (Clear old) and then request a new one that will maybe be rendered
        let { _last_paint_timestamp } = this.state;

        if(_last_paint_timestamp < Date.now()) {

            window.animLoop(() => {

                // Importing state variables
                let { _canvas } = this.state;

                const {
                    select_mode,
                    pencil_mirror_mode,
                    _pencil_mirror_index,
                    _previous_pencil_mirror_axes_indexes,
                    _previous_pencil_mirror_axes_hover_indexes,
                    hide_canvas_content,
                    _was_canvas_content_hidden,
                    px_per_px,
                    _old_pxls,
                    _old_pxl_width,
                    _old_pxl_height,
                    pxl_width,
                    pxl_height,
                    _s_pxl_colors,
                    _layers,
                    _old_layers,
                    _layer_index,
                    _old_pxl_colors,
                    _s_pxls,
                    _old_pxls_hovered,
                    _pxls_hovered,
                    _mouse_inside,
                    tool,
                    _is_there_new_dimension,
                    _shape_index_a,
                    _select_shape_index_a,
                    pxl_current_color,
                    pxl_current_opacity,
                    _pxl_indexes_of_selection,
                    _pxl_indexes_of_selection_drawn,
                    _paint_or_select_hover_pxl_indexes,
                    _previous_mine_player_index,
                    _mine_player_index,
                    _mine_index,
                    _pxls_explosion,
                    _pxl_colors_explosion,
                    _explosion_started_timestamp,
                    _explosion_index,
                    _explosion_width,
                    _explosion_height,
                    _explosion_time,
                    _selection_pair_highlight,
                    _old_selection_pair_highlight,
                } = this.state;


                let {
                    _imported_image_previous_start_x,
                    _imported_image_previous_start_y,
                    _imported_image_start_x,
                    _imported_image_start_y,
                    _imported_image_previous_scale_delta_x,
                    _imported_image_previous_scale_delta_y,
                    _imported_image_scale_delta_x,
                    _imported_image_scale_delta_y,
                    _imported_image_pxls,
                    _imported_image_width,
                    _imported_image_height,
                    _imported_image_pxl_colors,
                    _previous_imported_image_pxls_positioned,
                    _previous_image_imported_resizer_index,
                } = this.state;

                [_imported_image_pxls, _imported_image_pxl_colors, _imported_image_width, _imported_image_height] = this._get_imported_image_scaled(_imported_image_pxls, _imported_image_pxl_colors, _imported_image_width, _imported_image_height, _imported_image_scale_delta_x, _imported_image_scale_delta_y);

                let {
                    _previous_explosion_pxls_positioned
                } = this.state;

                let imported_image_pxls_positioned = [];
                const has_an_image_imported = _imported_image_pxls.length > 0;
                const image_imported_resizer_index = (_imported_image_start_x + _imported_image_width) + (_imported_image_start_y + _imported_image_height) * pxl_width;

                if(has_an_image_imported) {

                    _imported_image_pxls.forEach((pxl, index) => {

                        const pos_x = index % _imported_image_width;
                        const pos_y = (index - pos_x) / _imported_image_width;

                        const current_pos_x_positioned = pos_x + _imported_image_start_x;
                        const current_pos_y_positioned = pos_y + _imported_image_start_y;

                        const imported_image_pxl_positioned_index = current_pos_y_positioned * pxl_width + current_pos_x_positioned;

                        if(current_pos_x_positioned >= 0 && current_pos_x_positioned < pxl_width && current_pos_y_positioned >= 0 && current_pos_y_positioned < pxl_height) {

                            imported_image_pxls_positioned[imported_image_pxl_positioned_index] = pxl;
                        }

                    });
                }

                let explosion_pxls_positioned = [];
                const has_mine_explosion = _explosion_started_timestamp > Date.now() - _explosion_time;
                const mine_explosion_frame = has_mine_explosion ?
                    Math.max(Math.floor(_pxls_explosion.length - Math.floor(_explosion_time / (Date.now() - _explosion_started_timestamp))), 0):
                    0;

                if(has_mine_explosion) {

                    const explosion_x = _explosion_index % pxl_width;
                    const explosion_y = (_explosion_index - explosion_x) / pxl_width;

                    const _explosion_start_x = Math.floor(explosion_x - _explosion_width / 2);
                    const _explosion_start_y = Math.floor(explosion_y - _explosion_height / 2);

                    _pxls_explosion[mine_explosion_frame].forEach((pxl, index) => {

                        const pos_x = index % _explosion_width;
                        const pos_y = (index - pos_x) / _explosion_width;

                        const current_pos_x_positioned = pos_x + _explosion_start_x;
                        const current_pos_y_positioned = pos_y + _explosion_start_y;

                        const explosion_pxl_positioned_index = current_pos_y_positioned * pxl_width + current_pos_x_positioned;

                        if(current_pos_x_positioned >= 0 && current_pos_x_positioned < pxl_width && current_pos_y_positioned >= 0 && current_pos_y_positioned < pxl_height) {

                            explosion_pxls_positioned[explosion_pxl_positioned_index] = pxl;
                        }


                    });
                }

                let pencil_mirror_axes_hover_indexes = new Set();
                let pencil_mirror_axes_indexes = new Set();

                const pencil_mirror_x = _pencil_mirror_index % pxl_width;
                const pencil_mirror_y = (_pencil_mirror_index - pencil_mirror_x) / pxl_width;

                const pencil_mirror_hover_x = _pxls_hovered % pxl_width;
                const pencil_mirror_hover_y = (_pxls_hovered - pencil_mirror_hover_x) / pxl_width;


                if((pencil_mirror_mode === "HORIZONTAL" || pencil_mirror_mode === "BOTH") && tool.includes("PENCIL")) {

                    for(let i = 0; i < pxl_height; i++) {

                        if(_pencil_mirror_index !== -1) {

                            pencil_mirror_axes_indexes.add(i * pxl_width + pencil_mirror_x);
                        }
                        if(tool === "SET PENCIL MIRROR" && _pxls_hovered !== null) {

                            pencil_mirror_axes_hover_indexes.add(i * pxl_width + pencil_mirror_hover_x);
                        }
                    }

                }
                if((pencil_mirror_mode === "VERTICAL" || pencil_mirror_mode === "BOTH") && tool.includes("PENCIL")) {

                    for(let i = 0; i < pxl_width; i++) {

                        if(_pencil_mirror_index !== -1) {

                            pencil_mirror_axes_indexes.add(i + pencil_mirror_y * pxl_width);
                        }
                        if(tool === "SET PENCIL MIRROR" && _pxls_hovered !== null) {

                            pencil_mirror_axes_hover_indexes.add(i + pencil_mirror_hover_y * pxl_width);
                        }
                    }

                }

                let pixel_updated = 0;
                const is_there_new_dimension = _is_there_new_dimension || _old_pxl_width !== pxl_width || _old_pxl_height !== pxl_height;
                const has_new_pixel_hovered = _old_pxls_hovered !== _pxls_hovered;
                const has_new_mine_player_index = _previous_mine_player_index !== _mine_player_index;

                // Only operate on canvas context if existing
                let _ctx = _canvas ? _canvas.context2d : null;
                if (_ctx) {


                    _ctx.globalCompositeOperation = "source-out";
                    let image_data = hide_canvas_content ?
                        new ImageData(pxl_width, pxl_height):
                        _ctx.getImageData(0, 0, pxl_width, pxl_height);

                    let pxl_indexes_of_old_shape = this.state._pxl_indexes_of_old_shape;
                    let pxl_indexes_of_current_shape = new Set();

                    if((tool === "LINE" || tool === "RECTANGLE" || tool === "ELLIPSE" || tool === "TRIANGLE") && _shape_index_a !== -1) {

                        const palette_and_list_of_current_shape =
                            tool === "LINE" ?
                                this._get_pixels_palette_and_list_from_line(_s_pxls[_layer_index], _shape_index_a, _pxls_hovered, _s_pxl_colors[_layer_index], pxl_current_color, pxl_current_opacity):
                                tool === "RECTANGLE" ?
                                    this._get_pixels_palette_and_list_from_rectangle(_s_pxls[_layer_index], _shape_index_a, _pxls_hovered, _s_pxl_colors[_layer_index], pxl_current_color, pxl_current_opacity):
                                    tool === "ELLIPSE" ?
                                        this._get_pixels_palette_and_list_from_ellipse(_s_pxls[_layer_index], _shape_index_a, _pxls_hovered, _s_pxl_colors[_layer_index], pxl_current_color, pxl_current_opacity):
                                        this._get_pixels_palette_and_list_from_ellipse(_s_pxls[_layer_index], _shape_index_a, _pxls_hovered, _s_pxl_colors[_layer_index], pxl_current_color, pxl_current_opacity);

                        pxl_indexes_of_current_shape = new Set([...palette_and_list_of_current_shape[2]]);

                    }else if ((tool === "SELECT LINE" || tool === "SELECT RECTANGLE" || tool === "SELECT ELLIPSE") && _select_shape_index_a !== -1) {

                        const palette_and_list_of_current_selection_shape =
                            tool === "SELECT LINE" ?
                                this._get_pixels_palette_and_list_from_line(_s_pxls[_layer_index], _select_shape_index_a, _pxls_hovered):
                                tool === "SELECT RECTANGLE" ?
                                    this._get_pixels_palette_and_list_from_rectangle(_s_pxls[_layer_index], _select_shape_index_a, _pxls_hovered):
                                    tool === "SELECT ELLIPSE" ?
                                        this._get_pixels_palette_and_list_from_ellipse(_s_pxls[_layer_index], _select_shape_index_a, _pxls_hovered):
                                        this._get_pixels_palette_and_list_from_ellipse(_s_pxls[_layer_index], _select_shape_index_a, _pxls_hovered);

                        pxl_indexes_of_current_shape = new Set([...palette_and_list_of_current_selection_shape[2]]);
                    }else if((tool === "SELECT PATH" || tool === "CONTOUR") && _paint_or_select_hover_pxl_indexes.size > 0) {

                        const first_drawn_pixel = [..._paint_or_select_hover_pxl_indexes][0];
                        const last_drawn_pixel = [..._paint_or_select_hover_pxl_indexes][_paint_or_select_hover_pxl_indexes.size-1];

                        const palette_and_list = this._get_pixels_palette_and_list_from_line(_s_pxls[_layer_index], first_drawn_pixel, last_drawn_pixel, _s_pxl_colors[_layer_index], pxl_current_color, pxl_current_opacity);
                        const closing_path_line = palette_and_list[2];

                        if(select_mode === "REMOVE" && tool === "SELECT PATH") {

                            closing_path_line.forEach((pxl_index) => {

                                _pxl_indexes_of_selection.delete(pxl_index);


                            });
                        }else {

                            closing_path_line.forEach((pxl_index) => {

                                if(tool === "SELECT PATH") {

                                    _pxl_indexes_of_selection.add(pxl_index);
                                }else {

                                    pxl_indexes_of_current_shape.add(pxl_index);
                                }
                            });
                        }
                    }


                    const has_new_layer = (_layers.length !== _old_layers.length);
                    let has_layers_visibility_or_opacity_changed = has_new_layer;

                    for (let i = 0; i < _layers.length ; i++) {

                        if(!has_new_layer) {
                            if(_layers[i].hidden !== _old_layers[i].hidden || _layers[i].opacity !== _old_layers[i].opacity || _layers[i].id !== _old_layers[i].id){

                                has_layers_visibility_or_opacity_changed = true;
                            }
                        }

                    }

                    // This is a list of color index that we explore
                    _s_pxls[_layer_index].forEach((pxl, index) => {

                        const is_in_image_imported = has_an_image_imported && typeof imported_image_pxls_positioned[index] !== "undefined";
                        const was_in_image_imported = typeof _previous_imported_image_pxls_positioned[index] !== "undefined";

                        const is_in_image_imported_resizer = has_an_image_imported && image_imported_resizer_index === index;
                        const was_in_image_imported_resizer = _previous_image_imported_resizer_index === index;

                        const is_in_explosion = typeof explosion_pxls_positioned[index] !== "undefined";
                        const was_in_explosion = typeof _previous_explosion_pxls_positioned[index] !== "undefined";


                        const pos_x = index % pxl_width;
                        const pos_y = (index - pos_x) / pxl_width;

                        const is_pixel_hovered = _pxls_hovered === index;
                        const is_the_old_pixel_hovered_to_paint = (index === _old_pxls_hovered && has_new_pixel_hovered) || (index === _pxls_hovered);

                        const is_mine_player_index = _mine_player_index === index;
                        const is_the_old_mine_player_index_to_paint = (index === _previous_mine_player_index && has_new_mine_player_index);

                        const is_in_the_old_shape = pxl_indexes_of_old_shape.has(index);
                        const is_in_the_current_shape = pxl_indexes_of_current_shape.has(index);
                        const is_in_the_current_selection = _pxl_indexes_of_selection.has(index);
                        const is_current_selection_hovered = _pxl_indexes_of_selection.has(_pxls_hovered);
                        const was_current_selection_hovered = _pxl_indexes_of_selection.has(_old_pxls_hovered);
                        const is_current_selection_hovered_changes = is_current_selection_hovered !== was_current_selection_hovered;
                        const is_in_the_old_selection_drawn = _pxl_indexes_of_selection_drawn.has(index);
                        const is_selected_and_hovered_recently = (is_in_the_current_selection && (is_pixel_hovered || is_the_old_pixel_hovered_to_paint));
                        const is_selected_and_to_paint_again = is_in_the_current_selection && _selection_pair_highlight !== _old_selection_pair_highlight;
                        const is_ancient_selected_pixel_waiting_to_update = (is_in_the_old_selection_drawn && !is_in_the_current_selection);
                        const is_in_pencil_mirror_axes_hover_indexes = pencil_mirror_axes_hover_indexes.has(index);
                        const was_in_pencil_mirror_axes_hover_indexes = _previous_pencil_mirror_axes_hover_indexes.has(index);
                        const is_in_pencil_mirror_axes_indexes = pencil_mirror_axes_indexes.has(index);
                        const is_an_old_pencil_mirror_axes_pixel_to_paint = _previous_pencil_mirror_axes_indexes.has(index) && _previous_pencil_mirror_axes_indexes !== pencil_mirror_axes_indexes;
                        const is_a_new_pixel_to_paint = (was_in_pencil_mirror_axes_hover_indexes && !is_in_pencil_mirror_axes_hover_indexes) || is_an_old_pencil_mirror_axes_pixel_to_paint || was_in_explosion !== is_in_explosion || is_in_explosion || was_in_image_imported || is_in_image_imported || (was_in_image_imported_resizer && !is_in_image_imported_resizer) || is_there_new_dimension || has_layers_visibility_or_opacity_changed || pxl !== _old_pxls[index] || _old_pxl_colors[pxl] !== _s_pxl_colors[_layer_index][pxl];
                        const pixel_hover_exception = tool === "ELLIPSE" && pxl_indexes_of_current_shape.size > 0;

                        if (
                            _is_there_new_dimension ||
                            is_in_pencil_mirror_axes_hover_indexes ||
                            is_in_pencil_mirror_axes_indexes ||
                            (!hide_canvas_content && _was_canvas_content_hidden) ||
                            (is_current_selection_hovered_changes && is_in_the_current_selection) ||
                            is_selected_and_to_paint_again ||
                            is_ancient_selected_pixel_waiting_to_update ||
                            is_the_old_pixel_hovered_to_paint ||
                            is_a_new_pixel_to_paint ||
                            (is_pixel_hovered && !pixel_hover_exception) ||
                            is_mine_player_index ||
                            is_in_the_old_shape ||
                            is_in_the_current_shape ||
                            (is_in_the_current_selection && !is_in_the_old_selection_drawn) ||
                            is_selected_and_hovered_recently ||
                            is_the_old_mine_player_index_to_paint ||
                            is_in_image_imported_resizer && (_selection_pair_highlight !== _old_selection_pair_highlight)
                        ) {

                            if(!hide_canvas_content) {

                                let layer_pixel_colors = [];
                                let start_i = -1;
                                start_i++;

                                for (let i = _s_pxl_colors.length - 1; i >= 0; i--) {

                                    const layer_pixel_color = _s_pxl_colors[i][_s_pxls[i][index]];
                                    layer_pixel_colors[i] = layer_pixel_color;
                                    const [r, g, b, a] = layer_pixel_color;

                                    if(a === 255 && _layers[i].opacity === 1) {

                                        start_i = i;
                                        break;
                                    }

                                }

                                let pixel_color_hex = "#00000000";

                                for (let i = start_i; i < _s_pxl_colors.length ; i++) {

                                    if(!_layers[i].hidden) {

                                        const layer_pixel_color = layer_pixel_colors[i];

                                        pixel_color_hex = this._blend_colors(pixel_color_hex, layer_pixel_color, _layers[i].opacity, false);

                                        if(is_in_image_imported && i === _layer_index) {

                                            pixel_color_hex = this._blend_colors(pixel_color_hex, _imported_image_pxl_colors[imported_image_pxls_positioned[index]], 1, false);
                                        }

                                    }

                                    if(is_in_explosion && i === _layers.length -1) {

                                        pixel_color_hex = this._blend_colors(pixel_color_hex, _pxl_colors_explosion[mine_explosion_frame][explosion_pxls_positioned[index]], 1, false);
                                    }

                                }

                                let color =
                                    is_in_pencil_mirror_axes_hover_indexes ||
                                    is_in_pencil_mirror_axes_indexes ||
                                    (is_pixel_hovered || is_mine_player_index) ||
                                    (_mouse_inside && is_in_the_current_shape) ||
                                    (is_in_the_current_selection && !is_in_the_old_selection_drawn) ||
                                    (is_a_new_pixel_to_paint && is_in_the_current_selection) ||
                                    is_selected_and_hovered_recently ?
                                        is_pixel_hovered || is_mine_player_index || is_in_pencil_mirror_axes_indexes ?
                                            this._blend_colors(pixel_color_hex, "hover", 2/3, false):
                                            this._blend_colors(pixel_color_hex, "hover", 1/3, false)
                                        : pixel_color_hex;

                                if(is_the_old_mine_player_index_to_paint || is_ancient_selected_pixel_waiting_to_update || (is_a_new_pixel_to_paint && !is_in_the_current_selection && !is_pixel_hovered && !is_in_pencil_mirror_axes_indexes)) {

                                    color = pixel_color_hex;
                                }

                                if((is_in_image_imported_resizer)) {

                                    const opacity = is_pixel_hovered ?
                                        2/3 + (0 + ((pos_x + pos_y + (_selection_pair_highlight ? 1: 0)) % 2)) / 3:
                                        1/3 + (0 + ((pos_x + pos_y + (_selection_pair_highlight ? 1: 0)) % 2)) / 3;
                                    color = this._blend_colors(pixel_color_hex, "hover", opacity, false);
                                }

                                if(is_in_the_current_selection && !is_in_the_current_shape && !is_pixel_hovered) {

                                    const opacity = 0 + (0 + ((pos_x + pos_y + (_selection_pair_highlight ? 1: 0)) % 2)) / 5;
                                    color = this._blend_colors(pixel_color_hex, "hover", opacity, false);
                                }

                                // We need to clear the pixel that won't totally be opaque because it can merge colors accidentally
                                const [r, g, b, a] = this._get_rgba_from_hex(color);

                                image_data.data[index * 4 + 0] = r;
                                image_data.data[index * 4 + 1] = g;
                                image_data.data[index * 4 + 2] = b;
                                image_data.data[index * 4 + 3] = a;

                                //_ctx.clearRect(pos_x * px_per_px, pos_y * px_per_px, px_per_px, px_per_px);
                                // Paint the square of real pixels from the virtual ones along with the resolution
                                //_ctx.fillStyle = color;
                                //_ctx.fillRect(pos_x * px_per_px, pos_y * px_per_px, px_per_px, px_per_px);
                                pixel_updated++;
                            }
                        }

                    });

                    _ctx.putImageData(image_data, 0, 0);

                    this.setState({
                        _pxl_indexes_of_selection_drawn: new Set([..._pxl_indexes_of_selection]),
                        _pxl_indexes_of_old_shape: new Set([...pxl_indexes_of_current_shape]),
                        _is_there_new_dimension: false,
                        _imported_image_previous_start_x: _imported_image_start_x,
                        _imported_image_previous_start_y: _imported_image_start_y,
                        _imported_image_previous_scale_delta_x: _imported_image_scale_delta_x,
                        _imported_image_previous_scale_delta_y: _imported_image_scale_delta_y,
                        _previous_pencil_mirror_axes_indexes: new Set([...pencil_mirror_axes_indexes]),
                        _previous_pencil_mirror_axes_hover_indexes: new Set([...pencil_mirror_axes_hover_indexes]),
                        _previous_explosion_pxls_positioned: [...explosion_pxls_positioned],
                        _previous_imported_image_pxls_positioned: [...imported_image_pxls_positioned],
                        _previous_image_imported_resizer_index: image_imported_resizer_index,
                        _old_selection_pair_highlight: _selection_pair_highlight,
                        _old_layers: [..._layers],
                        _old_pxls: [..._s_pxls[_layer_index]],
                        _old_pxl_colors: [..._s_pxl_colors[_layer_index]],
                        _old_pxl_width: pxl_width,
                        _old_pxl_height: pxl_height,
                        _previous_mine_player_index: _mine_player_index,
                        _old_pxls_hovered: _pxls_hovered,
                        _was_canvas_content_hidden: hide_canvas_content && !_was_canvas_content_hidden,
                        _last_paint_timestamp: Date.now()
                    }, () => {

                        window.caf_id = null;
                    });
                }

            });
        }
    };

    _array_push_fixed_length = (array, max_length, element) => {

        let has_new_length = false;

        if(array.length >= max_length) {

            array.push(element);
            array.shift();
        }else {

            array.push(element);
            has_new_length = true;
        }

        return [
            array,
            has_new_length
        ];
    };

    _maybe_save_state = (save_pending_data) => {

        const { pxl_width, pxl_height, _s_pxls, _original_image_index, _s_pxl_colors, _layers, _layer_index, _pxl_indexes_of_selection, _last_action_timestamp, _json_state_history, _state_history_length, _undo_buffer_time_ms, _pencil_mirror_index } = this.state;

        let {state_history, history_position, previous_history_position} = JSON.parse(_json_state_history);

        const current_state = {
            pxl_width,
            pxl_height,
            _original_image_index,
            _layers: _layers.map((l) => {
                return {
                    id: l.id,
                    name: l.name,
                    hidden: l.hidden,
                    opacity: l.opacity
                }
            }),
            _layer_index,
            _s_pxls: [..._s_pxls],
            _s_pxl_colors: [..._s_pxl_colors],
            _pxl_indexes_of_selection: [..._pxl_indexes_of_selection].sort((a, b) => a - b),
            _pencil_mirror_index,
        };

        if(!state_history.length) { // Fist state

            const [ array ] = this._array_push_fixed_length(state_history, _state_history_length, current_state);
            state_history = array;

            const new_json_state_history = JSON.stringify({previous_history_position, history_position, state_history});

            this.setState({_json_state_history: new_json_state_history});
            return new_json_state_history;

        }else {

            const current_state_size = state_history.length - 1;
            const back_in_history_of = current_state_size - history_position;
            const previous_state_index = current_state_size - back_in_history_of;
            const previous_state = state_history[previous_state_index];

            if(JSON.stringify(previous_state) !== JSON.stringify(current_state) && (_last_action_timestamp + _undo_buffer_time_ms < Date.now() || save_pending_data)) {

                // An action must have been performed and the last action must be older of 1 sec
                if(back_in_history_of) {

                    state_history = state_history.slice(0, history_position + 1);
                }

                const [ array, has_new_length ] = this._array_push_fixed_length(state_history, _state_history_length, current_state);
                state_history = array;
                previous_history_position = history_position;
                history_position = has_new_length ? history_position + 1: history_position;

                const new_json_state_history = JSON.stringify({previous_history_position, history_position, state_history});

                this.setState({_json_state_history: new_json_state_history}, () => {

                    this._notify_can_undo_redo_change();
                });
                return new_json_state_history;
            }

            return null;
        }

        return null;
    };
    
    _notify_relevant_action_event = (event, color = "#ffffffff", opacity = 1) => {
      
        if(this.props.onRelevantActionEvent) {
            
            this.props.onRelevantActionEvent(event, color, opacity);
        }
    };

    _notify_position_change = (event, position) => {

        if(this.props.onPositionChange) {

            position = {
                x: typeof position.x === "undefined" ? -1: position.x,
                y: typeof position.y === "undefined" ? -1: position.y,
            };

            this.props.onPositionChange(position);
        }
    };

    _notify_current_color_change = (color, event = null) => {

        if(this.props.onCurrentColorChange) {

            this.props.onCurrentColorChange(color, event);
        } else {

            this.setState({pxl_current_color: color});
        }
    };

    _notify_is_something_selected = () => {

        const { _pxl_indexes_of_selection } = this.state;

        if(this.props.onSomethingSelectedChange) {

            this.props.onSomethingSelectedChange(Boolean(_pxl_indexes_of_selection.size));
        }
    };

    _notify_image_load_complete = () => {

        if(this.props.onImageLoadComplete) { this.props.onImageLoadComplete(); }
    };

    _notify_image_import_complete = () => {

        if(this.props.onImageImportComplete) { this.props.onImageImportComplete(); }
    };

    _notify_can_undo_redo_change = () => {

        const can_undo = this._can_undo();
        const can_redo = this._can_redo();

        if(this.props.onCanUndoRedoChange) { this.props.onCanUndoRedoChange(can_undo, can_redo); }

        this._notify_layers_and_compute_thumbnails_change();
    };

    _notify_size_change = () => {

        const { pxl_width, pxl_height } = this.state;

        if(this.props.onSizeChange) { this.props.onSizeChange(pxl_width, pxl_height); }

        this._update_screen_zoom_ratio(true);
    };

    _can_undo = () => {

        const { _json_state_history } = this.state;
        const {state_history, history_position} = JSON.parse(_json_state_history);
        const current_state_size = state_history.length - 1;
        const back_in_history_of = current_state_size - history_position;

        return current_state_size - back_in_history_of > 0;
    };

    undo = () => {

        const is_pending_save_data = this._maybe_save_state(true);
        const _json_state_history = is_pending_save_data === null ? this.state._json_state_history: is_pending_save_data;

        let {state_history, history_position, previous_history_position} = JSON.parse(_json_state_history);

        if(this._can_undo() || is_pending_save_data){

            previous_history_position = history_position;
            history_position--;
            const { _original_image_index, pxl_width, pxl_height, _pxl_indexes_of_selection, _s_pxl_colors, _s_pxls, _layers, _layer_index, _pencil_mirror_index } = state_history[history_position];;
            const new_json_state_history = JSON.stringify({state_history, history_position, previous_history_position});

            this.setState({
                _original_image_index: - 1,
                _pencil_mirror_index,
                pxl_width,
                pxl_height,
                _s_pxls,
                _s_pxl_colors,
                _pxl_indexes_of_selection_drawn: this.state._pxl_indexes_of_selection,
                _pxl_indexes_of_selection: new Set([..._pxl_indexes_of_selection]),
                _layers,
                _old_layers: [...this.state._layers],
                _layer_index,
                _json_state_history: new_json_state_history,
            }, () => {

                this._request_force_update(() =>{

                    this.setState({_original_image_index});
                    this._notify_size_change();
                    this._notify_layers_and_compute_thumbnails_change();
                    this._notify_can_undo_redo_change();
                    this._notify_is_something_selected();
                    this._update_canvas();
                });
            });
        }
    };

    _can_redo = () => {

        const { _json_state_history } = this.state;
        const {state_history, history_position} = JSON.parse(_json_state_history);

        return state_history.length - 1 > history_position;
    }

    redo = () => {

        const is_pending_save_data = this._maybe_save_state(true);
        const _json_state_history = is_pending_save_data === null ? this.state._json_state_history: is_pending_save_data;

        let {state_history, history_position, previous_history_position} = JSON.parse(_json_state_history);

        if (this._can_redo()) {

            previous_history_position = history_position;
            history_position++;
            const { _original_image_index, pxl_width, pxl_height, _pxl_indexes_of_selection, _s_pxl_colors, _s_pxls, _layers, _layer_index, _pencil_mirror_index } = state_history[history_position];

            const new_json_state_history = JSON.stringify({state_history, history_position, previous_history_position});

            this.setState({
                _original_image_index: - 1,
                _pencil_mirror_index,
                pxl_width,
                pxl_height,
                _s_pxls,
                _s_pxl_colors,
                _pxl_indexes_of_selection_drawn: this.state._pxl_indexes_of_selection,
                _pxl_indexes_of_selection: new Set([..._pxl_indexes_of_selection]),
                _layers,
                _old_layers: [...this.state._layers],
                _layer_index,
                _json_state_history: new_json_state_history,
            }, () => {

                this._request_force_update(() => {

                    this.setState({_original_image_index});
                    this._notify_size_change();
                    this._notify_layers_and_compute_thumbnails_change();
                    this._notify_can_undo_redo_change();
                    this._notify_is_something_selected();
                    this._update_canvas();
                });
            });

        }
    }

    to_selection_border = () => {

        const { _s_pxls, pxl_width, pxl_height, _pxl_indexes_of_selection, _s_pxl_colors, _layer_index, pxl_current_color, pxl_current_opacity } = this.state;

        let pxls = [..._s_pxls[_layer_index]];
        let pxl_colors = [..._s_pxl_colors[_layer_index]];
        let pxls_of_the_border = this._get_border_from_selection(_pxl_indexes_of_selection);

        pxls_of_the_border.forEach((pxl_index) => {

            const current_pxl_color_index = pxls[pxl_index];
            const current_pxl_color = pxl_colors[current_pxl_color_index];
            const current_pxl_new_color = this._blend_colors(current_pxl_color, pxl_current_color, pxl_current_opacity);

            // Eventually add current color to color list
            if(!pxl_colors.includes(current_pxl_new_color)){

                pxl_colors.push(current_pxl_new_color);
            }

            const current_pxl_new_color_index = pxl_colors.indexOf(current_pxl_new_color);
            pxls[pxl_index] = current_pxl_new_color_index;
        });

        let ns_pxl_colors = this.state._s_pxl_colors;
        ns_pxl_colors[_layer_index] = pxl_colors;

        let ns_pxls = this.state._s_pxls;
        ns_pxls[_layer_index] = pxls;

        this.setState({_s_pxl_colors: ns_pxl_colors, _s_pxls: ns_pxls, _last_action_timestamp: Date.now()}, () => {

            this._update_canvas();
        });
    }

    to_selection_bucket = () => {

        const { _s_pxls, pxl_width, pxl_height, _pxl_indexes_of_selection, _s_pxl_colors, _layer_index, pxl_current_color, pxl_current_opacity } = this.state;

        let pxls = [..._s_pxls[_layer_index]];
        let pxl_colors = [..._s_pxl_colors[_layer_index]];

        let pxl_indexes_of_selection = [..._pxl_indexes_of_selection];
        pxl_indexes_of_selection.forEach((pxl_index) => {

            const current_pxl_color_index = pxls[pxl_index];
            const current_pxl_color = pxl_colors[current_pxl_color_index];
            const current_pxl_new_color = this._blend_colors(current_pxl_color, pxl_current_color, pxl_current_opacity);

            // Eventually add current color to color list
            if(!pxl_colors.includes(current_pxl_new_color)){

                pxl_colors.push(current_pxl_new_color);
            }

            const current_pxl_new_color_index = pxl_colors.indexOf(current_pxl_new_color);
            pxls[pxl_index] = current_pxl_new_color_index;
        });

        let ns_pxl_colors = this.state._s_pxl_colors;
        ns_pxl_colors[_layer_index] = pxl_colors;

        let ns_pxls = this.state._s_pxls;
        ns_pxls[_layer_index] = pxls;

        this.setState({_s_pxl_colors: ns_pxl_colors, _s_pxls: ns_pxls, _last_action_timestamp: Date.now()}, () => {

            this._update_canvas();
        });
    }

    to_selection_invert = () => {

        const { _s_pxls, _pxl_indexes_of_selection, _layer_index } = this.state;

        const pxl_indexes_of_selection_set = new Set([..._pxl_indexes_of_selection]);
        let pxl_indexes_of_selection = new Set();

        for (let i = 0; i < _s_pxls[_layer_index].length; i++) {

            if(!pxl_indexes_of_selection_set.has(i)) {
                pxl_indexes_of_selection.add(i);
            }
        }

        this.setState({_pxl_indexes_of_selection: pxl_indexes_of_selection, _last_action_timestamp: Date.now()}, () => {

            this._update_canvas();
        });
    }


    to_selection_changes = (hue = 0, saturation = 0, luminosity = 0) => {

        const { _s_pxls, _pxl_indexes_of_selection, _s_pxl_colors, _layer_index } = this.state;

        let pxls = [..._s_pxls[_layer_index]];
        let pxl_colors = [..._s_pxl_colors[_layer_index]];

        [..._pxl_indexes_of_selection].forEach((pxl_index, iteration, array) => {

            hue = hue < 0 ? 360 - (hue % 360): hue;

            const current_pxl_color_index = pxls[pxl_index];
            const current_pxl_color = pxl_colors[current_pxl_color_index];

            const [cpc_r, cpc_g, cpc_b, cpc_a] = this._get_rgba_from_hex(current_pxl_color);
            let [cpc_h, cpc_s, cpc_l] = this._rgb_to_hsl(cpc_r, cpc_g, cpc_b);

            cpc_h = (cpc_h + hue) % 360;
            cpc_s = Math.min(Math.max(cpc_s + saturation / 2, 0), 100);
            cpc_l = Math.min(Math.max(cpc_l + luminosity / 2, 0), 100);

            const [r, g, b] = this._hsl_to_rgb(cpc_h, cpc_s, cpc_l);

            const current_pxl_new_color = "#" + this._get_hex_value_from_rgb_value(r) + this._get_hex_value_from_rgb_value(g) + this._get_hex_value_from_rgb_value(b) + this._get_hex_value_from_rgb_value(cpc_a);

            // Eventually add current color to color list
            if(!pxl_colors.includes(current_pxl_new_color)){

                pxl_colors.push(current_pxl_new_color);
            }

            const current_pxl_new_color_index = pxl_colors.indexOf(current_pxl_new_color);
            pxls[pxl_index] = current_pxl_new_color_index;

        });

        let ns_pxl_colors = this.state._s_pxl_colors;
        ns_pxl_colors[_layer_index] = pxl_colors;

        let ns_pxls = this.state._s_pxls;
        ns_pxls[_layer_index] = pxls;

        this.setState({_s_pxl_colors: ns_pxl_colors, _s_pxls: ns_pxls, _last_action_timestamp: Date.now()}, () => {

            this._update_canvas();
        });
    };

    _get_border_from_selection = (selection, inside = true, bold = false) => {

        const { pxl_width, pxl_height } = this.state;

        let pxls_of_the_border = [];

        [...selection].forEach((pxl_index, iteration, array) => {

            let up, right, bottom, left;

            up = pxl_index - pxl_width; up = up < 0 ? -1: up;
            right = pxl_index + 1; right = right % pxl_width === 0 ? -1: right;
            bottom = pxl_index + pxl_width; bottom = bottom > (pxl_width * pxl_height) ? -1: bottom;
            left = pxl_index - 1; left = left % pxl_width === pxl_width - 1 ? -1: left;

            let up_left, up_right, bottom_left, bottom_right;

            up_left = up - 1; up_left = up === -1 || left === -1 ? -1: up_left;
            up_right = up + 1; up_right = up === -1 || right === -1 ? -1: up_right;
            bottom_left = bottom - 1; bottom_left = bottom === -1 || left === -1 ? -1: bottom_left;
            bottom_right = bottom + 1; bottom_right = bottom === -1 || right === -1 ? -1: bottom_right;

            if(!inside) {

                if(-1 === array.indexOf(up)){
                    pxls_of_the_border.push(up)
                }
                if(-1 === array.indexOf(right)){
                    pxls_of_the_border.push(right)
                }
                if(-1 === array.indexOf(bottom)){
                    pxls_of_the_border.push(bottom)
                }
                if(-1 === array.indexOf(left)){
                    pxls_of_the_border.push(left)
                }

                if(bold) {

                    if(-1 === array.indexOf(up_left)){

                        pxls_of_the_border.push(up_left)
                    }
                    if(-1 === array.indexOf(up_right)){
                        pxls_of_the_border.push(up_right)
                    }
                    if(-1 === array.indexOf(bottom_left)){
                        pxls_of_the_border.push(bottom_left)
                    }
                    if(-1 === array.indexOf(bottom_right)){
                        pxls_of_the_border.push(bottom_right)
                    }
                }

            }else {
                if(
                    -1 === array.indexOf(up) || -1 === up ||
                    -1 === array.indexOf(right) || -1 === right ||
                    -1 === array.indexOf(bottom) || -1 === bottom ||
                    -1 === array.indexOf(left) || -1 === left
                ) {

                    pxls_of_the_border.push(pxl_index);
                }

                if(bold) {

                    if(
                        -1 === array.indexOf(up_left) || -1 === up_left ||
                        -1 === array.indexOf(up_right) || -1 === up_right ||
                        -1 === array.indexOf(bottom_left) || -1 === bottom_left ||
                        -1 === array.indexOf(bottom_right) || -1 === bottom_right
                    ) {

                        pxls_of_the_border.push(pxl_index);
                    }

                }
            }

        });

        return pxls_of_the_border;
    };

    _to_selection_crop = () => {

        let { _s_pxls, _s_pxl_colors, _layer_index, _pxl_indexes_of_selection, pxl_width, pxl_height, _base64_original_images, _original_image_index } = this.state;

        if(_pxl_indexes_of_selection.size > 0) {

            let ns_pxls = [..._s_pxls];
            let ns_pxl_colors = [..._s_pxl_colors];

            let top_left = [pxl_width, pxl_height];
            let bottom_right = [-1, -1];

            _pxl_indexes_of_selection.forEach((pxl_index) => {

                const x = pxl_index % pxl_width;
                const y = (pxl_index - x) / pxl_width;

                if (x < top_left[0]) {
                    top_left[0] = x
                }
                if (y < top_left[1]) {
                    top_left[1] = y
                }

                if (x > bottom_right[0]) {
                    bottom_right[0] = x
                }
                if (y > bottom_right[1]) {
                    bottom_right[1] = y
                }

            });

            const new_width = 1 + bottom_right[0] - top_left[0];
            const new_height = 1 + bottom_right[1] - top_left[1];

            for (let l = 0; l < _s_pxls.length; l++) {

                let pxls = _s_pxls[l];
                let new_pxls = new Array(new_width * new_height);
                let new_pxl_colors = [];

                for (let i = 0; i < new_width * new_height; i++) {

                    let x = i % new_width;
                    let y = (i - x) / new_width;

                    x += top_left[0];
                    y += top_left[1];

                    const index = y * pxl_width + x;

                    new_pxls[i] = pxls[index];
                }

                [new_pxls, new_pxl_colors] = this._remove_duplicate_pxl_colors(new_pxls, _s_pxl_colors[l]);
                ns_pxls[l] = new_pxls;
                ns_pxl_colors[l] = new_pxl_colors;
            }

            if (typeof _base64_original_images[_original_image_index] !== "undefined") {


                let image = new Image();
                image.onload = () => {

                    const s_width = image.width * (new_width / pxl_width);
                    const s_height = image.height * (new_height / pxl_height);

                    let [ctx, canvas] = this._get_new_ctx_from_canvas(s_width, s_height);

                    ctx.save();
                    ctx.drawImage(
                        image,
                        image.width * (top_left[0] / pxl_width),
                        image.height * (top_left[1] / pxl_height),
                        s_width,
                        s_height,
                        0,
                        0,
                        s_width,
                        s_height
                    );
                    ctx.restore();

                    const base64_original_image = image.src.includes("image/png") ?
                        canvas.toDataURL("image/png") :
                        canvas.toDataURL("image/jpeg");

                    const new_base64_original_images = !_base64_original_images.includes(base64_original_image) ?
                        _base64_original_images.concat([base64_original_image]) :
                        _base64_original_images;


                    this.setState({
                        _s_pxls: ns_pxls,
                        _s_pxl_colors: ns_pxl_colors,
                        pxl_width: new_width,
                        pxl_height: new_height,
                        _pxl_indexes_of_selection: new Set(),
                        _base64_original_images: new_base64_original_images,
                        _original_image_index: -1,
                        _is_there_new_dimension: true,
                    }, () => {

                        this._request_force_update(() => {

                            this.setState({
                                _original_image_index: new_base64_original_images.indexOf(base64_original_image),
                                _last_action_timestamp: Date.now()
                            });

                            this._notify_size_change();
                            this._update_canvas();
                        });
                    })

                };
                image.src = _base64_original_images[_original_image_index];

            }else {

                this.setState({
                    _s_pxls: ns_pxls,
                    _s_pxl_colors: ns_pxl_colors,
                    pxl_width: new_width,
                    pxl_height: new_height,
                    _pxl_indexes_of_selection: new Set(),
                    _last_action_timestamp: Date.now(),
                }, () => {

                    this._request_force_update(() => {

                        this._notify_size_change();
                        this._update_canvas();
                    });
                });

            }
        }

    };

    to_selection_size = (grow) => {

        let { _pxl_indexes_of_selection } = this.state;

        _pxl_indexes_of_selection = this._to_selection_size(grow, _pxl_indexes_of_selection);

        this.setState({_pxl_indexes_of_selection}, () => {

            this._update_canvas();
        });

    };

    _to_selection_size = (grow, _pxl_indexes_of_selection) => {

        _pxl_indexes_of_selection = new Set(_pxl_indexes_of_selection);

        for (let si = 1; si <= Math.abs(grow); si++) {

            const pxls_of_the_border = new Set([...this._get_border_from_selection(_pxl_indexes_of_selection, grow < 0, false)]);

            for (let pxl of pxls_of_the_border) {

                if(grow < 0) {

                    _pxl_indexes_of_selection.delete(pxl);
                }else {

                    _pxl_indexes_of_selection.add(pxl);
                }
            }
        }

        return _pxl_indexes_of_selection;

    }

    to_selection_none = () => {

        this.setState({_pxl_indexes_of_selection: new Set()}, () => {

            this._update_canvas();
        });
    };

    confirm_import = () => {

        this._merge_import();
    };

    _merge_import = () => {

        let {
            pxl_width,
            pxl_height,
            _imported_image_start_x,
            _imported_image_start_y,
            _imported_image_pxls,
            _imported_image_width,
            _imported_image_height,
            _imported_image_pxl_colors,
            _imported_image_scale_delta_x,
            _imported_image_scale_delta_y,
        } = this.state;

        [_imported_image_pxls, _imported_image_pxl_colors, _imported_image_width, _imported_image_height] = this._get_imported_image_scaled(_imported_image_pxls, _imported_image_pxl_colors, _imported_image_width, _imported_image_height, _imported_image_scale_delta_x, _imported_image_scale_delta_y);

        let imported_image_pxls_positioned = [];
        const has_an_image_imported = _imported_image_pxls.length > 0;

        if(has_an_image_imported) {

            _imported_image_pxls.forEach((pxl, index) => {

                const pos_x = index % _imported_image_width;
                const pos_y = (index - pos_x) / _imported_image_width;

                const current_pos_x_positioned = pos_x + _imported_image_start_x;
                const current_pos_y_positioned = pos_y + _imported_image_start_y;

                const imported_image_pxl_positioned_index = current_pos_y_positioned * pxl_width + current_pos_x_positioned;

                if(current_pos_x_positioned >= 0 && current_pos_x_positioned < pxl_width && current_pos_y_positioned >= 0 && current_pos_y_positioned < pxl_height) {

                    imported_image_pxls_positioned[imported_image_pxl_positioned_index] = pxl;
                }

            });

            let { _s_pxls, _s_pxl_colors, _layer_index } = this.state;

            Object.entries(imported_image_pxls_positioned).forEach((entry) => {

                const [pixel_index, color_index] = entry;

                const old_pixel_color_index = _s_pxls[_layer_index][pixel_index];
                const old_pixel_color_hex = _s_pxl_colors[_layer_index][old_pixel_color_index];
                const top_pixel_color_hex = _imported_image_pxl_colors[color_index];
                const new_pixel_color_hex = this._blend_colors(old_pixel_color_hex, top_pixel_color_hex, 1, false);

                if(!_s_pxl_colors[_layer_index].includes(new_pixel_color_hex)) {

                    _s_pxl_colors[_layer_index].push(new_pixel_color_hex);
                }

                const new_pixel_color_index = _s_pxl_colors[_layer_index].indexOf(new_pixel_color_hex);
                _s_pxls[_layer_index][pixel_index] = new_pixel_color_index;

            });

            [_s_pxls[_layer_index], _s_pxl_colors[_layer_index]] = this._remove_duplicate_pxl_colors(_s_pxls[_layer_index], _s_pxl_colors[_layer_index]);

            this.setState({
                _s_pxls,
                _s_pxl_colors,
                _imported_image_start_x: 0,
                _imported_image_start_y: 0,
                _imported_image_scale_delta_x: 0,
                _imported_image_scale_delta_y: 0,
                _imported_image_pxls: [],
                _imported_image_width: 0,
                _imported_image_height: 0,
                _imported_image_pxl_colors: [],
                _imported_image_move_from: [0, 0],
                _last_action_timestamp: Date.now(),
            }, () => {

                this._update_canvas();
                this._notify_is_image_import_mode();
            });
        }
    };

    _notify_is_image_import_mode = () => {

        const { _imported_image_pxls } = this.state
        const is_image_import_mode = _imported_image_pxls.length > 0;

        this.setState({_is_image_import_mode: is_image_import_mode});

        if(this.props.onImageImportModeChange) {

            this.props.onImageImportModeChange(is_image_import_mode);
        }
    }

    to_selection_crop = () => {

        this._to_selection_crop();
    };

    to_rotation = (right = true) => {

        this._to_rotation(right);
    }

    to_greyscale = () => {

        this._to_colorized("greyscale");
    };

    to_sepia = () => {

        this._to_colorized("sepia");
    };

    to_opacity = (opacity = 0) => {

        this._to_colorized(null, opacity);
    }

    to_color = (hue = 0, strength, blend_with_a_saturation_of = null, blend_with_a_luminosity_of = null) => {

        this._to_colorized(hue, strength, blend_with_a_saturation_of, blend_with_a_luminosity_of);
    }

    to_vignette = (color = "#000000ff", intensity = 0) => {

        this._to_vignette(color, intensity);
    }

    to_less_color = (threshold = 1/16) => {

        return this._to_less_color(threshold);
    }

    auto_adjust_contrast = (intensity = 1) => {

        this._auto_adjust_contrast(intensity);
    }

    smooth_adjust = (intensity = 1) => {

        this._auto_adjust_smoothness();
    }

    to_alpha = (color = "#00000000", intensity = 1) => {

        color = this._format_color(color);

        this._to_alpha(color, intensity);
    }

    to_filter = (name = "1997", intensity = 1) => {

        this._to_filter(name, intensity);
    }

    to_mirror = (horizontal = true) => {

        this._invert_pixel(horizontal ? "HORIZONTAL": "VERTICAL");
    };

    to_dutone = (contrast = 0.8, color_a = "#ffffffff", color_b = "#000000ff") => {

        this._to_dutone(contrast, color_a, color_b);
    };

    rgb_to_hsl = (r, g, b) => {

        return this._rgb_to_hsl(r, g, b);
    };

    _rgb_to_hsl = (r, g, b) => {

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


    _hsl_to_rgb = (h, s, l) => {

        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue_to_rgb = function(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue_to_rgb(p, q, h + 1 / 3);
            g = hue_to_rgb(p, q, h);
            b = hue_to_rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    };

    get_rgba_from_hex = (color) => {

        return this._get_rgba_from_hex(color);
    };

    _get_rgba_from_hex = (color) => {

        color = color || "#00000000";

        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const a = parseInt(color.slice(7, 9), 16);

        return [r, g, b, a];
    };

    _get_hex_value_from_rgb_value = (value) => {

        return Math.round(value).toString(16).padStart(2, "0");
    };

    _hsl_to_hex = (h, s, l) => {

        const [r, g, b] = this._hsl_to_rgb(h, s, l);
        const hex = this._get_hex_color_from_rgba_values(r, g, b, 255);

        return hex;
    };

    _get_hex_values_from_rgba_values = (r, g, b, a) => {

        return [
            this._get_hex_value_from_rgb_value(r),
            this._get_hex_value_from_rgb_value(g),
            this._get_hex_value_from_rgb_value(b),
            this._get_hex_value_from_rgb_value(a)
        ];
    };

    _get_hex_color_from_rgba_values = (r, g, b, a) => {

        const [r_hex, g_hex, b_hex, a_hex] = this._get_hex_values_from_rgba_values(r, g, b, a);
        return "#" + r_hex + g_hex + b_hex + a_hex;
    };

    _invert_hex_color = (color) => {

        const [r, g, b, a] = this._get_rgba_from_hex(color);
        return this._get_hex_color_from_rgba_values(255 - r, 255 - g, 255 - b, a);
    };

    _hex_sum = (hex_values) => {

        let sum = 0;
        hex_values.forEach((value) => {

            sum += parseInt(value, 16);
        });

        return sum.toString(16);
    };

    _invert_pixel = (direction) => {

        const { _s_pxls, pxl_width, pxl_height, _base64_original_images, _original_image_index, _pxl_indexes_of_selection, _shape_index_a, _select_shape_index_a, _layer_index } = this.state;
        let {_imported_image_pxls, _imported_image_width, _imported_image_height} = this.state;

        let pxls = [..._s_pxls[_layer_index]];

        let new_pxl_indexes_of_selection = new Set();

        let new_shape_index_a = _shape_index_a;
        let new_select_shape_index_a = _select_shape_index_a;

        let ns_pxls = [..._s_pxls];
        let x_scale = 1;
        let y_scale = 1;

        if(direction === "HORIZONTAL") {

            if(_imported_image_pxls.length) {

                let n_imported_image_pxls = new Array(_imported_image_pxls.length);

                _imported_image_pxls.forEach((pxl, index) => {

                    let x = index % _imported_image_width;
                    let y = (index - x) / _imported_image_width;
                    x = (_imported_image_width - 1) - x;
                    let new_index = y * _imported_image_width + x;

                    n_imported_image_pxls[new_index] = pxl;
                });

                _imported_image_pxls = n_imported_image_pxls;
            }else {

                _s_pxls[_layer_index].forEach((pxl, index) => {

                    let x = index % pxl_width;
                    let y = (index - x) / pxl_width;
                    x = (pxl_width - 1) - x;
                    let new_index = y * pxl_width + x;

                    pxls[new_index] = pxl;

                    if(_pxl_indexes_of_selection.has(index)) {

                        new_pxl_indexes_of_selection.add(new_index);
                    }

                    if(_shape_index_a === index) {

                        new_shape_index_a = new_index;
                    }

                    if(_select_shape_index_a === index) {

                        new_select_shape_index_a = new_index;
                    }

                });


                x_scale = -1;
                ns_pxls[_layer_index] = pxls;

            }

        }else {

            if(_imported_image_pxls.length) {

                let n_imported_image_pxls = new Array(_imported_image_pxls.length);

                _imported_image_pxls.forEach((pxl, index) => {

                    let x = index % _imported_image_width;
                    let y = (index - x) / _imported_image_width;
                    y = (_imported_image_height - 1) - y;
                    let new_index = y * _imported_image_width + x;

                    n_imported_image_pxls[new_index] = pxl;
                });

                _imported_image_pxls = n_imported_image_pxls;
            }else {

                _s_pxls[_layer_index].forEach((pxl, index) => {

                    let x = index % pxl_width;
                    let y = (index - x) / pxl_width;
                    y = (pxl_height - 1) - y;
                    let new_index = y * pxl_width + x;

                    pxls[new_index] = pxl;

                    if(_pxl_indexes_of_selection.has(index)) {

                        new_pxl_indexes_of_selection.add(new_index);
                    }

                    if(_shape_index_a === index) {

                        new_shape_index_a = new_index;
                    }

                    if(_select_shape_index_a === index) {

                        new_select_shape_index_a = new_index;
                    }
                });

                y_scale = -1;
                ns_pxls[_layer_index] = pxls;

            }

        }

        if(typeof _base64_original_images[_original_image_index] !== "undefined" && _layer_index === 0 && !_imported_image_pxls.length) {


            let image = new Image();
            image.onload = () => {

                let [ ctx, canvas ] = this._get_new_ctx_from_canvas(image.width, image.height);

                ctx.save();
                ctx.scale(x_scale, y_scale);
                ctx.drawImage(image, 0, 0, image.width * x_scale, image.height * y_scale);
                ctx.restore();

                const base64_original_image = image.src.includes("image/png") ?
                    canvas.toDataURL("image/png"):
                    canvas.toDataURL("image/jpeg");

                const new_base64_original_images = !_base64_original_images.includes(base64_original_image) ?
                    _base64_original_images.concat([base64_original_image]):
                    _base64_original_images;


                this.setState({
                    _shape_index_a: new_shape_index_a,
                    _select_shape_index_a: new_select_shape_index_a,
                    _pxl_indexes_of_selection: new_pxl_indexes_of_selection,
                    _s_pxls: ns_pxls,
                    _base64_original_images: new_base64_original_images,
                    _original_image_index: -1,
                    _is_there_new_dimension: true,
                    _imported_image_pxls
                }, () => {

                    this.setState({_original_image_index: new_base64_original_images.indexOf(base64_original_image), _last_action_timestamp: Date.now()});
                    this._update_canvas();
                })

            };
            image.src = _base64_original_images[_original_image_index];

        }else {


            this.setState({
                _shape_index_a: new_shape_index_a,
                _select_shape_index_a: new_select_shape_index_a,
                _pxl_indexes_of_selection: new_pxl_indexes_of_selection,
                _s_pxls: ns_pxls,
                _last_action_timestamp: Date.now(),
                _is_there_new_dimension: true,
                _imported_image_pxls
            }, () => {

                this._update_screen_zoom_ratio();
                this._update_canvas();
            });
        }
    };

    _get_darkest_color = (pxl_colors) => {

        let darkest_r_g_b_a = this._get_rgba_from_hex(pxl_colors[0]);

        pxl_colors.forEach((pxl_color) => {

            const current_rgba = this._get_rgba_from_hex(pxl_color);
            const current_rgb_sum = current_rgba[0] + current_rgba[1] + current_rgba[2];
            const darkest_rgb_sum = darkest_r_g_b_a[0] + darkest_r_g_b_a[1] + darkest_r_g_b_a[2];

            if(current_rgb_sum < darkest_rgb_sum) {

                darkest_r_g_b_a = current_rgba;
            }
        });

        return this._get_hex_color_from_rgba_values(darkest_r_g_b_a[0], darkest_r_g_b_a[1], darkest_r_g_b_a[2], 255);
    };

    to_multiple_images_with_filter = (filter_names, scale = 1) => {

        const { _layer_index } = this.state;
        let { _s_pxls, _s_pxl_colors } = this.state;
        _s_pxls = [..._s_pxls];
        _s_pxl_colors = [..._s_pxl_colors];


        let alpha = 1;
        [ _s_pxls[_layer_index], _s_pxl_colors[_layer_index], alpha ] = this._pxl_adjust_contrast(_s_pxls[_layer_index], _s_pxl_colors[_layer_index], 3/4);

        const darkest_color = this._get_darkest_color(_s_pxl_colors[_layer_index]);
        [ _s_pxls[_layer_index], _s_pxl_colors[_layer_index] ] = this._remove_close_pxl_colors(_s_pxls[_layer_index], _s_pxl_colors[_layer_index], "auto", null, alpha * 2);

        let [img_pxls, img_pxl_colors] = this._pxl_adjust_smoothness(_s_pxls[_layer_index], _s_pxl_colors[_layer_index], 4);
        [ img_pxls, img_pxl_colors ] = this._pxl_adjust_contrast(img_pxls, img_pxl_colors, 3/4);


        let images = {
            "Normal": this._pxls_to_png(img_pxls, img_pxl_colors, scale)
        };


        this.get_filter_names().forEach((filter_name) => {

            if(filter_names.includes(filter_name)) {

                let [pxls, pxl_colors] = this._pxl_adjust_smoothness(_s_pxls[_layer_index], _s_pxl_colors[_layer_index]);
                [ pxls, pxl_colors ]  = this._filter_pixels(filter_name, 4/7, pxls, pxl_colors);
                [ pxls, pxl_colors ] = this._pxl_to_vignette(pxls, pxl_colors, darkest_color, 1/4);
                [ pxls, pxl_colors ] = this._pxl_adjust_contrast(pxls, pxl_colors, 2/4);
                images[filter_name] = this._pxls_to_png(pxls, pxl_colors, scale);

            }
        });

        return images;

    };

    _to_alpha = (color = "#000000ff", intensity = 1) => {

        const { _s_pxls, _s_pxl_colors, _layer_index } = this.state;
        const [ new_pxls, new_pxl_colors ] = this._pxl_colors_to_alpha(_s_pxls[_layer_index], _s_pxl_colors[_layer_index], color, intensity);

        let ns_pxl_colors = this.state._s_pxl_colors;
        ns_pxl_colors[_layer_index] = new_pxl_colors;

        let ns_pxls = this.state._s_pxls;
        ns_pxls[_layer_index] = new_pxls;

        this.setState({_s_pxls: ns_pxls, _s_pxl_colors: ns_pxl_colors, _last_action_timestamp: Date.now()}, () => {

            this._update_canvas();
        });
    }

    _to_less_color = (threshold) => {

        const { _layer_index } = this.state;
        let { _s_pxls, _s_pxl_colors } = this.state;

        const color_number = _s_pxl_colors[_layer_index].length;

        [ _s_pxls[_layer_index], _s_pxl_colors[_layer_index] ] = this._remove_close_pxl_colors(_s_pxls[_layer_index], _s_pxl_colors[_layer_index], threshold);

        const color_remaining_number = _s_pxl_colors[_layer_index].length;

        this.setState({_s_pxls, _s_pxl_colors, _last_action_timestamp: Date.now()}, () => {

            this._update_canvas();
        });

        return {
            colors_removed: color_number - color_remaining_number,
            colors_remaining: color_remaining_number,
        };
    };

    _auto_adjust_contrast = (intensity = 1) => {

        const { _layer_index } = this.state;
        let { _s_pxls, _s_pxl_colors } = this.state;

        [ _s_pxls[_layer_index], _s_pxl_colors[_layer_index] ] = this._pxl_adjust_contrast(_s_pxls[_layer_index], _s_pxl_colors[_layer_index], intensity);


        this.setState({_s_pxls, _s_pxl_colors, _last_action_timestamp: Date.now()}, () => {

            this._update_canvas();
        });
    };

    _auto_adjust_smoothness = () => {

        const { _layer_index } = this.state;
        let { _s_pxls, _s_pxl_colors } = this.state;

        [ _s_pxls[_layer_index], _s_pxl_colors[_layer_index] ] = this._pxl_adjust_smoothness(_s_pxls[_layer_index], _s_pxl_colors[_layer_index]);


        this.setState({_s_pxls, _s_pxl_colors, _last_action_timestamp: Date.now()}, () => {

            this._update_canvas();
        });
    };

    _pxl_to_vignette = (pxls, pxl_colors, color, intensity) => {

        color = this._format_color(color);

        const {pxl_width, pxl_height } = this.state;

        const [ctx] = this._get_new_ctx_from_canvas(pxl_width, pxl_height);

        // Create a radial gradient
        // The inner circle is at x=110, y=90, with radius=30
        // The outer circle is at x=100, y=100, with radius=70
        const max_width_height = Math.max(pxl_width, pxl_height);
        const inverted_color = this._invert_hex_color(color);

        let gradient = ctx.createRadialGradient(pxl_width / 2,pxl_height / 2,0, pxl_width / 2,pxl_height / 2, max_width_height / 2);

        gradient.addColorStop(1, color);
        gradient.addColorStop(0.85, this._blend_colors(color, inverted_color, 0.75));
        gradient.addColorStop(0, inverted_color);

        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, pxl_width, pxl_height);

        const canvas_image_data = ctx.getImageData(0, 0, pxl_width, pxl_height);
        let {new_pxls, new_pxl_colors} = this._get_pixels_palette_and_list_from_image_data(canvas_image_data, true, 0);

        [ new_pxls, new_pxl_colors ] = this._remove_close_pxl_colors(new_pxls, new_pxl_colors, 255/6/255, null, 6);
        [ new_pxls, new_pxl_colors ] = this._pxl_colors_to_alpha(new_pxls, new_pxl_colors, inverted_color, 1);

        const [ r, g, b, a ] = this._get_rgba_from_hex(color);
        new_pxl_colors = new_pxl_colors.map((pxl_color, color_index) => {

            const [ p_r, p_g, p_b, p_a ] = this._get_rgba_from_hex(pxl_color);
            return this._get_hex_color_from_rgba_values(r, g, b, p_a);
        });

        let brand_new_pxl_colors = [];
        new_pxls = new_pxls.map((pxl, index) => {

            const pxl_color = new_pxl_colors[pxl];
            const old_pxl_color = pxl_colors[pxls[index]];

            const new_color = this._blend_colors(old_pxl_color, pxl_color, intensity, false);

            if(brand_new_pxl_colors.indexOf(new_color) === -1) {

                brand_new_pxl_colors.push(new_color);
            }

            const new_color_index = brand_new_pxl_colors.indexOf(new_color);

            return new_color_index;
        })

        new_pxl_colors = brand_new_pxl_colors;

        return [new_pxls, new_pxl_colors];

    };

    _to_vignette = (color, intensity) => {

        if(intensity > 0) {

            const {_layer_index} = this.state;
            let {_s_pxls, _s_pxl_colors} = this.state;

            [_s_pxls[_layer_index], _s_pxl_colors[_layer_index]] = this._pxl_to_vignette(_s_pxls[_layer_index], _s_pxl_colors[_layer_index], color, intensity);

            this.setState({_s_pxls, _s_pxl_colors, _last_action_timestamp: Date.now()}, () => {

                this._update_canvas();
            });
        }

    };


    _to_colorized = (hue_or_mode = null, opacity = null, blend_with_a_saturation_of = null, blend_with_a_luminosity_of = null) => {

        const { _s_pxl_colors, _layer_index } = this.state;
        let mode = hue_or_mode !== null && hue_or_mode >= 0 && hue_or_mode <= 360 ? "hue": hue_or_mode === "sepia" ? "sepia": "greyscale";
        opacity = opacity === null ? 1: opacity;

        const _new_pxl_colors = _s_pxl_colors[_layer_index].map((color) => {

            color = this._format_color(color);

            let [r, g, b, a] = this._get_rgba_from_hex(color);

            if(mode === "greyscale") {

                const average = this._get_hex_value_from_rgb_value((r + g + b) / 3);
                color = this._format_color("#" + average + average + average + this._get_hex_value_from_rgb_value(a * opacity));
            }else if(mode === "sepia"){

                function limit_to(n, l) {

                    return n > l ? l: n;
                }

                const s_r = limit_to((r * .393) + (g *.769) + (b * .189), 255);
                const s_g = limit_to((r * .349) + (g *.686) + (b * .168), 255);
                const s_b = limit_to((r * .272) + (g *.534) + (b * .131), 255);

                const s_r_hex = this._get_hex_value_from_rgb_value(s_r);
                const s_g_hex = this._get_hex_value_from_rgb_value(s_g);
                const s_b_hex = this._get_hex_value_from_rgb_value(s_b);
                const s_a_hex = this._get_hex_value_from_rgb_value(a * opacity);

                color = this._format_color("#" + s_r_hex + s_g_hex + s_b_hex + s_a_hex);
            }else if(mode === "hue") {

                const [r, g, b, a] = this._get_rgba_from_hex(color);
                let [hue, saturation, luminosity] = this._rgb_to_hsl(r, g, b);

                let added = [blend_with_a_saturation_of, blend_with_a_luminosity_of, opacity];
                let base = [saturation, luminosity, 1];
                let mix = [];

                if (opacity !== 0) {

                    mix[2] = 1 - (1 - added[2]) * (1 - base[2]); // alpha
                    mix[0] = Math.round((added[0] * added[2] / mix[2]) + (base[0] * base[2] * (1 - added[2]) / mix[2])); // red
                    mix[1] = Math.round((added[1] * added[2] / mix[2]) + (base[1] * base[2] * (1 - added[2]) / mix[2])); // green
                }else {

                    mix = [saturation, luminosity];
                }

                const [h_r, h_g, h_b] = this._hsl_to_rgb(hue_or_mode, mix[0], mix[1]);

                if (a === 0) {

                    color = "#00000000";
                }else {

                    const r_hex = this._get_hex_value_from_rgb_value(h_r);
                    const g_hex = this._get_hex_value_from_rgb_value(h_g);
                    const b_hex = this._get_hex_value_from_rgb_value(h_b);
                    const a_hex = this._get_hex_value_from_rgb_value(a);

                    color = "#" + r_hex + g_hex + b_hex + a_hex;
                }

            }

            return this._format_color(color);

        });

        let ns_pxl_colors = this.state._s_pxl_colors;
        ns_pxl_colors[_layer_index] = _new_pxl_colors;

        this.setState({_s_pxl_colors: ns_pxl_colors, _last_action_timestamp: Date.now()}, () => {

            this._update_canvas();
            //this._remove_duplicate_pxl_colors();
        });
    };

    _get_filters = () => {

        return {
            ".1997": {
                "a": [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26, 28, 29, 31, 32, 34, 35, 37, 38, 39, 41, 42, 44, 45, 46, 48, 49, 50, 52, 53, 54, 55, 57, 58, 59, 60, 61, 62, 64, 65, 66, 67, 68, 69, 70, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 146, 147, 148, 149, 150, 151, 152, 153, 153, 154, 155, 156, 157, 158, 159, 160, 160, 161, 162, 163, 164, 165, 166, 166, 167, 168, 169, 170, 171, 172, 172, 173, 174, 175, 176, 177, 178, 178, 179, 180, 181, 182, 183, 183, 184, 185, 186, 187, 188, 188, 189, 190, 191, 192, 193, 193, 194, 195, 196, 197, 198, 199, 199, 200, 201, 202, 203, 204, 204, 205, 206, 207, 208, 209, 209, 210, 211, 212, 213, 214, 215, 215, 216, 217, 218, 219, 220, 221, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 230, 231, 232, 233, 233, 234, 235, 236, 237, 238, 239, 240, 241, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 250, 251, 252, 253, 254, 255, 255],
                "r": [58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 59, 60, 60, 61, 62, 62, 63, 63, 64, 64, 65, 66, 66, 67, 67, 68, 69, 69, 70, 70, 71, 72, 72, 73, 74, 74, 75, 76, 77, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 95, 96, 97, 98, 99, 100, 102, 103, 104, 105, 106, 108, 109, 110, 111, 112, 113, 114, 116, 117, 118, 119, 120, 121, 122, 123, 125, 126, 127, 128, 129, 130, 131, 133, 134, 135, 136, 137, 138, 140, 141, 142, 143, 144, 146, 147, 148, 149, 151, 152, 153, 154, 156, 157, 158, 160, 161, 162, 164, 165, 166, 168, 169, 170, 172, 173, 175, 176, 177, 179, 180, 182, 183, 185, 186, 188, 189, 191, 192, 193, 194, 196, 197, 198, 199, 200, 201, 202, 203, 204, 204, 205, 206, 206, 207, 208, 208, 209, 209, 210, 210, 211, 211, 212, 212, 212, 213, 213, 213, 213, 213, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 215, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 213, 213, 213, 213, 213, 213, 213, 212, 212, 212, 212, 212],
                "g": [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 41, 41, 42, 42, 42, 42, 43, 43, 43, 43, 44, 44, 44, 44, 45, 45, 45, 45, 46, 46, 46, 47, 47, 48, 48, 48, 49, 49, 50, 50, 51, 52, 52, 53, 54, 54, 55, 56, 57, 58, 59, 60, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 153, 154, 155, 156, 157, 158, 160, 161, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 178, 179, 180, 181, 182, 183, 185, 186, 187, 188, 189, 190, 191, 192, 193, 195, 196, 197, 198, 199, 200, 201, 202, 203, 205, 206, 207, 208, 209, 210, 211, 212, 214, 215, 216, 217, 218, 220, 221, 222, 223, 225, 226, 227, 228, 230, 231, 232, 233, 235, 236, 237, 239, 240, 241, 242, 244, 245, 246, 247, 249, 250, 251, 252, 254, 255, 255],
                "b": [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 46, 46, 47, 47, 47, 48, 48, 48, 48, 49, 49, 49, 50, 50, 50, 51, 51, 51, 52, 52, 53, 53, 54, 54, 55, 56, 56, 57, 58, 59, 60, 61, 62, 62, 63, 64, 65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 82, 83, 84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 96, 97, 98, 99, 100, 102, 103, 104, 105, 107, 108, 109, 110, 112, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 130, 131, 133, 134, 135, 137, 138, 140, 141, 143, 144, 145, 147, 148, 149, 151, 152, 153, 155, 156, 157, 159, 160, 161, 162, 164, 165, 166, 167, 168, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 184, 185, 186, 187, 188, 188, 189, 190, 191, 192, 193, 193, 194, 195, 195, 196, 196, 196, 197, 197, 197, 197, 198, 198, 198, 198, 198, 198, 198, 198, 198, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 199, 198, 198, 198, 198, 198, 198, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 198, 198, 198, 198, 198, 198, 198]
            },
            ".Brannan": {
                "a": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 255],
                "r": [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51, 51, 51, 51, 51, 52, 53, 54, 55, 56, 57, 59, 60, 62, 63, 64, 66, 67, 68, 69, 70, 71, 71, 72, 73, 73, 74, 75, 75, 76, 76, 77, 77, 78, 78, 79, 79, 80, 80, 81, 81, 82, 83, 83, 84, 85, 86, 87, 88, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114, 115, 116, 118, 119, 120, 121, 122, 124, 125, 126, 128, 129, 130, 132, 133, 134, 136, 137, 139, 140, 141, 143, 144, 146, 147, 149, 150, 152, 153, 154, 156, 157, 159, 160, 162, 163, 164, 166, 167, 169, 170, 171, 173, 174, 175, 177, 178, 179, 181, 182, 183, 185, 186, 187, 189, 190, 192, 193, 195, 196, 198, 199, 201, 203, 204, 206, 207, 209, 210, 212, 213, 215, 216, 217, 219, 220, 221, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 236, 237, 238, 239, 239, 240, 241, 241, 242, 243, 243, 244, 244, 245, 246, 246, 247, 247, 248, 248, 249, 249, 249, 250, 250, 251, 251, 251, 252, 252, 252, 253, 253, 253, 254, 254, 254, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 254, 254, 254, 254, 254, 254],
                "g": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 4, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 38, 39, 40, 41, 43, 44, 45, 47, 48, 50, 51, 53, 54, 56, 57, 59, 61, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 87, 89, 91, 93, 95, 97, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 161, 163, 165, 167, 168, 170, 172, 173, 175, 176, 178, 179, 181, 182, 183, 184, 186, 187, 188, 189, 190, 191, 192, 193, 193, 194, 195, 196, 196, 197, 198, 198, 199, 200, 200, 201, 202, 202, 203, 203, 204, 204, 205, 205, 206, 207, 207, 208, 208, 209, 210, 210, 211, 212, 212, 213, 214, 214, 215, 216, 217, 217, 218, 219, 219, 220, 221, 221, 222, 222, 223, 224, 224, 225, 225, 226, 226, 227, 228, 228, 229, 229, 229, 230, 230, 231, 231, 232, 232, 233, 233, 233, 234, 234, 234, 235, 235, 236, 236, 236, 237, 237, 237, 238, 238, 239, 239, 239, 240, 240, 240, 241, 241, 241, 242, 242, 242, 243, 243, 243, 244, 244, 244, 245, 245, 245, 246, 246, 247, 247, 247, 248, 248, 249, 249, 250, 250, 251, 251, 252, 252, 252],
                "b": [48, 48, 48, 48, 48, 48, 48, 48, 49, 49, 49, 49, 49, 49, 49, 50, 50, 50, 51, 51, 51, 52, 52, 53, 53, 54, 54, 54, 55, 55, 56, 56, 57, 57, 58, 58, 59, 60, 60, 61, 61, 62, 62, 63, 64, 64, 65, 66, 66, 67, 68, 68, 69, 70, 71, 71, 72, 73, 74, 75, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 92, 93, 94, 95, 96, 98, 99, 100, 101, 102, 103, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 141, 142, 143, 144, 145, 146, 146, 147, 148, 148, 149, 150, 151, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 178, 179, 180, 181, 181, 182, 183, 183, 184, 184, 185, 185, 185, 186, 186, 187, 187, 187, 188, 188, 188, 189, 189, 190, 190, 191, 191, 192, 193, 193, 194, 195, 195, 196, 197, 198, 199, 200, 200, 201, 202, 203, 204, 205, 206, 206, 207, 208, 209, 210, 211, 211, 212, 213, 214, 214, 215, 216, 216, 217, 218, 218, 219, 219, 220, 220, 221, 222, 222, 222, 223, 223, 224, 224, 224, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225]
            },
            ".Gotham": {
                "a": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 255],
                "r": [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51, 51, 51, 51, 51, 52, 53, 54, 55, 56, 57, 59, 60, 62, 63, 64, 66, 67, 68, 69, 70, 71, 71, 72, 73, 73, 74, 75, 75, 76, 76, 77, 77, 78, 78, 79, 79, 80, 80, 81, 81, 82, 83, 83, 84, 85, 86, 87, 88, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114, 115, 116, 118, 119, 120, 121, 122, 124, 125, 126, 128, 129, 130, 132, 133, 134, 136, 137, 139, 140, 141, 143, 144, 146, 147, 149, 150, 152, 153, 154, 156, 157, 159, 160, 162, 163, 164, 166, 167, 169, 170, 171, 173, 174, 175, 177, 178, 179, 181, 182, 183, 185, 186, 187, 189, 190, 192, 193, 195, 196, 198, 199, 201, 203, 204, 206, 207, 209, 210, 212, 213, 215, 216, 217, 219, 220, 221, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 236, 237, 238, 239, 239, 240, 241, 241, 242, 243, 243, 244, 244, 245, 246, 246, 247, 247, 248, 248, 249, 249, 249, 250, 250, 251, 251, 251, 252, 252, 252, 253, 253, 253, 254, 254, 254, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 254, 254, 254, 254, 254, 254],
                "g": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 4, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 38, 39, 40, 41, 43, 44, 45, 47, 48, 50, 51, 53, 54, 56, 57, 59, 61, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 87, 89, 91, 93, 95, 97, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 161, 163, 165, 167, 168, 170, 172, 173, 175, 176, 178, 179, 181, 182, 183, 184, 186, 187, 188, 189, 190, 191, 192, 193, 193, 194, 195, 196, 196, 197, 198, 198, 199, 200, 200, 201, 202, 202, 203, 203, 204, 204, 205, 205, 206, 207, 207, 208, 208, 209, 210, 210, 211, 212, 212, 213, 214, 214, 215, 216, 217, 217, 218, 219, 219, 220, 221, 221, 222, 222, 223, 224, 224, 225, 225, 226, 226, 227, 228, 228, 229, 229, 229, 230, 230, 231, 231, 232, 232, 233, 233, 233, 234, 234, 234, 235, 235, 236, 236, 236, 237, 237, 237, 238, 238, 239, 239, 239, 240, 240, 240, 241, 241, 241, 242, 242, 242, 243, 243, 243, 244, 244, 244, 245, 245, 245, 246, 246, 247, 247, 247, 248, 248, 249, 249, 250, 250, 251, 251, 252, 252, 252],
                "b": [48, 48, 48, 48, 48, 48, 48, 48, 49, 49, 49, 49, 49, 49, 49, 50, 50, 50, 51, 51, 51, 52, 52, 53, 53, 54, 54, 54, 55, 55, 56, 56, 57, 57, 58, 58, 59, 60, 60, 61, 61, 62, 62, 63, 64, 64, 65, 66, 66, 67, 68, 68, 69, 70, 71, 71, 72, 73, 74, 75, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 92, 93, 94, 95, 96, 98, 99, 100, 101, 102, 103, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 141, 142, 143, 144, 145, 146, 146, 147, 148, 148, 149, 150, 151, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 178, 179, 180, 181, 181, 182, 183, 183, 184, 184, 185, 185, 185, 186, 186, 187, 187, 187, 188, 188, 188, 189, 189, 190, 190, 191, 191, 192, 193, 193, 194, 195, 195, 196, 197, 198, 199, 200, 200, 201, 202, 203, 204, 205, 206, 206, 207, 208, 209, 210, 211, 211, 212, 213, 214, 214, 215, 216, 216, 217, 218, 218, 219, 219, 220, 220, 221, 222, 222, 222, 223, 223, 224, 224, 224, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225]
            },
            ".Gingham": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [44,44,44,44,45,45,45,45,45,45,46,46,46,46,46,47,47,47,47,48,48,48,49,49,49,50,50,51,51,52,52,53,54,54,55,56,57,57,58,59,60,61,62,63,64,65,67,68,69,70,71,72,74,75,76,78,79,81,82,83,85,86,88,89,90,92,93,95,96,98,99,101,102,104,105,107,109,110,112,113,115,116,118,119,121,122,124,125,127,128,130,131,133,134,136,137,138,140,141,142,143,145,146,147,148,149,150,151,152,153,154,155,156,156,157,158,159,160,160,161,162,163,163,164,165,165,166,167,168,168,169,170,170,171,171,172,173,173,174,175,175,176,176,177,177,178,179,179,180,180,181,181,182,182,183,183,184,184,185,185,186,186,187,187,188,188,189,189,190,190,191,191,192,192,192,193,193,194,194,195,195,195,196,196,197,197,197,198,198,199,199,199,200,200,201,201,201,202,202,203,203,203,204,204,205,205,205,206,206,207,207,207,208,208,209,209,209,210,210,210,211,211,211,212,212,212,213,213,213,213,213,213,213,214,214,214,214,214,214,214,214,214,214,214,214,214,213,213,213,213,213,213,213,213,213,213],
                "g": [44,44,44,44,44,44,44,44,44,44,44,44,44,45,45,45,45,45,45,46,46,46,47,47,47,48,48,49,49,50,51,51,52,53,54,54,55,56,57,58,59,61,62,63,64,65,66,68,69,70,71,73,74,75,77,78,79,81,82,84,85,87,88,89,91,92,94,95,97,98,100,101,103,104,106,107,109,110,112,113,115,116,118,119,121,122,124,125,127,128,130,131,133,134,135,137,138,139,141,142,143,145,146,147,148,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,168,169,170,171,171,172,173,173,174,175,176,176,177,177,178,179,179,180,181,181,182,182,183,183,184,184,185,185,186,186,187,187,188,188,189,189,190,190,191,191,191,192,192,193,193,193,194,194,195,195,195,196,196,196,197,197,198,198,198,199,199,199,200,200,200,201,201,201,202,202,202,203,203,203,204,204,204,205,205,205,206,206,206,207,207,207,208,208,208,209,209,209,210,210,210,211,211,211,212,212,212,212,213,213,213,213,213,213,213,214,214,214,214,214,214,214,214,214,214,214,214,214,214,214,214,214,213,213,213,213,213,213],
                "b": [45,45,45,45,45,45,46,46,46,46,46,46,47,47,47,47,48,48,48,48,49,49,49,50,50,51,51,52,52,53,53,54,54,55,56,57,57,58,59,60,61,62,63,64,65,66,67,68,70,71,72,73,75,76,77,79,80,82,83,84,86,87,89,90,91,93,94,96,97,98,100,101,102,104,104,106,107,108,109,111,112,113,115,116,117,119,120,121,123,124,125,127,128,129,131,132,134,135,136,138,139,140,142,143,144,146,147,148,150,151,152,153,155,156,157,158,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,179,180,181,181,182,183,183,184,185,185,186,186,187,187,188,188,189,189,190,190,191,191,192,192,193,193,193,194,194,194,195,195,196,196,196,197,197,197,198,198,198,198,199,199,199,200,200,200,200,201,201,201,201,202,202,202,203,203,203,203,203,204,204,204,204,205,205,205,205,206,206,206,206,207,207,207,208,208,208,208,209,209,209,209,209,210,210,210,210,211,211,211,211,211,211,211,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,212,213,213,213,213,213,213,213,213]
            },
            ".Hefe": {
                "a": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 255],
                "r": [32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 33, 33, 33, 33, 33, 34, 35, 36, 38, 39, 41, 43, 45, 48, 50, 52, 54, 56, 58, 60, 62, 64, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 117, 119, 121, 123, 125, 126, 128, 130, 132, 133, 135, 137, 139, 140, 142, 144, 146, 147, 149, 151, 152, 154, 155, 157, 158, 160, 161, 163, 164, 166, 167, 168, 170, 171, 172, 173, 175, 176, 177, 178, 179, 180, 181, 182, 184, 185, 186, 187, 188, 189, 190, 190, 191, 192, 193, 194, 195, 196, 197, 197, 198, 199, 200, 201, 201, 202, 203, 204, 204, 205, 205, 206, 206, 207, 207, 208, 208, 209, 209, 210, 210, 211, 211, 212, 212, 213, 213, 214, 214, 215, 215, 216, 216, 217, 217, 218, 218, 219, 219, 220, 220, 221, 221, 221, 222, 222, 223, 223, 224, 224, 225, 225, 225, 226, 226, 227, 227, 228, 228, 228, 229, 229, 230, 230, 231, 231, 231, 232, 232, 233, 233, 233, 234, 234, 235, 235, 235, 236, 236, 236, 237, 237, 238, 238, 238, 239, 239, 239, 240, 240, 240, 241, 241, 242, 242, 242, 243, 243, 243, 244, 244, 245, 245, 245, 246, 246, 247, 248, 248, 249, 249, 250, 250, 251, 251, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252],
                "g": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20, 21, 23, 24, 25, 27, 28, 30, 31, 33, 34, 36, 37, 39, 40, 42, 44, 45, 47, 49, 50, 52, 54, 56, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 78, 80, 82, 85, 87, 89, 92, 94, 97, 99, 102, 104, 106, 109, 111, 114, 116, 118, 121, 123, 125, 127, 129, 131, 133, 135, 137, 139, 141, 143, 145, 146, 148, 150, 152, 154, 156, 157, 159, 161, 163, 164, 166, 168, 169, 171, 173, 174, 176, 178, 179, 181, 182, 184, 185, 187, 188, 190, 191, 192, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 205, 206, 207, 207, 208, 209, 209, 210, 210, 211, 211, 211, 212, 212, 213, 213, 213, 214, 214, 215, 215, 216, 216, 216, 217, 217, 218, 218, 219, 219, 220, 220, 220, 221, 221, 222, 222, 222, 223, 223, 224, 224, 225, 225, 225, 226, 226, 227, 227, 228, 228, 228, 229, 229, 230, 230, 231, 231, 232, 232, 232, 233, 233, 234, 234, 235, 235, 236, 236, 237, 237, 238, 238, 239, 239, 239, 240, 240, 241, 241, 242, 242, 243, 244, 244, 245, 246, 246, 247, 248, 249, 249, 250, 250, 251, 251, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252, 252],
                "b": [2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9, 9, 9, 10, 10, 11, 12, 12, 13, 13, 14, 15, 15, 16, 17, 17, 18, 19, 19, 20, 21, 22, 23, 24, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 43, 45, 47, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 87, 89, 91, 93, 95, 96, 98, 100, 101, 103, 105, 107, 108, 110, 112, 113, 115, 117, 118, 120, 122, 123, 125, 127, 128, 130, 131, 133, 135, 136, 138, 140, 141, 143, 145, 146, 148, 149, 151, 153, 154, 156, 158, 159, 161, 163, 164, 166, 167, 169, 170, 171, 173, 174, 175, 177, 178, 179, 180, 182, 183, 184, 185, 186, 187, 189, 190, 191, 192, 193, 194, 195, 195, 196, 197, 198, 198, 199, 200, 200, 201, 201, 202, 202, 203, 203, 204, 204, 204, 205, 205, 205, 206, 206, 206, 207, 207, 207, 207, 208, 208, 209, 209, 209, 210, 210, 211, 211, 211, 212, 212, 213, 213, 214, 214, 214, 215, 215, 216, 216, 216, 217, 217, 218, 218, 218, 219, 219, 220, 220, 220, 221, 221, 222, 222, 222, 223, 223, 224, 224, 225, 225, 226, 226, 227, 227, 227, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228, 228]
            },
            ".Lordkelvin": {
                "a": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 255],
                "r": [43, 44, 46, 47, 49, 50, 52, 53, 55, 56, 58, 59, 61, 62, 64, 65, 67, 69, 70, 72, 73, 75, 77, 78, 80, 81, 83, 85, 86, 88, 90, 91, 93, 95, 96, 98, 100, 102, 103, 105, 107, 109, 111, 112, 114, 116, 118, 120, 121, 123, 125, 127, 129, 130, 132, 134, 136, 137, 139, 141, 142, 144, 146, 147, 149, 151, 152, 154, 155, 157, 158, 160, 162, 163, 165, 166, 168, 169, 171, 172, 174, 175, 176, 178, 179, 180, 182, 183, 184, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 201, 202, 203, 204, 204, 205, 206, 207, 207, 208, 209, 210, 210, 211, 212, 212, 213, 214, 214, 215, 216, 217, 217, 218, 219, 219, 220, 221, 222, 222, 223, 224, 224, 225, 225, 226, 227, 227, 228, 228, 229, 229, 229, 230, 230, 231, 231, 232, 232, 232, 233, 233, 233, 234, 234, 235, 235, 235, 236, 236, 236, 237, 237, 237, 238, 238, 239, 239, 239, 240, 240, 240, 241, 241, 241, 242, 242, 242, 243, 243, 243, 243, 244, 244, 244, 245, 245, 245, 245, 245, 246, 246, 246, 246, 246, 247, 247, 247, 247, 247, 248, 248, 248, 248, 248, 248, 249, 249, 249, 249, 249, 249, 249, 250, 250, 250, 250, 250, 250, 250, 250, 251, 251, 251, 251, 251, 251, 251, 251, 251, 252, 252, 252, 252, 252, 252, 252, 252, 252, 253, 253, 253, 253, 253, 253, 253, 253, 254, 254, 254, 254, 254],
                "g": [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 37, 37, 37, 37, 37, 38, 38, 38, 39, 39, 40, 40, 41, 41, 42, 43, 43, 44, 45, 46, 47, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59, 60, 61, 62, 63, 64, 65, 67, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 86, 87, 88, 89, 90, 91, 92, 93, 95, 96, 97, 98, 99, 100, 101, 102, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 155, 156, 157, 158, 158, 159, 160, 160, 161, 161, 162, 163, 163, 164, 164, 165, 165, 166, 166, 167, 167, 168, 168, 168, 169, 169, 170, 171, 171, 172, 172, 173, 173, 174, 174, 175, 175, 176, 177, 177, 178, 178, 179, 179, 180, 180, 181, 181, 182, 182, 182, 183, 183, 184, 184, 184, 185, 185, 185, 186, 186, 186, 186, 187, 187, 187, 187, 188, 188, 188, 188, 188, 189, 189, 189, 189, 189, 190, 190, 190, 190, 190, 190, 190, 191, 191, 191, 191, 191, 191, 191, 191, 192, 192, 192, 192, 192, 192, 192, 192, 193, 193, 193, 193, 193, 193, 193, 193, 194, 194, 194, 194, 194, 194, 194, 195, 195, 195, 195],
                "b": [69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 71, 71, 71, 72, 72, 73, 73, 73, 74, 74, 75, 75, 76, 76, 77, 78, 78, 79, 79, 80, 80, 81, 81, 82, 82, 82, 83, 83, 84, 84, 84, 85, 85, 86, 86, 86, 87, 87, 87, 88, 88, 88, 89, 89, 90, 90, 90, 91, 91, 91, 92, 92, 93, 93, 93, 94, 94, 95, 95, 96, 96, 96, 97, 97, 98, 99, 99, 100, 100, 101, 101, 102, 102, 102, 103, 103, 103, 104, 104, 104, 105, 105, 105, 106, 106, 106, 106, 107, 107, 107, 107, 108, 108, 108, 108, 109, 109, 109, 110, 110, 110, 111, 111, 111, 111, 112, 112, 112, 113, 113, 113, 114, 114, 114, 115, 115, 115, 115, 116, 116, 116, 116, 117, 117, 117, 117, 117, 118, 118, 118, 118, 118, 118, 119, 119, 119, 119, 119, 119, 119, 120, 120, 120, 120, 120, 120, 120, 120, 120, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 124, 124, 124, 124, 124, 124]
            },
            ".Nashville": {
                "a": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 255],
                "r": [56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 57, 57, 58, 58, 59, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 75, 76, 78, 79, 81, 82, 84, 85, 87, 88, 90, 91, 93, 95, 96, 98, 100, 102, 104, 106, 108, 110, 113, 115, 117, 120, 122, 124, 127, 129, 131, 133, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 155, 157, 159, 160, 162, 164, 165, 167, 168, 170, 171, 173, 174, 175, 177, 178, 179, 181, 182, 183, 185, 186, 187, 189, 190, 191, 192, 194, 195, 196, 197, 198, 200, 201, 202, 203, 204, 205, 206, 208, 209, 209, 210, 211, 212, 213, 214, 215, 216, 217, 217, 218, 219, 220, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 230, 231, 231, 232, 233, 233, 234, 234, 235, 235, 236, 237, 237, 238, 238, 239, 239, 240, 240, 240, 241, 241, 242, 242, 243, 243, 243, 244, 244, 245, 245, 245, 246, 246, 246, 247, 247, 247, 248, 248, 248, 248, 249, 249, 249, 249, 250, 250, 250, 250, 251, 251, 251, 251, 251, 252, 252, 252, 252, 252, 253, 253, 253, 253, 253, 254, 254, 254, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
                "g": [38, 39, 39, 40, 41, 41, 42, 42, 43, 44, 44, 45, 46, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 59, 60, 61, 63, 64, 65, 67, 68, 69, 71, 72, 73, 74, 76, 77, 78, 80, 81, 82, 84, 85, 86, 87, 89, 90, 91, 93, 94, 95, 97, 98, 99, 101, 102, 103, 104, 106, 107, 108, 110, 111, 112, 114, 115, 116, 118, 119, 121, 122, 123, 125, 126, 128, 129, 130, 132, 133, 134, 136, 137, 138, 140, 141, 142, 143, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 158, 159, 160, 161, 162, 163, 163, 164, 165, 166, 166, 167, 168, 169, 169, 170, 171, 172, 172, 173, 174, 175, 176, 176, 177, 178, 179, 180, 181, 181, 182, 183, 184, 185, 186, 187, 187, 188, 189, 189, 190, 191, 191, 192, 193, 193, 194, 194, 195, 195, 196, 197, 197, 198, 198, 199, 199, 200, 200, 201, 201, 202, 202, 202, 203, 203, 204, 204, 205, 205, 205, 206, 206, 207, 207, 207, 208, 208, 208, 209, 209, 209, 210, 210, 210, 211, 211, 211, 212, 212, 212, 213, 213, 213, 213, 214, 214, 214, 214, 215, 215, 215, 215, 216, 216, 216, 216, 216, 217, 217, 217, 217, 217, 218, 218, 218, 218, 218, 218, 219, 219, 219, 219, 219, 220, 220, 220, 220, 220, 220, 220, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221, 221],
                "b": [97, 98, 98, 99, 99, 100, 100, 101, 101, 102, 102, 103, 104, 104, 105, 105, 106, 107, 107, 108, 109, 110, 110, 111, 112, 113, 114, 114, 115, 116, 116, 117, 118, 118, 119, 119, 120, 120, 121, 121, 122, 122, 123, 123, 124, 124, 124, 125, 125, 126, 126, 127, 127, 127, 128, 128, 129, 129, 129, 130, 130, 131, 131, 132, 132, 132, 133, 133, 134, 134, 135, 135, 136, 136, 136, 137, 137, 138, 138, 139, 139, 139, 140, 140, 141, 141, 142, 142, 142, 143, 143, 144, 144, 144, 145, 145, 146, 146, 147, 147, 147, 148, 148, 149, 149, 150, 150, 151, 151, 151, 152, 152, 153, 153, 154, 154, 154, 155, 155, 155, 156, 156, 156, 157, 157, 157, 158, 158, 158, 158, 158, 158, 159, 159, 159, 159, 159, 159, 159, 159, 159, 159, 159, 160, 160, 160, 160, 160, 161, 161, 161, 162, 162, 162, 162, 163, 163, 163, 163, 164, 164, 164, 164, 165, 165, 165, 165, 165, 165, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 167, 167, 167, 167, 167, 167, 167, 167, 167, 168, 168, 168, 168, 168, 168, 169, 169, 169, 169, 169, 170, 170, 170, 170, 171, 171, 171, 171, 171, 172, 172, 172, 172, 172, 173, 173, 173, 173, 173, 173, 173, 174, 174, 174, 174, 174, 174, 174, 174, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 176, 176, 176, 176, 176, 176, 176, 176, 176, 176]
            },
            ".Xpro": {
                "a": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 255],
                "r": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 7, 7, 8, 8, 9, 9, 10, 11, 11, 12, 13, 14, 14, 15, 16, 17, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 37, 38, 39, 41, 42, 43, 45, 46, 48, 49, 51, 52, 54, 55, 57, 58, 60, 62, 63, 65, 67, 68, 70, 72, 74, 76, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 141, 143, 145, 147, 149, 151, 153, 155, 157, 159, 161, 163, 165, 167, 169, 171, 172, 174, 176, 178, 180, 182, 184, 186, 188, 189, 191, 193, 194, 196, 198, 199, 201, 202, 204, 205, 207, 208, 209, 211, 212, 214, 215, 216, 217, 219, 220, 221, 222, 223, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 239, 240, 241, 242, 243, 243, 244, 245, 246, 246, 247, 248, 248, 249, 249, 250, 250, 251, 251, 252, 252, 252, 253, 253, 253, 253, 253, 253, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
                "g": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 10, 10, 11, 12, 12, 13, 14, 14, 15, 16, 17, 18, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 39, 40, 41, 43, 44, 45, 47, 48, 50, 51, 53, 54, 56, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 75, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 161, 163, 165, 167, 169, 171, 173, 175, 176, 178, 180, 182, 183, 185, 187, 189, 190, 192, 193, 195, 197, 198, 200, 201, 203, 204, 206, 207, 209, 210, 211, 213, 214, 216, 217, 218, 219, 221, 222, 223, 224, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 237, 238, 239, 240, 240, 241, 242, 243, 243, 244, 244, 245, 246, 246, 247, 247, 248, 248, 249, 249, 250, 250, 250, 251, 251, 252, 252, 252, 253, 253, 253, 253, 253, 253, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
                "b": [24, 25, 26, 27, 28, 28, 29, 30, 31, 32, 33, 34, 35, 35, 36, 37, 38, 39, 40, 41, 41, 42, 43, 44, 45, 45, 46, 47, 48, 49, 49, 50, 51, 52, 53, 53, 54, 55, 56, 56, 57, 58, 59, 59, 60, 61, 62, 62, 63, 64, 64, 65, 66, 67, 67, 68, 69, 70, 70, 71, 72, 73, 73, 74, 75, 76, 77, 77, 78, 79, 80, 81, 81, 82, 83, 84, 85, 86, 86, 87, 88, 89, 90, 91, 91, 92, 93, 94, 95, 96, 96, 97, 98, 99, 100, 101, 101, 102, 103, 104, 105, 106, 107, 107, 108, 109, 110, 111, 112, 113, 114, 114, 115, 116, 117, 118, 119, 119, 120, 121, 122, 123, 124, 124, 125, 126, 127, 127, 128, 129, 129, 130, 130, 131, 131, 132, 132, 133, 134, 134, 135, 136, 137, 138, 138, 139, 140, 141, 142, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 162, 163, 164, 165, 165, 166, 167, 168, 168, 169, 170, 171, 171, 172, 173, 173, 174, 175, 176, 176, 177, 178, 178, 179, 180, 181, 182, 182, 183, 184, 185, 185, 186, 187, 188, 189, 189, 190, 191, 192, 193, 193, 194, 195, 196, 197, 197, 198, 199, 200, 200, 201, 202, 203, 204, 204, 205, 206, 206, 207, 208, 208, 209, 210, 210, 211, 212, 212, 213, 214, 215, 215, 216, 217, 218, 218, 219, 220, 221, 221, 222, 223, 224, 225, 226, 226, 227, 228, 229]
            },
            "Inversion": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [255,254,253,252,251,250,249,248,247,246,245,244,243,242,241,240,239,238,237,236,235,234,233,232,231,230,229,228,227,226,225,224,223,222,221,220,219,218,217,216,215,214,213,212,211,210,209,208,207,206,205,204,203,202,201,200,199,198,197,196,195,194,193,192,191,190,189,188,187,186,185,184,183,182,181,180,179,178,177,176,175,174,173,172,171,170,169,168,167,166,165,164,163,162,161,160,159,158,157,156,155,154,153,152,151,150,149,148,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],
                "g": [255,254,253,252,251,250,249,248,247,246,245,244,243,242,241,240,239,238,237,236,235,234,233,232,231,230,229,228,227,226,225,224,223,222,221,220,219,218,217,216,215,214,213,212,211,210,209,208,207,206,205,204,203,202,201,200,199,198,197,196,195,194,193,192,191,190,189,188,187,186,185,184,183,182,181,180,179,178,177,176,175,174,173,172,171,170,169,168,167,166,165,164,163,162,161,160,159,158,157,156,155,154,153,152,151,150,149,148,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],
                "b": [255,254,253,252,251,250,249,248,247,246,245,244,243,242,241,240,239,238,237,236,235,234,233,232,231,230,229,228,227,226,225,224,223,222,221,220,219,218,217,216,215,214,213,212,211,210,209,208,207,206,205,204,203,202,201,200,199,198,197,196,195,194,193,192,191,190,189,188,187,186,185,184,183,182,181,180,179,178,177,176,175,174,173,172,171,170,169,168,167,166,165,164,163,162,161,160,159,158,157,156,155,154,153,152,151,150,149,148,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],
            },
            "Abao color lab": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [42,42,42,41,41,41,41,41,41,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,41,41,41,42,42,42,43,43,44,44,45,46,46,47,48,48,49,50,51,51,52,53,54,55,56,57,57,58,59,60,61,62,63,64,65,66,67,68,69,70,70,71,72,74,75,76,77,78,79,80,81,82,83,84,85,86,88,89,90,91,92,93,94,95,96,97,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,202,203,204,205,206,207,208,209,210,211,212,213,213,214,215,216,217,218,219,220,221,221,222,223,224,225,226,227,228,229,229,230,231,232,233,234,235,235,236,237,238,239,240,241,241,242,243,244,245,246,247,247,248,249,250,251,252,252,253,254,255],
                "g": [116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,117,117,117,117,117,117,117,117,117,118,118,118,118,118,118,119,119,119,119,119,119,120,120,120,120,121,121,121,121,122,122,122,123,123,124,124,125,125,126,126,127,128,128,129,130,131,132,133,134,135,136,137,138,139,140,141,143,144,145,146,147,148,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,165,166,167,168,169,169,170,171,172,172,173,174,174,175,176,177,178,178,179,180,181,182,183,184,184,185,186,187,189,190,191,192,193,195,196,197,199,200,202,203,204,206,207,209,210,211,213,214,215,217,218,219,220,221,222,223,224,225,226,226,227,227,228,228,229,229,229,230,230,230,230,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231,231,230,230,230,230],
                "b": [138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,138,137,137,137,137,137,137,136,136,136,136,135,135,135,135,134,134,134,133,133,133,133,132,132,132,132,132,132,132,131,131,131,131,131,131,132,132,132,132,132,132,132,133,133,133,133,134,134,134,134,135,135,135,136,136,136,136,137,137,137,138,138,138,139,139,139,140,140,140,140,141,141,141,142,142,142,143,143,143,144,144,144,145,145,145,146,146,147,147,147,148,148,149,149,150,150,151,151,152,152,153,153,154,155,155,156,157,157,158,159,160,160,161,162,162,163,164,164,165,166,166,167,167,168,168,169,169,170,170,170,171,171,171,171,171,171,172,172,172,172,172,172,172,172,172,172,172,172,172,171,171,171,171,171,171,171,171,170,170,170,170]
            },
            "Ancient warmth": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [0,1,3,4,5,6,8,9,10,12,13,14,15,17,18,19,21,22,23,24,26,27,28,29,31,32,33,35,36,37,38,40,41,42,43,45,46,47,48,50,51,52,53,55,56,57,58,60,61,62,63,64,66,67,68,69,70,72,73,74,75,76,78,79,80,81,82,84,85,86,87,88,89,90,92,93,94,95,96,97,98,99,101,102,103,104,105,106,107,108,109,110,111,112,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,146,147,148,149,150,151,152,153,154,155,156,157,158,159,159,160,161,162,163,164,165,166,167,168,169,169,170,171,172,173,174,175,176,177,177,178,179,180,181,182,183,183,184,185,186,187,188,189,190,190,191,192,193,194,195,196,196,197,198,199,200,201,201,202,203,204,205,206,206,207,208,209,210,211,211,212,213,214,215,216,216,217,218,219,220,221,221,222,223,224,225,225,226,227,228,229,229,230,231,232,233,234,234,235,236,237,238,238,239,240,241,242,242,243,244,245,246,246,247,248,249,250,250,251,252,253,254,255,255],
                "g": [0,1,2,4,5,6,7,8,10,11,12,13,14,16,17,18,19,20,22,23,24,25,26,28,29,30,31,32,34,35,36,37,38,39,41,42,43,44,45,46,48,49,50,51,52,53,55,56,57,58,59,60,61,63,64,65,66,67,68,69,71,72,73,74,75,76,77,78,79,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,164,165,166,167,168,169,170,171,172,173,174,175,176,176,177,178,179,180,181,182,183,184,185,186,187,187,188,189,190,191,192,193,194,195,196,196,197,198,199,200,201,202,203,204,205,205,206,207,208,209,210,211,212,213,213,214,215,216,217,218,219,220,221,221,222,223,224,225,226,227,228,229,229,230,231,232,233,234,235,236,237,237,238,239,240,241,242,243,244,244,245,246,247,248,249,250,251,252,252,253,254,255],
                "b": [0,1,2,2,3,4,5,5,6,7,8,8,9,10,11,11,12,13,14,14,15,16,17,17,18,19,20,20,21,22,23,23,24,25,26,27,27,28,29,30,30,31,32,33,34,34,35,36,37,37,38,39,40,41,41,42,43,44,45,45,46,47,48,49,49,50,51,52,53,53,54,55,56,57,58,58,59,60,61,62,63,63,64,65,66,67,68,69,69,70,71,72,73,74,75,76,76,77,78,79,80,81,82,83,84,85,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,100,101,102,103,104,105,106,107,108,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,131,132,133,134,135,136,137,138,139,140,141,143,144,145,146,147,148,149,150,152,153,154,155,156,157,158,160,161,162,163,164,165,167,168,169,170,171,173,174,175,176,177,179,180,181,182,183,185,186,187,188,189,191,192,193,194,195,197,198,199,200,202,203,204,205,207,208,209,210,212,213,214,215,216,218,219,220,221,223,224,225,227,228,229,230,232,233,234,235,237,238,239,240,242,243,244,245,247,248,249,250,252,253,254,255]
            },
            "Beam gradient": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,5,5,5,5,6,6,7,7,7,8,8,9,10,10,11,11,12,13,13,14,15,16,16,17,18,19,20,21,22,22,23,24,25,26,27,28,29,30,31,32,33,34,36,37,38,39,40,41,42,43,44,46,47,48,49,50,52,53,54,55,57,58,59,61,62,63,65,66,67,69,70,71,73,74,75,77,78,80,81,82,84,85,87,88,89,91,92,94,95,97,98,99,101,102,104,105,107,108,110,111,113,114,116,117,119,120,122,123,124,126,127,129,130,132,133,135,136,138,139,141,142,144,145,147,148,150,151,153,154,156,157,159,160,162,163,165,166,168,169,170,172,173,175,176,177,179,180,181,183,184,186,187,188,190,191,192,194,195,196,198,199,200,201,203,204,205,206,208,209,210,211,212,213,214,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,234,235,236,237,238,239,239,240,241,242,242,243,244,244,245,245,246,247,247,248,248,248,249,249,250,250,250,251,251,251,252,252,252,252,253,253,253,253,254,254,254,254,254,255,255,255],
                "g": [1,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,5,5,5,6,6,6,7,7,8,8,8,9,10,10,11,11,12,13,13,14,15,16,16,17,18,19,20,21,21,22,23,24,25,26,27,28,29,30,31,32,33,34,36,37,38,39,40,41,42,43,44,46,47,48,49,50,52,53,54,55,57,58,59,61,62,63,65,66,67,69,70,71,73,74,75,77,78,79,81,82,84,85,86,88,89,91,92,94,95,96,98,99,101,102,104,105,107,108,110,111,113,114,116,117,119,120,122,123,125,126,127,129,130,132,133,135,136,138,139,141,142,144,145,147,148,150,151,153,154,156,157,159,160,162,163,165,166,168,169,170,172,173,175,176,177,179,180,181,183,184,185,187,188,189,191,192,193,195,196,197,199,200,201,202,204,205,206,207,208,210,211,212,213,214,215,216,217,218,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,234,235,236,237,238,239,239,240,241,242,242,243,244,244,245,246,246,247,247,248,248,249,249,249,250,250,250,251,251,251,252,252,252,252,253,253,253,253,254,254,254,254,254,255,255,255],
                "b": [1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,5,5,5,6,6,6,7,7,7,8,8,9,9,10,11,11,12,12,13,14,15,15,16,17,18,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45,46,47,48,49,51,52,53,54,56,57,58,60,61,62,64,65,66,68,69,70,72,73,74,76,77,78,80,81,83,84,85,87,88,89,91,92,94,95,97,98,100,101,102,104,105,107,108,110,111,113,114,116,117,119,120,121,123,124,126,127,129,130,132,133,135,136,138,139,141,142,144,145,147,148,150,151,153,154,156,157,159,160,162,163,164,166,167,169,170,172,173,174,176,177,179,180,181,183,184,185,187,188,189,191,192,193,195,196,197,199,200,201,202,204,205,206,207,209,210,211,212,213,214,215,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,234,235,236,237,238,239,239,240,241,242,242,243,244,244,245,245,246,246,247,247,248,248,249,249,250,250,250,251,251,251,252,252,252,252,253,253,253,253,254,254,254,254,254,255,255,255]
            },
            "Bright tea party": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [0,1,3,4,5,7,8,9,11,12,13,15,16,17,19,20,21,22,24,25,26,28,29,30,31,33,34,35,37,38,39,40,41,43,44,45,46,48,49,50,51,52,53,55,56,57,58,59,60,61,62,63,65,66,67,68,69,70,71,72,72,73,74,74,75,76,76,77,77,78,78,79,79,80,80,81,81,82,82,83,83,84,85,85,86,87,88,89,90,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,255],
                "g": [0,1,2,2,3,4,5,6,7,7,8,9,10,11,12,12,13,14,15,16,17,17,18,19,20,21,22,23,23,24,25,26,27,28,29,30,30,31,32,33,34,35,36,37,38,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,70,71,72,73,74,75,77,78,79,80,82,83,84,85,87,88,89,90,92,93,94,96,97,98,100,101,103,104,105,107,108,109,111,112,114,116,117,119,121,122,124,126,127,129,131,132,134,136,138,139,141,143,145,146,148,150,151,153,155,156,158,159,161,162,164,165,167,168,169,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,189,190,191,192,193,194,195,196,196,197,198,199,200,201,201,202,203,204,205,205,206,207,208,209,209,210,211,212,213,213,214,215,216,216,217,218,218,219,220,221,221,222,223,224,224,225,226,226,227,228,228,229,230,230,231,232,232,233,234,234,235,236,236,237,238,238,239,240,240,241,242,242,243,244,244,245,246,246,247,248,248,249,249,250,251,251,252,253,253,254,255,255],
                "b": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255]
            },
            "Bronze": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [1,2,2,3,3,4,4,5,5,6,6,7,8,8,9,9,10,10,11,12,12,13,14,14,15,16,16,17,18,18,19,20,21,22,22,23,24,25,26,27,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,59,60,61,62,63,64,66,67,68,69,70,71,73,74,75,76,77,79,80,81,82,83,85,86,87,88,89,91,92,93,94,95,97,98,99,100,101,103,104,105,106,108,109,110,111,112,114,115,116,117,119,120,121,122,124,125,126,127,129,130,131,132,134,135,136,138,139,140,142,143,145,146,147,149,150,151,152,154,155,156,157,159,160,161,162,163,164,165,166,167,168,169,170,170,171,172,173,174,174,175,176,177,177,178,179,179,180,180,181,181,182,182,183,183,184,184,185,185,185,186,186,186,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,187,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186,186],
                "g": [1,2,2,3,3,4,4,5,5,6,6,7,8,8,9,9,10,10,11,12,12,13,14,14,15,16,16,17,18,18,19,20,21,22,22,23,24,25,26,27,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,59,60,61,62,63,64,66,67,68,69,70,71,73,74,75,76,77,79,80,81,82,83,85,86,87,88,89,91,92,93,94,95,97,98,99,100,101,103,104,105,106,108,109,110,111,112,114,115,116,117,119,120,121,122,124,125,126,127,128,130,131,132,133,135,136,137,139,140,141,142,144,145,146,147,149,150,151,153,154,155,156,157,159,160,161,162,164,165,166,167,168,170,171,172,173,174,175,177,178,179,180,181,182,183,185,186,187,188,189,190,191,192,193,195,196,197,198,199,200,201,202,203,204,205,206,207,209,210,211,212,213,214,215,216,217,218,220,221,222,223,224,225,226,226,227,228,229,230,230,231,232,232,233,234,234,234,235,235,235,236,236,236,236,237,237,237,237,237,237,237,237,237,237,237,237,237,237,237,237,237,236,236,236,236,236],
                "b": [115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,115,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,115,115,115,115,115,115,115,116,116,116,116,116,116,117,117,117,117,117,118,118,118,119,119,119,120,120,120,121,121,122,123,123,124,124,125,126,127,128,129,130,131,132,133,134,135,136,138,139,140,142,143,144,146,147,149,150,151,153,154,156,157,158,160,161,162,164,165,166,167,168,170,171,172,173,174,175,177,178,179,180,181,182,183,185,186,187,188,189,190,191,192,193,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,230,231,232,233,234,235,235,236,237,238,238,239,240,241,241,242,243,243,244,245,246,246,247,247,248,249,249,250,251,251,252,253,253,254,254,255]
            },
            "Classic HDR": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [14,14,14,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,13,13,13,13,13,14,14,14,15,15,16,17,17,18,19,20,21,22,23,24,25,26,28,29,30,32,33,35,36,38,39,41,42,44,46,47,49,50,52,53,55,56,58,59,61,62,63,65,66,67,69,70,71,73,74,75,77,78,79,81,82,83,85,86,87,89,90,91,93,94,95,96,98,99,100,102,103,104,105,106,108,109,110,111,113,114,115,116,117,118,120,121,122,123,124,125,127,128,129,130,131,132,133,134,136,137,138,139,140,141,142,143,144,145,146,147,148,149,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,166,167,168,169,170,171,172,173,174,175,176,177,177,178,179,180,181,182,183,183,184,185,186,187,187,188,189,190,191,191,192,193,194,194,195,196,197,197,198,199,200,200,201,202,203,203,204,205,206,206,207,208,208,209,210,210,211,212,212,213,214,214,215,216,216,217,218,218,219,220,220,221,222,222,223,224,224,225,226,226,227,228,228,229,230,230,231,232,232,233,234,234,235,236,236,237,237,238,239,239,240,241,241,242],
                "g": [2,2,2,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,3,3,4,5,5,6,7,8,9,10,11,12,13,15,16,18,19,21,22,24,25,27,29,30,32,34,35,37,39,40,42,44,45,47,48,50,52,53,54,56,57,59,60,62,63,65,66,68,69,71,72,74,75,77,78,79,81,82,84,85,87,88,89,91,92,94,95,96,98,99,100,102,103,104,106,107,108,109,111,112,113,114,115,117,118,119,120,122,123,124,125,126,127,129,130,131,132,133,134,136,137,138,139,140,142,143,144,145,146,147,149,150,151,152,153,154,155,157,158,159,160,161,162,163,164,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,186,187,188,189,190,191,192,193,194,194,195,196,197,198,199,200,200,201,202,203,204,205,206,206,207,208,209,210,211,211,212,213,214,215,215,216,217,218,219,219,220,221,222,223,223,224,225,226,227,227,228,229,230,231,231,232,233,234,235,235,236,237,238,238,239,240,241,242,242,243,244,245,245,246,247,248,249,249,250,251,252,252,253,254],
                "b": [66,66,66,67,67,67,67,67,68,68,68,68,69,69,69,69,70,70,70,71,71,71,71,72,72,73,73,73,74,74,75,75,75,76,76,77,78,78,79,79,80,80,81,82,82,83,84,84,85,86,86,87,88,88,89,90,90,91,92,92,93,94,94,95,96,96,97,98,98,99,99,100,101,101,102,103,103,104,104,105,106,106,107,108,108,109,110,110,111,111,112,113,113,114,114,115,116,116,117,117,118,118,119,120,120,121,121,122,122,123,124,124,125,125,126,126,127,127,128,129,129,130,130,131,131,132,132,133,134,134,135,135,136,136,137,138,138,139,139,140,140,141,142,142,143,143,144,144,145,146,146,147,147,148,148,149,149,150,150,151,152,152,153,153,154,154,155,155,156,156,157,157,158,158,159,159,160,160,161,161,162,162,163,163,164,164,165,165,166,166,167,167,168,168,169,169,170,170,171,171,172,172,173,173,174,174,175,175,176,176,177,177,178,178,179,179,180,180,181,181,182,182,183,183,183,184,184,185,185,186,186,187,187,188,188,189,189,190,190,191,191,192,192,192,193,193,194,194,195,195,196,196,197,197,198,198]
            },
            "Cross process": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,2,2,2,2,3,3,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,13,14,15,16,16,18,19,20,21,22,23,24,26,27,28,29,31,32,33,34,36,37,38,39,41,42,43,45,46,47,49,50,51,53,54,55,57,58,59,61,62,63,65,66,68,69,70,72,73,75,76,77,79,80,82,83,84,86,87,89,90,92,93,95,96,98,99,100,102,103,105,106,108,109,111,112,114,115,117,118,120,122,123,125,126,128,129,131,132,134,135,137,138,140,142,143,145,146,148,149,151,153,154,156,157,159,160,162,164,165,167,168,170,172,173,175,176,178,180,181,183,185,186,188,189,191,193,194,196,197,199,201,202,204,206,207,209,211,212,214,215,217,219,220,222,224,225,227,229,230,232,234,235,237,239,240,242,243,245,247,248,250,252,253,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255],
                "g": [0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,11,11,12,12,13,14,14,15,15,16,17,17,18,19,19,20,21,22,22,23,24,25,26,27,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45,46,47,48,49,50,51,52,54,55,56,57,58,59,61,62,63,64,65,67,68,69,70,71,73,74,75,76,78,79,80,81,82,84,85,86,87,89,90,91,93,94,95,96,98,99,100,101,103,104,105,107,108,109,110,112,113,114,116,117,118,120,121,122,123,125,126,127,129,130,131,133,134,135,136,138,139,140,142,143,144,146,147,148,149,151,152,153,155,156,157,158,160,161,162,164,165,166,167,169,170,171,173,174,175,176,178,179,180,181,183,184,185,186,188,189,190,191,192,194,195,196,197,198,200,201,202,203,204,206,207,208,209,210,211,213,214,215,216,217,218,219,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,235,236,237,238,239,239,240,241,241,242,243,243,244,244,245,245,246,246,247,247,248,248,249,249,250,250,251,251,251,252,252,253,253,253,254,254,255,255],
                "b": [20,21,22,23,23,24,25,26,27,28,28,29,30,31,32,33,33,34,35,36,37,38,39,39,40,41,42,43,44,44,45,46,47,48,49,50,50,51,52,53,54,55,55,56,57,58,59,60,60,61,62,63,64,65,66,66,67,68,69,70,71,71,72,73,74,75,76,76,77,78,79,80,81,82,82,83,84,85,86,87,87,88,89,90,91,92,93,93,94,95,96,97,98,98,99,100,101,102,103,103,104,105,106,107,108,109,109,110,111,112,113,114,114,115,116,117,118,119,119,120,121,122,123,124,125,125,126,127,128,129,130,130,131,132,133,134,135,136,136,137,138,139,140,141,141,142,143,144,145,146,146,147,148,149,150,151,152,152,153,154,155,156,157,157,158,159,160,161,162,162,163,164,165,166,167,168,168,169,170,171,172,173,173,174,175,176,177,178,179,179,180,181,182,183,184,184,185,186,187,188,189,189,190,191,192,193,194,195,195,196,197,198,199,200,200,201,202,203,204,205,205,206,207,208,209,210,211,211,212,213,214,215,216,216,217,218,219,220,221,222,222,223,224,225,226,227,227,228,229,230,231,232,232,233,234,235]
            },
            "Gothic style": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,14,14,15,15,16,17,18,18,19,20,21,21,22,23,24,25,26,26,27,28,29,30,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,49,50,51,52,53,55,56,57,59,60,61,63,64,66,67,68,70,71,73,74,76,77,79,80,82,83,85,86,88,89,91,92,94,95,97,99,100,102,103,105,106,108,110,111,113,114,116,118,119,121,123,124,126,128,129,131,133,134,136,138,139,141,143,144,146,147,149,151,152,154,156,157,159,160,162,164,165,167,169,170,172,174,175,177,179,180,182,183,185,187,188,190,191,193,194,196,197,199,200,201,203,204,206,207,208,210,211,212,214,215,216,217,219,220,221,222,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,240,241,242,243,243,244,245,245,246,246,247,247,248,248,249,249,250,250,251,251,252,252,252,253,253,254,254,254,255,255],
                "g": [1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,4,4,4,4,5,5,6,6,6,7,7,8,8,9,9,10,11,11,12,13,14,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,46,47,48,49,50,51,53,54,55,56,58,59,60,61,63,64,65,66,68,69,70,72,73,74,76,77,78,80,81,82,84,85,87,88,89,91,92,94,95,97,98,100,101,103,104,106,107,109,110,112,113,115,116,118,119,121,122,124,125,127,128,129,131,132,134,135,137,138,140,141,143,144,146,147,148,150,151,153,154,156,157,159,160,161,163,164,166,167,168,170,171,173,174,175,177,178,179,181,182,184,185,186,188,189,190,192,193,194,196,197,198,200,201,202,203,205,206,207,208,209,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,233,234,235,236,237,237,238,239,240,240,241,242,242,243,244,244,245,245,246,246,247,247,248,248,249,249,249,250,250,251,251,251,251,252,252,252,253,253,253,253,254,254,254,254,255,255],
                "b": [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,4,4,4,5,5,5,6,6,6,7,7,8,8,8,9,9,10,10,11,11,12,13,13,14,14,15,16,16,17,18,18,19,20,21,22,22,23,24,25,26,27,27,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,45,46,48,49,50,51,53,54,55,57,58,59,61,62,64,65,66,68,69,71,72,74,75,77,78,80,81,83,84,86,87,89,91,92,94,95,97,98,100,102,103,105,107,108,110,112,113,115,117,118,120,122,123,125,127,128,130,132,134,135,137,139,140,142,144,145,147,149,151,152,154,156,157,159,161,163,165,166,168,170,171,173,175,177,178,180,182,183,185,187,188,190,191,193,195,196,197,199,200,202,203,205,206,208,209,211,212,213,215,216,217,219,220,221,223,224,225,226,228,229,230,231,232,233,234,235,236,237,238,239,240,240,241,242,243,243,244,245,245,246,247,247,248,248,249,249,250,250,251,251,251,252,252,253,253,253,254,254,255,255]
            },
            "Life sketch": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [19,19,19,19,20,20,20,20,20,20,20,21,21,21,21,21,22,22,22,22,23,23,23,24,24,24,25,25,26,26,26,27,28,28,29,29,30,31,31,32,33,33,34,35,36,36,37,38,39,40,41,41,42,43,44,45,46,47,47,48,49,50,51,52,53,54,55,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,151,152,153,154,155,156,157,158,159,160,161,162,163,164,166,167,168,169,170,171,172,173,174,175,176,177,178,180,181,182,183,184,185,186,187,188,189,190,192,193,194,195,196,197,198,199,200,201,203,204,205,206,207,208,209,210,211,213,214,215,216,217,218,219,220,221,223,224,225,226,227,228,229,230,232,233,234,235,236,237,238,239,240,242,243,244,245,246,247,248,249,251,252,253,254],
                "g": [18,18,18,18,19,19,19,19,19,19,19,20,20,20,20,20,21,21,21,21,22,22,22,23,23,23,24,24,25,25,26,26,27,27,28,29,29,30,31,31,32,33,34,35,35,36,37,38,39,40,41,41,42,43,44,45,46,47,48,49,50,51,52,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,132,133,134,135,136,137,138,139,140,141,142,143,144,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,183,184,185,186,187,188,189,190,191,192,193,194,195,196,198,199,200,201,202,203,204,205,206,207,208,209,211,212,213,214,215,216,217,218,219,220,221,222,224,225,226,227,228,229,230,231,232,233,234,235,237,238,239,240,241,242,243,244,245,246,247,249,250,251,252,253,254],
                "b": [16,16,17,17,17,17,18,18,18,18,19,19,19,20,20,20,21,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,29,29,30,31,32,32,33,34,35,36,37,38,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99,100,101,102,103,105,106,107,108,109,110,111,112,113,114,115,116,118,119,120,121,122,123,124,125,126,127,128,129,131,132,133,134,135,136,137,138,139,140,141,143,144,145,146,147,148,149,150,151,152,153,154,155,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,247,248,249,250,251,252,253,254]
            },
            "Old photo": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [8,8,9,9,9,10,10,11,11,12,12,13,13,13,14,14,15,15,16,16,17,18,18,19,19,20,21,21,22,23,23,24,25,26,26,27,28,29,29,30,31,32,33,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,50,51,52,54,55,56,58,59,61,62,64,66,67,69,71,72,74,76,78,80,82,84,85,87,89,91,93,95,97,99,101,103,106,108,110,112,114,116,118,121,123,125,128,130,133,135,138,141,143,146,149,151,154,156,159,162,164,167,169,172,174,176,178,180,183,185,186,188,190,191,193,194,196,197,198,199,201,202,203,204,205,205,206,207,208,208,209,210,211,211,212,212,213,214,214,215,215,216,217,217,218,219,219,220,220,221,221,222,222,223,223,224,224,225,225,226,226,226,227,227,228,228,228,229,229,229,230,230,230,231,231,232,232,232,233,233,233,234,234,234,235,235,235,236,236,236,237,237,237,238,238,238,239,239,239,239,240,240,240,241,241,241,241,242,242,242,242,243,243,243,243,244,244,244,244,245,245,245,245,245,246,246,246,246,246,247,247,247,247,247,248,248,248,248,248,249,249],
                "g": [28,29,29,29,30,30,31,31,31,32,32,33,33,33,34,34,35,35,36,36,37,37,38,39,39,40,40,41,42,42,43,44,45,46,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,67,68,69,70,71,72,73,75,76,77,78,79,80,82,83,84,85,87,88,89,91,92,93,94,96,97,98,100,101,102,104,105,106,108,109,110,112,113,114,116,117,118,119,121,122,123,124,126,127,128,129,131,132,133,134,136,137,138,139,141,142,143,144,145,147,148,149,150,151,152,154,155,156,157,158,159,160,161,162,163,164,165,167,168,169,170,171,172,173,174,175,176,177,178,178,179,180,181,182,183,184,185,185,186,187,188,189,189,190,191,191,192,193,193,194,194,195,196,196,197,197,198,198,199,199,200,200,201,201,202,202,203,203,204,204,205,205,206,206,207,208,208,209,209,210,211,211,212,212,213,214,214,215,215,216,216,217,217,218,219,219,220,220,221,221,221,222,222,223,223,223,224,224,224,224,225,225,225,225,226,226,226,226,226,226,226,227,227,227,227,227,227,227,227,227,227,227,227,228,228,228,228],
                "b": [28,29,29,29,30,30,31,31,31,32,32,33,33,33,34,34,35,35,36,36,37,37,38,39,39,40,40,41,42,42,43,44,45,46,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,67,68,69,70,71,72,73,75,76,77,78,79,80,82,83,84,85,87,88,89,91,92,93,94,96,97,98,100,101,102,104,105,106,108,109,110,112,113,114,116,117,118,119,121,122,123,124,126,127,128,129,131,132,133,134,136,137,138,139,141,142,143,144,145,147,148,149,150,151,152,154,155,156,157,158,159,160,161,162,163,164,165,167,168,169,170,171,172,173,174,175,176,177,178,178,179,180,181,182,183,184,185,185,186,187,188,189,189,190,191,191,192,193,193,194,194,195,196,196,197,197,198,198,199,199,200,200,201,201,202,202,203,203,204,204,205,205,206,206,207,208,208,209,209,210,211,211,212,212,213,214,214,215,215,216,216,217,217,218,219,219,220,220,221,221,221,222,222,223,223,223,224,224,224,224,225,225,225,225,226,226,226,226,226,226,226,227,227,227,227,227,227,227,227,227,227,227,227,228,228,228,228]
            },
            "Pink/blue gradient": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [0,0,0,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,4,4,4,5,5,6,6,6,7,8,8,9,9,10,11,11,12,13,14,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,59,60,61,62,63,64,65,66,67,68,70,71,72,73,74,75,76,77,78,80,81,82,83,84,85,86,87,88,90,91,92,93,94,95,96,97,99,100,101,102,103,104,106,107,108,109,111,112,113,114,115,117,118,119,121,122,123,125,126,127,129,130,131,133,134,135,137,138,140,141,142,144,145,146,148,149,151,152,153,155,156,158,159,160,162,163,165,166,168,169,170,172,173,175,176,178,179,181,182,184,185,186,188,189,191,192,193,195,196,198,199,200,202,203,204,206,207,208,209,211,212,213,215,216,217,219,220,221,222,224,225,226,227,228,230,231,232,233,234,235,236,237,238,239,240,240,241,242,243,243,244,245,245,246,246,247,248,248,249,249,249,250,250,251,251,251,252,252,252,253,253,253,254,254,254,255,255],
                "g": [0,1,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,5,5,5,6,6,7,7,7,8,8,9,10,10,11,11,12,13,13,14,15,16,17,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,54,55,56,57,58,59,60,61,62,63,65,66,67,68,69,70,72,73,74,75,77,78,79,80,82,83,84,86,87,89,90,91,93,94,96,97,99,100,101,103,104,106,107,109,110,112,113,115,116,118,119,121,122,123,125,126,128,129,131,132,134,135,137,138,140,141,143,144,146,147,149,151,152,154,155,156,158,159,161,162,164,165,167,168,169,171,172,174,175,176,178,179,181,182,183,185,186,187,189,190,191,193,194,195,197,198,199,200,202,203,204,205,207,208,209,210,211,212,214,215,216,217,218,219,220,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,240,241,242,243,243,244,245,245,246,246,247,247,248,248,249,249,250,250,250,251,251,251,252,252,252,253,253,253,253,254,254,254,254,254,255,255,255],
                "b": [66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,65,65,65,65,65,65,65,65,65,65,65,66,66,66,66,66,66,67,67,67,68,68,68,69,69,70,70,71,71,71,72,72,73,74,74,75,75,76,77,77,78,78,79,80,81,81,82,83,83,84,85,86,87,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,123,124,125,126,127,128,129,130,131,132,133,135,136,137,138,139,140,142,143,144,145,146,148,149,150,152,153,154,156,157,159,160,162,163,165,166,168,169,171,172,174,175,177,178,180,182,183,185,186,188,189,191,192,194,195,197,198,199,201,202,204,205,207,208,209,211,212,214,215,217,218,219,221,222,223,225,226,227,229,230,231,232,233,235,236,237,238,239,240,240,241,242,243,244,244,245,246,246,247,247,248,248,249,249,250,250,251,251,251,252,252,252,253,253,253,254,254,254,254,255,255]
            },
            "Retro": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [3,3,3,4,4,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,8,8,8,9,9,10,10,11,11,12,12,13,13,14,15,15,16,17,18,19,19,20,21,22,23,24,25,26,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,46,47,48,50,51,52,53,54,55,57,58,59,60,62,63,64,65,67,68,69,70,72,73,74,76,77,78,80,81,82,83,85,86,88,89,90,92,93,94,96,97,99,100,101,103,104,106,107,109,110,111,113,114,116,117,119,120,121,123,124,126,127,129,130,131,133,134,136,137,139,140,142,143,144,146,147,149,150,152,153,154,156,157,159,160,162,163,164,166,167,168,170,171,172,174,175,177,178,179,181,182,183,185,186,187,189,190,191,192,194,195,196,198,199,200,201,202,204,205,206,207,208,209,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,229,230,231,232,233,234,235,235,236,237,238,238,239,240,240,241,241,242,243,243,244,244,245,245,245,246,246,247,247,247,248,248,248,249,249,249,250,250,250,250,251,251,251,251,252,252,252],
                "g": [11,11,12,12,12,12,12,13,13,13,13,13,14,14,14,14,15,15,15,16,16,16,17,17,17,18,18,19,19,20,20,21,21,22,22,23,24,24,25,26,26,27,28,29,29,30,31,32,33,33,34,35,36,37,38,39,40,40,41,42,43,44,45,46,47,48,49,50,51,52,53,55,56,57,58,59,60,61,63,64,65,66,67,69,70,71,72,74,75,76,77,79,80,81,82,83,85,86,87,89,90,91,92,94,95,96,98,99,100,102,103,104,106,107,108,110,111,112,114,115,117,118,119,121,122,123,125,126,127,129,130,131,133,134,135,137,138,139,141,142,143,145,146,147,149,150,151,152,154,155,156,158,159,160,162,163,164,165,167,168,169,171,172,173,174,176,177,178,180,181,182,183,185,186,187,188,190,191,192,193,195,196,197,198,199,200,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,219,220,221,222,223,224,224,225,226,227,228,228,229,230,230,231,232,232,233,233,234,235,235,236,236,237,237,237,238,238,239,239,239,240,240,240,240,241,241,241,242,242,242,242,242,243,243,243,243,243,244,244],
                "b": [63,63,63,63,64,64,64,64,64,64,64,64,64,65,65,65,65,65,65,66,66,66,66,66,67,67,67,67,68,68,68,68,69,69,69,70,70,71,71,71,72,72,73,73,73,74,74,75,75,76,76,77,77,78,78,79,79,80,80,81,81,82,82,83,83,84,85,85,86,86,87,88,88,89,89,90,91,91,92,93,93,94,95,95,96,97,97,98,99,99,100,101,101,102,103,103,104,105,105,106,107,108,108,109,110,110,111,112,113,113,114,115,116,116,117,118,119,119,120,121,122,122,123,124,125,125,126,127,128,128,129,130,131,131,132,133,134,134,135,136,136,137,138,139,139,140,141,142,142,143,144,144,145,146,147,147,148,149,149,150,151,152,152,153,154,154,155,156,157,157,158,159,160,160,161,162,162,163,164,165,165,166,167,167,168,169,169,170,170,171,172,172,173,173,174,174,175,175,176,177,177,178,178,179,179,179,180,180,181,181,182,182,183,183,183,184,184,185,185,185,186,186,186,187,187,187,187,188,188,188,188,189,189,189,189,189,190,190,190,190,190,190,190,191,191,191,191,191,191,191,191,191,192,192,192,192]
            },
            "Strong contrast": {
                "a": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255],
                "r": [1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,7,7,7,8,8,8,9,9,10,10,10,11,11,12,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,23,23,24,25,25,26,27,28,29,29,30,31,32,32,33,34,35,35,36,37,38,39,40,41,42,43,44,45,46,47,48,50,51,52,54,55,57,58,60,62,64,66,68,70,72,74,77,79,81,84,86,89,92,94,97,100,102,105,108,110,113,115,118,121,123,126,128,130,133,135,137,139,141,143,145,148,150,152,154,156,158,160,162,164,166,168,170,172,174,175,177,179,181,183,184,186,187,189,190,192,193,195,196,197,198,200,201,202,203,204,204,205,206,207,207,208,209,209,210,211,211,212,212,213,213,214,214,215,216,216,217,217,218,218,219,220,220,221,221,222,223,223,224,224,225,226,226,227,227,228,228,229,229,230,230,231,232,232,233,233,234,234,235,235,236,236,237,238,238,239,239,240,240,241,242,242,243,243,244,244,245,245,246,247,247,248,248,249,249,250,251,251,252,252,253,253,254,254,255],
                "g": [1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,4,4,4,4,5,5,5,6,6,7,7,7,8,8,9,9,10,11,11,12,12,13,14,14,15,16,16,17,18,18,19,20,21,22,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,39,40,41,42,43,45,46,47,48,50,51,52,54,55,57,58,60,61,63,64,66,68,69,71,73,75,77,79,81,83,85,88,90,92,95,97,99,102,104,107,109,112,114,117,119,122,124,127,129,132,134,136,139,141,143,145,147,149,151,153,155,157,158,160,162,164,166,167,169,171,173,174,176,177,179,181,182,184,185,187,188,190,191,192,194,195,196,198,199,200,201,203,204,205,206,207,208,209,210,211,212,213,214,214,215,216,217,218,218,219,220,221,221,222,223,224,224,225,226,226,227,228,228,229,230,230,231,231,232,232,233,234,234,235,235,236,236,236,237,237,238,238,239,239,240,240,240,241,241,242,242,243,243,243,244,244,245,245,246,246,246,247,247,247,248,248,249,249,249,250,250,250,251,251,252,252,252,253,253,253,254,254,254,255,255],
                "b": [1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,8,8,8,9,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,17,17,18,18,19,19,20,21,21,22,22,23,24,24,25,26,26,27,28,29,30,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,47,48,49,50,51,53,54,55,57,58,59,61,62,64,65,67,68,70,72,73,75,77,79,81,82,85,87,89,91,93,95,98,100,102,105,107,109,112,114,116,119,121,123,126,128,130,133,135,137,139,141,143,145,147,149,151,153,154,156,158,160,162,163,165,167,169,170,172,174,175,177,179,180,182,183,185,186,188,189,191,192,193,194,196,197,198,199,200,202,203,204,205,206,206,207,208,209,210,211,211,212,213,214,214,215,216,216,217,218,218,219,220,220,221,222,222,223,224,224,225,226,226,227,227,228,228,229,230,230,231,231,232,232,233,233,234,234,235,235,236,236,237,237,238,238,239,239,240,240,240,241,241,242,242,243,243,244,244,245,245,246,246,247,247,248,248,249,249,250,250,250,251,251,252,252,253,253,254,254,255,255]
            },
        };
    };

    get_filter_names = () => {

        const filters = this._get_filters();
        const names = Object.entries(filters).map((entry) => {

            const [key, value] = entry;
            return key;
        });

        return names;
    };

    _dutone_pixels = (contrast, color_a, color_b, pxls, pxl_colors) => {

        pxls = [...pxls];
        pxl_colors = [...pxl_colors];

        pxl_colors = pxl_colors.map((pxl_color) => {

            const [r, g, b, a] = this._get_rgba_from_hex(pxl_color);
            const [h, s, l] = this.rgb_to_hsl(r, g, b);

            return this._blend_colors(color_a, color_b, (l/100) / contrast, false);

        });

        return this._remove_duplicate_pxl_colors(pxls, pxl_colors);
    };

    _filter_pixels = (name, intensity = 1, pxls, pxl_colors, remove_duplicate_pxl_colors = true) => {

        pxls = [...pxls];
        pxl_colors = [...pxl_colors];

        const filters = this._get_filters();
        const filter = filters[name] || filters["1997"];
        const pxl_colors_copy = [...pxl_colors];

        if(intensity !== 0) {

            pxl_colors = pxl_colors.map((hex, index) => {

                const [r, g, b, a] = this._get_rgba_from_hex(hex);

                const new_r_hex = this._get_hex_value_from_rgb_value(filter["r"][r]);
                const new_g_hex = this._get_hex_value_from_rgb_value(filter["g"][g]);
                const new_b_hex = this._get_hex_value_from_rgb_value(filter["b"][b]);
                const new_a_hex = this._get_hex_value_from_rgb_value(a);

                return "#" + new_r_hex + new_g_hex + new_b_hex + new_a_hex;
            });

            pxl_colors = pxl_colors.map((hex) => {

                const [r, g, b, a] = this._get_rgba_from_hex(hex);

                const new_r_hex = this._get_hex_value_from_rgb_value(filter["a"][r]);
                const new_g_hex = this._get_hex_value_from_rgb_value(filter["a"][g]);
                const new_b_hex = this._get_hex_value_from_rgb_value(filter["a"][b]);
                const new_a_hex = this._get_hex_value_from_rgb_value(a);

                return "#" + new_r_hex + new_g_hex + new_b_hex + new_a_hex;
            });


            pxl_colors = pxl_colors.map((hex, index) => {

                return this._blend_colors(pxl_colors_copy[index], hex, intensity);
            });
        }

        return remove_duplicate_pxl_colors ? this._remove_duplicate_pxl_colors(pxls, pxl_colors): [pxls, pxl_colors];

    };

    _to_dutone = (contrast = 0.8, color_a = "#ffffffff", color_b = "#000000ff") => {

        const { _s_pxls, _s_pxl_colors, _layer_index } = this.state;

        [_s_pxls[_layer_index], _s_pxl_colors[_layer_index]] = this._dutone_pixels(contrast, color_a, color_b, _s_pxls[_layer_index], _s_pxl_colors[_layer_index]);

        this.setState({_s_pxls, _s_pxl_colors, _old_pxls_hovered: null, _pxls_hovered: null}, () => {

            this._update_canvas();
        });

    };

    _to_filter = (name, intensity = 1) => {

        const { _s_pxls, _s_pxl_colors, _layer_index } = this.state;

        [_s_pxls[_layer_index], _s_pxl_colors[_layer_index]] = this._filter_pixels(name, intensity, _s_pxls[_layer_index], _s_pxl_colors[_layer_index]);

        this.setState({_s_pxls, _s_pxl_colors, _old_pxls_hovered: null, _pxls_hovered: null}, () => {

            this._update_canvas();
        });

    }

    _to_rotation = (right = true) => {

        const { pxl_width, pxl_height, _s_pxls, _pxl_indexes_of_selection, _select_shape_index_a, _shape_index_a, _base64_original_images, _original_image_index, _layer_index } = this.state;
        const {_imported_image_pxls, _imported_image_width, _imported_image_height} = this.state;
        let { _is_there_new_dimension } = this.state;

        const new_imported_image_width = _imported_image_height;
        const new_imported_image_height = _imported_image_width;
        let n_imported_image_pxls =  new Array(new_imported_image_width * new_imported_image_height);

        const new_pxl_width = pxl_height;
        const new_pxl_height = pxl_width;
        let ns_pxls = this.state._s_pxls;

        let new_pxl_indexes_of_selection = new Set();
        let new_select_shape_index_a = _select_shape_index_a;
        let new_shape_index_a = _shape_index_a;

        if(_imported_image_pxls.length) {

            _imported_image_pxls.forEach((pxl, index) => {

                const x = index % _imported_image_width;
                const y = (index - x) / _imported_image_width;

                const new_y = right ? x: (new_imported_image_height - 1) - x;
                const new_x = right ? (new_imported_image_width - 1) - y: y;
                const new_index = new_x + new_y * new_imported_image_width;

                n_imported_image_pxls[new_index] = pxl;

            });

        }else {

            _is_there_new_dimension = true;

            for (let i = 0; i < _s_pxls.length; i++) {

                let new_pxls = new Array(new_pxl_width * new_pxl_height);

                _s_pxls[i].forEach((pxl, index) => {

                    const x = index % pxl_width;
                    const y = (index - x) / pxl_width;

                    const new_y = right ? x: (new_pxl_height - 1) - x;
                    const new_x = right ? (new_pxl_width - 1) - y: y;
                    const new_index = new_x + new_y * new_pxl_width;


                    new_pxls[new_index] = pxl;

                    if(i === _layer_index) {

                        if(_pxl_indexes_of_selection.has(index)) {

                            new_pxl_indexes_of_selection.add(new_index);
                        }

                        if(_select_shape_index_a === index){

                            new_select_shape_index_a = new_index;
                        }

                        if(_shape_index_a === index) {

                            new_shape_index_a = new_index;
                        }
                    }

                });
                ns_pxls[i] = new_pxls;
            }

        }

        //
        if(typeof _base64_original_images[_original_image_index] !== "undefined" && !_imported_image_pxls.length) {

            const degrees = right ? 90: -90;

            let image = new Image();
            image.onload = () => {

                let [ ctx, canvas ] = this._get_new_ctx_from_canvas(image.height, image.width);

                ctx.clearRect(0,0, canvas.width, canvas.height);
                ctx.save();
                ctx.translate(canvas.width / 2,canvas.height / 2);
                ctx.rotate(degrees * Math.PI / 180);
                ctx.drawImage(image,-image.width / 2, -image.height / 2);
                ctx.restore();

                const base64_original_image = image.src.includes("image/png") ?
                    canvas.toDataURL("image/png"):
                    canvas.toDataURL("image/jpeg");

                const new_base64_original_images = !_base64_original_images.includes(base64_original_image) ?
                    _base64_original_images.concat([base64_original_image]):
                    _base64_original_images;

                this.setState({
                    pxl_width: new_pxl_width,
                    pxl_height: new_pxl_height,
                    _s_pxls: ns_pxls,
                    _pxl_indexes_of_selection: new_pxl_indexes_of_selection,
                    _is_there_new_dimension,
                    _select_shape_index_a: new_select_shape_index_a,
                    _shape_index_a: new_shape_index_a,
                    _base64_original_images: new_base64_original_images,
                    _original_image_index: -1,
                }, () => {

                    this._request_force_update(() => {

                        this.setState({_original_image_index: new_base64_original_images.indexOf(base64_original_image), _last_action_timestamp: Date.now()});
                        this._notify_size_change();
                        this._update_canvas();
                    });
                });

            };
            image.src = _base64_original_images[_original_image_index];

        }else {

            this.setState({
                pxl_width: new_pxl_width,
                pxl_height: new_pxl_height,
                _s_pxls: ns_pxls,
                _imported_image_width: new_imported_image_width,
                _imported_image_height: new_imported_image_height,
                _imported_image_pxls: n_imported_image_pxls,
                _pxl_indexes_of_selection: new_pxl_indexes_of_selection,
                _is_there_new_dimension,
                _select_shape_index_a: new_select_shape_index_a,
                _shape_index_a: new_shape_index_a,
                _last_action_timestamp: Date.now()
            }, () => {

                this._request_force_update(() => {

                    this._notify_size_change();
                    this._update_canvas();
                });
            });
        }
    };

    _pxl_colors_to_alpha = (pxls, pxl_colors, color, intensity) => {

        pxls = [...pxls];
        pxl_colors = [...pxl_colors];

        pxl_colors = pxl_colors.map((pxl_color) => {

            const difference = this._match_color(color, pxl_color);
            let [r, g, b, a] = this._get_rgba_from_hex(pxl_color);
            a -= a * (1 - difference) * intensity;

            return "#" + this._get_hex_value_from_rgb_value(r) + this._get_hex_value_from_rgb_value(g) + this._get_hex_value_from_rgb_value(b) + this._get_hex_value_from_rgb_value(a);
        });

        return [pxls, pxl_colors];
    };

    _pxl_adjust_contrast = (pxls, pxl_colors, intensity = 1) => {

        let min_grey = 255;
        let max_grey = 0;

        pxl_colors.forEach((pxl_color, index) => {

            if(pxls.includes(index)) {

                const [r, g, b, a] = this._get_rgba_from_hex(pxl_color);
                const greyscale = (r + g + b) / 3 * (a / 255);

                if(a > 0) {

                    if(greyscale > max_grey) {

                        max_grey = greyscale;
                    }
                    if(greyscale < min_grey) {

                        min_grey = greyscale;
                    }
                }
            }
        });

        const alpha = 255 / Math.max(1, max_grey - min_grey);
        const beta = -min_grey * alpha;

        pxl_colors = pxl_colors.map((pxl_color) => {

            let [r, g, b, a] = this._get_rgba_from_hex(pxl_color);

            r = r * alpha + beta;
            g = g * alpha + beta;
            b = b * alpha + beta;

            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));

            return this._blend_colors(pxl_color, this._get_hex_color_from_rgba_values(r, g, b, a), intensity);

        });

        return [pxls, pxl_colors, alpha, beta];

    };

    _pxl_adjust_smoothness = (pxls, pxl_colors, rounds = 1) => {

        const {pxl_width, pxl_height} = this.state;

        for(let round = 0; round < rounds; round++) {

            pxls.forEach((pxl, i) => {

                let up, right, bottom, left;

                up = i - pxl_width; up = up < 0 ? -1: up;
                right = i + 1; right = right % pxl_width === 0 ? -1: right;
                bottom = i + pxl_width; bottom = bottom > (pxl_width * pxl_height) ? -1: bottom;
                left = i - 1; left = left % pxl_width === pxl_width - 1 ? -1: left;

                let up_left, up_right, bottom_left, bottom_right;

                up_left = up - 1; up_left = up === -1 || left === -1 ? -1: up_left;
                up_right = up + 1; up_right = up === -1 || right === -1 ? -1: up_right;
                bottom_left = bottom - 1; bottom_left = bottom === -1 || left === -1 ? -1: bottom_left;
                bottom_right = bottom + 1; bottom_right = bottom === -1 || right === -1 ? -1: bottom_right;

                const pxl_around = [
                    pxls[up],
                    pxls[right],
                    pxls[bottom],
                    pxls[left],
                    pxls[up_left],
                    pxls[up_right],
                    pxls[bottom_left],
                    pxls[bottom_right],
                ];

                let pxl_around_occurrences = [];
                pxl_around.forEach((pxl_around) => {

                    pxl_around_occurrences[pxl_around] = typeof pxl_around_occurrences[pxl_around] === "undefined" ? 1: pxl_around_occurrences[pxl_around] + 1;
                });

                let bigger_pxl_around_occurrence_color_index = -1;
                let bigger_pxl_around_occurrence_occurrence = -1;

                Object.entries(pxl_around_occurrences).forEach((pxl_around_occurrence) => {

                    const [key, value] = pxl_around_occurrence;

                    if(bigger_pxl_around_occurrence_occurrence < value) {

                        bigger_pxl_around_occurrence_occurrence = value;
                        bigger_pxl_around_occurrence_color_index = key;
                    }

                });

                if(bigger_pxl_around_occurrence_occurrence >= 6 && bigger_pxl_around_occurrence_color_index !== -1) {

                    pxls[i] = bigger_pxl_around_occurrence_color_index;
                }

            });

        }

        return this._remove_duplicate_pxl_colors(pxls, pxl_colors);

    };

    _remove_close_pxl_colors = (pxls, pxl_colors, bucket_threshold = null, threshold_steps = null, color_number_bonus = 0) => {

        let indexes_of_colors_proceed = new Set();
        let original_pxls = [...pxls];
        let original_pxl_colors = [...pxl_colors];
        let is_bucket_threshold_auto = bucket_threshold === "auto";
        let is_bucket_threshold_auto_goal_reached = !is_bucket_threshold_auto;
        let bucket_threshold_auto_goal_target = 6;
        let bucket_threshold_auto_goal_attempt = new Set();
        let best_color_number = Math.max(Math.cbrt(original_pxl_colors.length) * (2/3) + color_number_bonus, 1);

        if(best_color_number < 2 || best_color_number > pxl_colors.length) {

            is_bucket_threshold_auto_goal_reached = true;
        }

        let attempt = 1;

        while (!is_bucket_threshold_auto_goal_reached || attempt === 1) {
            attempt++;

            bucket_threshold = is_bucket_threshold_auto ?
                1/bucket_threshold_auto_goal_target:
                bucket_threshold || this.state.bucket_threshold;
            threshold_steps = threshold_steps || Math.round(bucket_threshold * 255);
            const color_loss = (255 - (255 / (bucket_threshold * 255))) / 255;

            [original_pxls, original_pxl_colors] = [[...pxls], [...pxl_colors]];

            let reduced_pxl_colors = [...pxl_colors].map((color_hex) => {

                let [r, g, b, a] = this._get_rgba_from_hex(color_hex);

                r = this._reduce_color(r, 1 - color_loss);
                g = this._reduce_color(g, 1 - color_loss);
                b = this._reduce_color(b, 1 - color_loss);
                a = this._reduce_color(a, 1 - color_loss);

                return "#" + this._get_hex_value_from_rgb_value(r) + this._get_hex_value_from_rgb_value(g) + this._get_hex_value_from_rgb_value(b) + this._get_hex_value_from_rgb_value(a);

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

                                if(this._match_color(color_a, color_b, weighted_threshold)) {

                                    const color = color_a_more_used ?
                                        this._blend_colors(original_pxl_colors[index_of_color_a], original_pxl_colors[index_of_color_b], 1 / (color_usage_difference), true):
                                        this._blend_colors(original_pxl_colors[index_of_color_b], original_pxl_colors[index_of_color_a], 1 / (color_usage_difference), true);

                                    original_pxl_colors[index_of_color_a] = color;
                                    original_pxl_colors[index_of_color_b] = color;
                                    indexes_of_colors_proceed.add(index_of_color_a);
                                    indexes_of_colors_proceed.add(index_of_color_b);
                                }
                            }
                        });
                    }
                });

                [ new_pxls, new_pxl_colors ] = this._remove_duplicate_pxl_colors(new_pxls, original_pxl_colors);
                original_pxl_colors = new_pxl_colors;
            }

            if((original_pxl_colors.length + 2 > best_color_number && original_pxl_colors.length - 2 < best_color_number) || !is_bucket_threshold_auto || bucket_threshold_auto_goal_attempt.has(bucket_threshold_auto_goal_target)) {

                return this._remove_duplicate_pxl_colors(new_pxls, original_pxl_colors);
            }else if(original_pxl_colors.length > best_color_number){

                bucket_threshold_auto_goal_attempt.add(bucket_threshold_auto_goal_target);
                bucket_threshold_auto_goal_target --;
            }else {

                bucket_threshold_auto_goal_attempt.add(bucket_threshold_auto_goal_target);
                bucket_threshold_auto_goal_target ++;
            }

        }

        return this._remove_duplicate_pxl_colors(pxls, pxl_colors);

    };

    _remove_duplicate_pxl_colors = (_pxls, _pxl_colors) => {

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
    };
    
    _get_shadow = (elevation) => {

        function create_shadow(...px) {
            return [
                `${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadow_key_umbra_opacity})`,
                `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadow_key_penumbra_opacity})`,
                `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadow_ambient_shadow_opacity})`,
            ].join(',');
        }

        const shadow_key_umbra_opacity = 0.2;
        const shadow_key_penumbra_opacity = 0.14;
        const shadow_ambient_shadow_opacity = 0.12;

        // Values from https://github.com/material-components/material-components-web/blob/be8747f94574669cb5e7add1a7c54fa41a89cec7/packages/mdc-elevation/_variables.scss
        const shadows = [
            'none',
            create_shadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0),
            create_shadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0),
            create_shadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0),
            create_shadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0),
            create_shadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0),
            create_shadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0),
            create_shadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1),
            create_shadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2),
            create_shadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2),
            create_shadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3),
            create_shadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3),
            create_shadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4),
            create_shadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4),
            create_shadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4),
            create_shadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5),
            create_shadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5),
            create_shadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5),
            create_shadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6),
            create_shadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6),
            create_shadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7),
            create_shadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7),
            create_shadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7),
            create_shadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8),
            create_shadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8),
        ];

        return shadows[elevation];
    }

    _get_cursor = (_is_on_resize_element, _is_image_import_mode, _mouse_down, tool, select_mode) => {

        let cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAq0lEQVRYR+1WQQrAIAxb///oDmUOkc3W2kEG2XHQGpPURg6wTzLwqKr2fUQk3Ddc2AMogBqGgo2ARpkhGaKHZtMIKRmnjJLtrBBIU0O9QzvsjrUpyzUd0BgfvAdYWz3StzLUm7KBuWLEKzZPzHjqO8SWElXuX7UnLCCvTCvTFJYsAuarGswp270tQ77FIOQuY0BjQLOM+zuGVlbK7HIpLzXH3vIXGfIwlGXqE9034xUtxdxDAAAAAElFTkSuQmCC") 18 18, auto';

        if(_is_image_import_mode) {

            if(!_mouse_down) {

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABFUlEQVRYR+2Y2w6EIAxEl///aDYYa7C2dFqryyb4qsBhOr3E8kl4aq2Vb1NKKZGtQ4v4QQ2oP7/xTQckqYNAuhTSQiMp1IAiqrmBpEMWEPlBMy+qEOKrV0OG+GoBWZm3FFoKtUyiXsvV+P8sk3rVfqvN/BmF0eUhfiDJT136J0BSnEklrUUM1hzdQvMVH0kudWikkvQuMhV2vfEyyMFAtElwMhW5pclSBOIhYDe6I8ppLQQkZdMUQJpKafLsBdQ0tTaMZYK4TD010NNhg039lkohoKdU6ir3qfSYE2N2dR4Zeru8lT1TAmWHTQsXpBBV7iyoEQwMlAVlwbiA7kIhMG6gHsoTQhQmBNQXTStD+/fIz6r2/RftLsg0XDwDiAAAAABJRU5ErkJggg==") 20 18, auto';
            }else {

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAA80lEQVRYR+3X4Q6DIAwEYHn/h2bBQIJNoXcVHEb2c3PZx11hGo7FXmExz7FBViM7oe8lFGOMctUhBPcouL4oEfXvK77TiyJpUMEURALIQOR7DJICSUxaOQLSritImRwNstJwIC+G94K0uhxpXDZkrptPqIX5C6iHsU7d+vPO8OMJjcK04FRlszFV3XZCT2Bo0I2/I3i04MpSQhuUc1VP6uVmKA/c9NrgGVoWlG+s4F3DXkgl9ERKLtCslNw3aLPOJC2dc/FW70uCRtfWqgtKqAz3KFQPA4NGoSwMBbqLQjA0qEYxFaIYF6jsSu2Zvrdj0UfpHwMA+yX+QNKuAAAAAElFTkSuQmCC") 20 24, auto';
            }

            if(_is_on_resize_element) {

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAA9ElEQVRYR+3X0Q6FIAgGYDjn/R/5xBmtmjMTmIBd2G3WvsE/VISXPfgyDyyQ1JFbhYiIpI/q94joVukmyPJ/9i+Q1MUpFTpa8wWAzZoxy/puhg7E9b8MlAhiTRnyaJQIQsQPEW1ZKA2I12AWSgvaO5eBsoBSUFZQOErcyx6GHgf9FxH0kU0xJFMjoJD2jYIYZWpffbypI+EBMlWKQWf2WkcXL5AalQlSobJBImoGqIsq51d0hm5n/9beVx5nskG9kbDjZ4Ca7TtLGQ6S7nT19SoFNHqn8xyMnIlrCmtuGikV0kDKNVF7mdXxuN61ZR6qBZKq+Aeqdig0aelV6gAAAABJRU5ErkJggg==") 18 18, auto'
            }

        }else if (tool === "RECTANGLE") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAv0lEQVRYR+2X3Q6AIAiF5f0fmuaFG6OSH9F00a0IX+dAKZTNHtiMpySQ5Mg/FUJEpMoAwKsQSxSqQI2hsiUQb9whhbjf0lS0dWrDUw5qGc9J9956iL6NFob3hSUH33sWEJvWrmBLLJNG1GCpf+wtE5FAkZa5fx0zLNNaW+O6Yx+lUAJJCgwdP2b0kCXnkh5KIE0PuU+MXF6pmHY9BEhbzBInfdtCzkPTgSwFPLGf3zos0EvuZQlkUUCKTcuOU+gCTnb3JcS3RYIAAAAASUVORK5CYII=") 27 12, auto';
        }else if (tool === "ELLIPSE") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABH0lEQVRYR+2X4Q7CIAyEy0x8//c1WoNhCWOFawvo1PnTAf24HqUEOtgvzORhZs7XDyHAeHBAD3AEWhki2wlUqvmfCpVGRR7LPSSNLX1lMnWeAiE90bSIb/NdMrp6hRZMjJIWfw+QBFOUmCrI8JTVYDQ1Zfgp64FJaRxbGEsgbbVd8zdaoYWZ79bSn5tpKJCw2JWIbpZjNPRy9ezOAlsbW61DPwl0uJR5VJ6ashMInapToY8plPU77v5Jew+2AnTdZYJ/ltjHIVWbO/be9t55ERYCvQalXjnJfiGiR22nvT0U9IS02wS5m9sLAxWSGq3sv51I5atDa+TN+x+ZrAXVmuuBUStkhfLCmIHWxh2pqnmRmBs0FHTWd3jKZgX+GoWe1olaNCjYBWEAAAAASUVORK5CYII=") 25 9, auto';
        }else if (tool === "LINE") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAA+klEQVRYR+3Y0Q6DIAwFUOr+/5NdTY1dkJS1YIsmstexcLhArYP0sA88zJN+IERECw4AQhdxAmlzkXmCaNvK3ePkbkson5jO1gQd23RKIr9xtydUu/7HVn5SSl9LiegZ03Tt+cADwEJnv2dC7TfmwpjXqMikrFV3QcRVQLknZQVR0kNQLaAhqFZQOKoHFIrqBYWhroBCUFdB7igPUBX1ryrXGj0vkIhSnoni3J4gM4r7rbKPp9S8QdRtmtsYqfkLB/GipcknSHtZGJ6QdsveC9LaVPqeDvuQhCwYHjMU1PDnxe7jYuleh6TVW1J7J8iSTPGG7P8sa0WU4zdwA0Y04iTpEgAAAABJRU5ErkJggg==") 32 32, auto';
        }else if (tool === "PENCIL") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAA7UlEQVRYR+3X2w6EIAwEUPv/H82GRDYE6dUO8KCvEntSBgG6DnvoMM/1gbQZWdKhUkppECISa8JBFdMbqk1CQUEjpnVJQsFAHEZDwUC1cASVDmoBbjmRULOpSwX1xftiniylgWZFJRQX7BSQdVraOOgq04J7h/v/77nHs4141SELRlvm41YSBnkwY5ek/SwEQmEq1A1CYtwgNMYFWoExg1ZhTKCVGBW0GiOCdmBY0C7MFLQT8xqkHdi1K8/s/eNPbe0QAhPuEAoTAiExbhAaw4K4MGrX4EiI0w5oGcVNqwxVyPpd9wHN+uHouONAP0LJ2yWtxGVEAAAAAElFTkSuQmCC") 5 32, auto';
        }else if (tool === "PENCIL PERFECT") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAA/0lEQVRYR+3XSw7DIAwE0Pj+h6ZCqiNE/cHAGBbttg1+GagBei770GWe5w/yZiQloVJKYQgRmTXhoIppDdVmoaCgHsMpWSgYSMN4KBioFp5BbQfxAuZ1YqGkqdsKaou3xSJraRtIKmqhtIW9BTQ6Lfw76L/MSOZtykJSahBLCVnTFG2Ibyf39hbt+wjm2wLMDr0EQmEqKjxlSEwYhMaEQBmYYVAWZgiUiXFB2RgTdAKjgk5hRNBJzBCIN0bveDG7BfXP/XRq6ZCVhXET4utUf5XyrjIraZkJSQMjMW5CPQiNUUFa5N41eGWqls5DOwqrL40cfGbs8AFtpkjkmetAH9mVQzQQt8P4AAAAAElFTkSuQmCC") 5 32, auto';
        }else if (tool === "PICKER") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABTUlEQVRYR+2W4RKEIAiEpd7/kS9ubLQxFCGUq5upv5X7uYsghIc98DCe8AJJifzEIUTEDAIAXU13oAhTMkS2HtQUoCS6hhC2MhIKk9/1oIaBsmgSOaA4GAlqCIiJY0XEj1AqO1fLqSGgEMJCxZOIdJjcgOLCFZSKxsmhqA2IuGkiIgXfPG2jkU2F2Xentbfxnal+vPpQ5UwSipBsfBKM1SHOmSXWaTrOp+5cHPGqeVLnr0YmwiSBZm3R5tkqlytAXEx0191Cl6C0QGZn8qDXDlgNkNmZwo04ZfZilwpbAhpyBgDKOPNa5vvQDGdO1xFNz+Nob4Hh+tBtME0g7o5DboNcbYmNT4qtiqwEYnqGG8wVhzK4Nk7JCPZ91yFy/60Gp9R1LVQqoGI4HhoeMKrIWrv0gjEBecKwQL3syTiwlEn3H2mWTReUFnyB/s6hL1JSZjT7s1UhAAAAAElFTkSuQmCC") 5 32, auto';
        }else if (tool === "EXCHANGE") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABoklEQVRYR+2Y61IDMQiFoa2+//tqxdmdJAMJ5JBMR6tTf7ob9gMOl5Tpyf74yXjoXwBdReQzG1lm1k5fiOhrdjYdIRGRash+Y46mjg0vdrDn8xTQAbMCkY3eAdtDIaCLiNx7mJnXGgY5sQoUwjDzjYjuIBI3EfnQUAWgHVsC6tNUo+LlPQLTNurHnf+9EVErEjdlHgwzX1GF9GCBnbUIPQrm+CoqhlTKAiAk/ihrg470ixmgs+lVIXoHqkHdlzwapbUTCrzTHhvPHcG51YRSUdI19JhMf0JAQ6oyMCqKy1AvoBI9oyvd234lQl7DbIO7K8NziJbqeieioToeoaElILVimJauyx0NTSTqNFCmLH80Qn8SKDOjQGM046SfBuG0D1p909XC6DCmHP2YLWKpExdvXLHvpDszXLdWhgwMEQ0b6BZQZu1MAKVgDjt9ylzBzfoGgqlac3ZrV79QQ0GEMjpyl7NiL1yHIZAXgd1rEILxUgZFjVIUPZ9tn/rMUh86PTBX9TmejmT2+pRZ3s0PBKghGm83rk4ZoN0sbZ17AaGwfQNzJa40/U9w+QAAAABJRU5ErkJggg==") 18 18, auto';
        }else if (tool === "BUCKET") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABMklEQVRYR+2XwRLDIAhEpen/f3FTOmaajrUgC5jpxVyD+lwXUCoXfszM5/RERMhSUBAyUR9TYVqGyoZAXQLUw1TYvwFlYCr4VIWyMFOBZsBMA5JgTpOj3vlkYySD2jEjmAhUykPaMR3Sd2UHVSoMZHnG+q+dTAgIXQyNa+HcQN5FvPEuIO/kjam/2siocsNAURgvFAQ0yiZv2bCyLwzkBdHi+3IAAb3P/McHWSipNo2Absy8E9FWSnnOhtIKpQp0+qYfiLQKS7lR1RaBrNteBspqIRLQxswP4fp5L6XsozTOKKN2e2330s48SlnKTAFCjY7CiBc0j0LI8Xlg1BujZWrJK9nWYt4YI4+8FsqrjAlkZcygFRyvVeRRKM0Bt44ooHfcArIUWwothSwFrP/LQ5ZCL65vGzRTMXdZAAAAAElFTkSuQmCC") 6 25, auto';
        }else if (tool === "HUE BUCKET") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABMklEQVRYR+2XwRLDIAhEpen/f3FTOmaajrUgC5jpxVyD+lwXUCoXfszM5/RERMhSUBAyUR9TYVqGyoZAXQLUw1TYvwFlYCr4VIWyMFOBZsBMA5JgTpOj3vlkYySD2jEjmAhUykPaMR3Sd2UHVSoMZHnG+q+dTAgIXQyNa+HcQN5FvPEuIO/kjam/2siocsNAURgvFAQ0yiZv2bCyLwzkBdHi+3IAAb3P/McHWSipNo2Absy8E9FWSnnOhtIKpQp0+qYfiLQKS7lR1RaBrNteBspqIRLQxswP4fp5L6XsozTOKKN2e2330s48SlnKTAFCjY7CiBc0j0LI8Xlg1BujZWrJK9nWYt4YI4+8FsqrjAlkZcygFRyvVeRRKM0Bt44ooHfcArIUWwothSwFrP/LQ5ZCL65vGzRTMXdZAAAAAElFTkSuQmCC") 6 25, auto';
        }else if (tool === "MOVE") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABKklEQVRYR9WYURLDIAhE4/0PbcZMdCgRZIG2Jr914AGyQsux2Vc24zlSgGqttQVWSgnbCxtoMJ2jcUWhQkAUppc+CuUGmsFkQLmANJgoFAxkgYlAQUAIjBcKBprpFu0y4XezH/NBSUB/3vYr0bMCrez0gNUMdWeatiBArbQrnRKBUEctwgzwKRDvpgxHVpsPIPQ58GRSk4QPIEln7sdcnFRWbT8u7GQY4NkfQB7Ry5qlKNS+QHeXjNmGRv+XkpGL9oD6RpdJMrF/288ylZ0hzd57ng6aKW2jQITRspm8b/xg7X/tX/xbKTWyGkEZ8qj5atx4BIfKPwKFwlx3DAXSFJ2rO1Iq08SowW61KHqfGUs1XCXjnbfNnw1W8bRkJnyHECfI2XDJEGeWsyd5ZmY0dNgEnAAAAABJRU5ErkJggg==") 18 18, auto';
        }else if (tool === "CONTOUR") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAA/klEQVRYR+XX7Q6FIAgG4Lz/i/bMlo2ZIB++zO30t1xPgEjlOuwqh3mu/wPVWuuYhVIKGwhohBpm9u5m5FAwEIfp0eJQENAM0zNHIzZDbQdxmJ4ieh8O0tRMGkiqGbrRUlK2KmCu+UJSthPT4KGi3o0JgRAYNwiFcYGQGDMIjTGBMjBqUBbGBLof5seYT++TRgxpSjX1oT5srWBejCpCBPHiJVgEswSNJ3MPNR0laCqjGBOI5p0MW3fUZlH0/s2INbTaXSPMi6DrwiDpD8IDdIN21MsM7AKhMK6iRmLMIDTGBMrAqEFZGBXo6cSmM8+z3d9TILIYsTbty7X440A/uhPvJTjQhwcAAAAASUVORK5CYII=") 8 33, auto';
        }else if (tool === "BORDER") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAk0lEQVRYR+2YwQ6AIAxD2f9/9AgHDyixrs5kxHotHeVtB9Basc+K5WkKhDpyIeTujkyZuplNGZaBTmsy959qjbPvHeir7h0dCBNaGd72b8yoAt1RFCE0YyIkQogA0jVDIoQIIF0zJEKIANI1Q/8jhE7M6PSdmtks4gm/OiLFmbWPAzHFWQ98ubKFs3z6HYNIliPUAQ/FUDSiymd+AAAAAElFTkSuQmCC") 18 18, auto';
        }else if (tool === "SET PENCIL MIRROR") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABR0lEQVRYR+3X3Q6CMAwF4DUY3v91NeIxEGYGbv1jXbzQW2R8nI5uo/RjP/J4AEBzHxGZxzffsGK0z1ndVpQJZMHkBK0oNeiMkapWpmhBqUA1jFCKGcDdgxJBDkyulgvFgi5g3KgmqAPGhVKBLJOy0Z8O5ePG6wGaADylflMmHgnKmAeAmUONAGXMViWprNEgFrM/fEopvYqO/VlyepdMg8mJfVBhCXEDV67Fg/b5sm0/yknMYfI9eSnpXbKvViNhhoI0mGGgCuaWUlpq3TpsUjOfcRMTnpC2TGVSoQntgy8AJiJikxnRGPNSsXZeFSa8ZJoj0Pk/oSX7g84112wvuNQs2+HoTf666h9OutK+KfIYZMZsC7Zmglrf8krJVaDWA7iX8Zxa1QnVuq0mWc/HoE7Ig5ImcO2lzKByxyilJJ3VuoEkyJXrb6IrI0OmlalfAAAAAElFTkSuQmCC") 18 18, auto';
        }else if (tool === "SELECT COLOR THRESHOLD") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABeklEQVRYR82W2w7DIAxDQfv/P57GREWqNM3FlAh1j2trDokdqOVlv/oynnICtdZah6u13iC9Z3JDqzoXoM7SuThUX0D736qs9T6qc6kG/4gWnIGhbyyd/lxuWG5MbY/sWiSiVYug+DNEJwRCRBAgVAcF+pRSfjOJlBUaQKGO6iHq9Uhd2HctadT2Ed4eFEhHTRmL/6e19rXERhXMKrM2uTp8Q/AcklBejK1ZhMwzeFJzMcMfsJbnxWkRDjNacuijKYqCMQWkwFTtv2jRlAp5C2dCQRVCFkTeQSoHAQ2PHIes5Zcso8NAHpR2bj01+hSQBkXT3LmOqHcs6/1pIAmF+GJmJMCTmh0n5KPTU5lQSzdGyzsr7YNujJ5Bs6HC+xCSlkyoEAg1ZBYUChTe9LLSl35jXK3ULWXCM/BNjydrBSqMPW8F6qeV9kGDkRaQwzEaiI8qFYmuPkehqPqPzrJZyAiKW2ELkOcp6cttQBqUFpKtQEhitwMxKHXtP/Eo9zDGipjdAAAAAElFTkSuQmCC") 7 7, auto';
        }else if (tool === "SELECT PATH") {

            cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAA/klEQVRYR+XX7Q6FIAgG4Lz/i/bMlo2ZIB++zO30t1xPgEjlOuwqh3mu/wPVWuuYhVIKGwhohBpm9u5m5FAwEIfp0eJQENAM0zNHIzZDbQdxmJ4ieh8O0tRMGkiqGbrRUlK2KmCu+UJSthPT4KGi3o0JgRAYNwiFcYGQGDMIjTGBMjBqUBbGBLof5seYT++TRgxpSjX1oT5srWBejCpCBPHiJVgEswSNJ3MPNR0laCqjGBOI5p0MW3fUZlH0/s2INbTaXSPMi6DrwiDpD8IDdIN21MsM7AKhMK6iRmLMIDTGBMrAqEFZGBXo6cSmM8+z3d9TILIYsTbty7X440A/uhPvJTjQhwcAAAAASUVORK5CYII=") 8 33, auto';
        }else if (tool === "SELECT PIXEL") {

            if(select_mode === "ADD" || select_mode === "REPLACE") {

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABBElEQVRYR+3XyxLCIAwF0PL/H43DIk7EvG5KoOPoGuVwk1jarod92sM8lwnqvXcObq2VH8AFkWHYfgbEk/YOVZ7QwPBKe0mXgmYM9aOFeoPmBqYv8x6SJlIrgYbxUB8gdIi8+DOo5SBKmpKzUNKBlpaMb843Q3ppWVNLm1oordxLQNGy0LrQlEkTpJWAr/Uad6wVklKDuJVQBOON+RyEC9IerghmTsm6YaSe3lWYAYVBlRgYVI2BQDswYdAuTAi0E+OCdmNM0AmMCjqFEUEnMbdB3o0x8xL69U8dTagCk06oCpMCVWJgUDVGBWnN6L0GZ5oYuqCt2AD9Dfg+hG6Arv+DvMReyBw3NCzTf+YAAAAASUVORK5CYII=") 5 32, auto';
            }else if(select_mode === "REMOVE"){

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAA9klEQVRYR+3XQRKDMAgFUHP/Q6eTBR2MgQ8I0YXdmpHnh2jajpf92ss8xwdCHdmSUO+9E6S1ptYsBw0MNwybhioFzRhKSUP9QTxW1Gd+XXpaCYNQJxBo78WJ4o+g0kGUNCWnoVYPlNoyXpwX88xS2lCvimooqd0pIGtbaJ1pl3l2Fl+LBnesXSQlBnErIQsGbfM5iDDIg5lT0roRAlVhBtQNqsS4QdUYF2gHxgzahTGBdmIgaDdGBT2BEUFPYZagJzG3QejEGPlgX97U1oQqMOGEqjAhUCXGDarGiCBpGNHf4MgQpx3QMoqv7uE+D1VB6L4fCCX8A+VV8SWc4ctzAAAAAElFTkSuQmCC") 5 32, auto';
            }else if(select_mode === "REPLACE") {

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABNUlEQVRYR+3X4Q6EIAgAYLn3f+a42aIZgYCFddv165aXfiKYQXnZBS/zlN8AISICwKeUgiyCgIgLAKRN5NTxhimIWBiKMNTmRtU+aWLWZA6dEoYeblAVUSOzB2xrM1FKn+pzvGGPQouqvwWMtKSHFeYYNlERJd08odpRhKUUC1XDWCgtdCLKi2kGrcWh7izSst8OogSm5O1FygsaXrJ28HawSC7dltTSoD2UVqW3lL13Wdge56uy6MZoVVPNaCFS7n1orQjvq8ODscqcl6C502o1G8HwKPVOGEOgLMz6RoiehzIxYVA2JgSagXGDZmFcoJkYEzQb0wU9gVFBT2FE0JOYyyDvQT+y+aqfQVYnGZjhCGVhhkCZmDAoG6OCtPyxPoOtvPO0h48fnk6v/OcPsqL3ugh9ATjCXTQqEhJmAAAAAElFTkSuQmCC") 18 18, auto';
            }
        }else if (tool === "SELECT PIXEL PERFECT") {

            if(select_mode === "ADD") {

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABFUlEQVRYR+3XWQ7DIAwE0HD/QxNRycil3oZigqrmm4jHmLVch33lMM9lgmqtlYNLKekDcEFkaLafAfGkvUGlJ9QwvNJe0qmgEUPz0UJ10DiB6Wc+h6QVqZVAw3ioNxC6iLz4Z1DLQZQ0JWehpAEtLRnvnHeGzKVlk1rq1EJp5V4CipaF2oVWmbSCtBLwtkYyvZmQlBrEVwlZZUI3xL7NWKe9dbgimNaHt0WEQBo2C9P6g68TmRgYlI2BQDswYdAuTAi0E+OCdmNM0BMYFfQURgQ9iQmBaMv3rherHpwfO7V0wu/CuAnRw3W8a0cPypnUzISUO1LqCxYCZSajXj+099mrvug7aaJm8PVjog/olz/Ii+u4hG5e9580PRb9NQAAAABJRU5ErkJggg==") 5 32, auto';
            }else if(select_mode === "REMOVE"){

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABBklEQVRYR+3Xyw6EMAgFUPn/j+6kCwwqj14t1Emc7TRyvFSqtL3sRy/zbB8o6khJQq21xhAicmumgzpGGrrNQ6WCzhhOyUPtIBlr1Gf5v3W3FiZCHUBBey/OKP47qOkgTpqT81DaDU1tmSwuiyF7adqm1op6KKvdU0CjbeF1Q08Z8mTJtU4y+zIlKTOIRwl5bUIH4j7JE5KhaD95NW8lhCTTi0fz6jBo0YQyMd0CJZSNgUAVmGFQFWYIVIkJQdUYF7QCY4JWYVTQSswQiKfsk+MAGb6Xwai9ZFVhwoT4c+r8ro2cTUg6IUi7WCYGBmVjTJAVc/QZjLZHWw+d9jMKRtf4QH+X0A98MFk0IsucOwAAAABJRU5ErkJggg==") 5 32, auto';
            }else if(select_mode === "REPLACE"){

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABUklEQVRYR9WX7RKEIAhFZd//mZcdG2mIQMDS2v3VbAbHi3wI5WU/eBlP+Q8gREQA+JRSUCgIiPgFgGkbORluMAURi4AiGHoXhqo2aWPeZg5GCYY+ZlAVoiqzC9beuVCGTfM7+WJXgUPVZwVGC+khwhJGbFSF0v48QXEvSijVRLVgPChLOhUqCsOc1uQwK4sW9tuB6ADT4e0pFQUaDhl3zp1lztJth1pz2oOysvSWtI+GRdS4WJZlC2NHGbVmtfXhOrQZibaOXpiyBXGv5KPdPgPTNlmLq1vZ3QUa8CyYrSNkFZoJkwaaDZMCWgETBloFEwJaCeMCrYbpAj0BYwI9BaMCPQkTAqIxwRsvsgXWWm9eg3j/WQXjKkTXKdkTo1egEdW6ChmNNdS1R2BchaTRmcqY8xC/9kqgyDwzqszlAe2q43CWzXIUtZse0KKGR9e9DugHz47FNAGTbH0AAAAASUVORK5CYII=") 5 32, auto';
            }
        }else if(tool.includes("SELECT")) {

            if(select_mode === "ADD") {

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAkElEQVRYR+2XQQqAMAwEm/8/OpKDUApmUwoScbwmpdNpXNRGs8ea8QyA1I1g6H+G3N3nU5vZ0RgcLQ6QALoZgg2gdSgxpF5TDGEoM7CG3lPvnEPKaNSzrEqDcR7YykaVHhWe3wOqnPq1K6vAkEPKEoYwpAyoOjNUMdTqI18B79aP/zp2N1T9AGFIGVD1djN0AfXGlCWHImsNAAAAAElFTkSuQmCC") 18 18, auto';
            }else if(select_mode === "REMOVE") {

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAb0lEQVRYR+2UQQrAIBDEdv7/6C0+oAYWClriNbiOcTB12MphecpA9CIa0hAZIG6HNEQGiNshDZEB4tsOdXfTgAlP8nouBtrsnWSpdcd/BRppgE1jQ1+EoZl+jBoiA8TtkIbIAHE7pCEyQNwOXWfoAYpLFiWYvOCxAAAAAElFTkSuQmCC") 18 18, auto';
            }else if(select_mode === "REPLACE") {

                cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABCElEQVRYR+2X3Q6DMAiFwb3/I8+zYFbj5ixwmixsqTdeWNqPw09RpdijxXhkAnkRmQr9p0IAoKo3EVk9Dy++LwDuquqmiLvgCbMCWEgoBbCq2sv86kN1gRqMiCzmOQBJQjVlmnDNsctzPYWad3skElCUrQdkIMzGjM3mdAQoC0XDZICiUEMwWSAPymrAqonJt90mGrJje3mvnK36NtpBGEahBnYKzZE4UYmnPsoo1IUagRlR6GM+kc3zRSVWoVIhK5XUvT7z9bKPNL3Imu4EE82hzEGZtVTZMwcwNqHLld6YnBL6t33FAc3uKZs7a4ywLeNKDfnkXwZtFi17+oCs4QTyFJsK/ZxCD73aLDSws54nAAAAAElFTkSuQmCC") 18 18, auto';
            }
        }

        return cursor;
    };

    _set_moves = (new_scale_move_x, new_scale_move_y, new_scale_move_timestamp = Date.now()) => {

        const {
            scale_move_x,
            scale_move_y,
            _scale_move_timestamp,
            scale
        } = this.state;

        const time_difference_moves = new_scale_move_timestamp - _scale_move_timestamp;
        const x_diff = scale_move_x - new_scale_move_x;
        const y_diff = scale_move_y - new_scale_move_y;
        const space_difference_moves = Math.sqrt((x_diff * x_diff) + (y_diff * y_diff)) / scale;
        const moves_speed = Math.min(Math.round((space_difference_moves / time_difference_moves) * 180), 240);

        let { _moves_speeds } = this.state;
        _moves_speeds.push(moves_speed);

        if(_moves_speeds.length >= 15) {

            _moves_speeds.shift();
        }

        const _moves_speed_average =  [..._moves_speeds].slice(-15).reduce((p,c,i,a) => p+(c/a.length), 0);

        this.setState({
            scale_move_x: new_scale_move_x,
            scale_move_y: new_scale_move_y,
            _scale_move_timestamp: new_scale_move_timestamp,
            _moves_speeds: [..._moves_speeds],
            _moves_speed_average: Math.max(1, Math.round(Math.ceil(_moves_speed_average / 10) / 4)),
        }, () => {

            this._request_force_update();
        });
    };

    _request_force_update = (callback_function = () => {}) => {

        window.animLoop(() => {

            this.forceUpdate(() => {
                callback_function();
                window.caf_id = null;
            });
        });
    }

    set_move_speed_average_now = () => {

        const { _moves_speed_average, _scale_move_timestamp } = this.state;
        const _moves_speed_average_now = Math.max(Math.round(_moves_speed_average - (120 + (Date.now() - _scale_move_timestamp)) / 120), 1) || 1;

        this.setState({_moves_speed_average_now}, () => {

            this._request_force_update();
        });
    }

    _update_canvas_container_size = () => {

        const { _canvas_container } = this.state;
        if(!_canvas_container){return;}

        const _canvas_container_width = _canvas_container === null ? 0: _canvas_container.clientWidth || 0;
        const _canvas_container_height = _canvas_container === null ? 0: _canvas_container.clientHeight || 0;
        
        this.setState({_canvas_container_width, _canvas_container_height}, () => {

            this._update_screen_zoom_ratio(true);
        });
    };

    _update_screen_zoom_ratio = (align_center_middle) => {

        const { _canvas_container_width, _canvas_container_height, pxl_width, pxl_height } = this.state;

        const _screen_zoom_ratio = _canvas_container_width > _canvas_container_height ?
            _canvas_container_height / pxl_height:
            _canvas_container_width / pxl_width;

        this.setState({_screen_zoom_ratio}, () => {

            this._request_force_update(() => {

                if(align_center_middle) {

                    this._request_force_update(() => {

                        this._to_canvas_middle();
                    });
                }

            });
        });

    };

    render() {

        const {
            pxl_width,
            pxl_height,
            show_original_image_in_background,
            show_transparent_image_in_background,
            className,
            _base64_original_images,
            _original_image_index,
            scale,
            scale_move_x,
            scale_move_y,
            canvas_wrapper_background_color,
            canvas_border_radius,
            canvas_wrapper_border_radius,
            canvas_wrapper_padding,
            _moves_speed_average_now,
            _is_on_resize_element,
            _is_image_import_mode,
            _mouse_down,
            tool,
            select_mode,
            _screen_zoom_ratio,
            _mouse_inside,
        } = this.state;

        const background_image_style_props = show_original_image_in_background && typeof _base64_original_images[_original_image_index] !== "undefined" ?
            {
                background: `url("${_base64_original_images[_original_image_index]}")`,
                backgroundSize: "100% 100%",
            }:
            show_transparent_image_in_background ?
                {
                    background: `repeating-conic-gradient(rgb(96 96 96 / 12%) 0% 25%, transparent 0% 50%) 50% / calc(200% / ${pxl_width}) calc(200% / ${pxl_height})`,
                }: {};

        const cursor = this._get_cursor(_is_on_resize_element, _is_image_import_mode, _mouse_down, tool, select_mode);
        const shadow = this._get_shadow(_moves_speed_average_now * 4);

        return (
            <div ref={this._set_canvas_container_ref} style={{boxSizing: "border-box", position: "relative", overflow: "hidden"}} className={className}>
                <div ref={this._set_canvas_wrapper_overflow_ref}
                     className={"Canvas-Wrapper-Overflow"}
                     style={{
                         height: "100%",
                         width: "100%",
                         overflow: "overlay",
                         position: "contents",
                         boxSizing: "border-box",
                     }}>
                    <div className={"Canvas-Wrapper " + (_mouse_inside ? " Canvas-Focused ": " " + (tool))}
                         style={{
                             borderWidth: 1,
                             borderStyle: "solid",
                             borderColor: "#fff",
                             backgroundColor: canvas_wrapper_background_color,
                             borderRadius: canvas_wrapper_border_radius,
                             padding: canvas_wrapper_padding * scale,
                             position: "absolute",
                             top: 0,
                             left: 0,
                             width: pxl_width * _screen_zoom_ratio * scale,
                             height: pxl_height * _screen_zoom_ratio * scale,
                             transform: `translate(${scale_move_x}px, ${scale_move_y}px)`,
                             transformOrigin: "center center",
                             boxSizing: "content-box",
                             boxShadow: shadow,
                         }}
                         ref={this._set_canvas_wrapper_ref}>
                        <canvas
                            style={{
                                position: "absolute",
                                cursor: cursor,
                                borderRadius: canvas_border_radius,
                                width: Math.floor(pxl_width),
                                height: Math.floor(pxl_height),
                                transform: `scale(${_screen_zoom_ratio * scale})`,
                                transformOrigin: "left top",
                                boxSizing: "content-box",
                                ...background_image_style_props,
                            }}
                            className={"Canvas-Pixels"}
                            ref={this._set_canvas_ref}
                            width={pxl_width}
                            height={pxl_height}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default CanvasPixels;
