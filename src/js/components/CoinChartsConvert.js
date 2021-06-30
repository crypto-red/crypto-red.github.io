import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button"

import { get_date_format } from "../utils/time";
import { LOCALE_MAP } from "../utils/constants";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import api from "../utils/api";

const styles = theme => ({
    buyButton: {
        display: "block",
        marginTop: theme.spacing(1)
    },
    fullHeight: {
        height: "100%"
    },
    convertInput: {
        marginRight: theme.spacing(2)
    },
    noTopMargin: {
        marginTop: 0
    },
});


class CoinChartsConvert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coin_id: props.coin_id,
            selected_locales_code: props.selected_locales_code,
            selected_currency: props.selected_currency,
            coin_data: props.coin_data,
            _selected_date: new Date(),
            _cryptocurrency_input_value: 1,
            _selected_cryptocurrency_price: 0,
            _fiat_input_value: 0
        };
    };

    componentDidMount() {

        this._set_price_search_trough_date();
    }

    componentWillReceiveProps(new_props) {

        this.setState({...new_props}, this._set_price_search_trough_date());
    }

    _set_price_search_trough_date = () => {

        const { coin_id, selected_currency } = this.state;
        api.get_coin_chart_data(coin_id, selected_currency.toLowerCase(), "max", this._handle_set_price_search_trough_date_result);
    };

    _handle_set_price_search_trough_date_result = (error, results) => {

        const { _selected_date } = this.state;
        let _selected_cryptocurrency_price = 0;

        if(!error && results !== null) {

            for (let i = 0; i < results.prices.length; i++) {

                const result = results.prices[i];

                if(Math.floor(new Date(result.date) / 86400000 ) == Math.floor(new Date(_selected_date) / 86400000)) {

                    _selected_cryptocurrency_price = result.value;
                    break;
                }
            }

            this.setState({_selected_cryptocurrency_price}, () => {this._handle_cryptocurrency_input_value_change(null)});
        }
    };

    _handle_cryptocurrency_input_value_change = (event) => {

        const { _selected_cryptocurrency_price } = this.state;
        let { _cryptocurrency_input_value } = this.state;

        _cryptocurrency_input_value = event == null ? _cryptocurrency_input_value: parseFloat(event.target.value);
        const _fiat_input_value = _cryptocurrency_input_value * _selected_cryptocurrency_price;
        this.setState({_cryptocurrency_input_value, _fiat_input_value});
    };

    _handle_fiat_input_value_change = (event) => {

        const { _selected_cryptocurrency_price } = this.state;
        let { _fiat_input_value } = this.state;

        _fiat_input_value = event == null ? _fiat_input_value: parseFloat(event.target.value);
        const _cryptocurrency_input_value = _fiat_input_value / _selected_cryptocurrency_price;
        this.setState({_cryptocurrency_input_value, _fiat_input_value});
    };

    _handle_selected_date_change = (date) => {

        this.setState({_selected_date: date}, this._set_price_search_trough_date());
    };

    _get_date_format = () => {

        const { selected_locales_code } = this.state;
        return get_date_format(selected_locales_code);
    };

    _open_buy = () => {

        window.open("https://changelly.com/");
    }

    render() {

        const { classes, selected_currency, _selected_date, coin_data, coin_id } = this.state;
        const { _cryptocurrency_input_value, _fiat_input_value } = this.state;

        const date_format = this._get_date_format();

        const market_convert_card = coin_data !== null ?
            <Fade in={true}>
                <Card>
                    <CardHeader title={t( "components.coin_charts_convert.title")} />
                    <CardContent>
                        <TextField className={classes.convertInput}
                                   id="cryptocurrency-input"
                                   type="number"
                                   label={coin_data.symbol.toUpperCase()}
                                   value={_cryptocurrency_input_value}
                                   onChange={this._handle_cryptocurrency_input_value_change}
                        />
                        <TextField
                            className={classes.convertInput}
                            id="fiat-input"
                            type="number"
                            label={selected_currency}
                            value={_fiat_input_value}
                            onChange={this._handle_fiat_input_value_change}
                        />
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={LOCALE_MAP[document.documentElement.lang]}>
                            <KeyboardDatePicker
                                cancelLabel={t("words.cancel")}
                                okLabel={t("words.ok")}
                                invalidDateMessage={t("sentences.invalid date message")}
                                className={classes.noTopMargin}
                                margin="normal"
                                id="date-picker-dialog"
                                label={t( "sentences.pick a date")}
                                format={date_format}
                                value={_selected_date}
                                onChange={this._handle_selected_date_change}
                            />
                        </MuiPickersUtilsProvider>
                        <Button className={classes.buyButton}
                                onClick={(event) => {this._open_buy()}}
                                fullWidth
                                variant="contained"
                                color="primary">
                            {t( "components.coin_charts_convert.buy_x", {coin_name: coin_data.name})}
                        </Button>
                    </CardContent>
                </Card>
            </Fade>: null;

        return (
            <div className={classes.fullHeight}>{market_convert_card}</div>
        );
    }
}

export default withStyles(styles)(CoinChartsConvert);
