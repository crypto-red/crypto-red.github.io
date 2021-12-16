import React from "react";
import stuff from "../utils/png-db";

const stuffy = stuff();

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
        }
    }

    componentWillReceiveProps(nextProps) {

        const {items, image} = nextProps;

        const itemChanged = items.length !== this.state.items.length || items.map(i => i.id) !== this.state.items.map(i => i.id);
        const itemsWithSizes = itemChanged ? []: this.state.itemsWithSizes;

        this.setState({...nextProps, itemsWithSizes}, () => {

            if(itemChanged) {

                this.maybe_render();
                items.forEach((item, index) => {

                    if(!this.state.itemsWithSizes[index]) {

                        const base64 = image(item);

                        stuffy.get_new_img_obj(base64, (size) => {this._on_size_computed(size, index, item)});

                    }
                });
            }
        });
    }

    _on_size_computed = (size, index, item) => {

        let {itemsWithSizes} = this.state;

        size = {...size};
        item = {...item};
        delete item["image"];

        itemsWithSizes[index] = {
            size: Object.freeze(size),
            item: Object.freeze(item)
        };

        this.setState({itemsWithSizes, sizes: itemsWithSizes.map((iws) => {
                return {
                    width: iws.size.width,
                    height: iws.size.height
                };
            })}, () => {

            this.maybe_render();
        });
    }

    shouldComponentUpdate() {
        return false;
    }

    maybe_render = () => {

        const {itemsWithSizes, items} = this.state;
        if(items.length === itemsWithSizes.length) {

            this.forceUpdate();
        }

    }

    render() {

        const {itemsWithSizes, sizes, children, className} = this.state;

        return (
            <div className={className}>
                {children({itemsWithSizes, sizes})}
            </div>
        );

    }
}

export default ImageMeasurer;