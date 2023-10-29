import React, { useState, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import { Text, 
  ScrollView,
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Platform, 
  FlatList, 
  Button, 
  Dimensions,
  ActivityIndicator} from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Feather } from '@expo/vector-icons';
import Buttonn from '../../components/Buttonn'
import { TextInput } from 'react-native';
import { RNS3 } from 'react-native-aws3';
import axios from 'axios';

import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '../../src/aws-exports';
Amplify.configure(awsconfig);

import { FontAwesome } from '@expo/vector-icons'


import MainDesign5 from "../../components/MainDesign5";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Recognitionpage() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [relationship, setrelationship] = useState('');
  const [pictureUri, setPictureUri] = useState(null);
  const [imgename, setimgename] = useState('');
  const [imageList, setImageList] = useState([]);
  const [s3Image, setS3Image] = useState(null);
  const [spkey, setSpkey] = useState('');
  const [images, setImages] = useState([]);
  const[email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
      const emaill = await AsyncStorage.getItem('email');

      const name = emaill.split("@")[0];
      setEmail(name);
    })();
  }, []);
//..........................................................................................

//...........................................................................................

//Add name and relationship as the parameters
const fetchImagesFromS3 = async (nameValue, relationValue) => {
  //nameValue, relationValue
  try {
    //pavani name needs to be replace with patient name getting from local storage
    const response = await Storage.list(`Memory/${email}/${relationValue}/${nameValue}/`);
    console.log('respone', response);
    const imageUrls = [];
      //console.log(response.results[0].key);

      console.log("hello");
    for (const item of response.results) {
      const url = await Storage.get(item.key);
      console.log(url);
      imageUrls.push(url);
    }

    setImages(imageUrls);
  } catch (error) {
    console.log('Error fetching images:', error);
  }
};

//....................................................................................

const speak = () => {
  if(name == null && relationship == null){
    const thingToSay = `Please press the Save button`;
    Speech.speak(thingToSay);
  }
  else if(name === 'undefined' && relationship === 'undefined'){
    const thingToSay = `I don't have any recods of this person`;
    Speech.speak(thingToSay);
  }
  else {
    const thingToSay = `Name is ${name} and Relationship is ${relationship}`;
  Speech.speak(thingToSay);
  }
  
};

//..............................................................................................

const uploadfile = async (image) => {

  const options = {
    keyPrefix: "Check/",
    bucket: "relationphotos",
    region: "us-east-1",
    accessKey: "AKIAXDPKO46TRSLLQOF2",
    secretKey: "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",
    successActionStatus: 201,
    awsUrl: "s3.amazonaws.com",
  };
    
    console.log('options--------------- ', options);

    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: image,
      name: `my-image-filename${Math.random()}.jpg`,
      type: "image/jpeg"
    }
    console.log('filee --------------- ', file);
    setimgename(file.name);
    let filenm = file.name;

    //const img = await fetchImageUrI(file.uri);
    console.log('hello')


    return RNS3.put(file, options)
      .then((res) => {
        
        if (res.status !== 201){
          throw new Error("Failed to upload image to S3");
          console.log("response", res.data);
      }
          
        else {
          console.log(
            "Successfully uploaded image to s3. s3 bucket url: "
          );
          fetchPatientDetails(filenm);

        }
      })
      .catch(error => {
        console.log(error);
      });
  };


//.............................................................................................


const fetchPatientDetails =  (filenm) => {
    console.log('imgename - ', imgename);
    console.log('imgename - ', filenm);
    //pavani should change with pation name that is getting from local storage
    const res =  axios.get(`https://bgin35dpfio3nrpnz3gvgctwei0qqiot.lambda-url.us-east-1.on.aws/api?inputfname=${filenm}&token=RRshJy4beYdlNbu&personname=${email}`)
    .then(async (res) => {
      setIsLoading(false); // End loading
      setRelation(res.data.Output);
      console.log('correct----------------------------');
      console.log('Data - ', res.data);
      console.log('Data new - ', res.data.Output);
      console.log("relation------------------------------------", relation);

      
      const regexxx = /\{"status": "([^"]+)"\}/;
      const matchhh = regexxx.exec(res.data.Output);
      console.log(matchhh);

      const statusValue = '';

      if (matchhh && matchhh.length >= 2) {
         statusValue = matchhh[1];
        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", statusValue); // Output: NoRelations
      }
        if(statusValue === 'NoRelations'){
          setName('undefined');
          setrelationship('undefined');
        }else {

      const regex = /"name": "([^"]+)"/;
      const regexx = /"relation": "([^"]+)"/;
      const jsonString = relation;

      console.log('jsonString', jsonString);
      console.log('asfasjvkasjkvbasvjbasjkv');

      const match = regex.exec(res.data.Output);
      const matchh = regexx.exec(res.data.Output);
      
      if ((match && match.length > 1) && (matchh && matchh.length > 1)) {
        
        const nameValue = match[1];
        setName(nameValue);

        const relationValue = matchh[1];
        setrelationship(relationValue);

        console.log(nameValue);
        console.log(relationValue);

        setSpkey(`relations/hirushan/Thdd/Yyrt/my-image-filename0.10131701824492319.jpg`);
         let value = `relations/hirushan/Thdd/Yyrt/my-image-filename0.10131701824492319.jpg`;
        //Console.log(spkey);
        //fetchImage(value);
        //nameValue and relation values need to pass as the argument for the fetchImagesFromS3 method
        fetchImagesFromS3(nameValue, relationValue);
      }
    }
    
    })
    .catch((err) => {
      setIsLoading(false); // End loading
      setName('undefined');
      setrelationship('undefined');
      alert(err.msg);

    });
};


