import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import Container from "../components/Container";
import Title from "../components/Title";
import { AuthStartStyles } from "../styles/AuthStartStyles";
import CustomInput from "../components/CustomInput";
import TextButton from "../components/TextButton";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { forgetPassword, signin } from "../services/auth_service";
import { getFromStorage } from "../services/local_storage_service";
import { isValidEmail } from "../services/email_validator";
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container
      child={
        <View style={{ alignItems: "center", flex: 1 }}>
          <Title is_login={true}/>
          <View style={AuthStartStyles.card}>
            <Text style={{ ...AuthStartStyles.text, fontSize: 30 }}>LOGIN</Text>
            <CustomInput
              onChange={(e) => {
                setEmail(e);
              }}
              placeholder={"Email"}
            />
            <CustomInput
            isPassword = {true}
              onChange={(e) => {
                setPassword(e);
              }}
              placeholder={"Password"}
            />
            <TextButton
              onPress={async() => {
                
                if(email.length != 0){
                  const validEmail = isValidEmail(email);
                if(!validEmail){
                  Alert.alert("Hey","Please enter valid email")
                  return;
                }
                await  forgetPassword();
                Alert.alert("Hey","Password reset email sent to your email")
                }else{
                  Alert.alert("Hey","Please enter valid email")
                }
              }}
              children={"Forgot your password"}
              fontSize={16}
              color={"#51A6CD"}
            />
            <Button
              onPressed={async () => {
                if (email && password) {
                  const isPatient = await getFromStorage("USER_TYPE");
                  const result = await signin(email, password);
                  console.log(result);
                  AsyncStorage.setItem("email", email);
                  if(result){
                    if(isPatient === "PATIENT"){

                      router.push("/PatientHome");
                    }else{

                      router.push("/CareGiverHome")
                    }
                  }else{
                    Alert.alert("Signin failed, please try again");
                  }
                }
              }}
              text={"LOGIN"}
            />
          </View>
          <View>
            <Text style={{ ...AuthStartStyles.text, fontSize: 24 }}>
              Don't have an account ?
            </Text>
            <TextButton
              onPress={() => {
                router.push("/RegisterPage");
              }}
              children={"SIGN UP"}
              color={"#51A6CD"}
              fontSize={16}
            />
          </View>
        </View>
      }
    />
  );
};

export default LoginPage;
