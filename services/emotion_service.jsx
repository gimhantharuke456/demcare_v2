import axios from "axios";
import { baseUrl } from "../constants";
export const predictEmotion = async (formData) => {
  console.log(baseUrl);
  const response = await axios
    .post(`${baseUrl}/predict_emotion/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    })
    .catch((err) => {
      console.log(`predict emotion failed ${err}`);
      return;
    });
  return response.data.emotion_label;
};
