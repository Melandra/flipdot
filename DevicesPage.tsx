import React, {useEffect, useState, useCallback} from 'react';
import {PermissionsAndroid} from 'react-native';
import {ListItem} from 'react-native-elements';
import {BleManager, Device, BleError} from 'react-native-ble-plx';
import styled from 'styled-components/native';
import {ErrorToast} from './Components/ErrorToast';
import {Loader} from './Components/Loader';

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
  navigation: any;
  setSelectedDevice: (device: Device) => void;
};
export const DevicesPage: React.FC<Props> = ({
  bleManager,
  navigation,
  setSelectedDevice,
}: Props) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [devices, setDevices] = useState<Map<string, Device>>(
    new Map<string, Device>(),
  );
  const [scanningError, setScanningError] = useState<BleError | null>(null);
  const [connectionError, setConnectionError] = useState<string | undefined>();
  const [connecting, setConnecting] = useState<boolean>(false);

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

  const connectToDevice = (device: Device) => {
    device
      .isConnected()
      .then((isConnected: boolean) => {
        if (!isConnected) {
          setConnecting(true);
          device
            .connect({requestMTU: 187})
            .then(() => {
              setConnecting(false);
              setSelectedDevice(device);
              navigation.navigate('input');
            })
            .catch(exception => {
              console.log(exception);
            });
        } else {
          setConnecting(false);
          setSelectedDevice(device);
          navigation.navigate('input');
        }
      })
      .catch(exception => {
        setConnectionError(exception.toString);
      });
  };

  const scanDevices = useCallback(() => {
    bleManager.startDeviceScan(
      null,
      null,
      (error: BleError | null, device: Device | null) => {
        setScanning(true);
        if (error) {
          setScanning(false);
          setScanningError(error);
          return;
        }
        if (device) {
          if (device.name?.includes('FlipDotDisplay')) {
            if (devices.has(device.id)) {
              bleManager.stopDeviceScan();
              setScanning(false);
              return;
            }
            devices.set(device.id, device);
          }
        }
      },
    );
  }, [bleManager, devices]);

  useEffect(() => {
    const subscription = bleManager.onStateChange((state: any) => {
      if (state === 'PoweredOn') {
        scanDevices();
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, [bleManager, scanDevices]);

  return (
    <ListContainer>
      {scanning && <Loader />}
      {scanningError !== null && (
        <ErrorToast message="Die Displays konnten nicht gefunden werden" />
      )}
      {connectionError && <ErrorToast message={connectionError} />}
      {Array.from(devices.values()).map((device: Device) => {
        return (
          <StyledListItem
            key={device.id}
            bottomDivider
            onPress={() => connectToDevice(device)}>
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
