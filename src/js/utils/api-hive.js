import hiveJS from "@hiveio/hive-js";
import { ChainTypes, makeBitMaskFilter } from "@hiveio/hive-js/lib/auth/serializer";
import sumBasic  from "node-sumbasic/src";


import PouchDB from "pouchdb";
import {postJSON} from "./load-json";
import {clean_json_text} from "./json";

import { IMAGE_PROXY_URL } from "../utils/constants";
let clean_new_db_array = [];

function clean_new_DB(name, opts) {

    if(typeof clean_new_db_array[name] !== "undefined"){

        return clean_new_db_array[name];
    }


    let maindb = new PouchDB(name, opts)

    const dbName = maindb.name;
    const tmpDBName = "tmp_"+maindb.name;
    const deleteFilter = (doc, req) => !doc._deleted;

    //  CLEANUP
    //  delete a database with tmpdb name
    return new PouchDB(tmpDBName).destroy()
        //  create a database with tmpdb name
        .then(() => Promise.resolve(new PouchDB(tmpDBName)))
        //  replicate original database to tmpdb with filter
        .then((tmpDB) => new Promise((resolve, reject) => {
            maindb.replicate.to(tmpDB, { filter: deleteFilter })
                .on('complete', () => { resolve(tmpDB) })
                .on('denied', reject)
                .on('error', reject)
        }))
        //  destroy the original db
        .then((tmpDB) => {

            delete clean_new_db_array[name];
            return maindb.destroy().then(() => Promise.resolve(tmpDB))
        })
        //  create the original db
        .then((tmpDB) => new Promise((resolve, reject) => {

            try {
                resolve({ db: new PouchDB(dbName, opts), tmpDB: tmpDB })
            } catch (e) {
                reject(e)
            }
        }))
        //  replicate the tmpdb to original db
        .then(({db, tmpDB}) => {
            return tmpDB.replicate.to(db).then(() => Promise.resolve({db: db, tmpDB: tmpDB}))
        })
        //  destroy the tmpdb
        .then(({db, tmpDB}) => {
            return tmpDB.destroy().then(() => {

                clean_new_db_array[name] = db;
                return clean_new_db_array[name];
            });
        })
        .catch((err) => { console.log(err) });

}

const hive_posts_db = new PouchDB("hive_posts_db", {deterministic_revs: true, revs_limit: 0, auto_compaction: false});
const hive_accounts_db = new PouchDB("hive_accounts_db", {deterministic_revs: true, revs_limit: 0, auto_compaction: false});
const hive_queries_db = new PouchDB("hive_queries_db", {deterministic_revs: true, revs_limit: 0, auto_compaction: false});

import React from "react";
import AngryEmojiSvg from "../twemoji/react/1F624";
import HearthEmojiSvg from "../twemoji/react/2764";
import TongueEmojiSvg from "../twemoji/react/1F60B";
import SunglassesEmojiSvg from "../twemoji/react/1F60E";
import ConfidentEmojiSvg from "../twemoji/react/1F60E";
import TongueWinkEmojiSvg from "../twemoji/react/1F61C";
import TongueCrossEmojiSvg from "../twemoji/react/1F61D";
import EmbarrassedEmojiSvg from "../twemoji/react/1F62C";
import CryingEmojiSvg from "../twemoji/react/1F62D";
import HappyEmojiSvg from "../twemoji/react/1F600";
import WinkEmojiSvg from "../twemoji/react/1F609";
import LaughingEmojiSvg from "../twemoji/react/1F602";
import LaughingCrossEmojiSvg from "../twemoji/react/1F606";
import AngelEmojiSvg from "../twemoji/react/1F607";
import NeutralEmojiSvg from "../twemoji/react/1F610";
import KissEmojiSvg from "../twemoji/react/1F618";
import DrunkEmojiSvg from "../twemoji/react/1F635200D1F4Ab";
import PerplexEmojiSvg from "../twemoji/react/1F914";

import get_svg_in_b64 from "../utils/svgToBase64";

