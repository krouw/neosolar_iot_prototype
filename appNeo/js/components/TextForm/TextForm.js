import React, { Component } from 'react';
import { TextInput, Text, View } from 'react-native';

import { styles } from './styles'

const TextForm = ({
  input: { onChange , ...restInput },
  meta: { touched, error },
  isPassword,
  label}) => {
  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TextInput
              style={styles.text}
              onChangeText={onChange}
              secureTextEntry={isPassword ? isPassword : false}
              {...restInput} />
      {touched && (error && <Text style={styles.errInput}>{error}</Text>)}
    </View>);
}

export default TextForm
