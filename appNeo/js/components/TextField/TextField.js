import React, { Component } from 'react';
import { Text, View } from 'react-native';
import TextInput from 'react-native-md-textinput'

import { styles } from './styles'

const TextField = ({
  input: { onChange , ...restInput },
  meta: { asyncValidating, touched, error, invalid },
  isPassword,
  label }) => {
    console.log(invalid);
  return (
    <View style={styles.container}>
      <TextInput
          label={label}
          style={styles.text}
          onChangeText={onChange}
          highlightColor={touched && error ? 'red' : 'green' }
          secureTextEntry={isPassword ? isPassword : false}
          {...restInput} />
      {touched && (error && <Text style={styles.errInput}>{error}</Text>)}
    </View>);
}

export default TextField
