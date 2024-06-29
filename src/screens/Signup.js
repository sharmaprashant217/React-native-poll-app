import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import Loader from '../components/Loader';
import auth from '@react-native-firebase/auth';

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badEmail, setBadEmail] = useState('');
  const [badPassword, setBadPassword] = useState('');
  const [isUserNew, setIsUserNew] = useState(true);
  const [loading, setLoading] = useState(false);
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
          createUser();
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

  const createUser = () => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        setLoading(false);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          // console.log('That email address is already in use!');
          setIsUserNew(false);
          setLoading(false);
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          setLoading(false);
        }

        console.error(error);
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Account</Text>
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
      />
      {badPassword != '' && <Text style={styles.errorMsg}>{badPassword}</Text>}
      {isUserNew === false && (
        <Text style={styles.errorMsg}>
          {'User Already Registered Please Login'}
        </Text>
      )}
      <CustomButton
        title={'Sign Up'}
        onClick={() => {
          [validate(), createUser()];
        }}
      />
      <Text style={styles.signup}>
        {'Already have an Account ? '}
        <Text
          style={{textDecorationLine: 'underline'}}
          onPress={() => navigation.goBack()}>
          Login
        </Text>
      </Text>
      <Loader visible={loading} />
    </View>
  );
};

export default Signup;

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
