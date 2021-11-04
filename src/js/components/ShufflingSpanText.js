const SHUFFLING_VALUES = [
    '!', '§', '$', '%',
    '&', '/', '(', ')',
    '=', '?', '_', '<',
    '>', '^', '°', '*',
    '#', '-', ':', ';', '~',
];

let waf_id = null;

function loop_frame(render, initiated) {

    if(waf_id === null) {

        waf_id = window.requestAnimationFrame(render);
    }else if(initiated + 1000 / 20 > Date.now()) { // Before more a 15/s frame is further in time than now -> it took long cancel AF.

        waf_id = null;
        window.cancelAnimationFrame(waf_id);

        if(initiated + 1000 / 15 < Date.now()) { //  Before more a 9/s frame is NOT further in time than now -> it took very long but don't throw it.

            waf_id = window.requestAnimationFrame(render);
        }
    }else { // The request was recent, feedback the request to itself.

        loop_frame(render, initiated);
    }

}

const request_frame = (render) => {

    loop_frame(render, Date.now());
}

import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    
});


class ShufflingSpanText extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            style: props.style,
            pre: props.pre || "",
            text: props.text,
            app: props.app || "",
            animation_delay_ms: props.animation_delay_ms || 500,
            animation_duration_ms: props.animation_duration_ms || 3500,
            animation_fps: props.animation_fps || 25,
            _text_proceed: "",
        };
    };

    shouldComponentUpdate() {

        return false;
    }

    componentDidMount() {
        
        this._run_animation();
    }

    _run_animation = () => {

        const { animation_delay_ms, animation_duration_ms, animation_fps, text } = this.state;

        const delay_timeout = setTimeout(() => {

            const animation_interval = setInterval(() => {

                let _text_proceed = "";

                for (let i = 0; i < text.length; i++) {

                    _text_proceed += SHUFFLING_VALUES[
                        Math.round(Math.random() * (SHUFFLING_VALUES.length-1))
                    ];
                }

                this.setState({_text_proceed}, () => {

                    request_frame(() => {this.forceUpdate()});
                });
            }, 1000 / 60);

            const animation_timeout = setTimeout(() => {

                clearInterval(animation_interval);
                this.setState({_text_proceed: text}, () => {

                    this.forceUpdate();
                });

            }, animation_duration_ms);

        }, animation_delay_ms);
    };

    render() {

        const { classes, style } = this.state;
        const { _text_proceed, pre, app } = this.state;

        return (
            <span style={style}>{pre}{_text_proceed}{app}</span>
        );
    }
}

export default withStyles(styles)(ShufflingSpanText);
