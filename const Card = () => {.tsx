const Card = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({item, title}) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={{uri: item.image}} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={400}
        itemWidth={400}
        onSnapToItem={index => setActiveIndex(index)}
      />
      <View style={styles.activeContainer}>
        <Text style={styles.activeTitle}>{data[activeIndex].title}</Text>
      </View>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={400}
        itemWidth={400}
        onSnapToItem={index => setActiveIndex(index)}
      />
      <View style={styles.activeContainer}>
        <Text style={styles.activeTitle}>{data[activeIndex].title}</Text>
      </View>
    </View>
  );
};
