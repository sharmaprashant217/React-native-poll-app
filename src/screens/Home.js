import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import PollItem from '../components/PollItem';
import firestore from '@react-native-firebase/firestore';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';

const Home = () => {
  const navigation = useNavigation();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    getPolls();
  }, [isFocused]);
  const getPolls = async () => {
    const res = await firestore().collection('polls').get();
    console.log(res.docs);
    let temp = [];
    res.docs.forEach(item => {
      temp.push({id: item.id, ...item.data()});
    });
    setPolls(temp);
  };
  const logOut = async () => {
    setLoading(true);
    try {
      await AsyncStorage.clear();
      console.log('Cleared');
      navigation.navigate('Login');
      setLoading(false);
    } catch (error) {
      console.log('Not Cleared:', error);
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Pollpro</Text>
        <TouchableOpacity
          style={{
            height: 35,
            width: 40,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={logOut}>
          <Image
            style={{height: '100%', width: '100%', marginBottom: 10}}
            source={require('../images/off.png')}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={polls}
        renderItem={({item, index}) => {
          return <PollItem item={item} />;
        }}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPoll')}>
        <Text style={styles.addButtonText}>Add New Poll</Text>
      </TouchableOpacity>
      <Loader visible={loading} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'purple',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
  },
  logo: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: 'purple',
    borderRadius: 30,
    position: 'absolute',
    bottom: 50,
    right: 20,
    padding: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
