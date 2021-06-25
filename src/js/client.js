import React from "react";
import ReactDOM from "react-dom";
import { Route, Router } from "react-router-dom";
import { HISTORY } from "./utils/constants";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en"
import fr from "javascript-time-ago/locale/fr"

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(fr);

// Pages
import Index from "./pages/Index";

// Theme
import { ThemeProvider } from "@material-ui/core"
import { createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';

import { lightTheme } from "./theme/index";

const app = document.getElementById('app');

ReactDOM.render(
    <ThemeProvider theme={lightTheme}>
        <CssBaseline>
            <Router history={HISTORY}>
                <Route component={Index}/>
            </Router>
        </CssBaseline>
    </ThemeProvider>,
app);
