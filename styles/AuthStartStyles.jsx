import { StyleSheet, Dimensions } from "react-native";

const height = Dimensions.get("screen").height;

export const AuthStartStyles = StyleSheet.create({
  card: {
    width: 300,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 12,
    elevation: 1,
    paddingVertical: 24,
    paddingHorizontal: 32,
    marginTop: 48,
    height: 420,
  },
  text: {
    color: "#5BD2EC",
    fontWeight: "bold",
    padding: 32,
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  button: {
    width: 220,
    height: 225,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    flexDirection : "column"
  },
  buttonWrapper:{
    height : 120,
    justifyContent : "space-between",
    marginTop : 32,
  }
});
