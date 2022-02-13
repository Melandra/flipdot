import React from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';

const LoadingContainer = styled.View`
  display: flex;
  justify-content: center;
  height: 100%;
`;

export const Loader: React.VFC = () => (
  <LoadingContainer>
    <ActivityIndicator size={60} />
  </LoadingContainer>
);
