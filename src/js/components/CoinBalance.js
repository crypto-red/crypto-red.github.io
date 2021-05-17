import React from "react";
import { withStyles } from '@material-ui/core/styles'
import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

import { HISTORY } from "../utils/constants";
import price_formatter from "../utils/price-formatter";
import Button from "@material-ui/core/Button";

import api from "../utils/api";

const styles = theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 0)
        }
    },
    center: {
        textAlign: "center"
    },
    circularProgressContainer:{
        textAlign: "center",
        padding: theme.spacing(2)
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

        this.setState({...new_props}, () => {

            this._get_coin_balance();
        });
    }

    _handle_get_balance_result = (error, result) => {

        if(!error) {

            this.setState({_coin_balance: result});
        }else {

            console.log(error);
        }
    };


    _get_coin_balance() {

        const { coin_id, logged_account } = this.state;

        if(logged_account) {

            api.get_balance_by_seed(coin_id, logged_account.seed, this._handle_get_balance_result);
        }
    }

    _open_accounts_page = () => {

        const { _history } = this.state;
        _history.push("/accounts");
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
                                title="Balance"
                            />

                            <CardContent>
                                {(logged_account) ?
                                    <div>
                                        {
                                            _coin_balance === null || coin_data === null ?
                                                <div>
                                                    <div className={classes.circularProgressContainer}>
                                                        <CircularProgress/>
                                                    </div>
                                                </div> :
                                                <div>
                                                    {_coin_balance === 0 ?
                                                        <div className={classes.center}>
                                                            <h1>You need to add fund to this account.</h1>
                                                        </div>
                                                        :
                                                        <div className={classes.center}>
                                                            <h2>{price_formatter(parseFloat(balance_fiat), selected_currency, selected_locales_code)}</h2>
                                                            <h4>{price_formatter(parseFloat(balance_crypto), coin_data_symbol, selected_locales_code)}</h4>
                                                        </div>
                                                    }
                                                </div>

                                        }
                                        <Button fullWidth color="primary" variant="contained">Top Up</Button>
                                    </div>:
                                    <div>
                                        <Button fullWidth color="primary" variant="contained" onClick={this._open_accounts_page}>
                                            Open an account
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