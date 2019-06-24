
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _reactDnd = require("react-dnd");

var layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: 90,
  height: 60,
  border: '2px solid #8f8f8f'
};

function getItemStyles(props) {
  var currentOffset = props.currentOffset;

  if (!currentOffset) {
    return {
      display: 'none'
    };
  }

  var x = currentOffset.x,
      y = currentOffset.y;
  var transform = "translate(".concat(x, "px, ").concat(y, "px)");
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging()
  };
}

var NodeDragLayer =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2["default"])(NodeDragLayer, _React$Component);

  function NodeDragLayer() {
    (0, _classCallCheck2["default"])(this, NodeDragLayer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(NodeDragLayer).apply(this, arguments));
  }

  (0, _createClass2["default"])(NodeDragLayer, [{
    key: "render",
    value: function render() {
      var props = this.props;
      var _this$props = this.props,
          item = _this$props.item,
          itemType = _this$props.itemType,
          isDragging = _this$props.isDragging,
          currentOffset = _this$props.currentOffset;

      if (!isDragging || !currentOffset || !item.isWidgetDragging) {
        return null;
      }

      return _react["default"].createElement("div", {
        style: (0, _objectSpread2["default"])({}, layerStyles, {
          left: currentOffset.x - 90 / 2,
          top: currentOffset.y - 60 / 2
        })
      });
    }
  }]);
  return NodeDragLayer;
}(_react["default"].Component);

var _default = (0, _reactDnd.DragLayer)(collect)(NodeDragLayer);

exports["default"] = _default;