import React from "react";
import { withStyles } from "@material-ui/core/styles";

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

    _price_formatter = (price, compact = false, display_currency = true) => {

        const { selected_locales_code, selected_currency } = this.state;

        const amount = display_currency ?
            price_formatter(price, selected_currency, selected_locales_code, compact):
            price_formatter(price, null, selected_locales_code, compact);

        return amount;
    };

    render() {

        const { classes } = this.state;
        const { portfolio} = this.state;

        return (
            <div className={classes.fullWidth}>
                <Fade in>
                    <Card>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableCellBold}>{portfolio !== null ? "Total balance:": <Skeleton/>}</TableCell>
                                        <TableCell align="right">{portfolio !== null ? this._price_formatter(portfolio.total_balance_currency, true, true): <Skeleton/>}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableCellBold}>{portfolio !== null ? "Cryptocurrency numbers:": <Skeleton/>}</TableCell>
                                        <TableCell align="right">{portfolio !== null ? portfolio.number_of_coins_performed_with_value + " / " + portfolio.number_of_coins_performed: <Skeleton/>}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableCellBold}>{portfolio !== null ? "Performed / BTC:": <Skeleton/>}</TableCell>
                                        <TableCell align="right">{portfolio !== null ? portfolio.performed_average_percentage_weighted_on_btc.toFixed(2): <Skeleton/>}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableCellBold}>{portfolio !== null ? "Performed:": <Skeleton/>}</TableCell>
                                        <TableCell align="right">{portfolio !== null ? (portfolio.performed_average_percentage_weighted * 100).toFixed(0) + "%": <Skeleton/>}</TableCell>
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
