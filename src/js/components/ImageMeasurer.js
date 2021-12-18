import React from "react";
import pngdb from "../utils/png-db";
const pngdby = pngdb();

class ImageMeasurer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            className: props.className,
            items: props.items,
            keyMapper: props.keyMapper,
            image: props.image,
            children: props.children,
            itemsWithSizes: [],
            itemsWithSizesComputed: [],
        }
    }

    componentWillReceiveProps(nextProps) {

        let {items, image} = nextProps;

        const itemChanged = true;
        const itemsWithSizes = itemChanged ? new Array(items.length): this.state.itemsWithSizes;

        this.setState({...nextProps, itemsWithSizes, itemsWithSizesComputed: itemChanged ? []: this.state.itemsWithSizesComputed}, () => {

            if(itemChanged) {

                this.maybe_render();

                items.forEach((item, index) => {

                    if(!this.state.itemsWithSizesComputed[index]) {

                        const base64 = image(item);
                        pngdby.get_new_img_obj(base64, (size) => {this._on_size_computed(size, index, item)});
                    }
                });
            }
        });
    }

    _on_size_computed = (size, index, item) => {

        let {itemsWithSizes, itemsWithSizesComputed} = this.state;

        size = {...size};
        item = {...item};
        delete item["image"];

        itemsWithSizes[index] = Object.freeze({
            size: Object.freeze(size),
            item: Object.freeze(item)
        });

        itemsWithSizesComputed[index] = Object.freeze(true);
        this.setState({itemsWithSizesComputed, itemsWithSizes}, () => {

            this.maybe_render();
        });
    }

    shouldComponentUpdate() {
        return false;
    }

    maybe_render = () => {

        const {items, itemsWithSizesComputed} = this.state;
        if(itemsWithSizesComputed.length === items.length) {

            this.forceUpdate();
        }

    }

    render() {

        const {itemsWithSizes, children, className} = this.state;

        return (
            <div className={className}>
                {children({itemsWithSizes})}
            </div>
        );

    }
}

export default ImageMeasurer;