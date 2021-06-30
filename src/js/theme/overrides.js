const overrides = {
    MuiCssBaseline: {
        "@global": {
            html: {
                overflow: "overlay",
            },
            body: {
                backgroundColor: "#F4F6F8"
            },
            "*::-webkit-scrollbar": {
                width: "8px"
            },
            "*::-webkit-scrollbar-track": {
                backgroundColor: "transparent"
            },
            "*::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(124,124,124,.3)",
                    borderRadius: 8
            },
            ".MuiTableSortLabel-root.MuiTableSortLabel-root.MuiTableSortLabel-active": {
                color: "inherit"
            },
            ".MuiDialogActions-root": {
                borderTop: "1px solid #060f23",
                backgroundColor: "#f2f2f3",
            }
        },
    },
}

module.exports = overrides;
