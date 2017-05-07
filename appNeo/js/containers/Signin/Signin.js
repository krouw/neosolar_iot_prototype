import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text,
         ScrollView,
         TouchableHighlight,
         StyleSheet, Dimensions } from 'react-native'
import { SocialIcon } from 'react-native-elements'
import { createTransition } from 'react-native-transition';
import { MKButton } from 'react-native-material-kit'
import SigninForm from '../../components/SigninForm/SigninForm'
import SignupForm from '../../components/SignupForm/SignupForm'

import { SigninServer,
         SignupServer,
         SigninGoogle } from '../../actions/auth'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'

const Transition = createTransition();

class Signin extends Component {

    constructor(props){
      super(props);
      this.height = 0;
      this.state = {
        transition: false,
      }
    }

    onSwitch(){
      this.setState({transition: !this.state.transition}, () =>{
        if(this.state.transition){
          Transition.show(<SignupForm SignupServer={this.props.SignupServer} />)
        }
        else{
          Transition.show(<SigninForm SigninServer={this.props.SigninServer} />)
        }
      })
    }

    onLayout(e) {
      const {nativeEvent: {layout: {height}}} = e;
      this.height = height;
      //this.forceUpdate();
    }

    componentDidMount(){
      this._setupGoogleSignin();
     }

     async _setupGoogleSignin() {
       try {
         await GoogleSignin.hasPlayServices({ autoResolve: true });
         await GoogleSignin.configure({
           webClientId: '36091147132-oeg0ibuusnbi2camkmkv36svrvp43vb7.apps.googleusercontent.com',
           offlineAccess: false
         });
       }
       catch(err) {
         console.log("Play services error", err.code, err.message);
       }
    }

    render(){

      const SignUpButton = MKButton.coloredButton()
        .withBackgroundColor('blue')
        .withStyle(styles.SignupButton)
        .withOnPress( (e) => {
          this.onSwitch()
        })
        .build();

      const {height: heightOfDeviceScreen} = Dimensions.get('window');
      return (
        <ScrollView
          contentContainerStyle={{minHeight: this.height || heightOfDeviceScreen}}
          onLayout={e => this.onLayout(e)}>
              <View style={[styles.header]}>
                <GoogleSigninButton
                  style={styles.ButtonGoogle}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={this.props.SigninGoogle} />
                <SignUpButton>
                  <Text style={styles.SignupButtonText}>
                    { this.state.transition ? 'Iniciar Sesión' : 'Crear una cuenta' }
                  </Text>
                </SignUpButton>
              </View>
              <View style={[styles.content]}>
                <View style={[styles.card]}>
                  <Transition>
                    <SigninForm
                      SigninServer={this.props.SigninServer} />
                  </Transition>
                </View>
              </View>
          </ScrollView>
      );
    }
}

Signin.propTypes = {
    SigninServer: React.PropTypes.func.isRequired,
    SignupServer: React.PropTypes.func.isRequired,
    SigninGoogle: React.PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 32,
    paddingRight: 32,
  },
  content:{
    flex: 1,
    minHeight:330,
    paddingRight: 32,
    paddingLeft: 32,
  },
  card: {
    minHeight: '100%',
    elevation: 20,
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
  },
  ButtonGoogle:{
    width: '100%',
    height: 48,
    marginBottom: 16,
  },
  SignupButton:{
    width:'98%',
    height: 42,
    alignItems:'center',
    justifyContent:'center',
  },
  SignupButtonText:{
    color: 'white',
    fontWeight: 'normal',
    fontSize: 16,
  },
  test :{
   borderStyle: 'solid',
   borderColor: 'red',
   borderWidth: 1,
  },
});

function mapDispatchToProps(dispatch){
  return {
    SigninServer: (userData) => dispatch(SigninServer(userData)),
    SignupServer: (userData) => dispatch(SignupServer(userData)),
    SigninGoogle: () => dispatch(SigninGoogle()),
  }
}

export default connect(null, mapDispatchToProps)(Signin)
