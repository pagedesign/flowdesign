import { jsPlumb } from 'jsplumb';


const instance = jsPlumb.getInstance({
    // drag options
    DragOptions: { cursor: "pointer", zIndex: 2000 },
    // default to a gradient stroke from blue to green.
    PaintStyle: {
        // gradient: {
        //     stops: [
        //         [0, "#0d78bc"],
        //         [1, "#558822"]
        //     ]
        // },
        stroke: "#000",
        strokeWidth: 2
    },
    Container: "canvas",
    ConnectionOverlays: [
        ["Arrow", {
            location: 1,
            visible: true,
            width: 11,
            length: 11,
            id: "ARROW",
            events: {
                click: function () { alert("you clicked on the arrow overlay") }
            }
        }],
        ["Label", {
            location: 0.1,
            id: "label",
            cssClass: "aLabel",
            events: {
                tap: function () { alert("hey"); }
            }
        }]
    ],
});

instance.bind("dblclick", function (info) {
    instance.detach(info);
});
instance.bind("connection", function (...a) {
    console.log(...a)

});

export default instance;
