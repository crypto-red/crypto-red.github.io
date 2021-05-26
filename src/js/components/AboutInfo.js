import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { HISTORY } from "../utils/constants";

import Fade from "@material-ui/core/Fade";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const styles = theme => ({
    root: {
    },
    containerElement: {
        padding: theme.spacing(2),
        display: "flex",
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(2, 0),
            display: "inherit"
        }
    },
    horizontalTabsContainer: {
        [theme.breakpoints.up('lg')]: {
            display: "none"
        },
        width: "100vw",
        marginTop: theme.spacing(2)
    },
    horizontalTabs: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main
        }
    },
    verticalTabs: {
        [theme.breakpoints.down('md')]: {
            display: "none"
        },
        marginLeft: theme.spacing(2),
        height: "fit-content",
        display: "inline-table",
        borderLeft: `1px solid ${theme.palette.divider}`,
        "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main,
            left: 0
        }
    },
    cardContainer: {
        width: "inherit"
    }
});

const VIEW_NAMES = [
    "intellectual",
    "terms"
];


class AboutInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            pathname: props.pathname,
            _view_name: props.pathname.split("/")[3] || "intellectual",
            _view_name_index: VIEW_NAMES.indexOf(!~props.pathname.split("/")[3] || "intellectual") ? 0: VIEW_NAMES.indexOf(props.pathname.split("/")[3] || "intellectual"),
            _history: HISTORY,
            _view_names: VIEW_NAMES
        };
    };

    componentWillReceiveProps(new_props) {

        const { _view_names } = this.state;
        const new_pathname = new_props.pathname;

        const _view_name = new_props.pathname.split("/")[3] || "intellectual";
        const _view_name_index = !~_view_names.indexOf(_view_name) ? 0: _view_names.indexOf(_view_name);
        this.setState({pathname: new_pathname, _view_name, _view_name_index});

    }

    _handle_view_name_change = (event, view_name_index) => {

        const { _history, _view_names } = this.state;

        const _view_name = _view_names[view_name_index] || "intellectual";
        const _view_name_index = !~_view_names.indexOf(_view_name) ? 0: _view_names.indexOf(_view_name);

        const new_pathname = "/about/info/" + _view_name;
        _history.push(new_pathname);
        this.setState({_view_name_index});
    };

    _get_tab_props = (index) => {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    render() {

        const { classes, _view_name, _view_name_index } = this.state;

        const views = {
            intellectual:
                <Card>
                    <CardHeader title="Intellectual property"/>
                    <CardContent>
                        <p>MIT License</p>
                        <p>Copyright (c) 2021 vipertech.ch</p>
                        <p>Copyright (c) 2021 crypto.red</p>
                        <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
                        <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
                        <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
                    </CardContent>
                </Card>,
            terms:
                <Card>
                    <CardHeader title="Terms of Use"/>
                    <CardContent>
                        <p>Wallet.crypto.red Terms of Use</p>
                        <p>Date of Revision. 11 April, 2021</p>
                        <p>Please read these Terms carefully before using this website. By using this website (the "Website"), the user ("You") has accepted these Terms of Use. If You do not accept these Terms of Use, do not use the Website. By using this Website, you represent that you are of legal age to form a binding contract with Crypto.red.</p>
                        <p>CRYPTO RED (crypto.red and its subdomains) may modify all or any part of these Terms of Use from time to time and may not provide notice to You. You are encouraged to check back often so You are aware of your current rights and responsibilities. Your continued use of this Website after changes to the Terms of Use have been published constitutes your binding acceptance of the updated Terms of Use. If at any time the Terms of Use are no longer acceptable to You, You should immediately cease all use of this Website.</p>
                        <ol>
                            <li>
                                <p>Statement of Purpose. The purpose of Wallet.crypto.red is to enable individuals and organizations to access the world of cryptocurrency throughout a simple yet powerful open-source software more especially called a progressive web app (PWA). The site is designed to enable one to buy, sell, trade, and interact with cryptocurrency. It is also designed to encourage the creation of a user community to make this life a wonderful adventure when it comes to cryptocurrency generally speaking.</p>
                            </li>
                            <li>
                                <p>User Registration. Registration at wallet.crypto.red is optional but encouraged. If you are registered at wallet.crypto.com, Crypto.red and its subdomains will not be able to contact you with information that you shared with this application, in reality, all that you've registered on this site instance will stay on your computer and will never be shared with any network excepted when you need to make transactions or network requests, then, only non-private information will be shared as it needs to like the public address of your computer or cryptocurrency seed-derived address.</p>
                                <p>You agree not to sell or transfer your use of or access to this Website or permit anyone else whose account was suspended or terminated to use this Website through your user name or password. You are responsible for maintaining the confidentiality of your password and account and for all activity that occurs on your account.</p>
                            </li>
                            <li>
                                <p>Fees at third-party provider. Fees at: trading, buying, selling, and withdrawing among others cryptocurrencies may apply, theses fees are not higher and in some case lower when you pass trough this website to operate a contract with a third-party service provider such as Changelly or swapspace, the platforms mentioned before charges fees and rewards crypto.red for the clients comming from this application, it helps fund this software. You can use any third-party exchanges you want which aren't listed on this website, our partners should theoretically have the best bid for your need nonetheless.</p>
                            </li>
                            <li>
                                <p>LIMITATION ON LIABILITY. THIS WEBSITE AND ALL CONTENT, MATERIALS, INFORMATION, SOFTWARE, PRODUCTS AND SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. YOUR USE OF THIS WEBSITE IS AT YOUR OWN RISK. CRYPTO RED DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. TO THE FULLEST EXTENT PERMITTED BY LAW, CRYPTO RED IS NOT LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL,CONSEQUENTIAL, OR EXEMPLARY DAMAGES (INCLUDING, WITHOUT LIMITATION, LOSS OF BUSINESS, REVENUE, PROFITS, GOODWILL, USE, DATA, ELECTRONICALLY TRANSMITTED ORDERS, OR OTHER ECONOMIC ADVANTAGE) ARISING OUT OF OR IN CONNECTION WITH THE WEBSITE, EVEN IF CRYPTO RED HAS PREVIOUSLY BEEN ADVISED OF, OR REASONABLY COULD HAVE FORESEEN, THE POSSIBILITY OF SUCH DAMAGES, HOWEVER THEY ARISE, WHETHER IN BREACH OF CONTRACT OR IN TORT (INCLUDING NEGLIGENCE), INCLUDING WITHOUT LIMITATION DAMAGES DUE TO (a) THE USE OF OR THE INABILITY TO USE THE WEBSITE; (b) THE COST OF PROCUREMENT OF SUBSTITUTE GOODS AND SERVICES RESULTING FROM ANY GOODS, DATA, INFORMATION OR SERVICES PURCHASED OR OBTAINED OR MESSAGES RECEIVED OR TRANSACTIONS ENTERED INTO, THROUGH OR FROM THE WEBSITE; ( c) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE WEBSITE, INCLUDING WITHOUT LIMITATION UNAUTHORIZED ACCESS TO OR ALTERATION OF TRANSMISSIONS OR DATA, MALICIOUS OR CRIMINAL BEHAVIOR, OR FALSE OR FRAUDULENT TRANSACTIONS, OR (d) CONTENT OR INFORMATION YOU MAY DOWNLOAD, USE, MODIFY OR DISTRIBUTE. CRYPTO RED MAKES NO WARRANTY THAT, (i) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, (ii) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE, (iii) THE QUALITY OF ANY PRODUCTS, SERVICES, CONTENT, INFORMATION, OR OTHER MATERIALS OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS, (iv) ANY ERRORS IN THE SOFTWARE WILL BE CORRECTED, OR THAT THIS WEBSITE, ITS CONTENT, AND THE SERVER ON WHICH THE WEBSITE AND CONTENT ARE AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. ANY MATERIAL (INCLUDING CONTENT) DOWNLOADED OR OBTAINED THROUGH THE USE OF THIS WEBSITE IS DONE AT YOUR OWN RISK AND YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF ANY MATERIAL. INFORMATION CREATED BY THIRD PARTIES THAT YOU MAY ACCESS ON THIS WEBSITE OR THROUGH LINKS IS NOT APPROVED, ADOPTED OR ENDORSED BY CRYPTO RED AND REMAINS THE RESPONSIBILITY OF THE THIRD PARTY.</p>
                                <p>TO THE EXTENT ANY JURISDICTION DOES NOT ALLOW THE EXCLUSION OR LIMITATION OF DIRECT, INCIDENTAL OR CONSEQUENTIAL DAMAGES, PORTIONS OF THE ABOVE LIMITATION OR EXCLUSION MAY NOT APPLY.</p>
                            </li>
                        </ol>
                    </CardContent>
                </Card>,
        };

        const view = Boolean(_view_name) ? views[_view_name]: <span>Loading...</span>;

        return (
            <div className={classes.root}>
                <div className={classes.horizontalTabsContainer}>
                    <Tabs
                        orientation="horizontal"
                        value={_view_name_index}
                        onChange={this._handle_view_name_change}
                        variant="scrollable"
                        scrollButtons="on"
                        className={classes.horizontalTabs}
                    >
                        <Tab label="Intellectual Property" {...this._get_tab_props(0)} />
                        <Tab label="Terms of Use" {...this._get_tab_props(1)} />
                    </Tabs>
                </div>
                <Container maxWidth="md" className={classes.containerElement}>
                    <Fade in>
                        <div className={classes.cardContainer}>{view}</div>
                    </Fade>
                    <Tabs
                        orientation="vertical"
                        value={_view_name_index}
                        onChange={this._handle_view_name_change}
                        aria-label="Vertical tabs example"
                        className={classes.verticalTabs}
                    >
                        <Tab label="Intellectual Property" {...this._get_tab_props(0)} />
                        <Tab label="Terms of Use" {...this._get_tab_props(1)} />
                    </Tabs>
                </Container>
            </div>
        );
    }
}

export default withStyles(styles)(AboutInfo);
