import {View, Text, Modal, ActivityIndicator} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
const Loader = ({visible}) => {
  return (
    <Modal visible={visible} transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 200,
            height: 200,
          }}>
          {/* <ActivityIndicator size="large" /> */}
          <LottieView
            source={require('../lotte/loading.json')}
            style={{height: '100%', width: '100%'}}
            autoPlay
            loop
          />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
