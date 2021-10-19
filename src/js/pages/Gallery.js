import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import ClockIcon from "../icons/Clock";
import TimeIcon from "../icons/Time";
import HotIcon from "../icons/Hot";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

import images from "../utils/images";
import actions from "../actions/utils";

import PixelArtCard from "../components/PixelArtCard";

import { Masonry, CellMeasurer, CellMeasurerCache, AutoSizer, createMasonryCellPositioner } from "react-virtualized";
import AppBar from "@material-ui/core/AppBar";
import PixelDialogPost from "../components/PixelDialogPost";

import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";

import RedAngryEmojiSvg from "../twemoji/react/1F621";
import AngryEmojiSvg from "../twemoji/react/1F624";
import CoolEmojiSvg from "../twemoji/react/1F60E";
import LoveEmojiSvg from "../twemoji/react/1F60D";
import AngelEmojiSvg from "../twemoji/react/1F607";
import get_svg_in_b64 from "../utils/svgToBase64";

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
    imageListItem: {

    },
    image: {
        imageRendering: "pixelated",
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


class Gallery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            classes: props.classes,
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
            _images: images,
            _posts: [],
            _average_img_ratio: 1,
            _sorting_tab_index: 0,

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

            _reaction_menu_x: null,
            _reaction_menu_y: null,
        };
    };

    componentDidMount() {

        window.addEventListener("resize", this._updated_dimensions);
        document.addEventListener("keydown", this._handle_keydown);

        actions.trigger_loading_update(0);
        setTimeout(() => {

            actions.trigger_loading_update(100);
        }, 250);

        this._load_images();
    }

    componentWillUnmount() {

        window.removeEventListener("resize", this._updated_dimensions);
        document.removeEventListener("keydown", this._handle_keydown);
    }

    _load_more = () => {

        const { _sorting, _tag, _limit } = this.state;
        this._updated_dimensions();
    };

    _handle_sorting_change = (_sorting) => {


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

        const { _selected_post_index, _posts, _column_width, _cell_measurer_cache } = this.state;
        const post = _posts[index];

        let {_top_scroll_of_el_by_index, _height_of_el_by_index} = this.state;
        _top_scroll_of_el_by_index[index] = style.top;
        _height_of_el_by_index[index] = style.height;
        this.setState({_top_scroll_of_el_by_index});

        return (
            <CellMeasurer cache={_cell_measurer_cache} index={index} key={key} parent={parent}>
                <div draggable={"false"} style={{
                    ...style,
                    width: _column_width,
                }}>
                    <PixelArtCard
                        selected={_selected_post_index === index}
                        post={post}
                        on_card_media_click={this._handle_art_open}
                        on_card_content_click={this._handle_art_focus}
                        on_reaction_click={this._handle_art_reaction}/>
                </div>
            </CellMeasurer>
        );
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

    _load_images = () => {

        this.state._images.forEach((base64) => {

            const img = new Image();

            img.onload = () => {
                const width = img.width;
                const height = img.height;

                this._push_loaded_image({base64, width, height});
            };

            img.src = base64;
        });
    };

    _push_loaded_image = (loaded_image) =>{

        let { _images, _posts } = this.state;

        _posts.push({
            image: loaded_image,
        });

        const all_images_loaded = (_images.length === _posts.length);

        if(all_images_loaded) {

            this.setState({_posts}, () => {

                this._on_all_images_loaded();
            });
        }else {

            this.setState({_posts});
        }
    };

    _on_all_images_loaded = () => {

        setTimeout(() => {

            this._updated_dimensions();
        }, 500);
    };

    _handle_art_open = (post, event) => {

        this.setState({_post: post}, () => {

            this._update_selected_post_index();
        });
        actions.trigger_sfx("alert_high-intensity");
    };
    
    _handle_art_reaction = (event) => {

        this.setState({
            _reaction_menu_x: event.clientX - 120,
            _reaction_menu_y: event.clientY - 20,
        });
    };

    _handle_reaction_menu_close = () => {

        this.setState({
            _reaction_menu_x: null,
            _reaction_menu_y: null,
        });
    };

    _handle_art_focus = (post, event) => {

        const { _posts } = this.state;

        const selected_post_index = _posts.indexOf(post);

        this._update_selected_post_index(selected_post_index);
    };


    _handle_pixel_dialog_post_close = () => {

        this.setState({_post: null, _post_closed_at: Date.now()});
        actions.trigger_sfx("state-change_confirm-down");
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
    }

    render() {

        const { classes,  _sorting_tab_index, _window_width, _window_height, _posts, _post, _scrolling_reset_time_interval } = this.state;
        const { _cell_positioner, _cell_measurer_cache, _load_more_threshold, _overscan_by_pixels, _scroll_top, _reaction_menu_x, _reaction_menu_y } = this.state;

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

                <Menu
                    className={classes.reactionMenu}
                    PaperProps={{
                        style: {
                            height: 48,
                            width: 240,
                            overflowY: "overlay"
                        },
                    }}
                    keepMounted={false}
                    open={_reaction_menu_y !== null}
                    onClose={this._handle_reaction_menu_close}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        _reaction_menu_y !== null && _reaction_menu_x !== null
                            ? { top: _reaction_menu_y, left: _reaction_menu_x }
                            : undefined
                    }
                >
                    <div>
                        <IconButton className={classes.reactionMenuIconButton}>
                            <RedAngryEmojiSvg />
                        </IconButton>
                        <IconButton className={classes.reactionMenuIconButton}>
                            <AngryEmojiSvg />
                        </IconButton>
                        <IconButton className={classes.reactionMenuIconButton}>
                            <CoolEmojiSvg />
                        </IconButton>
                        <IconButton className={classes.reactionMenuIconButton}>
                            <LoveEmojiSvg />
                        </IconButton>
                        <IconButton className={classes.reactionMenuIconButton}>
                            <AngelEmojiSvg />
                        </IconButton>
                    </div>
                </Menu>

                <PixelDialogPost
                    on_next={this._next_current_post}
                    on_previous={this._previous_current_post}
                    on_image_load_complete={() => {setTimeout(() => {this._scroll_to_index()}, 5)}}
                    keepMounted={true}
                    post={_post}
                    open={Boolean(_post)}
                    onClose={this._handle_pixel_dialog_post_close}/>

            </div>
        );
    }
}

export default withStyles(styles)(Gallery);
