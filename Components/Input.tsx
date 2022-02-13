import React from 'react';
import {CheckBox} from 'react-native-elements';
import styled from 'styled-components/native';

const Container = styled.View`
  margin-top: 18px;
`;

const StyledText = styled.Text`
  font-weight: bold;
  font-size: 15px;
  margin-left: 12px;
`;

const CheckboxTextContainer = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledTextInput = styled.TextInput`
  height: 40px;
  margin: 6px 12px 18px 12px;
  border-width: 1px;
  border-color: grey;
  border-radius: 5px;
  padding: 10px;
  flex-grow: 1;
`;

type Props = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  showCheckbox: boolean;
  checkboxValue?: boolean;
  onCheckChange?: () => void;
  placeholder?: string;
};
export const Input: React.VFC<Props> = ({
  label,
  value,
  setValue,
  showCheckbox,
  checkboxValue,
  onCheckChange,
  placeholder,
}) => {
  return (
    <Container>
      <StyledText>{label}</StyledText>
      <CheckboxTextContainer>
        <StyledTextInput
          onChangeText={setValue}
          value={value}
          placeholder={placeholder}
          autoCapitalize="characters"
        />
        {showCheckbox && (
          <CheckBox checked={checkboxValue!} onPress={onCheckChange!} />
        )}
      </CheckboxTextContainer>
    </Container>
  );
};
