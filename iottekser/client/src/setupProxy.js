const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/logs',
    createProxyMiddleware({
      target: 'http://localhost:32000',
      changeOrigin: true,
      pathRewrite: { '^/': '' }, // opsional, kalau backend gak pakai prefix
    })
  );

  app.use(
    '/admin',
    createProxyMiddleware({
      target: 'http://localhost:31001',
      changeOrigin: true,
      pathRewrite: { '^/': '' }, // opsional, sesuaikan backend kamu
    })
  );
};
