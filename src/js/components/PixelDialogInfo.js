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
                    <p className={classes.blueCenter}><ShufflingSpanText  animation_delay_ms={777} animation_duration_ms={1111} style={{fontFamily: "Noto Sans Mono"}} pre={"+ - "} app={" - +"} text={"Uniquely, we are free. Together we are strong!"}/></p>
                    <p><blockquote style={{color: "#888"}}>Jamy (the assistant) told its developers to forge not works of art but swords of technology, he cares of what we don't so here we have this useless informative dialog and for therein lies great art...</blockquote></p>
                    <p>The only way to create a natural exhibition of the current world situation is to take the notion of the macro state that you are a part of (What is it, who is talking about it, controlling, and enforcing the rules and laws sometimes), in your own heart, and redesign it to suit your own mind or soul.</p>
                    <p>Now, in broader terms, we have said that our future will be the "<span className={"highlighted"}>creation and collection of situations</span>", maybe situations for nothing and / or sometimes with content nothingness or almost nothing to see and with ease ...</p>
                    <p>Science is merely a desire of man to understand and remember the ever complementing parts of himself giving him the knowledge that what he can see taste or feel, simply are electrical signals interpreted by his brains. And god is transcendent, right? So, what happens if you believe god is a machine, our norms are power rights? So to be, our god can become non-human, our god can become science and the machine.</p>
                    <p>They not only want to deny art but as the global delusional / delirious state of mind is spreading more and more in the real world with the "metaverse" social construct we also say it widely and openly to achieve it together, improvements in information technology , (as in other words, computer science, that is to say the fun fact of: "<span className={"highlighted"}>making daily life a creative experience, continually original-delusional-ecstatic</span>"), is a difficult process and a powerful thing.</p>
                    <p>Just like IF WE WERE in a state of cold war, declared between crypto and banking our technological and engineering skills would have to be exploited to the maximum. And with that, you are with me, a master piece of the system in what is open-source is the computer code but also what will follow, so these are new technologies to make human life easier. in the company of the machine, think, cars, coffee machines, telephones, everything from one source. Everything that keeps us company and keeps us from wasting time on small, light things was designed somewhere else, in the brain, that's where the magic happens.</p>
                    <p><blockquote style={{color: "#888"}}>Whoever you may be, a mad cryptokuza, a "pebble incarnation because you never move" or a former bankster, You can enjoy this platform through this site with ease and without the deep fear of the unknown.</blockquote></p>
                    <p>And with IT, we, as contributors, started to:</p>
                    <ul>
                        <li>Counter quantum-computer.</li>
                        <li>Displace FIAT currency.</li>
                        <li>Disrupt theoretical monopoly over mainstream social media.</li>
                        <li>Bring back power to the people trough autonomy and algorithms.</li>
                        <li>Not be denied. Dissuade others.</li>
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button variant="text" color="primary" autoFocus onClick={this.onClose}><ShufflingSpanText animation_delay_ms={444} animation_duration_ms={999} text={t( "words.close" )}/></Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(PixelDialogInfo);
