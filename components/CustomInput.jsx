import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ placeholder, onChange,isPassword = false }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#5BD2EC"
      onChangeText={onChange}
      secureTextEntry={isPassword}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#5BD2EC',
    borderWidth: 1,
    paddingHorizontal: 10,
    width : 250,
    borderRadius : 12,
    height : 50,
    marginBottom: 10,
    color: '#5BD2EC',
  },
});

export default CustomInput;
