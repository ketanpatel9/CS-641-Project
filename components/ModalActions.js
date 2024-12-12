import React from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome, EvilIcons, FontAwesome5 } from '@expo/vector-icons';
import { doc, deleteDoc } from 'firebase/firestore'; // Firebase v9+ modular functions
import { db } from '../firebase';

const ModalActions = ({ modalVisible, setModalVisible, navigation, id }) => {
  
  // Delete expense function
  const deleteExpense = async () => {
    try {
      const expenseDocRef = doc(db, 'expense', id); // Get the document reference
      await deleteDoc(expenseDocRef); // Delete the document
      alert('Deleted Successfully');
    } catch (error) {
      alert(`Error deleting expense: ${error.message}`);
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* Close icon */}
            <View style={styles.closeIcon}>
              <Pressable
                style={[styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <FontAwesome5 name="times-circle" size={24} color="black" />
              </Pressable>
            </View>

            {/* Action buttons: Edit and Delete */}
            <View style={styles.handleIcons}>
              {/* Edit Button (Navigate to Update screen) */}
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.pencil}
                onPress={() => {
                  navigation.navigate('Update', { itemId: id });
                  setModalVisible(!modalVisible);
                }}
              >
                <EvilIcons name="pencil" size={40} color="#61ACB8" />
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.trash}
                onPress={deleteExpense}
              >
                <FontAwesome name="trash-o" size={32} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalActions;

const styles = StyleSheet.create({
  pencil: {
    backgroundColor: 'aliceblue',
    borderRadius: 10,
    padding: 8,
  },
  trash: {
    backgroundColor: 'aliceblue',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  handleIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
});
