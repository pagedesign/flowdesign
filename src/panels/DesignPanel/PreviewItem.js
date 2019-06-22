import React from 'react';
import { findDOMNode } from 'react-dom';
import { getEmptyImage } from 'react-dnd-html5-backend';

import {
    DragSource,
    DropTarget,
} from 'react-dnd';
import cx from 'classnames';
import {
    WIDGET_DRAG_DROP_SCOPE
} from '../../constants';
import DesignContext from '../../DesignContext';
import "./PreviewItem.scss";

const dragSpec = {
    beginDrag(props, monitor, component) {
        const widget = props.widget;
        const item = props.item;
        const updatePosition = component.updatePosition.bind(component);
        return {
            isWidgetDragging: false,
            isPreviewDragging: true,
            updatePosition,
            widget: widget,
            item: item,
            differenceFromInitialOffset: {
                x: 0,
                y: 0
            }
        };
    },
    endDrag(props, monitor, component) {
        const designer = component.context;
        const dragItem = monitor.getItem();
        const node = dragItem.item;
        const dragOffset = dragItem.differenceFromInitialOffset;

        node.x = dragOffset.x;
        node.y = dragOffset.y;

        designer.updateItem(node);
    }
};

const dragCollect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    };
}
class WidgetPreviewItem extends React.Component {

    static contextType = DesignContext;

    state = {
        placeholderPosition: 'none', //none after before top bottom
    }

    handlePreviewClick(item, e) {
        if (e.isDefaultPrevented()) {
            return;
        }
        e.preventDefault();
        const designer = this.context;
        designer.setActiveId(item.fieldId);
    }

    handleRemove = () => {
        const designer = this.context;
        const { item } = this.props;
        designer.removeItem(item.fieldId);
    }

    componentDidMount() {
        const { connectDragPreview } = this.props
        const designer = this.context;
        if (connectDragPreview) {
            // Use empty image as a drag preview so browsers don't draw it
            // and we can draw whatever we want on the custom drag layer instead.
            connectDragPreview(getEmptyImage(), {
                // IE fallback: specify that we'd rather screenshot the node
                // when it already knows it's being dragged so we can hide it with CSS.
                captureDraggingState: true,
            })
        }

        const dom = findDOMNode(this);

        designer.flowInstance.makeSource(dom, {
            filter: '.flow-source-point',
            maxConnections: -1,
            endpoint: ["Blank", { radius: 7, cssClass: "small-blue" }],
            connector: ["Flowchart", { stub: [0, 0], gap: 0, cornerRadius: 5, alwaysRespectStubs: true }],
            anchor: "Continuous",
        });

        // configure the .smallWindows as targets.
        designer.flowInstance.makeTarget(dom, {
            dropOptions: { hoverClass: "hover" },
            connector: ["Flowchart", { stub: [100, 0], gap: 0, cornerRadius: 5, alwaysRespectStubs: true }],
            anchor: "Continuous",
            endpoint: ["Blank", { radius: 11, cssClass: "large-green" }]
        });
    }

    updatePosition(x = 0, y = 0) {
        const { isDragging } = this.props;
        const designer = this.context;
        if (!isDragging) {
            return
        };

        this.domRef.style.left = x + 'px';
        this.domRef.style.top = y + 'px';

        designer.flowInstance.repaintEverything();

    }

    saveRef = (dom) => {
        this.domRef = dom;
    }


    renderSourcePoint(position = 'bottom') {
        return (
            <div
                className={
                    cx("flow-source-point", "position-" + position)
                }
            >
            </div>
        );
    }

    render() {
        const { connectDropTarget, connectDragSource, isDragging, isOver, widget, item, dragItem } = this.props;
        const designer = this.context;
        const activeId = designer.getActiveId();

        return (
            <div
                ref={this.saveRef}
                id={item.fieldId}
                className={cx({
                    "widget-preview-item-wrapper": true,
                    "droppable": isOver,
                    "dragging": isDragging,
                    // "drop-tips": canDrop,
                })}

                style={{
                    display: 'inline-block',
                    width: item.width,
                    height: item.height,
                    left: item.x,
                    top: item.y,
                }}

            >
                <div
                    ref={connectDragSource}
                    className={cx({
                        "widget-preview-item": true,
                        "widget-preview-item-selected": activeId === item.fieldId,
                    })}
                    onClick={this.handlePreviewClick.bind(this, item)}
                >
                    <widget.Preview item={item} designer={designer} />
                    <span className="widget-preview-close" onClick={this.handleRemove}>x</span>
                </div>
                {this.renderSourcePoint('top')}
                {this.renderSourcePoint('left')}
                {this.renderSourcePoint('right')}
                {this.renderSourcePoint('bottom')}
            </div>
        );
    }
}

export default DragSource(WIDGET_DRAG_DROP_SCOPE, dragSpec, dragCollect)(WidgetPreviewItem)