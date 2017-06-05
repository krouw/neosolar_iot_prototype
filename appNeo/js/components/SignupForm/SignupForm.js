import React from 'react'
import { View, Text , StyleSheet, ActivityIndicator } from 'react-native'
import { reduxForm, Field } from 'redux-form'
import TextField from '../../components/TextField/TextField'
import { MKButton } from 'react-native-material-kit'
import axios from 'axios'
import { api } from '../../actions/types'

const validate = values => {
  const errors = {}
  if (!values.email) {
    errors.email = 'Campo requerido'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Email inválido'
  }
  if (!values.password) {
    errors.password = 'Campo Requerido'
  }
  else if (values.password.length<6 || values.passwordlength>20 ) {
    errors.password = 'Contraseña de 6 a 20 caracteres'
  }
  return errors
}

const asyncValidate = (values) => {
  const errors = {};
  return axios.get(`${api.uri}/auth/${values.email}/exists`)
    .then( res => {
      console.log(res);
    })
    .catch((err) => {
      throw err.response.data.errors
    })
}

const SignupForm = ({
  onSwitch,
  submitting,
  error,
  handleSubmit,
  SignupServer, }) => {

  const ColoredRaisedButton = MKButton.coloredButton()
    .withBackgroundColor('orange')
    .withStyle(styles.submitButton)
    .build();

  return (
    <View style={[styles.signupForm]}>
      <Text style={styles.title}>Regístrate</Text>
      {error && <Text style={styles.error}>
        {error}
      </Text>}
      <Field
        name='email'
        label='Email'
        dense={true}
        component={TextField} />
      <Field
        name='password'
        label='Password'
        dense={true}
        isPassword={true}
        component={TextField} />
      <ColoredRaisedButton
        onPress={handleSubmit(SignupServer)}>
        { submitting ?
          <ActivityIndicator
            color="white"
            size={32} /> :
            <Text style={{color: 'white', fontWeight: 'normal', fontSize: 24,}}>Crear Cuenta</Text> }
      </ColoredRaisedButton>
    </View>
  )
}

const styles = StyleSheet.create({
    signupForm: {
      width: '100%',
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    title:{
      fontSize: 20,
      fontWeight: "400",
      paddingTop: 16,
    },
    submitButton:{
      width:'100%',
      height: 50,
      marginTop: 32,
      alignItems:'center',
      justifyContent:'center'
    },
    error: {
      padding: 16,
    },
});

export default reduxForm({
  form: 'signup',
  validate,
  asyncValidate,
  asyncBlurFields: ['email'],
})(SignupForm)
