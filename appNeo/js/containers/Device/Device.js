import React, { Component } from 'react'
import { View,
         Text,
         StyleSheet,
         ActivityIndicator,
         TouchableNativeFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux'
import { MKButton } from 'react-native-material-kit'
import { Actions } from 'react-native-router-flux'
import isEmpty from 'lodash/isEmpty'
import { getDeviceMeasurement, updateDeviceMeasurement } from '../../actions/device'

class Device extends Component {

  constructor(props){
    super(props)
    this.props.getDeviceMeasurement(this.props.data)
  }

  content(){
    const msm = this.props.devices[this.props.data._id].measurement
    if(this.props.isFetching){
      return (
        <ActivityIndicator
          color="red"
          size={48} />
      )
    }

    if (isEmpty(msm)) {
      return (
        <Text> No hay mediciones. </Text>
      )
    }
    else{
      return (
        <View>
          <Text>Itensity: {msm.intensity}</Text>
          <Text>Voltage: {msm.voltageTotal}</Text>
          <Text>Battery 1: {msm.battery.battery1}</Text>
          <Text>Battery 2: {msm.battery.battery2}</Text>
          <Text>Battery 3: {msm.battery.battery3}</Text>
          <Text>Battery 4: {msm.battery.battery4}</Text>
        </View>
      )
    }
  }

  componentDidMount(){
    setInterval(() => {
      this.props.updateDeviceMeasurement(this.props.data)
    }, 10000)
  }

  render(){
    const ColoredRaisedButton = MKButton.coloredButton()
      .build();
    return (
      <View style={[styles.container]}>
        <View style={[styles.header]}>
          <TouchableNativeFeedback
            onPress={() => Actions.pop()}>
            <Icon name="arrow-back"
              color="gray"
              size={24} />
          </TouchableNativeFeedback>
          <Text style={styles.title}>
            {this.props.data.name}
          </Text>
        </View>
        <View style={[styles.content, styles.test]}>
          { this.content() }
        </View>
      </View>
    )
  }

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
    devices: state.device.entities,
    isFetching: state.device.isFetchingMeasurement,
  }
}

function mapDispatchToProps(dispatch){
  return {
    getDeviceMeasurement: (device) => dispatch(getDeviceMeasurement(device)),
    updateDeviceMeasurement: (device) => dispatch(updateDeviceMeasurement(device))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Device)
