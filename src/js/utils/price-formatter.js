function price_formatter(price = 0, _selected_currency = "usd", _selected_locales_code = "en-US", compact = false) {


    let currency = null;
    if(_selected_currency !== null) {

        currency = _selected_currency.length !== 3 ? _selected_currency.slice(0, 3): _selected_currency;
    } // Cut for example "dash" to "das"
    const currency_props = _selected_currency !== null ? {style: 'currency', currency}: {};

    // Don't show 0.1233 as 0.123338247894 nor 13000.12 as 13000.1233
    let maximum_significant_digits = price.toFixed(0).length + 4;

    if(price <= 0.1) {

        maximum_significant_digits = price.toFixed(0).length + 3;
    }else if (price <= 1) {

        maximum_significant_digits = price.toFixed(0).length + 3;
    }else if (price <= 10) {

        maximum_significant_digits = price.toFixed(0).length + 3;
    }else if (price <= 100) {

        maximum_significant_digits = price.toFixed(0).length + 2;
    }else {

        maximum_significant_digits = price.toFixed(0).length + 2;
    }

    const compact_props = compact ? {notation: "compact", compactDisplay: "short"}: {maximumSignificantDigits: maximum_significant_digits};
    let number_formatted = new Intl.NumberFormat(_selected_locales_code, { ...compact_props, ...currency_props }).format(price);

    if(number_formatted !== null && currency !== null) {

        if(number_formatted.toLowerCase().includes(currency.toLowerCase())) {

            number_formatted = number_formatted.replace(currency.toUpperCase(), _selected_currency.toUpperCase()); // replace for example "das" by the initial "dash" value

        }
    }


    return number_formatted;
}

module.exports = price_formatter;
