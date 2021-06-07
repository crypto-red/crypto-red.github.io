import React from "react";
import { withStyles } from "@material-ui/core/styles";

import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";
import Skeleton from "@material-ui/lab/Skeleton";

import { COINS, HISTORY } from "../utils/constants";
import api from "../utils/api";

import TransactionDialog from "../components/TransactionDialog";
import Transaction from "./Transaction";
import actions from "../actions/utils";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import price_formatter from "../utils/price-formatter";

const styles = theme => ({
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

        this.setState({_coins_address}, () => {

            const transactions = _transactions.sort((a, b) => b.timestamp-a.timestamp).slice(0, 20);

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

        this.setState({_coin_id_loaded: [], _transactions: []}, () => {

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

        return display_currency ?
            price_formatter(price, selected_currency, selected_locales_code, compact):
            price_formatter(price, null, selected_locales_code, compact);
    };

    _date_formatter = (date, selected_locales_code, precise = false) => {


            return precise ?
                new Intl.DateTimeFormat(selected_locales_code, {hour: "numeric", day: "numeric", month: "short"}).format(new Date(date)):
                new Intl.DateTimeFormat(selected_locales_code, {day: "numeric", month: "short"}).format(new Date(date));
    };

    gradient_offset = (data) => {
        console.log(data);
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

    render() {

        const { classes, logged_account, _selected_locales_code, _selected_currency } = this.state;
        const { _coins, _coin_id_loaded, coins_markets } = this.state;
        const transactions = this.state._transactions.sort((a, b) => b.timestamp-a.timestamp).slice(0, 20);
        const full_transactions = this.state._full_transactions.sort((a, b) => b.timestamp-a.timestamp).slice(0, 20);

        const loaded_percent = Math.floor((full_transactions.length / transactions.length) * 100);
        let transactions_data = [];

        if(loaded_percent === 100 && coins_markets.length) {

            let coins_market_object = {};
            coins_markets.forEach((element, index, array) => {

                coins_market_object[element.id] = element;
            });

            transactions_data = full_transactions.map((element, index, array) => {

                const value = coins_market_object[element.crypto_id].current_price * element.amount_crypto;
                const name = coins_market_object[element.crypto_id].name;
                const timestamp = element.timestamp;

                return {
                    value,
                    name,
                    timestamp
                };
            });

        }

        return (
            <div className={classes.cardContainer}>
                <Fade in>
                    <Card className={classes.performanceCard}>
                        <CardHeader title="Cashflow" />
                        <CardContent>
                            {
                                transactions_data.length ?
                                    <Fade in>
                                        <div className={classes.barChart}>
                                            <ResponsiveContainer>
                                                <AreaChart
                                                    data={transactions_data}
                                                    width={400}
                                                    height={475}
                                                >
                                                    <defs>
                                                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset={() => this.gradient_offset(transactions_data)} stopColor="#131162" stopOpacity={.1} />
                                                            <stop offset={() => this.gradient_offset(transactions_data)} stopColor="#131162" stopOpacity={.1} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="timestamp"
                                                           angle={60} height={75} dy={10} textAnchor="start"
                                                           tickFormatter={value => this._date_formatter(value, _selected_locales_code)}/>

                                                    <YAxis dataKey="value"
                                                           type={"number"}
                                                           tickFormatter={value => this._price_formatter(value, true, false)}/>
                                                    <Tooltip formatter={value => this._price_formatter(value)}
                                                             labelFormatter={value => this._date_formatter(value, _selected_locales_code, true)}/>
                                                    <Area type="monotone" stroke="#131162" fill="url(#splitColor)" dataKey="value" strokeLinecap="round" dot={false} strokeWidth={3} activeDot={{ strokeWidth: 0, r: 6 }}/>
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Fade>:
                                    <Fade in timeout={300}>
                                        <Skeleton height={475}/>
                                    </Fade>
                            }
                        </CardContent>
                    </Card>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardLineChart);
