import dispatcher from "../dispatcher";

// Functions enabling events to be dispatched and received elsewhere in the code with data


function jamy_update(state_of_mind = "shocked", duration = 1500) {

    dispatcher.dispatch({
        type: "JAMY_UPDATE",
        data: {
            state_of_mind,
            duration
        }
    });
}

function trigger_sfx(name, volume = 1, pack = "md") {

    dispatcher.dispatch({
        type: 'TRIGGER_SFX',
        data: {
            pack,
            name,
            volume
        }
    });
}

function trigger_vocal(name, volume = 1, pack = "gg") {

    dispatcher.dispatch({
        type: 'TRIGGER_VOCAL',
        data: {
            pack,
            name,
            volume
        }
    });
}
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
    jamy_update: jamy_update,
    trigger_sfx: trigger_sfx,
    trigger_snackbar: trigger_snackbar,
    trigger_login_update: trigger_login_update,
    trigger_settings_update: trigger_settings_update
};
