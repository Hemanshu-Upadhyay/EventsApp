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
import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('window');

const CustomCarousel = ({data}) => {
  // const scrollX = new Animated.Value(0);
  // let position = Animated.divide(scrollX, width);

  const {uploading} = useSelector(state => state.events);

  const [dataList, setDataList] = useState(data);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const defaultImage = {
    // url: require('../../../assets/images/defaultEvent.png'),
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPfoZjo2BFClW-L-P-jWaz699pTgyNV-H1ig&usqp=CAU',
  };

  useEffect(() => {
    setDataList(data);
  }, [data]);

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const imageIndex = Math.round(offsetX / width);
    setCurrentImageIndex(imageIndex);
  };

  if (data.photos && data.photos.length) {
    return (
      <View>
        <FlatList
          data={data?.photos}
          // ref={ref => {
          //   flatList = ref;
          // }}
          keyExtractor={item => `${item.id}_${Math.ceil(Math.random() * 1000)}`}
          horizontal
          pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <CarouselItem
                key={`${item.id}_${Math.ceil(Math.random() * 1000)}`}
                item={item}
                data={data}
              />
            );
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

  return <CarouselItem item={defaultImage} data={data} uploading={uploading} />;
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
