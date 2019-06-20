
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

var _reactDom = require("react-dom");

var _reactDndHtml5Backend = require("react-dnd-html5-backend");

var _flow = _interopRequireDefault(require("lodash/flow"));

var _get = _interopRequireDefault(require("lodash/get"));

var _reactDnd = require("react-dnd");

var _classnames = _interopRequireDefault(require("classnames"));

var _constants = require("../../constants");

var _DesignContext = _interopRequireDefault(require("../../DesignContext"));

var dragSpec = {
  beginDrag: function beginDrag(props, monitor, component) {
    var widget = props.widget;
    var item = props.item;
    var updatePosition = component.updatePosition.bind(component);
    return {
      isWidgetDragging: false,
      isPreviewDragging: true,
      updatePosition: updatePosition,
      widget: widget,
      item: item,
      differenceFromInitialOffset: {
        x: 0,
        y: 0
      }
    };
  },
  endDrag: function endDrag(props, monitor, component) {
    var designer = component.context;
    var dragItem = monitor.getItem();
    var node = dragItem.item;
    var dragOffset = dragItem.differenceFromInitialOffset; // const dragSourceOffset = monitor.getSourceClientOffset();
    // console.log(monitor.getInitialClientOffset(),
    //     monitor.getInitialSourceClientOffset(),
    //     monitor.getClientOffset(),
    //     monitor.getDifferenceFromInitialOffset(),
    //     monitor.getSourceClientOffset(), 'xxxx')

    node.x = dragOffset.x;
    node.y = dragOffset.y;
    console.log('endDrag', node.x, node.y);
    designer.updateItem(node);
  }
};

var dragCollect = function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
};

var WidgetPreviewItem =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2["default"])(WidgetPreviewItem, _React$Component);

  function WidgetPreviewItem() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, WidgetPreviewItem);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(WidgetPreviewItem)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      placeholderPosition: 'none' //none after before top bottom

    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleRemove", function () {
      var designer = _this.context;
      var item = _this.props.item;
      designer.removeItem(item.fieldId);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "saveRef", function (dom) {
      _this.domRef = dom;
    });
    return _this;
  }

  (0, _createClass2["default"])(WidgetPreviewItem, [{
    key: "handlePreviewClick",
    value: function handlePreviewClick(item, e) {
      if (e.isDefaultPrevented()) {
        return;
      }

      e.preventDefault();
      var designer = this.context;
      designer.setActiveId(item.fieldId);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var connectDragPreview = this.props.connectDragPreview;

      if (connectDragPreview) {
        // Use empty image as a drag preview so browsers don't draw it
        // and we can draw whatever we want on the custom drag layer instead.
        connectDragPreview((0, _reactDndHtml5Backend.getEmptyImage)(), {
          // IE fallback: specify that we'd rather screenshot the node
          // when it already knows it's being dragged so we can hide it with CSS.
          captureDraggingState: true
        });
      }
    }
  }, {
    key: "updatePosition",
    value: function updatePosition() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var isDragging = this.props.isDragging;

      if (!isDragging) {
        console.log('updatePosition is not dragging');
        return;
      }

      ;
      this.domRef.style.left = x + 'px';
      this.domRef.style.top = y + 'px';
      console.log('updatePosition', x, y);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          connectDropTarget = _this$props.connectDropTarget,
          connectDragSource = _this$props.connectDragSource,
          isDragging = _this$props.isDragging,
          isOver = _this$props.isOver,
          widget = _this$props.widget,
          item = _this$props.item,
          dragItem = _this$props.dragItem;
      var designer = this.context;
      var activeId = designer.getActiveId();
      return _react["default"].createElement("div", {
        ref: this.saveRef,
        className: (0, _classnames["default"])({
          "widget-preview-item-wrapper": true,
          "droppable": isOver,
          "dragging": isDragging // "drop-tips": canDrop,

        }),
        style: {
          display: 'inline-block',
          width: item.width,
          height: item.height,
          left: item.x,
          top: item.y
        }
      }, _react["default"].createElement("div", {
        ref: connectDragSource,
        className: (0, _classnames["default"])({
          "widget-preview-item": true,
          "widget-preview-item-selected": activeId === item.fieldId
        }),
        onClick: this.handlePreviewClick.bind(this, item)
      }, _react["default"].createElement(widget.Preview, {
        item: item,
        designer: designer
      }), _react["default"].createElement("span", {
        className: "widget-preview-close",
        onClick: this.handleRemove
      }, "x")));
    }
  }]);
  return WidgetPreviewItem;
}(_react["default"].Component);

(0, _defineProperty2["default"])(WidgetPreviewItem, "contextType", _DesignContext["default"]);

var _default = (0, _reactDnd.DragSource)(_constants.WIDGET_DRAG_DROP_SCOPE, dragSpec, dragCollect)(WidgetPreviewItem);

exports["default"] = _default;