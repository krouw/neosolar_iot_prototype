import React from 'react'
import { View, Text , StyleSheet, ActivityIndicator } from 'react-native'
import { MKButton } from 'react-native-material-kit'
import { reduxForm, Field } from 'redux-form'
import TextField from '../../components/TextField/TextField'

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
    .withStyle(styles.submitButton)
    .build();

  return (
    <View style={[styles.signigForm]}>
      <Text style={[styles.title]}>Identifícate</Text>
      <Text style={styles.error}>
        {error ? error : null}
      </Text>
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
        <Text style={styles.rememberPassword}>Recordar Contraseña</Text>
      <ColoredRaisedButton
        onPress={handleSubmit(SigninServer)}>
        { submitting ?
          <ActivityIndicator
            color="white"
            size={32} /> :
            <Text style={{color: 'white', fontWeight: 'normal', fontSize: 24,}}>{ submitSucceeded ? 'Sesión Iniciada' : 'Iniciar Sesión'}</Text> }
      </ColoredRaisedButton>
    </View>
  )
}

const styles = StyleSheet.create({
    signigForm: {
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
      alignItems:'center',
      justifyContent:'center'
    },
    rememberPassword:{
      marginTop: 16,
      marginBottom: 24
    },
    error: {
      paddingTop: 16,
    },
    test :{
     borderStyle: 'solid',
     borderColor: 'red',
     borderWidth: 1,
    },
});

export default reduxForm({
  form: 'signin',
  validate,
})(SigninForm)
