import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const CustomButton = ({title, onClick}) => {
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => {
        onClick();
      }}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    width: '90%',
    height: 50,
    backgroundColor: 'purple',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
