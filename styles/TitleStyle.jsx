import { StyleSheet } from "react-native";

export const TitleStyle = StyleSheet.create({
  titleWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height : 75,
    marginTop : 32,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    marginRight : 32,
  },
});
