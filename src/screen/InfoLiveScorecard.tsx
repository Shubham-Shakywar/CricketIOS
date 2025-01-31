import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text,TouchableOpacity,Image,ScrollView,FlatList,ActivityIndicator,RefreshControl, ImageBackground } from "react-native";



const Tab = createMaterialTopTabNavigator();




function INFO() {
  const route= useRoute()


  const {matchid} = route.params

  console.log('matchid>>>>>>>>>',matchid);


  const navigation = useNavigation ()

  const [SeriesMatch, setSeriesMatch] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const TopStoryData = async () => {
    setSubmitLoading(true);
    try {
      const token = await AsyncStorage.getItem("loginToken");
      const response = await fetch(`https://cricketwicket.biz/api/v1/matches/info/?matchId=${matchid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const Data = await response.json();
      setSeriesMatch(Data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    TopStoryData();
  }, []);

  const getImageUrl = (imageId) => {
    return `https://static.cricbuzz.com/a/img/v1/i1/c${imageId}/i.jpg`; // Adjust the URL pattern based on your server
  };

  const renderMatchInfo = (matchInfo) => {
    if (!matchInfo) return null;
  
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',  // Full name of the day
        day: '2-digit',   // 2-digit day
        month: 'long'     // Full name of the month
      });
    };
  
    // Function to format timestamp to readable time (HH:MM AM/PM)
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${hours}:${minutes} ${ampm}`;
    };


    const splitSeriesName = (name) => {
      const words = name.split(' ');
      const firstLine = words.slice(0, 7).join(' '); // Adjust number of words as needed
      const secondLine = words.slice(7).join(' ');
      return { firstLine, secondLine };
    };
  
    const { firstLine, secondLine } = splitSeriesName(matchInfo.series.name);
  
 
  
    return (
      <View>

<TouchableOpacity onPress={() => navigation.navigate('SQUADS')}>
        <View style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#fff'}}>

       
            <Text style={{ marginHorizontal: 10, marginVertical: 10, fontSize: 16, color: 'black' }}>
              SQUADS
            </Text>
         
          <Image style={{height:10,width:10, marginRight:10, alignSelf:'center'}} source={require('../../assets/rightarrow.png')}/>
        </View>
        </TouchableOpacity>
  
        <Text style={{color:'black',marginHorizontal:10,marginVertical:10,fontWeight:'500'}}>INFO</Text>
  
        <View style={{flexDirection:'row', backgroundColor:'#fff',paddingBottom:10}}>
  
          <View style={{flexDirection:'column', marginHorizontal:10}}>
            <Text style={{color:'#808080',marginTop: 10}}>Match  </Text>
            <Text style={{color:'#808080',marginTop: 10}}>Series </Text>
            <Text style={{color:'#808080',marginTop: 26}}>Date </Text>
            <Text style={{color:'#808080',marginTop: 10}}>Time </Text>
            <Text style={{color:'#808080',marginTop: 10}}>Toss </Text>
            <Text style={{color:'#808080',marginTop: 10}}>Venue </Text>
            <Text style={{color:'#808080',marginTop: 10}}>Umpires </Text>
            <Text style={{color:'#808080',marginTop: 10}}>Referee </Text>
          </View>
  
          <View>
            <Text style={{color:'black',marginTop: 10}}>{matchInfo.matchDescription} </Text>
            <Text style={{ color: 'black', marginTop: 10 }}>
            {firstLine}
            {'\n'}
            <Text>{secondLine}</Text>
          </Text>
            <Text style={{color:'black',marginTop: 10}}>{formatDate(matchInfo.matchStartTimestamp)}</Text>
            <Text style={{color:'black',marginTop: 10}}>{formatTime(matchInfo.matchStartTimestamp)},Your Time</Text>
            <Text style={{color:'black',marginTop: 10}}>{matchInfo.tossResults.tossWinnerName} opt to {matchInfo.tossResults.decision} </Text>
            <Text style={{color:'black',marginTop: 10}}>{matchInfo.venue.name}  {matchInfo.venue.city} </Text>
            <Text style={{color:'black',marginTop: 10}}>{matchInfo.umpire1.name}, {matchInfo.umpire2.name}, {matchInfo.umpire3.name} </Text>
            <Text style={{color:'black',marginTop: 10}}>{matchInfo.referee.name} </Text>
          </View>
  
        </View>
        <Text style={{marginHorizontal:10,marginVertical:10,color:'black',fontWeight:'500'}}>VENUE GUIDE</Text>

        <View style={{flexDirection:'row', backgroundColor:'#fff'}}>
  
  <View style={{flexDirection:'column', marginHorizontal:10}}>
    <Text style={{color:'#808080',marginVertical:10}}>Stadium </Text>
    <Text style={{color:'#808080',marginVertical:10}}>city </Text>
   </View>

  <View>
   
  
    <Text style={{color:'black',marginVertical:10}}>{matchInfo.venue.name}  </Text>
    
    <Text style={{color:'black',marginVertical:10}}> {matchInfo.venue.city} </Text>
  </View>

</View>

      </View>
    );
  };
  
  

  return (
    <ScrollView style={{ backgroundColor: '#4fa8b9' }}>
      {submitLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      ) : (
        <FlatList
          data={SeriesMatch ? [SeriesMatch] : []}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          renderItem={({ item }) => renderMatchInfo(item.matchInfo)}
        />
       )}
    </ScrollView>
  );
}



function LIVE() {
 
  
  
  const route = useRoute();
  const { matchid } = route.params;

  const [seriesMatch, setSeriesMatch] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const topStoryData = async () => {
    setSubmitLoading(true);
    try {
      const token = await AsyncStorage.getItem("loginToken");
      const response = await fetch(`https://cricketwicket.biz/api/v1/matches/commentaries/?matchId=${matchid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      setSeriesMatch([data]); // Wrap the object in an array
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    topStoryData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    topStoryData();
    setRefreshing(false);
  };

  const getImageUrl = (imageId) => {
    return `https://static.cricbuzz.com/a/img/v1/i1/c${imageId}/i.jpg`; // Adjust the URL pattern based on your server
  };

  const renderMatchInfo = ({ item }) => {
    const matchDescription = item?.matchHeader?.matchDescription || 'No match description available';
    const matchStatus = item?.matchHeader?.status || 'No status available';
    const seriesDesc = item?.matchHeader?.seriesDesc || 'No series description available';
  
    const batTeamName = item?.miniscore?.batTeam?.teamName || 'N/A';
    const batTeamScore = item?.miniscore?.batTeam?.teamScore || 0;
    const batTeamWkts = item?.miniscore?.batTeam?.teamWkts || 0;
    const currentRunRate = item?.miniscore?.currentRunRate || 'N/A';
  
    const commentaryList = item?.commentaryList || [];
    const inningsScoreList = item?.miniscore?.matchScoreDetails?.inningsScoreList || [];
    const playersOfTheMatch = item?.matchHeader?.playersOfTheMatch || [];
    const matchVideos = item?.matchVideos || [];
    const commentarySnippetList = item?.commentarySnippetList || [];
  
    return (
      <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Match Information:</Text>
          {inningsScoreList.map((innings, index) => (
            <View key={index}>
              <Text style={{ color: 'black', fontSize: 18, margin: 5 }}>{`${innings.batTeamName} - ${innings.score}-${innings.wickets}  (${innings.overs}) `}</Text>
            </View>
          ))}
          <Text style={{ color: '#1e90ff', fontSize: 16, marginVertical: 5 }}>{matchStatus}</Text>
        </View>
  
        <View>
          <Text style={{ fontSize: 16, color: '#808080' }}>Player of the Match</Text>
          {playersOfTheMatch.length > 0 ? (
            playersOfTheMatch.map((player, index) => (
              <View style={{ flexDirection: 'row', marginVertical: 10 }} key={index}>
                <Image
                  source={{ uri: getImageUrl(player.faceImageId) }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <Text style={{ color: 'black', fontSize: 18, alignSelf: 'center', marginLeft: 10 }}>{player.fullName}</Text>
              </View>
            ))
          ) : null}
        </View>
  
        {/* <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Match Videos:</Text>
          {matchVideos.length > 0 ? (
            matchVideos.map((video, index) => (
              <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Image
                  source={{ uri: getImageUrl(video.imageId) }}
                  style={{ width: 80, height: 45, borderRadius: 5 }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ color: 'black', fontSize: 16 }}>{video.headline}</Text>
                  <TouchableOpacity onPress={() => Linking.openURL(video.videoUrl)}>
                    <Text style={{ color: '#1e90ff', fontSize: 14 }}>Watch Video</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ color: 'gray', fontSize: 14 }}>No match videos available</Text>
          )}
        </View> */}


        <View>
  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Match Videos:</Text>
  {commentarySnippetList.length > 0 ? (
    <View style={{ flexDirection: 'column', marginVertical: 5 }}>
      <ImageBackground
    source={{ uri: getImageUrl(commentarySnippetList[0].imageId) }}
    style={{ width: '100%', height: 200, borderRadius: 5, overflow: 'hidden' }}
  >
    <View style={{ 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      padding: 10 
    }}>
      <Text style={{ color: '#fff', fontSize: 16 }}>
        {commentarySnippetList[0].headline}
      </Text>
    </View>
  </ImageBackground>
    </View>
  ) : (
   null
  )}
</View>

  
        <View>
          {commentaryList.map((commentary, index) => {
            const commTextLines = commentary.commText.split('\\n').map(line => line.replace(/^B0\$\s*/, ''));
  
            return (
              <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
                {commentary?.commentaryFormats?.bold?.formatValue ? (
                  <Text style={{ fontWeight: 'bold', marginBottom: 5, color: 'black' }}>
                    {commentary.commentaryFormats.bold.formatValue[0]}{' '}
                    {commTextLines.map((line, lineIndex) => (
                      <Text key={lineIndex} style={{ color: 'black', fontWeight: '400' }}>
                        {line} {lineIndex < commTextLines.length - 1 ? '\n' : ''} {/* Add newline character between lines */}
                      </Text>
                    ))}
                  </Text>
                ) : (
                  commTextLines.map((line, lineIndex) => (
                    <Text key={lineIndex} style={{ color: 'black' }}>
                      {line} {lineIndex < commTextLines.length - 1 ? '\n' : ''} {/* Add newline character between lines */}
                    </Text>
                  ))
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  
  
  

  return (
    <ScrollView
      style={{ backgroundColor:'#fff' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {submitLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      ) : (
        <FlatList
          data={seriesMatch}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderMatchInfo}
        />
      )}
    </ScrollView>
  );

  
  
}


function SCROECARD() {

   
  const route = useRoute()
  const {matchid,} = route.params

 


  const navigation = useNavigation ()

  const [SeriesMatch, setSeriesMatch] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showHelloTextNamibia, setShowHelloTextNamibia] = useState(false); 
    const [showHelloTextAustralia, setShowHelloTextAustralia] = useState(false);
    const [showHelloTextindia, setshowHelloTextindia] = useState(false); 
    const [showHelloTextAus, setshowHelloTextAus] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedInnings, setExpandedInnings] = useState({});

  const TopStoryData = async () => {
    setSubmitLoading(true);
    try {
      const token = await AsyncStorage.getItem("loginToken");
      const response = await fetch(`https://cricketwicket.biz/api/v1/matches/scard/?matchId=${matchid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const Data = await response.json();

      console.log('hello>>>>>>>>>',Data);

      setSeriesMatch(Data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    TopStoryData();
  }, []);

  const getImageUrl = (imageId) => {
    return `https://static.cricbuzz.com/a/img/v1/i1/c${imageId}/i.jpg`; // Adjust the URL pattern based on your server
  };


  const handleRefresh = () => {
    setRefreshing(true);
    // Fetch data again
    TopStoryData();
    setRefreshing(false);
  };


  const renderPlayerStats = (item) => {

    
    
   
    const batTeamName = item.batTeamDetails.batTeamName;
    
    const teamid = item.inningsId;

    console.log('batTeamid>>>>>>>',teamid);
    

     const runsScored = item.scoreDetails.runs;
    const wicketsLost = item.scoreDetails.wickets;
    const batTeamOvers = item.scoreDetails.overs;
   
    const toggleHelloTextNamibia = () => {
      setShowHelloTextNamibia(!showHelloTextNamibia);
      setShowHelloTextAustralia(false); // Hide Australia team data
  };

  // Function to toggle Australia team data
  const toggleHelloTextAustralia = () => {
      setShowHelloTextAustralia(!showHelloTextAustralia);
      setShowHelloTextNamibia(false); // Hide Namibia team data
  };




  const toggleHelloTextindia = () => {
    setshowHelloTextindia(!showHelloTextindia);
    setshowHelloTextAus(false); // Hide Australia team data
};

// Function to toggle Australia team data
const toggleHelloTextAu = () => {
  setshowHelloTextAus(!showHelloTextAus);
  setshowHelloTextindia(false); // Hide Namibia team data
};



 return (
        <View>
          
          {teamid === 1 || teamid === 2 ? (
    <TouchableOpacity onPress={teamid === 1 ? toggleHelloTextNamibia : toggleHelloTextAustralia}>
        <View style={{backgroundColor:'#fff', marginVertical:10}}>
            <View style={{flexDirection:'row',justifyContent:'space-between', marginHorizontal:10,marginVertical:10}}>
                <Text style={{fontSize:16, color:'black'}}>{batTeamName}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize:16, color:'black'}}>{runsScored}-{wicketsLost}  ({batTeamOvers.toFixed(1)})</Text>
                    {teamid === 1 ? (showHelloTextNamibia ? <Image source={require('../../assets/uparrow.png')} style={{height:15,width:15,alignSelf:'center',marginLeft:5}}/> : <Image source={require('../../assets/downarrow.png')} style={{height:15,width:15,alignSelf:'center',marginLeft:5}}/>) : (showHelloTextAustralia ? <Image source={require('../../assets/uparrow.png')} style={{height:15,width:15,alignSelf:'center',marginLeft:5}}/> : <Image source={require('../../assets/downarrow.png')} style={{height:15,width:15,alignSelf:'center',marginLeft:5}}/>)}
                    
                </View>
            </View>
        </View>
    </TouchableOpacity>
) : null}

{teamid === 3 || teamid === 4 ? (
    <TouchableOpacity onPress={teamid === 3 ? toggleHelloTextindia : toggleHelloTextAu}>
        <View style={{backgroundColor:'#fff', marginVertical:10}}>
            <View style={{flexDirection:'row',justifyContent:'space-between', marginHorizontal:10,marginVertical:10}}>
                <Text style={{fontSize:16, color:'black'}}>{batTeamName}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize:16, color:'black'}}>{runsScored}-{wicketsLost}  ({batTeamOvers.toFixed(1)})</Text>
                    {teamid === 3 ? (showHelloTextindia ? <Image source={require('../../assets/uparrow.png')} style={{height:15,width:15,alignSelf:'center',marginLeft:5}}/> : <Image source={require('../../assets/downarrow.png')} style={{height:15,width:15,alignSelf:'center',marginLeft:5}}/>) : (showHelloTextAus ? <Image source={require('../../assets/uparrow.png')} style={{height:15,width:15,alignSelf:'center',marginLeft:5}}/> : <Image source={require('../../assets/downarrow.png')} style={{height:15,width:15,alignSelf:'center',marginLeft:5}}/>)}
                </View>
            </View>
        </View>
    </TouchableOpacity>
) : null}

            {teamid === 1 && showHelloTextNamibia &&   
            <View style={{backgroundColor:'#afeeee'}}>
               <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',width:'40%',}}>Batter</Text>
              <Text style={{color:'black',width:'12%'}}>R</Text>
              <Text style={{color:'black',width:'12%'}}>B</Text>
              <Text style={{color:'black',width:'12%'}}>4S</Text>
              <Text style={{color:'black',width:'12%'}}>6s</Text>
              <Text style={{color:'black',width:'12%'}}>SR</Text>
              </View>


              <View>
  {Object.keys(item.batTeamDetails.batsmenData).map((key) => {
    const batsman = item.batTeamDetails.batsmenData[key];
    if (batsman.runs !== 0 || batsman.balls !== 0 || batsman.strikeRate !== 0) {
      return (
        <View key={batsman.batId}>

          <View style={{backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>


              
              
              <Text style={{color:'black',width:'40%',}}>{batsman.batName}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.runs}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.balls}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.fours}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.sixes}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.strikeRate}</Text>
            </View>
          </View>

        </View>
      );
    } else {
      return null; // Do not render if runs, balls, and strikeRate are all zero
    }
  })}
</View>


<View style={{backgroundColor:'#fff'}}>
<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'48%',}}>Extras</Text>
            <Text style={{color:'black',width:'8%'}}>{item.extrasData.total}</Text>
            <Text style={{color:'black',width:'8%'}}>b {item.extrasData.byes}</Text>
            <Text style={{color:'black',width:'8%'}}>lb {item.extrasData.legByes}</Text>
            <Text style={{color:'black',width:'8%'}}>w {item.extrasData.wides}</Text>
            <Text style={{color:'black',width:'8%'}}>nb {item.extrasData.noBalls}</Text>
            <Text style={{color:'black',width:'8%'}}>p {item.extrasData.penalty}</Text>
            </View>


            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10,justifyContent:'space-between'}}>
            <Text style={{color:'black',}}>Total</Text>
            <Text style={{color:'black', marginRight:10}}>{item.scoreDetails.runs}-{item.scoreDetails.wickets} ({item.scoreDetails.overs.toFixed(1)})</Text>
            
            </View>

            </View>      

              

              <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',width:'40%',}}>Bowler</Text>
              <Text style={{color:'black',width:'12%'}}>O</Text>
              <Text style={{color:'black',width:'12%'}}>M</Text>
              <Text style={{color:'black',width:'12%'}}>R</Text>
              <Text style={{color:'black',width:'12%'}}>W</Text>
              <Text style={{color:'black',width:'12%'}}>ER</Text>
              </View>


              
              <View>
    {Object.keys(item.bowlTeamDetails.bowlersData).map((key) => {
        const batsman = item.bowlTeamDetails.bowlersData[key];
        return (
            <View key={batsman.bowlerId}>

              <View style={{backgroundColor:'#fff'}}>
               <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',width:'40%',}}>{batsman.bowlName}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.overs}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.maidens}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.runs}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.wickets}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.economy}</Text>
              </View>

              </View>
               </View>
        );
    })}

</View>

<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',width:'50%',}}>Fall of Wickets </Text>
              <Text style={{color:'black',width:'25%'}}>Score</Text>
              <Text style={{color:'black',width:'25%'}}>Over</Text>
             
              </View>

              <View>
    {Object.keys(item.wicketsData).map((key) => {
        const batsman = item.wicketsData[key];
        return (
            <View key={batsman.batId}>

              <View style={{backgroundColor:'#fff'}}>
               <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',width:'50%',}}>{batsman.batName}</Text>
              <Text style={{color:'black',width:'25%'}}>{batsman.wktRuns}-{batsman.wktNbr}</Text>
              <Text style={{color:'black',width:'25%'}}>{batsman.wktOver}</Text>
              
              </View>

              </View>



              

               </View>
        );
    })}

</View>


<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',width:'50%',}}>Powerplay</Text>
              <Text style={{color:'black',width:'25%'}}>Over</Text>
              <Text style={{color:'black',width:'25%'}}>Run</Text>
             
              </View>
              
              <View>
    {Object.keys(item.ppData).map((key) => {
        const batsman = item.ppData[key];
        return (
            <View key={batsman.ppId}>

              <View style={{backgroundColor:'#fff'}}>
               <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',width:'50%',}}>{batsman.ppType}</Text>
              <Text style={{color:'black',width:'25%'}}>{batsman.ppOversFrom}-{batsman.ppOversTo.toFixed(1)}</Text>
              <Text style={{color:'black',width:'25%'}}>{batsman.runsScored}</Text>
              
              </View>

              </View>



              

               </View>
        );
    })}

</View>




<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',}}>Partnerships</Text>
               </View>
              
              <View>
    {Object.keys(item.partnershipsData).map((key) => {
        const batsman = item.partnershipsData[key];
        return (
            <View key={batsman.bat1Id}>

              <View style={{backgroundColor:'#fff'}}>
               <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
               <Text style={{ color: 'black', width: '50%' }}>{batsman.bat1Name} {batsman.bat1Runs === 0 ? `(${batsman.bat1Runs.toFixed(1)})` : batsman.bat1Runs}</Text>
            <Text style={{color:'black',width:'20%'}}>{batsman.totalRuns}({batsman.totalBalls})</Text>

            <Text style={{color:'black',width:'30%'}}>{batsman.bat2Name} {batsman.bat2Runs === 0 ? `(${batsman.bat2Runs.toFixed(1)})` : batsman.bat2Runs}</Text>
              
              </View>

              </View>



              

               </View>
        );
    })}

</View>


              </View>}
            {teamid === 2 && showHelloTextAustralia && 
             <View style={{backgroundColor:'#afeeee'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'40%',}}>Batter</Text>
            <Text style={{color:'black',width:'12%'}}>R</Text>
            <Text style={{color:'black',width:'12%'}}>B</Text>
            <Text style={{color:'black',width:'12%'}}>4S</Text>
            <Text style={{color:'black',width:'12%'}}>6s</Text>
            <Text style={{color:'black',width:'12%'}}>SR</Text>
            </View>


            <View>
  {Object.keys(item.batTeamDetails.batsmenData).map((key) => {
    const batsman = item.batTeamDetails.batsmenData[key];
    if (batsman.runs !== 0 || batsman.balls !== 0 || batsman.strikeRate !== 0) {
      return (
        <View key={batsman.batId}>
          <View style={{backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',width:'40%'}}>{batsman.batName}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.runs}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.balls}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.fours}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.sixes}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.strikeRate}</Text>

            </View>
          </View>
        </View>
      );
    } else {
      return null; // Do not render if runs, balls, and strikeRate are all zero
    }
  })}

</View>



<View style={{backgroundColor:'#fff'}}>
<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'48%',}}>Extras</Text>
            <Text style={{color:'black',width:'8%'}}>{item.extrasData.total}</Text>
            <Text style={{color:'black',width:'8%'}}>b {item.extrasData.byes}</Text>
            <Text style={{color:'black',width:'8%'}}>lb {item.extrasData.legByes}</Text>
            <Text style={{color:'black',width:'8%'}}>w {item.extrasData.wides}</Text>
            <Text style={{color:'black',width:'8%'}}>nb {item.extrasData.noBalls}</Text>
            <Text style={{color:'black',width:'8%'}}>p {item.extrasData.penalty}</Text>
            </View>


            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10,justifyContent:'space-between'}}>
            <Text style={{color:'black',}}>Total</Text>
            <Text style={{color:'black', marginRight:10}}>{item.scoreDetails.runs}-{item.scoreDetails.wickets} ({item.scoreDetails.overs.toFixed(1)})</Text>
            
            </View>

            </View>      

            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'40%',}}>Bowler</Text>
            <Text style={{color:'black',width:'12%'}}>O</Text>
            <Text style={{color:'black',width:'12%'}}>M</Text>
            <Text style={{color:'black',width:'12%'}}>R</Text>
            <Text style={{color:'black',width:'12%'}}>W</Text>
            <Text style={{color:'black',width:'12%'}}>ER</Text>
            </View>


            
            <View>
  {Object.keys(item.bowlTeamDetails.bowlersData).map((key) => {

      const batsman = item.bowlTeamDetails.bowlersData[key];
      return (
          <View key={batsman.bowlerId}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'40%',}}>{batsman.bowlName}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.overs}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.maidens}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.runs}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.wickets}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.economy}</Text>
            </View>

            </View>
             </View>
      );
  })}

