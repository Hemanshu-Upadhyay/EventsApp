import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';

const screenWidth = Dimensions.get('screen').width;
const itemHeight = 350;

const Card = () => {
  const entries = [
    {
      title: 'Image 1',
      image: 'https://picsum.photos/300/200',
    },
    {
      title: 'Image 2',
      image: 'https://picsum.photos/300/200',
    },
    {
      title: 'Image 3',
      image: 'https://picsum.photos/300/200',
    },
  ];

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <Image source={{uri: item.image}} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

  return (
    <Carousel
      data={entries}
      renderItem={renderItem}
      sliderWidth={screenWidth}
      itemWidth={screenWidth}
      loop={true}
      autoplay={true}
      autoplayInterval={3000}
      inactiveSlideOpacity={0.7}
      inactiveSlideScale={0.85}
      layout={'tinder'}
      containerCustomStyle={styles.carousel}
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    marginTop: 20,
  },
  slide: {
    width: screenWidth,
    height: itemHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: screenWidth * 0.8,
    height: itemHeight * 0.6,
    resizeMode: 'cover',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#FFF',
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textShadowColor: '#000',
    textShadowRadius: 2,
  },
});

export default Card;
