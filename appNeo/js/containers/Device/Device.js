import React from 'react'
import { View,
         Text,
         StyleSheet,
         ActivityIndicator,
         TouchableNativeFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux'
import { MKButton } from 'react-native-material-kit'
import { Actions } from 'react-native-router-flux'
import { getDeviceMeasurement } from '../../actions/device'

const Device = ({data, isFetching, getDeviceMeasurement}) =>{
  getDeviceMeasurement(data)
  const ColoredRaisedButton = MKButton.coloredButton()
    .build();

  const content = () => {
    if(isFetching){
      return (
        <ActivityIndicator
          color="red"
          size={48} />
      )
    }
    else{
      return (
        <Text> Listo! </Text>
      )
    }
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <TouchableNativeFeedback
          onPress={() => Actions.pop()}>
          <Icon name="arrow-back"
            style={styles.test}
            color="gray"
            size={24} />
        </TouchableNativeFeedback>
        <Text style={styles.title}>
          {data.name}
        </Text>
      </View>
      <View style={[styles.content, styles.test]}>
        { content() }
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: 'transparent',
  },
  content:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title:{
    fontSize: 20,
    position: 'absolute',
    left:72
  },
  test :{
   borderStyle: 'solid',
   borderColor: 'red',
   borderWidth: 1,
  },
})

function mapStateToProps(state){
  return {
    isFetching: state.device.isFetchingMeasurement,
  }
}

function mapDispatchToProps(dispatch){
  return {
    getDeviceMeasurement: (device) => dispatch(getDeviceMeasurement(device)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Device)
