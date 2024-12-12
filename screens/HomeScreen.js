import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-elements';
import { auth, db } from '../firebase';
import { StatusBar } from 'expo-status-bar';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import CustomListItem from '../components/CustomListItem';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const HomeScreen = ({ navigation }) => {
  const signOutUser = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch((error) => alert(error.message));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Expense Tracker',
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
            <Text style={{ fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'expense'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userEmail = auth.currentUser?.email;

      const fetchedTransactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      setTransactions(fetchedTransactions);

      // Filter transactions for the logged-in user
      const userTransactions = fetchedTransactions.filter(
        (transaction) => transaction.data.email === userEmail
      );
      setFilter(userTransactions);

      // Calculate total income
      const income = userTransactions
        .filter((t) => t.data.type === 'income')
        .reduce((acc, curr) => acc + parseFloat(curr.data.price || 0), 0);
      setTotalIncome(income);

      // Calculate total expense
      const expense = userTransactions
        .filter((t) => t.data.type === 'expense')
        .reduce((acc, curr) => acc + parseFloat(curr.data.price || 0), 0);
      setTotalExpense(expense);

      // Calculate total balance
      setTotalBalance(income - expense);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.fullName}>
          <Avatar
            size="medium"
            rounded
            source={{
              uri: auth?.currentUser?.photoURL,
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Welcome</Text>
            <Text h4 style={{ color: '#4A2D5D' }}>
              {auth.currentUser.displayName}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={{ textAlign: 'center', color: 'aliceblue' }}>
              Total Balance
            </Text>
            <Text h3 style={{ textAlign: 'center', color: 'aliceblue' }}>
              $ {totalBalance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name="arrow-down" size={18} color="green" />
                <Text style={{ textAlign: 'center', marginLeft: 5 }}>Income</Text>
              </View>
              <Text h4 style={{ textAlign: 'center' }}>
                {`$ ${totalIncome.toFixed(2)}`}
              </Text>
            </View>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name="arrow-up" size={18} color="red" />
                <Text style={{ textAlign: 'center', marginLeft: 5 }}>Expense</Text>
              </View>
              <Text h4 style={{ textAlign: 'center' }}>
                {`$ ${totalExpense.toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.recentTitle}>
          <Text h4 style={{ color: '#4A2D5D' }}>
            Recent Transactions
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('All')}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {filter?.length > 0 ? (
          <View style={styles.recentTransactions}>
            {filter?.slice(0, 3).map((info) => (
              <View key={info.id}>
                <CustomListItem
                  info={info.data}
                  navigation={navigation}
                  id={info.id}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.containerNull}>
            <FontAwesome5 name="list-alt" size={24} color="#EF8A76" />
            <Text h4 style={{ color: '#4A2D5D' }}>
              No Transactions
            </Text>
          </View>
        )}
      </View>
      <View style={styles.addButton}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Home')}
        >
          <AntDesign name="home" size={24} color="#66AFBB" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => navigation.navigate('Add')}
          activeOpacity={0.5}
        >
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('All')}
        >
          <FontAwesome5 name="list-alt" size={24} color="#EF8A76" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
  },
  fullName: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#535F93',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 20,
  },
  cardTop: {
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    margin: 'auto',
    backgroundColor: '#E0D1EA',
    borderRadius: 5,
  },
  cardBottomSame: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  recentTransactions: {
    backgroundColor: 'white',
    width: '100%',
  },
  seeAll: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  plusButton: {
    backgroundColor: '#535F93',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  containerNull: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
});
