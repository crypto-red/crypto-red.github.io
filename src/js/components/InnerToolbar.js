import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = theme => ({
    "@keyframes innerToolbarCyberPunkAnimation": {
        "0%": { left: "0%"},
        "100%": { left: "70%"}
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
        color: theme.palette.secondary.contrastText,
        "&::before": {
            display: "flex",
            top: 0,
            left: 0,
            "content": "\"\"",
            position: "absolute",
            height: 40,
            width: "30%",
            /*background: "linear-gradient(to right, transparent, rgba(13, 50, 199, 0.27), transparent)",*/
            animation: "$innerToolbarCyberPunkAnimation 7.7s linear alternate infinite",
        },
        "&::-webkit-scrollbar": {
            display: "none"
        }
    },
    link: {
        color: theme.palette.secondary.contrastText,
        textDecoration: "none",
        height: "100%",
        display: "inline-block",
        fontSize: "15px"
    },
    innerToolbarTextWrapper: {
        position: "inherit",
        width: "100%"
    },
    innerToolbarText: {
        whiteSpace: "nowrap",
        padding: `0 ${theme.spacing(1)}px`,
        position: "inherit",
        display: "block"
    },
    innerToolbarProgress: {
        position: "inherit",
        display: "flex",
    },
    linearProgressVisible: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.primary.action,
        },
        marginTop: -4,
        height: 4,
        backgroundColor: "transparent",
        width: "50%",
        display: "flex",
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
            classes: props.classes
        };
    };

    componentDidMount() {

    }

    componentWillReceiveProps(new_props) {
        this.setState(new_props);
    }

    render() {

        const { classes, pathname, logged_account, know_if_logged, loaded_progress_percent } = this.state;

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
            <Button className={classes.innerToolbar}>
                <span className={classes.innerToolbarTextWrapper}>
                    <span className={classes.innerToolbarText}>
                        <Fade in={know_if_logged}><Link className={classes.link} to={logged_account ? "/": "/"}>{know_if_logged ? logged_account ? logged_account.name: t( "components.inner_toolbar.guest"): ""} </Link></Fade>
                        {pathame_items}
                    </span>
                    <div className={classes.innerToolbarProgress}>
                        <LinearProgress color="primary" variant="determinate" className={classes.linearProgressVisible} value={100 - loaded_progress_percent} style={{transform: "scaleX(-1)", webkitTransform: "scaleX(-1)"}}/>
                        <LinearProgress color="primary" variant="determinate" className={classes.linearProgressVisible} value={100 - loaded_progress_percent} />
                    </div>
                </span>
            </Button>
        );
    }
}

export default withStyles(styles)(InnerToolbar);
