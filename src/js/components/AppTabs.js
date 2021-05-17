import React from "react";
import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ViewListIcon from "@material-ui/icons/ViewList";
import BarChartIcon from "@material-ui/icons/BarChart";
import CallMadeIcon from "@material-ui/icons/CallMade";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import { HISTORY } from "../utils/constants";

const styles = theme => ({

    AppBar: {
        position: "relative",
        zIndex: 1202,
        [theme.breakpoints.up('md')]: {
            borderRadius: 4
        }
    },
    appBarContainer: {
        position: "fixed",
        width: "100%",
        zIndex: "1300",
        [theme.breakpoints.up('md')]: {
            margin: theme.spacing(2),
            width: "calc(100% - 288px)"

        }
    },
    tabs: {
        "& .MuiTab-root": {
            minWidth: "auto"
        }
    }
});

const VIEW_NAMES = [
    "balance",
    "transactions",
    "charts",
    "send",
    "receive"
];

class AppTabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pathname: props.pathname,
            tabs: props.tabs,
            classes: props.classes,
            _history: HISTORY,
            _view_name_index: VIEW_NAMES.indexOf(props.pathname.split("/")[3] || "") === -1 ? 0: VIEW_NAMES.indexOf(props.pathname.split("/")[3] || ""),
            _view_names: VIEW_NAMES
        };
    };

    componentDidMount() {

    }

    componentWillReceiveProps(new_state) {

        const { pathname, _view_names } = this.state;
        const new_pathname = new_state.pathname;
        const view_name = new_pathname.split("/")[3] || "";

        if(pathname !== new_pathname) {

            const _view_name_index = _view_names.indexOf(view_name) === -1 ? 0: _view_names.indexOf(view_name);
            this.setState({_view_name_index, pathname: new_pathname});
        }
    }

    _get_tab_props = (index) => {

        return {
            id: `coin-tab-${index}`,
            'aria-controls': `coin-tabpanel-${index}`,
        }
    };

    _handle_view_name_change = (event, view_name_index) => {

        const { _history, _view_names } = this.state;

        const pathname = _history.location.pathname;
        const _coin_id = pathname.split("/")[2] || "";
        const _view_name = _view_names[view_name_index] || "balance";
        const _view_name_index = _view_names.indexOf(_view_name) === -1 ? 0: _view_names.indexOf(_view_name);

        const new_pathname = "/coins/" + _coin_id + "/" + _view_name;
        _history.push(new_pathname);
        this.setState({_view_name_index});
    };

    render() {

        const { classes, _view_names, pathname, _history, tabs, _view_name_index } = this.state;

        return (
            <div className={classes.appBarContainer}>
                <AppBar position="static" className={classes.AppBar}>
                    <Tabs value={_view_name_index}
                          indicatorColor="#FFFFFF"
                          onChange={this._handle_view_name_change}
                          variant="fullWidth"
                          aria-label="icon label tabs example"
                          selectionFollowsFocus
                          className={classes.tabs}>
                        <Tab {...this._get_tab_props(0)} icon={<AccountBalanceIcon />} />
                        <Tab {...this._get_tab_props(1)} icon={<ViewListIcon />} />
                        <Tab {...this._get_tab_props(2)} icon={<BarChartIcon />} />
                        <Tab {...this._get_tab_props(3)} icon={<CallMadeIcon />} />
                        <Tab {...this._get_tab_props(4)} icon={<CallReceivedIcon />} />
                    </Tabs>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(AppTabs);