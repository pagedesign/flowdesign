import React from 'react';
import {
    DragSource,
    DropTarget,
    DragPreviewImage,
} from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import cx from 'classnames';
import {
    WIDGET_DRAG_DROP_SCOPE
} from '../../constants';

const spec = {
    beginDrag(props) {
        const widget = props.widget;
        const item = widget.getItem();
        return {
            isWidgetDragging: true,
            widget,
            item,
        };
    },
    // endDrag(props, monitor, component) {
    //     console.log('endDrag')
    // },
    // canDrag(props) {
    //     return !props.disabled;
    // }
};

const collect = (connect, monitor) => {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
};

class WidgetItem extends React.Component {
    componentDidMount() {
        const { connectDragPreview } = this.props
        if (connectDragPreview) {
            // Use empty image as a drag preview so browsers don't draw it
            // and we can draw whatever we want on the custom drag layer instead.
            connectDragPreview(getEmptyImage(), {
                // IE fallback: specify that we'd rather screenshot the node
                // when it already knows it's being dragged so we can hide it with CSS.
                captureDraggingState: true,
            })
        }
    }
    render() {
        const { disabled, widget, connectDragSource, isDragging } = this.props;
        const { title = "未知组件", icon } = widget;
        return (
            <>
                <div
                    ref={connectDragSource}
                    className={cx({
                        "widget-item": true,
                        "widget-item-dragging": isDragging,
                        "widget-item-disabled": disabled,
                    })}
                >
                    <div className="widget-item-title">
                        <img src={icon} />
                        <span className="widget-text">{title}</span>
                    </div>
                </div>
            </>
        );
    }
}

export default DragSource(WIDGET_DRAG_DROP_SCOPE, spec, collect)(WidgetItem);