const angry_emoji = get_svg_in_b64(<AngryEmojiSvg />);
const hearth_emoji = get_svg_in_b64(<HearthEmojiSvg />);
const tongue_emoji = get_svg_in_b64(<TongueEmojiSvg />);
const sunglasses_emoji = get_svg_in_b64(<SunglassesEmojiSvg />);
const confident_emoji = get_svg_in_b64(<ConfidentEmojiSvg />);
const tongue_wink_emoji = get_svg_in_b64(<TongueWinkEmojiSvg />);
const tongue_cross_emoji = get_svg_in_b64(<TongueCrossEmojiSvg />);
const embarrassed_emoji = get_svg_in_b64(<EmbarrassedEmojiSvg />);
const crying_emoji = get_svg_in_b64(<CryingEmojiSvg />);
const happy_emoji = get_svg_in_b64(<HappyEmojiSvg />);
const wink_emoji = get_svg_in_b64(<WinkEmojiSvg />);
const laughing_emoji = get_svg_in_b64(<LaughingEmojiSvg />);
const laughing_cross_emoji = get_svg_in_b64(<LaughingCrossEmojiSvg />);
const angel_emoji = get_svg_in_b64(<AngelEmojiSvg />);
const neutral_emoji = get_svg_in_b64(<NeutralEmojiSvg />);
const kiss_emoji = get_svg_in_b64(<KissEmojiSvg />);
const drunk_emoji = get_svg_in_b64(<DrunkEmojiSvg />);
const perplex_emoji = get_svg_in_b64(<PerplexEmojiSvg />);

import _cache_data from "../utils/cache-data";

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
    parsed_json_metadata.profile.display_name = typeof parsed_json_metadata.profile.display_name === "undefined" ? "": parsed_json_metadata.profile.display_name;
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
        display_name: parsed_json_metadata.profile.display_name,
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

        const url = "/newest/search/#" + match.toLowerCase().replace("#", "").replace(" ", "");
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

