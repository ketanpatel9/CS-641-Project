import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TextInput } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { format } from 'date-fns';  // Ensure the format function is imported
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Calendar } from 'react-native-calendars'; // Import Calendar

const AddScreen = ({ navigation }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [input, setInput] = useState('');
  const [amount, setAmount] = useState('');
  const [selDate, setSelDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar visibility
  const [selectedLanguage, setSelectedLanguage] = useState('expense');
  const result = format(selDate, 'dd/MM/yyyy');  // Format the selected date

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add Expense',
    });
  }, [navigation]);

  const handleDateSelect = (date) => {
    setSelDate(new Date(date.dateString)); // Update selected date
    setShowCalendar(false); // Hide calendar after selecting a date
  };

  const clearInputFields = () => {
    alert('Expense Created Successfully');
    setInput('');
    setAmount('');
    setSelDate(new Date());
    setSelectedLanguage('expense');
    navigation.navigate('Home');
    setSubmitLoading(false);
  };

  const createExpense = async () => {
    if (!input || !amount || !selDate || !selectedLanguage || !auth) {
      alert('All fields are mandatory');
      return;
    }

    setSubmitLoading(true);

    try {
      await addDoc(collection(db, 'expense'), {
        email: auth.currentUser.email,
        text: input,
        price: parseFloat(amount),
        date: selDate,
        type: selectedLanguage,
        timestamp: serverTimestamp(),
        userDate: result,
      });
      clearInputFields();
    } catch (error) {
      alert(`Error creating expense: ${error.message}`);
      setSubmitLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add Text"
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Add Amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <Button title="Pick a Date" onPress={() => setShowCalendar(true)} />
        
        {/* Show the calendar if showCalendar is true */}
        {showCalendar && (
          <Calendar
            markedDates={{
              [result]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
            }}
            onDayPress={handleDateSelect} // Handle day selection
            monthFormat={'yyyy MM'} // Month display format
            style={styles.calendar} // Style the calendar
          />
        )}

        <Text style={styles.dateDisplay}>Selected Date: {result}</Text>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        >
          <Picker.Item label="Expense" value="expense" />
          <Picker.Item label="Income" value="income" />
        </Picker>
        <Button
          containerStyle={styles.button}
          title="Add"
          onPress={createExpense}
          loading={submitLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddScreen;

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
  calendar: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: 320,
  },
});
