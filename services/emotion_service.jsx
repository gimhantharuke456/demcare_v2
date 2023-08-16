import axios from "axios";
import { baseUrl } from "../constants";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../firebaseConfig";
export const predictEmotion = async (data) => {
  const response = await axios
    .post(`${baseUrl}/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch((err) => {
      console.log(`predict emotion from server side failed ${err}`);
      return;
    });
  return response.data.emotion_label;

  return "happy";
};

export const uploadEmotionImage = async (uri, filename, type) => {
  console.log(`uri is ${uri}`);
  const response = await fetch(uri);

  const blob = await response.blob();
  console.log("blob created");
  const storage = getStorage(app);
  const storageRef = ref(storage, `/emotion_images/${filename}.${type}`);

  return await uploadBytes(storageRef, blob)
    .then(async (snapshot) => {
      console.log("Uploaded a blob or file!");
      const url = await getDownloadURL(storageRef);
      //console.log(url);

      return url;
    })
    .catch((err) => {
      console.log(`upload file page ${err}`);
      return null;
    });
};
