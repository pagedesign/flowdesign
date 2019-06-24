
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

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactDnd = require("react-dnd");

var _classnames = _interopRequireDefault(require("classnames"));

var _constants = require("../../constants");

var _DesignContext = _interopRequireDefault(require("../../DesignContext"));

var _PreviewDragLayer = _interopRequireDefault(require("./PreviewDragLayer"));

var _PreviewItem = _interopRequireDefault(require("./PreviewItem"));

var spec = {
  canDrop: function canDrop(props, monitor) {
    // const dragItem = monitor.getItem();
    // return dragItem.isWidgetDragging;
    return true;
  },
  drop: function drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }

    var designer = component.context;
    var container = component.container;
    var rect = container.getBoundingClientRect();
    var win = container.ownerDocument.defaultView;
    var containerOffset = {
      y: rect.top + win.pageYOffset,
      x: rect.left + win.pageXOffset
    };
    var dragItem = monitor.getItem();
    var isWidgetDragging = dragItem.isWidgetDragging;
    var node = dragItem.item;

    if (isWidgetDragging) {
      var dragOffset = monitor.getClientOffset();
      node.x = dragOffset.x - containerOffset.x - node.width / 2;
      node.y = dragOffset.y - containerOffset.y - node.height / 2;
      ;
      designer.addItem(node, props.pid);
    }
  }
};

var collect = function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({
      shallow: true
    }),
    canDrop: monitor.canDrop(),
    dragItem: monitor.getItem()
  };
};

var WidgetDropAccepter =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2["default"])(WidgetDropAccepter, _React$Component);

  function WidgetDropAccepter() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, WidgetDropAccepter);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(WidgetDropAccepter)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "renderItem", function (item, i) {
      var designer = _this.context;
      var xtype = item.xtype;
      var widget = designer.getWidget(xtype);
      return _react["default"].createElement(_PreviewItem["default"], {
        designer: designer,
        key: item.fieldId,
        widget: widget,
        item: item
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "containerRef", function (dom) {
      _this.container = dom;
    });
    return _this;
  }

  (0, _createClass2["default"])(WidgetDropAccepter, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          connectDropTarget = _this$props.connectDropTarget,
          isOver = _this$props.isOver,
          canDrop = _this$props.canDrop,
          dragItem = _this$props.dragItem,
          items = _this$props.items,
          _this$props$style = _this$props.style,
          style = _this$props$style === void 0 ? {} : _this$props$style; // const designer = this.context;
      // const items = designer.getItems(pid);

      return connectDropTarget(_react["default"].createElement("div", {
        ref: this.containerRef,
        style: style,
        className: (0, _classnames["default"])({
          "design-layout-container": true,
          "drag-over": isOver,
          "dropable": canDrop
        })
      }, items.map(this.renderItem), _react["default"].createElement(_PreviewDragLayer["default"], null)));
    }
  }]);
  return WidgetDropAccepter;
}(_react["default"].Component);

(0, _defineProperty2["default"])(WidgetDropAccepter, "contextType", _DesignContext["default"]);
(0, _defineProperty2["default"])(WidgetDropAccepter, "defaultProps", {
  pid: null
});

var _default = (0, _reactDnd.DropTarget)(_constants.WIDGET_DRAG_DROP_SCOPE, spec, collect)(WidgetDropAccepter);

exports["default"] = _default;