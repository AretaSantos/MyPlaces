import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login';
import Register from './components/Register';
import { signIn, store } from './components/SignIn';
import Map from './components/Map';
import Myplaces from './components/Myplaces';
import { Input, Button, ListItem, Icon, renderItem } from 'react-native-elements';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="Register"
        component={Register}
      />
    </Stack.Navigator>
  );
};

const MainStackNavigator = () => {

  return (
    <View style={styles.container}>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="Map"
            component={Map}
            options={{
              headerRight: () => (
                <Button
                  onPress={() => store.dispatch(signIn(false))}
                  title="LOG OUT"
                  buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
                  titleStyle={{ color: 'white' }}
                />
              ),
            }} />
          <Stack.Screen
            name="My Places"
            component={Myplaces}
            options={{
              headerRight: () => (
                <Button
                  onPress={() => store.dispatch(signIn(false))}
                  title="LOG OUT"
                  buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
                  titleStyle={{ color: 'white' }}
                />
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {

  const [isSigned, setIsSigned] = useState(false);

  // Update state from redux
  store.subscribe(() => {
    setIsSigned(store.getState());
  })

  return (
    // Check if 'isSigned' is true and change the path from 'Login' to 'Search' if true    
    <NavigationContainer>
      {isSigned ? <MainStackNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
