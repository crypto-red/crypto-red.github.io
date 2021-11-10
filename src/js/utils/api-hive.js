import hiveJS from "@hiveio/hive-js";
import { ChainTypes, makeBitMaskFilter } from "@hiveio/hive-js/lib/auth/serializer";
import PouchDB from "pouchdb";
import {postJSON} from "./load-json";
import {clean_json_text} from "./json";

import { IMAGE_PROXY_URL } from "../utils/constants";

const hive_posts_db = new PouchDB("hive_posts_db", {revs_limit: 0, auto_compaction: false});
const hive_accounts_db = new PouchDB("hive_accounts_db", {revs_limit: 0, auto_compaction: false});
const hive_queries_db = new PouchDB("hive_queries_db", {revs_limit: 0, auto_compaction: false});

function _cache_data(database, cache_time_ms, query_id, api_function, api_parameters, callback_function, response_to_data_formatter = (response) => {return response}) {

    let data_in_db = null;

    // Get data and store it
    function gather_data(rev) {

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
    database.get(query_id, function(err, doc) {
        if (!err) {

            // Test if recent or if cache time equals 0 (force refresh) or navigator offline
            if((doc.timestamp + cache_time_ms >= Date.now() && cache_time_ms !== 0) || !navigator.onLine) {

                data_in_db = JSON.parse(clean_json_text(doc.data));

                callback_function(null, data_in_db);
            }else { // if old update

                gather_data(doc._rev);
            }

        }else {

            // Get data from network
            gather_data("1-A");
        }
    });
}

function _get_pixel_art_data_from_content(content) {

    let data_regex = /((.|\n)+)(\!\[[a-zA-Z0-9 \-\"\'\#\*\&]+\]\((data:image\/png;base64,[a-zA-Z0-9\/+\=]+)\))$/gm;

    let match = data_regex.exec(content);

    if(match !== null) {

        return {
            content: match[1].replace(/\n+/gm, "\n\n").replace(/\u200B/g,""),
            image: match[4],
        };
    }else {

        return null;
    }
}

function _format_account(account) {

    let parsed_json_metadata = {};

    try {

        parsed_json_metadata = {...parsed_json_metadata, ...JSON.parse(account.json_metadata)};
    } catch(e){}

    try {

        parsed_json_metadata = {...parsed_json_metadata, ...JSON.parse(account.posting_json_metadata)};
    }catch(e2) {}

    parsed_json_metadata.profile = typeof parsed_json_metadata.profile === "undefined" ? {}: parsed_json_metadata.profile;
    parsed_json_metadata.profile.profile_image = typeof parsed_json_metadata.profile.profile_image === "undefined" ? "": IMAGE_PROXY_URL + parsed_json_metadata.profile.profile_image;
    parsed_json_metadata.profile.profile_image = parsed_json_metadata.profile.profile_image.match(/(https:\/\/)([/|.|\w|\s])*\.(?:jpg|jpeg|gif|png)/) === null ? "": IMAGE_PROXY_URL + parsed_json_metadata.profile.profile_image;
    parsed_json_metadata.profile.cover_image = typeof parsed_json_metadata.profile.cover_image === "undefined" ? "": IMAGE_PROXY_URL + parsed_json_metadata.profile.cover_image;
    parsed_json_metadata.profile.cover_image = parsed_json_metadata.profile.cover_image.match(/(https:\/\/)([/|.|\w|\s])*\.(?:jpg|jpeg|gif|png)/) === null ? "": IMAGE_PROXY_URL + parsed_json_metadata.profile.cover_image;
    parsed_json_metadata.profile.about = typeof parsed_json_metadata.profile.about === "undefined" ? "": parsed_json_metadata.profile.about;
    parsed_json_metadata.profile.name = typeof parsed_json_metadata.profile.name === "undefined" ? "": parsed_json_metadata.profile.name;
    parsed_json_metadata.profile.location = typeof parsed_json_metadata.profile.location === "undefined" ? "": parsed_json_metadata.profile.location;
    parsed_json_metadata.profile.website = typeof parsed_json_metadata.profile.website === "undefined" ? "": parsed_json_metadata.profile.website;

    const saved_hive = Number(account.savings_balance.split(" ")[0]);
    const saved_hbd = Number(account.savings_hbd_balance.split(" ")[0]);
    const hive = Number(account.balance.split(" ")[0]);
    const hbd = Number(account.hbd_balance.split(" ")[0]);


    const account_formatted = {
        name: account.name,
        memo_key: account.memo_key,
        profile_image: parsed_json_metadata.profile.profile_image,
        cover_image: parsed_json_metadata.profile.cover_image,
        about: parsed_json_metadata.profile.about,
        location: parsed_json_metadata.profile.location,
        website: parsed_json_metadata.profile.website,
        wallet: {
            saved_hive,
            saved_hbd,
            hive,
            hbd
        }
    };

    return account_formatted;
}

function _preprocess_text(content) {

    let origin = window.location.origin;

    /* PROXY IMAGE */
    const images_text_link_regex = /https?\:\/\/[a-zA-Z0-9.\+\-\=\?\&\_\%\/\:\/]+(png|jpg|jpeg|gif)/gm;
    content = content.replace(images_text_link_regex, function(match){

        return IMAGE_PROXY_URL + match;
    });

    /* RENDER TAGS */
    const tag_text_regex = / #[a-zA-Z0-9-]+/gm;
    content = content.replace(tag_text_regex, function(match){

        const url = "/newest/search/tag:" + match.toLowerCase().replace("#", "").replace(" ", "");
        return ` [${match.replaceAll(" ", "")}](${origin}/gallery${url})`;
    });

    /* RENDER USERNAME */
    const username_text_regex = / @[a-zA-Z0-9-.]+/gm;
    content = content.replace(username_text_regex, function(match){

        const username = + match.toLowerCase().replace("@", "").replace(" ", "");
        return` [${match.replaceAll(" ", "")}](${origin}/gallery/newest/search/@${username})`;
    });

    return content;
}

function _format_post(post) {

    const post_body_data = _get_pixel_art_data_from_content(post.body);
    if(post_body_data === null) {return;}

    const { image, content } = post_body_data;

    const key = post.author + "_" + post.permlink;
    const dollar_payout = Number(post.pending_payout_value.split(" ")[0]) + Number((post.author_payout_value || "0 HBD").split(" ")[0]) + + Number((post.curator_payout_value || "0 HBD").split(" ")[0]);
    const metadata = JSON.parse(post.json_metadata) || {};
    const metadata_language = metadata.language || "unknown";

    const app = metadata.app || "unknown";
    const responsabilities = metadata.responsabilities || [];
    const description = _preprocess_text(content);
    const title = post.title;
    let metadata_tags = metadata.tags || [post.category];
    metadata_tags = metadata_tags.map(function(tag){
        return tag.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
    });

    let positive_vote_rshares = 0;
    let positive_votes = 0;
    let negative_vote_rshares = 0;
    let negative_votes = 0;

    for(let i = 0; i < post.active_votes.length; i++) {

        const vote = post.active_votes[i];
        const rshares = parseInt(vote.rshares, 10);
        const percent = parseInt(vote.percent, 10);

        if(percent > 0) {
            positive_vote_rshares += rshares;
            positive_votes ++;
        }else if(percent < 0) {
            negative_vote_rshares += rshares;
            negative_votes ++;
        }
    }
    const voting_ratio = Math.round(((positive_vote_rshares || 1) / ((positive_vote_rshares + -negative_vote_rshares) || 1)) * 100);

    return {
        id: post.post_id || post.id,
        timestamp: new Date(post.created) - new Date().getTimezoneOffset() * 60 * 1000,
        key,
        title,
        content,
        image,
        root_title: post.root_title,
        description,
        active_reposts: post.reblogged_by,
        comments: post.children,
        tags: metadata_tags,
        author: post.author,
        category: post.category,
        dollar_payout,
        permlink: post.permlink,
        updated: post.active,
        url: post.url,
        active_votes: post.active_votes,
        positive_votes,
        negative_votes,
        voting_ratio,
        responsabilities,
        language: metadata_language,
        app: app,
    };
}

function _format_transaction(transaction) {

    const formatted_transaction = {
        id: transaction[1].trx_id,
        transaction_number: transaction[0],
        fee: 0,
        timestamp: new Date(transaction[1].timestamp) - new Date().getTimezoneOffset() * 60 * 1000,
        send_from: transaction[1].op[1].from,
        send_from_public_key: null,
        send_to: transaction[1].op[1].to,
        amount_crypto: transaction[1].op[1].amount.split(" ")[0],
        memo: transaction[1].op[1].memo,
        crypto_id: transaction[1].op[1].amount.split(" ")[1] === "HIVE" ? "hive": "hive_dollar",
    };

    return formatted_transaction;
}

function cached_lookup_hive_accounts(input, limit, callback_function) {

    input = input.replace("@", "");
    limit = Math.max(Math.min(25, limit), 0);

    _cache_data(
        hive_queries_db,
        60 * 1000,
        "lookup_hive_accounts-input-"+input+"-limit-"+limit,
        lookup_hive_accounts,
        {input, limit},
        callback_function
    );
}

function lookup_hive_accounts(parameters, callback_function) {

    const {input, limit} = parameters;
    hiveJS.api.lookupAccounts(input, limit, callback_function);
}

function cached_lookup_hive_accounts_name(name, callback_function) {

    name = name.replace("@", "");

    _cache_data(
        hive_accounts_db,
        60 * 1000,
        "hive_account-name-@"+name,
        lookup_hive_accounts_name,
        {name},
        callback_function
    );
}

function lookup_hive_accounts_name(parameters, callback_function) {

    const { name } = parameters;

    hiveJS.api.lookupAccountNames([name], function (error, results){

        if(!error) {

            results = results.map(function(account){

                account = _format_account(account);
                return account;
            });

            callback_function(error, results[0]);

        }else {

            callback_function(error, null);
        }
    });
}

function cached_lookup_hive_accounts_with_details(input, limit, callback_function) {

    cached_lookup_hive_accounts(input, limit, function(error, names) {

        if(!error) {

            let accounts = [];
            names.forEach((name) => {

                cached_lookup_hive_accounts_name(name, (err, res) => {

                    if(err) {

                        callback_function("Error accounts can not be found", null)
                    }else {

                        accounts.push(res);
                        if(accounts.length === names.length){

                            callback_function(null, accounts);
                        }
                    }
                });
            });
        }else {

            callback_function(error, null);
        }
    });
}

function _get_hive_account_keys(username = "", master_key = "") {

    const key_result = hiveJS.auth.getPrivateKeys(username, master_key, ['posting', 'active', 'owner', 'memo']);

    const keys = {
        posting_private_key: key_result.posting,
        posting_public_key: key_result.postingPubKey,
        active_private_key: key_result.active,
        active_public_key: key_result.activePubkey,
        owner_private_key: key_result.owner,
        owner_public_key: key_result.ownerPubkey,
        memo_private_key: key_result.memo,
        memo_public_key: key_result.memoPubkey
    };

    return keys;
}


function get_hive_account_keys(username = "", master_key = "", callback_function) {

    // Get private keys
    function process_public_account_callback(error, result){

        if(!error && typeof result[0] !== "undefined") {

            let account = result[0];
            const keys = _get_hive_account_keys(username, master_key);

            // Verify private and public key match (password)
            if(keys.memo_public_key === account.memo_key) {

                callback_function(null, keys);

            }else {

                callback_function("Wrong password", false);
            }

        }else {

            callback_function("Non existing account", false);
        }
    }

    // Get public account
    lookup_hive_accounts_name([username], process_public_account_callback);
}

function get_hive_send_transaction_info() {

    return {
        max_message_length: 300,
        average_transaction_time: 6 * 3 * 1000,
    };
}

function get_hive_address_by_username(username) {

    return "" + username;
}

function cached_get_hive_account_balance_by_username(parameters, callback_function) {

    const { hive_username, coin_id } = parameters;

    if(typeof hive_username === "undefined" || hive_username === null || hive_username === "") {

        callback_function(null, 0);

    }else {

        cached_lookup_hive_accounts_name([hive_username], (err, res) => {

            if(err && typeof res[0] === "undefined") {

                callback_function(err, null);
            }else {

                const acc = res[0];

                if(coin_id === "hive_dollar") {

                    callback_function(null, acc.wallet.hbd + acc.wallet.saved_hbd);
                }else {

                    callback_function(null, acc.wallet.hive + acc.wallet.saved_hive);
                }

            }
        });

    }
}

function get_hive_account_transactions_by_username(parameters, callback_function) {

    const {username, after_transaction_number, coin_id} = parameters;

    const op = ChainTypes.operations
    const wallet_operations_bitmask = makeBitMaskFilter([
        op.transfer
    ]);

    hiveJS.api.getAccountHistory(username, after_transaction_number, 100, ...wallet_operations_bitmask, function(err, result) {

        if(!err && result) {

            const trxs = result.map(function(trx){

                return _format_transaction(trx);
            }).filter(function(trx){

                return trx.crypto_id === coin_id;
            }).sort(function(a, b){

                return a.timestamp - b.timestamp;
            });

            callback_function(null, trxs);
        }else {

            callback_function("Can't get latest transactions of " + coin_id, null);
        }
    });

}

function send_hive_transaction(hive_username, hive_password, address, amount, coin_id, memo, callback_function) {

    const { active_private_key } = _get_hive_account_keys(hive_username, hive_password);
    const asset = coin_id === "hive" ? "HIVE": "HBD";
    const amount_formatted = hiveJS.formatter.amount(parseFloat(amount), asset);

    hiveJS.broadcast.transfer(active_private_key, hive_username, address, amount_formatted, memo, function(err, result) {

        if(!err) {

            callback_function(null, true);
        }else {

            const message = err.data.code === 10 ?
                "Not enough funds.":
                err.cause.message;

            callback_function(message, null);
        }
    });

}

function estimate_hive_transaction_fee(hive_username, hive_password, address, amount, coin_id, memo, callback_function) {

    callback_function(null, 0);

}

function get_hive_private_key(hive_username, hive_password) {

    const { owner_private_key } = _get_hive_account_keys(hive_username, hive_password);
    return owner_private_key;
}

function get_hive_public_key(hive_username, hive_password) {

    const { owner_public_key } = _get_hive_account_keys(hive_username, hive_password);
    return owner_public_key;
}

function cached_get_hive_post(parameters, callback_function) {

    const force_query = parameters.force_query || false;
    let { author, permlink } = parameters;
    author = author.replace("@", "");

    _cache_data(
        hive_posts_db,
        force_query ? 0: 5 * 60 * 1000,
        "author-@"+author+"_permlink-"+permlink,
        get_hive_post,
        { author, permlink },
        callback_function
    );
}

function get_hive_post(parameters, callback_function) {

    let {author, permlink} = parameters;

    hiveJS.api.getContent(author, permlink, function (err, data) {

        if(data) {

            const post = _format_post(data);
            callback_function(null, post);
        }else {

            callback_function("Cannot get this post", null);
        }
    });
}

function cached_get_hive_posts(parameters, callback_function) {

    function pre_callback_function(err, data) {

        if(data) {

            let post_processed = 0;
            let posts = [];

            data.posts.forEach((p) => {

                cached_get_hive_post({author: p.author, permlink: p.permlink}, function(err2, data2) {

                    if(!err2 && data2) {

                        posts.push(data2);
                    }

                    post_processed++;

                    if(post_processed === data.posts.length) {

                        data.posts = posts;
                        callback_function(null, data);
                    }
                });
            });

        }else {

            callback_function("Cannot get more posts", null);
        }
    }

    let { limit, tag, sorting, start_author, start_permlink } = parameters;

    _cache_data(
        hive_queries_db,
        12 * 1000,
        "get_hive_posts-tag"+tag+"-sorting-"+sorting+"-author"+start_author+"permlink-"+start_permlink+"-limit"+limit,
        get_hive_posts,
        { limit, tag, sorting, start_author, start_permlink },
        pre_callback_function
    );
}

function get_hive_posts(parameters, callback_function) {

    let { limit, tag, sorting, start_author, start_permlink } = parameters;
    let query = { limit, tag, start_author, start_permlink };

    let fun = function(){};

    switch (sorting.toUpperCase()) {

        case "TRENDING":
            fun = hiveJS.api.getDiscussionsByTrending;
            break;
        case "HOT":
            fun = hiveJS.api.getDiscussionsByHot;
            break;
        case "ACTIVE":
            fun = hiveJS.api.getDiscussionsByHot;
            break;
        case "CREATED":
            fun = hiveJS.api.getDiscussionsByCreated;
            break;
    }

    fun(query, function(err, data) {

        if(data) {

            let posts = [];
            data.forEach((p) => {

                const pn = _format_post(p);
                if(pn) {

                    _cache_data(
                        hive_posts_db,
                        5 * 60 * 1000,
                        "author-@"+pn.author+"_permlink-"+pn.permlink,
                        function (post) {
                            return post;
                        },
                        {post: pn},
                        function (){}
                    );
                    posts.push(pn);
                }
            });

            posts = posts.map((p) => {return {author: p.author, permlink: p.permlink}});
            callback_function(err, {posts, end_author: data[data.length-1].author, end_permlink: data[data.length-1].permlink});
        }else {

            callback_function("Cannot get more posts", null);
        }
    });
}

function post_hive_pixel_art(title, image, description, tags, metadata, username, master_key, callback_function) {

    tags.splice(tags.indexOf("pixel-art"), 1);

    const permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase() + "-crypto-red";
    const body =
        description + "\n\n" +
        "![" + tags[0] + "](" + image + ")\n\n" +
        "--- \n\n" +
        "Made with the [pixel art editor](https://wallet.crypto.red/pixel) of wallet.crypto.red ([view post in W.C.R.](https://wallet.crypto.red/gallery/created/@" + username + "/" + permlink + ")).";

    tags.unshift("pixel-art");

    post_hive_post(title, body, tags, metadata, username, permlink, master_key, callback_function);
}

function post_hive_post(title, body, tags, metadata, username, permlink, master_key, callback_function) {

    const APPLICATION_RELEASE = "CRYPTO.RED 0.0.4";
    const REWARD_BENEFICIARIES = [
        {
            "account": "crypto.red",
            "weight": 2500
        }
    ];

    const category = tags[0];
    const md = {
        tags: tags,
        image: [],
        app: APPLICATION_RELEASE,
        ...metadata,
    };

    function option_callback_function(error, result) {

        const max_accepted_payout = "1000000.000 HBD";
        const percent_hive_dollars = 10000;
        const allow_votes = true;
        const allow_curation_rewards = true;
        const extensions = [
            [
                0,
                {
                    "beneficiaries": REWARD_BENEFICIARIES
                }
            ]
        ];



        if(error) {

            callback_function(error, null);
        }else {

            hiveJS.broadcast.commentOptions(
                _get_hive_account_keys(username, master_key).posting_private_key,
                username,
                permlink,
                max_accepted_payout,
                percent_hive_dollars,
                allow_votes,
                allow_curation_rewards,
                extensions,
                callback_function
            );
        }
    }

    if(username && master_key) {

        hiveJS.broadcast.comment(
            _get_hive_account_keys(username, master_key).posting_private_key,
            '',
            category,
            username,
            permlink,
            title,
            body,
            md,
            option_callback_function
        );
    }else {

        callback_function("login", null);
    }
}

function vote_on_hive_post(author, permlink, weight, username, master_key, callback_function) {

    hiveJS.broadcast.vote(
        _get_hive_account_keys(username, master_key).posting_private_key,
        username,
        author,
        permlink,
        weight * 10000,
        function(err, result) {

            if(!err) {

                console.log(result);
                callback_function(null, true);
            }else {

                callback_function("Cannot vote on this post right now", null);
            }
    });
}

function cached_search_on_hive(terms = "", authors = [], tags = ["pixel-art"], sorting = "relevance", page = "1", callback_function) {

    function pre_callback_function(err, data) {

        if(!err && data) {

            try {

                let all_posts = [];
                let post_processed = 0;

                if(data.results.length === 0) {

                    callback_function(null, {posts: [], pages: 1, page: 1});
                }

                data.results.forEach((post) => {

                    const { author, permlink } = post;
                    cached_get_hive_post({author, permlink}, (err_sp, res_sp) => {

                        post_processed++;

                        if(res_sp) {

                            all_posts.push(res_sp);
                        }

                        if(data.results.length === post_processed) {

                            if(all_posts.length === 0 && data.pages > page){

                                search_on_hive(terms, authors, tags, sorting, page+1, callback_function);
                            }else {

                                callback_function(null, {posts: all_posts, pages: data.pages, page});
                            }
                        }
                    });

                });
            }catch(error) {

                callback_function("Unreadable response from server", null);
            }
        }else {

            callback_function("Response from server unavailable", null);
        }

    }

    _cache_data(
        hive_queries_db,
        1 * 60 * 1000,
        encodeURI("search_on_hive-terms"+terms+"-author-"+authors.join(",")+"-tags-"+tags.join(",")+"-sorting-"+sorting+"-page-"+page),
        search_on_hive,
        { terms, authors, tags, sorting, page },
        pre_callback_function
    );
}

function search_on_hive(parameters, callback_function) {

    let { terms, authors, tags, sorting, page } = parameters;

    /* TAGS */
    let tags_in_terms = [];
    const tag_text_regex = /tag(s)?:[a-zA-Z0-9-\,]+/gm;
    terms = terms.replace(tag_text_regex, function(match){

        const tags_list = match.replaceAll(/tag(s)?:/gm, "").split(",");
        tags_in_terms = tags_in_terms.concat(tags_list);

        return ""; //tags_list.join(" ").replaceAll("pixel-art", "");
    });
    const all_tags = [...new Set([...tags, ...tags_in_terms])];

    /* AUTHORS */
    let authors_in_terms = [];
    const author_text_regex= /\@[a-zA-Z0-9\-\.]+/gm
    terms = terms.replace(author_text_regex, function(match){

        authors_in_terms.push(match.replace("@",""));
        return "";
    });
    const all_authors = [...new Set([...authors, ...authors_in_terms])];

    const query =
        (`${terms.length ? terms+" ": "* "}`+
        `${all_authors.length ? ("author:" + all_authors.join(",") + " "): ""}` +
        `tag:${all_tags.join(",")} `+
        `type:post`).replace(/\s+/g, " ");

    postJSON("https://ecency.com/search-api/search", {q: query, sort: sorting, pa:page}, (err, res) => {

        if(res) {

            let data = JSON.parse(clean_json_text(res));
                data.results = data.results.map((r) => {

                return {author: r.author, permlink: r.permlink};
            });

            callback_function(err, data);
        }else {

            callback_function(err, null)
        }
    });
}

module.exports = {
    lookup_hive_accounts: cached_lookup_hive_accounts,
    lookup_hive_accounts_name: cached_lookup_hive_accounts_name,
    lookup_hive_accounts_with_details: cached_lookup_hive_accounts_with_details,
    get_hive_account_keys: get_hive_account_keys,
    get_hive_send_transaction_info: get_hive_send_transaction_info,
    get_hive_address_by_username: get_hive_address_by_username,
    get_hive_account_balance_by_username: cached_get_hive_account_balance_by_username,
    get_hive_account_transactions_by_username: get_hive_account_transactions_by_username,
    send_hive_transaction: send_hive_transaction,
    estimate_hive_transaction_fee: estimate_hive_transaction_fee,
    get_hive_private_key: get_hive_private_key,
    get_hive_public_key: get_hive_public_key,
    get_hive_posts: cached_get_hive_posts,
    get_hive_post: cached_get_hive_post,
    post_hive_post: post_hive_post,
    post_hive_pixel_art: post_hive_pixel_art,
    vote_on_hive_post: vote_on_hive_post,
    search_on_hive: cached_search_on_hive,
};