import React from "react";
import { withStyles } from "@material-ui/core/styles"

import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import actions from "../actions/utils";
import DialogContent from "@material-ui/core/DialogContent";
import ShufflingSpanText from "./ShufflingSpanText";
import DialogActions from "@material-ui/core/DialogActions";
import {t} from "../utils/t";

const styles = theme => ({

});


class PixelDialogInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            keepMounted: props.keepMounted || false,
            open: props.open,
        };
    };

    componentWillReceiveProps(new_props) {

        if(new_props.open !== this.state.open) {

            if(new_props.open) { actions.trigger_snackbar("May I be of some assistance with my machine learning AI friend?");}
            this.setState(new_props, () => {

                this.forceUpdate();
            });
        }else {

            this.setState(new_props);
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

        return false;
    }

    render() {

        const {
            classes,
            open,
            keepMounted,
        } = this.state;

        return (
            <Dialog open={open}
                    onClose={this.props.onClose}
                    keepMounted={keepMounted}>
                <DialogContent>
                    <h2>DISCLAIMER! BECAUSE <ShufflingSpanText text={"ULTIMATELY"} animation_delay_ms={333} animation_duration_ms={555}/>:</h2>
                    <p>We hope you will soon make new friends on the blockchain technology using Wallet Crypto Red; some of whom may wish to join some forces with you to form one's powerful dreams.</p>
                    <p>Plan your next moves together, conceive elaborate investment strategies and build your “team”, develop your passion, and learn about fascinating things! <br />Support each other with the powers of donating pixel art to your friends and the causes you do care about.</p>
                    <p>Defend your true will by concentrating, and by strategically moving your efforts, using tools and bots we are enjoying developing. <b>United, we love to stand strong, and through a ride on the W.C.R. application you can expand your horizon</b>; transaction by transaction, pixel by pixel, NFT by NFT, and share by daring; but also in real life with the profit you can make.</p>
                    <p className={classes.blueCenter}><ShufflingSpanText  animation_delay_ms={777} animation_duration_ms={1111} style={{fontFamily: `"Share Tech Mono"`}} pre={"+ - "} app={" - +"} text={"Uniquely, we are free. Together we are strong!"}/></p>
                    <p><blockquote style={{color: "#888"}}>Jamy (the assistant) told its developers to forge not works of art but swords of technology, he cares of what we don't so here we have this useless informative dialog and for therein lies great art...</blockquote></p>
                    <p>The only way to create a natural exhibition of the current world is to take the notion of the macrostate which you are belonging to into your own heart, and redesign it to suit your own mind.</p>
                    <p>Now, in broader terms, "redesigning it" tells that our future will be the "creation and collection of situations for nothing"... But it will be situations and in such case those situations, the whole of the pixel art picture, the event description, comments wrapped around it, make it be a situation of art, not a sword of death, which can be part of the real world or of the metaverse, and whoever may critizise your own art tell his own mind what he has choosen to care of nothingness instead of himself.</p>
                    <p>Now, science is merely a desire of man to understand and remember the ever complementing parts of himself giving him the knowledge that what he can see taste or feel, simply are electrical signals interpreted by his brains. And god is transcendent, right? So, what happens if you believe god is a machine or an interface, our norms are power rights? So to be, our god can become human again when it share art with its functionning element of himself, a blockchain should be more friendly and artistic, to be broeader accepted by us, humans. Art is more human than science, it is also more profitable, to say it better.</p>
                    <p>They, (the haters) not only want to deny art but as the global delusional / delirious state of mind is spreading more and more in the real world with the "metaverse" tunneling effect we also say it widely and openly to achieve our goal together , improvements in information technology using the metaverse experience and the real-life tools we possess. It is like to told one the fun fact that: "making daily life a creative experience, continually original-delusional-ecstatic", is a difficult process but a powerful thing.</p>
                    <p>But just like IF WE WERE in a situation of a cold war, declared between crypto and banking our technological and engineering skills would have to be exploited to the maximum. And with that, you are with me, a master piece of the system in what is open-source, it is the computer code but also what will follow, so these are new technologies to make human life easier with the precense of machines, think, cars, coffee machines, telephones, everything from one source. Everything that keeps us company and keeps us from "wasting time on small and light things" was designed somewhere else, in the brain, that's where all the magic happens.</p>
                    <p><blockquote style={{color: "#888"}}>Whoever you may be, a mad cryptokuza or a former bankster, You can enjoy this platform through this site with ease and without the deep fear of the unknown unartistic unworthy situations of the metaverse and daily life.</blockquote></p>
                    <p>And with Information Technology, we, as contributors, started to not be denied or abandoned by our idea.</p>
                </DialogContent>
                <DialogActions>
                    <Button variant="text" color="primary" autoFocus onClick={this.props.onClose}><ShufflingSpanText animation_delay_ms={444} animation_duration_ms={999} text={t( "words.close" )}/></Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(PixelDialogInfo);
