import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {API_URL} from '../consts/app-consts';
import RenderHTML from 'react-native-render-html';

export function DetailScreen({route}) {
  const id = route.params.id;
  const {width} = useWindowDimensions();
  const [cryptoProfile, setCryptoProfile] = useState();
  const [cryptoMarketData, setCryptoMarketData] = useState();
  const [cryptoDataLoaded, setCryptoDataLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/cryptos/market-data/${id}`),
      axios.get(`${API_URL}/cryptos/profile/${id}`),
    ]).then(([resMarketData, resProfile]) => {
      setCryptoMarketData(resMarketData.data);
      setCryptoProfile(resProfile.data);
      setCryptoDataLoaded(true);
    });
  }, []);

  return (
    <>
      {cryptoDataLoaded ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{cryptoProfile.name}</Text>
              <Text style={styles.symbol}>{cryptoProfile.symbol}</Text>
              <Text style={styles.price}>
                {`$ ${convert(cryptoMarketData.market_data.price_usd)}`}
              </Text>
            </View>
            <View style={styles.headerTagLine}>
              <Text style={styles.line}>
                {cryptoProfile.profile.general.overview.tagline}
              </Text>
            </View>
          </View>
          <View style={styles.priceChanges}>
            <View style={styles.priceChangeRow}>
              <Text style={styles.line}>Percentage Change 1h</Text>
              <Text style={styles.line}>{`% ${convert(
                cryptoMarketData.market_data.percent_change_usd_last_1_hour,
              )}`}</Text>
            </View>
            <View style={styles.priceChangeRow}>
              <Text style={styles.line}>Percentage Change 24hr</Text>
              <Text style={styles.line}>{`% ${convert(
                cryptoMarketData.market_data.percent_change_usd_last_24_hours,
              )}`}</Text>
            </View>
          </View>
          <ScrollView style={styles.cryptoInfo}>
            <View style={styles.cryptoInfoRow}>
              <Text style={styles.cryptoInfoTitle}>Overview</Text>

              <RenderHTML
                contentWidth={width}
                source={{
                  html: `<p style="color: #fff">${cryptoProfile.profile.general.overview.project_details}</p>`,
                }}
              />
            </View>
            <View style={styles.cryptoInfoRow}>
              <Text style={styles.cryptoInfoTitle}>Background</Text>

              <RenderHTML
                contentWidth={width}
                source={{
                  html: `<p style="color: #fff">${cryptoProfile.profile.general.background.background_details}</p>`,
                }}
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272d42',
    padding: 10,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  header: {
    backgroundColor: '#000',
    height: 100,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTagLine: {
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    color: '#fff',
  },
  symbol: {
    fontSize: 15,
    padding: 5,
    backgroundColor: '#272d42',
    color: '#fff',
  },
  price: {
    fontSize: 28,
    color: '#ffab00',
    width: 150,
    textAlign: 'right',
  },
  line: {
    color: '#fff',
    fontSize: 16,
  },
  priceChanges: {
    backgroundColor: '#000',
    height: 80,
    flexDirection: 'column',
    borderRadius: 10,
  },
  priceChangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  cryptoInfo: {
    backgroundColor: '#000',
    padding: 10,
    flex: 1,
    marginTop: 5,

    borderRadius: 10,
    marginBottom: 15,
  },
  cryptoInfoTitle: {
    color: '#ffab00',
    fontSize: 28,
  },
  cryptoInfoRow: {
    flex: 1,
  },
});

const convert = price => {
  return Math.round(price * 100) / 1000;
};
