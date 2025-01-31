import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View,Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";


const PhotosList = () =>{

const [PhotosData,setPhotosData]= useState('')

const route = useRoute();
  const { galleryId, PhtosName } = route.params;
  console.log('galleryId:', galleryId); 
  console.log('PhtosName:', PhtosName); 

const navigation = useNavigation()

// console.log('Photos data:', PhotosData);

    const fetchPhotosList = async () => {
        try {
          const response = await fetch(`https://cricketwicket.biz/api/v1/photos/gallery/?galleryId=${galleryId}`);
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const photosData = await response.json();
          
          setPhotosData(photosData.photoGalleryDetails)



         
          
        
          
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


     


      const renderItem = ({ item }) => (
        <View style={{margin:2}}>

<TouchableOpacity onPress={()=>navigation.navigate('PhotosView',{imageId:item.imageId, caption:item.caption})}>
     <Image
      source={{ uri: getImageUrl(item.imageId) }}
      style={styles.imageBackground}
      imageStyle={styles.imageStyle}
        />
          </TouchableOpacity>

     </View>
      );



    return (

        <View style={{ flex: 1,}}>
        <FlatList
        data={PhotosData}
        numColumns={3} // Set numColumns as needed
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      </View>
    )
}
const styles = StyleSheet.create({
    imageBackground: {
      width:120,
      height: 120,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageStyle: {
      resizeMode: 'cover',
    },
   
   
   
  
  });
  
export default PhotosList;