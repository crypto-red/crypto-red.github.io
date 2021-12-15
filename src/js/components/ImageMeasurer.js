import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {has, get_new_img_obj} from "../utils/png-db";

export default class ImageMeasurer extends PureComponent {

    static displayName = "ImageMeasurer";

    static propTypes = {
        onError: PropTypes.func,
        timeout: PropTypes.number,
        keyMapper: PropTypes.func,
        image: PropTypes.func.isRequired,
        children: PropTypes.func.isRequired,
        defaultWidth: PropTypes.number.isRequired,
        defaultHeight: PropTypes.number.isRequired
    };

    static defaultProps = {
        onError: () => null,
        timeout: 5000,
        keyMapper: () => null
    };

    makeItemsWithSizes = (items, sizes) => items.reduce((res, item) => {

        if (res.stop) return res;

        const src = this.props.image(item);
        const size = sizes[src];

        // this will stop execution for first non-loaded image
        if (src && !size) {
            return {...res, stop: true};
        }

        res.itemsWithSizes.push({
            item,
            size
        });

        return res;

    }, {itemsWithSizes: [], stop: false}).itemsWithSizes;

    timeouts = {};

    state = {
        sizes: {}
    };

    onLoad = (src, ref) => {

        this.clearTimeout(src);

        if (this.state.sizes[src]) return;

        get_new_img_obj(src, (i_o) => {

            const size = i_o;

            const sizes = {
                ...this.state.sizes,
                [src]: size
            };

            this.setState({sizes});
        });



    };

    onLoadError = (event, item, src) => {
        this.onLoad(src, this.props.onError(event, item, src) || this.getDefaultSize());
    };

    clearTimeout = (src) => {
        const timeout = this.timeouts[src];
        if (timeout) clearTimeout(timeout);
    };

    setTimeout = (src) => {
        this.clearTimeout(src);
        setTimeout(() => {
            this.setDefaultSize(src);
        }, this.props.timeout);
    };

    getDefaultSize = () => ({
        width: this.props.defaultWidth,
        height: this.props.defaultHeight
    });

    setDefaultSize = (src) => {
        this.onLoad(src, this.getDefaultSize());
    };

    componentDidUpdate() {

        const {items, image} = this.props;

        items.forEach(item => {

            const src = image(item);

            if (!!this.timeouts[src] || !has(src)){

                this.onLoad(src);
                return;
            }

            if (!src) {

                return;
            }

            this.setTimeout(src);
        })

    }

    render() {

        const {items, image, keyMapper, children, defaultWidth, defaultHeight, onError, timeout, ...props} = this.props;
        const {sizes} = this.state;

        const itemsWithSizes = this.makeItemsWithSizes(items, sizes);

        return (
            <div {...props}>

                {children({itemsWithSizes, sizes})}

            </div>
        );

    }
}