import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";
import Skeleton from "@material-ui/lab/Skeleton";

import ChartDot from "../icons/ChartDot";

import { COINS, HISTORY } from "../utils/constants";
import api from "../utils/api";

import actions from "../actions/utils";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import price_formatter from "../utils/price-formatter";
import LinearProgress from "@material-ui/core/LinearProgress";

const MAX_TRX_LOADING = 20;

const styles = theme => ({
    linearProgressVisible: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.primary.actionLighter
        },
        opacity: 1,
        backgroundColor: "#110b5d26",
    },
    linearProgressHidden: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.primary.actionLighter
        },
        opacity: 0,
        backgroundColor: "#110b5d26",
        animation: "$hide 1.5s",
        "@global": {
            "@keyframes hide": {
                "0%": {
                    opacity: 1,
                },
                "85%": {
                    opacity: 1,
                },
                "100%": {
                    opacity: 0,
                },
            }
        }
    },
    cardContainer: {
        height: "100%"
    },
    performanceCard: {
        height: "100%"
    },
    barChart: {
        width: "100%",
        height: 475
    },
    noTransactionCardContent: {
        textAlign: "center",
    },
    noTransactionImage: {
        maxHeight: 475 - 48,
        height: "100%",
    },
});


class DashboardLineChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            logged_account: props.logged_account,
            coins_markets: props.coins_markets,
            _transactions: [],
            _full_transactions: [],
            _coins: COINS,
            _coins_address: {},
            _coin_id_loaded: [],
            _selected_locales_code: null,
            _selected_currency: null,
            _are_raws_transactions_loaded: false,
        };
    };

    componentDidMount() {

        this._update_settings();
        this._get_transactions_by_seed();
    }

    componentWillReceiveProps(new_props) {

        if(this.state.logged_account !== new_props.logged_account) {

            this.setState(new_props, () => {

                this._get_transactions_by_seed();
            });
        }else {

            this.setState(new_props);
        }
    }


    _open_transaction = (event, transaction) => {

        this.setState({_selected_transaction: transaction, _is_transaction_dialog_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _close_transaction_dialog_memo = () => {

        this.setState({_is_transaction_dialog_open: false});
    };

    _cancel_transaction_dialog_memo = () => {

        this.setState({_is_transaction_dialog_open: false});
        actions.trigger_sfx("state-change_confirm-down");
    };

    _handle_get_transactions_by_seed_response = (error, response, coin_id) => {

        if(!error) {

            // Add and sort transactions
            let { _transactions, _coin_id_loaded, _coins } = this.state;

            _transactions = _transactions.concat(response);
            _coin_id_loaded = _coin_id_loaded.concat([coin_id]);

            // Why we need to remove duplicate ??? TODO: Find out why and correct it
            function remove_duplicate_object_from_array(array, key) {
                let check = new Set();
                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            }

            _transactions = remove_duplicate_object_from_array(_transactions, "id");


            this.setState({_transactions, _coin_id_loaded}, () => {

                if(_coin_id_loaded.length === _coins.length) {

                    this._get_all_full_transactions();
                }
            });
        }else {

            console.log("Do something with this error");
        }
    };

    _handle_set_full_transaction = (error, response) => {

        if(!error) {

            let { _full_transactions, _coins_address } = this.state;

            response.amount_crypto = response.send_to === _coins_address[response.crypto_id] ? response.amount_crypto: -response.amount_crypto;

            _full_transactions.push(response);

            this.setState({_full_transactions});
        }
    };

    _get_all_full_transactions = () => {

        const { _transactions, logged_account, _coins } = this.state;
        let { _coins_address } = this.state;

        _coins.forEach((element) => {

            _coins_address[element.id] = api.get_address_by_seed(element.id, logged_account.seed);
        });

        this.setState({_coins_address, _are_raws_transactions_loaded: true}, () => {

            const transactions = _transactions.sort((a, b) => b.timestamp-a.timestamp).slice(0, MAX_TRX_LOADING);

            transactions.forEach((element, index, array) => {

                if(typeof element.amount_crypto === "undefined") {

                    api.get_transactions_by_id(element.crypto_id, element.id, logged_account.seed, this._handle_set_full_transaction);
                }else {

                    let { _full_transactions } = this.state;
                    element.amount_crypto = element.send_to === _coins_address[element.crypto_id] ? element.amount_crypto: -element.amount_crypto;
                    _full_transactions.push(element);
                    this.setState(_full_transactions);
                }
            });
        });
    };

    _get_transactions_by_seed = () => {

        const { logged_account, _coins } = this.state;

        this.setState({_coin_id_loaded: [], _transactions: [], _are_raws_transactions_loaded: false}, () => {

            _coins.map((coin) => {

                api.get_transactions_by_seed(coin.id, logged_account.seed, [], (error, response) => {this._handle_get_transactions_by_seed_response(error, response, coin.id)});
            });
        });
    };

    _process_settings_query_result = (error, settings) => {

        // Set new settings from query result
        const _selected_locales_code = settings.locales;
        const _selected_currency = settings.currency;

        this.setState({ _selected_locales_code, _selected_currency });
    };

    _update_settings() {

        // Call the api to get results of current settings and send it to a callback function
        api.get_settings(this._process_settings_query_result);
    }

    _price_formatter = (price, compact = false, display_currency = true) => {

        const { selected_locales_code, selected_currency } = this.state;

        if(display_currency !== true && display_currency !== false) {

            return price_formatter(price, display_currency, selected_locales_code, compact);
        }

        return display_currency ?
            price_formatter(price, selected_currency, selected_locales_code, compact):
            price_formatter(price, null, selected_locales_code, compact);
    };

    _date_formatter = (date, precise = false) => {

        const { _selected_locales_code } = this.state;

            return precise ?
                new Intl.DateTimeFormat(_selected_locales_code, {hour: "numeric", day: "numeric", month: "short"}).format(new Date(date)):
                new Intl.DateTimeFormat(_selected_locales_code, {day: "numeric", month: "short"}).format(new Date(date));
    };

    gradient_offset = (data) => {

        const dataMax = Math.max(...data.map((i) => i.value));
        const dataMin = Math.min(...data.map((i) => i.value));

        if (dataMax <= 0){

            return 0
        } else if (dataMin >= 0){

            return 1
        } else {

            return (dataMax / (dataMax - dataMin) * 1);
        }
    };

    _custom_tooltip = ({ active, payload, label }) => {

        if (active && payload && payload.length) {

            return (
                <Card style={{padding: 12}}>
                    <b>{payload[0].payload.name}</b><span> / {this._date_formatter(label, true)}</span><br />
                    <span>{this._price_formatter(payload[0].value)} ({this._price_formatter(payload[0].payload.amount_crypto, false, payload[0].payload.symbol)})</span>
                </Card>
            );
        }

        return null;
    };

    _get_transactions_data = () => {

        const { _coins, _coin_id_loaded, coins_markets, _transactions, _full_transactions, _are_raws_transactions_loaded } = this.state;

        const full_latest_transactions = _full_transactions.sort((a, b) => a.timestamp - b.timestamp).slice(0, MAX_TRX_LOADING);

        let loaded_percent = 0;
        loaded_percent += Math.floor((_coin_id_loaded.length / _coins.length) * 40);
        loaded_percent +=  _are_raws_transactions_loaded && _full_transactions.length === 0?
            40:
            Math.floor((_full_transactions.length / _transactions.slice(0, MAX_TRX_LOADING).length) * 40);
        loaded_percent += coins_markets.length ? 20: 0;

        let transactions_data = [];

        if(loaded_percent !== 100) {

            return {
                data: transactions_data,
                loaded: loaded_percent
            }
        }

        let coins_market_object = {};
        coins_markets.forEach((element, index, array) => {

            coins_market_object[element.id] = element;
        });

        transactions_data = full_latest_transactions.map((element, index, array) => {

            const value = coins_market_object[element.crypto_id].current_price * element.amount_crypto;
            const amount_crypto = element.amount_crypto;
            const name = coins_market_object[element.crypto_id].name;
            const symbol = coins_market_object[element.crypto_id].symbol;
            const timestamp = element.timestamp;

            return { value, amount_crypto, name, symbol, timestamp };
        });

        return {
            data: transactions_data,
            loaded: loaded_percent
        };
    }

    render() {

        const { classes } = this.state;

        const { data, loaded } = this._get_transactions_data();

        return (
            <div className={classes.cardContainer}>
                <Fade in>
                    <Card className={classes.performanceCard}>

                        <CardHeader title={t( "components.dashboard_line_chart.title")} />
                            {
                                loaded === 100 ?
                                    <div>
                                        {data.length ?
                                            <CardContent>
                                                <div className={classes.barChart}>
                                                    <ResponsiveContainer>
                                                        <AreaChart
                                                            data={data}
                                                            width={400}
                                                            height={475}
                                                        >
                                                            <defs>
                                                                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset={() => this.gradient_offset(data)} stopColor="#131162" stopOpacity={.2} />
                                                                    <stop offset={() => this.gradient_offset(data)} stopColor="#131162" stopOpacity={.2} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis domain={['dataMin', 'dataMax']}
                                                                   interval={0}
                                                                   dataKey="timestamp"
                                                                   angle={60} height={75} dy={10} textAnchor="start"
                                                                   tickFormatter={value => this._date_formatter(value)}/>

                                                            <YAxis dataKey="value"
                                                                   type={"number"}
                                                                   tickFormatter={value => this._price_formatter(value, true, true)}/>
                                                            <Tooltip content={data => this._custom_tooltip(data)} />
                                                            <Area type="monotone" stroke="#131162" fill="url(#splitColor)" dataKey="value" strokeLinecap="round" dot={false} strokeWidth={3} activeDot={<ChartDot dotColor={"#131162"}/>}/>
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>:
                                            <CardContent className={classes.noTransactionCardContent}>
                                                <img className={classes.noTransactionImage} src="/src/images/data.svg"/>
                                                <p>{t( "sentences.no transactions maid chart")}</p>
                                            </CardContent>
                                        }
                                    </div>:
                                    <div>
                                        <CardContent>
                                            <Skeleton height={475}/>
                                        </CardContent>
                                    </div>
                            }
                    </Card>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardLineChart);