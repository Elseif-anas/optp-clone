import React, { useRef, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent 
} from 'react-native';

const { width } = Dimensions.get('window');

interface CarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export default function Carousel({ 
  images, 
  autoPlayInterval = 3000 
}: CarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex.current === images.length - 1) {
        currentIndex.current = 0;
      } else {
        currentIndex.current += 1;
      }

      scrollViewRef.current?.scrollTo({
        x: currentIndex.current * width,
        animated: true,
      });
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [images, autoPlayInterval]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    currentIndex.current = Math.round(contentOffset.x / width);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex.current === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  slide: {
    width,
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    opacity: 0.5,
  },
  paginationDotActive: {
    opacity: 1,
  },
});