import {View, Text, Appearance} from 'react-native';
import React, {useEffect} from 'react';
import AppNavigator from './src/navigations/AppNavigator';

const App = () => {
  useEffect(() => {
    Appearance.setColorScheme('light');
    const subscription = Appearance.addChangeListener(() => {
      Appearance.setColorScheme('light');
    });
    return () => subscription.remove();
  }, []);

  return <AppNavigator />;
};

export default App;
