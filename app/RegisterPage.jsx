import React, { useState } from "react";
import Container from "../components/Container";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Title from "../components/Title";
import { AuthStartStyles } from "../styles/AuthStartStyles";
import CustomInput from "../components/CustomInput";
import CustomDatePicker from "../components/CustomDatePicker";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { register } from "../services/auth_service";
import LoadingIndicator from "../components/Loading";
import { isValidEmail } from "../services/email_validator";
import { ageValidator } from "../services/age_validator";
const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title is_login={true}/>
          <View style={{ ...AuthStartStyles.card, height: 500 }}>
            <Text style={{ fontSize: 32, ...AuthStartStyles.text }}>
              REGISTER
            </Text>
            <CustomInput
              onChange={(e) => {
                setName(e);
              }}
              placeholder={"Name"}
            />
            <CustomInput
              onChange={(e) => {
                setAge(e);
              }}
              placeholder={"Age"}
            />
            <CustomInput
              onChange={(e) => {
                setEmail(e);
              }}
              placeholder={"Email"}
            />
            <CustomInput
              onChange={(e) => {
                setPassword(e);
              }}
              placeholder={"Password"}
              isPassword={true}
            />
            <Button
              onPressed={async () => {
              if(email && password && name && age){
                if(isValidEmail(email) ){
                  if(ageValidator(age)){
                    setLoading(true);
                const result = await register(email, password, name, age);
                if (result) {
                  router.push("/PatientHome");
                }else{
                  console.log("result is false")
                }
                setLoading(false);
                  }else{
                    Alert.alert("Ooops","Patient must age between 40-80")
                  }
                }else{
                  Alert.alert("Hey","Please enter valid email")
                }
              }else{
                Alert.alert("Hey","Fill all the fields")
              }
              }}
              text={"REGISTER"}
            />
          </View>
          <View style={{ alignItems: "center", height: 100 }}>
            <Text style={{ ...AuthStartStyles.text, fontSize: 24 }}>
              Already have an account?
            </Text>
            <TouchableOpacity
              style={{ margin: 0 }}
              onPress={() => {
                router.push("/");
              }}
            >
              <Text
                style={{ ...AuthStartStyles.text, fontSize: 16, margin: 8 }}
              >
                SIGN IN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    />
  );
};

export default RegisterPage;
