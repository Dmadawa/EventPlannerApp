// components/CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomButton = ({ 
  onPress, 
  text, 
  loading, 
  iconName, 
  disabled 
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <>
          <Text style={styles.buttonText}>{text}</Text>
          {iconName && <Icon name={iconName} size={20} color="#fff" />}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DA5E42',
    borderRadius: 2,
    height: 44,
    paddingVertical: 14,
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#DA5E4214',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
});

export default CustomButton;
