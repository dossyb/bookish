const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // title to be used during template injection
      title: 'Bookish - A Social Book Cataloguing Web App',
    },
  },
  publicPath: '/bookish/'
});