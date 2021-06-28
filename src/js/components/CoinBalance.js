import React from "react";
import { withStyles } from '@material-ui/core/styles'

import { t } from "../utils/t";

import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Skeleton from "@material-ui/lab/Skeleton";

import { HISTORY } from "../utils/constants";
import price_formatter from "../utils/price-formatter";
import api from "../utils/api";
import actions from "../actions/utils";

const styles = theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 0)
        }
    },
    center: {
        textAlign: "center"
    }
});


class CoinBalance extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coin_id: props.coin_id,
            logged_account: props.logged_account,
            selected_locales_code: props.selected_locales_code,
            selected_currency: props.selected_currency,
            coin_data: props.coin_data,
            _coin_balance: null,
            _history: HISTORY
        };
    };

    componentDidMount() {

        this._get_coin_balance();
    }

    componentWillReceiveProps(new_props) {

        const { coin_id, logged_account } = this.state;

        this.setState(new_props, () => {

            if(new_props.logged_account !== null) {

                if (coin_id !== new_props.coin_id || logged_account !== new_props.logged_account) {

                    this._get_coin_balance();
                }
            }
        });
    }

    _handle_get_balance_result = (error, result) => {

        if(!error) {

            this.setState({_coin_balance: result});

            if(result === 0) {

                actions.jamy_update("sad");
            }else {

                actions.jamy_update("happy");
            }
        }else {

            actions.trigger_snackbar(error);
        }
    };


    _get_coin_balance() {

        const { coin_id, logged_account } = this.state;

        if(logged_account) {

            this.setState({_coin_balance: null}, () => {

                api.get_balance_by_seed(coin_id, logged_account.seed, this._handle_get_balance_result);
            });
        }
    }

    _open_link = (event, link) => {

        const { _history } = this.state;
        _history.push(link);
    };

    render() {

        const { classes } = this.state;
        const { _coin_balance, logged_account, selected_locales_code, selected_currency, coin_data } = this.state;

        const balance_fiat = coin_data !== null && _coin_balance !== null ?  _coin_balance * coin_data.market_data.current_price[selected_currency.toLowerCase()]: 0;
        const balance_crypto = coin_data !== null && _coin_balance !== null ? _coin_balance: 0;
        const coin_data_symbol = coin_data !== null ? coin_data.symbol: null;

        return (
            <div>
                <Container maxWidth="sm" className={classes.container}>
                    <Fade in>
                        <Card>
                            <CardHeader
                                title={t( "words.balance", {}, {FLC: true})}
                            />

                            <CardContent>
                                {(logged_account) ?
                                    <div>
                                        {
                                            _coin_balance === null || coin_data === null ?
                                                <div>
                                                    <div className={classes.center}>
                                                        <h2><Skeleton /></h2>
                                                        <h4><Skeleton /></h4>
                                                    </div>
                                                </div> :
                                                <div>
                                                    {_coin_balance === 0 ?
                                                        <div className={classes.center}>
                                                            <h2>{t( "sentences.you need to add fund to this account")}</h2>
                                                            <h4>{t( "sentences.just do it trough the link in the menu")}</h4>
                                                        </div>
                                                        :
                                                        <div className={classes.center}>
                                                            <h2>{price_formatter(parseFloat(balance_fiat), selected_currency, selected_locales_code)}</h2>
                                                            <h4>{price_formatter(parseFloat(balance_crypto), coin_data_symbol, selected_locales_code)}</h4>
                                                        </div>
                                                    }
                                                </div>

                                        }
                                        <Button fullWidth color="primary" variant="contained" onClick={(event) => {this._open_link(event, "/about/wiki/topup")}}>{t( "words.top up")}</Button>
                                    </div>:
                                    <div>
                                        <Button fullWidth color="primary" variant="contained" onClick={(event) => {this._open_link(event, "/accounts")}}>
                                            {t( "sentences.open an account")}
                                        </Button>
                                    </div>
                                }
                            </CardContent>
                        </Card>
                    </Fade>
                </Container>
            </div>
        );
    }
}

export default withStyles(styles)(CoinBalance);
