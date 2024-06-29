import {View, Text, TextInput} from 'react-native';
import React from 'react';

const OptionItem = ({item, onChangeText}) => {
  return (
    <View
      style={{
        width: '90%',
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 10,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
      }}>
      <TextInput value={item.value} onChangeText={txt => onChangeText(txt)} />
    </View>
  );
};

export default OptionItem;
