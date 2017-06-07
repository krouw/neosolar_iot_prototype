import React, { Component } from 'react'
import { View,
         Text,
         StyleSheet,
         TextInput,
         ListView,
         TouchableWithoutFeedback } from 'react-native'
import { MKButton } from 'react-native-material-kit'
import { Logout } from '../../actions/auth'
import { Actions, ActionConst } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import DeviceListItem from '../../components/DeviceListItem/DeviceListItem'
import SearchBar from '../../components/SearchBar/SearchBar'
import DeviceModal from '../../components/DeviceModal/DeviceModal'
import { getUserDevices } from '../../actions/device'

class DeviceList extends Component  {

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      showModal: false,
    }
    this.getUserDevices()
  }

  getUserDevices(){
    this.props.getUserDevices(this.props.user)
  }

  content(){
    if(this.props.isFetching){
      return ( <Text> Loading... </Text> )
    }
    else if(this.props.devices.length <= 0){
      return ( <Text>No hay dispositivos</Text> )
    }
    else{
      return (
        <ListView
          style={styles.deviceList}
          dataSource={this.ds.cloneWithRows(this.props.devices)}
          renderRow={(rowData) => <DeviceListItem data={rowData} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator}></View> }
        />
      )
    }
  }

  render(){
    const AccentIconButton = MKButton.accentColoredFlatButton()
      .withOnPress(() => Actions.profile({type: ActionConst.PUSH}))
      .build();
    return(
      <View style={styles.container}>
        <View style={[styles.header]}>
          <Text style={styles.title}>Spots Fotovoltaicos</Text>
          <AccentIconButton>
            <Icon name="account-circle"
              color="gray"
              size={24} />
          </AccentIconButton>
        </View>
        <DeviceModal
          title="Agregar Spot"
          visible={this.state.showModal}
          onAccept={() => {}}
          onDecline={() => { this.setState({showModal: false})}} />
        <SearchBar />
        <View style={[styles.content]}>
          { this.content() }
          <ActionButton
            position="right"
            degrees={0}
            buttonColor="rgba(231,76,60,1)"
            onPress={() => this.setState({showModal: true})}
          />
        </View>
      </View>
    );
  }
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
    backgroundColor: 'gainsboro',
  },
  title:{
    fontSize: 20,
    fontWeight: "500",
  },
  content:{
    flex: 1,
    zIndex: 1,
  },
  deviceList: {
    flex: 1,
  },
  separator: {
   flex: 1,
   height: StyleSheet.hairlineWidth,
   backgroundColor: '#757272',
   marginLeft: 16,
   marginRight: 16,
  },
  test :{
   borderStyle: 'solid',
   borderColor: 'red',
   borderWidth: 1,
  },
});

function mapStateToProps(state){
  return {
    user: state.auth.user,
    devices: state.device.devices,
    isFetching: state.device.isFetching,
  }
}

function mapDispatchToProps(dispatch){
  return {
    getUserDevices: (userData) => dispatch(getUserDevices(userData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceList)
