import React, { useRef } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";

const images = [
  {
    uri: "https://previews.123rf.com/images/olegdudko/olegdudko1806/olegdudko180601373/102333691-happy-young-man-clicking-photo-from-camera.jpg",
  },
  {
    uri: "https://cdn.britannica.com/16/234216-050-C66F8665/beagle-hound-dog.jpg",
  },
  {
    uri: "https://www.thesprucepets.com/thmb/17UY4UpiMekV7WpeXDziXsnt7q4=/1646x0/filters:no_upscale():strip_icc()/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg",
  },
];

const ImageCarousel = () => {
  const carouselRef = useRef(null);
  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.uri }} style={styles.image} />
    </View>
  );

  return (
    <Carousel
      ref={carouselRef}
      data={images}
      renderItem={renderItem}
      sliderWidth={300}
      itemWidth={250}
      autoplay={true}
      autoplayInterval={4000}
      loop={true}
    />
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: 400,
    height: 350,
  },
});

export default ImageCarousel;
