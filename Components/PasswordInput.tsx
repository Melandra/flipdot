import React from 'react';

import {
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';

type Props = {
  setPassword: (password: string) => void;
  isPasswordValid: (password: string) => boolean;
};
export const PasswordInput: React.VFC<Props> = ({
  setPassword,
  isPasswordValid,
}) => {
  const submitPassword = (value: string) => {
    if (isPasswordValid(value)) {
      setPassword(value);
    }
  };

  return (
    <TextInput
      onChangeText={setPassword}
      onSubmitEditing={(
        e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
      ) => submitPassword(e.nativeEvent.text)}
      placeholder="abcd"
      style={{height: 40, marginBottom: 10}}
      underlineColorAndroid="grey"
    />
  );
};
