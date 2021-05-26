function loadValueHtmlSelector(url, selector, callback_function) {

    let data_file = url;
    let http_request = new XMLHttpRequest();
    try{
        // Opera 8.0+, Firefox, Chrome, Safari
        http_request = new XMLHttpRequest();
    }catch (e) {
        // Internet Explorer Browsers
        try{
            http_request = new ActiveXObject("Msxml2.XMLHTTP");

        }catch (e) {

            try{
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            }catch (e) {
                // Something went wrong
                callback_function("Cannot load data", null);
            }

        }
    }

    http_request.onreadystatechange = () => {

        if (http_request.readyState === 4  ) {
            // Javascript function JSON.parse to parse JSON data
            const html = http_request.responseText.toString();
            console.log(html);
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const el = doc.querySelector(selector);
            const text = el.textContent || el.innerText;

            callback_function(null, text);
        }else if(http_request.status === 404){

            callback_function("Error 404", null);
        }
    }

    http_request.open("POST", data_file, true);
    http_request.setRequestHeader("Content-type", "text/html; charset=UTF-8");
    http_request.send();

}

function loadJSON(url, callback_function) {

    let data_file = url;
    let http_request = new XMLHttpRequest();
    try{
        // Opera 8.0+, Firefox, Chrome, Safari
        http_request = new XMLHttpRequest();
    }catch (e) {
        // Internet Explorer Browsers
        try{
            http_request = new ActiveXObject("Msxml2.XMLHTTP");

        }catch (e) {

            try{
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            }catch (e) {
                // Something went wrong
                callback_function("Cannot load data", null);
            }

        }
    }

    http_request.open("GET", url, true);


    http_request.onreadystatechange = function() {

        if (http_request.readyState === 4  ) {
            // Javascript function JSON.parse to parse JSON data
            let jsonObj = JSON.parse(http_request.responseText);

            callback_function(null, jsonObj);
        }else if(http_request.status === 404){

            callback_function("Error 404", null);
        }
    }

    http_request.send();
}

function postDATA(url, data, callback_function) {

    let http_request = new XMLHttpRequest();
    try{
        // Opera 8.0+, Firefox, Chrome, Safari
        http_request = new XMLHttpRequest();
    }catch (e) {
        // Internet Explorer Browsers
        try{
            http_request = new ActiveXObject("Msxml2.XMLHTTP");

        }catch (e) {

            try{
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            }catch (e) {
                // Something went wrong
                callback_function("Cannot load data", null);
                return;
            }

        }
    }

    http_request.open("POST", url, true);
    http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    http_request.onreadystatechange = function() {

        if (http_request.readyState == 4 && http_request.status == 200) {
            // Javascript function JSON.parse to parse JSON data
            let jsonObj = JSON.parse(http_request.responseText);

            callback_function(null, jsonObj);
        }else if(http_request.status == 404){

            callback_function("Error 404", null);
        }
    }

    http_request.send(data);
}

module.exports = {
    loadValueHtmlSelector: loadValueHtmlSelector,
    loadJSON: loadJSON,
    postDATA: postDATA
};