</View>

<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>Fall of Wickets </Text>
            <Text style={{color:'black',width:'25%'}}>Score</Text>
            <Text style={{color:'black',width:'25%'}}>Over</Text>
           
            </View>

            <View>
  {Object.keys(item.wicketsData).map((key) => {
      const batsman = item.wicketsData[key];
      return (
          <View key={batsman.batId}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>{batsman.batName}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.wktRuns}-{batsman.wktNbr}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.wktOver}</Text>
            
            </View>

            </View>



            

             </View>
      );
  })}

</View>


<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>Powerplay</Text>
            <Text style={{color:'black',width:'25%'}}>Over</Text>
            <Text style={{color:'black',width:'25%'}}>Run</Text>
           
            </View>
            
            <View>
  {Object.keys(item.ppData).map((key) => {
      const batsman = item.ppData[key];
      return (
          <View key={batsman.ppId}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>{batsman.ppType}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.ppOversFrom}-{batsman.ppOversTo.toFixed(1)}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.runsScored}</Text>
            
            </View>

            </View>



            

             </View>
      );
  })}

</View>




<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',}}>Partnerships</Text>
             </View>
            
            <View>
  {Object.keys(item.partnershipsData).map((key) => {
      const batsman = item.partnershipsData[key];
      return (
          <View key={batsman.bat1Id}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
             <Text style={{ color: 'black', width: '50%' }}>{batsman.bat1Name} {batsman.bat1Runs === 0 ? `(${batsman.bat1Runs.toFixed(1)})` : batsman.bat1Runs}</Text>
          <Text style={{color:'black',width:'20%'}}>{batsman.totalRuns}({batsman.totalBalls})</Text>

          <Text style={{color:'black',width:'30%'}}>{batsman.bat2Name} {batsman.bat2Runs === 0 ? `(${batsman.bat2Runs.toFixed(1)})` : batsman.bat2Runs}</Text>
            
            </View>

            </View>



            

             </View>
      );
  })}

