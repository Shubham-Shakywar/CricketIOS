import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View,Text, FlatList,ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
const Photos = () =>{
const [PhotosData,setPhotosData]= useState('')

const navigation = useNavigation()

// console.log('Photos data:', PhotosData);

    const fetchPhotosList = async () => {
        try {
          const response = await fetch('https://cricketwicket.biz/api/v1/photos/list');
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const photosData = await response.json();
          const { photoGalleryInfoList } = photosData;

          const filteredData = photoGalleryInfoList.filter(item => item.photoGalleryInfo);
          setPhotosData(filteredData)



         
          
        
          
        } catch (error) {
          console.error('Error fetching photos list:', error);
          
        }
      };
      

      useEffect(()=>{
        fetchPhotosList()
      },[])

      const getImageUrl = (imageId) => {
        return `https://static.cricbuzz.com/a/img/v1/i1/c${imageId}/i.jpg`; // Adjust the URL pattern based on your server
      };


      const formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp, 10));
        
        const options = { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        };
        
        return new Intl.DateTimeFormat('en-US', options).format(date);
      };
      


      const renderItem = ({ item }) => (
        <View style={{ marginVertical: 5,backgroundColor:'#fff'   }}>


            
<TouchableOpacity onPress={()=>navigation.navigate('PhotosList',{galleryId:item.photoGalleryInfo.galleryId, PhtosName:item.photoGalleryInfo.headline})}>
        <ImageBackground
      source={{ uri: getImageUrl(item.photoGalleryInfo.imageId) }}
      style={styles.imageBackground}
      imageStyle={styles.imageStyle}
    ></ImageBackground>

</TouchableOpacity>

    <View style={{paddingHorizontal:10,marginVertical:5}}>
          <Text style={{ fontSize: 16,color:'black' }}>{item.photoGalleryInfo.headline}</Text>
         
          
          <Text style={{ fontSize: 14,color:'#808080',  marginVertical:5}}> {formatDate(item.photoGalleryInfo.publishedTime)}</Text>
          </View>
     </View>
      );



    return (

        <View style={{ flex: 1,backgroundColor:'#4fa8b9' }}>
        <FlatList
          data={PhotosData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
}
const styles = StyleSheet.create({
    imageBackground: {
      width: '100%',
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageStyle: {
      resizeMode: 'cover',
    },
    imageOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
      padding: 10,
    },
    headline: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
    },
    galleryId: {
      color: '#fff',
    },
    publishedTime: {
      color: '#fff',
    },
  });
  
export default Photos;