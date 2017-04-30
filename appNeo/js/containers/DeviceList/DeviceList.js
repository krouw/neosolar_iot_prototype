import React from 'react'
import { connect } from 'react-redux'
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

import DeviceListItem from '../../components/DeviceListItem/DeviceListItem'

const DeviceList = ({ Logout }) => {
  const AccentIconButton = MKButton.accentColoredFlatButton()
    .build();

  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const data = {
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
      status: 'es solo un estado'}]),
  };

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
      <View style={[styles.searchBar]}>
        <View style={styles.searchBg}></View>
        <View style={[styles.searchInputWrapper]}>
          <View style={styles.searchInputContent}>
            <Icon
              style={styles.searchIcon}
              name="search"
              color="gray"
              size={24} />
            <TextInput
              underlineColorAndroid={'rgba(0,0,0,0)'}
              placeholder={'Buscar Spot Fotovoltaico'}
              style={[styles.searchInput]} />
          </View>
        </View>
      </View>
      <View style={[styles.content]}>
        <ListView
          style={styles.deviceList}
          dataSource={data.dataSource}
          renderRow={(rowData) => <DeviceListItem data={rowData} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator}></View> }
        />
      </View>
    </View>
  );
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
  searchBar: {
    height: 50,
    overflow: 'visible',
    marginBottom: 4,
  },
  searchBg:{
    backgroundColor: 'gray',
    height: 50,
    zIndex: 1,
  },
  searchInputWrapper: {
    marginTop: 16,
    width: '100%',
    position: 'absolute',
    paddingRight: 16,
    paddingLeft: 16,
  },
  searchInputContent:{
    zIndex: 2,
    height: 40,
    elevation: 3,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '20%',
    paddingRight: 16,
    zIndex: 3
  },
  searchIcon:{
    zIndex: 1,
    position: 'absolute',
    left: 16,
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

function mapDispatchToProps(dispatch){
  return {
    Logout: () => dispatch(Logout()),
  }
}

export default connect(null, mapDispatchToProps)(DeviceList);
