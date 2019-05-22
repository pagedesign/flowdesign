import { jsPlumb } from 'jsPlumb';
import React from 'react';
import { findDOMNode } from 'react-dom';
import "./style.css";

const instance = jsPlumb.getInstance({
    // default drag options
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
    // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
    // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
    ConnectionOverlays: [
        // ["Arrow", {
        //     location: 1,
        //     visible: true,
        //     width: 11,
        //     length: 11,
        //     events: {
        //         click: function () { alert("you clicked on the arrow overlay") }
        //     }
        // }],
        // ["Arrow", {
        //     location: 0.5,
        //     visible: true,
        //     width: 11,
        //     length: 11,
        //     events: {
        //         click: function () { alert("you clicked on the arrow overlay") }
        //     }
        // }],
        ["Arrow", {
            location: 1,
            id: "arrow",
            length: 14,
            foldback: 0.8
        }]
        // ["Label", {
        //     location: 0.1,
        //     id: "label",
        //     cssClass: "aLabel",
        //     events: {
        //         tap: function () { alert("hey"); }
        //     }
        // }]
    ],
    Container: "canvas"
});

var basicType = {
    connector: "Flowchart",
    paintStyle: { stroke: "#000000", strokeWidth: 2 },
    hoverPaintStyle: { stroke: "blue" },
    overlays: [
        "Arrow"
    ]
};
instance.registerConnectionType("basic", basicType);

class FlowItem extends React.Component {

    state = {
        dragNodes: []
    }

    makeSource() {
        const dom = findDOMNode(this)

        instance.makeSource(dom, {
            filter: ".drag-source",
            anchor: "Continuous",
            connectorStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
            connectionType: "basic",
            extract: {
                "action": "the-action"
            },
            endpoint: ["Blank", { radius: 7, cssClass: "small-blue" }],
            maxConnections: -1,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });
    }

    componentDidMount() {
        const dom = findDOMNode(this)
        instance.draggable(dom);
        instance.makeTarget(dom, {
            // dropOptions: { hoverClass: "dragHover" },
            endpoint: ["Blank", { radius: 7, cssClass: "small-blue" }],
            anchor: "Continuous",
            // allowLoopback: true
        });
        this.makeSource();
    }

    render() {
        const { id } = this.props;

        return (
            <div
                tabIndex={0}
                className="window jtk-node"
                id={id}
            >
                <strong>2</strong>
                <br />
                <br />
                <div className="drag-source source-top"></div>
                <div className="drag-source source-right"></div>
                <div className="drag-source source-bottom"></div>
                <div className="drag-source source-left"></div>
            </div>
        );
    }
}

export default class App extends React.Component {

    componentDidMount() {

    }

    render() {
        return (
            <div className="jtk-demo-main">
                <div className="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan" id="canvas">
                    <FlowItem id="f1" />
                    <FlowItem id="f2" />
                    <FlowItem id="f3" />
                    <FlowItem id="f4" />
                </div>
            </div>
        );
    }
}