import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Fab from "@material-ui/core/Fab";

import DashboardPieChart from "../components/DashboardPieChart";
import DashboardLineChart from "../components/DashboardLineChart";
import DashboardQuickCardMobile from "../components/DashboardQuickCardMobile";
import DashboardQuickCard from "../components/DashboardQuickCard";
import DashboardTransactions from "../components/DashboardTransactions";
import DashboardAddress from "../components/DashboardAddress";
import FlashInfo from "../components/FlashInfo";

import LockOpenIcon from "@material-ui/icons/LockOpen";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";

import { COINS, HISTORY } from "../utils/constants";
import price_formatter from "../utils/price-formatter";
import actions from "../actions/utils";
import api from "../utils/api";

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
        [theme.breakpoints.between("xs", "sm")]: {
            padding: theme.spacing(1, 0),
            width: "100vw !important"
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: "calc(100vw - 256px)"
        },
    },
    backgroundImage: {
        minHeight: "calc(100vh - 176px)",
        backgroundImage: "url(/src/images/statistics.svg)",
        position: "relative",
        backgroundSize: "contain",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundOrigin: "content-box",
        padding: theme.spacing(4)
    },
    fab: {
        position: "fixed",
        backgroundColor: theme.palette.primary.action,
        color: theme.palette.primary.contrastText,
        "&:hover": {
            backgroundColor: theme.palette.primary.actionLighter,
        },
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        "& svg": {
            marginRight: 4
        }
    },
    flashInfoContainer: {
        padding: theme.spacing(2, 2, 0, 2),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(0)
        },
    },
    gridItem: {
        padding: theme.spacing(1),
        [theme.breakpoints.down("md")]: {
            padding: theme.spacing(1, 0)
        }
    },
    quickDataCardGrid: {
        padding: theme.spacing(1),
        display: "inherit",
        [theme.breakpoints.down("md")]: {
            display: "none"
        }
    },
    quickDataCardGridMobile: {
        display: "none",
        [theme.breakpoints.down("md")]: {
            display: "inherit"
        }
    },
});


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            _coins: COINS,
            _balance: {},
            _loaded: 0,
            _logged_account: null,
            _we_know_if_logged: false,
            _coins_markets: [],
            _coins_id: [],
            _history: HISTORY,
            _pie_chart_active_index: 0,
            _full_balance_length: 5,
            _portfolio: null,
            _selected_locales_code: null,
            _selected_currency: null
        };
    };

    componentDidMount() {

        this.setState({_coins_id: COINS.map(c => c.id)}, () => {

            actions.trigger_loading_update(0);
            this._update_settings();
            this._is_logged();
        });
    }

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    _refresh_balance_result = (error, response, crypto_id) => {

        if(!error) {

            let { _balance, _full_balance_length } = this.state;
            _balance[crypto_id] = response;
            const should_refresh_portfolio = Object.entries(_balance).length >= _full_balance_length;

            this.setState({_balance}, () => {

                if(should_refresh_portfolio) {

                    this._refresh_portfolio_data();
                }

            });
        }else {

            actions.trigger_snackbar(t( "pages.dashboard.crypto_balance_error", {crypto_id}));
        }
    };

    _refresh_balance = () => {

        const { _logged_account, _coins } = this.state;

        if(_logged_account) {

            if(_logged_account.seed) {

                _coins.forEach(coin => {

                    api.get_balance_by_seed(coin.id, _logged_account.seed, (error, result) => {this._refresh_balance_result(error, result, coin.id)});
                });
            }
        }
    };

    _process_is_logged_result = (error, result) => {

        if(!error && result) {

            this.setState({_logged_account: result, _we_know_if_logged: true}, () => {

                this._refresh_balance();
            });
        }else {

            this.setState({_we_know_if_logged: true}, () => {

                actions.trigger_loading_update(100);
            });
        }
    };

    _is_logged = () => {

        api.is_logged(this._process_is_logged_result);
    };

    _process_settings_query_result = (error, settings) => {

        const { _coins_id } = this.state;

        // Set new settings from query result
        const _selected_locales_code = settings.locales;
        const _selected_currency = settings.currency;

        this.setState({ _selected_locales_code, _selected_currency }, () => {

            api.get_coins_markets(_coins_id, _selected_currency.toLowerCase(), this._set_coins_markets);
        });
    };

    _update_settings() {

        // Call the api to get results of current settings and send it to a callback function
        api.get_settings(this._process_settings_query_result);
    }

    _set_coins_markets = (error, data) => {

        if(!error) {

            this.setState({_coins_markets: data});
        }else {

            actions.trigger_snackbar(t( "pages.dashboard.coin_market_data_error"))
        }
    };

    _go_to_url = (event, url) => {

        const { _history } = this.state;
        _history.push(url);
    };

    _refresh_portfolio_data = () => {

        const { _coins_markets, _balance } = this.state;

        if(typeof _balance === "undefined" || !_coins_markets.length) { return null }

        let number_of_coins_performed_with_value = 0;
        let performed_average_percentage_btc = 0;
        let total_balance_currency = 0;
        let total_balance_currency_before = 0;
        let performed_average_percentage_array = [];

        Object.entries(_balance).forEach(entry => {

            const [key, value] = entry;

            let coin_market = null;
            let performed_average = 0;

            for (let i = 0; i < _coins_markets.length; i++) {

                if(_coins_markets[i].id === key) {

                    coin_market = _coins_markets[i]
                    performed_average = coin_market.price_change_percentage_1y_in_currency > 0 ?
                        (coin_market.price_change_percentage_1y_in_currency / 100) + 1:
                        1 - (-coin_market.price_change_percentage_1y_in_currency / 100);

                    if(key === "bitcoin") {
                        performed_average_percentage_btc = performed_average;
                    }
                }
            }

            const in_currency_value = coin_market.current_price * value;
            performed_average_percentage_array.push(performed_average);
            total_balance_currency += in_currency_value;
            if(value){number_of_coins_performed_with_value++}

            const price_performed_iy_ago_in_currency = in_currency_value / performed_average;
            total_balance_currency_before += price_performed_iy_ago_in_currency;
        });

        const number_of_coins_performed = performed_average_percentage_array.length;

        const performed_average_percentage_weighted = total_balance_currency / total_balance_currency_before; // 0.5 || 0.9 || 1.2 || 4

        const change_average_percentage_weighted = performed_average_percentage_weighted > 1 ?
            performed_average_percentage_weighted - 1:
            -(1 - performed_average_percentage_weighted);

        const change_btc_average_percentage_weighted = performed_average_percentage_btc > 1 ?
            performed_average_percentage_btc - 1:
            -(1 - performed_average_percentage_btc);

        const performed_average_percentage_weighted_on_btc = performed_average_percentage_weighted / performed_average_percentage_btc;
        const change_average_percentage_weighted_btc = performed_average_percentage_weighted_on_btc > 1 ?
            performed_average_percentage_weighted_on_btc - 1:
            -(1 - performed_average_percentage_weighted_on_btc);

        const portfolio = {
            performed_average_percentage_weighted_on_btc,
            change_average_percentage_weighted_btc,
            performed_average_percentage_weighted,
            change_average_percentage_weighted,
            total_balance_currency,
            number_of_coins_performed,
            number_of_coins_performed_with_value
        };

        this.setState({_portfolio: portfolio}, () => {

            actions.trigger_loading_update(100);
        });
    };

    _price_formatter = (value, selected_currency, selected_locales_code, compact) => {

        return price_formatter(value, selected_currency, selected_locales_code, compact);
    };

    _on_transactions_loading_change = (percent) => {

        //actions.trigger_loading_update(percent);
    };

    render() {

        const { classes, _logged_account, _coins_markets, _selected_locales_code, _selected_currency } = this.state;
        const { _balance, _we_know_if_logged, _full_balance_length, _portfolio } = this.state;

        let portfolio = _portfolio;
        let coin_loading_percent = 0;
        if(_coins_markets !== null && _logged_account !== null) {

            if(_logged_account.name) {

                coin_loading_percent = portfolio ? Math.floor(100 * parseFloat(Object.entries(_balance).length / _full_balance_length)): 0;
            }
        }

        return (
            <div>
                <div className={classes.flashInfoContainer}>
                    <FlashInfo image="/src/images/pig-coins.svg" text={t( "pages.dashboard.new_to_crypto_cta")} button={t( "words.learn")} onClick={(event) => this._go_to_url(event, "/about/wiki/topup")}/>
                </div>
                {_logged_account !== null || _we_know_if_logged ?
                    <div className={classes.root}>
                        {_logged_account ?
                            <Grid container>
                                <Grid item xs={12} className={classes.quickDataCardGridMobile}>
                                    <DashboardQuickCardMobile
                                        portfolio={portfolio}
                                        selected_locales_code={_selected_locales_code}
                                        selected_currency={_selected_currency}/>
                                </Grid>

                                <Grid item xs={12} lg={3} className={classes.quickDataCardGrid}>
                                    <DashboardQuickCard
                                        text_content={portfolio !== null ? this._price_formatter(portfolio.total_balance_currency, _selected_currency, _selected_locales_code, true): null}
                                        label_content={t( "pages.dashboard.total_balance")}
                                        icon_component={<AccountBalanceWalletIcon />}
                                        relevant
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} className={classes.quickDataCardGrid}>
                                    <DashboardQuickCard
                                        text_content={portfolio !== null ? portfolio.number_of_coins_performed_with_value + " / " + portfolio.number_of_coins_performed: null}
                                        label_content={t( "pages.dashboard.number_of_cryptos")}
                                        icon_component={<AccountBalanceIcon />}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} className={classes.quickDataCardGrid}>
                                    <DashboardQuickCard
                                        text_content={portfolio !== null ? this._price_formatter(portfolio.change_average_percentage_weighted_btc, "%", _selected_locales_code, 2): null}
                                        label_content={t( "pages.dashboard.performed_btc")}
                                        icon_component={portfolio !== null ? portfolio.change_average_percentage_weighted_btc < 0 ? <CloseIcon />: <CheckIcon />: null}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} className={classes.quickDataCardGrid}>
                                    <DashboardQuickCard
                                        text_content={portfolio !== null ? this._price_formatter(portfolio.change_average_percentage_weighted, "%", _selected_locales_code, 2): null}
                                        label_content={t( "pages.dashboard.performed_percent")}
                                        icon_component={portfolio !== null ? portfolio.change_average_percentage_weighted > 0 ? <TrendingUpIcon />: <TrendingDownIcon />: null}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6} xl={8} className={classes.gridItem}>
                                    {
                                        Boolean(_we_know_if_logged && _logged_account) ?
                                            <DashboardLineChart
                                                coins_markets={_coins_markets}
                                                logged_account={_logged_account}
                                                on_loading_change={(percent) => this._on_transactions_loading_change(percent)}/>
                                            : null
                                    }
                                </Grid>
                                <Grid item xs={12} lg={6} xl={4} className={classes.gridItem}>
                                    {
                                        Boolean(_we_know_if_logged && _logged_account) ?
                                            <DashboardPieChart
                                                portfolio={portfolio}
                                                balance={_balance}
                                                logged_account={_logged_account}
                                                coins_markets={_coins_markets}
                                                selected_currency={_selected_currency}
                                                selected_locales_code={_selected_locales_code}/>: null
                                    }
                                </Grid>
                                <Grid item xs={12} lg={6} className={classes.gridItem}>
                                    {
                                        Boolean(_we_know_if_logged && _logged_account) ?
                                            <DashboardTransactions
                                                logged_account={_logged_account}/>: null
                                    }
                                </Grid>
                                <Grid item xs={12} lg={6} className={classes.gridItem}>
                                    {
                                        Boolean(_we_know_if_logged && _logged_account) ?
                                            <DashboardAddress logged_account={_logged_account}/>: null
                                    }
                                </Grid>
                            </Grid>:
                            <div className={classes.backgroundImage}>
                                <Grow in>
                                    <Fab className={classes.fab} variant="extended" onClick={(event) => this._go_to_url(event, "/accounts")}>
                                        <LockOpenIcon /> {t("sentences.open an account")}
                                    </Fab>
                                </Grow>
                            </div>
                        }
                    </div>: null
                }
            </div>
        );
    }
}

export default withStyles(styles)(Dashboard);
