import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux'

import Icon from 'react-native-vector-icons/MaterialIcons';

import ActionButton from 'react-native-action-button';

const Tutorial = () => {
  const myicon = <Icon name="arrow-forward"
    color="white"
    size={24} />
  return (
    <View style={styles.container}>
      <View style={styles.tutorialContainer}>
        <Image
          style={styles.tutorialImage}
          source={{uri: 'https://raw.githubusercontent.com/wiki/facebook/react/react-logo-1000-transparent.png'}}
        />
        <Text
          style={styles.tutorialText}>
          Conecta tu Datalogger a internet y activa tu Spot Fotovoltaico en Tiempo Real
        </Text>
      </View>
      <View style={styles.Button}>
        <ActionButton
          position="center"
          hideShadow={false}
          offsetY={100}
          degrees={0}
          icon={myicon}
          buttonColor="rgba(231,76,60,1)"
          onPress={() => Actions.signin()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  tutorialContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tutorialImage:{
    width: 250,
    height: 250,
    marginTop:16,
  },
  tutorialText:{
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 23,
    paddingLeft: 32,
    paddingRight: 32,
  },
  Button: {
    flex: 2,
  },
});

export default Tutorial
