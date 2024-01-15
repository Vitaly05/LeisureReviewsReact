/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
/* eslint-disable no-undef */

if (process.env.NODE_ENV === "development") {
    const { createProxyMiddleware } = require("http-proxy-middleware");
    
    module.exports = function (app) {
        const appProxy = createProxyMiddleware("/api", {
            target: process.env.REACT_APP_API_HOST,
            secure: false,
            changeOrigin: true
        });

        const hubProxy = createProxyMiddleware("/hub", {
            target: process.env.REACT_APP_API_HOST,
            ws: true,
            secure: false,
            changeOrigin: true
        });
        
        app.use(appProxy);
        app.use(hubProxy);
    };
}