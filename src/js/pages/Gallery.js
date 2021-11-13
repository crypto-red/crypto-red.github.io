import React from "react";
import ReactDOM from "react-dom";
import { withStyles } from "@material-ui/core/styles";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";

import ClockIcon from "../icons/Clock";
import TimeIcon from "../icons/Time";
import HotIcon from "../icons/Hot";
import EyeIcon from "../icons/Eye";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

import { Masonry, CellMeasurer, CellMeasurerCache, createMasonryCellPositioner } from "react-virtualized";

import PixelDialogPost from "../components/PixelDialogPost";
import PixelArtCard from "../components/PixelArtCard";
import AccountDialogProfileHive from "../components/AccountDialogProfileHive";
import MenuReactionPixelPost from "../components/MenuReactionPixelPost";
import MenuVotesPixelPost from "../components/MenuVotesPixelPost";

import { search_on_hive, get_hive_posts, get_hive_post, vote_on_hive_post } from "../utils/api"
import actions from "../actions/utils";
import api from "../utils/api";
import {HISTORY} from "../utils/constants";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {t} from "../utils/t";
import Grow from "@material-ui/core/Grow";
import ShufflingSpanText from "../components/ShufflingSpanText";

class MasonryExtended extends Masonry {
    _getEstimatedTotalHeight() {
        const {cellCount, cellMeasurerCache, width} = this.props;

        const estimatedColumnCount = Math.floor(
            width / cellMeasurerCache.defaultWidth,
        );

        const estimateTotalHeight = this._positionCache.estimateTotalHeight(
            cellCount,
            estimatedColumnCount,
            cellMeasurerCache.defaultHeight,
        );

        return isFinite(estimateTotalHeight) ? estimateTotalHeight : 0;
    }
}

const styles = theme => ({
    root: {
        zindex: 1201,
        width: "100%",
        height: "calc(100vh - 56px)",
        [theme.breakpoints.up("md")]: {
            height: "calc(100vh - 64px)",
            width: "calc(100% - 256px)",
        },
        display: "flex",
        position: "fixed",
        overflow: "hidden",
        backgroundColor: theme.palette.primary.darker,
    },
    AppBar: {
        position: "relative",
        zIndex: 1202,
        [theme.breakpoints.up("md")]: {
            borderRadius: 4
        }
    },
    appBarContainer: {
        position: "fixed",
        width: "100%",
        zIndex: "1300",
        [theme.breakpoints.up("md")]: {
            margin: theme.spacing(2),
            right: theme.spacing(0),
            width: "calc(100% - 288px)"

        },
    },
    tabs: {
        "& .MuiTab-root": {
            minWidth: "auto"
        },
        "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.contrastText
        }
    },
    tab: {
        paddingTop: 14,
        [theme.breakpoints.up("md")]: {
            fontWeight: "bold",
            color: theme.palette.disabled,
            "&.Mui-selected": {
                color: "inherit"
            },
            minHeight: "inherit",
            "& .MuiTab-wrapper": {
                flexDirection: "inherit",
            },
            "& svg.MuiSvgIcon-root:first-child": {
                margin: "0px 12px 0px 0px",
            }
        },
        [theme.breakpoints.down("sm")]: {
            minHeight: "inherit",
            "& .MuiTab-wrapper": {
                flexDirection: "inherit",
            },
            "& .MuiTab-wrapper *": {
                display: "none"
            },
            "& .MuiTab-wrapper *:first-child": {
                display: "inherit"
            }
        },
    },
    masonry: {
        opacity: 1,
        transition: "opacity 0ms cubic-bezier(0.4, 0, 0.2, 1) 25ms",
        overflow: "overlay",
        "& > .ReactVirtualized__Masonry": {
            position: "absolute",
            padding: "88px 16px 32px 16px",
            margin: 0,
            scrollBehavior: "smooth",
            overflow: "overlay",
            "& > .ReactVirtualized__Masonry__innerScrollContainer": {
                overflow: "visible !important",
                transform: "translateZ(0px)",
            }
        }
    },
    masonryHidden: {
        opacity: 0,
        transition: "opacity 0 cubic-bezier(0.4, 0, 0.2, 1) 0",
        overflow: "overlay",
        "& > .ReactVirtualized__Masonry": {
            position: "absolute",
            padding: "88px 16px 32px 16px",
            margin: 0,
            scrollBehavior: "smooth",
            overflow: "overlay",
            "& > .ReactVirtualized__Masonry__innerScrollContainer": {
                overflow: "visible !important",
                transform: "translateZ(0px)",
            }
        }
    },
    noPosts: {
        width: "100%",
        display: "flex",
        padding: "88px 16px 32px 16px",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        color: "#d7dbffbb"
    },
    reactionMenu: {
        "& .MuiList-root": {
            padding: 0,
        },
        "& .MuiMenu-paper": {
            overflow: "visible !important",
        },
    },
    reactionMenuIconButton: {
        width: 48,
        height: 48,
        transform: "scale(1)",
        transition: "transform 225ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
            transform: "scale(1.5)",
        }
    },
    fab: {
        position: "fixed",
        backgroundColor: theme.palette.primary.action,
        color: theme.palette.primary.contrastText,
        transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 204ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 136ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important",
        "&:hover": {
            backgroundColor: theme.palette.primary.actionLighter,
        },
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        "& svg": {
            marginRight: 4
        }
    },
});

