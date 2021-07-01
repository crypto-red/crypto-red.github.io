import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { t } from "../utils/t";

import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import LinearProgress from "@material-ui/core/LinearProgress";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DeleteIcon from "@material-ui/icons/Delete";
import BackupIcon from "@material-ui/icons/Backup";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import RefreshIcon from "@material-ui/icons/Refresh";
import ListItemText from "@material-ui/core/ListItemText";
import { grey } from "@material-ui/core/colors";
import CardActionArea from "@material-ui/core/CardActionArea";

import { COINS, HISTORY } from "../utils/constants";
import api from "../utils/api";
import actions from "../actions/utils";

import price_formatter from "../utils/price-formatter";
import Jdenticon from "react-jdenticon";

const styles = theme => ({
    accountCard: {
    },
    linearProgressVisible: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.secondary.light
        },
        opacity: 1,
        backgroundColor: "#110b5d26",
    },
    linearProgressHidden: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.secondary.light
        },
        opacity: 0,
        backgroundColor: "#110b5d26",
        animation: "$hide 1.5s",
        "@global": {
            "@keyframes hide": {
                "0%": {
                    opacity: 1,
                },
                "85%": {
                    opacity: 1,
                },
                "100%": {
                    opacity: 0,
                },
            }
        }
    },
    cardHeaderMarginTop: {
        paddingTop: theme.spacing(2)-4
    },
    balanceActive: {
        textAlign: "center",
        color: theme.palette.primary.main
    },
    balance: {
        textAlign: "center",
        color: grey[500]
    },
    cardAction: {
        display: "flow-root"
    },
    floatRight: {
        float: "right"
    },
    avatar: {
        backgroundColor: "transparent"
    },
    styledBadgeConnected: {
        "& .MuiBadge-badge": {
            backgroundColor: "#44b700",
            color: "#44b700",
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            "&::after": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: "$ripple 1.2s infinite ease-in-out",
                border: "1px solid currentColor",
                content: "\"\"",
            },
        },
        "@global": {
            "@keyframes ripple": {
                "0%": {
                    transform: "scale(.8)",
                    opacity: 1,
                },
                "100%": {
                    transform: "scale(2.4)",
                    opacity: 0,
                },
            }
        }
    },
    styledBadgeDisconnected: {
        "& .MuiBadge-badge": {
            backgroundColor: "red",
            color: "red",
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            "&::after": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "1px solid currentColor",
                content: "\"\"",
            },
        }
    }
});

class AccountCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            account: props.account,
            current: props.current,
            selected_locales_code: props.selected_locales_code,
            selected_currency: props.selected_currency,
            coins_markets: props.coins_markets,
            display_after_ms: props.display_after_ms,
            _coins: COINS,
            _balance: {},
            _full_balance_length: 5,
            _history: HISTORY,
            _account_menu_anchor_element: null,
            _price_formatter: price_formatter
        };
    };

    componentDidMount() {

        this._refresh_balance();
    }

    componentWillReceiveProps(new_props) {

        if(new_props.current && (this.state.account.name !== new_props.account.name || this.state.current !== new_props.current)) {

            this.setState(new_props, () => {

                this._refresh_balance();
            });
        }else {

            this.setState(new_props);
        }
    }

    _refresh_balance_result = (error, response, crypto_id) => {

        if(!error) {

            let { _balance } = this.state;
            _balance[crypto_id] = response;
            this.setState({_balance});
        }else {

            actions.trigger_snackbar(t( "account_card.crypto_balance_error", {crypto_id}));
        }
    };

    _refresh_balance = () => {

        const { account, _coins } = this.state;

        if(account) {

            if(account.seed) {

                this.setState({_balance: {}}, () => {

                    _coins.forEach(coin => {

                        api.get_balance_by_seed(coin.id, account.seed, (error, result) => {this._refresh_balance_result(error, result, coin.id)});
                    });
                });
            }
        }
    };

    _open_account_menu = (event) => {

        this.setState({_account_menu_anchor_element: event.currentTarget});
    };

    _close_account_menu = () => {

        this.setState({_account_menu_anchor_element: null});
    };

    _open_account_dashboard = () =>  {

        const { _history, current } = this.state;

        if(current) {

            _history.push("/dashboard");
        }

    }

    render() {

        const { classes, account, current, coins_markets, selected_locales_code, selected_currency, _full_balance_length, _account_menu_anchor_element, _price_formatter, display_after_ms, _balance } = this.state;

        let balance_fiat = 0;
        let balance_length = 0;

        if(Boolean(coins_markets)) {

            Object.entries(_balance).forEach(entry => {

                const [key, value] = entry;

                let coin_market = null;
                for(let i = 0; i < coins_markets.length; i++) {

                    if(coins_markets[i].id === key){

                        coin_market = coins_markets[i];
                    }
                }

                if(Boolean(coin_market)) {

                    balance_fiat += coin_market.current_price * value;
                    balance_length++;
                }
            });
        }

        const loaded_balance_percent =  Math.floor(100 * parseFloat(Object.entries(_balance).length / _full_balance_length));
        const linear_progress = current ? <LinearProgress color="primary" variant="determinate" className={loaded_balance_percent === 100 ? classes.linearProgressHidden: classes.linearProgressVisible} value={loaded_balance_percent}/>: null;

        return (
            <Fade timeout={display_after_ms} in>
                <Card className={classes.accountCard} raised={current}>
                    {linear_progress}
                    <CardHeader
                        className={current ? classes.cardHeaderMarginTop: null}
                        avatar={
                            <Badge
                                className={current ? classes.styledBadgeConnected: classes.styledBadgeDisconnected}
                                overlap="circle"
                                badgeContent=" "
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                variant="dot">
                                <Avatar className={classes.avatar} variant="square">
                                    <Jdenticon size="48" value={account.name} />
                                </Avatar>
                            </Badge>
                        }
                        action={
                            <div>
                                <IconButton edge="end"
                                            aria-label={t("words.account")}
                                            aria-haspopup="true"
                                            color="inherit"
                                            onClick={this._open_account_menu}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu anchorEl={_account_menu_anchor_element}
                                      anchorOrigin={{ vertical: "top", horizontal: "right"}}
                                      keepMounted
                                      transformOrigin={{ vertical: "top", horizontal: "right",}}
                                      open={Boolean(_account_menu_anchor_element)}
                                      onClose={this._close_account_menu} >
                                    <MenuItem onClick={(event) => {this.props.delete(event, account)}}>
                                        <ListItemIcon>
                                            <DeleteIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t("words.delete", {}, {FLC: true})}/>
                                    </MenuItem>
                                    {
                                        current ?
                                            <MenuItem onClick={(event) => {this.props.backup(event, account)}}>
                                                <ListItemIcon>
                                                    <BackupIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={t("words.backup", {}, {FLC: true})}/>
                                            </MenuItem>: null
                                    }
                                    {
                                        current ?
                                            <MenuItem onClick={(event) => {this._refresh_balance()}}>
                                                <ListItemIcon>
                                                    <RefreshIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={t("words.refresh", {}, {FLC: true})}/>
                                            </MenuItem>: null
                                    }

                                </Menu>
                            </div>
                        }
                        title={account.name}
                        subheader={new Intl.DateTimeFormat(selected_locales_code).format(account.timestamp)}
                    />
                    <CardActionArea onClick={this._open_account_dashboard}>
                        <CardContent>
                            {
                                current ?
                                    <h2 className={classes.balanceActive}>
                                        {Boolean(coins_markets) ?
                                            <Fade timeout={display_after_ms+50} in><span>{_price_formatter(balance_fiat, selected_currency, selected_locales_code)}</span></Fade>
                                            :
                                            t("sentence.loading", {}, {FLC: true})
                                        }
                                    </h2>:
                                    <h2 className={classes.balance}>
                                        <Fade timeout={display_after_ms+50} in><span>Unknown</span></Fade>
                                    </h2>
                            }
                        </CardContent>
                    </CardActionArea>
                    <CardActions className={classes.cardAction}>
                        <Button startIcon={Boolean(current) ? <LockIcon key={"1"}/>: <LockOpenIcon key={"2"}/>}
                                className={classes.floatRight}
                                color="primary"
                                onClick={(event) => {this.props.onToggle(event, account)}}>
                            {Boolean(current) ? t("words.close"): t("words.open")}
                        </Button>
                    </CardActions>
                </Card>
            </Fade>
        );
    }
}

export default withStyles(styles)(AccountCard);
