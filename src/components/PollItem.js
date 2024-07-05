import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PollItem = ({item, refreshPoll}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalResponses, setTotalResponses] = useState(
    item.totalResponses || 0,
  );
  const [userEmail, setUserEmail] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchUserDataAndVote = async () => {
      try {
        const email = await AsyncStorage.getItem('EMAIL');
        setUserEmail(email);
        if (email) {
          const responseDoc = await firestore()
            .collection('polls')
            .doc(item.id)
            .collection('responses')
            .doc(email)
            .get();
          if (responseDoc.exists) {
            setSelectedOption(responseDoc.data().optionId);
            setHasVoted(true);
          } else {
            setHasVoted(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data or selected option', error);
      }
    };
    fetchUserDataAndVote();
  }, [item.id]);

  const updateCount = async (pollId, optionId) => {
    if (hasVoted) return;

    try {
      if (!userEmail) return;

      const pollRef = firestore().collection('polls').doc(pollId);
      const optionRef = pollRef.collection('options').doc(optionId);

      await firestore().runTransaction(async transaction => {
        const pollDoc = await transaction.get(pollRef);
        const optionDoc = await transaction.get(optionRef);

        if (!pollDoc.exists || !optionDoc.exists) {
          throw 'Document does not exist!';
        }

        const newCount = optionDoc.data().count + 1;
        const newTotalResponses = pollDoc.data().totalResponses + 1;

        transaction.update(optionRef, {count: newCount});
        transaction.update(pollRef, {totalResponses: newTotalResponses});
        transaction.set(pollRef.collection('responses').doc(userEmail), {
          optionId,
          email: userEmail,
        });
      });

      setSelectedOption(optionId);
      setTotalResponses(totalResponses + 1);
      setHasVoted(true);
      refreshPoll();
    } catch (error) {
      console.error('Error updating count: ', error);
    }
  };

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
        keyExtractor={option => option.id}
        renderItem={({item: option}) => {
          return (
            <TouchableOpacity
              style={{
                width: '90%',
                height: 50,
                borderWidth: 1,
                marginTop: 10,
                borderColor: '#9e9e9e',
                alignSelf: 'center',
                paddingLeft: 10,
                paddingRight: 10,
                flexDirection: 'row',
                backgroundColor:
                  selectedOption === option.id ? '#d3d3d3' : 'white',
                opacity: hasVoted && selectedOption !== option.id ? 0.5 : 1,
              }}
              disabled={hasVoted}
              onPress={() => {
                if (!hasVoted) {
                  [updateCount(item.id, option.id), refreshPoll()];
                }
              }}>
              <Text style={{color: 'black', alignSelf: 'center'}}>
                {option.value}
              </Text>
              <Text
                style={{
                  color: 'black',
                  alignSelf: 'center',
                  right: '-300%',
                }}>
                {`${((option.count / totalResponses) * 100).toFixed(0)}`}
                {' % Votes'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <Text style={style.totalResponses}>
        Total Responses: {item.totalResponses}
      </Text>
      {hasVoted && (
        <Text style={style.votedMessage}>
          You have already voted in this poll.
        </Text>
      )}
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
  totalResponses: {
    fontSize: 16,
    color: 'black',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
});
