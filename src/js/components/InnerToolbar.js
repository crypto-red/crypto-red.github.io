import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import Fade from "@material-ui/core/Fade";

const styles = theme => ({
    "@keyframes innerToolbarCyberPunkAnimation": {
        "0%": { left: "0%"},
        "100%": { left: "70%"}
    },
    "@keyframes innerToolbarCrtGlow": {
        "0%": { backgroundColor: "#000844"},
        "100%": { backgroundColor: "#010648"}
    },
    innerToolbar: {
        cursor: "pointer",
        height: 40,
        lineHeight: "40px",
        borderRadius: 4,
        display: "flex",
        width: "100%",
        overflow: "auto",
        transition: "background-color ease-in-out .3s",
        /* 71 BPM = .42 || 77 BPM = .384 */
        /*animation: "$innerToolbarCrtGlow .384s linear alternate infinite",*/
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
        "&::before": {
            display: "flex",
            top: 0,
            left: 0,
            "content": "\"\"",
            position: "relative",
            height: 40,
            width: "30%",
            background: "linear-gradient(to right, transparent, rgba(13, 50, 199, 0.27), transparent)",
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
        marginLeft: "-30%",
        width: "100%"
    },
    innerToolbarText: {
        whiteSpace: "nowrap",
        padding: `0 ${theme.spacing(1)}px`,
        position: "inherit",
        display: "block"
    }
    
});

class InnerToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pathname: props.pathname,
            logged_account: props.logged_account,
            know_if_logged: props.know_if_logged,
            classes: props.classes
        };
    };

    componentDidMount() {

    }

    componentWillReceiveProps(new_props) {
        this.setState(new_props);
    }

    render() {

        const { classes, pathname, logged_account, know_if_logged } = this.state;

        let pathname_splitted = pathname.split("/");
        pathname_splitted.shift();
        
        const pathame_items = pathname_splitted.map((element, index, array) => {
           
            let link_to = "/";
            for (let i = 0; i <= index; i++) { 
                
                link_to += array[i] + (i === index ? "": "/");
            }
            
            
            return element === "" ? null: <Fade in key={index} timeout={index*50}><Link key={index} to={link_to} className={classes.link} >&nbsp;›&nbsp;{element}</Link></Fade>;
        });
        
        return (
            <div className={classes.innerToolbar}>
                <span className={classes.innerToolbarTextWrapper}>
                    <span className={classes.innerToolbarText}>
                        <Fade in={know_if_logged} timeout={0}><Link className={classes.link} to={logged_account ? "/": "/"}>{know_if_logged ? logged_account ? logged_account.name: "Guest": ""} </Link></Fade>
                        {pathame_items}
                    </span>
                </span>
            </div>
        );
    }
}

export default withStyles(styles)(InnerToolbar);
