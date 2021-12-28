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
import ImageMeasurer from "../components/ImageMeasurer";

import PixelDialogPost from "../components/PixelDialogPost";
import PixelArtCard from "../components/PixelArtCard";
import AccountDialogProfileHive from "../components/AccountDialogProfileHive";
import MenuReactionPixelPost from "../components/MenuReactionPixelPost";
import MenuVotesPixelPost from "../components/MenuVotesPixelPost";

import { unlogged_vote_on_hive_post, cached_search_on_hive, cached_get_hive_posts, cached_get_hive_post, vote_on_hive_post } from "../utils/api-hive"
import actions from "../actions/utils";
import api from "../utils/api";
import {HISTORY} from "../utils/constants";
import pixel_laboratory from "../../images/pixel-laboratory-base64";
import Grow from "@material-ui/core/Grow";
import ShufflingSpanText from "../components/ShufflingSpanText";
import get_svg_in_b64 from "../utils/svgToBase64";
import CyberExhibition from "../icons/CyberExhibition";
import AccountDialogHiveKey from "../components/AccountDialogHiveKey";
const cyber_exhibition_svg = get_svg_in_b64(<CyberExhibition />);

import pngdb from "../utils/png-db";
const pngdby = pngdb();

window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

let is_mobile_or_tablet = window.mobileAndTabletCheck();

class MasonryExtended extends Masonry {
    _getEstimatedTotalHeight() {
        const {cellCount, cellMeasurerCache, width} = this.props;

        const estimatedColumnCount = Math.floor(
            width / (cellMeasurerCache || {}).defaultWidth || 0,
        );

        const estimateTotalHeight = this._positionCache.estimateTotalHeight(
            cellCount,
            estimatedColumnCount,
            (cellMeasurerCache || {}).defaultHeight || 0,
        );

        return isFinite(estimateTotalHeight) ? estimateTotalHeight : 0;
    }
}

