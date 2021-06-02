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

const styles = theme => ({
    linearProgressVisible: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.primary.light
        },
        opacity: 1,
    },
    linearProgressHidden: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.primary.light
        },
        opacity: 0,
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
    noTransactionImage: {
        padding: theme.spacing(4),
        width: "100%"
    },
    gridItem: {
        padding: theme.spacing(1),
        [theme.breakpoints.down("md")]: {
            padding: theme.spacing(1, 0)
        }
    },
    cardContainer: {
        height: "100%"
    },
    transactionsCardContent: {
        maxHeight: 472,
        overflow: "auto"
    }
});


class DashboardTransactions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            logged_account: props.logged_account,
            _transactions: [],
            _history: HISTORY,
            _coins: COINS,
            _coin_id_loaded: [],
            _is_transaction_dialog_open: false,
            _selected_locales_code: null,
            _selected_currency: null,
            _selected_transaction: null,
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
    };

    _close_transaction_dialog_memo = () => {

        this.setState({_is_transaction_dialog_open: false});
    };

    _handle_get_transactions_by_seed_response = (error, response, coin_id) => {

        if(!error) {

            // Add and sort transactions
            let { _transactions, _coin_id_loaded } = this.state;

            _transactions = _transactions.concat(response);
            _coin_id_loaded = _coin_id_loaded.concat([coin_id]);

            // Why we need to remove duplicate ??? TODO: Find out why and correct it
            function remove_duplicate_object_from_array(array, key) {
                var check = new Set();
                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            }

            _transactions = remove_duplicate_object_from_array(_transactions, "id");


            this.setState({_transactions, _coin_id_loaded});
        }else {

            console.log("Do something with this error");
        }
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

    render() {

        const { classes, logged_account, _selected_locales_code, _selected_currency } = this.state;
        const { _is_transaction_dialog_open, _selected_transaction } = this.state;
        const { _coins, _coin_id_loaded } = this.state;
        const _transactions = this.state._transactions.sort((a, b) => b.timestamp-a.timestamp).slice(0, 20);

        const loaded_percent = Math.floor((_coin_id_loaded.length / _coins.length) * 100);

        return (
            <div>
                <TransactionDialog
                    open={_is_transaction_dialog_open}
                    transaction={_selected_transaction}
                    selected_currency={_selected_currency}
                    selected_locales_code={_selected_locales_code}
                    logged_account={logged_account}
                    onClose={this._close_transaction_dialog_memo}/>

                {
                    _selected_currency && _selected_locales_code ?
                        <div className={classes.cardContainer}>
                            <Fade in>
                                <Card className={classes.numberCard}>
                                    <LinearProgress color="primary" variant="determinate" className={loaded_percent === 100 ? classes.linearProgressHidden: classes.linearProgressVisible} value={loaded_percent}/>
                                    <CardHeader title="Transactions" />
                                    {
                                        loaded_percent === 100 ?
                                            <div>
                                                {_transactions.length ?
                                                    <CardContent className={classes.transactionsCardContent}>
                                                        {_transactions.map((transaction, index, array) => {
                                                            return (
                                                                <Transaction
                                                                    key={transaction.id}
                                                                    logged_account={logged_account}
                                                                    show_crypto_image={true}
                                                                    selected_currency={_selected_currency}
                                                                    selected_locales_code={_selected_locales_code}
                                                                    transaction={transaction}
                                                                    open={this._open_transaction}
                                                                />
                                                            );
                                                        })}
                                                    </CardContent>:
                                                    <CardContent>
                                                        <img className={classes.noTransactionImage}
                                                             src="/src/images/money-transfer-dark.svg"/>
                                                        <p>You've not made any transactions yet, transactions will show up here.</p>
                                                    </CardContent>
                                                }
                                            </div>
                                            : <Skeleton height={475} />
                                    }
                                </Card>
                            </Fade>
                        </div>: null
                }
            </div>
        );
    }
}

export default withStyles(styles)(DashboardTransactions);
