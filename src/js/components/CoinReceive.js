import React from "react";
import { withStyles } from "@material-ui/core/styles"

import { t } from "../utils/t";

import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
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
import { HISTORY } from "../utils/constants";
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

            actions.trigger_loading_update(0);
            const address = api.get_address_by_seed(coin_id, logged_account.seed);
            this.setState({_address: address}, () => {

                actions.trigger_loading_update(100);
            });
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

            actions.trigger_snackbar(t( "sentences.cannot copy a null address"));
            actions.trigger_sfx("navigation_backward-selection");
            actions.jamy_update("annoyed");
        }
    }

    _open_accounts_page = () => {

        const { _history } = this.state;
        _history.push("/accounts");
    };

    render() {

        const { classes, coin_data, _address } = this.state;

        return (
            <div>
                <Container maxWidth="sm" className={classes.container}>
                    <Card>
                        <CardHeader
                            title={t( "words.receive", {}, {FLC: true})}
                        />
                        {
                            _address ?
                                <CardContent>
                                    <QRCode
                                        className={classes.qrcode}
                                        level={"M"}
                                        style={{width: "100%", height: "100%"}}
                                        renderAs={"svg"}
                                        value={_address}
                                        imageSettings={{
                                            src: coin_data ? coin_data.image.large: "",
                                            x: null,
                                            y: null,
                                            height: 24,
                                            width: 24,
                                            excavate: true,
                                        }}/>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="address">Address</InputLabel>
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
                                </CardContent> :
                                <CardContent>
                                    <Button fullWidth color="primary" variant="contained" onClick={this._open_accounts_page}>
                                        {t( "sentences.open an account")}
                                    </Button>
                                </CardContent>
                            }
                    </Card>
                    <div className={classes.underCardButtonContainer}>
                        <Button className={classes.underCardButton} color="primary" variant="contained" onClick={(event) => this._copy_address(event, _address)}>
                            {t( "sentences.copy address")}
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }
}

export default withStyles(styles)(CoinReceive);
