import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import React from 'react';
import PollOptionItem from './PollOptionItem';

const PollItem = ({item}) => {
  return (
    <View style={style.container}>
      <View style={style.topView}>
        <View style={style.topLeftView}>
          <Image
            source={require('../images/user.png')}
            style={style.userImage}
          />
          <Text style={style.username}>{item.email}</Text>
        </View>
      </View>
      <Text style={style.question}>{item.question}</Text>
      <FlatList
        data={item.options}
        renderItem={({item, index}) => {
          return <PollOptionItem item={item} />;
        }}
      />
    </View>
  );
};

export default PollItem;
const style = StyleSheet.create({
  container: {
    width: '90%',
    paddingBottom: 20,
    backgroundColor: '#f2f2f2',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  topView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  topLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
  },
  username: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
});
