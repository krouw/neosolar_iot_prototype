import React from 'react'
import { View, Text , TouchableHighlight, ActivityIndicator } from 'react-native'
import { MKButton } from 'react-native-material-kit'
import { reduxForm, Field } from 'redux-form'
import TextField from '../../components/TextField/TextField'

import { styles } from './styles'

const validate = values => {
  const errors = {}
  if (!values.email) {
    errors.email = 'Campo requerido'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Email inválido'
  }
  if (!values.password) {
    errors.password = 'Campo requerido'
  }
  return errors
}

const SigninForm = ({
  SigninServer,
  onSwitch,
  handleSubmit,
  submitting,
  error,
  submitSucceeded }) => {

  if(submitSucceeded){
    ButtonColor = '#BDB818'
  }
  else{
    ButtonColor = '#EDB818'
  }

  const ColoredRaisedButton = MKButton.coloredButton()
    .withBackgroundColor(ButtonColor)
    .withStyle({width:260,height: 50,alignItems:'center', justifyContent:'center',})
    .build();

  return (
    <View style={[styles.signigForm]}>
      <Text style={{fontSize:24}}>Ingresa tus Datos</Text>
      {error && <Text style={styles.signinError}>
        {error}
      </Text>}
      <Field
        name='email'
        label='Email'
        component={TextField} />
      <Field
        name='password'
        label='Password'
        isPassword={true}
        component={TextField} />
        <Text style={{marginBottom: 32,}}>Recordar Contraseña</Text>
      <ColoredRaisedButton
        onPress={handleSubmit(SigninServer)}>
        { submitting ?
          <ActivityIndicator
            color="white"
            size={32} /> :
            <Text style={{color: 'white', fontWeight: 'normal', fontSize: 24,}}>{ submitSucceeded ? 'Sesión Iniciada' : 'Iniciar Sesión'}</Text> }
      </ColoredRaisedButton>
      <TouchableHighlight
        style={{marginTop:32,}}
        onPress={(e) => onSwitch(true)}
        activeOpacity={6}>
          <Text>Crea tu Cuenta</Text>
      </TouchableHighlight>
    </View>
  )
}

export default reduxForm({
  form: 'signin',
  validate,
})(SigninForm)
