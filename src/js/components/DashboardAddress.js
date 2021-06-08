import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";

import { COINS } from "../utils/constants";
import AddressListItem from "../components/AddressListItem";
import AddressDialog from "./AddressDialog";
import actions from "../actions/utils";

const styles = theme => ({
    gridItem: {
        padding: theme.spacing(1),
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1, 0)
        }
    },
    cardContainer: {
        height: "100%"
    },
    addressCard: {
        height: "100%"
    },
    addressCardContent: {
        maxHeight: 472,
        overflow: "auto"
    },
});


class DashboardAddress extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            logged_account: props.logged_account,
            _coins_id: [],
            _is_address_and_keys_dialog_open: false,
            _selected_coin_id: null
        };
    };

    componentDidMount() {

        this.setState({_coins_id: COINS.map(coin => coin.id)});
    }

    _open_address_and_keys_dialog = (event, coin_id) => {

        this.setState({_is_address_and_keys_dialog_open: true, _selected_coin_id: coin_id});
        actions.trigger_sfx("alert_high-intensity");
    };

    _close_address_and_keys_dialog = (event, coin_id) => {

        this.setState({_is_address_and_keys_dialog_open: false, _selected_coin_id: null});
    };

    _cancel_address_and_keys_dialog = (event, coin_id) => {

        this.setState({_is_address_and_keys_dialog_open: false, _selected_coin_id: null});
        actions.trigger_sfx("state-change_confirm-down");
    };

    render() {

        const { classes, logged_account, } = this.state;
        const { _coins_id, _is_address_and_keys_dialog_open, _selected_coin_id } = this.state;

        return (
            <div className={classes.cardContainer}>

                <AddressDialog
                    open={_is_address_and_keys_dialog_open}
                    logged_account={logged_account}
                    coin_id={_selected_coin_id}
                    onClose={this._close_address_and_keys_dialog}
                    cancel={this._cancel_address_and_keys_dialog}/>

                <Fade in>
                    <Card className={classes.addressCard}>
                        <CardHeader title="Address" />
                        <CardContent className={classes.addressCardContent}>
                            {
                                _coins_id.map((coin_id) => {

                                    return (
                                        <AddressListItem
                                            key={coin_id}
                                            coin_id={coin_id}
                                            logged_account={logged_account}
                                            onClickOpen={this._open_address_and_keys_dialog}/>
                                    );
                                })
                            }
                        </CardContent>
                    </Card>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardAddress);
