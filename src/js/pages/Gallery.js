import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import ClockIcon from "../icons/Clock";
import TimeIcon from "../icons/Time";
import HotIcon from "../icons/Hot";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

import actions from "../actions/utils";

import PixelArtCard from "../components/PixelArtCard";

import { Masonry, CellMeasurer, CellMeasurerCache, createMasonryCellPositioner } from "react-virtualized";
import AppBar from "@material-ui/core/AppBar";
import PixelDialogPost from "../components/PixelDialogPost";

import AccountDialogProfileHive from "../components/AccountDialogProfileHive";
import MenuReactionPixelPost from "../components/MenuReactionPixelPost";

import { get_hive_posts, get_hive_post } from "../utils/api-hive"
import api from "../utils/api";
import {HISTORY} from "../utils/constants";

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
        overflow: "overlay",
        "& > .ReactVirtualized__Masonry": {
            position: "absolute",
            padding: "88px 16px 32px 16px",
            margin: 0,
            scrollBehavior: "smooth",
            overflow: "overlay",
            "& > .ReactVirtualized__Masonry__innerScrollContainer": {
                overflow: "hidden",
            }
        }
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
});

const SORTING_MODE = ["created", "active", "hot", "trending"];

class Gallery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            classes: props.classes,
            _history: HISTORY,
            _sorting_mode: SORTING_MODE,
            _sorting: props.pathname.split("/")[2] || "created",
            _sorting_tab_index: SORTING_MODE.indexOf(props.pathname.split("/")[2] || "created"),
            _selected_locales_code: null,
            _selected_currency: null,
            _hbd_market: null,
            _logged_account: null,
            _post_author: props.pathname.split("/")[3] || null,
            _post_permlink: props.pathname.split("/")[4] || null,
            _post: null,
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
            _load_more_threshold: 3000,
            _overscan_by_pixels: 2000,
            _cell_positioner: null,
            _masonry: null,

            _cell_measurer_cache: new CellMeasurerCache({
                defaultHeight: 356,
                defaultWidth: 356,
                fixedWidth: true,
                fixedHeight: false
            }),

            _scroll_top: 0,
            _top_scroll_of_el_by_index: [],
            _height_of_el_by_index: [],

            _reaction_click_event: null,
        };
    };

    componentWillReceiveProps(new_props) {

        const state = {
            classes: new_props.classes,
            _sorting: new_props.pathname.split("/")[2] || "created",
            _sorting_tab_index: SORTING_MODE.indexOf(new_props.pathname.split("/")[2] || "created"),
            _post_author: new_props.pathname.split("/")[3] || null,
            _post_permlink: new_props.pathname.split("/")[4] || null,
        };

        let get_post = false;
        let closed_post = false;

        if(state._post_author && state._post_permlink) {

            if(state._post_author !== this.state._post_author || state._post_permlink !== this.state._post_permlink || !this.state._post) {

                get_post = true;
            }
        }

        if(this.state._post_author && this.state._post_permlink) {

            if(!state._post_author && !state._post_permlink) {

                closed_post = true;
            }
        }

        this.setState(state, () => {

            if(get_post) {

                this._get_post();
            }else if(closed_post) {

                this._handle_pixel_dialog_post_closed();
            }
        });
    }

    componentDidMount() {

        window.addEventListener("resize", this._updated_dimensions);
        document.addEventListener("keydown", this._handle_keydown);

        actions.trigger_loading_update(0);
        setTimeout(() => {

            actions.trigger_loading_update(100);
        }, 250);

        this._update_settings();
        this._load_more_posts();
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

        const _logged_account = error ? null: result;
        this.setState({_logged_account});
    };

    _is_logged = () => {

        api.is_logged(this._process_is_logged_result);
    };

    _get_post = () => {

        const { _post_author, _post_permlink } = this.state;

        if(_post_author && _post_permlink) {

            get_hive_post({author: _post_author, permlink: _post_permlink}, (err, data) => {

                if(data) {

                    this.setState({_post: data});
                }
            });
        }
    };

    _load_more_posts = () => {

        const { _start_author, _start_permlink, _sorting } = this.state;
        get_hive_posts({limit: 21, tag: "pixel-art", sorting: _sorting, start_author: _start_author, start_permlink: _start_permlink}, (err, data) => {

            if(data.posts){


                this.setState({_posts: [...data.posts], _start_author: data.end_author, _start_permlink: data.end_permlink}, () => {

                    this._updated_dimensions();
                });
            }else {


            }
        });
    };

    componentWillUnmount() {

        window.removeEventListener("resize", this._updated_dimensions);
        document.removeEventListener("keydown", this._handle_keydown);
    }

    _handle_sorting_change = (event, _sorting_tab_index) => {

        const { _history, _sorting_mode } = this.state;

        const _sorting = _sorting_mode[_sorting_tab_index];

        const new_pathname = "/gallery/" + _sorting;
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

            this.state._cell_measurer_cache.clearAll();
            this._reset_cell_positioner();
            this._init_cell_positioner();
        });
    }

    _set_masonry_ref = (element) => {

        this.setState({_masonry: element});
    };

    _set_root_ref = (element) => {

        if(element === null) { return}
        this.setState({_root: element});
    };

    _cell_renderer = ({index, key, parent, style}) => {

        const { _hbd_market, _selected_currency, _selected_locales_code, _selected_post_index, _posts, _column_width, _cell_measurer_cache } = this.state;
        const post = _posts[index];
        const selected = _selected_post_index === index;
        style.width = _column_width;

        let {_top_scroll_of_el_by_index, _height_of_el_by_index} = this.state;
        _top_scroll_of_el_by_index[index] = style.top;
        _height_of_el_by_index[index] = style.height;
        this.setState({_top_scroll_of_el_by_index});

        return (
            <CellMeasurer cache={_cell_measurer_cache} index={index} key={key} parent={parent}>
                <div draggable={"false"} style={style}>
                    <PixelArtCard
                        selected={selected}
                        post={post}
                        hbd_market={_hbd_market}
                        selected_currency={_selected_currency}
                        selected_locales_code={_selected_locales_code}
                        on_author_click={this._handle_set_selected_account}
                        on_card_media_click={this._handle_art_open}
                        on_card_content_click={selected ? this._handle_art_open: this._handle_art_focus}
                        on_reaction_click={this._handle_art_reaction}/>
                </div>
            </CellMeasurer>
        );
    };

    _handle_set_selected_account = (author) => {

        const { _history, _sorting } = this.state;

        const new_pathname = "/gallery/" + _sorting + "/@" + author;
        _history.push(new_pathname);
    };

    _init_cell_positioner() {

        if (this.state._cell_positioner === null) {

            const { _cell_measurer_cache, _column_count, _column_width, _gutter_size } = this.state;

            let _cell_positioner = createMasonryCellPositioner({
                cellMeasurerCache: _cell_measurer_cache,
                columnCount: _column_count,
                columnWidth: _column_width,
                spacer: _gutter_size,
            });

            this.setState({_cell_positioner})
        }
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
                this.setState({_window_width, _window_height, _root_width: root_rect.width, _root_height: root_rect.height}, () => {

                    this._calculate_column_count();

                    if(!do_not_refresh_after) {

                        this._updated_dimensions(true);
                    }
                });
            }, do_not_refresh_after ? 0: 500);
        }else {

            setTimeout(() => {

                this._updated_dimensions();
            }, 100);
        }
    }

    _handle_art_open = (post, event) => {

        const { _history, _sorting } = this.state;

        const new_pathname = "/gallery/" + _sorting + "/@" + post.author + "/" + post.permlink;
        _history.push(new_pathname);
        actions.trigger_sfx("alert_high-intensity");
    };
    
    _handle_art_reaction = (event) => {

        this.setState({_reaction_click_event: {...event}});
    };

    _handle_reaction_menu_close = () => {

        this.setState({_reaction_click_event: null});
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

        const { _history, _sorting } = this.state;

        const new_pathname = "/gallery/" + _sorting;
        _history.push(new_pathname);
    };

    _next_current_post = () => {

        const { _post, _posts } = this.state;

        const index = _posts.indexOf(_post);

        if(index < _posts.length-1) {

            this.setState({_post: [..._posts][index+1]});
            actions.trigger_sfx("navigation_transition-right");

            setTimeout(() => {

                this._update_selected_post_index(index+1, true);
            }, 4000);
        }
    };

    _previous_current_post = () => {

        const { _post, _posts } = this.state;

        const index = _posts.indexOf(_post);

        if(index > 0) {

            this.setState({_post: [..._posts][index-1]});
            actions.trigger_sfx("navigation_transition-left");

            this._update_selected_post_index(index-1, true);
        }
    };

    _handle_keydown = (event) => {

        let { _selected_post_index, _post_closed_at, _posts, _post } = this.state;
        const { _top_scroll_of_el_by_index, _height_of_el_by_index } = this.state;

        if(!_post && _post_closed_at + 300 < Date.now()) {

            event.preventDefault();

            let index = _selected_post_index;
            let scroll_top = _top_scroll_of_el_by_index[_selected_post_index];
            let height = _height_of_el_by_index[_selected_post_index];

            const top_scroll_of_middle_el_by_top_scroll = _top_scroll_of_el_by_index.map((e, i) => {

                return {
                    index: i,
                    scroll: e,
                    height: _height_of_el_by_index[i],
                };

            }).sort((a, b) => { return a.scroll - b.scroll });

            let index_in_sorted = top_scroll_of_middle_el_by_top_scroll.indexOf(
                top_scroll_of_middle_el_by_top_scroll.find(e => e.index === index)
            );

            switch (event.keyCode) {

                case 38:
                    for (let i = index_in_sorted; i >= 0; i--) {

                        if(top_scroll_of_middle_el_by_top_scroll[i].scroll + top_scroll_of_middle_el_by_top_scroll[i].height + 8 <= scroll_top) {

                            _selected_post_index = top_scroll_of_middle_el_by_top_scroll[i].index;
                            i = -1;
                        }
                    }
                    break;
                case 40:
                    for (let i = index_in_sorted; i < top_scroll_of_middle_el_by_top_scroll.length; i++) {

                        if(top_scroll_of_middle_el_by_top_scroll[i].scroll - 8 - height >= scroll_top) {

                            _selected_post_index = top_scroll_of_middle_el_by_top_scroll[i].index;
                            i = 1 / 0;
                        }
                    }
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

                setTimeout(() => {

                    this._scroll_to_index();
                }, 10);
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

        const { clientHeight , scrollHeight, scrollTop } = scroll_data;

        this.setState({_scroll_top: scrollTop});
    };

    _open_selected_post_index = () => {

        const {_selected_post_index, _posts} = this.state;

        this.setState({_post: _posts[_selected_post_index]});
    };

    _handle_reset_selected_account = () => {

        const { _history, _sorting } = this.state;

        const new_pathname = "/gallery/" + _sorting;
        _history.push(new_pathname);
    }

    render() {

        const { classes,  _sorting_tab_index, _window_width, _window_height, _posts, _post, _scrolling_reset_time_interval, _post_author, _post_permlink } = this.state;
        const { _cell_positioner, _cell_measurer_cache, _load_more_threshold, _overscan_by_pixels, _scroll_top, _reaction_click_event } = this.state;

        const width = _window_width;
        const height = _window_height;

        const page_width = (width > 960) ? width-256: width;
        const post_list_window_margin_top = (width > 960) ?
            64:
            56;
        const post_list_height = height - post_list_window_margin_top;

        const masonry_element = (_cell_positioner !== null) ?
            <MasonryExtended
                onScroll={this._handle_masonry_scroll}
                scrollingResetTimeInterval={_scrolling_reset_time_interval}
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
                </div>

                <div className={classes.masonry} style={{transform: "translateZ(0px)"}}>
                    {masonry_element}
                </div>

                <MenuReactionPixelPost event={_reaction_click_event} on_close={this._handle_reaction_menu_close} />

                <PixelDialogPost
                    on_next={this._next_current_post}
                    on_previous={this._previous_current_post}
                    on_image_load_complete={() => {setTimeout(() => {this._scroll_to_index()}, 5)}}
                    keepMounted={true}
                    post={_post}
                    open={Boolean(_post)}
                    onClose={this._handle_pixel_dialog_post_close}/>

                <AccountDialogProfileHive account_name={_post_author} open={_post_author !== null && _post_permlink === null} onClose={this._handle_reset_selected_account}/>
            </div>
        );
    }
}

export default withStyles(styles)(Gallery);
