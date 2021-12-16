import React, { useState } from "react";
import { Text, View, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { Button } from 'react-native-elements';


initializeApp(firebaseConfig);
const auth = getAuth();

export default function Register({ navigation }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const createNewUser = () => {
    try {
      if (email !== '' && password !== '') {
        createUserWithEmailAndPassword(auth, email, password)
          .then(() => Alert.alert('User was created succesfully'))
          .then(() => navigation.goBack())
          .catch(error => {
            switch (error.code) {
              case 'auth/email-already-in-use':
                Alert.alert('Email is already in use')
                break;
              case 'auth/invalid-email':
                Alert.alert('Invalid Email')
                break;
              case 'auth/weak-password':
                Alert.alert('Password must be at least 6 characters')
                break;
            }
          })
      } else {
        Alert.alert('Please fill all requested information')
      }
    } catch (err) {
      alert(err);
    }
  }

  return (
    <View style={styles.registerContainer}>
      <Text style={styles.registerTitle}>Create a new user</Text>
      <View style={styles.registerInputView}>
        <TextInput
          style={styles.registerTextInput}
          value={email}
          placeholder="Email"
          placeholderTextColor="black"
          onChangeText={(email) => setEmail(email)}
          style={styles.registerInput}
        />
      </View>
      <View style={styles.registerInputView}>
        <TextInput
          style={styles.registerTextInput}
          value={password}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          style={styles.registerInput}
        />
      </View>
      <Button
        onPress={createNewUser}
        title="Create user"
        buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
        titleStyle={{ color: 'white' }} />
    </View>
  );
}

const styles = StyleSheet.create({

  registerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  registerTitle: {
    fontFamily: 'Roboto',
    fontSize: 20,
    marginBottom: 30,
  },
  registerInputView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'black',
  },
  registerTextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  registerInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },

});