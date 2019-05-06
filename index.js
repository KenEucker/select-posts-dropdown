"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _apiFetch = _interopRequireDefault(require("@wordpress/api-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css';
document.head.append(styleLink);

var SelectPostsDropdown =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SelectPostsDropdown, _React$Component);

  function SelectPostsDropdown(props) {
    var _this;

    _classCallCheck(this, SelectPostsDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectPostsDropdown).call(this, props));
    _this.state = {
      showing_modal: false,
      options: null
    };
    return _this;
  }

  _createClass(SelectPostsDropdown, [{
    key: "onDropdownSelect",
    value: function onDropdownSelect(e, el) {
      var selected = el.options[0];

      if (!!selected && !!this.props.onChange) {
        // TODO: Use the code below to grab more data requested by the user
        // const includeFields = this.props.fields
        // // only return the data the user wants
        // const postData = Object.keys( selected )
        // 	.filter( k => includeFields.includes( k ) )
        // 	.map( k => Object.assign( {}, { [ k ]: selected[ k ] } ) )
        // 	.reduce( ( res, o ) => Object.assign( res, o ), {} )
        this.props.onChange({
          id: selected.value,
          title: selected.text
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var savingToWpData = !!this.props.saveToWpData;
      var wpDataField = typeof this.props.saveToWpData === 'string' ? this.props.saveToWpData : 'wpData';

      var decodeHtmlText = function decodeHtmlText(str) {
        return str.replace(/&#(\d+);/g, function (match, dec) {
          return String.fromCharCode(dec);
        });
      };

      var setOptsAndGlobalPostsFromPosts = function setOptsAndGlobalPostsFromPosts(posts) {
        if (savingToWpData) {
          window[wpDataField] = window[wpDataField] || {};
          window[wpDataField][_this2.props.postType] = posts;
        }

        var options = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = posts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var post = _step.value;
            options.push({
              text: decodeHtmlText(post.title.rendered),
              value: post.id
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _this2.setState({
          options: options,
          posts: posts
        });
      };

      if (!!window[wpDataField] && !!window[wpDataField][this.props.postType]) {
        setOptsAndGlobalPostsFromPosts(window[wpDataField][this.props.postType]);
      }

      (0, _apiFetch["default"])({
        path: "".concat(this.props.restBase, "/").concat(this.props.postType)
      }).then(function (posts) {
        setOptsAndGlobalPostsFromPosts(posts);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          heading = _this$props.heading,
          multiple = _this$props.multiple,
          placeholder = _this$props.placeholder;
      var options = this.state.options;
      return _react["default"].createElement("div", {
        className: className
      }, _react["default"].createElement("span", null, heading), _react["default"].createElement(_semanticUiReact.Dropdown, {
        placeholder: placeholder,
        onChange: this.onDropdownSelect.bind(this),
        fluid: true,
        search: true,
        selection: true,
        multiple: multiple,
        options: options,
        defaultValue: this.props.selectedValue
      }));
    }
  }]);

  return SelectPostsDropdown;
}(_react["default"].Component);

exports["default"] = SelectPostsDropdown;

_defineProperty(SelectPostsDropdown, "defaultProps", {
  restBase: '/wp-json/wp/v2',
  placeholder: 'Select Post',
  fields: ['id', 'title'],
  postType: 'posts',
  saveToWpData: true
});
