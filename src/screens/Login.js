import {View, Text, StyleSheet, Alert, StatusBar} from 'react-native';
import {useState, useEffect} from 'react';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badEmail, setBadEmail] = useState('');
  const [badPassword, setBadPassword] = useState('');
  const [isUserNew, setIsUserNew] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
      setBadEmail('');
      setBadPassword('');
    });

    return unsubscribe;
  }, [navigation]);

  const validate = async () => {
    if (email != '') {
      if (
        String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          )
      ) {
        setBadEmail('');
        if (password != '' && password.length > 4) {
          setBadPassword('');
          loginUser();
        } else {
          setBadPassword('Please Enter Password');
        }
      } else {
        setBadEmail('Please Enter Valid Email');
      }
    } else {
      setBadEmail('Please Enter Email');
    }
  };

  const loginUser = async () => {
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      if (user.emailVerified) {
        await AsyncStorage.setItem('EMAIL', email);
        setLoading(false);
        navigation.navigate('Home');
      } else {
        setLoading(false);
        Alert.alert(
          'Email not verified',
          'Please verify your email to continue.',
          [{text: 'OK', onPress: () => auth().signOut()}],
        );
      }
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/user-not-found') {
        setBadPassword('User Does Not Exist, Please Register');
        setIsUserNew(false);
      } else if (error.code === 'auth/wrong-password') {
        setBadPassword('Incorrect Password');
        setIsUserNew(true);
      } else {
        console.log('Login Error', error.message);
        setBadPassword('Maybe your email or password is wrong');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Text style={styles.heading}>Login</Text>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '30%',
          width: '100%',
        }}>
        <LottieView
          source={require('../lotte/login.json')}
          style={{height: '100%', width: '100%'}}
          autoPlay
          loop
        />
      </View>
      <CustomTextInput
        placeholder={'Enter Email'}
        value={email}
        onChangeText={txt => {
          setEmail(txt);
        }}
      />
      {badEmail != '' && <Text style={styles.errorMsg}>{badEmail}</Text>}
      <CustomTextInput
        placeholder={'Enter Password'}
        value={password}
        onChangeText={txt => {
          setPassword(txt);
        }}
        secureTextEntry={true}
      />
      {badPassword != '' && <Text style={styles.errorMsg}>{badPassword}</Text>}
      {isUserNew === false && (
        <Text style={styles.errorMsg}>
          {'User Does Not Exist Please Register'}
        </Text>
      )}
      <Text style={styles.forgot}>forgot password?</Text>
      <CustomButton
        title={'Login'}
        onClick={() => {
          validate();
        }}
      />

      <Text style={styles.signup}>
        {'New User ? '}
        <Text
          style={{textDecorationLine: 'underline'}}
          onPress={() => navigation.navigate('Signup')}>
          Sign Up
        </Text>
      </Text>
      <Loader visible={loading} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 30,
    fontWeight: '600',
    color: 'black',
    alignSelf: 'center',
    marginTop: 30,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 10,
    fontWeight: '600',
    color: 'black',
  },
  signup: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    alignSelf: 'center',
    marginTop: 50,
  },
  errorMsg: {
    marginLeft: 20,
    color: 'red',
    marginTop: 10,
  },
});
