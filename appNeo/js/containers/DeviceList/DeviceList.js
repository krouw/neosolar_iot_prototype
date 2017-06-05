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

import DeviceListItem from '../../components/DeviceListItem/DeviceListItem'
import SearchBar from '../../components/SearchBar/SearchBar'
import DeviceModal from '../../components/DeviceModal/DeviceModal'
import { getUserDevices } from '../../actions/device'

class DeviceList extends Component  {

  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      showModal: false,
      dataSource: ds.cloneWithRows([
        {name: 'Centro de Investigación 1',
         status: 'active'},
        {name: 'Utem ingenería 2',
         status: 'active'},
        {name: 'Casa 3',
         status: 'active'},
        {name: 'Un nombre bastante largo4',
        status: 'es solo un estado'},
        {name: 'Un nombre bastante largo5',
        status: 'es solo un estado'},
        {name: 'Un nombre bastante largo6',
        status: 'es solo un estado'},
        {name: 'Un nombre bastante largo7',
        status: 'es solo un estado'},
        {name: 'Un nombre bastante largo8',
        status: 'es solo un estado'},
        {name: 'Un nombre bastante largo9',
        status: 'es solo un estado'}])
    }
  }

  componentDidMount(){
    //this.props.getUserDevice(this.props)
    console.log(this.props.user);
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
          <ListView
            style={styles.deviceList}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <DeviceListItem data={rowData} />}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator}></View> }
          />
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
  console.log(state);
  return {
    user: state.auth.user,
    devices: state.devices
  }
}

function mapDispatchToProps(dispatch){
  return {
    getUserDevice: (userData) => dispatch(getUserDevice(userData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceList)
