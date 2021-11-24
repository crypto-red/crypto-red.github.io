import * as React from "react"

function Scifisc(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
                isolation: "isolate",
            }}
            viewBox="0 0 100 100"
            width="100pt"
            height="100pt"
            {...props}
        >
            <defs>
                <clipPath id="prefix__a">
                    <path d="M0 0h100v100H0z" />
                </clipPath>
            </defs>
            <g fill="none" stroke={props.color} clipPath="url(#prefix__a)">
                <path
                    d="M11.072 63.643v25.285h25.284m27.288 0h25.284V63.643m0-27.287V11.072H63.644m-27.288 0H11.072v25.284"
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={1.017}
                    strokeMiterlimit={2.613}
                />
                <circle
                    vectorEffect="non-scaling-stroke"
                    cx={50}
                    cy={50}
                    r={35.095}
                    strokeWidth={1.628}
                />
            </g>
        </svg>
    )
}

export default Scifisc;