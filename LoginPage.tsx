import React, {useState} from 'react';

import {Button, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {PasswordInput} from './Components/PasswordInput';

type LoginProps = {
  isDarkMode: boolean;
  password: string;
  setPassword: (password: string) => void;
  navigation: any;
};
export const LoginPage: React.FC<LoginProps> = ({
  isDarkMode,
  setPassword,
  navigation,
}) => {
  const [tempPassword, setTempPassword] = useState<string>('');

  const goToDetailsPage = () => navigation.navigate('Geräte');

  const onSubmit = () => {
    setPassword(tempPassword);
    goToDetailsPage();
  };

  const isPasswordValid = (pwd: string) => {
    return pwd.length === 4;
  };

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}>
      <View style={[styles.sectionContainer]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          Pin (4 Buchstaben)
        </Text>
        <PasswordInput
          setPassword={setTempPassword}
          isPasswordValid={isPasswordValid}
        />
        <Button
          title="Login"
          onPress={onSubmit}
          disabled={!isPasswordValid(tempPassword)}
        />
        {/*password.length ? <Text>Passwort ändern</Text> : null*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    height: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});
