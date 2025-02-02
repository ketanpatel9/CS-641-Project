import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomListItem from '../components/CustomListItem';
import { db, auth } from '../firebase';
import { Text } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const AllTransactions = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'All Transactions',
    });
  }, []);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'expense'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) =>
      setTransactions(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return unsubscribe;
  }, []);

  const [filter, setFilter] = useState([]);

  useEffect(() => {
    if (transactions) {
      setFilter(
        transactions.filter(
          (transaction) => transaction.data.email === auth.currentUser.email
        )
      );
    }
  }, [transactions]);

  return (
    <>
      {filter?.length > 0 ? (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            {filter?.map((info) => (
              <View key={info.id}>
                <CustomListItem
                  info={info.data}
                  navigation={navigation}
                  id={info.id}
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View style={styles.containerNull}>
          <FontAwesome5 name='list-alt' size={24} color='#EF8A76' />
          <Text h4 style={{color: '#4A2D5D'}}>
            No Transactions
          </Text>
        </View>
      )}
    </>
  );
};

export default AllTransactions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 0,
    marginTop: 25,
  },
  containerNull: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});