import React from 'react';
import { DragLayer } from 'react-dnd';

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: 90,
    height: 60,
    border: '1px dashed red'
}

function getItemStyles(props) {
    const { currentOffset } = props
    if (!currentOffset) {
        return {
            display: 'none',
        }
    }

    const { x, y } = currentOffset
    const transform = `translate(${x}px, ${y}px)`
    return {
        transform: transform,
        WebkitTransform: transform,
    }
}

function collect(monitor) {
    return {
        item: monitor.getItem(),
        currentOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging(),
    };
}

class NodeDragLayer extends React.Component {
    render() {
        const props = this.props;
        const { item, itemType, isDragging, currentOffset } = this.props;

        if (!isDragging || !currentOffset || !item.isWidgetDragging) {
            return null;
        }

        return (
            <div style={{
                ...layerStyles,
                left: currentOffset.x - 90 / 2,
                top: currentOffset.y - 60 / 2
            }}>
            </div>
        )
    }
}

export default DragLayer(collect)(NodeDragLayer)
