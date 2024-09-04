import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import PollItem from '../components/PollItem';
import firestore from '@react-native-firebase/firestore';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import {CommonActions} from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();

  useEffect(() => {
    getPolls();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );

    return () => {
      backHandler.remove();
    };
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.justLoggedIn) {
      refreshPoll();
      navigation.setParams({justLoggedIn: undefined});
    }
  }, [route.params?.justLoggedIn, refreshPoll, navigation]);

  const handleBackButtonPress = () => {
    if (isFocused) {
      Alert.alert('Exit App', 'Do you want to exit the app?', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    }
    return false;
  };

  const getPolls = async () => {
    setLoading(true);
    const pollsCollection = await firestore().collection('polls').get();
    let tempPolls = [];

    for (const doc of pollsCollection.docs) {
      let pollData = doc.data();
      pollData.id = doc.id;

      const optionsCollection = await firestore()
        .collection('polls')
        .doc(doc.id)
        .collection('options')
        .get();

      pollData.options = optionsCollection.docs.map(optionDoc => ({
        id: optionDoc.id,
        ...optionDoc.data(),
      }));

      tempPolls.push(pollData);
    }

    setPolls(tempPolls);
    setLoading(false);
  };

  const refreshPoll = useCallback(async () => {
    setRefreshing(true);
    await getPolls();
    setRefreshing(false);
  }, [getPolls]);

  const logOut = async () => {
    setLoading(true);
    try {
      await AsyncStorage.clear();
      console.log('logout');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
      setLoading(false);
    } catch (error) {
      console.log('Not Cleared:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'purple'} barStyle={'light-content'} />
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
        renderItem={({item}) => (
          <PollItem item={item} refreshPoll={refreshPoll} />
        )}
        keyExtractor={item => item.id}
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
