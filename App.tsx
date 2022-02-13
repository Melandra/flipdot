/**
 * Application to write up to three values to a flipdot display
 * https://github.com/Melandra/flipdot
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DevicesPage} from './DevicesPage';
import {BleManager, Device} from 'react-native-ble-plx';
import {InputPage} from './InputPage';

const Stack = createNativeStackNavigator();

const bleManager: BleManager = new BleManager();

const App = () => {
  const [selectedDevice, setSelectedDevice] = useState<Device | undefined>();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="devices" options={{title: 'Displays'}}>
          {props => (
            <DevicesPage
              {...props}
              bleManager={bleManager}
              setSelectedDevice={setSelectedDevice}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="input" options={{title: 'Eingabe'}}>
          {props => (
            <SafeAreaView style={backgroundStyle}>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <InputPage {...props} device={selectedDevice} />
              </ScrollView>
            </SafeAreaView>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
