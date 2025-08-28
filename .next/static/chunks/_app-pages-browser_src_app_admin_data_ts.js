"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([["_app-pages-browser_src_app_admin_data_ts"],{

/***/ "(app-pages-browser)/../../../node_modules/.pnpm/next@14.2.4_@babel+core@7.28.3_@playwright+test@1.55.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ../../../node_modules/.pnpm/next@14.2.4_@babel+core@7.28.3_@playwright+test@1.55.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval(__webpack_require__.ts("// This file must be bundled in the app's client layer, it shouldn't be directly\n// imported by the server.\n\nObject.defineProperty(exports, \"__esModule\", ({\n    value: true\n}));\nObject.defineProperty(exports, \"createServerReference\", ({\n    enumerable: true,\n    get: function() {\n        return createServerReference;\n    }\n}));\nconst _appcallserver = __webpack_require__(/*! next/dist/client/app-call-server */ \"(app-pages-browser)/../../../node_modules/.pnpm/next@14.2.4_@babel+core@7.28.3_@playwright+test@1.55.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/client/app-call-server.js\");\nfunction createServerReference(id) {\n    // Since we're using the Edge build of Flight client for SSR [1], here we need to\n    // also use the same Edge build to create the reference. For the client bundle,\n    // we use the default and let Webpack to resolve it to the correct version.\n    // 1: https://github.com/vercel/next.js/blob/16eb80b0b0be13f04a6407943664b5efd8f3d7d0/packages/next/src/server/app-render/use-flight-response.tsx#L24-L26\n    const { createServerReference: createServerReferenceImpl } =  false ? 0 : __webpack_require__(/*! react-server-dom-webpack/client */ \"(app-pages-browser)/../../../node_modules/.pnpm/next@14.2.4_@babel+core@7.28.3_@playwright+test@1.55.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react-server-dom-webpack/client.js\");\n    return createServerReferenceImpl(id, _appcallserver.callServer);\n}\n\n//# sourceMappingURL=action-client-wrapper.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNC4yLjRfQGJhYmVsK2NvcmVANy4yOC4zX0BwbGF5d3JpZ2h0K3Rlc3RAMS41NS4wX3JlYWN0LWRvbUAxOC4zLjFfcmVhY3RAMTguMy4xX19yZWFjdEAxOC4zLjEvbm9kZV9tb2R1bGVzL25leHQvZGlzdC9idWlsZC93ZWJwYWNrL2xvYWRlcnMvbmV4dC1mbGlnaHQtbG9hZGVyL2FjdGlvbi1jbGllbnQtd3JhcHBlci5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ2E7QUFDYiw4Q0FBNkM7QUFDN0M7QUFDQSxDQUFDLEVBQUM7QUFDRix5REFBd0Q7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUM7QUFDRix1QkFBdUIsbUJBQU8sQ0FBQyw2T0FBa0M7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksbURBQW1ELEVBQUUsTUFBMEIsR0FBRyxDQUErQyxHQUFHLG1CQUFPLENBQUMsOFBBQWlDO0FBQ3pMO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9uZXh0QDE0LjIuNF9AYmFiZWwrY29yZUA3LjI4LjNfQHBsYXl3cmlnaHQrdGVzdEAxLjU1LjBfcmVhY3QtZG9tQDE4LjMuMV9yZWFjdEAxOC4zLjFfX3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWZsaWdodC1sb2FkZXIvYWN0aW9uLWNsaWVudC13cmFwcGVyLmpzP2E4NTgiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBmaWxlIG11c3QgYmUgYnVuZGxlZCBpbiB0aGUgYXBwJ3MgY2xpZW50IGxheWVyLCBpdCBzaG91bGRuJ3QgYmUgZGlyZWN0bHlcbi8vIGltcG9ydGVkIGJ5IHRoZSBzZXJ2ZXIuXG5cInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImNyZWF0ZVNlcnZlclJlZmVyZW5jZVwiLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlU2VydmVyUmVmZXJlbmNlO1xuICAgIH1cbn0pO1xuY29uc3QgX2FwcGNhbGxzZXJ2ZXIgPSByZXF1aXJlKFwibmV4dC9kaXN0L2NsaWVudC9hcHAtY2FsbC1zZXJ2ZXJcIik7XG5mdW5jdGlvbiBjcmVhdGVTZXJ2ZXJSZWZlcmVuY2UoaWQpIHtcbiAgICAvLyBTaW5jZSB3ZSdyZSB1c2luZyB0aGUgRWRnZSBidWlsZCBvZiBGbGlnaHQgY2xpZW50IGZvciBTU1IgWzFdLCBoZXJlIHdlIG5lZWQgdG9cbiAgICAvLyBhbHNvIHVzZSB0aGUgc2FtZSBFZGdlIGJ1aWxkIHRvIGNyZWF0ZSB0aGUgcmVmZXJlbmNlLiBGb3IgdGhlIGNsaWVudCBidW5kbGUsXG4gICAgLy8gd2UgdXNlIHRoZSBkZWZhdWx0IGFuZCBsZXQgV2VicGFjayB0byByZXNvbHZlIGl0IHRvIHRoZSBjb3JyZWN0IHZlcnNpb24uXG4gICAgLy8gMTogaHR0cHM6Ly9naXRodWIuY29tL3ZlcmNlbC9uZXh0LmpzL2Jsb2IvMTZlYjgwYjBiMGJlMTNmMDRhNjQwNzk0MzY2NGI1ZWZkOGYzZDdkMC9wYWNrYWdlcy9uZXh0L3NyYy9zZXJ2ZXIvYXBwLXJlbmRlci91c2UtZmxpZ2h0LXJlc3BvbnNlLnRzeCNMMjQtTDI2XG4gICAgY29uc3QgeyBjcmVhdGVTZXJ2ZXJSZWZlcmVuY2U6IGNyZWF0ZVNlcnZlclJlZmVyZW5jZUltcGwgfSA9ICEhcHJvY2Vzcy5lbnYuTkVYVF9SVU5USU1FID8gcmVxdWlyZShcInJlYWN0LXNlcnZlci1kb20td2VicGFjay9jbGllbnQuZWRnZVwiKSA6IHJlcXVpcmUoXCJyZWFjdC1zZXJ2ZXItZG9tLXdlYnBhY2svY2xpZW50XCIpO1xuICAgIHJldHVybiBjcmVhdGVTZXJ2ZXJSZWZlcmVuY2VJbXBsKGlkLCBfYXBwY2FsbHNlcnZlci5jYWxsU2VydmVyKTtcbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWN0aW9uLWNsaWVudC13cmFwcGVyLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@14.2.4_@babel+core@7.28.3_@playwright+test@1.55.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./src/app/admin/data.ts":
/*!*******************************!*\
  !*** ./src/app/admin/data.ts ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAdminDashboardData: function() { return /* binding */ getAdminDashboardData; },
