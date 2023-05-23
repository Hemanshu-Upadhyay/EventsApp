import React from 'react';
import {View, StyleSheet, Text, Image, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const CarouselItem = ({item, data}) => {
  const hardcodedDescription = `This pic is clicked at ${data?.title}`;
  return (
    <View style={styles.cardView}>
      <Image style={styles.image} source={{uri: item.url}} />
      <View style={styles.cardContent}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>
          {data?.title}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.itemDescription}>
          {hardcodedDescription}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardView: {
    width: width - 20,
    height: height / 3,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 10,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 12,
  },
});

export default CarouselItem;