</View>


            </View>}



            {teamid === 3 && showHelloTextindia && 
             <View style={{backgroundColor:'#afeeee'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'40%',}}>Batter</Text>
            <Text style={{color:'black',width:'12%'}}>R</Text>
            <Text style={{color:'black',width:'12%'}}>B</Text>
            <Text style={{color:'black',width:'12%'}}>4S</Text>
            <Text style={{color:'black',width:'12%'}}>6s</Text>
            <Text style={{color:'black',width:'12%'}}>SR</Text>
            </View>


            <View>
  {Object.keys(item.batTeamDetails.batsmenData).map((key) => {
    const batsman = item.batTeamDetails.batsmenData[key];
    if (batsman.runs !== 0 || batsman.balls !== 0 || batsman.strikeRate !== 0) {
      return (
        <View key={batsman.batId}>
          <View style={{backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',width:'40%'}}>{batsman.batName}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.runs}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.balls}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.fours}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.sixes}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.strikeRate}</Text>

            </View>
          </View>
        </View>
      );
    } else {
      return null; // Do not render if runs, balls, and strikeRate are all zero
    }
  })}

</View>



<View style={{backgroundColor:'#fff'}}>
<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'48%',}}>Extras</Text>
            <Text style={{color:'black',width:'8%'}}>{item.extrasData.total}</Text>
            <Text style={{color:'black',width:'8%'}}>b {item.extrasData.byes}</Text>
            <Text style={{color:'black',width:'8%'}}>lb {item.extrasData.legByes}</Text>
            <Text style={{color:'black',width:'8%'}}>w {item.extrasData.wides}</Text>
            <Text style={{color:'black',width:'8%'}}>nb {item.extrasData.noBalls}</Text>
            <Text style={{color:'black',width:'8%'}}>p {item.extrasData.penalty}</Text>
            </View>


            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10,justifyContent:'space-between'}}>
            <Text style={{color:'black',}}>Total</Text>
            <Text style={{color:'black', marginRight:10}}>{item.scoreDetails.runs}-{item.scoreDetails.wickets} ({item.scoreDetails.overs.toFixed(1)})</Text>
            
            </View>

            </View>      

            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'40%',}}>Bowler</Text>
            <Text style={{color:'black',width:'12%'}}>O</Text>
            <Text style={{color:'black',width:'12%'}}>M</Text>
            <Text style={{color:'black',width:'12%'}}>R</Text>
            <Text style={{color:'black',width:'12%'}}>W</Text>
            <Text style={{color:'black',width:'12%'}}>ER</Text>
            </View>


            
            <View>
  {Object.keys(item.bowlTeamDetails.bowlersData).map((key) => {

      const batsman = item.bowlTeamDetails.bowlersData[key];
      return (
          <View key={batsman.bowlerId}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'40%',}}>{batsman.bowlName}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.overs}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.maidens}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.runs}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.wickets}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.economy}</Text>
            </View>

            </View>
             </View>
      );
  })}

