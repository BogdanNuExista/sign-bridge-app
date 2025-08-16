module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './src/components',
            '@services': './src/services',
            '@theme': './src/theme',
            '@store': './src/store',
            '@hooks': './src/hooks'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