function postprocess_text(content = "") {

    /* RENDER EMOJI */
    content = content.replace(/ (\:\-?\|) /gm, ` ![neutral emoji](${neutral_emoji}) `);
    content = content.replace(/ (\:\-?\))|(\:\-?\])|(\:\-?\}) /gm, ` ![happy emoji](${happy_emoji}) `);
    content = content.replace(/ (\:\'\-?\))|(\:\'\-?\])|(\:\'\-?\}) /gm, ` ![laughing emoji](${laughing_emoji}) `);
    content = content.replace(/ (\:\-?\()|(\:\-?\[)|(\:\-?\{) /gm, ` ![angry emoji](${angry_emoji}) `);
    content = content.replace(/ (\:\'\-?\()|(\:\'\-?\[)|(\:\'\-?\{) /gm, ` ![crying emoji](${crying_emoji}) `);
    content = content.replace(/ (\:\-?[D])|([x]\-?D)|([X]\-?[D]) /gm, ` ![laughing emoji](${laughing_emoji}) `);
    //content = content.replace(/ (\:\-?O)|(8\-0)/gm, `![_emoji](${_emoji}) `);
    content = content.replace(/ (\:\-?\*) /gm, `![laughing emoji](${kiss_emoji}) `);
    content = content.replace(/ (\;\-?\))|(\;\-?\])|(\;\-?\}) /gm, ` ![wink emoji](${wink_emoji}) `);
    content = content.replace(/ (\:\-?[P])|(\:\-?[b]) /gm, ` ![tongue emoji](${tongue_emoji}) `);
    content = content.replace(/ (\;\-?[P])|(\;\-?[b]) /gm, ` ![tongue wink emoji](${tongue_wink_emoji}) `);
    content = content.replace(/ ([x]\-?[p])|([X]\-?[P]) /gm, ` ![tongue cross emoji](${tongue_cross_emoji}) `);
    content = content.replace(/ (\:\-?\/)|(\:\-?\\)|(\=\\)|(\=\/)|(\:([s]|[L])) /gm, ` ![tongue cross emoji](${perplex_emoji}) `);
    content = content.replace(/ (\:\-?\|) /gm, ` ![perplex emoji](${perplex_emoji}) `);
    content = content.replace(/ (\:\$)|(\:\/\/(3|\))) /gm, ` ![embarrassed emoji](${embarrassed_emoji}) `);
    //content = content.replace(/ (\:\-?([X]|\#|\&))/gm, ` ![happy_emoji](${happy emoji}) `);
    content = content.replace(/ ((0|O)\:\-?(3|\))) /gm, ` ![happy emoji](${angel_emoji}) `);
    //content = content.replace(/ ((\>|\}|3)\:\-?(\)|3))/gm, ` ![happy_emoji](${happy emoji}) `);
    content = content.replace(/ (\|\;\-\))|(\|\-O)|(B\-) /gm, ` ![sunglasses emoji](${sunglasses_emoji}) `);
    content = content.replace(/ (\:\-?(J|j)) /gm, ` ![confident emoji](${confident_emoji}) `);
    //content = content.replace(/ (\%\-?\))/gm, ` ![confused](${confused}) `);
    //content = content.replace(/ (\:E)/gm, ` !(nervous)[${nervous}) `);

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

    let summary = "";

    try { summary = sumBasic(description.split("\n"), 20); } catch(e) {

        summary = description.substring(0, 256);
    }

    const title = ` ${post.title} `;
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
        summary,
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

function cached_lookup_hive_account_reputation_by_name(name, callback_function) {

    name = name.replace("@", "");

    _cache_data(
        hive_accounts_db,
        5 * 60 * 1000,
        "hive_account-reputation-@"+name,
        lookup_hive_account_reputation_by_name,
        {name},
        callback_function
    );
}

function lookup_hive_account_reputation_by_name(parameters, callback_function) {

    const { name } = parameters;

    hiveJS.api.getAccountReputations(name, 1, function(error, results) {

        if(!error && typeof results[0] !== "undefined") {

            const reputation = hiveJS.formatter.reputation(results[0].reputation);
            callback_function(null, reputation);
        }else {

            callback_function("Can not get user's reputation", null);
        }
    });
}

function cached_lookup_hive_account_follow_count_by_name(name, callback_function) {

    name = name.replace("@", "");

    _cache_data(
        hive_accounts_db,
        5 * 60 * 1000,
        "hive_account-follow_count-@"+name,
        lookup_hive_account_follow_count_by_name,
        {name},
        callback_function
    );
}

function lookup_hive_account_follow_count_by_name(parameters, callback_function) {

    const { name } = parameters;

    hiveJS.api.getFollowCount(name,function(error, results) {

        if(!error && typeof results !== "undefined") {

            callback_function(null, {followers: results.follower_count, following: results.following_count});
        }else {

            callback_function("Can not get user's follow count", null);
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

        if(!error && typeof result !== "undefined") {

            let account = result;
            const keys = _get_hive_account_keys(username, master_key);
            console.log(keys);

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
    cached_lookup_hive_accounts_name(username, process_public_account_callback);
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

        cached_lookup_hive_accounts_name(hive_username, (err, res) => {

            if(err && typeof res === "undefined") {

                callback_function(err, null);
            }else {

                const acc = res;

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
    const force_then = parameters.force_then || false;
    const cached_query = parameters.cached_query || false;

    let { author, permlink } = parameters;
    author = author.replace("@", "");

    _cache_data(
        hive_posts_db,
        cached_query ? 7 * 24 * 60 * 60 * 1000: force_query ? 0: 1 * 60 * 1000,
        "author-@"+author+"_permlink-"+permlink,
        get_hive_post,
        { author, permlink },
        callback_function
    );

    if(force_then) {

        _cache_data(
            hive_posts_db,
            0,
            "author-@"+author+"_permlink-"+permlink,
            get_hive_post,
            { author, permlink },
            callback_function
        );
    }
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


    const force_query = parameters.force_query || false;
    const force_then = parameters.force_then || false;
    const cached_query = parameters.cached_query || false;

    function pre_callback_function(err, data, is_force_then = false) {

        if(data) {

            let post_processed = 0;
            let posts = [];
            let posts_errors = 0;

            data.posts.forEach((p) => {

                cached_get_hive_post({force_query: force_query || is_force_then, cached_query: cached_query && !is_force_then, author: p.author, permlink: p.permlink}, function(err2, data2) {

                    if(!err2 && data2) {

                        posts.push(data2);
                        posts_errors++;
                    }

                    post_processed++;

                    if(post_processed === data.posts.length) {

                        data.posts = posts;
                        callback_function(null, data);

                        if(is_force_then && force_then && !force_query) {

                            pre_callback_function(err, data, true)
                        }
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

    let fun = () => {};

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

    fun(query, (err, data) => {

        if(!err && Array.isArray(data)) {

            let posts = [];
            data.forEach((p) => {

                const pn = _format_post(p);
                if(pn) {

                    _cache_data(
                        hive_posts_db,
                        1 * 60 * 1000,
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

            if(typeof data[data.length-1] !== "undefined") {
                if(posts.length) {

                    callback_function(err, {posts, end_author: data[data.length-1].author, end_permlink: data[data.length-1].permlink});
                }else{

                    get_hive_posts({ limit, tag, sorting, start_author: data[data.length-1].author, start_permlink: data[data.length-1] }, callback_function);
                }
            }else {

                callback_function("No end of the post list known", null);
            }

        }else {

            callback_function("Cannot get more posts", null);
        }
    });
}

function unlogged_post_hive_pixel_art(title, image, description, tags, metadata, username, posting_key, callback_function) {

    post_hive_pixel_art(title, image, description, tags, metadata, username, "", callback_function, posting_key);
}

function post_hive_pixel_art(title, image, description, tags, metadata, username, master_key, callback_function, posting_key = null) {

    tags.splice(tags.indexOf("pixel-art"), 1);

    const permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase() + "-crypto-red";
    const body =
        description + "\n\n" +
        "![" + tags[0] + "](" + image + ")\n\n" +
        "--- \n\n" +
        "Made with the [pixel art editor](https://wallet.crypto.red/pixel) of wallet.crypto.red ([view post in W.C.R.](https://wallet.crypto.red/gallery/created/@" + username + "/" + permlink + ")). Free your mind for art and join us, pixel art is art.";

    tags.unshift("pixel-art");

    post_hive_post(title, body, tags, metadata, username, permlink, master_key, callback_function, posting_key);
}

function post_hive_post(title, body, tags, metadata, username, permlink, master_key, callback_function, posting_key = null) {

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
                posting_key ? posting_key: _get_hive_account_keys(username, master_key).posting_private_key,
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

    if(username && (master_key || posting_key)) {

        hiveJS.broadcast.comment(
            posting_key ? posting_key: _get_hive_account_keys(username, master_key).posting_private_key,
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

function unlogged_vote_on_hive_post(author, permlink, weight, username, posting_key, callback_function) {

    vote_on_hive_post(author, permlink, weight, username, "", callback_function, posting_key);
}

function vote_on_hive_post(author, permlink, weight, username, master_key, callback_function, posting_key = null) {

    hiveJS.broadcast.vote(
        posting_key ? posting_key: _get_hive_account_keys(username, master_key).posting_private_key,
        username,
        author,
        permlink,
        weight * 10000,
        function(err, result) {

            if(!err) {

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
        encodeURIComponent("search_on_hive-terms"+terms+"-author-"+authors.join(",")+"-tags-"+tags.join(",")+"-sorting-"+sorting+"-page-"+page),
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

    /* HASHTAGS */
    let hashtags_in_terms = [];
    const hashtag_text_regex = /#[a-zA-Z0-9-]+/gm;
    terms = terms.replace(hashtag_text_regex, function(match){

        match = match.replaceAll("#", "");
        hashtags_in_terms.push(match);

        return "";
    });

    const all_tags = [...new Set([...tags, ...tags_in_terms, ...hashtags_in_terms])];

    /* AUTHORS */
    let authors_in_terms = [];
    const author_text_regex= /\@[a-zA-Z0-9\-\.]+/gm
    terms = terms.replace(author_text_regex, function(match){

        authors_in_terms.push(match.replace("@",""));
        return "";
    });
    const all_authors = [...new Set([...authors, ...authors_in_terms])];

    const query =
        (`${terms.replaceAll(/ /gm, "").length ? terms + " ": "* "}`+
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
    lookup_hive_account_reputation_by_name: cached_lookup_hive_account_reputation_by_name,
    lookup_hive_account_follow_count_by_name: cached_lookup_hive_account_follow_count_by_name,
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
    get_hive_posts: get_hive_posts,
    cached_get_hive_posts: cached_get_hive_posts,
    get_hive_post: get_hive_post,
    cached_get_hive_post: cached_get_hive_post,
    post_hive_post: post_hive_post,
    post_hive_pixel_art: post_hive_pixel_art,
    unlogged_post_hive_pixel_art: unlogged_post_hive_pixel_art,
    vote_on_hive_post: vote_on_hive_post,
    unlogged_vote_on_hive_post: unlogged_vote_on_hive_post,
    search_on_hive: search_on_hive,
    cached_search_on_hive: cached_search_on_hive,
    postprocess_text: postprocess_text,
};