</View>

<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>Fall of Wickets </Text>
            <Text style={{color:'black',width:'25%'}}>Score</Text>
            <Text style={{color:'black',width:'25%'}}>Over</Text>
           
            </View>

            <View>
  {Object.keys(item.wicketsData).map((key) => {
      const batsman = item.wicketsData[key];
      return (
          <View key={batsman.batId}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>{batsman.batName}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.wktRuns}-{batsman.wktNbr}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.wktOver}</Text>
            
            </View>

            </View>



            

             </View>
      );
  })}

</View>


<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>Powerplay</Text>
            <Text style={{color:'black',width:'25%'}}>Over</Text>
            <Text style={{color:'black',width:'25%'}}>Run</Text>
           
            </View>
            
            <View>
  {Object.keys(item.ppData).map((key) => {
      const batsman = item.ppData[key];
      return (
          <View key={batsman.ppId}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>{batsman.ppType}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.ppOversFrom}-{batsman.ppOversTo.toFixed(1)}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.runsScored}</Text>
            
            </View>

            </View>



            

             </View>
      );
  })}

</View>




<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',}}>Partnerships</Text>
             </View>
            
            <View>
  {Object.keys(item.partnershipsData).map((key) => {
      const batsman = item.partnershipsData[key];
      return (
          <View key={batsman.bat1Id}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
             <Text style={{ color: 'black', width: '50%' }}>{batsman.bat1Name} {batsman.bat1Runs === 0 ? `(${batsman.bat1Runs.toFixed(1)})` : batsman.bat1Runs}</Text>
          <Text style={{color:'black',width:'20%'}}>{batsman.totalRuns}({batsman.totalBalls})</Text>

          <Text style={{color:'black',width:'30%'}}>{batsman.bat2Name} {batsman.bat2Runs === 0 ? `(${batsman.bat2Runs.toFixed(1)})` : batsman.bat2Runs}</Text>
            
            </View>

            </View>



            

             </View>
      );
  })}

