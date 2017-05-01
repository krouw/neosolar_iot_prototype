import React from 'react'
import { View,
         Text,
         StyleSheet,
         TextInput,
         Modal,
         TouchableOpacity } from 'react-native'
import { MKButton } from 'react-native-material-kit'
import { Actions } from 'react-native-router-flux'

const DeviceModal = ({ title, visible, onAccept, onDecline }) => {

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
          <View style={[styles.test, styles.content]}>
            <Text>Helooo</Text>
            <Text>Helooo</Text>
            <Text>Helooo</Text>

          </View>
          <View style={[styles.footer]}>
            <ColoredFlatButton
              onPress={onDecline}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </ColoredFlatButton>
            <ColoredFlatButton>
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
    paddingRight: 16,
    paddingLeft: 16,
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
  test:{
   borderStyle: 'solid',
   borderColor: 'red',
   borderWidth: 1,
  },
})

export default DeviceModal;
