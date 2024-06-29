import {View, Text} from 'react-native';
import React from 'react';

const PollOptionItem = ({item}) => {
  return (
    <View
      style={{
        width: '90%',
        height: 50,
        borderWidth: 1,
        marginTop: 10,
        borderColor: '#9e9e9e',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
      }}>
      <Text style={{color: 'black'}}>{item.value}</Text>
    </View>
  );
};

export default PollOptionItem;
