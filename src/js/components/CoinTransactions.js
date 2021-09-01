import React from "react";
import { withStyles } from "@material-ui/core/styles";

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
    noAccountImage: {
        padding: theme.spacing(4),
        width: "100%"
    },
    circularProgressContainer:{
        textAlign: "center",
        padding: theme.spacing(2)
    },
    underCardButtonContainer: {
        marginTop: theme.spacing(1),
        textAlign: "right",
    },
    underCardButton: {
        minWidth: "calc(50% - 8px)",
        [theme.breakpoints.only("xs")]: {
            margin: theme.spacing(0, 1, 0, 0)
        }
    },
});


class CoinTransactions extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coin_id: props.coin_id,
            logged_account: props.logged_account,
            we_know_if_logged: props.we_know_if_logged,
            selected_currency: props.selected_currency,
            selected_locales_code: props.selected_locales_code,
            _transactions: [],
            _loading: true,
            _not_any_transactions_yet: false,
            _is_transaction_dialog_memo_open: false,
            _selected_transaction: null,
            _history: HISTORY
        };
    };

    componentWillReceiveProps(new_props) {

        const { coin_id, logged_account } = this.state;

        if(new_props.logged_account !== null) {

            if (coin_id !== new_props.coin_id || logged_account !== new_props.logged_account) {

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

            const { _transactions } = this.state;
            const new_transactions = result;
            let all_transactions = _transactions.concat(new_transactions);
            const _not_any_transactions_yet = (!new_transactions.length && !_transactions.length);
            
            if((error || !new_transactions.length) && !_not_any_transactions_yet) {

                actions.trigger_snackbar(t( "sentences.cannot load more transaction"))
            }

            this.setState({_loading: false, _transactions: all_transactions, _not_any_transactions_yet});
            actions.trigger_loading_update(100);
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

            actions.trigger_loading_update(0);
            api.get_transactions_by_seed(coin_id, logged_account.seed, _transactions, this._handle_load_more_transactions_result);
        }else {

            actions.trigger_loading_update(100);
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

        const { classes, selected_currency, selected_locales_code, logged_account, we_know_if_logged } = this.state;
        const { _is_transaction_dialog_memo_open, _selected_transaction, _not_any_transactions_yet, _loading } = this.state;
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

                {we_know_if_logged ?
                    <Fade in>
                        <Container maxWidth="sm" className={classes.container}>
                            <Card>
                                <CardHeader
                                    title={t( "words.transactions", {FLC: true})}
                                />
                                <CardContent>
                                    {
                                        logged_account ?
                                            !_loading ?
                                                _not_any_transactions_yet ?
                                                    <div>
                                                        <img className={classes.noTransactionImage} src="/src/images/transfer.svg"/>
                                                        <p>{t("sentences.no transactions maid")}</p>
                                                    </div>:
                                                    <div>
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
                                                    </div>
                                                :
                                                <div>
                                                    <div className={classes.circularProgressContainer}>
                                                        <CircularProgress/>
                                                    </div>
                                                </div>:
                                            <div>
                                                <img className={classes.noAccountImage} src="/src/images/account.svg"/>
                                                <p>{t("sentences.you must open an account")}</p>
                                            </div>
                                    }
                                </CardContent>
                            </Card>
                            <div className={classes.underCardButtonContainer}>
                                {
                                    logged_account ?
                                        <Button className={classes.underCardButton} color="primary" variant="contained" onClick={this._load_more_transactions} disabled={_not_any_transactions_yet}>
                                            {t( "sentences.load more")}
                                        </Button>
                                        :
                                        <Button className={classes.underCardButton} color="primary" variant="contained" onClick={this._open_accounts_page}>
                                            {t( "sentences.open an account")}
                                        </Button>
                                }
                            </div>
                        </Container>
                    </Fade>:
                    null
                }
            </div>
        );
    }
}

export default withStyles(styles)(CoinTransactions);
