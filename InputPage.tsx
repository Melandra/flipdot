import React, {useEffect, useState, useReducer} from 'react';
import {Characteristic, Device} from 'react-native-ble-plx';
import styled from 'styled-components/native';
import {Buffer} from 'buffer';
import {Input} from './Components/Input';
import {Button} from 'react-native';

const SERVICE_ID = '49d0ea01-5b80-4056-aee7-a23ea1d1bec6';
const CHARACTERISTIC_ID = '49d0ea02-5b80-4056-aee7-a23ea1d1bec6';

const StyledContainer = styled.View`
  height: 100%;
  display: flex;
`;

const ButtonContainer = styled.TouchableOpacity`
  width: 70%;
  margin-top: 26px;
  border-radius: 10px;
  align-self: center;
  overflow: hidden;
`;

type CheckedReducer = (state: Checked, action: CheckedAction) => Checked;
const checkedReducer: CheckedReducer = (
  state: Checked,
  action: CheckedAction,
) => {
  switch (action.type) {
    case CheckedType.V1:
      return {...state, value1: action.payload};
    case CheckedType.V2:
      return {...state, value2: action.payload};
    case CheckedType.V3:
      return {...state, value3: action.payload};
  }
};
const initialCheckedState = {
  value1: false,
  value2: false,
  value3: false,
};

type Checked = {
  [key: string]: boolean;
};

enum CheckedType {
  'V1' = 'value1',
  'V2' = 'value2',
  'V3' = 'value3',
}

type CheckedAction = {
  type: CheckedType;
  payload: boolean;
};

type Props = {
  device?: Device;
};
export const InputPage: React.VFC<Props> = ({device}: Props) => {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [value3, setValue3] = useState<string>('');
  const [checked, dispatchChecked] = useReducer<CheckedReducer>(
    checkedReducer,
    initialCheckedState,
  );

  useEffect(() => {
    return () => {
      device?.cancelConnection();
    };
  }, [device]);

  const writeToDeviceCharacteristic = (
    message: string,
    total: number,
    index: number,
  ) => {
    if (device) {
      const payload = Buffer.from(
        `0${oldPassword}${newPassword}${total}${index}0${message}`,
      ).toString('base64');
      device
        .discoverAllServicesAndCharacteristics()
        .then(deviceWithServices => {
          deviceWithServices
            .writeCharacteristicWithResponseForService(
              SERVICE_ID,
              CHARACTERISTIC_ID,
              payload,
            )
            .then((characteristic: Characteristic) => {
              console.log(characteristic);
            });
        })
        .catch(exception => {
          console.log(exception);
        });
    }
  };

  const send = () => {
    const messages = [];
    for (const [key, value] of Object.entries(checked)) {
      if (value) {
        switch (key) {
          case 'value1':
            messages.push(value1);
            break;
          case 'value2':
            messages.push(value2);
            break;
          case 'value3':
            messages.push(value3);
            break;
        }
      }
    }

    const nrOfMessages = messages.length;
    messages.forEach((message: string, index: number) => {
      writeToDeviceCharacteristic(message, nrOfMessages, index + 1);
    });
  };

  /*  if (!device) {
    return null;
  } */

  return (
    <StyledContainer>
      <Input
        label="Alter Pin (4 Buchstaben)"
        value={oldPassword}
        setValue={setOldPassword}
        showCheckbox={false}
      />
      <Input
        label="Neuer Pin (4 Buchstaben)"
        value={newPassword}
        setValue={setNewPassword}
        showCheckbox={false}
      />
      <Input
        label="Eingabe 1"
        value={value1}
        setValue={setValue1}
        showCheckbox={true}
        checkboxValue={checked.value1}
        onCheckChange={() => {
          dispatchChecked({
            type: CheckedType.V1,
            payload: !checked.value1,
          });
        }}
      />
      <Input
        label="Eingabe 2"
        value={value2}
        setValue={setValue2}
        showCheckbox={true}
        checkboxValue={checked.value2}
        onCheckChange={() => {
          dispatchChecked({
            type: CheckedType.V2,
            payload: !checked.value2,
          });
        }}
      />
      <Input
        label="Eingabe 3"
        value={value3}
        setValue={setValue3}
        showCheckbox={true}
        checkboxValue={checked.value3}
        onCheckChange={() => {
          dispatchChecked({
            type: CheckedType.V3,
            payload: !checked.value3,
          });
        }}
      />
      <ButtonContainer>
        <Button title="Senden" onPress={send} />
      </ButtonContainer>
    </StyledContainer>
  );
};
