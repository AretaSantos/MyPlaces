import React, { useState } from "react";
import { Alert, Text, View, TextInput, StyleSheet } from "react-native";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { signIn, store } from './SignIn';
import { Button } from 'react-native-elements';
import firebaseConfig from './firebaseConfig';
import { userInfo, userStore } from './UserReducer';

initializeApp(firebaseConfig);
const auth = getAuth();

export default function Login({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //katotaan onko käyttäjä muuttunut ja vaihtaa user idetä (uid)
    const authListener = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                userStore.dispatch(userInfo(uid))
            } else {
                userStore.dispatch(userInfo(''))
            }
        })
    };
    // Kirjaudutaan sisään ja vaihdetaan "signInReducer's" store "true", jos käyttäjätunnukset köytyy
    const onLogin = () => {
        try {
            if (email !== '' && password !== '') {
                signInWithEmailAndPassword(auth, email, password)
                    .then(() => store.dispatch(signIn(true)))
                    .then(() => authListener())
                    .catch(error => {
                        switch (error.code) {
                            case 'auth/user-not-found':
                                Alert.alert('User Not Found!')
                                break;
                            case 'auth/wrong-password':
                                Alert.alert('Incorrect Password!')
                                break;
                            case 'auth/invalid-email':
                                Alert.alert('Invalid Email!')
                                break;
                            case 'auth/too-many-requests':
                                Alert.alert('Too Many Login Attempts. Try again later!')
                                break;
                        }
                    })
            } else {
                Alert.alert("Please fill all the fields")
            }
        } catch (err) {
            alert(err);
        }
    }


    return (
        
            <View style={styles.loginContainer}>
                <Text style={styles.loginTitle}>My Places</Text>
                <View style={styles.loginInputView}>
                    <TextInput
                        style={styles.loginTextInput}
                        placeholder="Email"
                        placeholderTextColor="black"
                        onChangeText={(email) => setEmail(email)}
                    />
                </View>
                <View style={styles.loginInputView}>
                    <TextInput
                        style={styles.loginTextInput}
                        placeholder="Password"
                        placeholderTextColor="black"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                </View>
                <Button
                    onPress={onLogin}
                    title="Sign in"
                    buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
                    titleStyle={{ color: 'white' }} />
                <Button
                    onPress={() => navigation.navigate('Register')}
                    title="Create a new user"
                    buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
                    titleStyle={{ color: 'white' }} />

            </View>
      
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    loginContainer: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    texts: {
        color: "white",
        fontFamily: "Roboto"
    },
    loginTitle: {
      fontFamily: "Roboto",
      fontSize: 20,
      marginBottom: 30,
    },
    loginInputView: {
      backgroundColor: "#fff",
      borderRadius: 5,
      width: "70%",
      height: 40,
      marginBottom: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: 'black',
    },
    loginTextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      textAlign: 'center'
    },

});