</View>


            </View>}



            {teamid === 4 && showHelloTextAus && 
             <View style={{backgroundColor:'#afeeee'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'40%',}}>Batter</Text>
            <Text style={{color:'black',width:'12%'}}>R</Text>
            <Text style={{color:'black',width:'12%'}}>B</Text>
            <Text style={{color:'black',width:'12%'}}>4S</Text>
            <Text style={{color:'black',width:'12%'}}>6s</Text>
            <Text style={{color:'black',width:'12%'}}>SR</Text>
            </View>


            <View>
  {Object.keys(item.batTeamDetails.batsmenData).map((key) => {
    const batsman = item.batTeamDetails.batsmenData[key];
    if (batsman.runs !== 0 || batsman.balls !== 0 || batsman.strikeRate !== 0) {
      return (
        <View key={batsman.batId}>
          <View style={{backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
              <Text style={{color:'black',width:'40%'}}>{batsman.batName}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.runs}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.balls}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.fours}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.sixes}</Text>
              <Text style={{color:'black',width:'12%'}}>{batsman.strikeRate}</Text>

            </View>
          </View>
        </View>
      );
    } else {
      return null; 
    }
  })}

</View>



<View style={{backgroundColor:'#fff'}}>
<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'48%',}}>Extras</Text>
            <Text style={{color:'black',width:'8%'}}>{item.extrasData.total}</Text>
            <Text style={{color:'black',width:'8%'}}>b {item.extrasData.byes}</Text>
            <Text style={{color:'black',width:'8%'}}>lb {item.extrasData.legByes}</Text>
            <Text style={{color:'black',width:'8%'}}>w {item.extrasData.wides}</Text>
            <Text style={{color:'black',width:'8%'}}>nb {item.extrasData.noBalls}</Text>
            <Text style={{color:'black',width:'8%'}}>p {item.extrasData.penalty}</Text>
            </View>


            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10,justifyContent:'space-between'}}>
            <Text style={{color:'black',}}>Total</Text>
            <Text style={{color:'black', marginRight:10}}>{item.scoreDetails.runs}-{item.scoreDetails.wickets} ({item.scoreDetails.overs.toFixed(1)})</Text>
            
            </View>

            </View>      

            <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'40%',}}>Bowler</Text>
            <Text style={{color:'black',width:'12%'}}>O</Text>
            <Text style={{color:'black',width:'12%'}}>M</Text>
            <Text style={{color:'black',width:'12%'}}>R</Text>
            <Text style={{color:'black',width:'12%'}}>W</Text>
            <Text style={{color:'black',width:'12%'}}>ER</Text>
            </View>


            
            <View>
  {Object.keys(item.bowlTeamDetails.bowlersData).map((key) => {

      const batsman = item.bowlTeamDetails.bowlersData[key];
      return (
          <View key={batsman.bowlerId}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'40%',}}>{batsman.bowlName}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.overs}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.maidens}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.runs}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.wickets}</Text>
            <Text style={{color:'black',width:'12%'}}>{batsman.economy}</Text>
            </View>

            </View>
             </View>
      );
  })}

