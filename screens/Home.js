import {View, Text, Pressable, FlatList, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {socket} from '../App';

export function HomeScreen({navigation}) {
  const [cryptoList, setCryptoList] = useState([]);

  useEffect(() => {
    socket.on('crypto', data => {
      setCryptoList(data);
    });
  }, []);

  const renderItem = ({item}) => {
    return (
      <Pressable
        style={styles.crypto}
        onPress={() => openCryptoDetail(item.id)}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{Math.round(item.price * 100) / 1000}</Text>
      </Pressable>
    );
  };
  const openCryptoDetail = id => {
    navigation.navigate('Detail', {id: id});
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={cryptoList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#272d42',
    flex: 1,
    color: '#fff',
  },
  crypto: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#000',
    padding: 20,
    flex: 1,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: '#fff',
    fontSize: 24,
  },
  price: {
    color: '#ffab00',
    fontSize: 28,
  },
});
