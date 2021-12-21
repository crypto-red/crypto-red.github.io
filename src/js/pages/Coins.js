import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Fade from "@material-ui/core/Fade";
import Avatar from "@material-ui/core/Avatar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import lightGreen from "@material-ui/core/colors/lightGreen";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import Skeleton from "@material-ui/lab/Skeleton";

import { COINS, HISTORY } from "../utils/constants";
import api from "../utils/api";
import price_formatter from "../utils/price-formatter";
import actions from "../actions/utils";


const styles = theme => ({
    tableContainerContainer: {
        [theme.breakpoints.up("md")]: {
            padding: theme.spacing(2)
        },
        display: "grid",
        overflow: "auto"
    },
    paperTable: {
        [theme.breakpoints.down("sm")]: {
            borderRadius: 0
        },
    },
    firstCellInARow: {
        display: "flex",
        cursor: "pointer"
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1
    },
    headCell: {
        fontWeight: "bold"
    },
    green: {
        color: green[700],
        borderRadius: 4,
        padding: 4,
        backgroundColor: lightGreen[100]
    },
    red: {
        color: red[700],
        borderRadius: 4,
        padding: 4,
        backgroundColor: red[100]
    },
    row: {
        "&:nth-of-type(odd)": {
            backgroundColor: "rgba(128, 128, 128, 0.08)",
        },
        "&:hover": {
            backgroundColor: "rgba(128, 128, 128, 0.16)",
        },
    },
    displayFlex: {
      display: "flex"
    },
    skeletonFullWidth: {
        display: "inline-grid",
        width: "100%"
    },
    skeletonBadge: {
        display: "inline-grid",
        width: 60,
        height: 27
    },
    avatar: {
        display: "inline-grid",
        fontSize: 16,
        width: theme.spacing(3),
        height: theme.spacing(3),
        minWidth: theme.spacing(3),
        minHeight: theme.spacing(3),
        marginRight: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    tableHead: {
        zIndex: 1202,
        position: "relative",
    },
    tableHeadCell: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        whiteSpace: "nowrap",
        padding: "12px 16px"
    },
    tableSortLabelRoot: {
        color: theme.palette.primary.contrastText,

        // if you want to have icons visible permanently
        // "& $icon": {
        //   opacity: 1,
        //   color: primaryMain
        // },

        "&:hover": {
            color: theme.palette.primary.contrastText,

            "&& $icon": {
                opacity: 1,
                color: theme.palette.primary.contrastText
            },
        },
        "&$active": {
            color: theme.palette.primary.contrastText,

            // && instead of & is a workaround for https://github.com/cssinjs/jss/issues/1045
            "&& $icon": {
                opacity: 1,
                color: theme.palette.primary.contrastText
            },
        }
    },
    tableSortLabelActive: {
        color: theme.palette.primary.contrastText,
    },
    tableSortLabelIcon: {
        color: "inherit !important"
    }
});