</View>

<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>Fall of Wickets </Text>
            <Text style={{color:'black',width:'25%'}}>Score</Text>
            <Text style={{color:'black',width:'25%'}}>Over</Text>
           
            </View>

            <View>
  {Object.keys(item.wicketsData).map((key) => {
      const batsman = item.wicketsData[key];
      return (
          <View key={batsman.batId}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>{batsman.batName}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.wktRuns}-{batsman.wktNbr}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.wktOver}</Text>
            
            </View>

            </View>



            

             </View>
      );
  })}

</View>


<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>Powerplay</Text>
            <Text style={{color:'black',width:'25%'}}>Over</Text>
            <Text style={{color:'black',width:'25%'}}>Run</Text>
           
            </View>
            
            <View>
  {Object.keys(item.ppData).map((key) => {
      const batsman = item.ppData[key];
      return (
          <View key={batsman.ppId}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',width:'50%',}}>{batsman.ppType}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.ppOversFrom}-{batsman.ppOversTo.toFixed(1)}</Text>
            <Text style={{color:'black',width:'25%'}}>{batsman.runsScored}</Text>
            
            </View>

            </View>



            

             </View>
      );
  })}

</View>




<View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
            <Text style={{color:'black',}}>Partnerships</Text>
             </View>
            
            <View>
  {Object.keys(item.partnershipsData).map((key) => {
      const batsman = item.partnershipsData[key];
      return (
          <View key={batsman.bat1Id}>

            <View style={{backgroundColor:'#fff'}}>
             <View style={{flexDirection:'row',marginHorizontal:10,marginVertical:10}}>
             <Text style={{ color: 'black', width: '50%' }}>{batsman.bat1Name} {batsman.bat1Runs === 0 ? `(${batsman.bat1Runs.toFixed(1)})` : batsman.bat1Runs}</Text>
          <Text style={{color:'black',width:'20%'}}>{batsman.totalRuns}({batsman.totalBalls})</Text>

          <Text style={{color:'black',width:'30%'}}>{batsman.bat2Name} {batsman.bat2Runs === 0 ? `(${batsman.bat2Runs.toFixed(1)})` : batsman.bat2Runs}</Text>
            
            </View>

            </View>



            

             </View>
      );
  })}

