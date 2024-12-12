import React, { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { Input, Button, Image } from "react-native-elements";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const signUp = () => {
    if (fullName && email && password) {
      setSubmitLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((authUser) => {
          updateProfile(authUser.user, {
            displayName: fullName,
          }).then(() => {
            navigation.replace("Home");
          });
        })
        .catch((error) => {
          alert(error.message);
          setSubmitLoading(false);
        });
    } else {
      alert("All fields are mandatory");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <Input placeholder="Full Name" value={fullName} onChangeText={setFullName} />
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button
        containerStyle={styles.button}
        title="Register"
        onPress={signUp}
        loading={submitLoading}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  inputContainer: { width: 300 },
  button: { width: 300, marginTop: 10 },
});

export default RegisterScreen;
