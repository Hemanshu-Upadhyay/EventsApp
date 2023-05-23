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
  const defaultImage = {
    // url: require('../../../assets/images/defaultEvent.png'),
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPfoZjo2BFClW-L-P-jWaz699pTgyNV-H1ig&usqp=CAU',
  };

  const defaultData = {
    title: 'Available Soon',
    description: 'Event Images available soon',
  };
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

  if (data.photos && data.photos.length) {
    return (
      <View>
        <FlatList
          data={data?.photos}
          ref={ref => {
            flatList = ref;
          }}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            return <CarouselItem item={item} data={data} />;
          }}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScroll}
        />

        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {currentImageIndex + 1}/{data.photos.length}
          </Text>
        </View>
      </View>
    );
  }

  return <CarouselItem item={defaultImage} data={defaultData} />;
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
