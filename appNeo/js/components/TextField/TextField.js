import React, { Component, PropTypes } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import Underline from './Underline';
import FloatingLabel from './FloatingLabel';

class TextField extends Component {

  constructor(props){
    super(props)
  }

  render(){
    let {
      input: { value, onChange, onFocus, onBlur, ...restInput },
      meta: { asyncValidating, touched, error, invalid, active, visited },
      isPassword,
      label,
      duration,
      borderColor,
      dense,
      textColor,
      textFocusColor,
      ...props,
    } = this.props;
    if(touched && error){
      this.refs.underline.expandLine()
    }
    return (
      <View>
        <View style={[dense ? styles.denseWrapper : styles.wrapperInput]}>
          <TextInput
              style={[ dense ? styles.denseTextInput : styles.textInput, {
                color: textColor
              } : {}, (active && textFocusColor) ? {
                color: textFocusColor
              } : {},]}
              onChangeText={onChange}
              onFocus={(event) => {
                this.refs.label.floatLabel();
                this.refs.underline.expandLine();
                onFocus(event);
              }}
              onBlur={(event) => {
                !value.length ? this.refs.label.sinkLabel() : null;
                error ? this.refs.underline.expandLine() : this.refs.underline.shrinkLine() ;
                onBlur(event);
              }}
              secureTextEntry={isPassword ? isPassword : false}
              {...restInput}
              {...props} />
          <FloatingLabel
            ref='label'
            label={label}
            dense={dense}
            labelColor={'gray'}
            duration={duration}
            highlightColor={ touched && error ? 'red' : 'blue' }
            isFocused={ active ? true : active }
            hasValue={value ? true : false } />
          <Underline
            ref="underline"
            duration={duration}
            borderColor={'gray'}
            highlightColor={ touched && error ? 'red' : 'blue' } />
        </View>
        <View style={styles.wrapperErr}>
          {touched && (error && <Text style={styles.textErr}>{error}</Text>)}
        </View>
      </View>);
  }
}

TextField.propTypes = {
  duration: PropTypes.number,
  label: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  isPassword: PropTypes.bool,
  dense: PropTypes.bool,
  highlightColor: PropTypes.string,
  labelColor: PropTypes.string,
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  textFocusColor: PropTypes.string,
};

TextField.defaultProps = {
  duration: 300,
  labelColor: '#9E9E9E',
  borderColor: 'red',
  textColor: '#424242',
  dense: false,
  underlineColorAndroid: 'rgba(0,0,0,0)',
};

const styles = StyleSheet.create({
    wrapperInput:{
      height: 72,
      paddingTop: 30,
      position: 'relative',
    },
    denseWrapper: {
      height: 60,
      paddingTop: 28,
      paddingBottom: 4,
      position: 'relative'
    },
    textInput:{
      width: '90%',
      height: 40,
      fontSize: 16,
      lineHeight: 34,
    },
    denseTextInput: {
      width: '90%',
      fontSize: 13,
      height: 27,
      lineHeight: 24,
      paddingBottom: 3,
      textAlignVertical: 'top'
    },
    wrapperErr:{
      height: 16,
    },
    textErr:{
      paddingRight: 16,
      color: 'red',
    },
});


export default TextField
