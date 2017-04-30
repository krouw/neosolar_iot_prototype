import React from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableNativeFeedback } from 'react-native'
import IconMd from 'react-native-vector-icons/MaterialIcons';
import IconIon from 'react-native-vector-icons/Ionicons';

const DeviceListItem = ({data}) => {
  return (
    <TouchableNativeFeedback>
      <View style={[styles.DeviceWrapper]}>
        <IconMd
          style={styles.storage}
          name="storage"
          color="gray"
          size={40} />
        <View style={[styles.device]}>
          <Text style={styles.name}>
            {data.name}
          </Text>
          <Text style={styles.status}>
            {data.status}
          </Text>
        </View>
        <View style={[styles.arrow]}>
          <IconIon
            name="ios-arrow-dropright"
            color="gainsboro"
            size={30} />
        </View>
      </View>
    </TouchableNativeFeedback>
  )
}

const styles = StyleSheet.create({
  DeviceWrapper: {
    height: 80,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  storage:{
    flex: 1
  },
  device:{
    flex: 3,
  },
  name:{
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '400',
    color: '#424242'
  },
  status: {
    fontSize: 14,
    lineHeight: 16,
  },
  arrow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  test :{
   borderStyle: 'solid',
   borderColor: 'red',
   borderWidth: 1,
  },
});


export default DeviceListItem
