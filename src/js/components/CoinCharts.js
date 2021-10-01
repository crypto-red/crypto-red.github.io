import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

import CoinChartsData from "./CoinChartsData";
import CoinChartsChart from "./CoinChartsChart";
import CoinChartsConvert from "./CoinChartsConvert";
import CoinChartsLinks from "./CoinChartsLinks";
import CoinChartsRadar from "./CoinChartsRadar";
import CoinChartAddress from "./CoinChartAddress";

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1, 0),
            width: "100vw"
        }
    },
    gridItem: {
        padding: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1, 0)
        }
    },
    cardContainer: {
        height: "100%"
    },
    cardContainerMarginTop: {
        marginTop: theme.spacing(2)
    },
    cardContainerMarginBottom: {
        marginBottom: theme.spacing(2)
    }
});


class CoinCharts extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            pathname: props.pathname,
            coin_id: props.coin_id,
            selected_locales_code: props.selected_locales_code,
            selected_currency: props.selected_currency,
            coin_data: props.coin_data,
            logged_account: props.logged_account
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState({...new_props});
    }

    render() {

        const { classes, selected_currency, selected_locales_code, coin_data, coin_id, logged_account } = this.state;

        return (
            <div className={classes.root}>
                <Grid container>
                    <Grid item xs={12} lg={8} className={classes.gridItem}>
                        <div className={classes.cardContainer}>
                            <CoinChartsChart
                                coin_id={coin_id}
                                selected_currency={selected_currency}
                                selected_locales_code={selected_locales_code}/>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={4} className={classes.gridItem}>
                        <div className={classes.cardContainer}>
                            <CoinChartsData
                                coin_id={coin_id}
                                coin_data={coin_data}
                                selected_currency={selected_currency}
                                selected_locales_code={selected_locales_code}/>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={8} className={classes.gridItem}>
                        <div className={classes.cardContainerMarginBottom}>
                            <CoinChartsConvert
                                coin_id={coin_id}
                                coin_data={coin_data}
                                selected_currency={selected_currency}
                                selected_locales_code={selected_locales_code}/>
                        </div>
                        <div>
                            <CoinChartAddress coin_id={coin_id} logged_account={logged_account}/>
                        </div>
                        <div className={classes.cardContainerMarginTop}>
                            <CoinChartsLinks coin_data={coin_data}/>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={4} className={classes.gridItem}>
                        <div className={classes.cardContainer}>
                            <CoinChartsRadar coin_data={coin_data}/>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(CoinCharts);
