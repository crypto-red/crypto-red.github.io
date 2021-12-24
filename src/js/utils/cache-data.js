import {clean_json_text} from "./json";

function _cache_data(database, cache_time_ms, query_id, api_function, api_parameters, callback_function, response_to_data_formatter = (response) => {return response}) {

    let data_in_db = null;

    // Get data and store it
    function gather_data(rev ) {

        function insert_response_in_db(error, response) {

            if(!error && response) {

                if(typeof response.error === "undefined") {

                    const data = response_to_data_formatter(response);

                    database.put({
                        _id: query_id,
                        _rev: rev,
                        timestamp: Date.now(),
                        data: JSON.stringify(data)
                    }, {force: true});

                    callback_function(null, data);
                }else {

                    if(data_in_db) {

                        callback_function(null, data_in_db);
                    }else {

                        callback_function(response.error, null);
                    }
                }
            }else {

                if(data_in_db) {

                    callback_function(null, data_in_db);
                }else {

                    callback_function(error, null);
                }
            }

        }

        api_function(api_parameters, insert_response_in_db);
    }

    // Look for data into the DB
    database.get(query_id, {revs: true, revs_info: true}, function(err, doc) {

        if (!err && doc) {

            const rev_ids = doc._revs_info.filter((ri) => {

                if(ri.status !== "missing") {return Boolean(ri.rev === doc._rev);}
                return false;
            }).map((ri) => ri.rev);

            if(rev_ids.length > 1) {

                rev_ids.splice(0, 1);
                database.bulkDocs(rev_ids.map((ri) => {return {_id: query_id, _rev: ri, _deleted: true, timestamp: 0, data: null}}), {force: true});
            }

            // Test if recent or if cache time equals 0 (force refresh) or navigator offline
            if((doc.timestamp + cache_time_ms >= Date.now() && cache_time_ms !== 0) || !navigator.onLine) {

                data_in_db = doc.data ? JSON.parse(clean_json_text(doc.data)): null;

                callback_function(!data_in_db ? "No data": null, data_in_db);
            }else { // if old update

                gather_data(doc._rev);
            }

        }else if(navigator.onLine){

            // Get data from network
            gather_data("1-A");
        }else {

            callback_function("No data", null);
        }
    });
}

module.exports = _cache_data;