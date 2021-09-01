import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

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

const styles = theme => ({
    noTransactionCardContent: {
        textAlign: "center",
    },
    noTransactionImage: {
        maxHeight: 475 - 48,
        maxWidth: "100%",
        height: "100%",
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
        maxHeight: 475,
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
            let { _transactions, _coin_id_loaded } = this.state;

            _transactions = _transactions.concat(response);
            _coin_id_loaded = _coin_id_loaded.concat([coin_id]);

            this.setState({_transactions, _coin_id_loaded});
        }
    };

    _get_transactions_by_seed = () => {

        const { logged_account, _coins } = this.state;

        this.setState({_coin_id_loaded: [], _transactions: []}, () => {

            _coins.forEach((coin) => {

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
                    onClose={this._close_transaction_dialog_memo}
                    cancel={this._cancel_transaction_dialog_memo}
                    />

                {
                    _selected_currency && _selected_locales_code ?
                        <div className={classes.cardContainer}>
                            <Fade in>
                                <Card className={classes.numberCard}>

                                    <CardHeader title={t("components.dashboard_transactions.title")} />
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
                                                                    show_crypto_image={false}
                                                                    selected_currency={_selected_currency}
                                                                    selected_locales_code={_selected_locales_code}
                                                                    transaction={transaction}
                                                                    open={this._open_transaction}
                                                                />
                                                            );
                                                        })}
                                                    </CardContent>:
                                                    <CardContent className={classes.noTransactionCardContent}>
                                                        <img className={classes.noTransactionImage}
                                                             src="/src/images/transfer.svg"/>
                                                        <p>{t( "sentences.no transactions maid")}</p>
                                                    </CardContent>
                                                }
                                            </div>:
                                            <div>
                                                <CardContent>
                                                    <Skeleton height={475} />
                                                </CardContent>
                                            </div>
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
