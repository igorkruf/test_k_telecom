module.exports = {
  devServer: {
    proxy: {
      "/api/*": {
        target: "http://localhost:3000",
        // changeOrigin: true,
        // pathRewrite: { "^/api": "" },
      },
    },
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/global.variables.scss";`,
      },
    },
  },
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false,
    },
  },
  transpileDependencies: ["quasar"],
};