</View>


            </View>}
          
          
           
          
        </View>
    );
};




  
  

  return (
    <ScrollView
      style={{ backgroundColor: '#4fa8b9' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >




      {submitLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      ) : (
        <View>
         {SeriesMatch ? (
            <Text style={{ color: '#8b0000', fontWeight: '500', marginLeft: 10, fontSize: 16, marginVertical: 10 }}>
              {SeriesMatch.matchHeader.status}
            </Text>
          ) : null}
        <FlatList
          data={SeriesMatch ? SeriesMatch.scoreCard : []}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          renderItem={({ item }) => renderPlayerStats(item)}
        />
      </View>
      
       )}
    </ScrollView>
  );
}



function SQUADS() {
 
  const route= useRoute()


  const {matchid} = route.params

  // console.log('matchid>>>>>>>>>',matchid);


  const navigation = useNavigation ()

  const [SeriesMatch, setSeriesMatch] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const TopStoryData = async () => {
    setSubmitLoading(true);
    try {
      const token = await AsyncStorage.getItem("loginToken");
      const response = await fetch(`https://cricketwicket.biz/api/v1/matches/info/?matchId=${matchid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const Data = await response.json();
      console.log('Data>>>>>>',Data);
      setSeriesMatch(Data);
     
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    TopStoryData();
  }, []);

  const getImageUrl = (imageId) => {
    return `https://static.cricbuzz.com/a/img/v1/i1/c${imageId}/i.jpg`; // Adjust the URL pattern based on your server
  };

  const renderPlayerDetails = (team) => {
    return (
        <View style={{ flex: 1 }}>
            {team.playerDetails.map((player, index) => (

              <TouchableOpacity onPress={()=>navigation.navigate('PlyerDetails',{itemid:player.id, itemname:player.name})}>
                <View key={player.id}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <Image 
                            source={{ uri: getImageUrl(player.faceImageId) }} 
                            style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }} 
                        />
                        <Text style={{ color: 'black' }}>{player.name}</Text>
                    </View>
                    {/* Add a separator line between items */}
                    {index < team.playerDetails.length - 1 && (
                        <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 5 }} />
                    )}
                </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};




const renderMatchInfo = (matchInfo) => {
    if (!matchInfo) return null;

    return (
        <View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor:'#808080', marginVertical:10, }}>
                <Text style={{ color: 'black', fontWeight: '500', marginHorizontal:10,  marginVertical:5}}>{matchInfo.team1.name} Players</Text>
                <Text style={{ color: 'black', fontWeight: '500', marginHorizontal:10,marginVertical:5 }}>{matchInfo.team2.name} Players</Text>
            </View> 
            <Text style={{alignSelf:'center',marginVertical:10}}>Playing xi</Text>
          <View style={{ backgroundColor: '#fff',}}>

            
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' ,marginHorizontal:10}}>
                {renderPlayerDetails(matchInfo.team1)}
                {renderPlayerDetails(matchInfo.team2)}
            </View>

            </View>
        </View>
    );
};


  
  

  return (
    <ScrollView style={{ backgroundColor: '#4fa8b9' }}>


      {submitLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
        
      ) : (
        <FlatList
          data={SeriesMatch ? [SeriesMatch] : []}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          renderItem={({ item }) => renderMatchInfo(item.matchInfo)}
        />
        )}  
    </ScrollView>
  );
}





