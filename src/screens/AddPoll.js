import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useState} from 'react';
import OptionItem from '../components/OptionItem';
import CustomButton from '../components/CustomButton';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Loader from '../components/Loader';

const AddPoll = () => {
  const [question, setQuestion] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([
    {value: '', key: 0},
    {value: '', key: 1},
  ]);
  const editOption = (item, ind, txt) => {
    let tempOptions = options;
    tempOptions.map((item, index) => {
      if (ind == index) {
        item.value = txt;
      }
    });
    let temp = [];
    tempOptions.map(item => {
      temp.push(item);
    });
    setOptions(temp);
  };
  const addOption = () => {
    let tempOptions = options;
    tempOptions.push({value: '', key: options.length});
    let temp = [];
    tempOptions.map(item => {
      temp.push(item);
    });
    setOptions(temp);
  };

  const postPoll = async () => {
    setLoading(true);
    const email = await AsyncStorage.getItem('EMAIL');
    try {
      await firestore()
        .collection('polls')
        .add({question, options, email: email});
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <View style={style.container}>
      <View style={style.questionArea}>
        <TextInput
          placeholder="Enter your question here..."
          multiline
          value={question}
          onChangeText={setQuestion}
        />
      </View>
      {options.map((item, index) => {
        return (
          <OptionItem
            item={item}
            onChangeText={txt => {
              console.log(txt);
              editOption(item, index, txt);
            }}
          />
        );
      })}
      <Text
        style={{
          padding: 10,
          borderWidth: 1,
          width: 100,
          marginLeft: 20,
          marginTop: 20,
          backgroundColor: 'purple',
          color: 'white',
          textAlign: 'center',
          borderRadius: 10,
        }}
        onPress={addOption}>
        Add More
      </Text>
      <CustomButton
        title={'Post Poll'}
        onClick={() => {
          postPoll();
        }}
      />
      <Loader visible={loading} />
    </View>
  );
};

export default AddPoll;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  questionArea: {
    width: '90%',
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#9e9e9e',
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
  },
});
