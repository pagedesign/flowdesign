import React from 'react';
import { DragLayer } from 'react-dnd';
import DesignContext from '../../DesignContext';
// import "./PreviewDragLayer.scss";

function collect(monitor) {
    return {
        dragItem: monitor.getItem(),
        dragOffset: monitor.getDifferenceFromInitialOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
        isDragging: monitor.isDragging(),
    };
}

class PreviewDragLayer extends React.Component {

    static contextType = DesignContext;

    componentDidUpdate() {
        const { dragOffset, currentOffset, dragItem, isDragging, initialClientOffset } = this.props;

        if (!isDragging || !currentOffset || dragItem.isWidgetDragging) {
            return;
        }

        const dragNode = dragItem.item;
        const update = dragItem.updatePosition;
        // console.log(dragOffset, currentOffset, initialClientOffset, isDragging, 'abcc')

        dragItem.differenceFromInitialOffset = {
            x: dragNode.x + dragOffset.x,
            y: dragNode.y + dragOffset.y
        }

        update && update(dragNode.x + dragOffset.x, dragNode.y + dragOffset.y);
    }

    render() {
        return null
    }
}

export default DragLayer(collect)(PreviewDragLayer)