const SORTING_MODES = ["created", "active", "hot", "trending"];
const SEARCH_SORTING_MODES = ["newest", "relevance", "popularity"];

class Gallery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            classes: props.classes,
            pathname: props.pathname || "",
            _previous_pathname: "",
            _sorting_tab_index: SORTING_MODES.indexOf(props.pathname.split("/")[2] || 0),
            _post_author: (props.pathname.split("/")[3] || "").includes("@") ? props.pathname.split("/")[3]: (props.pathname.split("/")[5] || "").includes("@") ? props.pathname.split("/")[5]: null,
            _post_permlink: (props.pathname.split("/")[3] || "").includes("@") ? props.pathname.split("/")[4] || null: (props.pathname.split("/")[5] || "").includes("@") ? props.pathname.split("/")[6] || null: null,
            _is_search_mode: Boolean(props.pathname.split("/")[3] === "search"),
            _search_mode_query: props.pathname.split("/")[3] === "search" ? decodeURI(props.pathname.split("/")[4] || ""): "",
            _search_sorting_tab_index: SEARCH_SORTING_MODES.indexOf(props.pathname.split("/")[2] || 0),
            _history: HISTORY,
            _sorting_modes: SORTING_MODES,
            _selected_locales_code: null,
            _selected_currency: null,
            _hbd_market: null,
            _logged_account: {},
            _search_sorting_modes: SEARCH_SORTING_MODES,
            _search_mode_query_page: 0,
            _search_mode_query_pages: 1,
            _post: null,
            _loading_posts: false,
            _updating_dimension: false,
            _post_closed_at: 0,
            _selected_post_index: 0,
            _scrolling_reset_time_interval: 300,
            _min_col_width: 10,
            _max_col_width: 1000,
            _root_width: 0,
            _root_height: 0,
            _root: null,
            _window_width: 0,
            _window_height: 0,
            _posts: [],
            _average_img_ratio: 1,

            _gutter_size: 16,
            _start_author: null,
            _start_permlink: null,
            _column_count: 4,
            _column_width: 356,
            _load_more_threshold: 4000,
            _overscan_by_pixels: 3000,
            _cell_positioner: null,
            _masonry: null,

            _cell_measurer_cache: new CellMeasurerCache({
                defaultHeight: 0,
                defaultWidth: 0,
                fixedWidth: true,
                fixedHeight: false
            }),

            _scroll_top: 0,
            _top_scroll_of_el_by_index: [],
            _height_of_el_by_index: [],

            _reaction_click_event: null,
            _reaction_selected_post: {},
            _reaction_voted_result: null,
            _reaction_selected_post_loading: false,

            _votes_anchor: null,
            _votes: [],

        };
    };

    componentWillReceiveProps(new_props) {

        const { _sorting_modes, _search_sorting_modes } = this.state;

        let state = {
            classes: new_props.classes,
            pathname: new_props.pathname,
            _previous_pathname: this.state.pathname,
            _sorting_tab_index: _sorting_modes.indexOf(new_props.pathname.split("/")[2] || 0),
            _post_author: (new_props.pathname.split("/")[3] || "").includes("@") ? new_props.pathname.split("/")[3]: (new_props.pathname.split("/")[5] || "").includes("@") ? new_props.pathname.split("/")[5]: null,
            _post_permlink: (new_props.pathname.split("/")[3] || "").includes("@") ? new_props.pathname.split("/")[4] || null: (new_props.pathname.split("/")[5] || "").includes("@") ? new_props.pathname.split("/")[6] || null: null,
            _is_search_mode: Boolean(new_props.pathname.split("/")[3] === "search"),
            _search_mode_query: new_props.pathname.split("/")[3] === "search" ? decodeURI(new_props.pathname.split("/")[4] || ""): "",
            _search_sorting_tab_index: _search_sorting_modes.indexOf(new_props.pathname.split("/")[2] || 0),
        };

        state._sorting_tab_index = state._sorting_tab_index === -1 ? 0: state._sorting_tab_index;
        state._search_sorting_tab_index = state._search_sorting_tab_index === -1 ? 0: state._search_sorting_tab_index;

        const sorting_changed = this.state._sorting_tab_index !== state._sorting_tab_index;
        const search_sorting_changed = this.state._search_sorting_tab_index !== state._search_sorting_tab_index;
        const search_mode_query_changed = this.state._search_mode_query !== state._search_mode_query;

        let get_post = Boolean(state._post_author && state._post_permlink && (state._post_author !== this.state._post_author || state._post_permlink !== this.state._post_permlink) && !this.state._post);
        let closed_search = Boolean(
            (!state._is_search_mode && this.state._is_search_mode && this.state._search_mode_query !== "") ||
            (state._search_mode_query === "" && this.state._search_mode_query !== "")
        );
        let closed_post = Boolean(!state._post_author && !state._post_permlink && this.state._post_author && this.state._post_permlink);

        this.setState(state, () => {

            if(get_post) {

                this._get_post();
            }else if(closed_post) {

                this._handle_pixel_dialog_post_closed();
            }

            if(closed_search || (sorting_changed && !state._is_search_mode)) {

                this.setState({_posts: [], _start_author: null, _start_permlink: null}, () => {

                    this.forceUpdate();
                    this._load_more_posts();
                });
            }else if(search_sorting_changed && state._is_search_mode) {

                this.setState({_posts: [], _start_author: null, _start_permlink: null, _search_mode_query_page: 0, _search_mode_query_pages: 1}, () => {

                    this.forceUpdate();
                    this._search_more_posts();
                });
            }else if(search_mode_query_changed && state._is_search_mode) {

                setTimeout(() => {

                    this._is_not_new_query_maybe_search_post(state._search_mode_query);
                }, 1000);
            }
        });
    }

    componentDidMount() {

        window.addEventListener("resize", this._updated_dimensions);
        ReactDOM.findDOMNode(this).addEventListener("keydown", this._handle_keydown);

        this._updated_dimensions();
        this._update_settings();

        if(this.state._is_search_mode) {

            this._search_more_posts();
        }else {

            this._load_more_posts();
        }

        if(this.state._post_author && this.state._post_permlink) {

            this._get_post();
        }
    };

    _update_settings() {

        api.get_settings(this._process_settings_query_result);
    }

    _process_settings_query_result = (error, settings) => {

        if(!error) {

            // Set new settings from query result
            const _selected_locales_code =  typeof settings.locales !== "undefined" ? settings.locales: "en-US";
            const _selected_currency = typeof settings.currency !== "undefined" ? settings.currency: "USD";

            this.setState({  _selected_locales_code, _selected_currency }, () => {

                this._is_logged();
                api.get_coins_markets(["hive_dollar"], _selected_currency.toLowerCase(), this._set_coins_markets);
            });
        }
    };

    _set_coins_markets = (error, data) => {

        if(!error && data)  {

            this.setState({_hbd_market: data[0]});
        }
    };

    _process_is_logged_result = (error, result) => {

        const _logged_account = error || !result ? {}: result;
        this.setState({_logged_account});
    };

    _is_logged = () => {

        api.is_logged(this._process_is_logged_result);
    };

    _get_post = () => {

        const { _post_author, _post_permlink } = this.state;

        if(_post_author && _post_permlink) {

            actions.trigger_loading_update(0);

            get_hive_post({author: _post_author, permlink: _post_permlink}, (err, data) => {

                if(data) {

                    this.setState({_post: data}, () => {

                        actions.trigger_loading_update(100);
                    });
                }
            });
        }
    };

    _load_more = () => {

        const {_is_search_mode} = this.state;

        if(_is_search_mode) {

            this._search_more_posts();
        }else {

            this._load_more_posts();
        }

    };

    _load_more_posts = () => {

        const { _posts, _start_author, _start_permlink, _sorting_modes, _sorting_tab_index } = this.state;
        actions.trigger_loading_update(0);
        this.setState({_loading_posts: true}, () => {

            get_hive_posts({limit: 21, tag: "pixel-art", sorting: (_sorting_modes[_sorting_tab_index] || _sorting_modes[0]), start_author: _start_author, start_permlink: _start_permlink}, (err, data) => {

                if(data.posts){

                    const posts = _start_author && _start_permlink ? _posts.concat(data.posts): data.posts;

                    this.setState({_updating_dimension: true, _loading_posts: false, _posts: posts, _start_author: data.end_author, _start_permlink: data.end_permlink}, () => {

                        this._updated_dimensions(true);
                        actions.trigger_loading_update(100);
                    });
                }else {

                    this.setState({_loading_posts: false});
                    actions.trigger_loading_update(100);
                }
            });

        });
    };

    _is_not_new_query_maybe_search_post = (search_mode_query) => {

        const { _search_mode_query, _history, pathname } = this.state;

        if(_search_mode_query === search_mode_query) {

            this.setState({_posts: [], _search_mode_query_page: 0, _search_mode_query_pages: 1}, () => {

                this.forceUpdate();
                this._search_more_posts();
                _history.push(pathname);
            });
        }
    };

    _search_more_posts = () => {

        const { _posts, _search_mode_query, _search_sorting_modes, _search_sorting_tab_index, _search_mode_query_pages } = this.state;
        let { _search_mode_query_page } = this.state;

        if(_search_mode_query_page < _search_mode_query_pages) {

            _search_mode_query_page++;

            actions.trigger_loading_update(0);
            this.setState({_loading_posts: true}, () => {

                search_on_hive(_search_mode_query, [], ["pixel-art"], (_search_sorting_modes[_search_sorting_tab_index] || _search_sorting_modes[0]), _search_mode_query_page.toString(), (err, data) => {

                    if((data || {}).posts){

                        const posts = _search_mode_query_page > 1 ? _posts.concat(data.posts): data.posts;

                        this.setState({_updating_dimension: true,_loading_posts: false, _posts: posts, _search_mode_query_pages: data.pages, _search_mode_query_page: data.page}, () => {

                            this._updated_dimensions(true);
                            actions.trigger_loading_update(100);
                        });
                    }else {

                        actions.trigger_loading_update(100);
                        this.setState({_loading_posts: false});
                    }
                });
            });
        }
    };

    componentWillUnmount() {

        window.removeEventListener("resize", this._updated_dimensions);
        ReactDOM.findDOMNode(this).removeEventListener("keydown", this._handle_keydown);
    }

    _handle_sorting_change = (event, _sorting_tab_index) => {

        const { _history, _sorting_modes } = this.state;

        const new_pathname = "/gallery/" + (_sorting_modes[_sorting_tab_index] || _sorting_modes[0]);
        _history.push(new_pathname);
    };

    _handle_search_sorting_change = (event, _search_sorting_tab_index) => {

        const { _history, _search_sorting_modes, _search_mode_query } = this.state;

        const new_pathname = "/gallery/" + (_search_sorting_modes[_search_sorting_tab_index] || _search_sorting_modes[0]) + "/search/" + _search_mode_query;
        _history.push(new_pathname);
    };

    _reset_cell_positioner = () => {

        const {_column_count, _column_width, _gutter_size, _masonry, _cell_positioner } = this.state;


        if(_cell_positioner !== null && _masonry !== null) {

            _cell_positioner.reset({
                columnCount: _column_count,
                columnWidth: _column_width,
                spacer: _gutter_size
            });
            _masonry.clearCellPositions();
        }
    };

    _calculate_column_count() {

        const { _window_width, _root_width, _gutter_size } = this.state;
        let { _column_count } = this.state;

        if(_window_width > 1920) {

            _column_count = 6;
        }else if(_window_width > 1280) {

            _column_count = 4;
        }else if(_window_width > 960) {

            _column_count = 3;
        }else if(_window_width > 480) {

            _column_count = 2;
        }else {

            _column_count = 1;
        }

        // View width
        const page_width = _root_width;
        const _column_width = Math.floor(
            (page_width - (_column_count+1) * _gutter_size) / _column_count
        );

        this.setState({_column_width, _column_count}, () => {

            this._compute_cell_measurement();
        });
    }

    _compute_cell_measurement = () => {

        this.state._cell_measurer_cache.clearAll();
        this._init_cell_positioner();
    };

    _set_masonry_ref = (element) => {

        this.setState({_masonry: element});
    };

    _set_root_ref = (element) => {

        if(element === null) { return}
        this.setState({_root: element});
    };

    _cell_renderer = ({index, key, parent, style}) => {

        const { _hbd_market, _selected_currency, _selected_locales_code, _selected_post_index, _reaction_selected_post, _reaction_selected_post_loading, _posts, _column_width, _cell_measurer_cache, _column_count } = this.state;
        const post = _posts[index] || {};

        if(!post.id) { return <div></div>; }

        const selected = _selected_post_index === index;
        const is_loading = Boolean(_reaction_selected_post.id === post.id) && _reaction_selected_post_loading;

        style.width = _column_width;

        let {_top_scroll_of_el_by_index, _height_of_el_by_index} = this.state;
        _top_scroll_of_el_by_index[index] = style.top;
        _height_of_el_by_index[index] = style.height;
        this.setState({_top_scroll_of_el_by_index});

        return (
            <CellMeasurer cache={_cell_measurer_cache} index={index} key={post.id} parent={parent}>
                {({ measure, registerChild }) => (
                    // 'style' attribute required to position cell (within parent List)
                    <div ref={registerChild} draggable={"false"} style={style}>
                        <PixelArtCard
                            fade_in={Math.floor(index / _column_count) * 40 * _column_count + (index % _column_count) * 20}
                            selected={selected}
                            post={post}
                            is_loading={is_loading}
                            hbd_market={_hbd_market}
                            selected_currency={_selected_currency}
                            selected_locales_code={_selected_locales_code}
                            on_loaded={measure}
                            on_author_click={this._handle_set_selected_account}
                            on_card_media_click={this._handle_art_open}
                            on_card_content_click={selected ? this._handle_art_open: this._handle_art_focus}
                            on_reaction_click={this._handle_art_reaction}
                            on_votes_click={this._handle_votes_menu_open}/>
                    </div>
                )}
            </CellMeasurer>
        );
    };

    _handle_set_selected_account = (author) => {

        const { _history, _sorting_modes, _sorting_tab_index } = this.state;

        const new_pathname = "/gallery/" + (_sorting_modes[_sorting_tab_index] || _sorting_modes[0]) + "/@" + author;
        _history.push(new_pathname);
    };

    _init_cell_positioner() {

        const {_cell_measurer_cache, _column_count, _column_width, _gutter_size} = this.state;

        let _cell_positioner = createMasonryCellPositioner({
            cellMeasurerCache: _cell_measurer_cache,
            columnCount: _column_count,
            columnWidth: _column_width,
            spacer: _gutter_size,
        });

        this.setState({_updating_dimension: false, _cell_positioner}, () =>{

            this.forceUpdate();
        })
    }

    _updated_dimensions = (do_not_refresh_after = false) => {

        const { _root } = this.state;

        if(_root !== null) {

            setTimeout(() => {

                let w = window,
                    d = document,
                    documentElement = d.documentElement,
                    body = d.getElementsByTagName('body')[0],
                    _window_width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
                    _window_height = w.innerHeight|| documentElement.clientHeight || body.clientHeight;

                const root_rect = _root.getBoundingClientRect();
                this.setState({_cell_positioner: null, _window_width, _window_height, _root_width: root_rect.width, _root_height: root_rect.height}, () => {

                    this.forceUpdate(() => {
                        this._calculate_column_count();

                        if(!do_not_refresh_after) {

                            this._updated_dimensions(true);
                        }
                    });

                });
            }, do_not_refresh_after ? 0: 200);
        }else {

            setTimeout(() => {

                this._updated_dimensions();
            }, 100);
        }
    }

    _handle_art_open = (post, event) => {

        const { _history, _is_search_mode, _sorting_modes, _sorting_tab_index, _search_sorting_modes, _search_sorting_tab_index, _search_mode_query } = this.state;

        this._handle_art_focus(post, event);
        const new_pathname = !_is_search_mode ?
            "/gallery/" + (_sorting_modes[_sorting_tab_index] || _sorting_modes[0]) + "/@" + post.author + "/" + post.permlink:
            "/gallery/" + (_search_sorting_modes[_search_sorting_tab_index] || _search_sorting_modes[0]) + "/search/" + _search_mode_query + "/@" + post.author + "/" + post.permlink;
        _history.push(new_pathname);
        actions.trigger_sfx("alert_high-intensity");
    };

    _handle_vote = (weight) => {

        const { _logged_account, _reaction_selected_post } = this.state;

        if(_logged_account.hive_username) {

            vote_on_hive_post(_reaction_selected_post.author, _reaction_selected_post.permlink, weight, _logged_account.hive_username, _logged_account.hive_password, (err, res) => {

                if(!err) {

                    let { _posts } = this.state;

                    this.setState({_reaction_selected_post_loading: true}, () => {

                        this.state._masonry.forceUpdate();

                        setTimeout(() => {

                            get_hive_post({author: _reaction_selected_post.author, permlink: _reaction_selected_post.permlink, force_query: true}, (err, data) => {

                                if(data) {

                                    _posts = _posts.map((post, index) => {

                                        if(post.id === data.id) { return data; }
                                        return post;
                                    });

                                    this.setState({_posts, _reaction_selected_post_loading: false}, () => {

                                        this.state._masonry.forceUpdate();
                                    });

                                    this._handle_art_reaction(null, data);
                                }
                            });

                        }, 12 * 1000);
                    });

                    actions.trigger_snackbar("You voted!");
                    actions.trigger_sfx("hero_decorative-celebration-03");
                    actions.jamy_update("happy");
                    this._handle_reaction_menu_close();
                }else {

                    actions.trigger_snackbar(err);
                    actions.trigger_sfx("alert_error-01");
                    actions.jamy_update("angry");
                }
            });
        }else {

            actions.trigger_snackbar("Please connect to Hive first.");
            actions.trigger_sfx("alert_error-01");
            actions.jamy_update("sad");
        }

    };
    
    _handle_art_reaction = (event, post) => {

        if(event && post) {

            const { _logged_account } = this.state;
            const hive_username = _logged_account.hive_username || "";
            const votes = post.active_votes;
            let _reaction_voted_result = 0;

            votes.forEach((vote) => {

                if(vote.voter === hive_username) {

                    _reaction_voted_result = parseInt(vote.percent, 10);
                }
            });

            this.setState({_reaction_click_event: {...event}, _reaction_selected_post: post, _reaction_voted_result});
        }else {

            this._handle_reaction_menu_close();
        }
    };

    _handle_reaction_menu_close = () => {

        this.setState({_reaction_click_event: null, _reaction_selected_post: {}, _reaction_voted_result: null});
    };

    _handle_art_focus = (post, event) => {

        const { _posts } = this.state;

        const selected_post_index = _posts.indexOf(post);
        this._update_selected_post_index(selected_post_index);
    };


    _handle_pixel_dialog_post_closed = () => {

        this.setState({_post: null, _post_closed_at: Date.now()});
        actions.trigger_sfx("state-change_confirm-down");
    };

    _handle_pixel_dialog_post_close = () => {

        const { _history, _is_search_mode, _sorting_modes, _sorting_tab_index, _search_sorting_modes, _search_sorting_tab_index, _search_mode_query } = this.state;

        const new_pathname = !_is_search_mode ?
            "/gallery/" + (_sorting_modes[_sorting_tab_index] || _sorting_modes[0]):
            "/gallery/" + (_search_sorting_modes[_search_sorting_tab_index] || _search_sorting_modes[0]) + "/search/" + _search_mode_query;
        _history.push(new_pathname);
    };

    _next_current_post = () => {

        const { _post, _posts } = this.state;

        const index = _posts.indexOf(_post);

        if(index < _posts.length-1) {

            this.setState({_post: [..._posts][index+1]});
            actions.trigger_sfx("navigation_transition-right");

            this._update_selected_post_index(index+1);
        }
    };

    _previous_current_post = () => {

        const { _post, _posts } = this.state;

        const index = _posts.indexOf(_post);

        if(index > 0) {

            this.setState({_post: [..._posts][index-1]});
            actions.trigger_sfx("navigation_transition-left");

            this._update_selected_post_index(index-1);
        }
    };

    _handle_keydown = (event) => {

        let { _selected_post_index, _post_closed_at, _posts, _post, _column_count } = this.state;

        if(!_post && _post_closed_at + 300 < Date.now()) {

            event.preventDefault();

            switch (event.keyCode) {

                case 38:
                    _selected_post_index -= _column_count;
                    break;
                case 40:
                    _selected_post_index += _column_count;
                    break;
                case 37:
                    _selected_post_index -= 1;
                    break;
                case 39:
                    _selected_post_index += 1;
                    break;
            }

            _selected_post_index = Math.max(0, Math.min(_posts.length-1, _selected_post_index));
            this._update_selected_post_index(_selected_post_index);

            this.setState({_selected_post_index}, () => {
                if(event.key === "Enter") {

                    this._open_selected_post_index();
                }
            });
        }
    };

    _update_selected_post_index = (index, do_not_scroll = false) => {

        const { _post, _posts, _masonry } = this.state;

        const _selected_post_index = typeof index !== "undefined" ? index : _posts.indexOf(_post);
        this.setState({_selected_post_index}, () => {

            if(!do_not_scroll) {

                this._scroll_to_index();
            }else {

                _masonry.forceUpdate();
            }
        });
    }

    _scroll_to_index = (index) => {

        const {_selected_post_index, _top_scroll_of_el_by_index, _height_of_el_by_index, _masonry, _root_height} = this.state;

        index = typeof index !== "undefined" ? index: _selected_post_index;
        let top = _top_scroll_of_el_by_index[index] + _height_of_el_by_index[index] / 2 - _root_height / 3;

        if(_masonry) {

            this.setState({_scroll_top: top}, () => {

                _masonry._scrollingContainer.scrollTop = top;
                _masonry.forceUpdate();
            });
        }
    };

    _handle_masonry_scroll = (scroll_data) => {

        const { scrollTop } = scroll_data;

        this.setState({_scroll_top: scrollTop});
    };

    _open_selected_post_index = () => {

        const {_selected_post_index, _posts} = this.state;

        this.setState({_post: _posts[_selected_post_index]});
    };

    _handle_reset_selected_account = () => {

        const { _history, _previous_pathname } = this.state;

        _history.push(_previous_pathname !== "" ? _previous_pathname: "/gallery");
    };

    _open_editor = () => {

        const { _history } = this.state;
        _history.push("/pixel");
    }

    _handle_votes_menu_open = (event, votes) => {

        this.setState({_votes_anchor: event.currentTarget, _votes: votes});
    };

    _handle_votes_menu_close = (event, votes) => {

        this.setState({_votes_anchor: null, _votes: []});
    };

    render() {

        const { classes,  _sorting_tab_index, _window_width, _window_height, _posts, _post, _post_author, _post_permlink, _loading_posts, _selected_locales_code, _updating_dimension } = this.state;
        const { _cell_positioner, _cell_measurer_cache, _load_more_threshold, _overscan_by_pixels, _scroll_top, _reaction_click_event, _reaction_voted_result, _is_search_mode, _search_sorting_tab_index, _votes, _votes_anchor } = this.state;

        const width = _window_width;
        const height = _window_height;

        const page_width = (width > 960) ? width-256: width;
        const post_list_window_margin_top = (width > 960) ?
            64:
            56;
        const post_list_height = height - post_list_window_margin_top;

        const masonry_element = (_cell_positioner !== null) ?
            <MasonryExtended
                scrollTop={_scroll_top}
                height={post_list_height}
                cellCount={_posts.length}
                cellMeasurerCache={_cell_measurer_cache}
                cellPositioner={_cell_positioner}
                cellRenderer={this._cell_renderer}
                loadMoreRows={this._load_more}
                threshold={_load_more_threshold}
                overscanByPixels={_overscan_by_pixels}
                ref={this._set_masonry_ref}
                width={page_width}
            ></MasonryExtended>: null;

        return (
            <div className={classes.root} ref={this._set_root_ref}>
                <div className={classes.appBarContainer}>
                    {
                        _is_search_mode ?
                            <AppBar position="static" className={classes.AppBar}>
                                <Tabs className={classes.tabs}
                                      variant="fullWidth"
                                      onChange={this._handle_search_sorting_change}
                                      value={_search_sorting_tab_index}>
                                    <Tab icon={<ClockIcon />} label={<span>Newest</span>} className={classes.tab}/>
                                    <Tab icon={<EyeIcon />} label={<span>Relevance</span>} className={classes.tab}/>
                                    <Tab icon={<HotIcon />} label={<span>Popularity</span>} className={classes.tab}/>
                                </Tabs>
                            </AppBar>:
                            <AppBar position="static" className={classes.AppBar}>
                                <Tabs className={classes.tabs}
                                      variant="fullWidth"
                                      onChange={this._handle_sorting_change}
                                      value={_sorting_tab_index}>
                                    <Tab icon={<ClockIcon />} label={<span>Created</span>} className={classes.tab}/>
                                    <Tab icon={<TimeIcon />} label={<span>Active</span>} className={classes.tab}/>
                                    <Tab icon={<HotIcon />} label={<span>Hot</span>} className={classes.tab}/>
                                    <Tab icon={<TrendingUpIcon />} label={<span>Trending</span>} className={classes.tab}/>
                                </Tabs>
                            </AppBar>
                    }
                </div>

                {
                    _posts.length ?
                        <div className={ _cell_positioner !== null && _updating_dimension === false ? classes.masonry: classes.masonryHidden}>
                            {masonry_element}
                        </div>:
                        <div className={classes.noPosts} style={{height: post_list_height}}>
                            {
                                _loading_posts ?
                                    <div key={"loading_posts"}>
                                        <h1><ShufflingSpanText  animation_delay_ms={0} animation_duration_ms={250} style={{fontFamily: "Noto Sans Mono"}} text={"Please wait..."}/></h1>
                                        {_is_search_mode && <h4>Powered in partnership with Ecency.com</h4>}
                                    </div>:
                                    <div key={"not_loading_posts"}><h1><ShufflingSpanText animation_delay_ms={0} animation_duration_ms={250} style={{fontFamily: "Noto Sans Mono"}} text={"Nothing to show you."}/></h1></div>

                            }
                        </div>
                }

                <MenuReactionPixelPost
                    keepMounted={false}
                    event={_reaction_click_event}
                    voted_result={_reaction_voted_result}
                    on_close={this._handle_reaction_menu_close}
                    on_vote={this._handle_vote} />

                <MenuVotesPixelPost
                    keepMounted={false}
                    anchor={_votes_anchor}
                    votes={_votes}
                    on_close={this._handle_votes_menu_close} />

                <PixelDialogPost
                    selected_locales_code={_selected_locales_code}
                    on_next={this._next_current_post}
                    on_previous={this._previous_current_post}
                    on_image_load_complete={() => {setTimeout(() => {this._scroll_to_index()}, 5)}}
                    keepMounted={false}
                    post={_post}
                    open={_post !== null && _post_author !== null && _post_permlink !== null}
                    onClose={this._handle_pixel_dialog_post_close}/>

                <AccountDialogProfileHive
                    keepMounted={false}
                    account_name={_post_author}
                    open={_post_author !== null && _post_permlink === null}
                    onClose={this._handle_reset_selected_account}/>

                <Grow in>
                    <Fab className={classes.fab} variant="extended" onClick={this._open_editor}>
                        <AddIcon /> {t( "words.create")}
                    </Fab>
                </Grow>

            </div>
        );
    }
}

export default withStyles(styles)(Gallery);
