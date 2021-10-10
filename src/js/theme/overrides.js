const overrides = {
    MuiCssBaseline: {
        "@global": {
            html: {
                overflow: "overlay",
            },
            body: {
                backgroundColor: "#FAFAFA",
                touchAction: "none",
                width: "100vw",
                height: "100vh",
            },
            "p img": {
                width: "100%",
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
                borderTop: "1px solid #e5e5e5",
                backgroundColor: "#fafafa",
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
            },
            ".MuiTooltip-popper .MuiTooltip-tooltip": {
                backgroundColor: "#100d4e",
            },
            "svg": {
                fontFamily: "Open Sans !important"
            },
            ".MuiBackdrop-root": {
                backdropFilter: "blur(3px)",
                backgroundColor: "rgba(6, 14, 35, .5)",
                transform: "scale(3)",
                animation: "$fadeBlur 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                "@global": {
                    "@keyframes fadeBlur": {
                        "0%": {
                            backdropFilter: "blur(3px)",
                            transform: "scale(1)",
                        },
                        "100%": {
                            backdropFilter: "blur(3px)",
                            transform: "scale(3)",
                        },
                    }
                }
            }
        },
    },
}

module.exports = overrides;
