import { Stack } from "expo-router";
import RegisterPage from "./RegisterPage"
const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#10101E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
      }}>
       
    </Stack>
  );
};

export default StackLayout;
