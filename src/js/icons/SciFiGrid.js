import * as React from "react"

function ScifiGrid(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
                isolation: "isolate",
            }}
            viewBox="0 0 450 450"
            width={600}
            height={600}
            {...props}
        >
            <defs>
                <clipPath id="prefix__a">
                    <path d="M0 0h450v450H0z" />
                </clipPath>
            </defs>
            <g clipPath="url(#prefix__a)">
                <clipPath id="prefix__b">
                    <path fill={props.color} d="M0 0h450v450H0z" />
                </clipPath>
                <g clipPath="url(#prefix__b)">
                    <path d="M.108 0H450v450H.108V0z" fill="none" />
                    <clipPath id="prefix__c">
                        <path
                            d="M-900-900H900V900H-900V-900zM.108 0H450v450H.108V0z"
                            fillRule="evenodd"
                            fill={props.color}
                        />
                    </clipPath>
                    <g clipPath="url(#prefix__c)">
                        <mask id="prefix__d" x="-200%" y="-200%" width="400%" height="400%">
                            <rect
                                x="-200%"
                                y="-200%"
                                width="400%"
                                height="400%"
                                fill={props.color}
                            />
                            <path d="M.108 0H450v450H.108V0z" />
                        </mask>
                        <path d="M.108 0H450v450H.108V0z" fill="none" />
                        <path
                            d="M.108 0H450v450H.108V0h0z"
                            fill="none"
                            mask="url(#prefix__d)"
                            vectorEffect="non-scaling-stroke"
                            strokeWidth={2}
                            stroke="#000"
                            strokeOpacity={0.5}
                            strokeMiterlimit={10}
                        />
                    </g>
                    <clipPath id="prefix__e">
                        <path
                            d="M-900-900H900V900H-900V-900zM150.126 0v450V0z"
                            fillRule="evenodd"
                            fill={props.color}
                        />
                    </clipPath>
                    <g clipPath="url(#prefix__e)">
                        <mask id="prefix__f" x="-200%" y="-200%" width="400%" height="400%">
                            <rect
                                x="-200%"
                                y="-200%"
                                width="400%"
                                height="400%"
                                fill={props.color}
                            />
                            <path d="M150.126 0v450" />
                        </mask>
                        <path
                            mask="url(#prefix__f)"
                            vectorEffect="non-scaling-stroke"
                            strokeWidth={2}
                            stroke={props.color}
                            strokeOpacity={0.5}
                            strokeLinecap="square"
                            strokeMiterlimit={3}
                            d="M150.126 0v450"
                        />
                    </g>
                    <clipPath id="prefix__g">
                        <path
                            d="M-900-900H900V900H-900V-900zM299.982 0v450V0z"
                            fillRule="evenodd"
                            fill={props.color}
                        />
                    </clipPath>
                    <g clipPath="url(#prefix__g)">
                        <mask id="prefix__h" x="-200%" y="-200%" width="400%" height="400%">
                            <rect
                                x="-200%"
                                y="-200%"
                                width="400%"
                                height="400%"
                                fill={props.color}
                            />
                            <path d="M299.982 0v450" />
                        </mask>
                        <path
                            mask="url(#prefix__h)"
                            vectorEffect="non-scaling-stroke"
                            strokeWidth={2}
                            stroke={props.color}
                            strokeOpacity={0.5}
                            strokeLinecap="square"
                            strokeMiterlimit={3}
                            d="M299.982 0v450"
                        />
                    </g>
                    <clipPath id="prefix__i">
                        <path
                            d="M-900-900H900V900H-900V-900zM.054 299.928h450-450z"
                            fillRule="evenodd"
                            fill={props.color}
                        />
                    </clipPath>
                    <g clipPath="url(#prefix__i)">
                        <mask id="prefix__j" x="-200%" y="-200%" width="400%" height="400%">
                            <rect
                                x="-200%"
                                y="-200%"
                                width="400%"
                                height="400%"
                                fill={props.color}
                            />
                            <path d="M.054 299.928h450" />
                        </mask>
                        <path
                            mask="url(#prefix__j)"
                            vectorEffect="non-scaling-stroke"
                            strokeWidth={2}
                            stroke={props.color}
                            strokeOpacity={0.5}
                            strokeLinecap="square"
                            strokeMiterlimit={3}
                            d="M.054 299.928h450"
                        />
                    </g>
                    <clipPath id="prefix__k">
                        <path
                            d="M-900-900H900V900H-900V-900zM.054 150.072h450-450z"
                            fillRule="evenodd"
                            fill={props.color}
                        />
                    </clipPath>
                    <g clipPath="url(#prefix__k)">
                        <mask id="prefix__l" x="-200%" y="-200%" width="400%" height="400%">
                            <rect
                                x="-200%"
                                y="-200%"
                                width="400%"
                                height="400%"
                                fill={props.color}
                            />
                            <path d="M.054 150.072h450" />
                        </mask>
                        <path
                            mask="url(#prefix__l)"
                            vectorEffect="non-scaling-stroke"
                            strokeWidth={2}
                            stroke={props.color}
                            strokeOpacity={0.5}
                            strokeLinecap="square"
                            strokeMiterlimit={3}
                            d="M.054 150.072h450"
                        />
                    </g>
                    <path fillOpacity={0.1} d="M300.09 299.928H450V450H300.09z" />
                    <path fill="none" d="M.108 0H450v450H.108z" />
                    <clipPath id="prefix__m">
                        <path fill={props.color} d="M.108 0H450v450H.108z" />
                    </clipPath>
                    <g clipPath="url(#prefix__m)">
                        <mask id="prefix__n">
                            <path fill={props.color} d="M.108 0H450v450H.108z" />
                        </mask>
                        <path fill="none" d="M.108 0H450v450H.108z" />
                        <path
                            fill="none"
                            mask="url(#prefix__n)"
                            vectorEffect="non-scaling-stroke"
                            strokeWidth={2}
                            stroke={props.color}
                            strokeOpacity={100}
                            strokeLinecap="square"
                            strokeMiterlimit={2}
                            d="M.108 0H450v450H.108z"
                        />
                    </g>
                    <mask id="prefix__o" x="-200%" y="-200%" width="400%" height="400%">
                        <rect x="-200%" y="-200%" width="400%" height="400%" fill={props.color} />
                        <path d="M150.054 100.096V200.12" />
                    </mask>
                    <path
                        mask="url(#prefix__o)"
                        vectorEffect="non-scaling-stroke"
                        strokeWidth={6}
                        stroke={props.color}
                        strokeOpacity={100}
                        strokeLinecap="square"
                        strokeMiterlimit={3}
                        d="M150.054 100.096V200.12"
                    />
                    <mask id="prefix__p" x="-200%" y="-200%" width="400%" height="400%">
                        <rect x="-200%" y="-200%" width="400%" height="400%" fill={props.color} />
                        <path d="M100.006 150.144H200.03" />
                    </mask>
                    <path
                        mask="url(#prefix__p)"
                        vectorEffect="non-scaling-stroke"
                        strokeWidth={6}
                        stroke={props.color}
                        strokeOpacity={100}
                        strokeLinecap="square"
                        strokeMiterlimit={3}
                        d="M100.006 150.144H200.03"
                    />
                    <path fill={props.color} d="M415 428h23v10h-23z" />
                    <path
                        fill={props.color}
                        fillOpacity={0.2}
                        d="M265.09 277.928h23v10h-23zM115.054 128.144h23v10h-23zM265.09 428h23v10h-23zM115.054 278.216h23v10h-23zM264.964 128.432h23v10h-23z"
                    />
                </g>
                <circle
                    vectorEffect="non-scaling-stroke"
                    cx={150.5}
                    cy={150.5}
                    r={112.5}
                    fillOpacity={0.05}
                />
            </g>
        </svg>
    )
}

export default ScifiGrid
