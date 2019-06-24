
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactDnd = require("react-dnd");

var _DesignContext = _interopRequireDefault(require("../../DesignContext"));

require("./PreviewDragLayer.scss");

function collect(monitor) {
  return {
    dragItem: monitor.getItem(),
    dragOffset: monitor.getDifferenceFromInitialOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
    isDragging: monitor.isDragging()
  };
}

var PreviewDragLayer =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2["default"])(PreviewDragLayer, _React$Component);

  function PreviewDragLayer() {
    (0, _classCallCheck2["default"])(this, PreviewDragLayer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PreviewDragLayer).apply(this, arguments));
  }

  (0, _createClass2["default"])(PreviewDragLayer, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$props = this.props,
          dragOffset = _this$props.dragOffset,
          currentOffset = _this$props.currentOffset,
          dragItem = _this$props.dragItem,
          isDragging = _this$props.isDragging,
          initialClientOffset = _this$props.initialClientOffset;

      if (!isDragging || !currentOffset || dragItem.isWidgetDragging) {
        return;
      }

      var dragNode = dragItem.item;
      var update = dragItem.updatePosition; // console.log(dragOffset, currentOffset, initialClientOffset, isDragging, 'abcc')

      dragItem.differenceFromInitialOffset = {
        x: dragNode.x + dragOffset.x,
        y: dragNode.y + dragOffset.y
      };
      update && update(dragNode.x + dragOffset.x, dragNode.y + dragOffset.y);
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);
  return PreviewDragLayer;
}(_react["default"].Component);

(0, _defineProperty2["default"])(PreviewDragLayer, "contextType", _DesignContext["default"]);

var _default = (0, _reactDnd.DragLayer)(collect)(PreviewDragLayer);

exports["default"] = _default;