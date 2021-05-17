import React from "react";
import { withStyles } from "@material-ui/core/styles";

import ListItem from '@material-ui/core/ListItem';
import Skeleton from '@material-ui/lab/Skeleton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import TooltipMui from "@material-ui/core/Tooltip";

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import price_formatter from "../utils/price-formatter";
import Jdenticon from 'react-jdenticon';
import TimeAgo from "react-timeago";
import api from "../utils/api";

const styles = theme => ({
    listItem: {
        cursor: "pointer"
    },
    spaceBetween: {
        display: "inline-flex",
        justifyContent: "space-between",
        width: "100%"
    },
    avatar: {
        backgroundColor: "transparent"
    },
    currencyCrypto: {

    },
    timeAgo: {

    },
    currencyCryptoamountPositive: {
        color: green[700],
        "&::before": {
            content: "\"+\""
        }
    },
    currencyCryptoamountNegative: {
        color: red[700],
        "&::before": {
            content: "\"-\""
        }
    },
    currencyFiatamount: {

    }
});


class Transaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            logged_account: props.logged_account,
            show_crypto_image: props.show_crypto_image,
            coin_data: props.coin_data,
            selected_currency: props.selected_currency,
            selected_locales_code: props.selected_locales_code,
            transaction: props.transaction,
            _full_transaction: null,
            _coin_data: null,
            _address: ""
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props, () => {
            this._get_coin_data();
            this._get_address_by_seed()
            this._maybe_update_full_transaction();
        });
    }

    _get_address_by_seed = () => {

        const { logged_account, transaction } = this.state;

        if(logged_account && transaction) {

            const address = api.get_address_by_seed(transaction.crypto_id, logged_account.seed);
            this.setState({_address: address});
        }
    };

    componentDidMount() {

        this._get_coin_data();
        this._get_address_by_seed();
        this._maybe_update_full_transaction();
    }

    _handle_set_full_transaction = (error, response) => {

        if(!error) {

            this.setState({_full_transaction: response});
        }
    };

    _maybe_update_full_transaction = () => {

        const { transaction, logged_account } = this.state;

        if(typeof transaction.amount_crypto === "undefined") {

            api.get_transactions_by_id(transaction.crypto_id, transaction.id, logged_account.seed, this._handle_set_full_transaction)
        }else {

            this.setState({_full_transaction: transaction});
        }
    };

    _get_coin_data() {

        const { transaction } = this.state;
        this.setState({_coin_data: null}, () => {

            api.get_coin_data(transaction.crypto_id, this._set_coin_data);
        });
    }

    _set_coin_data = (error, data) => {

        this.setState({_coin_data: data});
    };

    render() {

        const { classes, show_crypto_image, _address, _coin_data, selected_currency, selected_locales_code, _full_transaction } = this.state;

        let component =
            <ListItem>
                <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                        <Skeleton variant="circle" width={48} height={48}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Skeleton variant="text" />
                    }
                    secondary={
                        <Skeleton variant="text" />
                    } />
            </ListItem>;

        if(Boolean(_coin_data) && Boolean(_full_transaction)) {

            const received = (_address === _full_transaction.send_to);
            const amount_fiat = _full_transaction.amount_crypto * _coin_data.market_data.current_price[selected_currency.toLowerCase()];
            const feedback = (_full_transaction.send_from === _full_transaction.send_to);
            const important_address = received ? _full_transaction.send_from: _full_transaction.send_to;
            const important_address_text = received ? "Send from " + important_address: "Send to " + _full_transaction.send_to;

            component =
                <ListItem onClick={(event) => {this.props.open(event, _full_transaction)}} className={classes.listItem}>
                    <ListItemAvatar>
                        <TooltipMui title={important_address_text} aria-label={important_address_text}>
                            <Avatar className={classes.avatar}>
                                {
                                    show_crypto_image ?
                                        <Avatar alt={_coin_data.name} src={_coin_data.image.small} />:
                                        <Jdenticon size="48" value={important_address} />

                                }
                            </Avatar>
                        </TooltipMui>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <div className={classes.spaceBetween}>
                                <span className={classes.currencyCrypto}>{_coin_data.name}</span>
                                <span className={feedback ? null: received ? classes.currencyCryptoamountPositive: classes.currencyCryptoamountNegative}>
                                {price_formatter(parseFloat(_full_transaction.amount_crypto), _coin_data.symbol, selected_locales_code)}
                            </span>
                            </div>
                        }
                        secondary={
                            <div className={classes.spaceBetween}>
                            <span className={classes.timeAgo}>
                                <TimeAgo date={_full_transaction.timestamp} />
                                {
                                    typeof _full_transaction.confirmations !== "undefined"?
                                        _full_transaction.confirmations <= 6 ?
                                            " (Unconfirmed)"
                                            : null
                                        : null
                                }
                            </span>
                                <span className={classes.currencyFiatamount}>
                                ({price_formatter(amount_fiat, selected_currency, selected_locales_code)})
                            </span>
                            </div>
                        } />
                </ListItem>;
        }

        return (
            <div>
                {component}
            </div>
        );
    }
}

export default withStyles(styles)(Transaction);