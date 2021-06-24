import en from "../locales/en";

const T = { en };

function t(locales = "en", path = "", variables = {}, parameters = {}) {

    const paths_array = path.split(".");

    // Goes to the last dir specified in the path
    let dir = T[locales] || T["en"];

    for(let i = 0; i < paths_array.length-1; i++) {

        dir = dir[paths_array[i]];
    }

    // Get the object in the last dir
    const end_dir_name = paths_array[paths_array.length-1];
    const end_path_value = dir[end_dir_name];

    // Replace variables with real value(s) in the translate object value chosen
    let value_with_variables = end_path_value;
    Object.entries(variables).forEach(entry => {

        const [key, value] = entry;
        let variable_name_to_replace = key; // dog
        let variable_value_to_replace = value; // "dog" or {dog: 2}

        const is_value_a_plural = typeof variable_value_to_replace === "object" && variable_value_to_replace !== null;

        if(is_value_a_plural) { // {dog: 2}

            const start_plural_key = Object.entries(variable_value_to_replace)[0][0]; // dog
            const plural_number_value = Object.entries(variable_value_to_replace)[0][1]; // 2
            const need_to_find_string = "%s {{" + variable_name_to_replace + "}}";

            const numbered_plural_var_text = plural_number_value <= 1 ?
                T[locales]["_plurals"][start_plural_key]["one"].toString():
                T[locales]["_plurals"][start_plural_key]["many"].toString();

            const need_to_replace_string = plural_number_value.toString() + " " + numbered_plural_var_text;
            value_with_variables = value_with_variables.replaceAll(need_to_find_string, need_to_replace_string);

        }else { // "dog"

            const need_to_find_string = "{{" + variable_name_to_replace + "}}";
            const need_to_replace_string = (variable_value_to_replace || "").toString();

            value_with_variables = value_with_variables.replaceAll(need_to_find_string, need_to_replace_string);
        }
    });

    if(parameters.fluc || parameters.FLUC || parameters.flc || parameters.FLC) { // First Letter Upper Case

        value_with_variables = value_with_variables.charAt(0).toUpperCase() + value_with_variables.slice(1);
    }

    if(parameters.fllc || parameters.FLLC) { // First letter Lower Case

        value_with_variables = value_with_variables.charAt(0).toLowerCase() + value_with_variables.slice(1);
    }

    if(parameters.tuc || parameters.TUC) { // To Upper Case

        value_with_variables = value_with_variables.toUpperCase();
    }

    if(parameters.aed || parameters.AED) { // Add End Dot

        value_with_variables = value_with_variables + ".";
    }

    return value_with_variables;
}

module.exports = {
    t: t
};

