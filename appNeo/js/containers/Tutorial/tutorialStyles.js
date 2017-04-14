import { StyleSheet } from 'react-native'

export const tutorialStyles = StyleSheet.create({
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
    lineHeight: 24,
    paddingLeft: 16,
    paddingRight: 16,
  },
  tutorialButton: {
    flex: 2,
  },
});
