import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import {doc, getDoc, setDoc } from "firebase/firestore";
import {saveInStorage} from "./local_storage_service"

export const signin = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password)
    .then(async (val) => {
      const userRef = doc(db, "users", val.user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists) {
        await saveInStorage("age", snap.data()["age"]);
        await saveInStorage("name", snap.data()["name"]);
        await saveInStorage("email", snap.data()["email"]);
        console.log("user data saved");
        return true;
      }
      return false;
    })
    .catch((err) => {
      console.log(`signin failed ${err}`);
      return false;
    });
};

export const register = async (email, password, name, age) => {
 return await createUserWithEmailAndPassword(auth, email, password)
    .then(async (val) => {
      const uid = val.user.uid;
      if (uid) {
        const docRef = await setDoc(doc(db, "users", uid), {
          email,
          name,
          age,
        }).catch((err) => {
          console.log(`add doc failed ${err}`);
          return false;
        });
        await saveInStorage("age", age);
        await saveInStorage("name", name);
        await saveInStorage("email", email);
        return true;
      }
    })
    .catch((err) => {
      console.log(`register failed with email ${err}`);
    });
  return false;
};

export const forgetPassword = async(email)=>{
  await sendPasswordResetEmail(auth,email);
}