import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = theme => ({
    button: {
        color: theme.palette.primary.action,
        background: theme.palette.primary.contrastText,
        "&:hover": {
            background: theme.palette.primary.contrastText,
        },
    }
});

class FastNavScroller extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            text: props.text || "SWIPE",
            steps: props.steps || 1.5,
            max_step_size: props.max_step_size || 100000,
            min_step_size: props.min_step_size || 0,
            time_threshold: props.time_threshold || 100,
            steps_threshold: props.steps_threshold || 1,
            wheel_threshold: props.wheel_threshold || 100,
            _step: 0,
            _wheel_sum: 0,
            _x: 0,
            _x_time: 0,
            _button: null,
            _pointer_events: [],
        };
    };

    componentDidMount() {

        window.addEventListener("resize", this._updated_dimensions);
        this._updated_dimensions();
    }

    _updated_dimensions = () => {

        const { _button } = this.state;
        if(_button === null) {return}

        const rect = _button.getBoundingClientRect();

        this.setState({_width: rect.width});
    }

    componentWillUnmount = () => {

        const { _button } = this.state;
        if(_button === null) {return}

        _button.removeEventListener("wheel", this._on_wheel);
        _button.removeEventListener("pointerdown", this._on_pointer_down);
        _button.removeEventListener("pointermove", this._on_pointer_move);
        _button.removeEventListener("pointerup", this._on_pointer_up);
        _button.removeEventListener("pointerout", this._on_pointer_up);
        _button.removeEventListener("pointerleave", this._on_pointer_up);
        _button.removeEventListener("pointercancel", this._on_pointer_up);
        window.removeEventListener("resize", this._updated_dimensions);

    };

    componentWillReceiveProps(new_props) {

        this.setState({...new_props});
    }

    _set_button_ref = (element) => {

        if(element === null) {return}

        element.addEventListener("wheel", this._on_wheel);
        element.addEventListener("pointerdown", this._on_pointer_down);
        element.addEventListener("pointermove", this._on_pointer_move);
        element.addEventListener("pointerup", this._on_pointer_up);
        element.addEventListener("pointerout", this._on_pointer_up);
        element.addEventListener("pointerleave", this._on_pointer_up);
        element.addEventListener("pointercancel", this._on_pointer_up);
        const rect = element.getBoundingClientRect();

        this.setState({_button: element, _width: rect.width});
    };

    _on_wheel = (event) => {

        let {  } = this.state;

        event.preventDefault();
        event.stopPropagation();

        const new_step_more = event.deltaY > 0 ? 1: -1;

        if(this.props.onStepChange) {

            this.props.onStepChange(new_step_more);
        }

    };

    _on_pointer_down = (event) => {

        let { _pointer_events } = this.state;
        _pointer_events.push(event);

        this.setState({
            _pointer_events,
            _x: event.x,
            _step: 0,
        }, ()  => {});
    };

    _on_pointer_move = (event) => {

        const { steps, _width, _step, _step_threshold, min_step_size, max_step_size } = this.state;
        let { _pointer_events, _x } = this.state;

        let initial_event_x = _x;
        let actual_event_x = 0;
        let previous_event_x = 0;

        for (let i = 0; i < _pointer_events.length; i++) {

            if (event.pointerId === _pointer_events[i].pointerId) {
                actual_event_x = event.x;
                previous_event_x = _pointer_events[i].x;
                _pointer_events[i] = event;
                break;
            }

        }

        const move_x = actual_event_x - previous_event_x;
        const one_step_px = Math.min(Math.max(_width / steps, min_step_size), max_step_size);
        const from_start_x_move = actual_event_x - initial_event_x;

        const previous_x_move_step_n = Math.floor((from_start_x_move + move_x) / one_step_px);
        const actual_x_move_step_n = Math.floor(from_start_x_move / one_step_px);

        const new_step_more = actual_x_move_step_n - previous_x_move_step_n;
        const actual_step = _step + new_step_more;

        if(Math.abs(new_step_more) >= 1) {

            console.log("STEP: "+new_step_more);
            if(this.props.onStepChange) {

                this.props.onStepChange(new_step_more);
            }

            this.setState({ _step: actual_step, _pointer_events: [..._pointer_events]});
        }else {

            this.setState({_pointer_events: [..._pointer_events]});
        }
    };

    _on_pointer_up = (event) => {

        let { _pointer_events } = this.state;

        for (let i = 0; i < _pointer_events.length; i++) {
            if (_pointer_events[i].pointerId === event.pointerId) {
                _pointer_events.splice(i, 1);
                break;
            }
        }


        this.setState({
            _pointer_events: [..._pointer_events],
            _x_move: event.x,
            _step: 0,
        }, () => {});
    };

    render() {

        const { classes, text } = this.state;


        return (
            <Button style={{boxSizing: "border-box", touchAction: "none", pointerEvents: "all"}} className={classes.button} fullWidth ref={this._set_button_ref}>
                {text}
            </Button>
        );
    }
}

export default withStyles(styles)(FastNavScroller);