const styles = theme => ({
    root: {
        maxHeight: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: theme.palette.primary.darker,
    },
    AppBar: {
        position: "absolute",
        marginTop: -1,
        [theme.breakpoints.up("md")]: {
            borderRadius: 4
        }
    },
    appBarContainer: {
        position: "fixed",
        width: "100%",
        zIndex: "1300",
        left: 0,
        margin: 0,
        [theme.breakpoints.up("md")]: {
            margin: theme.spacing(2),
            right: theme.spacing(0),
            width: "calc(100% - 32px - 256px)",
            left: 256,

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
        overflow: "overlay",
        "& > .ReactVirtualized__Masonry": {
            position: "absolute",
            margin: 0,
            scrollBehavior: "smooth",
            overscrollBehavior: "none",
            touchAction: "pan-y",
            willChange: "scroll-position, transform !important",
            overflow: "overlay",
            padding: "88px 12px 32px 16px",
            contain: "style layout size paint",
            "& > .ReactVirtualized__Masonry__innerScrollContainer": {
                top: "auto !important",
                left: "auto !important",
                contain: "layout size style paint",
            }
        }
    },
    noPosts: {
        position: "absolute",
        display: "flex",
        width: "100%",
        padding: "88px 16px 32px 16px",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        color: "#d7dbffbb",
        backgroundColor: theme.palette.primary.darker,
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
        cursor: "pointer",
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    cyberExhibitionImage: {
        opacity: 0,
        height: "min(66vw, 66vh)",
        backgroundSize: "contain",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url("${cyber_exhibition_svg}")`,
        animation: "$op 1.8s none infinite 1s",
        "@global": {
            "@keyframes op": {
                "0%": {opacity: 0.5},
                "10%": {opacity: 0.4},
                "30%": {opacity: 0.6},
                "50%": {opacity: 0.4},
                "57%": {opacity: 0.5},
                "64%": {opacity: 0.3},
                "100%": {opacity: 0.4},
            }
        }

    }
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
            _started_on_post_dialog: Boolean((props.pathname.split("/")[3] || "").includes("@") ? props.pathname.split("/")[4] || null: (props.pathname.split("/")[5] || "").includes("@") ? props.pathname.split("/")[6] || null: null),
            _is_search_mode: Boolean(props.pathname.split("/")[3] === "search"),
            _search_mode_query: props.pathname.split("/")[3] === "search" ? decodeURIComponent(props.pathname.split("/")[4] || ""): "",
            _search_sorting_tab_index: SEARCH_SORTING_MODES.indexOf(props.pathname.split("/")[2] || 0),
            _history: HISTORY,
            _sorting_modes: SORTING_MODES,
            _selected_locales_code: null,
            _selected_currency: null,
            _enable_3d: false,
            _hbd_market: null,
            _logged_account: {},
            _search_sorting_modes: SEARCH_SORTING_MODES,
            _search_mode_query_page: 0,
            _search_mode_query_pages: 1,
            _post: null,
            _post_img: null,
            _loading_posts: false,
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
            _start_author: "",
            _start_permlink: "",
            _column_count: 4,
            _column_width: 356,
            _load_more_threshold: 2000,
            _overscan_by_pixels: 6000,
            _cell_positioner: null,
            _cell_positioner_config: null,
            _masonry: null,
            _cell_measurer_cache: null,
            _scroll_top: 0,
            _top_scroll_of_el_by_index: [],
            _height_of_el_by_index: [],
            _x_y_of_el_by_index: [],
            _reaction_click_event: null,
            _reaction_selected_post: {},
            _reaction_voted_result: null,
            _reaction_selected_post_loading: null,
            _votes_anchor: null,
            _votes: [],
            _dialog_hive_key_open: false,
        };
    };

    componentWillReceiveProps(new_props) {

        const { _sorting_modes, _search_sorting_modes, _posts } = this.state;

        let state = {
            classes: new_props.classes,
            pathname: new_props.pathname,
            _previous_pathname: this.state.pathname,
            _sorting_tab_index: _sorting_modes.indexOf(new_props.pathname.split("/")[2] || 0),
            _post_author: (new_props.pathname.split("/")[3] || "").includes("@") ? new_props.pathname.split("/")[3]: (new_props.pathname.split("/")[5] || "").includes("@") ? new_props.pathname.split("/")[5]: null,
            _post_permlink: (new_props.pathname.split("/")[3] || "").includes("@") ? new_props.pathname.split("/")[4] || null: (new_props.pathname.split("/")[5] || "").includes("@") ? new_props.pathname.split("/")[6] || null: null,
            _is_search_mode: Boolean(new_props.pathname.split("/")[3] === "search"),
            _search_mode_query: new_props.pathname.split("/")[3] === "search" ? decodeURIComponent(new_props.pathname.split("/")[4] || ""): "",
            _search_sorting_tab_index: _search_sorting_modes.indexOf(new_props.pathname.split("/")[2] || 0),
        };

        state._sorting_tab_index = state._sorting_tab_index === -1 ? 0: state._sorting_tab_index;
        state._search_sorting_tab_index = state._search_sorting_tab_index === -1 ? 0: state._search_sorting_tab_index;

        const sorting_changed = this.state._sorting_tab_index !== state._sorting_tab_index;
        const search_sorting_changed = this.state._search_sorting_tab_index !== state._search_sorting_tab_index;
        const search_mode_query_changed = this.state._search_mode_query !== state._search_mode_query;

        let get_post = Boolean(state._post_author && state._post_permlink && (state._post_author !== this.state._post_author || state._post_permlink !== this.state._post_permlink));
        let closed_search = Boolean(
            (!state._is_search_mode && this.state._is_search_mode && this.state._search_mode_query !== "") ||
            (state._search_mode_query === "" && this.state._search_mode_query !== "")
        );
        let closed_post = Boolean(!state._post_author && !state._post_permlink && this.state._post_author && this.state._post_permlink);

        this.setState(state, () => {

            this.forceUpdate(() => {

                if(get_post) {

                    this._get_post();
                }else if(closed_post) {

                    this._handle_pixel_dialog_post_closed();
                }

                if(closed_search || (sorting_changed && !state._is_search_mode)) {

                    this._scroll_to(0);
                    this.setState({_posts: [], _start_author: "", _start_permlink: ""}, () => {
                        this.forceUpdate(() => {
                            this._recompute_cell_measurements(() => {

                                this._load_more_posts();
                            });
                        });
                    });
                }else if(search_sorting_changed && state._is_search_mode) {

                    this._scroll_to(0);
                    this.setState({_posts: [], _start_author: "", _start_permlink: "", _search_mode_query_page: 0, _search_mode_query_pages: 1}, () => {
                        this.forceUpdate(() => {
                            this._recompute_cell_measurements(() => {

                                this._search_more_posts();
                            });
                        });
                    });
                }else if(search_mode_query_changed && state._is_search_mode) {

                    setTimeout(() => {

                        this._is_not_new_query_maybe_search_post(state._search_mode_query);
                    }, 1000);
                }
            });
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

        return false;
    }

    componentDidMount() {

        actions.trigger_snackbar(`Inside W.C.R's Artistic Situations "Museum"! Not less than just having fun!`, 5000);
        window.addEventListener("resize", this._update_dimensions_handler);
        ReactDOM.findDOMNode(this).addEventListener("keydown", this._handle_keydown);


        this._update_settings();
        this._is_logged();
        this._updated_dimensions(() => {

            if(this.state._is_search_mode) {

                this.setState({_posts: [], _start_author: "", _start_permlink: "", _search_mode_query_page: 0, _search_mode_query_pages: 1}, () => {
                    this._search_more_posts();
                });
            }else {

                this.setState({_posts: [], _start_author: "", _start_permlink: ""}, () => {
                    this._load_more_posts();
                });
            }

            if(this.state._post_author && this.state._post_permlink) {

                this._get_post();
            }
        });
    };

    _update_settings = () => {

        api.get_settings(this._process_settings_query_result);
    };

    _process_settings_query_result = (error, settings) => {

        if(!error) {

            // Set new settings from query result
            const _selected_locales_code =  typeof settings.locales !== "undefined" ? settings.locales: "en-US";
            const _selected_currency = typeof settings.currency !== "undefined" ? settings.currency: "USD";
            const _enable_3d = typeof settings.enable_3d !== "undefined" ? settings.enable_3d: false;

            api.get_coins_markets(["hive_dollar"], _selected_currency.toLowerCase(), this._set_coins_markets);
            this.setState({  _selected_locales_code, _selected_currency, _enable_3d }, () => {

                this.forceUpdate();
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

        const { _post_author, _post_permlink, _masonry } = this.state;

        if(_post_author && _post_permlink) {

            const itemsWithSizes = _masonry ? _masonry.props.itemsWithSizes || []: [];
            const index_we_have = itemsWithSizes.map((p) => `${p.item.author}/${p.item.permlink}`).indexOf(`${_post_author}/${_post_permlink}`);

            if(index_we_have >= 0) {

                this.setState({_post: {...itemsWithSizes[index_we_have].item}, _post_img: {...itemsWithSizes[index_we_have].size}}, () => {

                    this.forceUpdate();
                });
            }else {

                actions.trigger_loading_update(0);

                cached_get_hive_post({author: _post_author, permlink: _post_permlink, cached_query: true, force_then: true}, (err, data) => {

                    if(data) {

                        data.fetched = Date.now();
                        pngdby.get_new_img_obj(data.image, (imgobj) => {

                            this.setState({_post: {...data}, _post_img: {...imgobj}}, () => {

                                this.forceUpdate();
                            });
                        });
                    }
                });
            }
        }
    };

    _load_more = () => {

        const { _is_search_mode, _loading_posts } = this.state;

        if(!_loading_posts) {

            if(_is_search_mode) {

                this._search_more_posts();
            }else {

                this._load_more_posts();
            }
        }
    };

    _load_more_posts = () => {

        const { _start_author, _start_permlink, _sorting_modes, _sorting_tab_index, _loading_posts, _history, _previous_pathname } = this.state;

        const load_from_cache = _history.length < 5;

        if (!_loading_posts) {

            this.setState({_loading_posts: true}, () => {
                actions.trigger_loading_update(0);

                cached_get_hive_posts({
                    limit: 20,
                    tag: "pixel-art",
                    sorting: _sorting_modes[_sorting_tab_index] || _sorting_modes[0],
                    start_author: _start_author,
                    start_permlink: _start_permlink,
                    cached_query: true,
                    force_then: true,
                }, (err, data) => {

                    if (!err && ((data || {}).posts || []).length >= 1) {

                        const end_data = data.end_author && data.end_permlink ? {
                            _start_author: data.end_author,
                            _start_permlink: data.end_permlink
                        } : {_start_author: "", _start_permlink: ""};


                        const { _posts } = this.state;

                        const _posts_ids = _posts.map(p => p.id);
                        const posts = _posts.concat(data.posts.filter(p => !Boolean(_posts_ids.includes(p.id))));
                        this.setState({...end_data, _loading_posts: false, _posts: posts.map((p) => {p.fetched = p.fetched || Date.now(); return p;}).sort((a, b) => a.fetched - b.fetched)}, () => {

                            this.forceUpdate();
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

    _is_not_new_query_maybe_search_post = (search_mode_query) => {

        const { _search_mode_query, _history, pathname } = this.state;

        if(_search_mode_query === search_mode_query) {

            this.setState({_posts: [], _search_mode_query_page: 0, _search_mode_query_pages: 1}, () => {

                this._scroll_to(0);
                this.forceUpdate(() => {

                    this._search_more_posts();
                    _history.push(pathname);
                });
            });
        }
    };

    _search_more_posts = () => {

        const { _posts, _search_mode_query, _search_sorting_modes, _search_sorting_tab_index, _search_mode_query_pages, _loading_posts } = this.state;
        let { _search_mode_query_page } = this.state;

        if (!_loading_posts && _search_mode_query_page < _search_mode_query_pages) {

            _search_mode_query_page++;

            actions.trigger_loading_update(0);
            this.setState({_loading_posts: true}, () => {

                this.forceUpdate(() => {

                    cached_search_on_hive(_search_mode_query, [], ["pixel-art"], (_search_sorting_modes[_search_sorting_tab_index] || _search_sorting_modes[0]), _search_mode_query_page.toString(), (err, data) => {

                        if((data || {}).posts){

                            const _posts_ids = _posts.map(p => p.id);
                            const posts = _posts.concat(data.posts.filter(p => Boolean(!_posts_ids.includes(p.id))));

                            this.setState({_loading_posts: false, _posts: posts.map((p) => {p.fetched = p.fetched || Date.now(); return p;}).sort((a, b) => a.fetched < b.fetched), _search_mode_query_pages: data.pages, _search_mode_query_page: data.page}, () => {

                                this.forceUpdate();
                                actions.trigger_loading_update(100);
                            });
                        }else {

                            actions.trigger_loading_update(100);
                            this.setState({_loading_posts: false});
                        }
                    });
                });
            });
        }
    };

    componentWillUnmount() {

        window.removeEventListener("resize", this._update_dimensions_handler);
        ReactDOM.findDOMNode(this).removeEventListener("keydown", this._handle_keydown);
    }

    _handle_sorting_change = (event, _sorting_tab_index) => {

        const { _history, _sorting_modes } = this.state;

        const new_pathname = "/gallery/" + (_sorting_modes[_sorting_tab_index] || _sorting_modes[0]);
        _history.push(new_pathname);
        actions.trigger_sfx("navigation_transition-right");
    };

    _handle_search_sorting_change = (event, _search_sorting_tab_index) => {

        const { _history, _search_sorting_modes, _search_mode_query } = this.state;

        const new_pathname = "/gallery/" + (_search_sorting_modes[_search_sorting_tab_index] || _search_sorting_modes[0]) + "/search/" + encodeURIComponent(_search_mode_query);
        _history.push(new_pathname);
        actions.trigger_sfx("navigation_transition-right");
    };

    _recompute_cell_measurements = (callback_function = () => {}) => {

        const {_cell_measurer_cache, _masonry, _cell_positioner, _column_count, _gutter_size, _column_width } = this.state;

        if(_cell_measurer_cache && _masonry && _cell_positioner) {

            let _cell_positioner_config = {
                cellMeasurerCache: _cell_measurer_cache,
                columnCount: _column_count,
                columnWidth: _column_width,
                spacer: _gutter_size,
            };

            _cell_measurer_cache.clearAll();
            _cell_positioner.reset(_cell_positioner_config);
            _masonry.clearCellPositions();
            _masonry.forceUpdate();

            this.setState({_cell_positioner, _cell_positioner_config, _cell_measurer_cache}, () => {

                _masonry.forceUpdate();
                callback_function();
            });

        }else {

            this._init_cell_measurements(callback_function);
        }
    };

    _set_masonry_ref = (element) => {

        if(element === null) { return}

        this.setState({_masonry: element}, () => {

            this._init_cell_measurements();
        });
    };

    _set_root_ref = (element) => {

        if(element === null) { return}
        this.setState({_root: element}, () => {

            this.forceUpdate();
        });
    };

    _cell_renderer = (data) => {

        const {index, key, parent, style, isScrolling} = data;
        const { _root_height, _masonry, _hbd_market, _selected_currency, _selected_locales_code, _post, _reaction_selected_post_loading, _column_width, _cell_measurer_cache, _column_count } = this.state;

        if(typeof _masonry.props.itemsWithSizes[index] === "undefined") {return}
        const {item, size} =  _masonry.props.itemsWithSizes[index];
        const scroll_top = _masonry._scrollingContainer.scrollTop;

        if(!Boolean(item.id) || !size.height){return}
        const columnIndex = index % _column_count;
        const rowIndex = (index - columnIndex) / _column_count;
        const selected = item.id === (_post || {}).id;
        const is_loading = Boolean((_reaction_selected_post_loading || {}).id === item.id);
        const image_height = Math.ceil(_column_width * (size.height / size.width)) || 0;

        style.width = 0 + _column_width;
        let {_top_scroll_of_el_by_index, _height_of_el_by_index, _x_y_of_el_by_index} = this.state;

        const top = 0 + style.top;
        const height = 0 + style.height;
        const bottom = top + height;

        _top_scroll_of_el_by_index[index] = top;
        _height_of_el_by_index[index] = height;
        _x_y_of_el_by_index[index] = [rowIndex, columnIndex];

        const soon_visible_threshold = _root_height / 2;
        const soon_or_visible = soon_visible_threshold + bottom > scroll_top && top < scroll_top + _root_height + soon_visible_threshold;

        this.setState({_top_scroll_of_el_by_index, _height_of_el_by_index});

        return (
            <CellMeasurer cache={_cell_measurer_cache} index={index} key={key} parent={parent}>
                <PixelArtCard
                    id={item.id}
                    rowIndex={rowIndex}
                    columnIndex={columnIndex}
                    style={style}
                    selected={selected}
                    wont_move={!isScrolling && soon_or_visible}
                    post={item}
                    iws={size}
                    column_width={_column_width}
                    image_height={image_height}
                    image_width={_column_width}
                    is_loading={is_loading}
                    hbd_market={_hbd_market}
                    selected_currency={_selected_currency}
                    selected_locales_code={_selected_locales_code}
                    on_author_click={this._handle_set_selected_account}
                    on_card_media_click={this._handle_art_open}
                    on_card_tag_click={this._handle_set_tag}
                    on_card_content_click={selected ? this._handle_art_open: this._handle_art_focus}
                    on_reaction_click={this._handle_art_reaction}
                    on_votes_click={this._handle_votes_menu_open}/>
            </CellMeasurer>
        );
    };

    _handle_set_tag = (name) => {

        const {_history} = this.state;

        _history.push(`/gallery/newest/search/${encodeURIComponent("#"+name)}`);
    };

    _handle_set_selected_account = (author) => {

        const { _history, _sorting_modes, _sorting_tab_index, _is_search_mode, _search_mode_query, _search_sorting_tab_index, _search_sorting_modes } = this.state;

        const new_pathname = _is_search_mode ?
            `/gallery/${_search_sorting_modes[_search_sorting_tab_index]}/search/${encodeURIComponent(_search_mode_query)}/@${author}`:
            `/gallery/${_sorting_modes[_sorting_tab_index] || _sorting_modes[0]}/@${author}`;
        _history.push(new_pathname);
        actions.trigger_sfx("MazeImpact5");
    };

    _init_cell_measurements = (callback_function = () => {}) => {

        this.forceUpdate(() => {

            if(this.state._masonry && this.state._cell_measurer_cache && this.state._cell_positioner_config && this.state._cell_positioner) {

                this._recompute_cell_measurements(callback_function);
            }else {

                const {_column_count, _column_width, _gutter_size} = this.state;

                let _cell_measurer_cache = new CellMeasurerCache({
                    defaultHeight: 600,
                    defaultWidth: _column_width,
                    fixedWidth: true,
                });

                let _cell_positioner_config = {
                    cellMeasurerCache: _cell_measurer_cache,
                    columnCount: _column_count,
                    columnWidth: _column_width,
                    spacer: _gutter_size,
                };

                let _cell_positioner = createMasonryCellPositioner(_cell_positioner_config);

                this.setState({ _cell_measurer_cache, _cell_positioner, _cell_positioner_config}, () => {

                    this.forceUpdate(() => {

                        const update_masonry = (callback_function = () => {}) => {

                            const { _masonry } = this.state;
                            if(!_masonry){

                                setTimeout(() => {

                                    update_masonry(callback_function);
                                }, 50);
                            }else {

                                this.forceUpdate(() => {
                                    _masonry.forceUpdate(() => {

                                        callback_function();
                                    });
                                });
                            }
                        };

                        update_masonry(callback_function);
                    });
                });
            }
        });
    }

    _update_dimensions_handler = () => {

        this._updated_dimensions();
    };

    _updated_dimensions = (callback_function = () => {}) => {

        let w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            _window_width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            _window_height = w.innerHeight|| documentElement.clientHeight || body.clientHeight;

        let posts = [...this.state._posts];

        this.setState({_posts: [], _window_width, _window_height, _load_more_threshold: _window_height * 2}, () => {

            this.forceUpdate(() => {

                const { _root, _gutter_size, _window_width, _window_height } = this.state;
                let { _column_count } = this.state;

                if(_root) {

                    const root_rect = _root.getBoundingClientRect();
                    const _root_width = root_rect.width;
                    const _root_height = root_rect.height;

                    if(_window_width < 100 || _root_width < 100 || _root_height < 100 || _window_height < 100) {

                        setTimeout(() => {

                            this._updated_dimensions(callback_function)
                        }, 50);

                    }else {

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
                        const _column_width = Math.floor(
                            (root_rect.width - (_column_count+1) * _gutter_size) / _column_count
                        );

                        this.setState({_overscan_by_pixels: (2 - (1-(1/_column_count))) * 6000, _posts: [...posts], _column_width, _column_count, _root_width, _root_height}, () => {

                            this._init_cell_measurements(callback_function);
                        });
                    }

                }else {

                    setTimeout(() => {

                        this._updated_dimensions(callback_function);
                    }, 50);
                }
            });
        });
    }

    _handle_art_open = (post, event) => {

        const { _history, _is_search_mode, _sorting_modes, _sorting_tab_index, _search_sorting_modes, _search_sorting_tab_index, _search_mode_query } = this.state;

        if(!this.state._post_author && !this.state._post_permlink) {

            actions.trigger_sfx("MazeImpact5");
        }else {

            actions.trigger_sfx("navigation_transition-left");
        }

        const new_pathname = !_is_search_mode ?
            "/gallery/" + (_sorting_modes[_sorting_tab_index] || _sorting_modes[0]) + "/@" + post.author + "/" + post.permlink:
            "/gallery/" + (_search_sorting_modes[_search_sorting_tab_index] || _search_sorting_modes[0]) + "/search/" + encodeURIComponent(_search_mode_query) + "/@" + post.author + "/" + post.permlink;
        _history.push(new_pathname);
    };

    _handle_vote = (weight) => {

        const { _logged_account, _reaction_selected_post } = this.state;

        if(_logged_account.hive_username) {

            vote_on_hive_post(_reaction_selected_post.author, _reaction_selected_post.permlink, weight, _logged_account.hive_username, _logged_account.hive_password, (err, res) => {

                if(!err) {

                    this._handle_vote_success();
                }else {

                    this._handle_vote_error(err);
                }
            });
        }else {

            this.setState({_dialog_hive_key_open: true, _reaction_selected_weight: weight}, () => {

                this.forceUpdate();
            });
        }
    };

    _handle_dialog_hive_key_close = () => {

        this.setState({_dialog_hive_key_open: false}, () => {

            this.forceUpdate();
        });
    };

    _try_unlogged_vote = (username, private_key, callback_function) => {

        const { _reaction_selected_post, _reaction_selected_weight } = this.state;
        unlogged_vote_on_hive_post(_reaction_selected_post.author, _reaction_selected_post.permlink, _reaction_selected_weight, username, private_key, callback_function);
    };

    _handle_vote_success = () => {

        const { _reaction_selected_post } = this.state;
        let { _posts } = this.state;

        this.setState({_dialog_hive_key_open: false, _reaction_selected_post_loading: {..._reaction_selected_post}}, () => {

            this.forceUpdate();

            setTimeout(() => {

                cached_get_hive_post({author: _reaction_selected_post.author, permlink: _reaction_selected_post.permlink, force_query: true}, (err, data) => {

                    if(data) {

                        _posts = _posts.map((post, index) => {

                            if(post.id === data.id) { return data; }
                            return post;
                        });

                        this.setState({_posts, _reaction_selected_post_loading: null}, () => {

                            this.forceUpdate();
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

    };

    _handle_vote_error = (err) => {

        actions.trigger_snackbar("Unable to vote");
        actions.trigger_sfx("alert_error-01");
        actions.jamy_update("angry");
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

            this.setState({_reaction_click_event: {...event}, _reaction_selected_post: post, _reaction_voted_result}, () => {

                this.forceUpdate();
            });
        }else {

            this._handle_reaction_menu_close();
        }
    };

    _handle_reaction_menu_close = () => {

        this.setState({_reaction_click_event: null, _reaction_selected_post: {}, _reaction_voted_result: null}, () => {

            this.forceUpdate();
        });
    };

    _handle_art_focus = (post) => {

        const { _posts } = this.state;

        const selected_post_index = _posts.map(p => p.id).indexOf(post.id);
        this._update_selected_post_index(selected_post_index, true);
    };


    _handle_pixel_dialog_post_closed = () => {

        this.setState({_post_closed_at: Date.now()});
        actions.trigger_sfx("HardVertical1", 0.6);
    };

    _handle_pixel_dialog_post_close = () => {

        const { _history, _is_search_mode, _sorting_modes, _sorting_tab_index, _search_sorting_modes, _search_sorting_tab_index, _search_mode_query } = this.state;

        const new_pathname = !_is_search_mode ?
            "/gallery/" + (_sorting_modes[_sorting_tab_index] || _sorting_modes[0]):
            "/gallery/" + (_search_sorting_modes[_search_sorting_tab_index] || _search_sorting_modes[0]) + "/search/" + encodeURIComponent(_search_mode_query);
        _history.push(new_pathname);
    };

    _next_current_post = () => {

        const { _post, _posts } = this.state;

        const index = _posts.map(p => p.id).indexOf(_post.id)+1;
        const _selected_post_index = Math.max(0, Math.min(_posts.length-1, index));

        if(this.state._post_author && this.state._post_permlink){

            this._handle_art_open(_posts[_selected_post_index]);
        }else {

            this._update_selected_post_index(_selected_post_index, false);
        }
    };

    _previous_current_post = () => {

        const { _post, _posts } = this.state;

        const index = _posts.map(p => p.id).indexOf(_post.id)-1;
        const _selected_post_index = Math.max(0, Math.min(_posts.length-1, index));

        if(this.state._post_author && this.state._post_permlink){

            this._handle_art_open(_posts[_selected_post_index]);
        }else {

            this._update_selected_post_index(_selected_post_index, false);
        }
    };

    _handle_keydown = (event) => {

        let { _masonry, _selected_post_index, _post_closed_at, _posts, _post_author, _post_permlink, _column_count, _x_y_of_el_by_index } = this.state;

        if(!_post_author && !_post_permlink && _post_closed_at + 300 < Date.now()) {

            event.preventDefault();

            const columnIndex = _selected_post_index % _column_count;
            const rowIndex = (_selected_post_index - columnIndex) / _column_count;


            switch (event.keyCode) {

                case 38:

                    _x_y_of_el_by_index((xy, xy_i) => {

                        const [r, c] = xy;
                        if(c === columnIndex && rowIndex === r - 1) {

                            _selected_post_index = xy_i;
                        }
                    });
                    break;
                case 40:
                    _x_y_of_el_by_index((xy, xy_i) => {

                        const [r, c] = xy;
                        if(c === columnIndex && rowIndex === r + 1) {

                            _selected_post_index = xy_i;
                        }
                    });
                    break;
                case 37:
                    _selected_post_index -= 1;
                    break;
                case 39:
                    _selected_post_index += 1;
                    break;
            }

            _selected_post_index = Math.max(0, Math.min(_posts.length-1, _selected_post_index));

            if(event.keyCode === 13){

                this._handle_art_open(_posts[_selected_post_index]);
            }else if(this.state._selected_post_index !== _selected_post_index){

                this._update_selected_post_index(_selected_post_index);
            }
        }
    };

    _update_selected_post_index = (index, do_not_scroll = false) => {

        const { _post, _posts, _masonry } = this.state;
        const itemsWithSizes = _masonry.props.itemsWithSizes;
        const _selected_post_index = typeof index !== "undefined" ? index : (_post) ? _posts.map(p => (p || {}).id).indexOf(_post.id): this.state._selected_post_index;
        this.setState({_selected_post_index, _post: _posts[_selected_post_index], _post_img: (itemsWithSizes[_selected_post_index] || {}).size}, () => {

            if(!do_not_scroll) {

                this._scroll_to_index();
            }else {

                _masonry.forceUpdate();
            }

            actions.trigger_sfx("ui_tap-variant-01");
        });
    }

    _scroll_to = (scroll) => {

        const { _masonry } = this.state;

        if(_masonry) {

            if(typeof scroll === "undefined") {

                _masonry._scrollingContainer.scrollTop = this.state._scroll_top;
                _masonry.forceUpdate();
            }else {

                this.setState({_scroll_top: scroll}, () => {

                    _masonry._scrollingContainer.scrollTop = scroll;
                    _masonry.forceUpdate();
                });
            }
        }

    };

    _scroll_to_index = (index) => {

        const {_selected_post_index, _top_scroll_of_el_by_index, _height_of_el_by_index, _root_height} = this.state;

        index = typeof index !== "undefined" ? index: _selected_post_index;
        let top = _top_scroll_of_el_by_index[index] + _height_of_el_by_index[index] / 2 - _root_height / 3;

        this._scroll_to(top);
    };

    _handle_masonry_scroll = (scroll_data) => {

        const { _load_more_threshold, _loading_posts } = this.state;
        const { scrollTop, scrollHeight, clientHeight } = scroll_data;

        if(!_loading_posts) {

            if(scrollTop + clientHeight + _load_more_threshold > scrollHeight && scrollHeight > clientHeight) {

                this._load_more();
            }
        }

        //this.setState({_scroll_top: scrollTop});
    };

    _open_selected_post_index = () => {

        const {_selected_post_index, _posts} = this.state;
        this._handle_art_open(_posts[_selected_post_index])
    };

    _handle_reset_selected_account = () => {

        const { _history, _previous_pathname, pathname } = this.state;

        _history.push(pathname.replace(/\/\@[a-z0-9-\.]+$/gm, ""));
        actions.trigger_sfx("HardVertical1", 0.6);
    };

    _open_editor = () => {

        const { _history } = this.state;
        _history.push("/pixel");
    }

    _handle_votes_menu_open = (event, votes) => {

        this.setState({_votes_anchor: event.currentTarget, _votes: votes}, () => {

            this.forceUpdate();
        });
    };

    _handle_votes_menu_close = (event, votes) => {

        this.setState({_votes_anchor: null, _votes: []}, () => {

            this.forceUpdate();
        });
    };

    _handle_pixel_dialog_post_exited = () => {

        this._update_selected_post_index();
    };

    render() {

        const { classes, _enable_3d, _dialog_hive_key_open, _selected_currency, _sorting_tab_index, _window_width, _window_height, _posts, _post, _post_author, _post_permlink, _loading_posts, _selected_locales_code, _started_on_post_dialog } = this.state;
        const { _post_img, _cell_positioner, _hbd_market, _cell_measurer_cache, _overscan_by_pixels, _scroll_top, _reaction_click_event, _reaction_voted_result, _is_search_mode, _search_sorting_tab_index, _votes, _votes_anchor } = this.state;

        const width = _window_width;
        const height = _window_height;

        const page_width = (width > 960) ? width-256: width;
        const post_list_window_margin_top = (width > 960) ?
            64:
            56;
        const post_list_height = height - post_list_window_margin_top;

        const pixel_post_dialog_opened = Boolean(_post !== null && _post_author !== null && _post_permlink !== null);

        return (
            <div className={classes.root} ref={this._set_root_ref} style={pixel_post_dialog_opened ? {contentVisibility: "hidden"}: {}}>
                <div className={classes.appBarContainer}>
                    {
                        _is_search_mode ?
                            <AppBar position="static" className={classes.AppBar}>
                                <Tabs className={classes.tabs}
                                      focusRipple={false}
                                      disableFocusRipple={true}
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

                <ImageMeasurer
                        className={classes.masonry}
                        items={_posts}
                        image={item => item.image}
                        keyMapper={item => item.id}
                >
                        {({itemsWithSizes}) => {

                            if(_cell_measurer_cache && _cell_positioner) {

                                return (
                                    <MasonryExtended
                                        scrollTop={_scroll_top}
                                        scrollingResetTimeInterval={1000}
                                        onScroll={this._handle_masonry_scroll}
                                        height={post_list_height}
                                        cellCount={itemsWithSizes.length}
                                        itemsWithSizes={itemsWithSizes}
                                        keyMapper={index => (itemsWithSizes[index] || {size:{id: Math.random()}}).size.id}
                                        cellMeasurerCache={_cell_measurer_cache}
                                        cellPositioner={_cell_positioner}
                                        cellRenderer={this._cell_renderer}
                                        overscanByPixels={_overscan_by_pixels}
                                        ref={this._set_masonry_ref}
                                        width={page_width}
                                    />
                                )
                            }
                        }}
                    </ImageMeasurer>

                {
                    ((!_cell_measurer_cache || !_cell_positioner) || (_posts.length === 0)) &&
                        <div className={classes.noPosts} style={{height: post_list_height}}>
                            {
                                _loading_posts ||  (_post_author !== null && _post_permlink !== null) ?
                                    <div key={"loading_posts"}>
                                        <h1><ShufflingSpanText  animation_delay_ms={0} animation_duration_ms={250} style={{fontFamily: `"Share Tech Mono"`}} text={"Gathering [...artistic situations...]"}/></h1>
                                        <h3><ShufflingSpanText  animation_delay_ms={300} animation_duration_ms={250} style={{fontFamily: `"Share Tech Mono"`}} text={"Waiting on finding [pixel arts...]"}/></h3>
                                        {_is_search_mode && <h4>Powered in partnership with Ecency.com</h4>}
                                    </div>:
                                    <div key={"not_loading_posts"}>
                                        <h1><ShufflingSpanText animation_delay_ms={0} animation_duration_ms={250} style={{fontFamily: `"Share Tech Mono"`}} text={"Nothingness = [...artistic situations]"}/></h1>
                                        <h3><ShufflingSpanText animation_delay_ms={300} animation_duration_ms={250} style={{fontFamily: `"Share Tech Mono"`}} text={"No [pixel arts...] in those"}/></h3>
                                        <div className={classes.cyberExhibitionImage} />
                                    </div>

                            }
                        </div>
                }

                <Grow in>
                    <img onClick={this._open_editor} className={classes.fab} style={{maxWidth: "100%", height: 64, filter: "drop-shadow(0px 0px 8px #1d1d88)"}}
                         src={pixel_laboratory}
                    />
                </Grow>

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
                    on_close={this._handle_votes_menu_close}/>

                <PixelDialogPost
                    selected_locales_code={_selected_locales_code}
                    selected_currency={_selected_currency}
                    enable_3d={_enable_3d}
                    hbd_market={_hbd_market}
                    on_next={this._next_current_post}
                    on_previous={this._previous_current_post}
                    keepMounted={true}
                    post={_post}
                    post_img={_post_img}
                    open={pixel_post_dialog_opened}
                    onClose={this._handle_pixel_dialog_post_close}
                    onExited={this._handle_pixel_dialog_post_exited}
                    on_settings_changed={this._update_settings}
                />

                <AccountDialogProfileHive
                    keepMounted={true}
                    account_name={_post_author}
                    open={_post_author !== null && _post_permlink === null}
                    onClose={this._handle_reset_selected_account}/>

                <AccountDialogHiveKey open={_dialog_hive_key_open}
                                      key_type={"POSTING"}
                                      key_function={this._try_unlogged_vote}
                                      onClose={this._handle_dialog_hive_key_close}
                                      onError={this._handle_vote_error}
                                      onComplete={this._handle_vote_success}/>

            </div>
        );
    }
}

export default withStyles(styles)(Gallery);
