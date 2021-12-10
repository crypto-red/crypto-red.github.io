import React from "react";
import { withStyles } from "@material-ui/core/styles"

import price_formatter from "../utils/price-formatter";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

const styles = theme => ({
});


let raf =
    window.requestAnimationFrame       ||
    window.oRequestAnimationFrame      ||
    window.mozRequestAnimationFrame    ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

let caf =
    window.cancelAnimationFrame       ||
    window.oCancelAnimationFrame      ||
    window.mozCancelAnimationFrame    ||
    window.webkitCancelAnimationFrame ||
    window.msCancelAnimationFrame;

let caf_id = null;
let last_raf_time = Date.now();
let previous_cpaf_fps = 0;
let cpaf_frames = 0;

window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

let is_mobile_or_tablet = window.mobileAndTabletCheck();


setInterval(function(){

    previous_cpaf_fps = cpaf_frames * 4;
    cpaf_frames = 0;

}, 250);

const loop = (render, do_not_cancel_animation, force_update) => {

    try {

        let skip_frame_rate = 40;

        let now = Date.now();
        let running_smoothly = true;

        let deltaT = now - last_raf_time;
        // do not render frame when deltaT is too high
        if ( deltaT > 1000 / (skip_frame_rate * 2/3)) {
            running_smoothly = false;
        }

        if(force_update) {

            caf(caf_id);
            caf_id = null;

            if(do_not_cancel_animation) {

                raf(render);
            }else {

                caf_id = raf(render);
            }

            cpaf_frames++;
            last_raf_time = now;

        }else if ( caf_id === null) { // Best

            if(do_not_cancel_animation) {

                raf(render);
            }else {

                caf_id = raf(render);
            }
            last_raf_time = now;
            cpaf_frames++;

        }else if(!running_smoothly && caf_id !== null && deltaT > 1000 / (skip_frame_rate * 6/3) ) { // Average

            caf(caf_id);
            caf_id = null;
            last_raf_time = now;

            if(!do_not_cancel_animation) {

                caf_id = raf(render);
                cpaf_frames++;

            }else {

                raf(render);
            }

        }else if(!running_smoothly){ // Low

            caf(caf_id);
            caf_id = null;

            if(do_not_cancel_animation) {

                raf(render);
            }else {

                caf_id = raf(render);
            }

            cpaf_frames++;
            last_raf_time = now;

        }else if(deltaT < 1000 / (skip_frame_rate * 2)){

            setTimeout(() => {loop(render, do_not_cancel_animation, force_update)}, 1000 / (skip_frame_rate * 8));
        }else if(force_update || do_not_cancel_animation) {

            setTimeout(() => {loop(render, do_not_cancel_animation, force_update)}, 1000 / (skip_frame_rate * 8));
        }else {

            caf(caf_id);
        }
    }catch(e){
        console.log(e)
    }
}

const anim_loop = ( render, do_not_cancel_animation = false, force_update = false ) => {

    loop(render, do_not_cancel_animation, force_update);
};


class PixelDialogPostBelowContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            classname: props.classname,
            post: props.post,
            balance_fiat: props.balance_fiat,
            selected_locales_code: props.selected_locales_code || "en-US",
            hbd_market: props.hbd_market || {},
            selected_currency: props.selected_currency || "USD",
            layers: props.layers,
            sc_svg: props.sc_svg,
            ss_svg: props.ss_svg,
            st_svg: props.st_svg,
            sg_svg: props.sg_svg,
            g_svg: props.g_svg,
            h_svg: props.h_svg,
            window_width: props.window_width,
            is_prediction_loading: props.is_prediction_loading,
            tags_input: props.tags_input,
            translated_description: props.translated_description,
            translated_title: props.translated_title,
            has_translation_started: props.has_translation_started,
            color_box_shadows: props.color_box_shadows,
            px: props.px,
            py: props.py,
            pz: props.pz,
            color: props.color,
        };
    };

    componentWillReceiveProps(new_props) {

        let image_changed = this.state.layers !== new_props.layers;
        let perspective_changed =
            this.state.px !== new_props.px ||
            this.state.py !== new_props.py ||
            this.state.pz !== new_props.pz;


        this.setState(new_props, () => {

            if(image_changed) {

                this._request_force_update();
            }else if(perspective_changed) {

                this._request_force_update(true, true);
            }
        });
    }

    shouldComponentUpdate() {
        return false;
    }

    _request_force_update = (can_be_cancelable = false, especially_dont_force = false) => {


        anim_loop(() => {

            this.forceUpdate();
        }, !can_be_cancelable, !especially_dont_force);
    }

    render() {

        const {
            classname,
            tags_input,
            is_prediction_loading,
            translated_description,
            has_translation_started,
            translated_title,
            window_width,
            layers,
            balance_fiat,
            selected_locales_code,
            selected_currency,
            px,
            py,
            pz,
            color,
            sc_svg,
            ss_svg,
            sg_svg,
            st_svg,
            g_svg,
            h_svg,
            color_box_shadows,
        } = this.state;

        const post = this.state.post || {};
        const layer = layers[0] || {colors: []};

        const vote_number = post.active_votes ? post.active_votes.length: 0;
        const tags = post.tags ? post.tags: tags_input ? tags_input: [];

        const has_translated = translated_title.length && translated_description.length;
        const is_translating = has_translation_started && !has_translated;

        return (
            <div className={classname} style={{
                pointerEvents: "none",
                textRendering: "optimizespeed",
                imageRendering: "optimizespeed",
                touchAction: "none",
                contain: "size style",
                visibility: h_svg ? "inherit": "hidden",
                willChange: "background-position",
                transition: "background-position .25s ease-in 0s",
                backgroundImage: `url("${h_svg}")`,
                backgroundRepeat: "repeat",
                backgroundSize: `${Math.ceil(.5*200)}px ${Math.ceil(.5*229.3)}px`,
                backgroundPosition: `${Math.round((px*5-200)*pz)}px ${Math.round((py*5-229.3)*pz)}px`,
                color: "black",
                backgroundOrigin: "center"}}>
                <div style={{position: "relative", height: "100%"}}>
                    <div style={{transition: "background-image .25s linear 0s", position: "relative", height: "100%", mixBlendMode: "multiply", backgroundBlendMode: "color-burn", ...color_box_shadows}}>
                        <div style={{zIndex: is_mobile_or_tablet ? 1: 14, position: "absolute", color: color, width: "100%", height: "100%", top: 0, left: 0, fontSize: 12, backgroundPosition: "center", backgroundSize: 750, textAlign: "left", padding: 24, backgroundImage: `url("${g_svg}")`}}>
                            <p>$_AUTHOR: @{post.author}</p>
                            <p>$_VALUE: {price_formatter(balance_fiat, selected_currency, selected_locales_code)}</p>
                            <p>$_VOTES: {vote_number}</p>
                            <p>$_COLORS: {layer.colors.length}</p>
                            <p>$_TAGS: #{tags.join(", #").toUpperCase()}</p>
                            <p>$_V_PER_COL: {price_formatter(balance_fiat / layer.colors.length, selected_currency, selected_locales_code)}</p>
                            <p>$_HAS_TRANSLATED_[{document.documentElement.lang.toUpperCase()}]: {has_translated ? "TRUE": "FALSE"}</p>
                            <p>$_IS_TRANSLATING_[{document.documentElement.lang.toUpperCase()}]: {is_translating ? "TRUE": "FALSE"}</p>
                            <p>$_WIN_WIDTH: {window_width}px</p>
                            <p>$_AI_COMPUTING: {is_prediction_loading ? "TRUE": "FALSE"}</p>
                        </div>
                        <div style={{willChange: "contents"}}>
                            <img src={sc_svg} style={{transition: "transform .25s ease-in 0s", filter: "opacity(0.5)",  zIndex: is_mobile_or_tablet ? 1: 14, position: "absolute", bottom: "50%", right: "50%", width: "100%", height: "100%", transform: `translate(calc(50% + ${(px*20-100)*pz}px), calc(50% + ${(py*20-100)*pz}px))`}}/>
                            <img src={ss_svg} style={{transition: "transform .25s ease-in 0s", zIndex: is_mobile_or_tablet ? 1: 14, position: "absolute", bottom: 64, left: 64, width: 32, height: 168, transform: `translate(${(px*5-25)*pz}px, ${(py*5-20)*pz}px)`}}/>
                            <img src={sg_svg} style={{transition: "transform .25s ease-in 0s", position: "absolute", top: 372, right: 372, width: 372, height: 372, transformOrigin: "top right", transform: `translate(${(px*10-50)*pz}px, ${(py*10-50)*pz}px)`}}/>
                            <img src={st_svg} style={{transition: "transform .25s ease-in 0s", position: "absolute", bottom: 256, right: 256, width: 336, height: 336, transformOrigin: "middle center", transform: `translate(${(px*15-75)*pz}px, ${(py*15-75)*pz}px)`}}/>
                        </div>
                        <span style={{filter: "opacity(0.3)", textShadow: `rgb(0 70 255 / 100%) 1.08243px 0px 1px, rgb(255 50 0 / 100%) -1.08243px 0px 1px, 0px 0px 4px`, position: "absolute", bottom: "30%", right: 32, width: "66%", color: "#ffffff", fontFamily: `"Special Elite"`}}>Paramilitary operations – “PM ops” in American spytalk – may be defined as secret war-like activities. They are a part of a broader set ofendeavors undertaken by intelligence agencies to manipulate events abroad, when so ordered by authorities in the executive branch. These activities are known collectively as “covert action” (CA) or, alternatively, “special activities,” “the quiet option,” or “the third option” (between diplomacy and overt military intervention). In addition to PM ops, CA includes secret political and economic operations, as well as the use of propaganda.</span>
                    </div>
                    <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "inline-grid"}}>
                        <span>$_ARTISTIC_SITUATION_TYPE: PIXEL ART</span>
                        {
                            vote_number > 0 &&
                            <span>
                                {post.active_votes.slice(0, 25).map((v, index) => {

                                    return <span key={index}>@{v.voter} () -> {v.percent}%<br/></span>;
                                })}
                            </span>
                        }
                        <span>$NFT_TESTS: For chimpanzee and punks they show current attention.<br/>[SUGG.]: prepare moving to humanoid trials to speed up artistic process. <br />Please remain CALM... Outer dark project [NAMEC.] Black.Ops. (Decentralize Everything)</span>
                        <span style={{position: "absolute", top: "15%", right: "15%", transform: "translate(50%, 50%) scale(1.75)", textDecoration: "underline"}}>"Para-Military Ops" SYSTEM 49.5% SHUTDOWN - POWER "NOW" IN YOUR VEINS</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(PixelDialogPostBelowContent);
