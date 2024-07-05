import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const Usercreated = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
      // navigation.navigate('Login');
    }, 1000);
  }, []);

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
          source={require('../lotte/Usercreated.json')}
          style={{height: '100%', width: '100%'}}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};

export default Usercreated;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
