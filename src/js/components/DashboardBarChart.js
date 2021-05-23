import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";
import Skeleton from "@material-ui/lab/Skeleton";

import price_formatter from "../utils/price-formatter";

const styles = theme => ({
    cardContainer: {
        height: "100%"
    },
    performanceCard: {
        height: "100%"
    },
    barChart: {
        width: "100%",
        height: 475
    },
});


class DashboardBarChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coins_markets: props.coins_markets,
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props)
    }

    _percent_formatter = (price, compact = false) => {

        const { selected_locales_code } = this.state;

        return price_formatter(price, null, selected_locales_code, compact)+" %";
    };

    render() {

        const { classes, coins_markets } = this.state;

        const data_bar = coins_markets.map(function(data, key, array){

            return {
                name: data.name,
                changes: data.price_change_percentage_1y_in_currency
            };

        });

        return (
            <div className={classes.cardContainer}>
                <Fade in>
                    <Card className={classes.performanceCard}>
                        <CardHeader title="1 Year performance" />
                        <CardContent>
                            {
                                data_bar.length ?
                                    <Fade in>
                                        <div className={classes.barChart}>
                                            <ResponsiveContainer>
                                                <BarChart
                                                    width={400}
                                                    height={475}
                                                    data={data_bar}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" interval={0} angle={90} height={75} dy={10} textAnchor="start"/>
                                                    <YAxis tickFormatter={value => this._percent_formatter(value, true)} />
                                                    <Tooltip formatter={value => this._percent_formatter(value, true)} />
                                                    <ReferenceLine y={0} stroke="#000" />
                                                    <Bar dataKey="changes" fill="#131162" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Fade>:
                                    <Fade in timeout={300}>
                                        <Skeleton height={475}/>
                                    </Fade>
                            }
                        </CardContent>
                    </Card>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardBarChart);
