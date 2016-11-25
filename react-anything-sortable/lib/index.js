(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactDOM"], factory);
	else if(typeof exports === 'object')
		exports["react-anything-sortable"] = factory(require("react"), require("react-dom"));
	else
		root["react-anything-sortable"] = factory(root["React"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file react-anything-sortable
	 * @author jasonslyvia
	 */
	
	/* eslint new-cap:0, consistent-return: 0, react/prefer-es6-class: 0, react/sort-comp: 0 */
	/**
	 * @dependency
	 */
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(2);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _utils = __webpack_require__(3);
	
	var _SortableItemMixin = __webpack_require__(4);
	
	var _SortableItemMixin2 = _interopRequireDefault(_SortableItemMixin);
	
	var STACK_SIZE = 6;
	var getSortTarget = function getSortTarget(child) {
	  // `onSortableItemReadyToMove` only exist when using mixins or decorators
	  return child && child.props && _utils.isFunction(child.props.onSortableItemReadyToMove);
	};
	
	/**
	 * @class Sortable
	 */
	var Sortable = _react2['default'].createClass({
	  displayName: 'Sortable',
	
	  propTypes: {
	    /**
	     * callback fires after sort operation finish
	     * function (dataSet){
	     *   //dataSet sorted
	     * }
	     */
	    onSort: _react.PropTypes.func,
	    className: _react.PropTypes.string,
	    sortHandle: _react.PropTypes.string,
	    containment: _react.PropTypes.bool,
	    dynamic: _react.PropTypes.bool,
	    direction: _react.PropTypes.string,
	    children: _react.PropTypes.arrayOf(_react.PropTypes.node)
	  },
	
	  setArrays: function setArrays(currentChildren) {
	    var children = Array.isArray(currentChildren) ? currentChildren : [currentChildren];
	
	    var sortChildren = children.filter(getSortTarget);
	    this.sortChildren = sortChildren;
	
	    // keep tracking the dimension and coordinates of all children
	    this._dimensionArr = sortChildren.map(function () {
	      return {};
	    });
	
	    // keep tracking the order of all children
	    this._orderArr = [];
	    var i = 0;
	    while (i < this._dimensionArr.length) {
	      this._orderArr.push(i++);
	    }
	  },
	
	  getInitialState: function getInitialState() {
	    this.setArrays(this.props.children);
	
	    return {
	      isDragging: false,
	      placeHolderIndex: null,
	      left: null,
	      top: null
	    };
	  },
	
	  componentDidUpdate: function componentDidUpdate() {
	    var container = _reactDom2['default'].findDOMNode(this);
	    var rect = container.getBoundingClientRect();
	
	    this._top = rect.top + document.body.scrollTop;
	    this._left = rect.left + document.body.scrollLeft;
	    this._bottom = this._top + rect.height;
	    this._right = this._left + rect.width;
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var _props = this.props;
	    var children = _props.children;
	    var dynamic = _props.dynamic;
	
	    if (dynamic && nextProps.children !== children) {
	      this.setArrays(nextProps.children);
	    }
	  },
	
	  componentWillUnmount: function componentWillUnmount() {
	    this.unbindEvent();
	  },
	
	  bindEvent: function bindEvent() {
	    var _this = this;
	
	    // so that the focus won't be lost if cursor moving too fast
	    this.__mouseMoveHandler = function (e) {
	      /**
	       * Since Chrome may trigger redundant mousemove event evne if
	       * we didn't really move the mouse, we should make sure that
	       * mouse coordinates really changed then respond to mousemove
	       * event
	       * @see https://code.google.com/p/chromium/issues/detail?id=327114
	       */
	      if ((e.pageX || e.clientX) === _this._prevX && (e.pageY || e.clientY) === _this._prevY || _this._prevX === null && _this._prevY === null) {
	        return false;
	      }
	
	      _this.handleMouseMove.call(_this, e);
	    };
	
	    this.__mouseUpHandler = function (e) {
	      _this.handleMouseUp.call(_this, e);
	    };
	
	    this.__touchMoveHandler = function (e) {
	      // blocks the default scrolling as we sort an element
	      e.preventDefault();
	
	      _this.handleMouseMove.call(_this, {
	        target: e.target,
	        clientX: e.touches[0].clientX,
	        clientY: e.touches[0].clientY,
	        pageX: e.touches[0].pageX,
	        pageY: e.touches[0].pageY
	      });
	    };
	
	    this.__touchEndOrCancelHandler = function (e) {
	      _this.handleMouseUp.call(_this, e);
	    };
	
	    _utils.on(document, 'touchmove', this.__touchMoveHandler);
	    _utils.on(document, 'touchend', this.__touchEndOrCancelHandler);
	    _utils.on(document, 'touchcancel', this.__touchEndOrCancelHandler);
	    _utils.on(document, 'mousemove', this.__mouseMoveHandler);
	    _utils.on(document, 'mouseup', this.__mouseUpHandler);
	  },
	
	  unbindEvent: function unbindEvent() {
	    _utils.off(document, 'touchmove', this.__touchMoveHandler);
	    _utils.off(document, 'touchend', this.__touchEndOrCancelHandler);
	    _utils.off(document, 'touchcancel', this.__touchEndOrCancelHandler);
	    _utils.off(document, 'mousemove', this.__mouseMoveHandler);
	    _utils.off(document, 'mouseup', this.__mouseUpHandler);
	
	    this.__mouseMoveHandler = null;
	    this.__mouseUpHandler = null;
	    this.__touchMoveHandler = null;
	    this.__touchEndOrCancelHandler = null;
	  },
	
	  /**
	   * getting ready for dragging
	   * @param  {object} e     React event
	   * @param  {numbner} index index of pre-dragging item
	   */
	  handleMouseDown: function handleMouseDown(e, index) {
	    this._draggingIndex = index;
	    this._prevX = e.pageX || e.clientX;
	    this._prevY = e.pageY || e.clientY;
	    this._initOffset = e.offset;
	    this._isReadyForDragging = true;
	    this._hasInitDragging = false;
	
	    // start listening mousemove and mouseup
	    this.bindEvent();
	  },
	
	  /**
	   * `add` a dragging item and re-calculating position of placeholder
	   * @param  {object} e     React event
	   */
	  handleMouseMove: function handleMouseMove(e) {
	    this._isMouseMoving = true;
	
	    if (!this._isReadyForDragging) {
	      return false;
	    }
	
	    if (!this._hasInitDragging) {
	      this._dimensionArr[this._draggingIndex].isPlaceHolder = true;
	      this._hasInitDragging = true;
	    }
	
	    if (this.props.containment) {
	      var x = e.pageX || e.clientX;
	      var y = e.pageY || e.clientY;
	
	      if (x < this._left || x > this._right || y < this._top || y > this._bottom) {
	        return false;
	      }
	    }
	
	    var newOffset = this.calculateNewOffset(e);
	    var newIndex = this.calculateNewIndex(e);
	
	    this._draggingIndex = newIndex;
	
	    this.setState({
	      isDragging: true,
	      top: this.props.direction === 'horizontal' ? this._initOffset.top : newOffset.top,
	      left: this.props.direction === 'vertical' ? this._initOffset.left : newOffset.left,
	      placeHolderIndex: newIndex
	    });
	
	    this._prevX = e.pageX || e.clientX;
	    this._prevY = e.pageY || e.clientY;
	  },
	
	  /**
	   * replace placeholder with dragging item
	   * @param  {object} e     React event
	   */
	  handleMouseUp: function handleMouseUp() {
	    var _hasMouseMoved = this._isMouseMoving;
	    this.unbindEvent();
	
	    var draggingIndex = this._draggingIndex;
	    // reset temp lets
	    this._draggingIndex = null;
	    this._isReadyForDragging = false;
	    this._isMouseMoving = false;
	    this._initOffset = null;
	    this._prevX = null;
	    this._prevY = null;
	
	    if (this.state.isDragging) {
	      this._dimensionArr[this.state.placeHolderIndex].isPlaceHolder = false;
	
	      if (_hasMouseMoved) {
	        this.setState({
	          isDragging: false,
	          placeHolderIndex: null,
	          left: null,
	          top: null
	        });
	      }
	
	      // sort finished, callback fires
	      if (_utils.isFunction(this.props.onSort)) {
	        var sortData = this.getSortData();
	        this.props.onSort(sortData, sortData[draggingIndex], draggingIndex);
	      }
	    }
	  },
	
	  /**
	   * when children mounted, return its size(handled by SortableItemMixin)
	   * @param  {object} offset {top:1, left:2}
	   * @param  {number} width
	   * @param  {number} height
	   * @param  {number} fullWidth  (with margin)
	   * @param  {number} fullHeight (with margin)
	   * @param  {number} index
	   */
	  handleChildUpdate: function handleChildUpdate(offset, width, height, fullWidth, fullHeight, index) {
	    _utils.assign(this._dimensionArr[index], {
	      top: offset.top,
	      left: offset.left,
	      width: width,
	      height: height,
	      fullWidth: fullWidth,
	      fullHeight: fullHeight
	    });
	  },
	
	  /**
	   * get new index of all items by cursor position
	   * @param {object} offset {left: 12, top: 123}
	   * @param {string} direction cursor moving direction, used to aviod blinking when
	   *                 interchanging position of different width elements
	   * @return {number}
	   */
	  getIndexByOffset: function getIndexByOffset(offset, direction) {
	    if (!offset || !_utils.isNumeric(offset.top) || !_utils.isNumeric(offset.left)) {
	      return 0;
	    }
	
	    var _dimensionArr = this._dimensionArr;
	    var offsetX = offset.left;
	    var offsetY = offset.top;
	    var prevIndex = this.state.placeHolderIndex !== null ? this.state.placeHolderIndex : this._draggingIndex;
	    var newIndex = undefined;
	
	    _dimensionArr.every(function (item, index) {
	      var relativeLeft = offsetX - item.left;
	      var relativeTop = offsetY - item.top;
	
	      if (relativeLeft < item.fullWidth && relativeTop < item.fullHeight) {
	        if (relativeLeft < item.fullWidth / 2 && direction === 'left') {
	          newIndex = index;
	        } else if (relativeLeft > item.fullWidth / 2 && direction === 'right') {
	          newIndex = Math.min(index + 1, _dimensionArr.length - 1);
	        } else if (relativeTop < item.fullHeight / 2 && direction === 'up') {
	          newIndex = index;
	        } else if (relativeTop > item.fullHeight / 2 && direction === 'down') {
	          newIndex = Math.min(index + 1, _dimensionArr.length - 1);
	        } else {
	          return true;
	        }
	
	        return false;
	      }
	      return true;
	    });
	
	    return newIndex !== undefined ? newIndex : prevIndex;
	  },
	
	  /**
	   * untility function
	   * @param  {array} arr
	   * @param  {number} src
	   * @param  {number} to
	   * @return {array}
	   */
	  swapArrayItemPosition: function swapArrayItemPosition(arr, src, to) {
	    if (!arr || !_utils.isNumeric(src) || !_utils.isNumeric(to)) {
	      return arr;
	    }
	
	    var srcEl = arr.splice(src, 1)[0];
	    arr.splice(to, 0, srcEl);
	    return arr;
	  },
	
	  /**
	   * calculate new offset
	   * @param  {object} e MouseMove event
	   * @return {object}   {left: 1, top: 1}
	   */
	  calculateNewOffset: function calculateNewOffset(e) {
	    var deltaX = this._prevX - (e.pageX || e.clientX);
	    var deltaY = this._prevY - (e.pageY || e.clientY);
	
	    var prevLeft = this.state.left !== null ? this.state.left : this._initOffset.left;
	    var prevTop = this.state.top !== null ? this.state.top : this._initOffset.top;
	    var newLeft = prevLeft - deltaX;
	    var newTop = prevTop - deltaY;
	
	    return {
	      left: newLeft,
	      top: newTop
	    };
	  },
	
	  /**
	   * calculate new index and do swapping
	   * @param  {object} e MouseMove event
	   * @return {number}
	   */
	  calculateNewIndex: function calculateNewIndex(e) {
	    var placeHolderIndex = this.state.placeHolderIndex !== null ? this.state.placeHolderIndex : this._draggingIndex;
	
	    // Since `mousemove` is listened on document, when cursor move too fast,
	    // `e.target` may be `body` or some other stuff instead of
	    // `.ui-sortable-item`
	    var target = _utils.get('.ui-sortable-dragging') || _utils.closest(e.target || e.srcElement, '.ui-sortable-item');
	    var offset = _utils.position(target);
	
	    var currentX = e.pageX || e.clientX;
	    var currentY = e.pageY || e.clientY;
	
	    var deltaX = Math.abs(this._prevX - currentX);
	    var deltaY = Math.abs(this._prevY - currentY);
	
	    var direction = undefined;
	    if (deltaX > deltaY) {
	      // tend to move left/right
	      direction = this._prevX > currentX ? 'left' : 'right';
	    } else {
	      // tend to move up/down
	      direction = this._prevY > currentY ? 'up' : 'down';
	    }
	
	    var newIndex = this.getIndexByOffset(offset, this.getPossibleDirection(direction));
	    if (newIndex !== placeHolderIndex) {
	      this._dimensionArr = this.swapArrayItemPosition(this._dimensionArr, placeHolderIndex, newIndex);
	      this._orderArr = this.swapArrayItemPosition(this._orderArr, placeHolderIndex, newIndex);
	    }
	
	    return newIndex;
	  },
	
	  getSortData: function getSortData() {
	    var _this2 = this;
	
	    return this._orderArr.map(function (itemIndex) {
	      var item = _this2.sortChildren[itemIndex];
	      if (!item) {
	        return undefined;
	      }
	
	      return item.props.sortData;
	    });
	  },
	
	  getPossibleDirection: function getPossibleDirection(direction) {
	    this._stack = this._stack || [];
	    this._stack.push(direction);
	    if (this._stack.length > STACK_SIZE) {
	      this._stack.shift();
	    }
	
	    if (this._stack.length < STACK_SIZE) {
	      return direction;
	    }
	
	    return _utils.findMostOften(this._stack);
	  },
	
	  /**
	   * render all sortable children which mixined with SortableItemMixin
	   */
	  renderItems: function renderItems() {
	    var _this3 = this;
	
	    var _dimensionArr = this._dimensionArr;
	    var _orderArr = this._orderArr;
	
	    var draggingItem = undefined;
	
	    var items = _orderArr.map(function (itemIndex, index) {
	      var item = _this3.sortChildren[itemIndex];
	      if (!item) {
	        return;
	      }
	
	      if (index === _this3._draggingIndex && _this3.state.isDragging) {
	        draggingItem = _this3.renderDraggingItem(item);
	      }
	
	      var isPlaceHolder = _dimensionArr[index].isPlaceHolder;
	      var itemClassName = 'ui-sortable-item\n                             ' + (isPlaceHolder && 'ui-sortable-placeholder') + '\n                             ' + (_this3.state.isDragging && isPlaceHolder && 'visible');
	
	      var sortableProps = {
	        sortableClassName: item.props.className + ' ' + itemClassName,
	        sortableIndex: index,
	        onSortableItemReadyToMove: isPlaceHolder ? undefined : function (e) {
	          _this3.handleMouseDown.call(_this3, e, index);
	        },
	        onSortableItemMount: _this3.handleChildUpdate,
	        sortHandle: _this3.props.sortHandle
	      };
	
	      if (item.key === undefined) {
	        sortableProps.key = index;
	      }
	
	      return _react2['default'].cloneElement(item, sortableProps);
	    });
	
	    var children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
	
	    var result = children.map(function (child) {
	      if (getSortTarget(child)) {
	        return items.shift();
	      }
	      return child;
	    }).concat([draggingItem]);
	
	    return result;
	  },
	
	  /**
	   * render the item that being dragged
	   * @param  {object} item a reference of this.props.children
	   */
	  renderDraggingItem: function renderDraggingItem(item) {
	    if (!item) {
	      return;
	    }
	
	    var style = {
	      top: this.state.top,
	      left: this.state.left,
	      width: this._dimensionArr[this._draggingIndex].width,
	      height: this._dimensionArr[this._draggingIndex].height
	    };
	    return _react2['default'].cloneElement(item, {
	      sortableClassName: item.props.className + ' ui-sortable-item ui-sortable-dragging',
	      key: '_dragging',
	      sortableStyle: style,
	      isDragging: true,
	      sortHandle: this.props.sortHandle
	    });
	  },
	
	  render: function render() {
	    var className = 'ui-sortable ' + (this.props.className || '');
	
	    return _react2['default'].createElement(
	      'div',
	      { className: className },
	      this.renderItems()
	    );
	  }
	});
	
	var SortableContainer = function SortableContainer(_ref) {
	  var className = _ref.className;
	  var style = _ref.style;
	  var onMouseDown = _ref.onMouseDown;
	  var onTouchStart = _ref.onTouchStart;
	  var children = _ref.children;
	
	  if (_react2['default'].isValidElement(children)) {
	    return _react2['default'].cloneElement(children, {
	      className: className, style: style, onMouseDown: onMouseDown, onTouchStart: onTouchStart
	    });
	  } else {
	    return _react2['default'].createElement('div', {
	      className: className, style: style, onMouseDown: onMouseDown, onTouchStart: onTouchStart, children: children
	    });
	  }
	};
	
	Sortable.SortableItemMixin = _SortableItemMixin2['default']();
	Sortable.sortable = _SortableItemMixin2['default'];
	Sortable.SortableContainer = _SortableItemMixin2['default'](SortableContainer);
	
	exports['default'] = Sortable;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * @fileOverview jQuery replacement
	 * @author jasonslyvia
	 */
	'use strict';
	
	exports.__esModule = true;
	exports.on = on;
	exports.off = off;
	exports.isFunction = isFunction;
	exports.isNumeric = isNumeric;
	exports.position = position;
	exports.width = width;
	exports.height = height;
	exports.outerWidthWithMargin = outerWidthWithMargin;
	exports.outerHeightWithMargin = outerHeightWithMargin;
	exports.closest = closest;
	exports.assign = assign;
	exports.get = get;
	exports.findMostOften = findMostOften;
	
	function on(el, eventName, callback) {
	  if (el.addEventListener) {
	    el.addEventListener(eventName, callback, false);
	  } else if (el.attachEvent) {
	    el.attachEvent('on' + eventName, function (e) {
	      callback.call(el, e || window.event);
	    });
	  }
	}
	
	function off(el, eventName, callback) {
	  if (el.removeEventListener) {
	    el.removeEventListener(eventName, callback);
	  } else if (el.detachEvent) {
	    el.detachEvent('on' + eventName, callback);
	  }
	}
	
	function isFunction(func) {
	  return typeof func === 'function';
	}
	
	function isNumeric(num) {
	  return !isNaN(parseFloat(num)) && isFinite(num);
	}
	
	function position(el) {
	  if (!el) {
	    return {
	      left: 0,
	      top: 0
	    };
	  }
	
	  return {
	    left: el.offsetLeft,
	    top: el.offsetTop
	  };
	}
	
	function width(el) {
	  return el.offsetWidth;
	}
	
	function height(el) {
	  return el.offsetHeight;
	}
	
	function outerWidthWithMargin(el) {
	  var _width = el.offsetWidth;
	  var style = el.currentStyle || getComputedStyle(el);
	
	  _width += (parseInt(style.marginLeft, 10) || 0) + (parseInt(style.marginRight, 10) || 0);
	  return _width;
	}
	
	function outerHeightWithMargin(el) {
	  var _height = el.offsetHeight;
	  var style = el.currentStyle || getComputedStyle(el);
	
	  _height += (parseInt(style.marginLeft, 10) || 0) + (parseInt(style.marginRight, 10) || 0);
	  return _height;
	}
	
	function hasClass(elClassName, className) {
	  return (' ' + elClassName + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + className + ' ') > -1;
	}
	
	function closest(el, className) {
	  className = className.replace(/^[\b\.]/, '');
	
	  var finder = function finder(_x, _x2) {
	    var _again = true;
	
	    _function: while (_again) {
	      var _el = _x,
	          _className = _x2;
	      _again = false;
	
	      var _elClassName = typeof _el.className === 'object' ? _el.className.baseVal : _el.className;
	      if (_elClassName && hasClass(_elClassName, _className)) {
	        return _el;
	      } else if (_el.parentNode === null) {
	        // matches document
	        return null;
	      }
	
	      _x = _el.parentNode;
	      _x2 = _className;
	      _again = true;
	      _elClassName = undefined;
	      continue _function;
	    }
	  };
	
	  return finder(el, className);
	}
	
	function assign(target) {
	  if (target === undefined || target === null) {
	    throw new TypeError('Cannot convert first argument to object');
	  }
	
	  var to = Object(target);
	  for (var i = 1; i < arguments.length; i++) {
	    var nextSource = arguments[i];
	    if (nextSource === undefined || nextSource === null) {
	      continue;
	    }
	
	    var keysArray = Object.keys(Object(nextSource));
	    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
	      var nextKey = keysArray[nextIndex];
	      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
	      if (desc !== undefined && desc.enumerable) {
	        to[nextKey] = nextSource[nextKey];
	      }
	    }
	  }
	  return to;
	}
	
	function get(selector) {
	  return document.querySelector(selector);
	}
	
	function findMostOften(arr) {
	  var obj = {};
	  arr.forEach(function (i) {
	    obj[i] = obj[i] ? obj[i] + 1 : 1;
	  });
	
	  return Object.keys(obj).sort(function (a, b) {
	    return obj[b] - obj[a];
	  })[0];
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(2);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _utils = __webpack_require__(3);
	
	function _handleSortableItemReadyToMove(e) {
	  // if sort handle is defined then only handle sort if the target matches the sort handle
	  if (this.props.sortHandle && _utils.closest(e.target || e.srcElement, this.props.sortHandle) === null) {
	    return;
	  }
	
	  var target = _utils.closest(e.target || e.srcElement, '.ui-sortable-item');
	  var evt = {
	    pageX: e.pageX || e.clientX || e.touches[0].pageX,
	    pageY: e.pageY || e.clientY || e.touches[0].pageY,
	    offset: _utils.position(target)
	  };
	
	  if (this.props.onSortableItemReadyToMove) {
	    this.props.onSortableItemReadyToMove(evt, this.props.sortableIndex);
	  }
	}
	
	function handleComponentDidMount() {
	  var node = _reactDom2['default'].findDOMNode(this);
	
	  // Prevent odd behaviour in legacy IE when dragging
	  if (window.attachEvent && !document.body.style['-ms-user-select']) {
	    _utils.on(node, 'selectstart', function (e) {
	      if (e.preventDefault) {
	        e.preventDefault();
	      } else {
	        e.returnValue = false;
	      }
	    });
	  }
	
	  if (_utils.isFunction(this.props.onSortableItemMount)) {
	    this.props.onSortableItemMount(_utils.position(node), _utils.width(node), _utils.height(node), _utils.outerWidthWithMargin(node), _utils.outerHeightWithMargin(node), this.props.sortableIndex);
	  }
	}
	
	function handleComponentDidUpdate() {
	  var node = _reactDom2['default'].findDOMNode(this);
	
	  if (_utils.isFunction(this.props.onSortableItemMount)) {
	    this.props.onSortableItemMount(_utils.position(node), _utils.width(node), _utils.height(node), _utils.outerWidthWithMargin(node), _utils.outerHeightWithMargin(node), this.props.sortableIndex);
	  }
	}
	
	var _defaultProps = {
	  sortableClassName: '',
	  sortableStyle: {},
	  onSortableItemMount: function onSortableItemMount() {},
	  onSortableItemReadyToMove: function onSortableItemReadyToMove() {}
	};
	
	/**
	 * @class A factory for generating either mixin or High Order Component
	 *        depending if there is an argument passed in
	 *
	 * @param {React} Component An optinal argument for creating HOCs, leave it
	 *                blank if you'd like old mixin
	 */
	
	exports['default'] = function (Component) {
	  if (Component) {
	    return (function (_React$Component) {
	      _inherits(SortableItem, _React$Component);
	
	      function SortableItem() {
	        _classCallCheck(this, SortableItem);
	
	        _React$Component.apply(this, arguments);
	      }
	
	      SortableItem.prototype.handleSortableItemReadyToMove = function handleSortableItemReadyToMove(e) {
	        _handleSortableItemReadyToMove.call(this, e);
	      };
	
	      SortableItem.prototype.componentDidMount = function componentDidMount() {
	        handleComponentDidMount.call(this);
	      };
	
	      SortableItem.prototype.componentDidUpdate = function componentDidUpdate() {
	        handleComponentDidUpdate.call(this);
	      };
	
	      SortableItem.prototype.render = function render() {
	        var _props = this.props;
	        var sortableClassName = _props.sortableClassName;
	        var sortableStyle = _props.sortableStyle;
	        var sortableIndex = _props.sortableIndex;
	        var sortHandle = _props.sortHandle;
	        var className = _props.className;
	
	        var rest = _objectWithoutProperties(_props, ['sortableClassName', 'sortableStyle', 'sortableIndex', 'sortHandle', 'className']);
	
	        return _react2['default'].createElement(Component, _extends({}, rest, {
	          sortable: true,
	          className: sortableClassName,
	          style: sortableStyle,
	          sortHandle: sortHandle,
	          onMouseDown: this.handleSortableItemReadyToMove.bind(this),
	          onTouchStart: this.handleSortableItemReadyToMove.bind(this)
	        }));
	      };
	
	      _createClass(SortableItem, null, [{
	        key: 'defaultProps',
	        value: _defaultProps,
	        enumerable: true
	      }, {
	        key: 'propTypes',
	        value: {
	          sortableClassName: _react.PropTypes.string,
	          sortableStyle: _react.PropTypes.object,
	          sortableIndex: _react.PropTypes.number,
	          sortHandle: _react.PropTypes.string
	        },
	        enumerable: true
	      }]);
	
	      return SortableItem;
	    })(_react2['default'].Component);
	  }
	
	  return {
	    propTypes: {
	      sortableClassName: _react.PropTypes.string,
	      sortableStyle: _react.PropTypes.object,
	      sortableIndex: _react.PropTypes.number,
	      sortHandle: _react.PropTypes.string
	    },
	
	    getDefaultProps: function getDefaultProps() {
	      return _defaultProps;
	    },
	
	    handleSortableItemReadyToMove: _handleSortableItemReadyToMove,
	
	    componentDidMount: handleComponentDidMount,
	
	    componentDidUpdate: handleComponentDidUpdate,
	
	    renderWithSortable: function renderWithSortable(item) {
	      return _react2['default'].cloneElement(item, {
	        className: this.props.sortableClassName,
	        style: this.props.sortableStyle,
	        sortHandle: this.props.sortHandle,
	        onMouseDown: this.handleSortableItemReadyToMove,
	        onTouchStart: this.handleSortableItemReadyToMove
	      });
	    }
	  };
	};
	
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA0OTQ2MjJkZDhiODE5MzljOTZmZiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiY29tbW9uanMyXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJSZWFjdFwiLFwicm9vdFwiOlwiUmVhY3RcIn0iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJyZWFjdC1kb21cIixcImNvbW1vbmpzMlwiOlwicmVhY3QtZG9tXCIsXCJhbWRcIjpcIlJlYWN0RE9NXCIsXCJyb290XCI6XCJSZWFjdERPTVwifSIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1NvcnRhYmxlSXRlbU1peGluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQ0M3QmlDLENBQU87Ozs7cUNBQ25CLENBQVc7Ozs7a0NBRUssQ0FBUzs7OENBQ2hCLENBQXFCOzs7O0FBR25ELEtBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNyQixLQUFNLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQUksS0FBSyxFQUFLOztBQUUvQixVQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLGtCQUFXLEtB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QUFDO01BQ0o7SUFDRixDQUFDO0VBQ0giLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJyZWFjdFwiKSwgcmVxdWlyZShcInJlYWN0LWRvbVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJSZWFjdFwiLCBcIlJlYWN0RE9NXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInJlYWN0LWFueXRoaW5nLXNvcnRhYmxlXCJdID0gZmFjdG9yeShyZXF1aXJlKFwicmVhY3RcIiksIHJlcXVpcmUoXCJyZWFjdC1kb21cIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInJlYWN0LWFueXRoaW5nLXNvcnRhYmxlXCJdID0gZmFjdG9yeShyb290W1wiUmVhY3RcIl0sIHJvb3RbXCJSZWFjdERPTVwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX18pIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDQ5NDYyMmRkOGI4MTkzOWM5NmZmXG4gKiovIiwiLyoqXHJcbiAqIEBmaWxlIHJlYWN0LWFueXRoaW5nLXNvcnRhYmxlXHJcbiAqIEBhdXRob3IgamFzb25zbHl2aWFcclxuICovXHJcblxyXG4vKiBlc2xpbnQgbmV3LWNhcDowLCBjb25zaXN0ZW50LXJldHVybjogMCwgcmVhY3QvcHJlZmVyLWVzNi1jbGFzczogMCwgcmVhY3Qvc29ydC1jb21wOiAwICovXHJcbi8qKlxyXG4gKiBAZGVwZW5kZW5jeVxyXG4gKi9cclxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IG9uLCBvZmYsIGlzRnVuY3Rpb24sIGlzTnVtZXJpYywgcG9zaXRpb24sIGNsb3Nlc3QsIGdldCxcclxuICAgICAgICBhc3NpZ24sIGZpbmRNb3N0T2Z0ZW4gfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IFNvcnRhYmxlSXRlbU1peGluIGZyb20gJy4vU29ydGFibGVJdGVtTWl4aW4nO1xyXG5cclxuXHJcbmNvbnN0IFNUQUNLX1NJWkUgPSA2O1xyXG5jb25zdCBnZXRTb3J0VGFyZ2V0ID0gKGNoaWxkKSA9PiB7XHJcbiAgLy8gYG9uU29ydGFibGVJdGVtUmVhZHlUb01vdmVgIG9ubHkgZXhpc3Qgd2hlbiB1c2luZyBtaXhpbnMgb3IgZGVjb3JhdG9yc1xyXG4gIHJldHVybiBjaGlsZCAmJiBjaGlsZC5wcm9wcyAmJiBpc0Z1bmN0aW9uKGNoaWxkLnByb3BzLm9uU29ydGFibGVJdGVtUmVhZHlUb01vdmUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBTb3J0YWJsZVxyXG4gKi9cclxuY29uc3QgU29ydGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgcHJvcFR5cGVzOiB7XHJcbiAgICAvKipcclxuICAgICAqIGNhbGxiYWNrIGZpcmVzIGFmdGVyIHNvcnQgb3BlcmF0aW9uIGZpbmlzaFxyXG4gICAgICogZnVuY3Rpb24gKGRhdGFTZXQpe1xyXG4gICAgICogICAvL2RhdGFTZXQgc29ydGVkXHJcbiAgICAgKiB9XHJcbiAgICAgKi9cclxuICAgIG9uU29ydDogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICBzb3J0SGFuZGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgY29udGFpbm1lbnQ6IFByb3BUeXBlcy5ib29sLFxyXG4gICAgZHluYW1pYzogUHJvcFR5cGVzLmJvb2wsXHJcbiAgICBkaXJlY3Rpb246IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm5vZGUpXHJcbiAgfSxcclxuXHJcbiAgc2V0QXJyYXlzKGN1cnJlbnRDaGlsZHJlbikge1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBBcnJheS5pc0FycmF5KGN1cnJlbnRDaGlsZHJlbikgP1xyXG4gICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q2hpbGRyZW4gOlxyXG4gICAgICAgICAgICAgICAgICAgICBbY3VycmVudENoaWxkcmVuXTtcclxuXHJcbiAgICBjb25zdCBzb3J0Q2hpbGRyZW4gPSBjaGlsZHJlbi5maWx0ZXIoZ2V0U29ydFRhcmdldCk7XHJcbiAgICB0aGlzLnNvcnRDaGlsZHJlbiA9IHNvcnRDaGlsZHJlbjtcclxuXHJcbiAgICAvLyBrZWVwIHRyYWNraW5nIHRoZSBkaW1lbnNpb24gYW5kIGNvb3JkaW5hdGVzIG9mIGFsbCBjaGlsZHJlblxyXG4gICAgdGhpcy5fZGltZW5zaW9uQXJyID0gc29ydENoaWxkcmVuLm1hcCgoKSA9PiAoe30pKTtcclxuXHJcbiAgICAvLyBrZWVwIHRyYWNraW5nIHRoZSBvcmRlciBvZiBhbGwgY2hpbGRyZW5cclxuICAgIHRoaXMuX29yZGVyQXJyID0gW107XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICB3aGlsZSAoaSA8IHRoaXMuX2RpbWVuc2lvbkFyci5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5fb3JkZXJBcnIucHVzaChpKyspO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcclxuICAgIHRoaXMuc2V0QXJyYXlzKHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICBwbGFjZUhvbGRlckluZGV4OiBudWxsLFxyXG4gICAgICBsZWZ0OiBudWxsLFxyXG4gICAgICB0b3A6IG51bGxcclxuICAgIH07XHJcbiAgfSxcclxuXHJcbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcyk7XHJcbiAgICBjb25zdCByZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIHRoaXMuX3RvcCA9IHJlY3QudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XHJcbiAgICB0aGlzLl9sZWZ0ID0gcmVjdC5sZWZ0ICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0O1xyXG4gICAgdGhpcy5fYm90dG9tID0gdGhpcy5fdG9wICsgcmVjdC5oZWlnaHQ7XHJcbiAgICB0aGlzLl9yaWdodCA9IHRoaXMuX2xlZnQgKyByZWN0LndpZHRoO1xyXG4gIH0sXHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBkeW5hbWljIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgaWYgKGR5bmFtaWMgJiYgbmV4dFByb3BzLmNoaWxkcmVuICE9PSBjaGlsZHJlbikge1xyXG4gICAgICB0aGlzLnNldEFycmF5cyhuZXh0UHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgdGhpcy51bmJpbmRFdmVudCgpO1xyXG4gIH0sXHJcblxyXG4gIGJpbmRFdmVudCgpIHtcclxuICAgIC8vIHNvIHRoYXQgdGhlIGZvY3VzIHdvbid0IGJlIGxvc3QgaWYgY3Vyc29yIG1vdmluZyB0b28gZmFzdFxyXG4gICAgdGhpcy5fX21vdXNlTW92ZUhhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgICAvKipcclxuICAgICAgICogU2luY2UgQ2hyb21lIG1heSB0cmlnZ2VyIHJlZHVuZGFudCBtb3VzZW1vdmUgZXZlbnQgZXZuZSBpZlxyXG4gICAgICAgKiB3ZSBkaWRuJ3QgcmVhbGx5IG1vdmUgdGhlIG1vdXNlLCB3ZSBzaG91bGQgbWFrZSBzdXJlIHRoYXRcclxuICAgICAgICogbW91c2UgY29vcmRpbmF0ZXMgcmVhbGx5IGNoYW5nZWQgdGhlbiByZXNwb25kIHRvIG1vdXNlbW92ZVxyXG4gICAgICAgKiBldmVudFxyXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0zMjcxMTRcclxuICAgICAgICovXHJcbiAgICAgIGlmICgoKGUucGFnZVggfHwgZS5jbGllbnRYKSA9PT0gdGhpcy5fcHJldlggJiYgKGUucGFnZVkgfHwgZS5jbGllbnRZKSA9PT0gdGhpcy5fcHJldlkpIHx8XHJcbiAgICAgICAgICAodGhpcy5fcHJldlggPT09IG51bGwgJiYgdGhpcy5fcHJldlkgPT09IG51bGwpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmhhbmRsZU1vdXNlTW92ZS5jYWxsKHRoaXMsIGUpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLl9fbW91c2VVcEhhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgICB0aGlzLmhhbmRsZU1vdXNlVXAuY2FsbCh0aGlzLCBlKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fX3RvdWNoTW92ZUhhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgICAvLyBibG9ja3MgdGhlIGRlZmF1bHQgc2Nyb2xsaW5nIGFzIHdlIHNvcnQgYW4gZWxlbWVudFxyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0aGlzLmhhbmRsZU1vdXNlTW92ZS5jYWxsKHRoaXMsIHtcclxuICAgICAgICB0YXJnZXQ6IGUudGFyZ2V0LFxyXG4gICAgICAgIGNsaWVudFg6IGUudG91Y2hlc1swXS5jbGllbnRYLFxyXG4gICAgICAgIGNsaWVudFk6IGUudG91Y2hlc1swXS5jbGllbnRZLFxyXG4gICAgICAgIHBhZ2VYOiBlLnRvdWNoZXNbMF0ucGFnZVgsXHJcbiAgICAgICAgcGFnZVk6IGUudG91Y2hlc1swXS5wYWdlWVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fX3RvdWNoRW5kT3JDYW5jZWxIYW5kbGVyID0gKGUpID0+IHtcclxuICAgICAgdGhpcy5oYW5kbGVNb3VzZVVwLmNhbGwodGhpcywgZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9uKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5fX3RvdWNoTW92ZUhhbmRsZXIpO1xyXG4gICAgb24oZG9jdW1lbnQsICd0b3VjaGVuZCcsIHRoaXMuX190b3VjaEVuZE9yQ2FuY2VsSGFuZGxlcik7XHJcbiAgICBvbihkb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgdGhpcy5fX3RvdWNoRW5kT3JDYW5jZWxIYW5kbGVyKTtcclxuICAgIG9uKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgdGhpcy5fX21vdXNlTW92ZUhhbmRsZXIpO1xyXG4gICAgb24oZG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5fX21vdXNlVXBIYW5kbGVyKTtcclxuICB9LFxyXG5cclxuICB1bmJpbmRFdmVudCgpIHtcclxuICAgIG9mZihkb2N1bWVudCwgJ3RvdWNobW92ZScsIHRoaXMuX190b3VjaE1vdmVIYW5kbGVyKTtcclxuICAgIG9mZihkb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fX3RvdWNoRW5kT3JDYW5jZWxIYW5kbGVyKTtcclxuICAgIG9mZihkb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgdGhpcy5fX3RvdWNoRW5kT3JDYW5jZWxIYW5kbGVyKTtcclxuICAgIG9mZihkb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX19tb3VzZU1vdmVIYW5kbGVyKTtcclxuICAgIG9mZihkb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLl9fbW91c2VVcEhhbmRsZXIpO1xyXG5cclxuICAgIHRoaXMuX19tb3VzZU1vdmVIYW5kbGVyID0gbnVsbDtcclxuICAgIHRoaXMuX19tb3VzZVVwSGFuZGxlciA9IG51bGw7XHJcbiAgICB0aGlzLl9fdG91Y2hNb3ZlSGFuZGxlciA9IG51bGw7XHJcbiAgICB0aGlzLl9fdG91Y2hFbmRPckNhbmNlbEhhbmRsZXIgPSBudWxsO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIGdldHRpbmcgcmVhZHkgZm9yIGRyYWdnaW5nXHJcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlICAgICBSZWFjdCBldmVudFxyXG4gICAqIEBwYXJhbSAge251bWJuZXJ9IGluZGV4IGluZGV4IG9mIHByZS1kcmFnZ2luZyBpdGVtXHJcbiAgICovXHJcbiAgaGFuZGxlTW91c2VEb3duKGUsIGluZGV4KSB7XHJcbiAgICB0aGlzLl9kcmFnZ2luZ0luZGV4ID0gaW5kZXg7XHJcbiAgICB0aGlzLl9wcmV2WCA9IChlLnBhZ2VYIHx8IGUuY2xpZW50WCk7XHJcbiAgICB0aGlzLl9wcmV2WSA9IChlLnBhZ2VZIHx8IGUuY2xpZW50WSk7XHJcbiAgICB0aGlzLl9pbml0T2Zmc2V0ID0gZS5vZmZzZXQ7XHJcbiAgICB0aGlzLl9pc1JlYWR5Rm9yRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5faGFzSW5pdERyYWdnaW5nID0gZmFsc2U7XHJcblxyXG4gICAgLy8gc3RhcnQgbGlzdGVuaW5nIG1vdXNlbW92ZSBhbmQgbW91c2V1cFxyXG4gICAgdGhpcy5iaW5kRXZlbnQoKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBgYWRkYCBhIGRyYWdnaW5nIGl0ZW0gYW5kIHJlLWNhbGN1bGF0aW5nIHBvc2l0aW9uIG9mIHBsYWNlaG9sZGVyXHJcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlICAgICBSZWFjdCBldmVudFxyXG4gICAqL1xyXG4gIGhhbmRsZU1vdXNlTW92ZShlKSB7XHJcbiAgICB0aGlzLl9pc01vdXNlTW92aW5nID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoIXRoaXMuX2lzUmVhZHlGb3JEcmFnZ2luZykge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLl9oYXNJbml0RHJhZ2dpbmcpIHtcclxuICAgICAgdGhpcy5fZGltZW5zaW9uQXJyW3RoaXMuX2RyYWdnaW5nSW5kZXhdLmlzUGxhY2VIb2xkZXIgPSB0cnVlO1xyXG4gICAgICB0aGlzLl9oYXNJbml0RHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnByb3BzLmNvbnRhaW5tZW50KSB7XHJcbiAgICAgIGNvbnN0IHggPSBlLnBhZ2VYIHx8IGUuY2xpZW50WDtcclxuICAgICAgY29uc3QgeSA9IGUucGFnZVkgfHwgZS5jbGllbnRZO1xyXG5cclxuICAgICAgaWYgKHggPCB0aGlzLl9sZWZ0IHx8IHggPiB0aGlzLl9yaWdodCB8fCB5IDwgdGhpcy5fdG9wIHx8IHkgPiB0aGlzLl9ib3R0b20pIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuZXdPZmZzZXQgPSB0aGlzLmNhbGN1bGF0ZU5ld09mZnNldChlKTtcclxuICAgIGNvbnN0IG5ld0luZGV4ID0gdGhpcy5jYWxjdWxhdGVOZXdJbmRleChlKTtcclxuXHJcbiAgICB0aGlzLl9kcmFnZ2luZ0luZGV4ID0gbmV3SW5kZXg7XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWUsXHJcbiAgICAgIHRvcDogdGhpcy5wcm9wcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IHRoaXMuX2luaXRPZmZzZXQudG9wIDogbmV3T2Zmc2V0LnRvcCxcclxuICAgICAgbGVmdDogdGhpcy5wcm9wcy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcgPyB0aGlzLl9pbml0T2Zmc2V0LmxlZnQgOiBuZXdPZmZzZXQubGVmdCxcclxuICAgICAgcGxhY2VIb2xkZXJJbmRleDogbmV3SW5kZXhcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX3ByZXZYID0gKGUucGFnZVggfHwgZS5jbGllbnRYKTtcclxuICAgIHRoaXMuX3ByZXZZID0gKGUucGFnZVkgfHwgZS5jbGllbnRZKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiByZXBsYWNlIHBsYWNlaG9sZGVyIHdpdGggZHJhZ2dpbmcgaXRlbVxyXG4gICAqIEBwYXJhbSAge29iamVjdH0gZSAgICAgUmVhY3QgZXZlbnRcclxuICAgKi9cclxuICBoYW5kbGVNb3VzZVVwKCkge1xyXG4gICAgY29uc3QgX2hhc01vdXNlTW92ZWQgPSB0aGlzLl9pc01vdXNlTW92aW5nO1xyXG4gICAgdGhpcy51bmJpbmRFdmVudCgpO1xyXG5cclxuICAgIGNvbnN0IGRyYWdnaW5nSW5kZXggPSB0aGlzLl9kcmFnZ2luZ0luZGV4O1xyXG4gICAgLy8gcmVzZXQgdGVtcCBsZXRzXHJcbiAgICB0aGlzLl9kcmFnZ2luZ0luZGV4ID0gbnVsbDtcclxuICAgIHRoaXMuX2lzUmVhZHlGb3JEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5faXNNb3VzZU1vdmluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5faW5pdE9mZnNldCA9IG51bGw7XHJcbiAgICB0aGlzLl9wcmV2WCA9IG51bGw7XHJcbiAgICB0aGlzLl9wcmV2WSA9IG51bGw7XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdGUuaXNEcmFnZ2luZykge1xyXG4gICAgICB0aGlzLl9kaW1lbnNpb25BcnJbdGhpcy5zdGF0ZS5wbGFjZUhvbGRlckluZGV4XS5pc1BsYWNlSG9sZGVyID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAoX2hhc01vdXNlTW92ZWQpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgcGxhY2VIb2xkZXJJbmRleDogbnVsbCxcclxuICAgICAgICAgIGxlZnQ6IG51bGwsXHJcbiAgICAgICAgICB0b3A6IG51bGxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc29ydCBmaW5pc2hlZCwgY2FsbGJhY2sgZmlyZXNcclxuICAgICAgaWYgKGlzRnVuY3Rpb24odGhpcy5wcm9wcy5vblNvcnQpKSB7XHJcbiAgICAgICAgY29uc3Qgc29ydERhdGEgPSB0aGlzLmdldFNvcnREYXRhKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5vblNvcnQoc29ydERhdGEsIHNvcnREYXRhW2RyYWdnaW5nSW5kZXhdLCBkcmFnZ2luZ0luZGV4KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIHdoZW4gY2hpbGRyZW4gbW91bnRlZCwgcmV0dXJuIGl0cyBzaXplKGhhbmRsZWQgYnkgU29ydGFibGVJdGVtTWl4aW4pXHJcbiAgICogQHBhcmFtICB7b2JqZWN0fSBvZmZzZXQge3RvcDoxLCBsZWZ0OjJ9XHJcbiAgICogQHBhcmFtICB7bnVtYmVyfSB3aWR0aFxyXG4gICAqIEBwYXJhbSAge251bWJlcn0gaGVpZ2h0XHJcbiAgICogQHBhcmFtICB7bnVtYmVyfSBmdWxsV2lkdGggICh3aXRoIG1hcmdpbilcclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZ1bGxIZWlnaHQgKHdpdGggbWFyZ2luKVxyXG4gICAqIEBwYXJhbSAge251bWJlcn0gaW5kZXhcclxuICAgKi9cclxuICBoYW5kbGVDaGlsZFVwZGF0ZShvZmZzZXQsIHdpZHRoLCBoZWlnaHQsIGZ1bGxXaWR0aCwgZnVsbEhlaWdodCwgaW5kZXgpIHtcclxuICAgIGFzc2lnbih0aGlzLl9kaW1lbnNpb25BcnJbaW5kZXhdLCB7XHJcbiAgICAgIHRvcDogb2Zmc2V0LnRvcCxcclxuICAgICAgbGVmdDogb2Zmc2V0LmxlZnQsXHJcbiAgICAgIHdpZHRoLFxyXG4gICAgICBoZWlnaHQsXHJcbiAgICAgIGZ1bGxXaWR0aCxcclxuICAgICAgZnVsbEhlaWdodFxyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogZ2V0IG5ldyBpbmRleCBvZiBhbGwgaXRlbXMgYnkgY3Vyc29yIHBvc2l0aW9uXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IG9mZnNldCB7bGVmdDogMTIsIHRvcDogMTIzfVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3Rpb24gY3Vyc29yIG1vdmluZyBkaXJlY3Rpb24sIHVzZWQgdG8gYXZpb2QgYmxpbmtpbmcgd2hlblxyXG4gICAqICAgICAgICAgICAgICAgICBpbnRlcmNoYW5naW5nIHBvc2l0aW9uIG9mIGRpZmZlcmVudCB3aWR0aCBlbGVtZW50c1xyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cclxuICBnZXRJbmRleEJ5T2Zmc2V0KG9mZnNldCwgZGlyZWN0aW9uKSB7XHJcbiAgICBpZiAoIW9mZnNldCB8fCAhaXNOdW1lcmljKG9mZnNldC50b3ApIHx8ICFpc051bWVyaWMob2Zmc2V0LmxlZnQpKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IF9kaW1lbnNpb25BcnIgPSB0aGlzLl9kaW1lbnNpb25BcnI7XHJcbiAgICBjb25zdCBvZmZzZXRYID0gb2Zmc2V0LmxlZnQ7XHJcbiAgICBjb25zdCBvZmZzZXRZID0gb2Zmc2V0LnRvcDtcclxuICAgIGNvbnN0IHByZXZJbmRleCA9IHRoaXMuc3RhdGUucGxhY2VIb2xkZXJJbmRleCAhPT0gbnVsbCA/XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnBsYWNlSG9sZGVySW5kZXggOlxyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5fZHJhZ2dpbmdJbmRleDtcclxuICAgIGxldCBuZXdJbmRleDtcclxuXHJcbiAgICBfZGltZW5zaW9uQXJyLmV2ZXJ5KChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCByZWxhdGl2ZUxlZnQgPSBvZmZzZXRYIC0gaXRlbS5sZWZ0O1xyXG4gICAgICBjb25zdCByZWxhdGl2ZVRvcCA9IG9mZnNldFkgLSBpdGVtLnRvcDtcclxuXHJcbiAgICAgIGlmIChyZWxhdGl2ZUxlZnQgPCBpdGVtLmZ1bGxXaWR0aCAmJiByZWxhdGl2ZVRvcCA8IGl0ZW0uZnVsbEhlaWdodCkge1xyXG4gICAgICAgIGlmIChyZWxhdGl2ZUxlZnQgPCBpdGVtLmZ1bGxXaWR0aCAvIDIgJiYgZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuICAgICAgICAgIG5ld0luZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZWxhdGl2ZUxlZnQgPiBpdGVtLmZ1bGxXaWR0aCAvIDIgJiYgZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICBuZXdJbmRleCA9IE1hdGgubWluKGluZGV4ICsgMSwgX2RpbWVuc2lvbkFyci5sZW5ndGggLSAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlbGF0aXZlVG9wIDwgaXRlbS5mdWxsSGVpZ2h0IC8gMiAmJiBkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuICAgICAgICAgIG5ld0luZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZWxhdGl2ZVRvcCA+IGl0ZW0uZnVsbEhlaWdodCAvIDIgJiYgZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuICAgICAgICAgIG5ld0luZGV4ID0gTWF0aC5taW4oaW5kZXggKyAxLCBfZGltZW5zaW9uQXJyLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBuZXdJbmRleCAhPT0gdW5kZWZpbmVkID8gbmV3SW5kZXggOiBwcmV2SW5kZXg7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogdW50aWxpdHkgZnVuY3Rpb25cclxuICAgKiBAcGFyYW0gIHthcnJheX0gYXJyXHJcbiAgICogQHBhcmFtICB7bnVtYmVyfSBzcmNcclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHRvXHJcbiAgICogQHJldHVybiB7YXJyYXl9XHJcbiAgICovXHJcbiAgc3dhcEFycmF5SXRlbVBvc2l0aW9uKGFyciwgc3JjLCB0bykge1xyXG4gICAgaWYgKCFhcnIgfHwgIWlzTnVtZXJpYyhzcmMpIHx8ICFpc051bWVyaWModG8pKSB7XHJcbiAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3JjRWwgPSBhcnIuc3BsaWNlKHNyYywgMSlbMF07XHJcbiAgICBhcnIuc3BsaWNlKHRvLCAwLCBzcmNFbCk7XHJcbiAgICByZXR1cm4gYXJyO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIGNhbGN1bGF0ZSBuZXcgb2Zmc2V0XHJcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIE1vdXNlTW92ZSBldmVudFxyXG4gICAqIEByZXR1cm4ge29iamVjdH0gICB7bGVmdDogMSwgdG9wOiAxfVxyXG4gICAqL1xyXG4gIGNhbGN1bGF0ZU5ld09mZnNldChlKSB7XHJcbiAgICBjb25zdCBkZWx0YVggPSB0aGlzLl9wcmV2WCAtIChlLnBhZ2VYIHx8IGUuY2xpZW50WCk7XHJcbiAgICBjb25zdCBkZWx0YVkgPSB0aGlzLl9wcmV2WSAtIChlLnBhZ2VZIHx8IGUuY2xpZW50WSk7XHJcblxyXG4gICAgY29uc3QgcHJldkxlZnQgPSB0aGlzLnN0YXRlLmxlZnQgIT09IG51bGwgPyB0aGlzLnN0YXRlLmxlZnQgOiB0aGlzLl9pbml0T2Zmc2V0LmxlZnQ7XHJcbiAgICBjb25zdCBwcmV2VG9wID0gdGhpcy5zdGF0ZS50b3AgIT09IG51bGwgPyB0aGlzLnN0YXRlLnRvcCA6IHRoaXMuX2luaXRPZmZzZXQudG9wO1xyXG4gICAgY29uc3QgbmV3TGVmdCA9IHByZXZMZWZ0IC0gZGVsdGFYO1xyXG4gICAgY29uc3QgbmV3VG9wID0gcHJldlRvcCAtIGRlbHRhWTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsZWZ0OiBuZXdMZWZ0LFxyXG4gICAgICB0b3A6IG5ld1RvcFxyXG4gICAgfTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBjYWxjdWxhdGUgbmV3IGluZGV4IGFuZCBkbyBzd2FwcGluZ1xyXG4gICAqIEBwYXJhbSAge29iamVjdH0gZSBNb3VzZU1vdmUgZXZlbnRcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgY2FsY3VsYXRlTmV3SW5kZXgoZSkge1xyXG4gICAgY29uc3QgcGxhY2VIb2xkZXJJbmRleCA9IHRoaXMuc3RhdGUucGxhY2VIb2xkZXJJbmRleCAhPT0gbnVsbCA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucGxhY2VIb2xkZXJJbmRleCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RyYWdnaW5nSW5kZXg7XHJcblxyXG4gICAgLy8gU2luY2UgYG1vdXNlbW92ZWAgaXMgbGlzdGVuZWQgb24gZG9jdW1lbnQsIHdoZW4gY3Vyc29yIG1vdmUgdG9vIGZhc3QsXHJcbiAgICAvLyBgZS50YXJnZXRgIG1heSBiZSBgYm9keWAgb3Igc29tZSBvdGhlciBzdHVmZiBpbnN0ZWFkIG9mXHJcbiAgICAvLyBgLnVpLXNvcnRhYmxlLWl0ZW1gXHJcbiAgICBjb25zdCB0YXJnZXQgPSBnZXQoJy51aS1zb3J0YWJsZS1kcmFnZ2luZycpIHx8XHJcbiAgICAgICAgICAgICAgICAgICBjbG9zZXN0KChlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQpLCAnLnVpLXNvcnRhYmxlLWl0ZW0nKTtcclxuICAgIGNvbnN0IG9mZnNldCA9IHBvc2l0aW9uKHRhcmdldCk7XHJcblxyXG4gICAgY29uc3QgY3VycmVudFggPSBlLnBhZ2VYIHx8IGUuY2xpZW50WDtcclxuICAgIGNvbnN0IGN1cnJlbnRZID0gZS5wYWdlWSB8fCBlLmNsaWVudFk7XHJcblxyXG4gICAgY29uc3QgZGVsdGFYID0gTWF0aC5hYnModGhpcy5fcHJldlggLSBjdXJyZW50WCk7XHJcbiAgICBjb25zdCBkZWx0YVkgPSBNYXRoLmFicyh0aGlzLl9wcmV2WSAtIGN1cnJlbnRZKTtcclxuXHJcbiAgICBsZXQgZGlyZWN0aW9uO1xyXG4gICAgaWYgKGRlbHRhWCA+IGRlbHRhWSkge1xyXG4gICAgICAvLyB0ZW5kIHRvIG1vdmUgbGVmdC9yaWdodFxyXG4gICAgICBkaXJlY3Rpb24gPSB0aGlzLl9wcmV2WCA+IGN1cnJlbnRYID8gJ2xlZnQnIDogJ3JpZ2h0JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIHRlbmQgdG8gbW92ZSB1cC9kb3duXHJcbiAgICAgIGRpcmVjdGlvbiA9IHRoaXMuX3ByZXZZID4gY3VycmVudFkgPyAndXAnIDogJ2Rvd24nO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5ld0luZGV4ID0gdGhpcy5nZXRJbmRleEJ5T2Zmc2V0KG9mZnNldCwgdGhpcy5nZXRQb3NzaWJsZURpcmVjdGlvbihkaXJlY3Rpb24pKTtcclxuICAgIGlmIChuZXdJbmRleCAhPT0gcGxhY2VIb2xkZXJJbmRleCkge1xyXG4gICAgICB0aGlzLl9kaW1lbnNpb25BcnIgPSB0aGlzLnN3YXBBcnJheUl0ZW1Qb3NpdGlvbih0aGlzLl9kaW1lbnNpb25BcnIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlSG9sZGVySW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0luZGV4KTtcclxuICAgICAgdGhpcy5fb3JkZXJBcnIgPSB0aGlzLnN3YXBBcnJheUl0ZW1Qb3NpdGlvbih0aGlzLl9vcmRlckFyciwgcGxhY2VIb2xkZXJJbmRleCwgbmV3SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdJbmRleDtcclxuICB9LFxyXG5cclxuICBnZXRTb3J0RGF0YSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9vcmRlckFyci5tYXAoKGl0ZW1JbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5zb3J0Q2hpbGRyZW5baXRlbUluZGV4XTtcclxuICAgICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGl0ZW0ucHJvcHMuc29ydERhdGE7XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICBnZXRQb3NzaWJsZURpcmVjdGlvbihkaXJlY3Rpb24pIHtcclxuICAgIHRoaXMuX3N0YWNrID0gdGhpcy5fc3RhY2sgfHwgW107XHJcbiAgICB0aGlzLl9zdGFjay5wdXNoKGRpcmVjdGlvbik7XHJcbiAgICBpZiAodGhpcy5fc3RhY2subGVuZ3RoID4gU1RBQ0tfU0laRSkge1xyXG4gICAgICB0aGlzLl9zdGFjay5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zdGFjay5sZW5ndGggPCBTVEFDS19TSVpFKSB7XHJcbiAgICAgIHJldHVybiBkaXJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZpbmRNb3N0T2Z0ZW4odGhpcy5fc3RhY2spO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIHJlbmRlciBhbGwgc29ydGFibGUgY2hpbGRyZW4gd2hpY2ggbWl4aW5lZCB3aXRoIFNvcnRhYmxlSXRlbU1peGluXHJcbiAgICovXHJcbiAgcmVuZGVySXRlbXMoKSB7XHJcbiAgICBjb25zdCB7IF9kaW1lbnNpb25BcnIsIF9vcmRlckFyciB9ID0gdGhpcztcclxuICAgIGxldCBkcmFnZ2luZ0l0ZW07XHJcblxyXG4gICAgY29uc3QgaXRlbXMgPSBfb3JkZXJBcnIubWFwKChpdGVtSW5kZXgsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnNvcnRDaGlsZHJlbltpdGVtSW5kZXhdO1xyXG4gICAgICBpZiAoIWl0ZW0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA9PT0gdGhpcy5fZHJhZ2dpbmdJbmRleCAmJiB0aGlzLnN0YXRlLmlzRHJhZ2dpbmcpIHtcclxuICAgICAgICBkcmFnZ2luZ0l0ZW0gPSB0aGlzLnJlbmRlckRyYWdnaW5nSXRlbShpdGVtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgaXNQbGFjZUhvbGRlciA9IF9kaW1lbnNpb25BcnJbaW5kZXhdLmlzUGxhY2VIb2xkZXI7XHJcbiAgICAgIGNvbnN0IGl0ZW1DbGFzc05hbWUgPSBgdWktc29ydGFibGUtaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7aXNQbGFjZUhvbGRlciAmJiAndWktc29ydGFibGUtcGxhY2Vob2xkZXInfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5zdGF0ZS5pc0RyYWdnaW5nICYmIGlzUGxhY2VIb2xkZXIgJiYgJ3Zpc2libGUnfWA7XHJcblxyXG4gICAgICBjb25zdCBzb3J0YWJsZVByb3BzID0ge1xyXG4gICAgICAgIHNvcnRhYmxlQ2xhc3NOYW1lOiBgJHtpdGVtLnByb3BzLmNsYXNzTmFtZX0gJHtpdGVtQ2xhc3NOYW1lfWAsXHJcbiAgICAgICAgc29ydGFibGVJbmRleDogaW5kZXgsXHJcbiAgICAgICAgb25Tb3J0YWJsZUl0ZW1SZWFkeVRvTW92ZTogaXNQbGFjZUhvbGRlciA/IHVuZGVmaW5lZCA6IChlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRG93bi5jYWxsKHRoaXMsIGUsIGluZGV4KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uU29ydGFibGVJdGVtTW91bnQ6IHRoaXMuaGFuZGxlQ2hpbGRVcGRhdGUsXHJcbiAgICAgICAgc29ydEhhbmRsZTogdGhpcy5wcm9wcy5zb3J0SGFuZGxlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoaXRlbS5rZXkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHNvcnRhYmxlUHJvcHMua2V5ID0gaW5kZXg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQoaXRlbSwgc29ydGFibGVQcm9wcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmlzQXJyYXkodGhpcy5wcm9wcy5jaGlsZHJlbikgP1xyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuIDpcclxuICAgICAgICAgICAgICAgICAgICAgW3RoaXMucHJvcHMuY2hpbGRyZW5dO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGNoaWxkcmVuLm1hcChjaGlsZCA9PiB7XHJcbiAgICAgIGlmIChnZXRTb3J0VGFyZ2V0KGNoaWxkKSkge1xyXG4gICAgICAgIHJldHVybiBpdGVtcy5zaGlmdCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjaGlsZDtcclxuICAgIH0pLmNvbmNhdChbZHJhZ2dpbmdJdGVtXSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiByZW5kZXIgdGhlIGl0ZW0gdGhhdCBiZWluZyBkcmFnZ2VkXHJcbiAgICogQHBhcmFtICB7b2JqZWN0fSBpdGVtIGEgcmVmZXJlbmNlIG9mIHRoaXMucHJvcHMuY2hpbGRyZW5cclxuICAgKi9cclxuICByZW5kZXJEcmFnZ2luZ0l0ZW0oaXRlbSkge1xyXG4gICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdHlsZSA9IHtcclxuICAgICAgdG9wOiB0aGlzLnN0YXRlLnRvcCxcclxuICAgICAgbGVmdDogdGhpcy5zdGF0ZS5sZWZ0LFxyXG4gICAgICB3aWR0aDogdGhpcy5fZGltZW5zaW9uQXJyW3RoaXMuX2RyYWdnaW5nSW5kZXhdLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMuX2RpbWVuc2lvbkFyclt0aGlzLl9kcmFnZ2luZ0luZGV4XS5oZWlnaHRcclxuICAgIH07XHJcbiAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KGl0ZW0sIHtcclxuICAgICAgc29ydGFibGVDbGFzc05hbWU6IGAke2l0ZW0ucHJvcHMuY2xhc3NOYW1lfSB1aS1zb3J0YWJsZS1pdGVtIHVpLXNvcnRhYmxlLWRyYWdnaW5nYCxcclxuICAgICAga2V5OiAnX2RyYWdnaW5nJyxcclxuICAgICAgc29ydGFibGVTdHlsZTogc3R5bGUsXHJcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWUsXHJcbiAgICAgIHNvcnRIYW5kbGU6IHRoaXMucHJvcHMuc29ydEhhbmRsZVxyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgY2xhc3NOYW1lID0gYHVpLXNvcnRhYmxlICR7dGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgJyd9YDtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuICAgICAgICB7dGhpcy5yZW5kZXJJdGVtcygpfVxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmNvbnN0IFNvcnRhYmxlQ29udGFpbmVyID0gKHtcclxuICBjbGFzc05hbWUsIHN0eWxlLCBvbk1vdXNlRG93biwgb25Ub3VjaFN0YXJ0LCBjaGlsZHJlbixcclxufSkgPT4ge1xyXG4gIGlmIChSZWFjdC5pc1ZhbGlkRWxlbWVudChjaGlsZHJlbikpIHtcclxuICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQoY2hpbGRyZW4sIHtcclxuICAgICAgY2xhc3NOYW1lLCBzdHlsZSwgb25Nb3VzZURvd24sIG9uVG91Y2hTdGFydFxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgIGNsYXNzTmFtZSwgc3R5bGUsIG9uTW91c2VEb3duLCBvblRvdWNoU3RhcnQsIGNoaWxkcmVuXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5Tb3J0YWJsZS5Tb3J0YWJsZUl0ZW1NaXhpbiA9IFNvcnRhYmxlSXRlbU1peGluKCk7XHJcblNvcnRhYmxlLnNvcnRhYmxlID0gU29ydGFibGVJdGVtTWl4aW47XHJcblNvcnRhYmxlLlNvcnRhYmxlQ29udGFpbmVyID0gU29ydGFibGVJdGVtTWl4aW4oU29ydGFibGVDb250YWluZXIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU29ydGFibGU7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2luZGV4LmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiY29tbW9uanMyXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJSZWFjdFwiLFwicm9vdFwiOlwiUmVhY3RcIn1cbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcInJlYWN0LWRvbVwiLFwiY29tbW9uanMyXCI6XCJyZWFjdC1kb21cIixcImFtZFwiOlwiUmVhY3RET01cIixcInJvb3RcIjpcIlJlYWN0RE9NXCJ9XG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXHJcbiAqIEBmaWxlT3ZlcnZpZXcgalF1ZXJ5IHJlcGxhY2VtZW50XHJcbiAqIEBhdXRob3IgamFzb25zbHl2aWFcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBvbihlbCwgZXZlbnROYW1lLCBjYWxsYmFjaykge1xyXG4gIGlmIChlbC5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcclxuICB9IGVsc2UgaWYgKGVsLmF0dGFjaEV2ZW50KSB7XHJcbiAgICBlbC5hdHRhY2hFdmVudChgb24ke2V2ZW50TmFtZX1gLCAoZSkgPT4ge1xyXG4gICAgICBjYWxsYmFjay5jYWxsKGVsLCBlIHx8IHdpbmRvdy5ldmVudCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvZmYoZWwsIGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcclxuICBpZiAoZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKTtcclxuICB9IGVsc2UgaWYgKGVsLmRldGFjaEV2ZW50KSB7XHJcbiAgICBlbC5kZXRhY2hFdmVudChgb24ke2V2ZW50TmFtZX1gLCBjYWxsYmFjayk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljKG51bSkge1xyXG4gIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChudW0pKSAmJiBpc0Zpbml0ZShudW0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcG9zaXRpb24oZWwpIHtcclxuICBpZiAoIWVsKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsZWZ0OiAwLFxyXG4gICAgICB0b3A6IDBcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbGVmdDogZWwub2Zmc2V0TGVmdCxcclxuICAgIHRvcDogZWwub2Zmc2V0VG9wXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdpZHRoKGVsKSB7XHJcbiAgcmV0dXJuIGVsLm9mZnNldFdpZHRoO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaGVpZ2h0KGVsKSB7XHJcbiAgcmV0dXJuIGVsLm9mZnNldEhlaWdodDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG91dGVyV2lkdGhXaXRoTWFyZ2luKGVsKSB7XHJcbiAgbGV0IF93aWR0aCA9IGVsLm9mZnNldFdpZHRoO1xyXG4gIGNvbnN0IHN0eWxlID0gZWwuY3VycmVudFN0eWxlIHx8IGdldENvbXB1dGVkU3R5bGUoZWwpO1xyXG5cclxuICBfd2lkdGggKz0gKHBhcnNlSW50KHN0eWxlLm1hcmdpbkxlZnQsIDEwKSB8fCAwKSArIChwYXJzZUludChzdHlsZS5tYXJnaW5SaWdodCwgMTApIHx8IDApO1xyXG4gIHJldHVybiBfd2lkdGg7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvdXRlckhlaWdodFdpdGhNYXJnaW4oZWwpIHtcclxuICBsZXQgX2hlaWdodCA9IGVsLm9mZnNldEhlaWdodDtcclxuICBjb25zdCBzdHlsZSA9IGVsLmN1cnJlbnRTdHlsZSB8fCBnZXRDb21wdXRlZFN0eWxlKGVsKTtcclxuXHJcbiAgX2hlaWdodCArPSAocGFyc2VJbnQoc3R5bGUubWFyZ2luTGVmdCwgMTApIHx8IDApICsgKHBhcnNlSW50KHN0eWxlLm1hcmdpblJpZ2h0LCAxMCkgfHwgMCk7XHJcbiAgcmV0dXJuIF9oZWlnaHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhc0NsYXNzKGVsQ2xhc3NOYW1lLCBjbGFzc05hbWUpIHtcclxuICByZXR1cm4gKGAgJHtlbENsYXNzTmFtZX0gYCkucmVwbGFjZSgvW1xcblxcdF0vZywgJyAnKS5pbmRleE9mKGAgJHtjbGFzc05hbWV9IGApID4gLTE7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbG9zZXN0KGVsLCBjbGFzc05hbWUpIHtcclxuICBjbGFzc05hbWUgPSBjbGFzc05hbWUucmVwbGFjZSgvXltcXGJcXC5dLywgJycpO1xyXG5cclxuICBjb25zdCBmaW5kZXIgPSAoX2VsLCBfY2xhc3NOYW1lKSA9PiB7XHJcbiAgICBjb25zdCBfZWxDbGFzc05hbWUgPSB0eXBlb2YgX2VsLmNsYXNzTmFtZSA9PT0gJ29iamVjdCcgP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgX2VsLmNsYXNzTmFtZS5iYXNlVmFsIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgIF9lbC5jbGFzc05hbWU7XHJcbiAgICBpZiAoX2VsQ2xhc3NOYW1lICYmIGhhc0NsYXNzKF9lbENsYXNzTmFtZSwgX2NsYXNzTmFtZSkpIHtcclxuICAgICAgcmV0dXJuIF9lbDtcclxuICAgIH0gZWxzZSBpZiAoX2VsLnBhcmVudE5vZGUgPT09IG51bGwpIHtcclxuICAgICAgLy8gbWF0Y2hlcyBkb2N1bWVudFxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmluZGVyKF9lbC5wYXJlbnROb2RlLCBfY2xhc3NOYW1lKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gZmluZGVyKGVsLCBjbGFzc05hbWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWduKHRhcmdldCkge1xyXG4gIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdCcpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdG8gPSBPYmplY3QodGFyZ2V0KTtcclxuICBmb3IgKGxldCBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgbmV4dFNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcclxuICAgIGlmIChuZXh0U291cmNlID09PSB1bmRlZmluZWQgfHwgbmV4dFNvdXJjZSA9PT0gbnVsbCkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBrZXlzQXJyYXkgPSBPYmplY3Qua2V5cyhPYmplY3QobmV4dFNvdXJjZSkpO1xyXG4gICAgZm9yIChsZXQgbmV4dEluZGV4ID0gMCwgbGVuID0ga2V5c0FycmF5Lmxlbmd0aDsgbmV4dEluZGV4IDwgbGVuOyBuZXh0SW5kZXgrKykge1xyXG4gICAgICBjb25zdCBuZXh0S2V5ID0ga2V5c0FycmF5W25leHRJbmRleF07XHJcbiAgICAgIGNvbnN0IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5leHRTb3VyY2UsIG5leHRLZXkpO1xyXG4gICAgICBpZiAoZGVzYyAhPT0gdW5kZWZpbmVkICYmIGRlc2MuZW51bWVyYWJsZSkge1xyXG4gICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdG87XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXQoc2VsZWN0b3IpIHtcclxuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kTW9zdE9mdGVuKGFycikge1xyXG4gIGNvbnN0IG9iaiA9IHt9O1xyXG4gIGFyci5mb3JFYWNoKGkgPT4ge1xyXG4gICAgb2JqW2ldID0gb2JqW2ldID8gb2JqW2ldICsgMSA6IDE7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnNvcnQoKGEsIGIpID0+IChvYmpbYl0gLSBvYmpbYV0pKVswXTtcclxufVxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy91dGlscy5qc1xuICoqLyIsImltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xyXG5pbXBvcnQgeyBvbiwgcG9zaXRpb24sIGNsb3Nlc3QsIHdpZHRoLCBoZWlnaHQsIGlzRnVuY3Rpb24sXHJcbiAgICAgICAgb3V0ZXJXaWR0aFdpdGhNYXJnaW4sIG91dGVySGVpZ2h0V2l0aE1hcmdpbiB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlU29ydGFibGVJdGVtUmVhZHlUb01vdmUoZSkge1xyXG4gIC8vIGlmIHNvcnQgaGFuZGxlIGlzIGRlZmluZWQgdGhlbiBvbmx5IGhhbmRsZSBzb3J0IGlmIHRoZSB0YXJnZXQgbWF0Y2hlcyB0aGUgc29ydCBoYW5kbGVcclxuICBpZiAodGhpcy5wcm9wcy5zb3J0SGFuZGxlICYmIGNsb3Nlc3QoZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50LCB0aGlzLnByb3BzLnNvcnRIYW5kbGUpID09PSBudWxsKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdCB0YXJnZXQgPSBjbG9zZXN0KChlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQpLCAnLnVpLXNvcnRhYmxlLWl0ZW0nKTtcclxuICBjb25zdCBldnQgPSB7XHJcbiAgICBwYWdlWDogKGUucGFnZVggfHwgZS5jbGllbnRYIHx8IGUudG91Y2hlc1swXS5wYWdlWCksXHJcbiAgICBwYWdlWTogKGUucGFnZVkgfHwgZS5jbGllbnRZIHx8IGUudG91Y2hlc1swXS5wYWdlWSksXHJcbiAgICBvZmZzZXQ6IHBvc2l0aW9uKHRhcmdldClcclxuICB9O1xyXG5cclxuICBpZiAodGhpcy5wcm9wcy5vblNvcnRhYmxlSXRlbVJlYWR5VG9Nb3ZlKSB7XHJcbiAgICB0aGlzLnByb3BzLm9uU29ydGFibGVJdGVtUmVhZHlUb01vdmUoZXZ0LCB0aGlzLnByb3BzLnNvcnRhYmxlSW5kZXgpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgY29uc3Qgbm9kZSA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpO1xyXG5cclxuICAvLyBQcmV2ZW50IG9kZCBiZWhhdmlvdXIgaW4gbGVnYWN5IElFIHdoZW4gZHJhZ2dpbmdcclxuICBpZiAod2luZG93LmF0dGFjaEV2ZW50ICYmICFkb2N1bWVudC5ib2R5LnN0eWxlWyctbXMtdXNlci1zZWxlY3QnXSkge1xyXG4gICAgb24obm9kZSwgJ3NlbGVjdHN0YXJ0JywgKGUpID0+IHtcclxuICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlmIChpc0Z1bmN0aW9uKHRoaXMucHJvcHMub25Tb3J0YWJsZUl0ZW1Nb3VudCkpIHtcclxuICAgIHRoaXMucHJvcHMub25Tb3J0YWJsZUl0ZW1Nb3VudChwb3NpdGlvbihub2RlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aChub2RlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQobm9kZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJXaWR0aFdpdGhNYXJnaW4obm9kZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJIZWlnaHRXaXRoTWFyZ2luKG5vZGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuc29ydGFibGVJbmRleCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDb21wb25lbnREaWRVcGRhdGUoKSB7XHJcbiAgY29uc3Qgbm9kZSA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpO1xyXG5cclxuICBpZiAoaXNGdW5jdGlvbih0aGlzLnByb3BzLm9uU29ydGFibGVJdGVtTW91bnQpKSB7XHJcbiAgICB0aGlzLnByb3BzLm9uU29ydGFibGVJdGVtTW91bnQocG9zaXRpb24obm9kZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGgobm9kZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0KG5vZGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dGVyV2lkdGhXaXRoTWFyZ2luKG5vZGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dGVySGVpZ2h0V2l0aE1hcmdpbihub2RlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNvcnRhYmxlSW5kZXgpO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgX2RlZmF1bHRQcm9wcyA9IHtcclxuICBzb3J0YWJsZUNsYXNzTmFtZTogJycsXHJcbiAgc29ydGFibGVTdHlsZToge30sXHJcbiAgb25Tb3J0YWJsZUl0ZW1Nb3VudDogKCkgPT4ge30sXHJcbiAgb25Tb3J0YWJsZUl0ZW1SZWFkeVRvTW92ZTogKCkgPT4ge31cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQSBmYWN0b3J5IGZvciBnZW5lcmF0aW5nIGVpdGhlciBtaXhpbiBvciBIaWdoIE9yZGVyIENvbXBvbmVudFxyXG4gKiAgICAgICAgZGVwZW5kaW5nIGlmIHRoZXJlIGlzIGFuIGFyZ3VtZW50IHBhc3NlZCBpblxyXG4gKlxyXG4gKiBAcGFyYW0ge1JlYWN0fSBDb21wb25lbnQgQW4gb3B0aW5hbCBhcmd1bWVudCBmb3IgY3JlYXRpbmcgSE9DcywgbGVhdmUgaXRcclxuICogICAgICAgICAgICAgICAgYmxhbmsgaWYgeW91J2QgbGlrZSBvbGQgbWl4aW5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IChDb21wb25lbnQpID0+IHtcclxuICBpZiAoQ29tcG9uZW50KSB7XHJcbiAgICByZXR1cm4gY2xhc3MgU29ydGFibGVJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IF9kZWZhdWx0UHJvcHM7XHJcblxyXG4gICAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgICAgIHNvcnRhYmxlQ2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIHNvcnRhYmxlU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXHJcbiAgICAgICAgc29ydGFibGVJbmRleDogUHJvcFR5cGVzLm51bWJlcixcclxuICAgICAgICBzb3J0SGFuZGxlOiBQcm9wVHlwZXMuc3RyaW5nXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBoYW5kbGVTb3J0YWJsZUl0ZW1SZWFkeVRvTW92ZShlKSB7XHJcbiAgICAgICAgaGFuZGxlU29ydGFibGVJdGVtUmVhZHlUb01vdmUuY2FsbCh0aGlzLCBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgaGFuZGxlQ29tcG9uZW50RGlkTW91bnQuY2FsbCh0aGlzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgICAgIGhhbmRsZUNvbXBvbmVudERpZFVwZGF0ZS5jYWxsKHRoaXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBzb3J0YWJsZUNsYXNzTmFtZSwgc29ydGFibGVTdHlsZSwgc29ydGFibGVJbmRleCwgc29ydEhhbmRsZSwgY2xhc3NOYW1lLFxyXG4gICAgICAgICAgLi4ucmVzdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPENvbXBvbmVudCB7Li4ucmVzdH1cclxuICAgICAgICAgICAgc29ydGFibGU9e3RydWV9XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17c29ydGFibGVDbGFzc05hbWV9XHJcbiAgICAgICAgICAgIHN0eWxlPXtzb3J0YWJsZVN0eWxlfVxyXG4gICAgICAgICAgICBzb3J0SGFuZGxlPXtzb3J0SGFuZGxlfVxyXG4gICAgICAgICAgICBvbk1vdXNlRG93bj17Ojp0aGlzLmhhbmRsZVNvcnRhYmxlSXRlbVJlYWR5VG9Nb3ZlfVxyXG4gICAgICAgICAgICBvblRvdWNoU3RhcnQ9ezo6dGhpcy5oYW5kbGVTb3J0YWJsZUl0ZW1SZWFkeVRvTW92ZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgc29ydGFibGVDbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgIHNvcnRhYmxlU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXHJcbiAgICAgIHNvcnRhYmxlSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXHJcbiAgICAgIHNvcnRIYW5kbGU6IFByb3BUeXBlcy5zdHJpbmdcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0RGVmYXVsdFByb3BzKCkge1xyXG4gICAgICByZXR1cm4gX2RlZmF1bHRQcm9wcztcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlU29ydGFibGVJdGVtUmVhZHlUb01vdmUsXHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGhhbmRsZUNvbXBvbmVudERpZE1vdW50LFxyXG5cclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogaGFuZGxlQ29tcG9uZW50RGlkVXBkYXRlLFxyXG5cclxuICAgIHJlbmRlcldpdGhTb3J0YWJsZShpdGVtKSB7XHJcbiAgICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQoaXRlbSwge1xyXG4gICAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5zb3J0YWJsZUNsYXNzTmFtZSxcclxuICAgICAgICBzdHlsZTogdGhpcy5wcm9wcy5zb3J0YWJsZVN0eWxlLFxyXG4gICAgICAgIHNvcnRIYW5kbGU6IHRoaXMucHJvcHMuc29ydEhhbmRsZSxcclxuICAgICAgICBvbk1vdXNlRG93bjogdGhpcy5oYW5kbGVTb3J0YWJsZUl0ZW1SZWFkeVRvTW92ZSxcclxuICAgICAgICBvblRvdWNoU3RhcnQ6IHRoaXMuaGFuZGxlU29ydGFibGVJdGVtUmVhZHlUb01vdmVcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxufTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvU29ydGFibGVJdGVtTWl4aW4uanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9