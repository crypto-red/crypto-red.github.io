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
                backgroundColor: "#f8f8f9",
            },
            ".MuiFab-root.MuiFab-extended": {
                borderRadius: 4,
            },
            ".MuiButtonBase-root.MuiFab-root": {
                borderRadius: 4,
            },
            ".MuiButtonBase-root.MuiChip-root": {
                borderRadius: 4,
            },
            ".MuiSvgIcon-root.MuiChip-deleteIcon": {
                color: "rgba(0, 0, 0, .36)"
            }
        },
    },
}

module.exports = overrides;
