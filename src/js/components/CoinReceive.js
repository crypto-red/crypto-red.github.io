import React from "react";
import { withStyles } from "@material-ui/core/styles"

import { t } from "../utils/t";

import Fade from "@material-ui/core/Fade";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

import FileCopyIcon from "@material-ui/icons/FileCopy";

import api from "../utils/api";
import actions from "../actions/utils";
import { HISTORY, COINS_IMAGES } from "../utils/constants";
import clipboard from "clipboard-polyfill";
import QRCode from "qrcode.react";

const styles = theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 0)
        }
    },
    qrcode: {
        padding: 16,
        "& path:first-child": {
            fill: theme.palette.primary.contrastText
        },
        "& path:last-child": {
            fill: theme.palette.primary.main
        }
    },
    underCardButtonContainer: {
        marginTop: theme.spacing(1),
        textAlign: "right",
    },
    underCardButton: {
        minWidth: "calc(50% - 8px)",
        [theme.breakpoints.only("xs")]: {
            margin: theme.spacing(0, 1, 0, 0)
        }
    },
    noAccountImage: {
        padding: theme.spacing(4),
        width: "100%"
    },
});


class CoinReceive extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            coin_id: props.coin_id,
            coin_data: props.coin_data,
            logged_account: props.logged_account,
            we_know_if_logged: props.we_know_if_logged,
            _address: null,
            _history: HISTORY
        };
    };

    componentDidMount() {

        this._get_address_by_seed();
    }

    componentWillReceiveProps(new_props) {

        const { coin_id, logged_account } = this.state;

        this.setState({...new_props}, () => {

            if(new_props.logged_account) {

                if(coin_id !== new_props.coin_id || logged_account !== new_props.logged_account) {

                    this._get_address_by_seed();
                }
            }
        });

    }

    _get_address_by_seed = () => {

        const { coin_id, logged_account } = this.state;

        if(logged_account) {

            const hive_username = logged_account.hive_username || "";

            actions.trigger_loading_update(0);
            const address = api.get_address_by_seed(coin_id, logged_account.seed, hive_username);
            this.setState({_address: address}, () => {

                actions.trigger_loading_update(100);
            });
        }else {

            actions.trigger_loading_update(100);
        }
    };

    _copy_address = (event, address) => {

        if(address !== null) {

            clipboard.writeText(address).then(
                function () {

                    actions.trigger_snackbar(t( "sentences.address successfully copied"));
                    actions.trigger_sfx("navigation_forward-selection");
                    actions.jamy_update("happy");
                },
                function () {

                    actions.trigger_snackbar(t( "sentences.cannot copy this address"));
                    actions.trigger_sfx("navigation_backward-selection");
                    actions.jamy_update("annoyed");
                }
            );
        }else {

            actions.trigger_snackbar(t( "sentences.cannot copy a non-existent address"));
            actions.trigger_sfx("navigation_backward-selection");
            actions.jamy_update("annoyed");
        }
    }

    _open_accounts_page = () => {

        const { _history } = this.state;
        _history.push("/accounts");
    };

    render() {

        const { classes, coin_id, coin_data, logged_account, _address, we_know_if_logged } = this.state;

        return (
            <div>
                {we_know_if_logged ?
                    <Fade in>
                        <Container maxWidth="sm" className={classes.container}>
                            <Card>
                                <CardHeader
                                    title={t( "words.receive", {FLC: true})}
                                />
                                <CardContent>
                                    {_address ?
                                        <div>
                                            <QRCode
                                                className={classes.qrcode}
                                                level={"M"}
                                                style={{width: "100%", height: "100%"}}
                                                renderAs={"svg"}
                                                value={_address}
                                                imageSettings={{
                                                    src: COINS_IMAGES[coin_id] || "",
                                                    x: null,
                                                    y: null,
                                                    height: 24,
                                                    width: 24,
                                                    excavate: true,
                                                }}/>
                                            <FormControl fullWidth>
                                                <InputLabel htmlFor="address">{t("words.address", {FLC: true})}</InputLabel>
                                                <Input
                                                    value={_address}
                                                    id="address"
                                                    type="text"
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label={t( "sentences.copy address")}
                                                                onClick={(event) => this._copy_address(event, _address)}
                                                                edge="end"
                                                            >
                                                                <FileCopyIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
                                        </div> :
                                        <div>
                                            <img className={classes.noAccountImage} src="/src/images/account.svg"/>
                                            <p>{t("sentences.you must open an account")}</p>
                                        </div>}
                                </CardContent>
                            </Card>
                            {logged_account ?
                                <div className={classes.underCardButtonContainer}>
                                    <Button className={classes.underCardButton} color="primary" variant="contained" onClick={(event) => this._copy_address(event, _address)}>
                                        {t( "sentences.copy address")}
                                    </Button>
                                </div>:
                                <div className={classes.underCardButtonContainer}>
                                    <Button className={classes.underCardButton} color="primary" variant="contained" onClick={this._open_accounts_page}>
                                        {t( "sentences.open an account")}
                                    </Button>
                                </div>
                            }
                        </Container>
                    </Fade>:
                    null
                }
            </div>
        );
    }
}

export default withStyles(styles)(CoinReceive);
