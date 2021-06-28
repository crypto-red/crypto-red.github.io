import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";

import AddressListItem from "../components/AddressListItem";
import AddressDialog from "./AddressDialog";
import actions from "../actions/utils";

const styles = theme => ({
    fullHeight: {
        height: "100%"
    },
});


class CoinChartsAddress extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            logged_account: props.logged_account,
            coin_id: props.coin_id,
            _is_address_and_keys_dialog_open: false,
            _selected_coin_id: null
        };
    };

    componentWillReceiveProps(new_props) {

        this.setState(new_props);
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
        const { coin_id, _is_address_and_keys_dialog_open, _selected_coin_id } = this.state;

        return (
            <div className={classes.fullHeight}>
                <AddressDialog
                    open={_is_address_and_keys_dialog_open}
                    logged_account={logged_account}
                    coin_id={_selected_coin_id}
                    onClose={this._close_address_and_keys_dialog}
                    cancel={this._cancel_address_and_keys_dialog}/>
                <Fade in>
                    <Card>
                        <CardHeader title={t("words.address", {}, {FLC: true})} />
                        <CardContent>
                            <AddressListItem
                                key={coin_id}
                                coin_id={coin_id}
                                logged_account={logged_account}
                                onClickOpen={this._open_address_and_keys_dialog}/>
                        </CardContent>
                    </Card>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(CoinChartsAddress);
