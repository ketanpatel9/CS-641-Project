import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TextInput } from 'react-native';
import { Text, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const UpdateScreen = ({ route, navigation }) => {
  const { itemId } = route.params; // Pass the document ID (UID)
  const [input, setInput] = useState('');
  const [amount, setAmount] = useState('');
  const [selDate, setSelDate] = useState(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState('expense');
  const [show, setShow] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const formattedDate = format(selDate, 'dd/MM/yyyy');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Update Expense',
    });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenseDocRef = doc(db, 'expense', itemId); // Get document reference
        const expenseDoc = await getDoc(expenseDocRef);

        if (expenseDoc.exists()) {
          const data = expenseDoc.data();
          setInput(data.text || '');
          setAmount(data.price?.toString() || '');
          setSelDate(data.date?.toDate() || new Date());
          setSelectedLanguage(data.type || 'expense');
        } else {
          alert('Expense not found');
          navigation.goBack();
        }
      } catch (error) {
        alert(`Error fetching expense: ${error.message}`);
      }
    };

    fetchData();
  }, [itemId, navigation]);

  const showDatepicker = () => setShow(true);

  const onChange = (event, selectedDate) => {
    setShow(false);
    setSelDate(selectedDate || selDate);
  };

  const updateExpense = async () => {
    if (!input || !amount || !selDate || !selectedLanguage) {
      alert('All fields are mandatory');
      return;
    }

    setSubmitLoading(true);

    try {
      const expenseDocRef = doc(db, 'expense', itemId); // Reference to the document
      await updateDoc(expenseDocRef, {
        text: input.trim(),
        price: parseFloat(amount),
        date: selDate,
        type: selectedLanguage,
      });
      alert('Expense Updated Successfully');
      navigation.goBack();
    } catch (error) {
      alert(`Error updating expense: ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Update Description"
          value={input}
          onChangeText={setInput}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Update Amount"
          value={amount}
          onChangeText={setAmount}
        />
        <Button title="Pick a Date" onPress={showDatepicker} />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selDate}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
        <Text style={styles.dateDisplay}>Selected Date: {formattedDate}</Text>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        >
          <Picker.Item label="Expense" value="expense" />
          <Picker.Item label="Income" value="income" />
        </Picker>
        <Button
          containerStyle={styles.button}
          title="Update"
          onPress={updateExpense}
          loading={submitLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
  dateDisplay: {
    marginVertical: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});
