module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-paper/babel',
      ['expo-router/babel', { root: './src/app' }],
    ],
  };
}; 