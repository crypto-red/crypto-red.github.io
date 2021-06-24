import React from "react";
import { withStyles } from "@material-ui/core/styles";

const L = document.documentElement.lang;
import { t } from "../utils/t";

import { ResponsiveContainer, PieChart, Pie, Sector, Tooltip } from "recharts";

import { HISTORY } from "../utils/constants";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";

import Skeleton from "@material-ui/lab/Skeleton";

import price_formatter from "../utils/price-formatter";
import {useAutocomplete} from "@material-ui/lab";

const styles = theme => ({
    cardContainer: {
        height: "100%"
    },
    balanceCard: {
        height: "100%"
    },
    pieChart: {
        width: "100%",
        height: 475
    },
    noTransactionCardContent: {
        textAlign: "center",
    },
    noTransactionImage: {
        maxHeight: 475 - 48,
        height: "100%",
    },
    cardContent: {
        height: "calc(100% - 64px)"
    },
    pieChartSkeletonContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    pieChartSkeleton: {
        width: 200,
        height: 200,
        margin: "auto",
        alignSelf: "flex-start"
    }
});


class DashboardPieChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            balance: props.balance,
            portfolio: props.portfolio,
            logged_account: props.logged_account,
            coins_markets: props.coins_markets,
            selected_currency: props.selected_currency,
            selected_locales_code: props.selected_locales_code,
            _history: HISTORY,
            _pie_chart_active_index: 0
        };
    };

  componentWillReceiveProps(new_props) {

        this.setState(new_props);
  }

    _on_pie_enter = (_, index) => {
        this.setState({
            _pie_chart_active_index: index,
        });
    };

    _render_active_shape = (props, total_balance_currency) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos <= 0 ? "start" : "end";

        return (
            <g>
                <text x={cx} y={cy} dy={-10} fontWeight="bold" textAnchor="middle" fontSize={14} fill={"#9e9e9e"}>
                    {payload.name} {`${(percent * 100).toFixed(0)}%`}
                </text>
                <text x={cx} y={cy} dy={20} fontWeight="bold" textAnchor="middle" fontSize={19} fill={fill}>
                    {this._price_formatter(value, true, true)}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
            </g>
        );
    };

    _price_formatter = (price, compact = false, display_currency = true, display_percent = false, total = 0) => {

        const { selected_locales_code, selected_currency } = this.state;

        const ammount = display_currency ?
            price_formatter(price, selected_currency, selected_locales_code, compact):
            price_formatter(price, null, selected_locales_code, compact);

        return display_percent ? ammount + " (" + Math.floor((price/total)*100) + "%)": ammount;
    };

    render() {

        const { classes, logged_account, coins_markets, _pie_chart_active_index, balance, portfolio } = this.state;

        let pie_data = [ ];

        if(Boolean(logged_account) && coins_markets.length) {

            Object.entries(balance).forEach(entry => {

                const [key, value] = entry;

                let coin_market = null;
                for (let i = 0; i < coins_markets.length; i++) {

                    if(coins_markets[i].id === key) {
                        coin_market = coins_markets[i];
                    }
                }

                if(coin_market !== null && value > 0) {

                    pie_data.push({
                        name: coin_market.name,
                        value: value * coin_market.current_price
                    });
                }
            });
        }

        return (
            <div className={classes.cardContainer}>
                <Fade in>
                    <Card className={classes.balanceCard}>
                        <CardHeader title={t(L, "components.dashboard_pie_chart.title")} />
                        <CardContent className={classes.cardContent}>
                            {coins_markets.length > 0 && portfolio ?
                                <Fade in>
                                    <div className={classes.pieChart}>
                                        {pie_data.length !== 0 ?
                                            <ResponsiveContainer>
                                                <PieChart width={400} height={400}>
                                                    <Pie
                                                        activeIndex={_pie_chart_active_index}
                                                        activeShape={(props) => this._render_active_shape(props, portfolio.total_balance_currency)}
                                                        data={pie_data}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={75}
                                                        outerRadius={100}
                                                        fill="#131162"
                                                        dataKey="value"
                                                        onMouseEnter={this._on_pie_enter}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            : Boolean(pie_data.length <= 0) ?
                                                <div className={classes.noTransactionCardContent}>
                                                    <img className={classes.noTransactionImage} src="/src/images/segment.svg"/>
                                                    <p>{t(L, "sentences.no transactions maid portfolio")}</p>
                                                </div>
                                                :null
                                        }
                                    </div>
                                </Fade>
                                :
                                <div className={classes.pieChartSkeletonContainer}>
                                    <Skeleton variant={"circle"} className={classes.pieChartSkeleton}/>
                                </div>
                            }
                        </CardContent>
                    </Card>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardPieChart);
