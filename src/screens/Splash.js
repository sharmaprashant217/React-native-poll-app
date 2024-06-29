import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      checkUser();
      // navigation.navigate('Login');
    }, 2000);
  }, []);
  const checkUser = async () => {
    const email = await AsyncStorage.getItem('EMAIL');
    if (email != null) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Login');
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle={'light-content'} />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '60%',
          width: '100%',
        }}>
        <LottieView
          source={require('../lotte/poll.json')}
          style={{height: '100%', width: '100%'}}
          autoPlay
          loop
        />
      </View>
      <View
        style={{
          height: '40%',
          width: '100%',
          alignItems: 'center',
        }}>
        <Text style={styles.logo}>PollPro</Text>
        <Text style={styles.tagline}>
          Post polls and get reviews by community
        </Text>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: 'purple',
    fontSize: 40,
    fontWeight: '800',
  },
  tagline: {
    color: 'purple',
    fontSize: 14,
    fontWeight: '600',
  },
});
