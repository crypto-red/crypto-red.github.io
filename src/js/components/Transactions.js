import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Transaction from "../components/Transaction";

const styles = theme => ({

});


class Transactions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            logged_account: props.logged_account,
            transactions: props.transactions,
            selected_locales_code: props.selected_locales_code,
            selected_currency: props.selected_currency,
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }


    _open_transaction = (event, transaction) => {

        this.props.open(event, transaction);
    };


    render() {

        const { classes, logged_account, selected_locales_code, selected_currency, transactions } = this.state;

        return (
            <div>
                {transactions.map((transaction, index, array) => {
                    return (
                        <Transaction
                            key={transaction.id}
                            logged_account={logged_account}
                            show_crypto_image={true}
                            selected_currency={selected_currency}
                            selected_locales_code={selected_locales_code}
                            transaction={transaction}
                            open={this._open_transaction}
                        />
                    );
                })}
            </div>
        );
    }
}

export default withStyles(styles)(Transactions);
