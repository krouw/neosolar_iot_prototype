import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View,Text, ScrollView } from 'react-native'
import { SocialIcon } from 'react-native-elements'
import { createTransition } from 'react-native-transition';
import SigninForm from '../../components/SigninForm/SigninForm'
import SignupForm from '../../components/SignupForm/SignupForm'

import { SigninServer, SignupServer } from '../../actions/auth'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'

import { styles } from '../../styles'
import { signinStyles } from './signinStyles'

const Transition = createTransition();

class Signin extends Component {

    constructor(props){
      super(props);
    }

    onSwitch(value){
      if(value){
        Transition.show(<SignupForm SignupServer={this.props.SignupServer} onSwitch={(e) => this.onSwitch(e)} />)
      }
      else{
        Transition.show(<SigninForm SigninServer={this.props.SigninServer} onSwitch={(e) => this.onSwitch(e)} />)
      }
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

        const user = await GoogleSignin.currentUserAsync();
        console.log(user);
        this.setState({user});
      }
      catch(err) {
        console.log("Play services error", err.code, err.message);
      }
    }

    _signOut(){
      GoogleSignin.signOut()
      .then(() => {
        console.log('out');
      })
      .catch((err) => {

      });
    }

    _signIn() {
      GoogleSignin.signIn()
      .then((user) => {
        console.log(user);
        this.setState({user: user});
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
    }

    render(){
      return (
        <ScrollView>
          <View>
            <View style={[signinStyles.signinContent]}>
              <GoogleSigninButton
                style={{width: 260, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => this._signIn() }/>

            </View>
            <View style={{height:500,}}>
              <Transition>
                <SigninForm
                  SigninServer={this.props.SigninServer}
                  onSwitch={(e) => this.onSwitch(e)} />
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
}

function mapDispatchToProps(dispatch){
  return {
    SigninServer: (userData) => dispatch(SigninServer(userData)),
    SignupServer: (userData) => dispatch(SignupServer(userData)),
  }
}

export default connect(null, mapDispatchToProps)(Signin)
