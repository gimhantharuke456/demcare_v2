import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const TextButton = ({ color, onPress, fontSize, children }) => {
 
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { borderColor: color }]}>
      <Text style={[styles.buttonText, { color, fontSize }]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default TextButton;
