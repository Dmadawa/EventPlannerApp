module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-redux|redux|@react-native|react-native|@react-navigation|react-native-safe-area-context|react-native-vector-icons|@react-native-firebase/messaging|@react-native-firebase|react-native-vector-icons|@react-navigation|@react-native-polyfills|@expo/vector-icons|react-native-vector-icons/Ionicons|react-native-vector-icons/Feather|react-native-vector-icons/AntDesign)/)',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
