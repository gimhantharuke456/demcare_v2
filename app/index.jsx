import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Title from "../components/Title";
import { AuthStartStyles } from "../styles/AuthStartStyles";
import { useRouter } from "expo-router";
import {
  getFromStorage,
  saveInStorage,
} from "../services/local_storage_service";
import { auth } from "../firebaseConfig";

const AuthStart = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    (async () => {
      if (await getFromStorage("email") != null) {
        setCurrentUser(auth.currentUser);
        const userType = await getFromStorage("USER_TYPE");
        if (userType === "PATIENT") {
          router.push("/PatientHome");
        } else {
        }
      } else {
        console.log("current user is null");
      }
    })();
  }, [currentUser]);

  return (
    <Container
      child={
        <View
          style={{
            alignItems: "center",
            flex: 1,
            padding: 48,
          }}
        >
          <Title />
          <View style={AuthStartStyles.card}>
            <Text style={{ fontSize: 30, ...AuthStartStyles.text }}>
              Choose Your Account
            </Text>
            <TouchableOpacity
              style={AuthStartStyles.button}
              onPress={async () => {
                await saveInStorage("USER_TYPE", "PATIENT");
                router.push("/LoginPage");
              }}
            >
              <View>
                <Image
                  style={AuthStartStyles.image}
                  source={require("../assets/patient.jpg")}
                />
                <Text style={{ fontSize: 24, ...AuthStartStyles.text }}>
                  PATIENT
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await saveInStorage("USER_TYPE", "CAREGIVER");
                router.push("/LoginPage");
              }}
              style={AuthStartStyles.button}
            >
              <View>
                <Image
                  style={AuthStartStyles.image}
                  source={require("../assets/care_giver.jpg")}
                />
                <Text style={{ fontSize: 24, ...AuthStartStyles.text }}>
                  CAREGIVER
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={AuthStartStyles.buttonWrapper}>
            <Text
              style={{
                fontSize: 24,
                ...AuthStartStyles.text,
                fontWeight: "600",
                padding: 0,
              }}
            >
              New Here ?
            </Text>
            <TouchableOpacity
              onPress={async () => {
                await saveInStorage("USER_TYPE", "PATIENT");
                router.push("/RegisterPage");
              }}
            >
              <Text
                style={{ fontSize: 24, ...AuthStartStyles.text, padding: 0 }}
              >
                SIGNUP AS A PATIENT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await saveInStorage("USER_TYPE", "CAREGIVER");
                router.push("/RegisterPage");
              }}
            >
              <Text
                style={{ fontSize: 24, ...AuthStartStyles.text, padding: 0 }}
              >
                SIGNUP AS A CAREGIVER
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    />
  );
};

export default AuthStart;
