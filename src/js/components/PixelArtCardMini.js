import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";

const styles = theme => ({
    card: {
        overflow: "visible",
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        borderRadius: 4,
        backgroundColor: "transparent",
    },
    cardMedia: {
        imageRendering: "pixelated"
    },
});

class PixelArtCardMini extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            post: props.post,
            selected: props.selected,
        };
    };

    shouldComponentUpdate(new_props) {

        return (new_props.post !== this.state.post || new_props.selected !== this.state.selected);
    }

    componentWillReceiveProps(new_props) {

        this.setState({...new_props});
    }

    render() {

        const { classes, post, selected } = this.state;

        return (
            <Card elevation={0} className={classes.card} score={100} dataselected={selected ? "true": "false"}>
                <CardActionArea>
                    <CardMedia
                        onClick={(event) => {this.props.on_card_media_click(post, event)}}
                        className={classes.cardMedia}
                        component="img"
                        alt="Demo only"
                        image={post.image.base64}
                        title="Demo only"
                    />
                </CardActionArea>
            </Card>
        );
    }
}

export default withStyles(styles)(PixelArtCardMini);
