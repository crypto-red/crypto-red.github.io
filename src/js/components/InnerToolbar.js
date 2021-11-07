import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";
import { HISTORY } from "../utils/constants";

import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";

const styles = theme => ({
    "@keyframes innerToolbarCyberPunkAnimation": {
        "0%": { left: "0%"},
        "100%": { left: "70%"}
    },
    root: {
        display: "flex",
        position: "relative",
        width: "100%",
    },
    innerToolbar: {
        cursor: "pointer",
        height: 40,
        lineHeight: "40px",
        borderRadius: 4,
        display: "flex",
        position: "relative",
        width: "100%",
        overflow: "auto",
        textTransform: "none",
        textAlign: "inherit",
        padding: 0,
        backgroundColor: theme.palette.secondary.light,
        "&:hover": {
            backgroundColor: theme.palette.secondary.lighter,
        },
        color: "#d7dbff",
        "&::before": {
            display: "flex",
            top: 0,
            left: 0,
            "content": "\"\"",
            position: "absolute",
            height: 40,
            width: "30%",
            background: "linear-gradient(to right, transparent, rgba(13, 50, 199, 0.27), transparent)",
            animation: "$innerToolbarCyberPunkAnimation 7.7s linear alternate infinite",
        },
        boxShadow: "inset 0px 0px 6px #0035ff17, inset 0px 0px 24px #9eaaf12b, inset 0px 0px 48px #95a8ff17",
        "&::-webkit-scrollbar": {
            display: "none"
        }
    },
    link: {
        color: "#d7dbff",
        textDecoration: "none",
        height: "100%",
        lineHeight: "100%",
        display: "inline-block",
        fontSize: "15px"
    },
    innerToolbarTextWrapperContainer: {
        position: "absolute",
        width: "100%",
        top: 0,
    },
    innerToolbarTextWrapper: {
        position: "absolute",
        width: "100%"
    },
    innerToolbarInput: {
        position: "relative",
        width: "100%",
        display: "block",
    },
    innerToolbarText: {
        whiteSpace: "nowrap",
        position: "relative",
        width: "100%",
        display: "block",
        textShadow: `0px 0px ${theme.spacing(1)}px ${theme.palette.secondary.light}`,
        "& > *:first-child": {
            marginLeft: theme.spacing(1),
        },
        "& > *:last-child": {
            marginRight: theme.spacing(1),
        },
    },
    innerToolbarProgress: {
        position: "inherit",
        display: "flex",
        width: "100%",
    },
    linearProgressVisible: {
        "& .MuiLinearProgress-barColorPrimary": {
            background: `linear-gradient(90deg, ${theme.palette.primary.actionLighter} 0%, ${theme.palette.primary.action} 100%);`,
            zIndex: -1,
        },
        zIndex: 1,
        marginBottom: -3,
        height: 3,
        backgroundColor: "transparent",
        width: "50%",
        display: "flex",
    },
    linearProgressVisibleOffline: {
        "& .MuiLinearProgress-barColorPrimary": {
            background: `linear-gradient(90deg, ${theme.palette.primary.actionRedLighter} 0%, ${theme.palette.primary.actionRed} 100%);`,
            zIndex: -1,
        },
        zIndex: 1,
        marginBottom: -3,
        height: 3,
        backgroundColor: "transparent",
        width: "50%",
        display: "flex",
    },
    searchIcon: {
        right: 0,
        top: 0,
        height: "100%",
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.primary.contrastText,
        zIndex: 2,
    },
    inputRoot: {
        color: "inherit",
    },
    inputInput: {
        padding: theme.spacing(1, 0, 1, 1),
        paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
        width: '100%',
        "input&::placeholder": {
            color: "#d7dbff",
            opacity: .666,
            fontSize: "15px"
        }
    },
});

class InnerToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pathname: props.pathname,
            logged_account: props.logged_account,
            know_if_logged: props.know_if_logged,
            loaded_progress_percent: props.loaded_progress_percent,
            classes: props.classes,
            _is_search_bar_active: props.pathname.split("/")[3] === "search",
            _search_bar_value: decodeURI(props.pathname.split("/")[4] || ""),
            _history: HISTORY,
            _pathname_before_search: null,
            _search_input_ref: null,
        };
    };

    componentDidMount() {

    }

    _set_search_input_ref = (element) => {

        if(element) {

            console.log(element);
            element.addEventListener("keydown", this._handle_search_input_keydown)
            this.setState({_search_input_ref: element});
        }
    }

    componentWillUnmount() {

        this.state._search_input_ref.removeEventListener("keydown", this._handle_search_input_keydown)
    }

    _handle_search_input_keydown = (event) => {

        const { _search_bar_value, _history, pathname } = this.state;

        const key_id = event.keyCode;
        switch(key_id) {
            case 8:
                if(_search_bar_value === "") {

                    this._toggle_search_bar_activation();
                }
                break;
            case 46:
                if(_search_bar_value === "") {

                    this._toggle_search_bar_activation();
                }else {

                    const search_sorting_mode = /(newest|relevance|popularity)/g.test(pathname.split("/")[2]) ? pathname.split("/")[2]: "relevance";
                    _history.replace("/gallery/" + search_sorting_mode + "/search/", _history.location.state);
                }
                break;
            default:
                break;
        }

    }

    componentWillReceiveProps(new_props) {

        const _is_search_bar_active = new_props.pathname.split("/")[3] === "search";
        const _search_bar_value = decodeURI(new_props.pathname.split("/")[4] || "");

        const state = {
            ...new_props,
            _is_search_bar_active,
            _search_bar_value,
        };

        this.setState(state);
    }

    _toggle_search_bar_activation = () => {

        const { _history, _pathname_before_search, pathname } = this.state;
        if(this.state._is_search_bar_active) {

            if(_pathname_before_search) {

                _history.push(_pathname_before_search)
            }else {

                _history.push("/gallery")
            }
        }else {

            this.setState({_pathname_before_search: pathname}, () => {

                _history.push("/gallery/newest/search/");
            });
        }
    };

    _handle_search_input_change = (event) => {

        const { _history, pathname } = this.state;
        const value = event.target.value;

        const search_sorting_mode = /(newest|relevance|popularity)/g.test(pathname.split("/")[2]) ? pathname.split("/")[2]: "relevance";
        _history.replace("/gallery/" + search_sorting_mode + "/search/" + encodeURI(value).slice(0, 64), _history.location.state);
    }

    render() {

        const { classes, pathname, logged_account, know_if_logged, loaded_progress_percent, _search_bar_value, _is_search_bar_active } = this.state;

        let pathname_splitted = pathname.split("/");
        pathname_splitted.shift();
        
        const pathame_items = pathname_splitted.map((element, index, array) => {
           
            let link_to = "/";
            for (let i = 0; i <= index; i++) { 
                
                link_to += array[i] + (i === index ? "": "/");
            }
            
            
            return element === "" ? null: <Fade in={know_if_logged}  key={index}><Link key={index} to={link_to} className={classes.link} >&nbsp;›&nbsp;{element}</Link></Fade>;
        });
        
        return (
            <div className={classes.root}>
                <Button className={classes.innerToolbar} disableFocusRipple>
                    <span className={classes.innerToolbarTextWrapperContainer}>
                        <span className={classes.innerToolbarTextWrapper}>
                            <div className={classes.innerToolbarProgress}>
                                <LinearProgress
                                    color="primary"
                                    variant="determinate"
                                    className={navigator.onLine ? classes.linearProgressVisible: classes.linearProgressVisibleOffline}
                                    value={100 - loaded_progress_percent}
                                    style={{transform: "rotate(-180deg)", webkitTransform: "rotate(-180deg)"}}/>
                                <LinearProgress
                                    color="primary"
                                    variant="determinate"
                                    className={navigator.onLine ? classes.linearProgressVisible: classes.linearProgressVisibleOffline}
                                    value={100 - loaded_progress_percent} />
                            </div>
                            {
                                _is_search_bar_active && pathname.includes("gallery") ?
                                    <InputBase
                                        inputProps={{
                                            "aria-label": "search"
                                        }}
                                        inputRef={this._set_search_input_ref}
                                        autoFocus
                                        selectionFollowsFocus={false}
                                        className={classes.innerToolbarInput}
                                        placeholder="search…"
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                        onChange={this._handle_search_input_change}
                                        value={_search_bar_value}
                                    />:
                                    <span className={classes.innerToolbarText} style={pathname.includes("gallery") ? {width: "calc(100% - 36px)", overflow: "scroll"}: {}}>
                                        <Fade in={know_if_logged}><Link className={classes.link} to={logged_account ? "/": "/"}>{know_if_logged ? logged_account ? logged_account.name: t( "components.inner_toolbar.guest"): ""} </Link></Fade>
                                        {pathame_items}
                                    </span>
                            }
                        </span>
                    </span>
                </Button>
                <IconButton style={pathname.includes("gallery") ? {}: {display: "none"}} className={classes.searchIcon} onClick={this._toggle_search_bar_activation}>
                    {_is_search_bar_active ? <CloseIcon />: <SearchIcon />}
                </IconButton>
            </div>
        );
    }
}

export default withStyles(styles)(InnerToolbar);
