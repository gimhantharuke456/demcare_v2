import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { app, auth } from "../firebaseConfig";
import SummaryModel from "../models/summary_model";
import axios from "axios";
import { baseUrl } from "../constants";
export const uploadAudioFile = async (uri) => {
  console.log(`uri is ${uri}`);
  const response = await fetch(uri);

  const blob = await response.blob();
  console.log("blob created");
  const storage = getStorage(app);
  const storageRef = ref(storage, `/voice_recordings/${Date.now()}.m4a`);

  return await uploadBytes(storageRef, blob)
    .then(async (snapshot) => {
      console.log("Uploaded a blob or file!");
      const url = await getDownloadURL(storageRef);
      //console.log(url);
      // const data = {
      //   uploaded_at: Date.now(),
      //   uploaded_by: auth.currentUser.uid,
      //   url,
      // };
      // const db = getFirestore(app);

      // return await addDoc(collection(db, "recordings"), data)
      //   .then((snapshot) => {
      //     return true;
      //   })
      //   .catch((err) => {
      //     console.log(`set doc failed ${err}`);
      //     return false;
      //   });
      return url;
    })
    .catch((err) => {
      console.log(`upload file page ${err}`);
      return null;
    });
};

export const getDiaries = async () => {
  let diaries = [];
  const db = getFirestore(db);
  const q = query(
    collection(db, "recordings"),
    where("uploaded_by", "==", auth.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    diaries.push({ id: doc.id, ...doc.data() });
  });

  return diaries;
};

export const deleteDiary = async (id) => {
  const db = getFirestore(db);
  await deleteDoc(doc(db, "recordings", id));
};

export const getSummaries = async (date) => {
  let summaries = [];
  const db = getFirestore(db);
  const q = query(
    collection(db, "summaries"),
    where("summered_by", "==", auth.currentUser.uid),
    where("date", "==", date)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    summaries.push({ id: doc.id, ...doc.data() });
  });
  return summaries;
};

export const deleteSummary = async (id) => {
  const db = getFirestore(db);
  await deleteDoc(doc(db, "summaries", id));
};

export const addSummary = async (data) => {
  try {
    const date = formatDate(new Date());
    const d = {
      summered_by: auth.currentUser.uid,
      summary: data,
      date: date,
    };

    const db = getFirestore(app);
    await addDoc(collection(db, "summaries"), d);
    return true;
  } catch (err) {
    console.log(`add memmory failed ${err}`);
  }
};

export const convertToText = async (url) => {
  return axios
    .post(`${baseUrl}/convert`, {
      url: url,
    })
    .then((res) => {
      return res.data.text;
    })
    .catch((err) => {
      console.log(`conver to text failed ${err}`);
      return null;
    });
};

export const summerizeText = async (text) => {
  return await axios
    .post(`${baseUrl}/summarize?textdata=${text}&token=RRshJy4beYdlNbu`)
    .then((res) => {
      if (res.data.Status === "Done") {
        return res.data.Summary[0].summary_text;
      } else {
        return "Summerize failed";
      }
    })
    .catch((err) => {
      console.log(`summerize failed ${err}`);
      return `Summerize failed ${err}`;
    });
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
