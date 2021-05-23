import dispatcher from "../dispatcher";

function trigger_snackbar(message = "", auto_hide_duration = 2500) {

    dispatcher.dispatch({
        type: "SNACKBAR",
        data: {
            message,
            auto_hide_duration
        }
    });
}

function trigger_login_update() {

    dispatcher.dispatch({
        type: "LOGIN_UPDATE",
        data: {}
    });
}

function trigger_settings_update() {

    dispatcher.dispatch({
        type: "SETTINGS_UPDATE",
        data: {}
    });
}

module.exports = {
    trigger_snackbar: trigger_snackbar,
    trigger_login_update: trigger_login_update,
    trigger_settings_update: trigger_settings_update
};
