// components/TextInputWithIcon.js
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconFeather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

const IconPicker = ({ name, library }) => {
  switch (library) {
    case 'Ionicons':
      return <IconIon name={name} size={20} color="#666" />;
    case 'Feather':
      return <IconFeather name={name} size={20} color="#666" />;
    case 'AntDesign':
      return <AntDesign name={name} size={20} color="#666" />;
    default:
      return <IconIon name={name} size={20} color="#666" />;
  }
};

const TextInputWithIcon = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  leftIconName,     // Icon on the left (e.g., email or lock)
  leftIconLibrary,  // Library for the left icon (Ionicons, Feather, or AntDesign)
  rightIconName,    // Icon for toggling visibility (for password)
  rightIconLibrary, // Library for the right icon
  onRightIconPress, // Function to toggle visibility (for password)
  extraIconName,    // Additional icon (for another purpose like 'clear' or 'search')
  extraIconLibrary  // Library for the additional icon
}) => {
  return (
    <View style={styles.inputContainer}>
      {/* Left Icon */}
      {leftIconName && (
        <IconPicker name={leftIconName} library={leftIconLibrary} />
      )}

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />

      {/* Right Icon for password visibility toggle */}
      {rightIconName && onRightIconPress && (
        <TouchableOpacity onPress={onRightIconPress}>
          <IconPicker name={rightIconName} library={rightIconLibrary} />
        </TouchableOpacity>
      )}

      {/* Extra Icon (e.g., clear or search) */}
      {extraIconName && (
        <TouchableOpacity>
          <IconPicker name={extraIconName} library={extraIconLibrary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = {
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: '#DA5E4214'
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
};

export default TextInputWithIcon;
