import React from 'react'
import { View, Text , TouchableOpacity, ActivityIndicator } from 'react-native'
import { reduxForm, Field } from 'redux-form'
import TextField from '../../components/TextField/TextField'
import { MKButton } from 'react-native-material-kit'
import axios from 'axios'

//Styles
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

const asyncValidate = (values) => {
  const errors = {};
  return axios.get('http://10.0.2.2:7000/api/auth')
    .then( res => {
      console.log(res);
      errors.email = 'el email esta siendo utilizado'
      return errors
    })
    .catch( err => {
      console.log(err);
    })
}

const SignupForm = ({
  onSwitch,
  submitting,
  error,
  handleSubmit,
  SignupServer,
  submitSucceeded }) => {

  if(submitSucceeded){
    ButtonColor = '#BDB818'
  }
  else{
    ButtonColor = '#EDB818'
  }
  const ColoredRaisedButton = MKButton.coloredButton()
    .withBackgroundColor(ButtonColor)
    .withStyle({width:260,height: 50, alignItems:'center', justifyContent:'center',})
    .build();

  return (
    <View style={[styles.signigForm, styles.test]}>
      <Text style={{fontSize:24}}>Registrate</Text>
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
      <ColoredRaisedButton
        onPress={handleSubmit(SignupServer)}>
        { submitting ?
          <ActivityIndicator
            color="white"
            size={32} /> :
            <Text style={{color: 'white', fontWeight: 'normal', fontSize: 24,}}>{ submitSucceeded ? 'Cuenta Creada!' : 'Crear Cuenta'}</Text> }
      </ColoredRaisedButton>
      <TouchableOpacity
        style={{marginTop:32,}}
        onPress={(e) => onSwitch(false)}>
          <Text>Volver</Text>
      </TouchableOpacity>
    </View>
  )
}

export default reduxForm({
  form: 'signup',
  validate,
  asyncValidate,
  asyncBlurFields: ['email']
})(SignupForm)
