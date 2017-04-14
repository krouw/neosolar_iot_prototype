import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { MKButton } from 'react-native-material-kit'
import { Logout } from '../../actions/auth'
import { Actions, ActionConst } from 'react-native-router-flux'

const DeviceList = ({ Logout }) => {
  const ColoredRaisedButton = MKButton.coloredButton()
    .withStyle({width:260,height: 50,alignItems:'center', justifyContent:'center',})
    .build();

  return(
    <View>
      <Text>DeviceList</Text>
      <View>
        <ColoredRaisedButton
          onPress={(e) => {
            Actions.signin({type: ActionConst.RESET})
            Logout()
          }}>
            <Text
              style={{color: 'white', fontWeight: 'normal', fontSize: 24,}}>
              Salir
            </Text>
        </ColoredRaisedButton>
      </View>
    </View>
  );
}

DeviceList.propTypes = {

}

function mapDispatchToProps(dispatch){
  return {
    Logout: () => dispatch(Logout()),
  }
}

export default connect(null, mapDispatchToProps)(DeviceList);
