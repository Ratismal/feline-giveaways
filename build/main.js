require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = {"auth":{"secret":"65a2f8897fe3fa84ae407e8ee43b91af7491a0b084a4a95fbf657c7387970888"},"client":{"id":"453716817639243779","secret":"wOOhXosd5zQnW9EosM3T2_tVaxDAOXa3"},"token":"NDUzNzE2ODE3NjM5MjQzNzc5.DfjUaQ.zB78XI81b44H4EwInPAdhJktOpc","r":{"host":"ssh.blargbot.xyz","user":"admin","password":"dOO163a1fo","database":"giveaway","port":28015},"origin":"http://localhost:8102"}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

var config = __webpack_require__(0);

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: 'Nuxt.js project' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css'],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },

  modules: [["@nuxtjs/axios", {
    prefix: "/api",
    proxy: true,
    port: 8102
  }]],
  plugins: ['~/plugins/auth'],
  proxy: {
    "/api/": config.origin || "https://giveaways.stupidcat.me"
  },
  mode: 'spa',

  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLINT on save
     */
    extend: function extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jwt = __webpack_require__(9);
var config = __webpack_require__(0);
var secret = config.auth.secret;
var expiry = 60 * 60 * 24 * 2; // 48 hours

var Security = function () {
    function Security() {
        _classCallCheck(this, Security);
    }

    _createClass(Security, null, [{
        key: 'generatedToken',
        value: function generatedToken(id) {
            var token = jwt.sign({ id: id, exp: Math.floor(Date.now() / 1000) + expiry }, secret);
            return token;
        }
    }, {
        key: 'validateToken',
        value: function validateToken(token) {
            try {
                var id = jwt.verify(token, secret);
                return id;
            } catch (err) {
                return null;
            }
        }
    }, {
        key: 'expiry',
        set: function set(value) {
            expiry = value;
        }
    }]);

    return Security;
}();

module.exports = Security;

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = require("koa");

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = require("nuxt");

/***/ },
/* 7 */
/***/ function(module, exports) {

module.exports = require("rethinkdbdash");

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = require("snekfetch");

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nuxt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_koa_bodyparser__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_koa_bodyparser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_koa_bodyparser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_snekfetch__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_snekfetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_snekfetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__security__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__security___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__security__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rethinkdbdash__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rethinkdbdash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rethinkdbdash__);


