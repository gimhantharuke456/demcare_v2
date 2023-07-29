import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
export default function MainDesign5({
  children,
  footer,
  header,
  isHome,
  isCamera,
}) {
  let navigation = useNavigation();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/img1.jpg")}
        style={styles.image}
      >
        <View style={styles.containerHead}>
          <TouchableOpacity
onPress={()=>{
  router.back();
}}
          >
            <FeatherIcon name="chevron-left" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.text}>DemCare</Text>
          <TouchableOpacity
            onPress={()=>{
              router.push("CareGiverHome")
            }}
          >
            <FeatherIcon name="home" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>{children}</View>
        {footer}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 10,
    paddingTop: 12,
  },
  image: {
    flex: 1,
    height: "20%",
    resizeMode: "cover",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    backgroundColor: "white",
    width: "80%",
    height: "75%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -130,
    // flex:0.73,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
