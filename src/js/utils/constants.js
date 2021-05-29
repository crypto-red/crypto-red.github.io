import createHistory from "history/createBrowserHistory";
const HISTORY = createHistory();

/*
 * The page routes system is working with regex, tabs system (weird) isn't great but it will change
 */
const PAGE_ROUTES = [
    {
        page_regex: /\/*/,
        page_name: "unknown",
        tabs: ""
    },
    {
        page_regex: /\/$/,
        page_name: "home",
        tabs: ""
    },
    {
        page_regex: /\/(settings)$/,
        page_name: "settings",
        tabs: ""
    },
    {
        page_regex: /\/(accounts)$/,
        page_name: "accounts",
        tabs: ""
    },
    {
        page_regex: /\/(dashboard)$/,
        page_name: "dashboard",
        tabs: ""
    },
    {
        page_regex: /\/(coins)$/,
        page_name: "coins",
        tabs: ""
    },
    {
        page_regex: /\/(coins)(\/bitcoin|\/cardano|\/dash|\/dogecoin|\/eos|\/ethereum|\/litecoin|\/monero|\/neo|\/v-systems|\/zcash)(\/balance|\/transactions|\/charts|\/send(\/[a-zA-Z0-9]+)?|\/receive)?$/,
        page_name: "coin",
        tabs: "coin"
    },
    {
        page_regex: /\/(about)((\/info(\/intellectual|\/terms)?)|(\/wiki(\/topup|\/mixer|\/convert|\/contribute)?)|(\/faq(\/organization|\/security|\/privacy|\/fees|\/usage)?))?$/,
        page_name: "about",
        tabs: ""
    }
];

const COINS = [
    {
        id: "bitcoin",
        name: "Bitcoin",
        short_name: "BTC",
        image_url: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"  
    },
    {
        id: "dash",
        name: "Dash",
        short_name: "DASH",
        image_url: "https://assets.coingecko.com/coins/images/19/small/dash-logo.png"
    },
    {
        id: "dogecoin",
        name: "Dogecoin",
        short_name: "DOGE",
        image_url: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png"
    },
    {
        id: "litecoin",
        name: "Litecoin",
        short_name: "LTC",
        image_url: "https://assets.coingecko.com/coins/images/2/small/litecoin.png"
    },
    {
        id: "v-systems",
        name: "Vsystems",
        short_name: "VSYS",
        image_url: "https://assets.coingecko.com/coins/images/7492/small/VSYS_Coin_200.png"
    },/*
    {
        id: "zcash",
        name: "Zcash",
        short_name: "ZEC",
        image_url: "https://assets.coingecko.com/coins/images/486/small/circle-zcash-color.png"
    }*/
];

const LOCALES = [
    {code: "ar-SA", name: "Arabic (Saudi Arabia)"},
    {code: "ar-SA", name: "Arabic (Saudi Arabia)"},
    {code: "bn-BD", name: "Bangla (Bangladesh)"},
    {code: "bn-IN", name: "Bangla (India)"},
    {code: "cs-CZ", name:  "Czech (Czech Republic)"},
    {code: "da-DK", name:  "Danish (Denmark)"},
    {code: "de-AT", name:  "Austrian German"},
    {code: "de-CH", name: "\"Swiss\" German"},
    {code: "de-DE", name: "Standard German (as spoken in Germany)"},
    {code: "el-GR", name: "Modern Greek"},
    {code: "en-AU", name: "Australian English"},
    {code: "en-CA", name: "Canadian English"},
    {code: "en-GB", name: "British English"},
    {code: "en-IE", name: "Irish English"},
    {code: "en-IN", name: "Indian English"},
    {code: "en-NZ", name: "New Zealand English"},
    {code: "en-US", name: "US English"},
    {code: "en-ZA", name: "English (South Africa)"},
    {code: "es-AR", name: "Argentine Spanish"},
    {code: "es-CL", name: "Chilean Spanish"},
    {code: "es-CO", name: "Colombian Spanish"},
    {code: "es-ES", name: "Castilian Spanish (as spoken in Central-Northern Spain)"},
    {code: "es-MX", name: "Mexican Spanish"},
    {code: "es-US", name: "American Spanish"},
    {code: "fi-FI", name: "Finnish (Finland)"},
    {code: "fr-BE", name: "Belgian French"},
    {code: "fr-CA", name: "Canadian French"},
    {code: "fr-CH", name: "\"Swiss\" French"},
    {code: "fr-FR", name: "Standard French (especially in France)"},
    {code: "he-IL", name: "Hebrew (Israel)"},
    {code: "hi-IN", name: "Hindi (India)"},
    {code: "hu-HU", name: "Hungarian (Hungary)"},
    {code: "id-ID", name: "Indonesian (Indonesia)"},
    {code: "it-CH", name: "\"Swiss\" Italian"},
    {code: "it-IT", name: "Standard Italian (as spoken in Italy)"},
    {code: "ja-JP", name: "Japanese (Japan)"},
    {code: "ko-KR", name: "Korean (Republic of Korea)"},
    {code: "nl-BE", name: "Belgian Dutch"},
    {code: "nl-NL", name: "Standard Dutch (as spoken in The Netherlands)"},
    {code: "no-NO", name: "Norwegian (Norway)"},
    {code: "pl-PL", name: "Polish (Poland)"},
    {code: "pt-BR", name: "Brazilian Portuguese"},
    {code: "pt-PT", name: "European Portuguese (as written and spoken in Portugal)"},
    {code: "ro-RO", name: "Romanian (Romania)"},
    {code: "ru-RU", name: "Russian (Russian Federation)"},
    {code: "sk-SK", name: "Slovak (Slovakia)"},
    {code: "sv-SE", name: "Swedish (Sweden)"},
    {code: "ta-IN", name: "Indian Tamil"},
    {code: "ta-LK", name: "Sri Lankan Tamil"},
    {code: "th-TH", name: "Thai (Thailand)"},
    {code: "tr-TR", name: "Turkish (Turkey)"},
    {code: "zh-CN", name: "Mainland China, simplified characters"},
    {code: "zh-HK", name: "Hong Kong, traditional characters"},
    {code: "zh-TW", name: "Taiwan, traditional characters"},
];

// We use this to know which currency to select when we have the country code known
const CURRENCY_COUNTRIES = {
    ARS: ["AR"],
    AUD: ["AU", "CC", "CX", "HM", "KI", "NF", "NR", "TV"],
    BDT: ["BD"],
    BRL: ["BR"],
    CAD: ["CA"],
    CHF: ["CH", "LI"],
    CLP: ["CL"],
    CNY: ["CN"],
    COP: ["CO"],
    CZK: ["CZ"],
    DKK: ["DK", "FO", "GL"],
    EUR: ["AD", "AT", "AX", "BE", "BL", "CY", "DE", "EE", "ES", "FI", "FR", "GF", "GP", "GR", "IE", "IT", "LU", "MC", "ME", "MF", "MQ", "MT", "NL", "PM", "PT", "RE", "SI", "SK", "SM", "TF", "VA", "YT"],
    GBP: ["GB", "GG", "GS", "IM", "JE"],
    HKD: ["HK"],
    HUF: ["HU"],
    IDR: ["ID"],
    ILS: ["IL", "PS"],
    INR: ["IN"],
    JPY: ["JP"],
    KRW: ["KR"],
    LKR: ["LK"],
    MXN: ["MX"],
    NOK: ["BV", "NO", "SJ"],
    NZD: ["CK", "NU", "NZ", "PN", "TK"],
    PLN: ["PL"],
    RON: ["RO"],
    RUB: ["RU"],
    SAR: ["SA"],
    SEK: ["SE"],
    THB: ["TH"],
    TRY: ["TR"],
    TWD: ["TW"],
    USD: ["AS", "BQ", "EC", "FM", "GU", "IO", "MH", "MP", "PR", "PW", "TC", "TL", "UM", "US", "VG", "VI"],
    ZAR: ["ZA"],
};

module.exports = {
    HISTORY: HISTORY,
    PAGE_ROUTES: PAGE_ROUTES,
    COINS: COINS,
    LOCALES: LOCALES,
    CURRENCY_COUNTRIES: CURRENCY_COUNTRIES
};
