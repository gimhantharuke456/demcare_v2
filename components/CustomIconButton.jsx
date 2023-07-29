import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomIconButton = ({ icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View style={styles.buttonBox}>
        <Ionicons style={{color : "black"}} name={icon} size={Dimensions.get('window').width * 0.1} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
  },
  buttonBox: {
    backgroundColor: '#5BD2EC',
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default CustomIconButton;