function OVERS() {
  
  const route = useRoute();
  const { matchid } = route.params;
  const navigation = useNavigation();
  const [SeriesMatch, setSeriesMatch] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const TopStoryData = async () => {
    setSubmitLoading(true);
    try {
      const token = await AsyncStorage.getItem("loginToken");
      const response = await fetch(`https://cricketwicket.biz/api/v1/matches/overs/?matchId=${matchid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const Data = await response.json();
      setSeriesMatch(Data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    TopStoryData();
  }, []);

  const getImageUrl = (imageId) => {
    return `https://static.cricbuzz.com/a/img/v1/i1/c${imageId}/i.jpg`; // Adjust the URL pattern based on your server
  };

  const renderMatchInfo = ({ item }) => {
    if (!item.overSummaryList || item.overSummaryList.length === 0) {
      return <Text style={{ color: 'black', alignSelf: 'center', marginVertical: 20 }}>No Data Available</Text>;
    }

    return (
      <View>
        {item.matchHeader?.playersOfTheMatch && (
          <View style={{ backgroundColor: '#fff', marginVertical: 2 }}>
            <Text style={{ color: '#808080', marginHorizontal: 10, fontSize: 17, marginVertical: 5 }}>PLAYER OF THE MATCH</Text>
            {item.matchHeader.playersOfTheMatch.map(player => (
              <View style={{ flexDirection: 'row', paddingBottom: 5 }} key={player.id}>
                <Image
                  source={{ uri: getImageUrl(player.faceImageId) }}
                  style={{ width: 40, height: 40, marginHorizontal: 10, borderRadius: 20 }}
                />
                <Text style={{ color: 'black', alignSelf: 'center', fontSize: 17 }}>{player.name}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ backgroundColor: '#fff' }}>
          {item.overSummaryList.map(over => (
            <View key={over.inningsId}>
              <View style={{ flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' }}>
                <View style={{ marginHorizontal: 10 }}>
                  <Text style={{ color: 'black' }}>{`Ov ${over.overNum}`}</Text>
                  <Text style={{ color: '#808080', alignSelf: 'center', marginVertical: 5 }}>{` ${over.runs} runs`}</Text>
                </View>
                <View style={{ flexDirection: 'column', width: '60%' }}>
                  <Text style={{ color: 'black' }}>
                    {over.bowlNames} to {over.batStrikerNames.length === 1 ? over.batStrikerNames : (
                      <>
                        {over.batStrikerNames.slice(0, -1).join(', ')} & {over.batStrikerNames.slice(-1)}
                      </>
                    )}
                  </Text>
                  <Text style={{ color: 'black', margin: 5 }}>{over.o_summary}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    if (!SeriesMatch) return null;
  
    const { matchScoreDetails, matchHeader, currentRunRate } = SeriesMatch;
  
    if (!matchScoreDetails || !matchScoreDetails.inningsScoreList || matchScoreDetails.inningsScoreList.length === 0) {
      return (
        <View style={{ padding: 10 }}>
          <Text style={{ color: 'black', fontSize: 18 }}>No score details available</Text>
        </View>
      );
    }
  
    const { inningsScoreList } = matchScoreDetails;
  
    return (
      <View style={{ backgroundColor: '#fff', padding: 10 }}>
        {inningsScoreList.map((innings, index) => {
          const fullOvers = Math.floor(innings.overs);
          const balls = Math.round((innings.overs - fullOvers) * 10);
  
          const displayOvers = balls >= 6 ? fullOvers + 1 : fullOvers;
          const displayBalls = balls < 6 ? `.${balls}` : '';
  
          return (
            <View key={index}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontSize: 18 }}>{innings.batTeamName}</Text>
                <Text style={{ color: 'black', fontSize: 18, marginLeft: 20 }}>{innings.score}-{innings.wickets}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>{` (${displayOvers}${displayBalls})`}</Text>
              </View>
            </View>
          );
        })}
        {matchHeader.state === "Complete" ? (
          <>
            <Text style={{ color: 'black', fontSize: 18 }}>{matchHeader.customStatus}</Text>
            <Text style={{ color: '#87ceeb', fontSize: 18 }}>{ `${SeriesMatch.status}`}</Text>
          </>
        ) : (
          <Text style={{ color: 'black', fontSize: 18 }}>{`Current Run Rate: ${currentRunRate}`}</Text>
        )}
      </View>
    );
  };
  
  
  
  return (
    <ScrollView style={{ backgroundColor: '#4fa8b9' }}>
      {submitLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      ) : (
        <FlatList
          data={SeriesMatch ? [SeriesMatch] : []}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          ListHeaderComponent={renderHeader}
          renderItem={renderMatchInfo}
        />
      )}
    </ScrollView>
  );
}



function HIGHLIGHTS() {
  const route= useRoute()


  const {matchid} = route.params

  // console.log('matchid>>>>>>>>>',team1Score);


  const navigation = useNavigation ()

  const [SeriesMatch, setSeriesMatch] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const TopStoryData = async () => {
    setSubmitLoading(true);
    try {
      const token = await AsyncStorage.getItem("loginToken");
      const response = await fetch(`https://cricketwicket.biz/api/v1/matches/overs/?matchId=${matchid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const Data = await response.json();
      setSeriesMatch(Data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    TopStoryData();
  }, []);

  const getImageUrl = (imageId) => {
    return `https://static.cricbuzz.com/a/img/v1/i1/c${imageId}/i.jpg`; // Adjust the URL pattern based on your server
  };

 


  const renderMatchInfo = ({ item }) => {
    // console.log('highlight>>>>>>>>', item);
  
    if (!item || !item.matchHeader || !item.miniscore) {
      return <Text  style={{alignSelf:'center', marginVertical:10}}>No data available</Text>;
    }
  
    return (
      <View>
        <View style={{ backgroundColor: '#fff' }}>
          {/* Display match details */}
          <Text style={{color:'black'}}>Match Description: {item.matchHeader.matchDescription}</Text>
          <Text>Match Type: {item.matchHeader.matchType}</Text>
          <Text>Match Format: {item.matchHeader.matchFormat}</Text>
          <Text>Match Status: {item.matchHeader.status}</Text>
          {/* Display miniscore details */}
          <Text>Batting Team: {item.miniscore.batTeam ? item.miniscore.batTeam.teamId : 'N/A'}</Text>
          <Text>Batting Team Score: {item.miniscore.batTeam ? `${item.miniscore.batTeam.teamScore}/${item.miniscore.batTeam.teamWkts}` : 'N/A'}</Text>
          <Text>Target: {item.miniscore.target}</Text>
          {/* Add more details as needed */}
        </View>
      </View>
    );
  };
  
  
  







  
  

  return (
    <ScrollView style={{ backgroundColor: '#4fa8b9' }}>




      {submitLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      ) : (
        <FlatList
        data={SeriesMatch ? [SeriesMatch] : []}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        renderItem={renderMatchInfo}/>
       )}  
    </ScrollView>
  );
} 





const InfoLiveScorecard = () =>{

  const route= useRoute()

  const {matchid,teamName1,teamName2,} = route.params


  

  return (
    <Tab.Navigator
tabBarOptions={{
labelStyle: { fontSize: 14, fontWeight: '600', color: '#fff' },
style: { backgroundColor: '#4fa8b9' },
indicatorStyle: { backgroundColor: '#fff' },
scrollEnabled: true, // Enable horizontal scrolling
}}
>
<Tab.Screen name="INFO" component={INFO} initialParams={{matchid,}} />
<Tab.Screen name="LIVE" component={LIVE} initialParams={{matchid,teamName1,teamName2,}} />
<Tab.Screen name="SCORECARD" component={SCROECARD} initialParams={{matchid,}}   />
<Tab.Screen name="SQUADS" component={SQUADS} initialParams={{matchid,}} />
<Tab.Screen name="OVERS" component={OVERS}  initialParams={{matchid,teamName1,teamName2,}} />
<Tab.Screen name="HIGHLIGHTS" component={HIGHLIGHTS} initialParams={{matchid}} />

</Tab.Navigator>

  
  );
}

export default InfoLiveScorecard;
