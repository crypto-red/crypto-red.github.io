import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Skeleton from "@material-ui/lab/Skeleton";

import price_formatter from "../utils/price-formatter";

const styles = theme => ({
    fullWidth: {
        width: "100%"
    },
    tableCellBold: {
        fontWeight: "bold"
    }
});


class DashboardQuickCardMobile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            portfolio: props.portfolio,
            selected_locales_code: props.selected_locales_code,
            selected_currency: props.selected_currency
        };
    };

    componentWillReceiveProps(next_props) {

        this.setState(next_props);
    }

    _price_formatter = (price, selected_currency, selected_locales_code, compact ) => {

        return price_formatter(price, selected_currency, selected_locales_code, compact);
    };

    render() {

        const { classes } = this.state;
        const { portfolio} = this.state;
        const { selected_currency, selected_locales_code } = this.state;

        return (
            <div className={classes.fullWidth}>
                <Fade in>
                    <Card>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableCellBold}>{portfolio !== null ? t( "components.dashboard_quick_card_mobile.total"): <Skeleton/>}</TableCell>
                                        <TableCell align="right">{portfolio !== null ? this._price_formatter(portfolio.total_balance_currency, selected_currency, selected_locales_code, true): <Skeleton/>}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableCellBold}>{portfolio !== null ? t( "components.dashboard_quick_card_mobile.number"): <Skeleton/>}</TableCell>
                                        <TableCell align="right">{portfolio !== null ? portfolio.number_of_coins_performed_with_value + " / " + portfolio.number_of_coins_performed: <Skeleton/>}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableCellBold}>{portfolio !== null ? t( "components.dashboard_quick_card_mobile.btc_performance"): <Skeleton/>}</TableCell>
                                        <TableCell align="right">{portfolio !== null ? this._price_formatter(portfolio.change_average_percentage_weighted_btc, "%", selected_locales_code, 2): <Skeleton/>}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableCellBold}>{portfolio !== null ? t( "components.dashboard_quick_card_mobile.performance"): <Skeleton/>}</TableCell>
                                        <TableCell align="right">{portfolio !== null ? this._price_formatter(portfolio.change_average_percentage_weighted, "%", selected_locales_code, 2): <Skeleton/>}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardQuickCardMobile);
