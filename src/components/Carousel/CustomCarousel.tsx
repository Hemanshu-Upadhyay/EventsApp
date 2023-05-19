import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import CarouselItem from './CarouselItem';

const {width, height} = Dimensions.get('window');
let flatList;

const CustomCarousel = ({data}) => {
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, width);
  const [dataList, setDataList] = useState(data);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setDataList(data);
  }, [data]);

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const imageIndex = Math.round(offsetX / width);
    setCurrentImageIndex(imageIndex);
  };

  const scrollToIndex = index => {
    setCurrentImageIndex(index);
    flatList.scrollToIndex({animated: true, index});
  };

  if (data && data.length) {
    return (
      <View>
        <FlatList
          data={data}
          ref={ref => {
            flatList = ref;
          }}
          keyExtractor={(item, index) => 'key' + index}
          horizontal
          pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            return <CarouselItem item={item} />;
          }}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScroll}
        />

        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {currentImageIndex + 1}/{data.length}
          </Text>
        </View>
      </View>
    );
  }

  console.log('Please provide Images');
  return null;
};

const styles = StyleSheet.create({
  countContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
  },
  countText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  navigationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000000',
  },
});

export default CustomCarousel;
