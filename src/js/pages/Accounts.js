import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Fade from "@material-ui/core/Fade";
import Grow from "@material-ui/core/Grow";

import AddIcon from "@material-ui/icons/Add";

import AccountCard from "../components/AccountCard";
import AccountCardCreate from "../components/AccountCardCreate";
import AccountDialogClose from "../components/AccountDialogClose";
import AccountDialogOpen from "../components/AccountDialogOpen";
import AccountDialogDelete from "../components/AccountDialogDelete";
import AccountDialogCreate from "../components/AccountDialogCreate";
import AccountDialogBackup from "../components/AccountDialogBackup";

import { COINS } from "../utils/constants";

import actions from "../actions/utils";
import { HISTORY } from "../utils/constants";
import api from "../utils/api";

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    accountCards: {
        padding: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(1, 0)
        }
    },
    fab: {
        position: "fixed",
        backgroundColor: theme.palette.primary.action,
        color: theme.palette.primary.contrastText,
        "&:hover": {
            backgroundColor: theme.palette.primary.actionLighter,
        },
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        "& svg": {
            marginRight: 4
        }
    },
    gridItem: {
        padding: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(1, 0)
        }
    }
});


class Accounts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            _history: HISTORY,
            _coins_markets: [],
            _logged_account: null,
            _selected_account: null,
            _accounts: [],
            _no_accounts_db: false,
            _is_account_dialog_close_open: false,
            _is_account_dialog_open_open: false,
            _is_account_dialog_delete_open: false,
            _is_account_dialog_create_open: false,
            _is_account_dialog_backup_open: false,
            _login_error: false,
            _selected_locales_code: null,
            _selected_currency: null,
            _sfx_enabled: true,
        };
    };

    componentDidMount() {

        let coins_id = [];

        for (let i = 0; i < COINS.length; i++) {

            coins_id.push(COINS[i].id);
        }

        this.setState({_coins_id: coins_id}, this._update_settings);

        actions.trigger_loading_update(0);
        setTimeout(() => {

            actions.trigger_loading_update(100);
        }, 300);
    }

    _process_settings_query_result = (error, settings) => {

        const { _coins_id } = this.state;

        // Set new settings from query result
        const _sfx_enabled = settings.sfx_enabled;
        const _selected_locales_code = settings.locales;
        const _selected_currency = settings.currency;

        this.setState({ _sfx_enabled, _selected_locales_code, _selected_currency }, function(){
            this._get_accounts();
            this._is_logged();
            api.get_coins_markets(_coins_id, _selected_currency.toLowerCase(), this._set_coins_markets);
        });
    };

    _set_coins_markets = (error, data) => {

        if(!error && data)  {

            this.setState({_coins_markets: data});
        }else {

            console.log(error);
        }
    };

    _get_accounts = () => {

        api.get_accounts(this._process_get_accounts_result);
    };

    _process_is_logged_result = (error, result) => {

        const _logged_account = error ? null: result;
        this.setState({_logged_account});
    };

    _is_logged = () => {

        api.is_logged(this._process_is_logged_result);
    };

    _update_settings() {

        // Call the api to get results of current settings and send it to a callback function
        actions.trigger_loading_update(0);
        api.get_settings(this._process_settings_query_result);
    }

    _process_get_accounts_result = (error, result) => {

        const _accounts = error ? []: result;
        const _no_accounts_db = _accounts.length ? false: true;
        this.setState({_accounts, _no_accounts_db}, () => {

            actions.trigger_loading_update(100);
        });
    };

    _process_logout_result = (error, result) => {

        if(!error) {

            this.setState({_is_account_dialog_open_open: false});
            actions.trigger_login_update();
        }

        this._is_logged();
    };

    _process_login_result = (error, result) => {

        if(!error && result !== null) {

            this.setState({_is_account_dialog_open_open: false, _login_error: false, _logged_account: result});
            actions.trigger_login_update();
            actions.trigger_snackbar(t( "pages.accounts.logged_new_account"));
            actions.trigger_sfx("hero_decorative-celebration-01");
            actions.jamy_update("happy");

        }else {

            this.setState({_login_error: true});
            actions.trigger_sfx("alert_error-01");
            actions.jamy_update("angry");
        }
    };

    _toggle_account = (event, account) => {

        const { _logged_account } = this.state;

        let is_to_close = false;

        if(_logged_account) {

            is_to_close = Boolean(_logged_account.name === account.name);
        }

        if(!is_to_close) {

            this.setState({_selected_account: account, _is_account_dialog_open_open: true});
            actions.trigger_sfx("alert_high-intensity");
        }else {

            this.setState({_selected_account: account, _is_account_dialog_close_open: true});
            actions.trigger_sfx("alert_high-intensity");
        }

    };

    _backup_account = (event, account) => {

        this.setState({_is_account_dialog_backup_open: true, _selected_account: account});
        actions.trigger_sfx("alert_high-intensity");
    };

    _close_account_dialog_close = () => {

        this.setState({_is_account_dialog_close_open: false});
    };

    _close_account_dialog_open = () => {

        this.setState({_is_account_dialog_open_open: false});
    };

    _open_account_dialog_open = (event, account) => {

        this.setState({_selected_account: account, _is_account_dialog_open_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _close_selected_account = (event, account) => {

        api.logout(this._process_logout_result);
        this.setState({_is_account_dialog_close_open: false, _logged_account: null});
        actions.jamy_update("sad");
    };

    _open_selected_account = (event, account, password, persistent) => {

        api.login(account.name, password, persistent, this._process_login_result);
        this.setState({_login_error: false});
    };

    _open_delete_account_dialog = (event, account) => {

        this.setState({_selected_account: account, _is_account_dialog_delete_open: true});
        actions.trigger_sfx("alert_high-intensity");
    };

    _close_account_dialog_delete = () => {

        this.setState({_is_account_dialog_delete_open: false});
    };

    _delete_selected_account = (event, account) => {

        const { _logged_account } = this.state;

        if(_logged_account !== null) {

            if(_logged_account.name === account.name) {

                api.logout(this._process_logout_result);
            }
        }
        api.delete_account_by_name(account.name, this._get_accounts);
        this.setState({_is_account_dialog_delete_open: false});
        actions.jamy_update("sad");
    };

    _close_account_dialog_backup = () => {

        this.setState({_is_account_dialog_backup_open: false});
    };

    _close_account_dialog_create = () => {

        this.setState({_is_account_dialog_create_open: false});
        actions.jamy_update("flirty");
    };

    _open_account_dialog_create = () => {

        this.setState({_is_account_dialog_create_open: true});
        actions.trigger_sfx("alert_high-intensity");
        actions.jamy_update("happy");
    };

    _on_account_dialog_create_complete = () => {

        this._get_accounts();
        this.setState({_is_account_dialog_create_open: false});
        actions.trigger_sfx("hero_decorative-celebration-01");
        actions.jamy_update("happy");
    }

    _on_account_dialog_create_error = () => {

        actions.trigger_sfx("alert_error-01");
        actions.jamy_update("angry");
    }

    render() {

        const { classes, _selected_account, _logged_account, _accounts, _selected_locales_code, _selected_currency, _login_error , _coins_markets, _no_accounts_db } = this.state;
        const { _sfx_enabled, _is_account_dialog_close_open, _is_account_dialog_open_open, _is_account_dialog_delete_open, _is_account_dialog_create_open, _is_account_dialog_backup_open } = this.state;

        const logged_account_name = Boolean(_logged_account) ? _logged_account.name: null;

        return (
            <div className={classes.root}>
                <Grid container className={classes.accountCards}>
                    {
                        _no_accounts_db ?
                            <Grid item xs={12} sm={6} lg={3} className={classes.gridItem}>
                                <Fade timeout={300}>
                                    <AccountCardCreate onCreate={this._open_account_dialog_create}/>
                                </Fade>
                            </Grid>: null
                    }
                    {_accounts.map((account, index, array) => {
                        return (
                            <Grid item xs={12} sm={6} lg={3} className={classes.gridItem} key={account.name}>
                                <AccountCard
                                             onToggle={this._toggle_account}
                                             coins_markets={_coins_markets}
                                             current={(logged_account_name === account.name)}
                                             delete={this._open_delete_account_dialog}
                                             backup={this._backup_account}
                                             account={(logged_account_name === account.name) ? _logged_account: account}
                                             display_after_ms={(index+1)*300}
                                             selected_locales_code={_selected_locales_code}
                                             selected_currency={_selected_currency}/>
                            </Grid>
                        )})
                    }
                </Grid>
                <Grow in>
                    <Fab className={classes.fab} variant="extended" onClick={this._open_account_dialog_create}>
                        <AddIcon /> {t( "words.create")}
                    </Fab>
                </Grow>

                <AccountDialogClose account={_logged_account}
                                    open={_is_account_dialog_close_open}
                                    onClose={this._close_account_dialog_close}
                                    cancel={this._close_account_dialog_close}
                                    accept={this._close_selected_account}/>

                <AccountDialogOpen account={_selected_account}
                                   open={_is_account_dialog_open_open}
                                   error={_login_error}
                                   onComplete={this._open_selected_account}
                                   cancel={this._close_account_dialog_open}
                                   onClose={this._close_account_dialog_open}/>

                <AccountDialogDelete account={_selected_account}
                                     open={_is_account_dialog_delete_open}
                                     onClose={this._close_account_dialog_delete}
                                     cancel={this._close_account_dialog_delete}
                                     accept={this._delete_selected_account}/>

                <AccountDialogCreate open={_is_account_dialog_create_open}
                                     selected_locales_code={_selected_locales_code}
                                     sfx_enabled={_sfx_enabled}
                                     onComplete={this._on_account_dialog_create_complete}
                                     onError={this._on_account_dialog_create_error}
                                     onClose={this._close_account_dialog_create}
                                     cancel={this._close_account_dialog_create}/>

                <AccountDialogBackup open={_is_account_dialog_backup_open}
                                     account={_logged_account}
                                     onClose={this._close_account_dialog_backup}/>
            </div>
        );
    }
}

export default withStyles(styles)(Accounts);
