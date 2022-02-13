import React, {useEffect} from 'react';

import {ToastAndroid} from 'react-native';

type Props = {
  message: string;
};
export const ErrorToast: React.VFC<Props> = ({message}) => {
  useEffect(() => {
    ToastAndroid.show(message, 10);
  });

  return null;
};
