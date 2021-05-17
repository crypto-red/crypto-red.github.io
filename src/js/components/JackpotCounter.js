import React from "react";
import raf from "raf";
import ease from "ease-component";
import price_formatter from "../utils/price-formatter";

export default class JackpotCounter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            begin: props.begin,
            end: props.end,
            time: props.time,
            easing: props.easing,
            selected_currency: props.selected_currency,
            selected_locales_code: props.selected_locales_code,
            _value: props.begin,
            _price_formatter: price_formatter
        };
    };

    componentWillReceiveProps(new_props) {

        const { begin, end, time, easing } = new_props;
        const _value = begin;
        const _start = Date.now();
        const _stop = false;

        this.setState({ begin, end, time, easing, _stop});
        raf(this.animate);
    }

    componentDidMount() {

        const _mounted = true;
        const _start = Date.now();

        this.setState({_start, _mounted});
        raf(this.animate);

    }

    shouldComponentUpdate(new_props, new_state, new_context) {

        return Boolean(new_props.begin === this.state.begin);
    }

    animate = () => {
        const { _stop, _mounted } = this.state;
        if (_stop || !_mounted) return;
        raf(this.animate);
        this.draw()

    };

    draw = () => {

        let { _start, _stop, time, begin, end, easing } = this.state;

        const now = Date.now();

        if (now - _start >= time) _stop = true;
        if(_stop) {
            return;
        }

        let val = "";
        let percentage = (now - _start) / time;
        percentage = percentage > 1 ? 1 : percentage;

        if(easing !== "matrix") {

            const easeVal = ease[easing](percentage);
            val = begin + (end - begin) * easeVal;
        }else {

            for(let i = 0; i < end.toString().length; i++) {

                val += Math.floor(Math.random()*(9-0+1)+0).toString();
            }

            if(percentage === 1) {

                val = end;
            }
        }

        this.setState({ _value: val });

    };

    render() {

        const { _value, _price_formatter, selected_locales_code, selected_currency } = this.state;

        return (
            <span>
                {_price_formatter(_value, selected_currency, selected_locales_code)}
            </span>
        );
    }
}