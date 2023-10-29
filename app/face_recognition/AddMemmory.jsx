import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Button,
  Dimensions,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import Buttonn from '../../components/Buttonn'
import { TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RNS3 } from 'react-native-aws3';

import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '../../src/aws-exports';
Amplify.configure(awsconfig);

import MainDesign5 from "../../components/MainDesign5";
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as FaceDetector from "expo-face-detector";


export default function AddMemmory() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [pictureUri, setPictureUri] = useState(null);
  const [imagee, setImagee] = useState(null);
  const [imgename, setimgename] = useState(null);
  const [result, setResult] = useState(null);
  const[images, setImages] = useState([]);
  const[email, setEmail] = useState();
 // const {width} = useWindowDimensions();
 const [imageee, setImageee] = useState(null);

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

  const pickImageeeee = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImages(null);
      
      setPictureUri(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
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

const pickMultipleImages = async () => {
  
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsMultipleSelection: true,
    selectionLimit: 10,
    aspect: [4, 3],
    quality: 1,
  });
  console.log(result);
  if (!result.canceled) {
    const selectedImages = result.assets.map((asset) => asset.uri);
    setResult(result);
    setImages(selectedImages);
  }
};

const uploadImagesToS3 = async () => {
  await Promise.all(
    images.map(async (imageUri) => {
      const fileName = imageUri.split('/').pop();
      const response = await fetch(imageUri);
      const blob = await response.blob();
//value of the patient needs to replace with pavani using local storage
      try {
        await Storage.put(`Memory/${email}/${relation}/${name}/${fileName}`, blob, {
          contentType: 'image/jpeg',
        });
        console.log('Image uploaded successfully:', fileName);
      } catch (error) {
        console.log('Error uploading image:', error);
      }
    })
  );
};
//...................................................................

const uploadfile = async (image) => {

//value of the patient needs to replace with pavani using local storage
console.log('emaillllllllllllllllllllllllllllllllllllllllllllllllllll', email);
  const options = {
    keyPrefix: `Relations/${email}/${relation}/${name}/`,
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

    //const img = await fetchImageUrI(file.uri);
    console.log('hello')


    return RNS3.put(file, options)
      .then((res) => {
        
        if (res.status !== 201){
          throw new Error("Failed to upload image to S3");
      }
          
        else {
          console.log(
            "Successfully uploaded image to s3. s3 bucket url: "
          );
          //fetchPatientDetails();

        }
      })
      .catch(error => {
        console.log(error);
      });
  };



  const savePicture = () => {
    if (image) {
      if (name.trim() === '' || relation.trim() === '') {
        alert('Please fill in all fields');
        return;
      }
      try {
        const asset = MediaLibrary.createAssetAsync(image, {
          album: 'Camera App',
          metadata: {
            name,
            relation,
          },
        });
        alert('Picture saved!');
        console.log('imageeeeeeeeeee', image);
        uploadfile(image);
        console.log('result ----------------', result);
        if (result !== null) {
          uploadImagesToS3();
        }
        alert('Picture saved!');
        setResult(null);
        setName(null);
        setRelation(null);
        setImagee(null);
        
        setImage(null);
        console.log('ffffffffffffffffffffff');
        
        
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
                  type === CameraType.back ? CameraType.front : CameraType.back
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
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
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
        
        {image ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 50,
            }}
          >
            <View style={styles.card}>
            <View style={styles.dataSection}>
            <Text style={styles.label}>Person Name : </Text>
      <TextInput
        // style={styles.input}
        placeholder="Person Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      </View>
      <View style={styles.dataSection}>
      <Text style={styles.label}>Relationship   : </Text>
      <TextInput
        style={styles.input}
        placeholder="Relationship of the person"
        value={relation}
        onChangeText={setRelation}
      />
</View>
    <View style={styles.but}>
            <Buttonn
              title="Re-take or Re-select"
              onPress={() => setImage(null)}
              icon="retweet"
            />
            </View>
            <View style={styles.containerr}>
      <Button title="Pick Images" onPress={pickMultipleImages} />
      <FlatList
        scrollEnabled={false}
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.imagee} />}
      />
    </View>
            <View style={styles.but}>
            <Buttonn title="Save" onPress={savePicture} icon="check" />
            </View>

           
         </View>
          </View>
        ) : (
          
          <><View style={styles.camcontrol}>

                  <Buttonn title="Take a picture" onPress={takePicture} icon="camera" />
                </View><View style={styles.camcontroll}>
                    <Button title="Pick an image from camera roll" onPress={pickImageeeee} />
                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                  </View></>
          
          
        )}
      </View>
    </View>
    </ScrollView>
    </MainDesign5>
  );
}

const styles = StyleSheet.create({
  but : {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6495ED',
    marginBottom : 10,
    marginLeft : 40,
    marginRight: 40
    
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    marginTop: 20,
    flex: 0.5,
    marginLeft: -40
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
  camcontroll: {
    height: 60,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom : 10,
    width : 200,
    marginTop : 20,
    marginLeft: 30
  },

  allincamviwe : {
    marginLeft: -38
  },
  Buttonn: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    //color: '#E9730F',
    color: '#0047AB',
    marginLeft: 10,
  },
  input: {
    width: "60%",
    height: 40,
    paddingHorizontal: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    color: '#0047AB',
    marginTop: 8,
  },
  camera: {
    justifyContent: "center",
    alignItems: "center",
    width: 370,
    height: 550,
    marginTop: 40,
    
  },

  cameraa: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 300,
    marginTop: 0,
    
  },
  topControls: {
    flex: 1,
  },
  dataSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    flexWrap: "nowrap",
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
  },
  label: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 36,
    color: '#6495ED',
    paddingVertical: 5,
  },
  cameraWrapper: {
    width: 290,
    height: 290,
    padding: 5,
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 5,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  cameraPreview: {
    flex: 1,
  },
  Text: {
    color: '#fff',
  },
  containerr: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagee: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 8,
  },
});