import React, { Component } from 'react'
import { View,
         Text,
         StyleSheet,
         TextInput,
         ListView,
         ActivityIndicator,
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
import { mqttConnect } from '../../actions/mqtt'

class DeviceList extends Component  {

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      showModal: false,
      dataSource: []
    }
    this.getUserDevices()

    this.mqttConfig = {
      clientId: this.props.user._id,
      username: this.props.user._id,
      password: this.props.token,
      mqttActive: this.props.mqtt.mqttActive,
    }

  }

  getUserDevices(){
    this.props.getUserDevices(this.props.user)
      .then(() => {
        if(!isEmpty(this.props.devices)){
          this.connectMQTT(0)
          Object.keys(this.props.devices)
            .map( deviceKey => {
              const newState = this.state.dataSource;
              newState.push(this.props.devices[deviceKey])
              this.setState({dataSource: newState})
            })
        }
        return
      })
  }

  connectMQTT(delay){
    setTimeout(() => {
      if(!this.props.mqtt.mqttActive && this.props.devices){
        this.props.mqttConnect(this.mqttConfig, this.props.devices)
      }
    }, delay)
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.mqtt.mqttActive && this.props.devices){
      this.connectMQTT(30000)
    }
  }

  content(){
    if(this.props.isFetching){
      return (
        <View style={{flex:1,justifyContent: 'center',
          alignItems: 'center',}}>
          <ActivityIndicator
            color="red"
            size={48} />
        </View>
      )
    }
    else if(isEmpty(this.props.devices)){
      return ( <View style={{flex:1,justifyContent: 'center',
        alignItems: 'center',}}>
        <Text> No hay dispositivos </Text>
      </View>)
    }
    else{
      return (
        <ListView
          style={styles.deviceList}
          dataSource={this.ds.cloneWithRows(this.state.dataSource)}
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
    token: state.auth.token,
    mqtt: state.mqtt,
    devices: state.device.entities,
    isFetching: state.device.isFetchingDevice,
  }
}

function mapDispatchToProps(dispatch){
  return {
    getUserDevices: (userData) => dispatch(getUserDevices(userData)),
    mqttConnect: (config, devices) => dispatch(mqttConnect(config, devices))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceList)