class Coins extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            _coins_id: [],
            _coins_markets: [],
            _order: null,
            _order_by: null,
            _history: HISTORY
        };
    };

    componentDidMount() {

        let coins_id = [];

        for (let i = 0; i < COINS.length; i++) {
            
            coins_id.push(COINS[i].id);
        }

        this.setState({_coins_id: coins_id}, this._update_settings);
    }

    _process_settings_query_result = (error, settings) => {

        const { _coins_id, _coins_markets } = this.state;

        // Set new settings from query result
        const _selected_locales_code =  typeof settings.locales !== "undefined" ? settings.locales: "en-US";
        const _selected_currency = typeof settings.currency !== "undefined" ? settings.currency: "USD";

        this.setState({ _selected_locales_code, _selected_currency }, function(){

            if(!_coins_markets.length) {

                actions.trigger_loading_update(0);
            }
            api.get_coins_markets(_coins_id, _selected_currency.toLowerCase(), this._set_coins_markets);
        });
    };

    _update_settings() {

        // Call the api to get results of current settings and send it to a callback function
        api.get_settings(this._process_settings_query_result);
    }

    _set_coins_markets = (error, data) => {

        if(!error && data !== null)  {

            this.setState({_coins_markets: data});
        }

        actions.trigger_loading_update(100);
    };

    _descending_comparator(a, b, order_by) {
        
        if (b[order_by] < a[order_by]) {
            return -1;
        }
        if (b[order_by] > a[order_by]) {
            return 1;
        }
        return 0;
    }
    
    _get_comparator(order, order_by) {
        
        return order === "desc"
            ? (a, b) => this._descending_comparator(a, b, order_by)
    : (a, b) => -this._descending_comparator(a, b, order_by);
    }
    
    _stable_sort(array, comparator) {
        
        const stabilized_this = array.map((el, index) => [el, index]);
        stabilized_this.sort((a, b) => {
            const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
        return stabilized_this.map((el) => el[0]);
    }
    
    _handle_request_sort = (event, property) => {
        
        const { _order, _order_by } = this.state;
        
        const is_asc = _order_by === property && _order === "asc";
        const order = is_asc ? "desc" : "asc";
        
        this.setState({_order: order, _order_by: property});
    };

    _create_sort_handler = (property, event) => {
        
        this._handle_request_sort(event, property);
        actions.jamy_update("happy");
    };

    _price_formatter = (price, selected_currency, selected_locales_code, compact) => {

        return price_formatter(price, selected_currency, selected_locales_code, compact);
    };

    _go_to_link = (event, url) => {

        const { _history } = this.state;
        _history.push(url);
    }

    render() {

        const { classes, _coins_markets, _coins_id, _order, _order_by } = this.state;
        const { _selected_currency, _selected_locales_code } = this.state;

        const head_cells = [
            { id: "name", numeric: false, disablePadding: false, label: t( "pages.coins.name"), tooltip: t( "pages.coins.coins_name") },
            { id: "current_price", numeric: true, disablePadding: false, label: t( "pages.coins.price"), tooltip: t( "pages.coins.current_price") },
            { id: "price_change_percentage_24h_in_currency", numeric: true, disablePadding: false, label: t( "pages.coins.day"), tooltip: t( "pages.coins.price_change_day") },
            { id: "price_change_percentage_7d_in_currency", numeric: true, disablePadding: false, label: t( "pages.coins.week"), tooltip: t( "pages.coins.price_change_week")},
            { id: "price_change_percentage_30d_in_currency", numeric: true, disablePadding: false, label: t( "pages.coins.month"), tooltip: t( "pages.coins.price_change_month")},
            { id: "price_change_percentage_1y_in_currency", numeric: true, disablePadding: false, label: t( "pages.coins.year"), tooltip: t( "pages.coins.price_change_year")},
            { id: "market_cap", numeric: true, disablePadding: false, label: t( "pages.coins.market_capitalization_short"), tooltip: t( "pages.coins.market_capitalization")},
        ];
        
        return (
            <div>
                <Fade in>
                    <div className={classes.tableContainerContainer}>
                        <TableContainer className={classes.paperTable} component={Paper}>
                            <Table>
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        {head_cells.map((head_cell) => (
                                            <TableCell
                                                classes={{head: classes.tableHeadCell}}
                                                className={classes.headCell}
                                                key={head_cell.id}
                                                align={head_cell.numeric ? "right" : "left"}
                                                padding={head_cell.disablePadding ? "none" : "default"}
                                                sortDirection={_order_by === head_cell.id ? _order : false}
                                                onClick={() => this._create_sort_handler(head_cell.id)}
                                            >
                                                <Tooltip title={head_cell.tooltip} aria-label={head_cell.tooltip}>
                                                    <TableSortLabel
                                                        classes={{root: classes.tableSortLabelRoot, active: classes.tableSortLabelActive, icon: classes.tableSortLabelIcon}}
                                                        active={_order_by === head_cell.id}
                                                        direction={_order_by === head_cell.id ? _order : "asc"}
                                                    >
                                                        {head_cell.label}
                                                        {_order_by === head_cell.id ? (
                                                            <span className={classes.visuallyHidden}>
                                                    {_order === "desc" ? "sorted descending" : "sorted ascending"}
                                                </span>
                                                        ) : null}
                                                    </TableSortLabel>
                                                </Tooltip>
                                            </ TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        _coins_markets.length ?
                                            this._stable_sort(_coins_markets, this._get_comparator(_order, _order_by)).map((row, index) => (
                                                <TableRow key={row.name} className={classes.row}>
                                                    <TableCell component="th" scope="row" className={classes.firstCellInARow} onClick={(event) => this._go_to_link(event, `/coins/${row.id}/charts`)}>
                                                        <Avatar className={classes.avatar} src={row.image}></Avatar>
                                                        <a>{row.name}</a>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {this._price_formatter(row.current_price, _selected_currency, _selected_locales_code, false)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <span className={row.price_change_percentage_24h_in_currency >= 0 ? classes.green: classes.red}>
                                                            {this._price_formatter(row.price_change_percentage_24h_in_currency, "%%", _selected_locales_code, 2)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right" >
                                                        <span className={row.price_change_percentage_7d_in_currency >= 0 ? classes.green: classes.red}>
                                                            {this._price_formatter(row.price_change_percentage_7d_in_currency, "%%", _selected_locales_code, 2)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <span className={row.price_change_percentage_30d_in_currency >= 0 ? classes.green: classes.red}>
                                                            {this._price_formatter(row.price_change_percentage_30d_in_currency, "%%", _selected_locales_code, 2)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <span className={row.price_change_percentage_1y_in_currency >= 0 ? classes.green: classes.red}>
                                                            {this._price_formatter(row.price_change_percentage_1y_in_currency, "%%", _selected_locales_code, 2)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {this._price_formatter(row.market_cap, _selected_currency, _selected_locales_code, false)}
                                                    </TableCell>
                                                </TableRow>
                                            )):
                                            _coins_id.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row" className={classes.displayFlex}>
                                                        <Skeleton variant="circle" className={classes.avatar}/>
                                                        <Skeleton className={classes.skeletonFullWidth}/>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Skeleton className={classes.skeletonFullWidth}/>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Skeleton className={classes.skeletonBadge}/>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Skeleton className={classes.skeletonBadge}/>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Skeleton className={classes.skeletonBadge}/>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Skeleton className={classes.skeletonBadge}/>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Skeleton className={classes.skeletonFullWidth}/>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(Coins);