//................................................................................................
  const takePicture = async () => {
    if (cameraRef) {
      try {
        setrelationship(null);
        setName(null);
        setS3Image(null);
        setImages(null);
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setPictureUri(data.uri);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };



  const savePicture = async () => {
    if (image) {

      try {
        setIsLoading(true); 
        const asset = await MediaLibrary.createAssetAsync(image, {
          album: 'Camera App',
          metadata: {
            name,
            relation,
          },
        });
        console.log('imgeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', image);
        //setImage(image);
        uploadfile(image);
        alert('Picture saved');
        
        console.log('saved successfully');
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <MainDesign5 isHome={true} isCamera={false} footer={<View />}>
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          {!image ? (
            <Camera
              style={styles.camera}
              type={type}
              ref={cameraRef}
              flashMode={flash}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 30,
                }}
              >
                <View style={styles.flashbutton}>
                  <Buttonn
                    title=""
                    icon="retweet"
                    onPress={() => {
                      setType(
                        type === CameraType.back
                          ? CameraType.front
                          : CameraType.back
                      );
                    }}
                  />
                  <Buttonn
                    onPress={() =>
                      setFlash(
                        flash === Camera.Constants.FlashMode.off
                          ? Camera.Constants.FlashMode.on
                          : Camera.Constants.FlashMode.off
                      )
                    }
                    icon="flash"
                    color={
                      flash === Camera.Constants.FlashMode.off
                        ? 'gray'
                        : '#fff'
                    }
                  />
                </View>
              </View>
            </Camera>
          ) : (
            <View style={styles.allincamviwe}>
              <Image source={{ uri: image }} style={styles.camera} />
            </View>
          )}
        </View>
        <View style={styles.controls}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : image ? (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 50,
            }}>
              <View style={styles.card}>
              <View style={styles.but}>
                <Buttonn
                  title="Re-take"
                  onPress={() => setImage(null)}
                  icon="retweet"
                />
               </View>
              <View style={styles.but}>
                <Buttonn title="Save" onPress={savePicture} icon="check" />
              </View>
              <View style={styles.dataSection}>
                <Text style={styles.label}>Name: {name}</Text>
              </View>
              <View style={styles.dataSection}>
                <Text style={styles.label}>Relation: {relationship}</Text>
              </View>

              <View style={styles.container}>
      <TouchableOpacity onPress={speak} activeOpacity={0.7}>
        <View style={styles.buttonContainer}>
          <Feather name="volume-2" size={40} color="rgb(100, 149, 237)" style={styles.icon} />
  
        </View>
      </TouchableOpacity>
    </View>
<View style={styles.containerr}>
      
      <FlatList
        scrollEnabled={false}
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.imagee} />}
      />
    </View>

            </View>
            </View>
          ) : (
            <View style={styles.camcontrol}>
              <Buttonn
                title="Take a picture"
                onPress={takePicture}
                icon="camera"
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  </MainDesign5>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: Dimensions.get("window").width * 0.95,
    padding: 10,
    marginTop: 0
  },
  controls: {
    marginTop: 20,
    flex: 0.5,
    marginLeft: -40
  },
  buttonn: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 36,
    color: '#0047AB',
    paddingVertical: 5,
  },
  allincamviwe : {
    marginLeft: -38
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0047AB',
    marginLeft: 10,
  },
  but : {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6495ED',
    marginBottom : 10,

    
  },
  dataSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    flexWrap: "nowrap",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#fff', 
  },
  camera: {
    justifyContent: "center",
    alignItems: "center",
    width: 370,
    height: 550,
    marginTop: 40,
    
  },
  flashbutton: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop : 500,
    marginLeft : 40,
    marginRight: 40,
    width: 150,
    height: 50
  },
  camcontrol: {
    height: 50,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6082B6',
    marginBottom : 10,
    width : 200,
    marginTop : 20,
    marginLeft: 30
  },
  topControls: {
    flex: 1,
  },
  containerr: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagee: {
    flex: 1,
    width: 330,
    height: 330,
    resizeMode: 'contain' 
  }
});