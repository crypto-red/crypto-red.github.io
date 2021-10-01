import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import { COINS_IMAGES } from "../utils/constants";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Fade from "@material-ui/core/Fade";

import price_formatter from "../utils/price-formatter";

import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";

const styles = theme => ({
    coinImage: {
        "& .MuiAvatar-img": {
            objectFit: "initial",
        },
        borderRadius: 0
    },
    tableCellBold: {
        fontWeight: "bold"
    },
    price: {
        fontWeight: "bold"
    },
    green: {
        color: green[700],
    },
    red: {
        color: red[700],
    },
    title: {
        fontSize: 28,
        color: theme.palette.primary.dark
    },
    fullHeight: {
        height: "100%"
    }
});


class CoinChartsData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            selected_locales_code: props.selected_locales_code,
            selected_currency: props.selected_currency,
            coin_data: props.coin_data,
            coin_id: props.coin_id,
        };
    };
    componentWillReceiveProps(new_props) {

        this.setState(new_props);
    }

    _price_formatter = (price, selected_currency, selected_locales_code, compact) => {

        return price_formatter(price, selected_currency, selected_locales_code, compact);
    };

    render() {

        const { classes, coin_id, selected_currency, selected_locales_code, coin_data } = this.state;

        return (
            <div className={classes.fullHeight}>
                {
                    Boolean(coin_data) ?
                        <Fade in={Boolean(coin_data)}>
                            <Card className={classes.fullHeight}>
                                <CardContent>
                                    <CardHeader
                                        classes={{title: classes.title}}
                                        avatar={<Avatar className={classes.coinImage} src={COINS_IMAGES[coin_id] || ""}/>}
                                        title={coin_data.name}
                                    />
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <span>{t("components.coin_charts_data.day")}</span>
                                                    <span className={coin_data.market_data.price_change_percentage_24h_in_currency[selected_currency.toLowerCase()] <= 0 ? classes.red: classes.green}>
                                                        {this._price_formatter(coin_data.market_data.price_change_percentage_24h_in_currency[selected_currency.toLowerCase()], "%%", selected_locales_code, 2)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span>{t("components.coin_charts_data.week")}</span>
                                                    <span className={coin_data.market_data.price_change_percentage_7d_in_currency[selected_currency.toLowerCase()] <= 0 ? classes.red: classes.green}>
                                                        {this._price_formatter(coin_data.market_data.price_change_percentage_7d_in_currency[selected_currency.toLowerCase()], "%%", selected_locales_code, 2)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span>{t("components.coin_charts_data.month")}</span>
                                                    <span className={coin_data.market_data.price_change_percentage_30d_in_currency[selected_currency.toLowerCase()] <= 0 ? classes.red: classes.green}>
                                                        {this._price_formatter(coin_data.market_data.price_change_percentage_30d_in_currency[selected_currency.toLowerCase()], "%%", selected_locales_code, 2)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span>{t("components.coin_charts_data.year")}</span>
                                                    <span className={coin_data.market_data.price_change_percentage_1y_in_currency[selected_currency.toLowerCase()] <= 0 ? classes.red: classes.green}>
                                                        {this._price_formatter(coin_data.market_data.price_change_percentage_1y_in_currency[selected_currency.toLowerCase()], "%%", selected_locales_code, 2)}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <Table aria-label="main-info-table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="left" className={classes.tableCellBold}>{t("components.coin_charts_data.price")}</TableCell>
                                                <TableCell align="right" className={classes.price}>{this._price_formatter(coin_data.market_data.current_price[selected_currency.toLowerCase()], selected_currency, selected_locales_code, false)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left" className={classes.tableCellBold}>{t("components.coin_charts_data.market_cap")}</TableCell>
                                                <TableCell align="right">{this._price_formatter(coin_data.market_data.market_cap[selected_currency.toLowerCase()], selected_currency, selected_locales_code, false)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left" className={classes.tableCellBold}>{t("components.coin_charts_data.total_supply")}</TableCell>
                                                <TableCell align="right">{coin_data.market_data.total_supply}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left" className={classes.tableCellBold}>{t("components.coin_charts_data.market_cap_rank")}</TableCell>
                                                <TableCell align="right">#{coin_data.market_data.market_cap_rank}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left" className={classes.tableCellBold}>{t("components.coin_charts_data.alexa_rank")}</TableCell>
                                                <TableCell align="right">#{coin_data.public_interest_stats.alexa_rank}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left" className={classes.tableCellBold}>{t("components.coin_charts_data.today_score")}</TableCell>
                                                <TableCell align="right">{this._price_formatter(coin_data.sentiment_votes_up_percentage, "%", selected_locales_code, 0)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left" className={classes.tableCellBold}>{t("components.coin_charts_data.all_time_high")}</TableCell>
                                                <TableCell align="right">{this._price_formatter(coin_data.market_data.ath[selected_currency.toLowerCase()], selected_currency, selected_locales_code, false)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left" className={classes.tableCellBold}>{t("components.coin_charts_data.all_time_low")}</TableCell>
                                                <TableCell align="right">{this._price_formatter(coin_data.market_data.atl[selected_currency.toLowerCase()], selected_currency, selected_locales_code, false)}</TableCell>
                                            </TableRow>
                                            <TableRow><p align="left">{t("components.coin_charts_data.data_provided_by")} <a href="https://coingecko.com/" target="_blank">CoinGecko</a></p></TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </Fade>: null
                }
            </div>
        );
    }
}

export default withStyles(styles)(CoinChartsData);
