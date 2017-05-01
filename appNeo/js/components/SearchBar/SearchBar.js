import React from 'react'
import { View,
         Text,
         StyleSheet,
         TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchBar = () => {
  return (
    <View style={[styles.searchBar]}>
      <View style={styles.searchBg}></View>
      <View style={[styles.searchInputWrapper]}>
        <View style={styles.searchInputContent}>
          <Icon
            style={styles.searchIcon}
            name="search"
            color="gray"
            size={24} />
          <TextInput
            underlineColorAndroid={'rgba(0,0,0,0)'}
            placeholder={'Buscar Spot Fotovoltaico'}
            style={[styles.searchInput]} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchBar: {
    height: 50,
    overflow: 'visible',
    marginBottom: 4,
  },
  searchBg:{
    backgroundColor: 'gray',
    height: 50,
    zIndex: 1,
  },
  searchInputWrapper: {
    marginTop: 16,
    width: '100%',
    position: 'absolute',
    paddingRight: 16,
    paddingLeft: 16,
  },
  searchInputContent:{
    zIndex: 2,
    height: 40,
    elevation: 3,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '20%',
    paddingRight: 16,
    zIndex: 2
  },
  searchIcon:{
    zIndex: 1,
    position: 'absolute',
    left: 16,
  },
});


export default SearchBar;
