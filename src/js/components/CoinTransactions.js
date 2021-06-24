import React from "react";
import { withStyles } from "@material-ui/core/styles";

const L = document.documentElement.lang;
import { t } from "../utils/t";

import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import CircularProgress from "@material-ui/core/CircularProgress";

import Transaction from "../components/Transaction";
import TransactionDialog from "../components/TransactionDialog";

import { HISTORY } from "../utils/constants";
import actions from "../actions/utils";
import api from "../utils/api";

const styles = theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 0)
        }
    },
    noTransactionImage: {
        padding: theme.spacing(4),
        width: "100%"
    },
    circularProgressContainer:{
        textAlign: "center",
        padding: theme.spacing(2)
    },
});


class CoinTransactions extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coin_id: props.coin_id,
            logged_account: props.logged_account,
            selected_currency: props.selected_currency,
            selected_locales_code: props.selected_locales_code,
            _transactions: [],
            _loading: true,
            _yet_not_any_transactions: false,
            _is_transaction_dialog_memo_open: false,
            _selected_transaction: null,
            _history: HISTORY
        };
    };

    componentWillReceiveProps(new_props) {

        const { coin_id, logged_account } = this.state;

        if(logged_account !== null) {

            if (coin_id !== new_props.coin_id || logged_account.name !== new_props.logged_account.name) {

                this.setState({...new_props, _loading: true, _transactions: []}, () => {

                    this._load_more_transactions();
                });
            }else {

                this.setState({...new_props});
            }
        }else {

            this.setState({...new_props});
        }

    }

    _handle_load_more_transactions_result = (error, result) => {

        if(!error && result) {

            function remove_duplicate_object_from_array(array, key) {
                let check = new Set();
                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            }

            const { _transactions } = this.state;
            const new_transactions = result;
            let all_transactions = _transactions.concat(new_transactions);
            all_transactions = remove_duplicate_object_from_array(all_transactions, "id");
            const _yet_not_any_transactions = (!new_transactions.length && !_transactions.length);

            if(error || !result.length) {

                actions.trigger_snackbar(t(L, "sentences.cannot load more transaction"))
            }

            this.setState({_loading: false, _transactions: all_transactions, _yet_not_any_transactions});
        }else {

            actions.trigger_snackbar(error);
        }
    }

    componentDidMount() {

        this._load_more_transactions();

    }

    _load_more_transactions = () => {

        const { logged_account, coin_id, _transactions } = this.state;

        if(logged_account) {

            console.log(coin_id);
            api.get_transactions_by_seed(coin_id, logged_account.seed, _transactions, this._handle_load_more_transactions_result);
        }else {

            this.setState({_loading: false});
        }
    };

    _open_transaction = (event, transaction) => {

        this.setState({_selected_transaction: transaction, _is_transaction_dialog_memo_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _close_transaction_dialog_memo = () => {

        this.setState({_is_transaction_dialog_memo_open: false});
    };

    _cancel_transaction_dialog_memo = () => {

        this.setState({_is_transaction_dialog_memo_open: false});
        actions.trigger_sfx("state-change_confirm-down");
    };

    _open_accounts_page = () => {

        const { _history } = this.state;
        _history.push("/accounts");
    };

    render() {

        const { classes, selected_currency, selected_locales_code, logged_account } = this.state;
        const { _is_transaction_dialog_memo_open, _selected_transaction, _yet_not_any_transactions, _loading } = this.state;
        const _transactions = this.state._transactions.slice().sort((a, b) => b.timestamp-a.timestamp);

        return (
            <div>
                <TransactionDialog
                    open={_is_transaction_dialog_memo_open}
                    transaction={_selected_transaction}
                    selected_currency={selected_currency}
                    selected_locales_code={selected_locales_code}
                    logged_account={logged_account}
                    onClose={this._close_transaction_dialog_memo}
                    cancel={this._cancel_transaction_dialog_memo}
                />

                <Container maxWidth="sm" className={classes.container}>
                    <Fade in>
                        <Card>
                            <CardHeader
                                title={t(L, "words.transactions", {}, {FLC: true})}
                            />
                            {
                                !_loading ?
                                    logged_account ?
                                        _yet_not_any_transactions ?
                                            <CardContent>
                                                <img className={classes.noTransactionImage} src="/src/images/transfer.svg"/>
                                                <p>You've not made any transactions yet, transactions will show up here.</p>
                                            </CardContent>:
                                            <CardContent>
                                                <List>
                                                    {_transactions.map((transaction, index,array) => {

                                                        return (
                                                            <Transaction
                                                            key={transaction.id}
                                                            logged_account={logged_account}
                                                            show_crypto_image={false}
                                                            selected_currency={selected_currency}
                                                            selected_locales_code={selected_locales_code}
                                                            transaction={transaction}
                                                            open={this._open_transaction}
                                                            />
                                                        );
                                                    })}
                                                </List>
                                                <Button fullWidth color="primary" variant="contained" onClick={this._load_more_transactions}>
                                                    {t(L, "sentences.load more")}
                                                </Button>
                                            </CardContent>
                                        :
                                        <CardContent>
                                            <Button fullWidth color="primary" variant="contained" onClick={this._open_accounts_page}>
                                                {t(L, "sentences.open an account")}
                                            </Button>
                                        </CardContent>
                                    :
                                    <CardContent>
                                        <div className={classes.circularProgressContainer}>
                                            <CircularProgress/>
                                        </div>
                                    </CardContent>
                            }
                        </Card>
                    </Fade>
                </Container>
            </div>
        );
    }
}

export default withStyles(styles)(CoinTransactions);
