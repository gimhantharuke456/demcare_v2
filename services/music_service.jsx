import { db } from "../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import SongModel from "../models/song_model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFromStorage } from "./local_storage_service";

export const fetchAudio = async () => {
  let audios = [];
  const emotion = await getFromStorage("CURRENT_EMOTION");

  const age = await getFromStorage("age");
  const ageRange = ageRangeGetter(age);
  console.log(`current emotion is ${emotion} age is ${age}`);
  const q = query(
    collection(db, "audio"),
    where("category", "==", emotion),
    where("ageRange", "==", ageRange)
  );
  await getDocs(q)
    .then((snapshot) => {
      snapshot.docs.map((doc) => {
        const track = new SongModel(
          doc.data()["url"],
          doc.data()["artist"],
          doc.data()["category"],
          doc.data()["ageRange"]
        );
        audios.push(track);
      });
    })
    .catch((err) => {
      console.log(`Error in get auidos ${err}`);
      return [];
    });
  return audios;
};

const ageRangeGetter = (age) => {
  if (age >= 40 && age <= 50) {
    return 1;
  }
  if (age > 50 && age <= 60) {
    return 2;
  }
  if (age > 60 && age <= 70) {
    return 3;
  }
  if (age > 70 && age <= 80) {
    return 4;
  }
};
