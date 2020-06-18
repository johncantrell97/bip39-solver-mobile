import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {  Platform, StyleSheet, Text, View, RefreshControl, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';

const SERVER_URL = "http://localhost:3000";
const SHARED_SECRET = "secret";

export default function StatusScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [state, setState] = React.useState({
    words: [], 
    total: 0, 
    current: 0, 
    hours_left: 0, 
    percent_complete: 0, 
    completed_last_hour: 0, 
    batch_size: 0
  });

  React.useEffect(()=>{
    axios.get(`${SERVER_URL}/status?secret=${SHARED_SECRET}`).then(function(response){
      setState(response.data);
    })
  },[])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    axios.get(`${SERVER_URL}/status?secret=${SHARED_SECRET}`).then(function(response){
      setState(response.data);
      setRefreshing(false)
    })
  }, [refreshing]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.percentage}>
            {state.percent_complete}%  
          </Text>
          <Text style={styles.progress}>
            {Intl.NumberFormat().format(state.current)} /  {Intl.NumberFormat().format(state.total)}
          </Text>
          <View style={styles.details}>
            <Text style={styles.rateText}>
              At the current rate of <Text style={styles.batchSize}>{Intl.NumberFormat().format(state.completed_last_hour)}</Text> guesses per hour it should take at most <Text style={styles.batchSize}>{Intl.NumberFormat().format(state.hours_left)}</Text> hours to find the key.
            </Text>
            <Text style={styles.detailsText}>
              Working with <Text style={styles.batchSize}>{Intl.NumberFormat().format(state.batch_size)}</Text> items per batch.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

StatusScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240,240,240)',
   },
  percentage: {
    fontSize: 84
  },
  progress: {
    fontSize: 14
  },
  details: {
    padding: 25,
    marginTop: 50
  },
  detailsText: {
    fontSize: 16
  },
  rateText: {
    fontSize: 16,
    marginBottom: 25
  },
  batchSize: {
    fontWeight: "700",
    fontSize: 18
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  StatusScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
