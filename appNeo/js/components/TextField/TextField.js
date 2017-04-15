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
      meta: { asyncValidating, touched, error, invalid, active },
      isPassword,
      label,
      duration,
      borderColor,
      ...props,
    } = this.props;
    return (
      <View style={[styles.container]}>
        <View style={[styles.wrapperInput]}>
          <TextInput
              style={[styles.textInput]}
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
            label={'prueba'}
            labelColor={'gray'}
            highlightColor={'blue'}
            isFocused={active} />
          <Underline
            ref="underline"
            duration={duration}
            borderColor={'gray'}
            highlightColor={'blue'} />
        </View>
        <View style={styles.wrapperErr}>
          {touched && (error && <Text style={styles.textErr}>{error}</Text>)}
        </View>
      </View>);
  }
}

const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    wrapperInput:{
      height: 72,
      paddingTop: 38,
      paddingBottom: 7,
      position: 'relative',
    },
    textInput:{
      width: 300,
      height: 34,
      fontSize: 16,
      lineHeight: 34,
    },
    wrapperErr:{
      height: 16,
    },
    textErr:{
      paddingRight: 16,
      color: 'red',
    },
    test :{
     borderStyle: 'solid',
     borderColor: 'red',
     borderWidth: 1,
    },
});

TextField.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  isPassword: PropTypes.bool,
  label: PropTypes.string,
};

TextField.defaultProps = {
  duration: 200,
  labelColor: '#9E9E9E',
  borderColor: 'red',
  textColor: '#000',
  dense: false,
  underlineColorAndroid: 'rgba(0,0,0,0)',
};


export default TextField
