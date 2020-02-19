module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 182.4,
      propList: ['*'],
      selectorBlackList: [/ignore$/, /bb1$/],
    },
  },
};
