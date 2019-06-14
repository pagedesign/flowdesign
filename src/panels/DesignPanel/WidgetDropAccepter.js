import React from 'react';
import {
    DragSource,
    DropTarget,
} from 'react-dnd';
import cx from 'classnames';
import {
    WIDGET_DRAG_DROP_SCOPE
} from '../../constants';
import DesignContext from '../../DesignContext';

import PreviewItem from './PreviewItem';

const spec = {
    canDrop(props, monitor) {
        // const dragItem = monitor.getItem();
        // return dragItem.isWidgetDragging;
        return true;
    },
    // hover(props, monitor, component) {
    //      if(!monitor.canDrop()) return;
    //     const isOver = monitor.isOver({ shallow: true });
    //     if (isOver) {
    //         console.log('WidgetDropAccepter over...')
    //     }
    // },
    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        }
        const designer = component.context;
        const container = component.container;
        const rect = container.getBoundingClientRect();
        const win = container.ownerDocument.defaultView;
        const containerOffset = {
            y: rect.top + win.pageYOffset,
            x: rect.left + win.pageXOffset
        };

        const dragItem = monitor.getItem();
        const isWidgetDragging = dragItem.isWidgetDragging;
        const node = dragItem.item;

        if (isWidgetDragging) {
            const dragOffset = monitor.getClientOffset();
            node.x = dragOffset.x - containerOffset.x - node.width / 2;
            node.y = dragOffset.y - containerOffset.y - node.height / 2;;

            designer.addItem(node, props.pid);
        } else {
            const dragOffset = monitor.getDifferenceFromInitialOffset();
            const dragSourceOffset = monitor.getSourceClientOffset();
            console.log(dragOffset, dragSourceOffset, 'xxxx')
            node.x += dragOffset.x;
            node.y += dragOffset.y;
            designer.updateItem(node);
        }
    }
};

const collect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        dragItem: monitor.getItem(),
    }
}

class WidgetDropAccepter extends React.Component {

    static contextType = DesignContext;

    static defaultProps = {
        pid: null,
    }

    rendrePlaceholder() {
        const { dragItem } = this.props;
        const { widget, item } = dragItem

        return (
            <widget.PlaceholderPreview widget={widget} item={item} />
        );
    }

    renderItem = (item, i) => {
        const designer = this.context;
        const xtype = item.xtype;
        const widget = designer.getWidget(xtype);

        return <PreviewItem designer={designer} key={item.fieldId} widget={widget} item={item} />
    }

    containerRef = (dom) => {
        this.container = dom;
    }

    render() {
        const { connectDropTarget, isOver, canDrop, dragItem, items, style = {} } = this.props;
        // const designer = this.context;
        // const items = designer.getItems(pid);

        return connectDropTarget(
            <div
                ref={this.containerRef}
                style={style}
                className={cx({
                    "design-layout-container": true,
                    "drag-over": isOver,
                    "dropable": canDrop,
                })}>
                {
                    items.map(this.renderItem)
                }
                {
                    isOver && dragItem.isWidgetDragging ? this.rendrePlaceholder() : null
                }
            </div>
        );
    }
}

export default DropTarget(WIDGET_DRAG_DROP_SCOPE, spec, collect)(WidgetDropAccepter);