/* harmony export */   getBooks: function() { return /* binding */ getBooks; },
/* harmony export */   getDashboardStats: function() { return /* binding */ getDashboardStats; },
/* harmony export */   getPayments: function() { return /* binding */ getPayments; },
/* harmony export */   getRentals: function() { return /* binding */ getRentals; },
/* harmony export */   getUsers: function() { return /* binding */ getUsers; },
/* harmony export */   searchBooks: function() { return /* binding */ searchBooks; }
/* harmony export */ });
/* harmony import */ var next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/client/app-call-server */ "(app-pages-browser)/../../../node_modules/.pnpm/next@14.2.4_@babel+core@7.28.3_@playwright+test@1.55.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/client/app-call-server.js");
/* harmony import */ var next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! private-next-rsc-action-client-wrapper */ "(app-pages-browser)/../../../node_modules/.pnpm/next@14.2.4_@babel+core@7.28.3_@playwright+test@1.55.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js");



function __build_action__(action, args) {
  return (0,next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__.callServer)(action.$$id, args)
}

/* __next_internal_action_entry_do_not_use__ {"109fbae7ac368f2793f2e5a249ea5a865d99f130":"getUsers","536ad29050999144936248e914cf33a8f7f51c4b":"getBooks","580cd5c7c119716e0e4c56908563909cb24b6eaf":"getPayments","5fc2f9aa5bcb81153e43b6aa0ce2335d36ee627f":"getRentals","9168a479386fdd11e496acea0572fd55ee9a329a":"getDashboardStats","cd73a9b39b12911c8fcd827b5447c5f16afd2c0e":"searchBooks","dfb2448099a4875c42c026b56f5ccad1eb21fbc5":"getAdminDashboardData"} */ var searchBooks = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("cd73a9b39b12911c8fcd827b5447c5f16afd2c0e");

var getAdminDashboardData = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("dfb2448099a4875c42c026b56f5ccad1eb21fbc5");
var getBooks = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("536ad29050999144936248e914cf33a8f7f51c4b");
var getUsers = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("109fbae7ac368f2793f2e5a249ea5a865d99f130");
var getRentals = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("5fc2f9aa5bcb81153e43b6aa0ce2335d36ee627f");
var getPayments = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("580cd5c7c119716e0e4c56908563909cb24b6eaf");
var getDashboardStats = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("9168a479386fdd11e496acea0572fd55ee9a329a");



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ })

}]);