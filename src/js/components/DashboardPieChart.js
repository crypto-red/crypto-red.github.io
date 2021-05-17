import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Sector, Tooltip } from 'recharts';

import { HISTORY } from "../utils/constants";
import Skeleton from "@material-ui/lab/Skeleton";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";

import price_formatter from "../utils/price-formatter";

const styles = theme => ({
    cardContainer: {
        height: "100%"
    },
    balanceCard: {
        height: "100%"
    },
    pieChart: {
        width: "100%",
        height: 400
    },
    fullWidth: {
        width: "100%"
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
        const textAnchor = cos <= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} font-weight="bold" textAnchor="middle" fill={fill}>
                    {this._price_formatter(total_balance_currency, true, true)}
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
                        <CardHeader title="Portfolio and balance" />
                        <CardContent>
                            {coins_markets.length > 0 && portfolio ?
                                <Fade in>
                                    <div className={classes.pieChart}>
                                        {pie_data.length > 0 ?
                                            <ResponsiveContainer>
                                                <PieChart width={400} height={400}>
                                                    <Pie
                                                        activeIndex={_pie_chart_active_index}
                                                        activeShape={(props) => this._render_active_shape(props, portfolio.total_balance_currency)}
                                                        data={pie_data}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        fill="#131162"
                                                        dataKey="value"
                                                        onMouseEnter={this._on_pie_enter}
                                                    />
                                                    <Tooltip formatter={value => this._price_formatter(value, true, true, true, portfolio.total_balance_currency)}/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            : Boolean(pie_data.length <= 0) ?
                                                <div>
                                                    <img className={classes.fullWidth} src="/src/images/accountant-dark.svg"/>
                                                    <p>You've not made any transactions yet, therefore your portfolio is empty but it will show here.</p>
                                                </div>
                                                :null
                                        }
                                    </div>
                                </Fade>
                                :
                                <Fade in timeout={300}>
                                    <Skeleton height={400} />
                                </Fade>
                            }
                        </CardContent>
                    </Card>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardPieChart);