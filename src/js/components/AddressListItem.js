import React from "react";
import { withStyles } from '@material-ui/core/styles'

import { t } from "../utils/t";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import FileCopyIcon from "@material-ui/icons/FileCopy"
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

import api from "../utils/api";
import actions from "../actions/utils";
import { HISTORY } from "../utils/constants";
import clipboard from "clipboard-polyfill";

const styles = theme => ({
    listItem: {
      "& .MuiListItemText-primary": {
          display: "grid"
      }
    },
    textOverflowEllipsis: {
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "no-wrap"
    },
    cursorPointer: {
        cursor: "pointer"
    }
});


class AddressListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coin_id: props.coin_id,
            logged_account: props.logged_account,
            _address: null,
            _history: HISTORY
        };
    };

    componentDidMount() {

        const { coin_id, logged_account } = this.state;

        if(Boolean(logged_account)) {

            this._get_address_by_seed(coin_id, logged_account.seed, logged_account.hive_username);
        }
    }

    componentWillReceiveProps(new_props) {


        if (new_props.logged_account) {

            if(new_props.logged_account !== this.state.logged_account) {

                this._get_address_by_seed(new_props.coin_id, new_props.logged_account.seed, new_props.logged_account.hive_username);
                this.setState(new_props);
            }
        }

    }

    _get_address_by_seed = (coin_id, seed, hive_username) => {

        const address = api.get_address_by_seed(coin_id, seed, hive_username);
        this.setState({_address: address});
    };

    _copy_address = (event, address) => {


        if(address !== null) {

            clipboard.writeText(address).then(
                function () {

                    actions.trigger_snackbar(t( "sentences.address successfully copied"));
                    actions.trigger_sfx("navigation_forward-selection");
                },
                function () {

                    actions.trigger_snackbar(t( "sentences.cannot copy this address"));
                    actions.trigger_sfx("navigation_backward-selection");
                }
            );
        }else {

            actions.trigger_snackbar(t( "sentences.cannot copy a non-existent address"));
            actions.trigger_sfx("navigation_backward-selection");
        }
    }

    _on_click_open = (event, coin_id) => {

        this.props.onClickOpen(event, coin_id);
    };

    render() {

        const { classes, _address, coin_id } = this.state;

        return (
            <ListItem className={classes.listItem} button>
                <ListItemText onClick={(event) => this._on_click_open(event, coin_id)} primary={<span className={classes.textOverflowEllipsis}>{_address}</span>} secondary={coin_id} />
                <ListItemIcon className={classes.cursorPointer} onClick={(event) => this._copy_address(event, _address)}><FileCopyIcon /></ListItemIcon>
            </ListItem>
        );
    }
}

export default withStyles(styles)(AddressListItem);
