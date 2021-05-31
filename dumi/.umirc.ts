import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'antd-captcha-input',
  outputPath: 'docs-dist',
  mode: 'doc',
  hash: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/antd-captcha-input/' : '/',
  base: process.env.NODE_ENV === 'production' ? '/antd-captcha-input/' : '/',
  dynamicImportSyntax: {},
  chainWebpack(memo) {
    memo.plugins.delete('copy');
  },
  // more config: https://d.umijs.org/config
});