var start = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.mark(function _callee6() {
    var _this = this;

    var _privacy_version, r, app, host, port, config, nuxt, builder, routes;

    return __WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _privacy_version = 1;
            r = __WEBPACK_IMPORTED_MODULE_7_rethinkdbdash___default()({
              host: __WEBPACK_IMPORTED_MODULE_5__config___default.a.r.host,
              db: __WEBPACK_IMPORTED_MODULE_5__config___default.a.r.database,
              password: __WEBPACK_IMPORTED_MODULE_5__config___default.a.r.password,
              user: __WEBPACK_IMPORTED_MODULE_5__config___default.a.r.user,
              port: __WEBPACK_IMPORTED_MODULE_5__config___default.a.r.port,
              max: 50,
              buffer: 5,
              timeoutError: 10000
            });
            app = new __WEBPACK_IMPORTED_MODULE_1_koa___default.a();
            host = process.env.HOST || '127.0.0.1';
            port = process.env.PORT || 8102;

            // Import and Set Nuxt.js options

            config = __webpack_require__(2);

            config.dev = !(app.env === 'production');

            // Instantiate nuxt.js
            nuxt = new __WEBPACK_IMPORTED_MODULE_2_nuxt__["Nuxt"](config);

            // Build in development

            if (!config.dev) {
              _context6.next = 12;
              break;
            }

            builder = new __WEBPACK_IMPORTED_MODULE_2_nuxt__["Builder"](nuxt);
            _context6.next = 12;
            return builder.build();

          case 12:
            routes = {
              privacy_version: function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(_ref2) {
                  var ctx = _ref2.ctx,
                      next = _ref2.next;
                  return __WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          ctx.assert(ctx.method === 'GET', 405);
                          ctx.body = _privacy_version;

                        case 2:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                function privacy_version(_x) {
                  return _ref3.apply(this, arguments);
                }

                return privacy_version;
              }(),
              login: function () {
                var _ref5 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(_ref4) {
                  var ctx = _ref4.ctx,
                      next = _ref4.next;

                  var _ctx$request$body, code, redirect_uri, res, token, user, data;

                  return __WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          ctx.assert(ctx.method === 'POST', 405, 'Must login using POST');
                          _ctx$request$body = ctx.request.body, code = _ctx$request$body.code, redirect_uri = _ctx$request$body.redirect_uri;

                          console.log(code, redirect_uri);
                          _context2.next = 5;
                          return __WEBPACK_IMPORTED_MODULE_4_snekfetch___default.a.post('https://discordapp.com/api/oauth2/token').set({
                            'Content-Type': 'application/x-www-form-urlencoded'
                          }).send({
                            client_id: __WEBPACK_IMPORTED_MODULE_5__config___default.a.client.id,
                            client_secret: __WEBPACK_IMPORTED_MODULE_5__config___default.a.client.secret,
                            grant_type: 'authorization_code',
                            code: code,
                            redirect_uri: redirect_uri,
                            scope: 'identify'
                          });

                        case 5:
                          res = _context2.sent;
                          token = res.body;
                          _context2.next = 9;
                          return __WEBPACK_IMPORTED_MODULE_4_snekfetch___default.a.get('https://discordapp.com/api/v6/users/@me').set({
                            Authorization: token.token_type + ' ' + token.access_token
                          });

                        case 9:
                          res = _context2.sent;
                          user = res.body;
                          data = {
                            token: __WEBPACK_IMPORTED_MODULE_6__security___default.a.generatedToken(user.id)
                          };


                          ctx.body = JSON.stringify(data);

                        case 13:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this);
                }));

                function login(_x2) {
                  return _ref5.apply(this, arguments);
                }

                return login;
              }(),
              privacy: function () {
                var _ref7 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(_ref6) {
                  var ctx = _ref6.ctx,
                      next = _ref6.next;
                  var id, accept;
                  return __WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          id = __WEBPACK_IMPORTED_MODULE_6__security___default.a.validateToken(ctx.req.headers.authorization);

                          ctx.assert(id, 403, 'Unauthorized');

                          accept = ctx.request.body.accept;

                          accept = accept === true;
                          _context3.next = 6;
                          return r.table('user').get(id.id).update({
                            privacyAccept: accept
                          });

                        case 6:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, this);
                }));

                function privacy(_x3) {
                  return _ref7.apply(this, arguments);
                }

                return privacy;
              }(),
              users: function () {
                var _ref9 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.mark(function _callee4(_ref8) {
                  var ctx = _ref8.ctx,
                      next = _ref8.next,
                      path = _ref8.path;
                  var id, res, u;
                  return __WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          if (!(path[1].toLowerCase() === '@me')) {
                            _context4.next = 16;
                            break;
                          }

                          id = __WEBPACK_IMPORTED_MODULE_6__security___default.a.validateToken(ctx.req.headers.authorization);

                          ctx.assert(id, 403, 'Unauthorized');
                          _context4.next = 5;
                          return __WEBPACK_IMPORTED_MODULE_4_snekfetch___default.a.get('https://discordapp.com/api/v6/users/' + id.id).set({
                            Authorization: 'Bot ' + __WEBPACK_IMPORTED_MODULE_5__config___default.a.token
                          });

                        case 5:
                          res = _context4.sent;
                          _context4.next = 8;
                          return r.table('user').get(id.id);

                        case 8:
                          u = _context4.sent;

                          if (u) {
                            _context4.next = 13;
                            break;
                          }

                          u = { id: id.id, privacyAccept: false };
                          _context4.next = 13;
                          return r.table('user').insert(u);

                        case 13:
                          ctx.body = JSON.stringify(Object.assign({}, res.body, u));
                          _context4.next = 17;
                          break;

                        case 16:
                          ctx.throw(404);

                        case 17:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, this);
                }));

                function users(_x4) {
                  return _ref9.apply(this, arguments);
                }

                return users;
              }()
            };


            app.use(__WEBPACK_IMPORTED_MODULE_3_koa_bodyparser___default()());

            app.use(function () {
              var _ref10 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.mark(function _callee5(ctx, next) {
                var path, route;
                return __WEBPACK_IMPORTED_MODULE_0_D_JS_giveaway_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return next();

                      case 2:
                        ctx.status = 200; // koa defaults to 404 when it sees that status is unset

                        if (!ctx.path.startsWith('/api/')) {
                          _context5.next = 15;
                          break;
                        }

                        console.log(ctx.method);
                        path = ctx.path.split('/').slice(2);
                        route = routes[path[0].toLowerCase()];

                        if (!route) {
                          _context5.next = 12;
                          break;
                        }

                        _context5.next = 10;
                        return route({ ctx: ctx, next: next, path: path });

                      case 10:
                        _context5.next = 13;
                        break;

                      case 12:
                        ctx.throw(404);

                      case 13:
                        _context5.next = 16;
                        break;

                      case 15:
                        return _context5.abrupt('return', new Promise(function (resolve, reject) {
                          ctx.res.on('close', resolve);
                          ctx.res.on('finish', resolve);
                          nuxt.render(ctx.req, ctx.res, function (promise) {
                            // nuxt.render passes a rejected promise into callback on error.
                            promise.then(resolve).catch(reject);
                          });
                        }));

                      case 16:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, _this);
              }));

              return function (_x5, _x6) {
                return _ref10.apply(this, arguments);
              };
            }());

            app.listen(port, host);
            console.log('Server listening on ' + host + ':' + port); // eslint-disable-line no-console

          case 17:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function start() {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }









start();

/***/ }
/******/ ]);
//# sourceMappingURL=main.map