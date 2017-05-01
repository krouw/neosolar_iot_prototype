import React from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableNativeFeedback,
         TextInput } from 'react-native'
import { Actions, ActionConst } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux'
import { MKButton } from 'react-native-material-kit'
import { Logout } from '../../actions/auth'

const Profile = ({ Logout }) => {

  const ColoredRaisedButton = MKButton.coloredButton()
    .build();
  return (
    <View style={[styles.container]}>
      <View style={[styles.header, styles.test]}>
        <TouchableNativeFeedback
          style={styles.test}
          onPress={() => Actions.pop()}>
          <Icon name="arrow-back"
            color="gray"
            size={24} />
        </TouchableNativeFeedback>
        <ColoredRaisedButton
            onPress={Logout}>
          <Text>Salir</Text>
        </ColoredRaisedButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: 'transparent',
  },
  title:{
    fontSize: 20,
    fontWeight: "500",
  },
  test :{
   borderStyle: 'solid',
   borderColor: 'red',
   borderWidth: 1,
  },
})

function mapDispatchToProps(dispatch){
  return {
    Logout: () => dispatch(Logout()),
  }
}

export default connect(null, mapDispatchToProps)(Profile);
