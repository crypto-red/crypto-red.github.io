import React from "react";
import { withStyles } from '@material-ui/core/styles'
import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from "@material-ui/icons/FileCopy"

import api from "../utils/api";
import actions from "../actions/utils";
import { HISTORY } from "../utils/constants";
import clipboard from "clipboard-polyfill";

import QRCode from "qrcode.react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

const styles = theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
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
    }
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

        const { coin_id, logged_account } = this.state;

        if(Boolean(logged_account)) {

            if(logged_account.name) {

                this._get_address_by_seed(coin_id, logged_account.seed);
            }
        }
    }

    componentWillReceiveProps(new_props) {

        const { coin_id, logged_account } = this.state;

        if (new_props.logged_account) {

            if(new_props.logged_account.name) {

                this._get_address_by_seed(new_props.coin_id, new_props.logged_account.seed);
            }
        }

        this.setState(new_props);
    }

    _get_address_by_seed = (coin_id, seed) => {

        const address = api.get_address_by_seed(coin_id, seed);
        this.setState({_address: address});
    };

    _copy_address = (event, address) => {

        if(address !== null) {

            clipboard.writeText(address).then(
                function () {

                    actions.trigger_snackbar("Address succesfully copied");
                },
                function () {

                    actions.trigger_snackbar("Cannot copy this address");
                }
            );
        }else {

            actions.trigger_snackbar("Cannot copy \"null\" address");
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
                    <Fade in>
                        <Card>
                            <CardHeader
                                title="Receive"
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
                                                            aria-label="Copy address"
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
                                            Open an account
                                        </Button>
                                    </CardContent>
                                }
                        </Card>
                    </Fade>
                </Container>
            </div>
        );
    }
}

export default withStyles(styles)(CoinReceive);