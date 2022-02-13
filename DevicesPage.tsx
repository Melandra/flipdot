import React, {useEffect, useCallback, useReducer} from 'react';
import {PermissionsAndroid} from 'react-native';
import {ListItem} from 'react-native-elements';
import {BleManager, Device, BleError} from 'react-native-ble-plx';
import styled from 'styled-components/native';
import {ErrorToast} from './Components/ErrorToast';
import {Loader} from './Components/Loader';
import {
  bleScanningInitialState,
  bleScanningReducer,
  BleScanningTypes,
} from './reducers/BleScanning';

const ListContainer = styled.View`
  display: flex;
  align-items: center;
  height: 100%;
`;

const StyledListItem = styled(ListItem)`
  width: 100%;
`;

const StyledListItemTitle = styled(ListItem.Title)`
  padding: 8px 0;
  font-weight: bold;
`;

type Props = {
  bleManager: BleManager;
  setSelectedDevice: (device: Device) => void;
  navigation: any;
};
export const DevicesPage: React.FC<Props> = ({
  bleManager,
  setSelectedDevice,
  navigation,
}: Props) => {
  const [bleScanning, dispatchBleScanning] = useReducer(
    bleScanningReducer,
    bleScanningInitialState,
  );

  const askForPermissions = async () =>
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Localisation Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

  useEffect(() => {
    askForPermissions();
  });

  const scanDevices = useCallback(() => {
    const devices = bleScanning.devices;
    bleManager.startDeviceScan(
      null,
      null,
      (error: BleError | null, device: Device | null) => {
        dispatchBleScanning({type: BleScanningTypes.SCANNING, payload: true});
        dispatchBleScanning({
          type: BleScanningTypes.ERROR,
          payload: null,
        });
        if (error) {
          dispatchBleScanning({
            type: BleScanningTypes.SCANNING,
            payload: false,
          });
          dispatchBleScanning({
            type: BleScanningTypes.ERROR,
            payload: new Error(error.toString()),
          });
          return;
        }
        if (device) {
          if (device.name?.includes('FlipDotDisplay')) {
            if (devices.has(device.id)) {
              bleManager.stopDeviceScan();
              dispatchBleScanning({
                type: BleScanningTypes.SCANNING,
                payload: false,
              });
              dispatchBleScanning({
                type: BleScanningTypes.ERROR,
                payload: null,
              });
              return;
            }
            devices.set(device.id, device);
          }
        }
      },
    );
  }, [bleManager, bleScanning.devices, dispatchBleScanning]);

  useEffect(() => {
    const subscription = bleManager.onStateChange((state: any) => {
      if (state === 'PoweredOn') {
        scanDevices();
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, [bleManager, scanDevices]);

  const goToInputPage = (device: Device) => {
    setSelectedDevice(device);
    navigation.navigate('input');
  };

  return (
    <ListContainer>
      {bleScanning.scanning && <Loader />}
      {bleScanning.error !== null && (
        <ErrorToast message="Die Displays konnten nicht gefunden werden" />
      )}
      {Array.from(bleScanning.devices.values()).map((device: Device) => {
        return (
          <StyledListItem
            key={device.id}
            bottomDivider
            onPress={() => goToInputPage(device)}>
            <ListItem.Content>
              <StyledListItemTitle>{device.name}</StyledListItemTitle>
            </ListItem.Content>
            <ListItem.Chevron color="black" />
          </StyledListItem>
        );
      })}
    </ListContainer>
  );
};
