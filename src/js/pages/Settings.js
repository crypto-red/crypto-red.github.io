import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Fade from "@material-ui/core/Fade";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { LOCALES, CURRENCY_COUNTRIES } from "../utils/constants";
import api from "../utils/api";
import actions from "../actions/utils";
import CardHeader from "@material-ui/core/CardHeader";

import fuzzy from "fuzzy";

const styles = theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 0)
        }
    },
    marginTop: {
        marginTop: theme.spacing(2)
    }
});


class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            _locales: LOCALES,
            _currency_countries: CURRENCY_COUNTRIES,
            _selected_locales_code: null,
            _selected_currency: null,
            _sfx_enabled: true,
            _jamy_enabled: true,
            _panic_mode: false
        };
    };

    componentDidMount() {

        this._update_settings();
    }

    _process_settings_query_result = (error, settings) => {

        // Set new settings from query result
        const _sfx_enabled = typeof settings.sfx_enabled !== "undefined" ? settings.sfx_enabled: true;
        const _jamy_enabled = typeof settings.jamy_enabled !== "undefined" ? settings.jamy_enabled: true;
        const _selected_locales_code = settings.locales || "en-US";
        const _selected_currency = settings.currency || "USD";
        const _panic_mode = settings.panic || false;

        this.setState({ _sfx_enabled, _jamy_enabled, _selected_locales_code, _selected_currency, _panic_mode });
    };

    _update_settings() {

        // Call the api to get results of current settings and send it to a callback function
        api.get_settings(this._process_settings_query_result);
    }

    _on_settings_changed = () => {

        actions.trigger_snackbar("Settings changed");
        actions.trigger_settings_update();
    }

    _handle_locales_changed = (event, value) => {

        if(value) {

            const settings = { locales: value.original.code };
            this.setState({_selected_locales_code: value.original.code});
            api.set_settings(settings, this._on_settings_changed);
            actions.trigger_sfx("ui_lock");
            actions.jamy_update("happy");
        }
    }

    _handle_currency_changed = (event, value) => {

        if(value.original) {

            const settings = { currency: value.original.toUpperCase() };
            this.setState({_selected_currency: value.original.toUpperCase()});
            api.set_settings(settings, this._on_settings_changed);
            actions.trigger_sfx("ui_lock");
            actions.jamy_update("happy");
        }
    }

    _handle_panic_switch_change = (event) => {

        const checked = Boolean(this.state._panic_mode);

        if(checked){

            actions.trigger_sfx("ui_lock");
            actions.jamy_update("shocked");
        }else {

            actions.trigger_sfx("ui_unlock");
            actions.jamy_update("suspicious");
        }

        const settings = { panic: !checked };
        this.setState({_panic_mode: !checked});
        api.set_settings(settings, this._on_settings_changed);
    };

    _handle_sfx_enabled_switch_change = (event) => {

        const checked = Boolean(this.state._sfx_enabled);

        if(checked){

            actions.trigger_sfx("ui_lock");
            actions.jamy_update("happy");
        }else {

            actions.trigger_sfx("ui_unlock");
            actions.jamy_update("happy");
        }

        const settings = { sfx_enabled: !checked };
        this.setState({_sfx_enabled: !checked});
        api.set_settings(settings, this._on_settings_changed);
    };

    _handle_jamy_enabled_switch_change = (event) => {

        const checked = Boolean(this.state._jamy_enabled);

        if(checked){

            actions.trigger_sfx("ui_lock");
            actions.jamy_update("sad");
        }else {

            actions.trigger_sfx("ui_unlock");
            actions.jamy_update("happy");
        }

        const settings = { jamy_enabled: !checked };
        this.setState({_jamy_enabled: !checked});
        api.set_settings(settings, this._on_settings_changed);
    };

    _fuzzy_filter_locales = (list, input_value) => {

        const options = {
            pre: "<b style=\"color: #000244;\">"
            , post: "</b>"
            , extract: function(element) { return element.name; }
        };

        return fuzzy.filter(input_value.inputValue, list, options);
    };

    _fuzzy_filter_currency = (list, input_value) => {

        const options = {
            pre: "<b style=\"color: #000244;\">"
            , post: "</b>"
            , extract: function(element) { return element; }
        };

        return fuzzy.filter(input_value.inputValue, list, options);
    };

    render() {

        const { _locales, _sfx_enabled, _jamy_enabled, _selected_currency, _currency_countries, _selected_locales_code, _panic_mode, classes } = this.state;

        let locales = _locales[0];

        for (let i = 0; i < _locales.length; i++) {
            if(_locales[i].code == _selected_locales_code) {
                locales = _locales[i];
            }
        }

        let currencies = [];
        Object.entries(_currency_countries).forEach(entry => {
            const [key, value] = entry;
            currencies.push(key);
        });

        return (
            <div>
                <Container maxWidth="sm" className={classes.container}>
                    <Fade in timeout={300*1}>
                        <Card>
                            <CardHeader title="Language" />
                            <CardContent>
                                <Autocomplete
                                    fullWidth
                                    value={locales}
                                    filterOptions={this._fuzzy_filter_locales}
                                    onChange={this._handle_locales_changed}
                                    id="locales-autocomplete"
                                    options={_locales}
                                    getOptionLabel={(option) => option.name || option.original.name}
                                    renderOption={(option) => <span dangerouslySetInnerHTML={{ __html: option.string }}></span>}
                                    renderInput={(params) => <TextField {...params} label="Locales" margin="normal" />}
                                />
                            </CardContent>
                        </Card>
                    </Fade>
                    <Fade in timeout={300*2}>
                        <Card className={classes.marginTop}>
                            <CardHeader title="Currency" />
                            <CardContent>
                                <Autocomplete
                                    fullWidth
                                    filterOptions={this._fuzzy_filter_currency}
                                    value={_selected_currency}
                                    onChange={this._handle_currency_changed}
                                    id="currency-autocomplete"
                                    options={currencies}
                                    getOptionLabel={(option) => option.original || option}
                                    renderOption={(option) => <span dangerouslySetInnerHTML={{ __html: option.string }}></span>}
                                    renderInput={(params) => <TextField {...params} label="Currency" margin="normal" />}
                                />
                            </CardContent>
                        </Card>
                    </Fade>
                    <Fade in timeout={300*3}>
                        <Card className={classes.marginTop}>
                            <CardHeader title="Sounds" />
                            <CardContent>
                                <FormControlLabel
                                    value="Show sound effects"
                                    control={<Switch checked={_sfx_enabled} onChange={this._handle_sfx_enabled_switch_change} color="primary" />}
                                    label="Enable sound effects"
                                    labelPlacement="end"
                                />
                            </CardContent>
                        </Card>
                    </Fade>
                    <Fade in timeout={300*4}>
                        <Card className={classes.marginTop}>
                            <CardHeader title="Superintendent" />
                            <CardContent>
                                <FormControlLabel
                                    value="Enable the superintendent"
                                    control={<Switch checked={_jamy_enabled} onChange={this._handle_jamy_enabled_switch_change} color="primary" />}
                                    label="Make Jamy active"
                                    labelPlacement="end"
                                />
                                <p>Jamy is responsible for the surveillance, judgement, and reaction of your actions as a user. He can't tell anyone what you are doing, but he is present if you enable him to be so.</p>
                            </CardContent>
                        </Card>
                    </Fade>
                    <Fade in timeout={300*5}>
                        <Card className={classes.marginTop}>
                            <CardHeader title="Security" />
                            <CardContent>
                                <FormControlLabel
                                    value="Show panic mode"
                                    control={<Switch checked={_panic_mode} onChange={this._handle_panic_switch_change} color="primary" />}
                                    label="Enable reset menu option"
                                    labelPlacement="end"
                                />
                            </CardContent>
                        </Card>
                    </Fade>
                </Container>
            </div>
        );
    }
}

export default withStyles(styles)(Settings);
