import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({});

class ChartDot extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    isolation: "isolate",
                }}
                viewBox="0 0 16 16"
                width={16}
                height={16}
                x={this.props.cx - 8}
                y={this.props.cy - 8}
            >
                <defs>
                    <clipPath id="prefix__a">
                        <path d="M0 0h16v16H0z" />
                    </clipPath>
                </defs>
                <g clipPath="url(#prefix__a)">
                    <circle
                        vectorEffect="non-scaling-stroke"
                        cx={8}
                        cy={8}
                        r={8}
                        fill={this.props.dotColor}
                        fillOpacity={0.33}
                    />
                    <circle
                        vectorEffect="non-scaling-stroke"
                        cx={8}
                        cy={8}
                        r={5.5}
                        fill={this.props.dotColor}
                    />
                    <circle
                        vectorEffect="non-scaling-stroke"
                        cx={8}
                        cy={8}
                        r={4}
                        fill="#FFF"
                    />
                </g>
            </svg>
        );
    }
}

export default withStyles(styles)(ChartDot);