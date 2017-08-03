import React from 'react'
import { View,
         Text,
         StyleSheet,
         TextInput,
         Modal,
         TouchableOpacity } from 'react-native'
import { MKButton } from 'react-native-material-kit'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { addUserDevice } from '../../actions/device'
import TextField from '../../components/TextField/TextField'
import { SubmissionError, reset } from 'redux-form'
import { ToastAndroid } from 'react-native'

const validate = values => {
    const errors = {}
    if (!values.device) {
      errors.id = 'Campo requerido'
    }

    if (!values.password) {
      errors.password = 'Campo Requerido'
    }
    else if (values.password.length<6 || values.passwordlength>20 ) {
      errors.password = 'Contraseña de 6 a 20 caracteres'
    }

    return errors
}

const DeviceModal = ({ title,
                      visible,
                      onAccept,
                      onDecline,
                      user,
                      error,
                      addUserDevice,
                      handleSubmit }) => {

  const ColoredFlatButton = MKButton.coloredFlatButton()
    .build();
  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={() => {}}
      transparent >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={[styles.header]}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.error}>
            {error ? error : null}
          </Text>
          <View style={[styles.content]}>
            <Field
              name='device'
              label='ID'
              dense={true}
              component={TextField} />
            <Field
              name='password'
              label='Password'
              dense={true}
              isPassword={true}
              component={TextField} />
          </View>
          <View style={[styles.footer]}>
            <ColoredFlatButton
              onPress={onDecline}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </ColoredFlatButton>
            <ColoredFlatButton
              onPress={ () => { console.log('dsadad');}} >
              <Text style={styles.buttonText}>Agregar</Text>
            </ColoredFlatButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  card: {
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 5,
    margin: 32,
  },
  header:{
    padding: 16,
  },
  title:{
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 24,
    color: '#424242',
  },
  content: {
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24
  },
  footer:{
    flexDirection: 'row',
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
    justifyContent: 'flex-end',
  },
  buttonText:{
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    paddingTop: 8,
  },
  test:{
   borderStyle: 'solid',
   borderColor: 'red',
   borderWidth: 1,
  },
})

const mapDispatchToProps = (dispatch)  => ({
    addUserDevice: (user, deviceData) => dispatch(addUserDevice(user, deviceData)),
});

DeviceModal = connect(
    null, mapDispatchToProps
)(DeviceModal);

export default reduxForm({
  form: 'modalDevice',
  validate,
})(DeviceModal)
