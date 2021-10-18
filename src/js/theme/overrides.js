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
            ".emoji": {
                verticalAlign: "middle",
                height: "1em",
                width: "1em",
                "&.bounce": {
                    animation: "$bounce 1.2s cubic-bezier(0.280, 0.840, 0.420, 1) infinite 1s",
                    "@global": {
                        "@keyframes bounce": {
                            "0%": {transform: "scale(1,1) translateY(0)"},
                            "10%": {transform: "scale(1.1,.9) translateY(0)"},
                            "30%": {transform: "scale(.9,1.1) translateY(-40px)"},
                            "50%": {transform: "scale(1.05,.95) translateY(0)"},
                            "57%": {transform: "scale(1,1) translateY(-3px)"},
                            "64%": {transform: "scale(1,1) translateY(0)"},
                            "100%": {transform: "scale(1,1) translateY(0)"},
                        }
                    }
                },
                "&.pulse": {
                    animation: "$pulse 1.8s cubic-bezier(0.280, 0.840, 0.420, 1) infinite 1s",
                    "@global": {
                        "@keyframes pulse": {
                            "0%": {transform: "scale(.9)"},
                            "10%": {transform: "scale(1)"},
                            "30%": {transform: "scale(.9)"},
                            "50%": {transform: "scale(1)"},
                            "57%": {transform: "scale(.9)"},
                            "64%": {transform: "scale(1)"},
                            "100%": {transform: "scale(.9)"},
                        }
                    }
                }
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
                backgroundColor: "#e8ecfe",
                "& > .MuiButton-root": {
                    color: "#3729c1",
                }
            },
            ".MuiDialog-paper": {
                clipPath: "polygon(0 0, 100% 0, 100% 100%, calc(100% - 0px) 100%, calc(100% - 0px) calc(100% - 0px), calc(100% - 48px) calc(100% - 0px), calc(100% - 64px) 100%, 16px 100%, 0px calc(100% - 16px))",
                "& .MuiDialogActions-root": {
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, calc(100% - 8px) 100%, calc(100% - 8px) calc(100% - 8px), calc(100% - 48px) calc(100% - 8px), calc(100% - 64px) 100%, 16px 100%, 0px calc(100% - 16px))",
                },
                "&::before": {
                    zIndex: -1,
                    content: "''",
                    background: "#100d4e",
                    transform: "translate(-8px, 0)",
                    width: 64,
                    height: 8,
                    position: "absolute",
                    right: -4,
                    bottom: 0,
                }
            },
            ".MuiDialog-paperFullScreen": {
                clipPath: "none",
                "& .MuiDialogActions-root": {
                    clipPath: "none",
                },
                "&::before": {
                    content: "none",
                }
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
            },
            ".MuiFormGroup-row": {
                flexWrap: "wrap",
                alignContent: "stretch",
                justifyContent: "space-between",
            }
        },
    },
}

module.exports = overrides;
