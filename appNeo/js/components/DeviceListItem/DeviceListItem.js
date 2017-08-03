import React from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableNativeFeedback } from 'react-native'
import { Actions } from 'react-native-router-flux'
import IconMd from 'react-native-vector-icons/MaterialIcons';
import IconIon from 'react-native-vector-icons/Ionicons';
import Skeleton from '../Skeleton/Skeleton'

const DeviceListItem = ({data, skeleton, addSkeleton}) => {
  return (
    <TouchableNativeFeedback onPress={() => Actions.device({data: data}) }>
         <View style={[styles.DeviceWrapper]}>
           <IconMd
             style={styles.storage}
             name="storage"
             color="gray"
             size={40} />
           <View style={[styles.device]}>
             <Skeleton
               visible={false}
               key={`loading-${data._id}-${1}`}
               ref={ (ref) => { if(ref){
                 addSkeleton(ref)
               }}}
               style={styles.skeleton_name}>
               <Text style={styles.name}>
                 {data.name}
               </Text>
             </Skeleton>
             <Skeleton
               visible={false}
               style={styles.skeleton_status}>
               <Text style={styles.name}>
                 {data.state}
               </Text>
             </Skeleton>
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
  skeleton_name:{
    height: 16,
    marginBottom: 8
  },
  status: {
    fontSize: 14,
    lineHeight: 16,
  },
  skeleton_status: {
    height: 14,
    width: 150,
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
