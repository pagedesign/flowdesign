
"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _jsplumb = require("jsplumb");

var instance = _jsplumb.jsPlumb.getInstance({
  // drag options
  DragOptions: {
    cursor: "pointer",
    zIndex: 2000
  },
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
  ConnectionOverlays: [["Arrow", {
    location: 1,
    visible: true,
    width: 11,
    length: 11,
    id: "ARROW",
    events: {
      click: function click() {
        alert("you clicked on the arrow overlay");
      }
    }
  }], ["Label", {
    label: "<span class='connection-close'>x</span>",
    id: "label",
    cssClass: "connection-line",
    events: {
      click: function click(conn) {
        console.log(conn);
        alert("you clicked on the arrow overlay");
      }
    }
  }]],
  //鼠标经过样式
  HoverPaintStyle: {
    stroke: "#ec9f2e"
  }
});

var _default = instance;
exports["default"] = _default;