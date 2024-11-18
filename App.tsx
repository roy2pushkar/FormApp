import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AppRegistry } from 'react-native';
import LoginApp from './Components/FormPage';

AppRegistry.registerComponent('MyAppName', () => LoginApp);

const App = () => {


  return (
    <View>

      <View>
        <LoginApp />
      </View>
    </View>
  );
};



export default App;
