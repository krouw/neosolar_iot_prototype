import React from 'react';
import { reduxForm,
         Field,}
         from 'redux-form'
import { View,
         Text,
         TouchableOpacity }
         from 'react-native'
import { SocialIcon,
         Button }
         from 'react-native-elements'
import TextForm from '../../components/TextForm/TextForm'

import { styles } from '../../styles'
import { signinStyles } from './signinStyles'

const onSubmit = values => {
  console.log('Submitting from', values);
}

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

const Signin = props => {

    const { handleSubmit } = props;

    return (
      <View style={styles.container}>
        <View style={[signinStyles.signinHeader]}>
          <Text>Ya estás conectado?</Text>
        </View>
        <View style={[styles.test,signinStyles.signinContent]}>
          <View>
            <SocialIcon
              title='Acceder con Google'
              button
              type='google-plus-official'
              style={signinStyles.signinGoogle}
              onPress={() => console.log('adwa')}
            />
          </View>
          <View style={[signinStyles.signigForm]}>
            <Text style={signinStyles.signinError}>
              Nombre de Usuario o Contraseña erroneos
            </Text>
            <Field
              name='email'
              label='Email'
              component={TextForm} />
            <Field
              name='password'
              label='Password'
              isPassword={true}
              component={TextForm} />
              <Text>Recordar Contraseña</Text>
            <Button
              raised
              title='Ingresar'
              buttonStyle={{margin: 16,}}
              backgroundColor='#EDB818'
              onPress={handleSubmit(onSubmit)}
              fontSize={20} />
            <Text>REGISTRAR</Text>
          </View>
        </View>
      </View>
    );
}

export default reduxForm({
  form: 'signin',
  validate,
})(Signin)
