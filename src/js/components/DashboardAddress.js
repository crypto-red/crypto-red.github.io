import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";

import { COINS } from "../utils/constants";
import AddressListItem from "../components/AddressListItem";

const styles = theme => ({
    gridItem: {
        padding: theme.spacing(1),
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1, 0)
        }
    },
    cardContainer: {
        height: "100%"
    },
    addressCardContent: {
        maxHeight: 472,
        overflow: "auto"
    },
});


class DashboardAddress extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            logged_account: props.logged_account,
            _coins_id: [],
        };
    };

    componentDidMount() {

        this.setState({_coins_id: COINS.map(coin => coin.id)});
    }

    render() {

        const { classes, logged_account, } = this.state;
        const { _coins_id } = this.state;

        return (
            <div className={classes.cardContainer}>
                <Fade in>
                    <Card className={classes.linksCard}>
                        <CardHeader title="Address" />
                        <CardContent className={classes.addressCardContent}>
                            {
                                _coins_id.map((coin_id, index, array) => {

                                    return (
                                        <AddressListItem
                                            key={coin_id}
                                            coin_id={coin_id}
                                            logged_account={logged_account}/>
                                    );
                                })
                            }
                        </CardContent>
                    </Card>
                </Fade>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardAddress);