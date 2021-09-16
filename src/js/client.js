import React from "react";
import ReactDOM from "react-dom";
import { Route, Router } from "react-router-dom";
import { HISTORY } from "./utils/constants";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en"
import fr from "javascript-time-ago/locale/fr"
import pt from "javascript-time-ago/locale/pt"
import id from "javascript-time-ago/locale/id"
import it from "javascript-time-ago/locale/it"
import de from "javascript-time-ago/locale/de"

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(fr);
TimeAgo.addLocale(pt);
TimeAgo.addLocale(id);
TimeAgo.addLocale(it);
TimeAgo.addLocale(de);

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
