import React from 'react';
import { StackNavigator } from 'react-navigation';

import Welcome from '../Welcome'
import Tutorial from '../Tutorial'

export const Root = StackNavigator({
  Welcome: {
    screen: Welcome,
  },
  Tutorial: {
    screen: Tutorial,
  },
},
{
  headerMode: 'none',
});
