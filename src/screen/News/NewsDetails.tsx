/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  ScrollView,
  Share,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {moderateScale} from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';




const NewsDetails = () => {
  const [newsData, setNewsData] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigation = useNavigation()
console.log("newsData------------------->",newsData)
  // Sample route parameter extraction
  const route = useRoute();
  const { Newsid } = route.params;

  // Function to fetch news details by ID
  const fetchNewsDetails = async () => {
    setSubmitLoading(true);
    try {
      const response = await fetch(`https://cricketwicket.biz/api/v1/news/detail/?newsId=${Newsid}`);
      const data = await response.json();
      setNewsData(data);
    } catch (error) {
      console.error('Error fetching news details:', error);
    }
    setSubmitLoading(false);
  };

  // Fetch news details on component mount
  useEffect(() => {
    fetchNewsDetails();
  }, []);

  // Function to calculate time difference
  const getTimeDifference = (pubTime) => {
    const currentTime = new Date().getTime();
    const newsTime = parseInt(pubTime);
    const difference = currentTime - newsTime;
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  // Function to get image URL
  const getImageUrl = (imageId) => {
    return `https://static.cricbuzz.com/a/img/v1/i1/c${imageId}/i.jpg`;
  };

  // Render function for each item in FlatList
  const renderContentItem = ({ item }) => {
    console.log("item----------------------->",item)
    if (item.ad) {
      return null; 
    }
    if (item.content && item.content.contentType === 'text') {
      return (
        <Text style={{ marginVertical: 10, marginLeft: 10, fontSize: 14, color:'#696969' }}>
          {item.content.contentValue} 
        </Text>
      );
    }
    return null; // Handle other content types if necessary
  };

  // Rendering function for FlatList
  const renderNewsDetails = () => {
    if (submitLoading || !newsData) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      );
    }

    return (
      <FlatList
        data={newsData.content}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderContentItem}
        ListHeaderComponent={() => (
          <View>

            <View>
           
            <ImageBackground
              source={{ uri: getImageUrl(newsData.coverImage.id) }}
               style={ {width: '100%', height: undefined, aspectRatio: 1.5 }} 
                  resizeMode='cover'
            >


          <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:10}}>
         <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Image source={require('../../../assets/icons8-back-50.png')}
            
            style={{height:30,width:30,tintColor: '#fff',}}
            />

           </TouchableOpacity>

           <TouchableOpacity>
           <Image source={require('../../../assets/icons8-share-50.png')}
            
            style={{height:30,width:30,tintColor: '#fff',}}
            />

            </TouchableOpacity>

            </View>

            </ImageBackground>

             </View>
            <Text style={{ fontSize: 20, color:'black', fontWeight: 'bold', margin: 10 }}>
              {newsData.headline}
            </Text>
            <Text style={{ fontSize: 14, color: '#808080', marginLeft: 10 }}>
              {getTimeDifference(newsData.publishTime)}
            </Text>
          </View>
        )}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {renderNewsDetails()}
    </View>
  );

};

const styles = StyleSheet.create({
 
});

export default NewsDetails;
