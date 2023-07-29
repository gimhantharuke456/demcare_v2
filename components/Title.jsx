import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TitleStyle } from "../styles/TitleStyle";
import { AntDesign } from '@expo/vector-icons';
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";
const Title = ({ is_login = false }) => {
  const router = useRouter()
  return (
    <View style={TitleStyle.titleWrapper}>
      <Text style={TitleStyle.title}> DemCare</Text>
      {!is_login && <TouchableOpacity
        onPress={async() => {
         await auth.signOut();
router.push("/LoginPage")
        }}
      >
      <AntDesign name="logout" size={24} color="black" />
      </TouchableOpacity>}
    </View>
  );
};

export default Title;
