import en from "../locales/en";
import fr from "../locales/fr";

const T = { en, fr };

function t(path = "", variables = {}, parameters = {}) {

    const paths_array = path.split(".");

    // Goes to the last dir specified in the path
    let dir = T[document.documentElement.lang] || T["en"];

    for(let i = 0; i < paths_array.length-1; i++) {

        dir = dir[paths_array[i]];
    }

    // Get the object in the last dir
    let end_dir_name = "";

    if(parameters.faw || parameters.FAW || variables.faw || variables.FAW) { // Format All Words

        end_dir_name = paths_array[paths_array.length-1]
            .replaceAll("'", "")
            .replaceAll('"', "")
            .replaceAll(",", "")
            .toLowerCase();

        variables.faw = null;
        variables.FAW = null;

    }else {

        end_dir_name = paths_array[paths_array.length-1];
    }

    const end_path_value = dir[end_dir_name];

    // Replace variables with real value(s) in the translate object value chosen
    let value_with_variables = end_path_value;
    Object.entries(variables).forEach(entry => {

        const [key, value] = entry;

        if(key && value) {

            let variable_name_to_replace = key; // dog
            let variable_value_to_replace = value; // "dog" or {dog: 2}

            const is_value_a_plural = typeof variable_value_to_replace === "object" && variable_value_to_replace !== null;

            if(is_value_a_plural) { // {dog: 2}

                const start_plural_key = Object.entries(variable_value_to_replace)[0][0]; // dog

                if(start_plural_key === variable_name_to_replace) {

                    let few_how_much = null;
                    let plenty_how_much = null;

                    if (Object.entries(variable_value_to_replace)[1][0] === "_n"){  // {dog: 2, _n: {few: 20, plenty: 100}}

                        few_how_much = Object.entries(variable_value_to_replace)[1][1]["few"] || null;
                        plenty_how_much = Object.entries(variable_value_to_replace)[1][1]["plenty"] || null;
                    }

                    const plural_number_value = Object.entries(variable_value_to_replace)[0][1]; // 2
                    const need_to_find_string = "%s {{" + start_plural_key + "}}";

                    let numbered_plural_var_text = plural_number_value <= 1 ? // Either one or many
                        T[document.documentElement.lang]["_plurals"][start_plural_key]["one"].toString():
                        T[document.documentElement.lang]["_plurals"][start_plural_key]["many"].toString();


                    if(few_how_much && plural_number_value > 1 && plural_number_value < few_how_much){  // From one up to few

                        numbered_plural_var_text =  T[document.documentElement.lang]["_plurals"][start_plural_key]["few"].toString();
                    }

                    if(plenty_how_much && plural_number_value >= plenty_how_much) { // From plenty up to infinity

                        numbered_plural_var_text =  T[document.documentElement.lang]["_plurals"][start_plural_key]["plenty"].toString();
                    }

                    const need_to_replace_string = plural_number_value.toString() + " " + numbered_plural_var_text;

                    if(value_with_variables.includes(need_to_find_string)) {

                        value_with_variables = value_with_variables.replaceAll(need_to_find_string, need_to_replace_string);
                    }
                }

            }else { // "dog"

                const need_to_find_string = "{{" + variable_name_to_replace + "}}";
                const need_to_replace_string = variable_value_to_replace === null ? "": variable_value_to_replace.toString();

                if(value_with_variables.includes(need_to_find_string)) {

                    value_with_variables = value_with_variables.replaceAll(need_to_find_string, need_to_replace_string);
                }
            }
        }
    });

    parameters = Object.assign(variables, parameters);
    if(parameters.fluc || parameters.FLUC || parameters.flc || parameters.FLC) { // First Letter Upper Case

        value_with_variables = value_with_variables.charAt(0).toUpperCase() + value_with_variables.slice(1);
    }

    if(parameters.fllc || parameters.FLLC) { // First letter Lower Case

        value_with_variables = value_with_variables.charAt(0).toLowerCase() + value_with_variables.slice(1);
    }

    if(parameters.tuc || parameters.TUC) { // To Upper Case

        value_with_variables = value_with_variables.toUpperCase();
    }

    if(parameters.tlc || parameters.TLC) { // To Lower Case

        value_with_variables = value_with_variables.toLowerCase();
    }

    if(parameters.aed || parameters.AED) { // Add End Dot

        value_with_variables = value_with_variables + ".";
    }

    return value_with_variables;
}

module.exports = {
    t
};

