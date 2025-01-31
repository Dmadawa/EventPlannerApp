import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhotos, fetchUsers, fetchPosts } from '../store/slices/dataSlice';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { photos, users, posts, loading } = useSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchPhotos());
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const renderSeparator = () => <View style={styles.separator} />;

  const renderUserItem = ({ item }) => (
    <View style={styles.card}>
      {/* Profile Image */}
      <Image source={require('../assets/images/profImage.png')} style={styles.profileImage} />

      {/* Organizer Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>

      {/* Message Icon */}
      <TouchableOpacity style={styles.messageIcon}>
        <MaterialCommunityIcons name="message-processing-outline" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const renderPostItem = ({ item }) => (
    <View style={styles.imageCard}>
      <Image source={{ uri: item.url }} style={styles.photo} />
      <Text style={styles.description}>{item.title}</Text>
    </View>
  );

  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={() => (
        <View>
          {/* Horizontal Image Slider */}
          <FlatList
            horizontal
            data={photos}
            renderItem={({ item }) => <Image source={{ uri: item.url }} style={styles.image} />}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalList}
          />
          <Text style={styles.eventTitle}>Cricket Event</Text>

          {/* Organizers Section */}
          <Text style={styles.title}>Organizers</Text>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={renderSeparator}
            style={styles.organizersList}
            showsVerticalScrollIndicator={false}
          />
          { renderSeparator }
          {/* Posts Section */}
          <Text style={styles.title}>Photos</Text>
          <FlatList
            horizontal
            data={photos}
            renderItem={renderPostItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoList}
          />

          {/* Total Posts Count */}
          {loading ? (
            <Text>Loading posts...</Text>
          ) : (
            <TouchableOpacity
              style={styles.postsCountContainer}
              onPress={() => navigation.navigate('Posts', { posts })}
            >
              <Text style={styles.postsCountText}>{posts.length}</Text>
              <Text style={styles.postsCountSubTitleText}>Posts</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      ListFooterComponent={<View style={{ height: 16 }} />}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width,
    height: 220 // Space below the images
  },
  horizontalList: {
    marginBottom: 10
  },
  eventTitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#191C1E',
    fontSize: 26,
    marginLeft: 16,
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    marginTop: 16,
    paddingLeft: 16,
    fontFamily: 'Inter_18pt-SemiBold',
    fontWeight: 600,
    color: '#333',
  },
  organizersList: {
    height: 220
  },
  photoList: {
    paddingLeft: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  messageIcon: {
    marginLeft: 8,
  },
  imageCard: {
    alignItems: 'center',
    width: 244, // Card width
    height: 300,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E1E2E4',
  },
  photo: {
    width: '100%',
    height: 150, // Resize photo height for better fit
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontWeight: 700,
    color: '#191C1E',
  },
  postsCountContainer: {
    alignItems: 'center',
    marginTop: 16, // Add margin for spacing between the buttons and posts count
  },
  postsCountText: {
    marginTop: 10,
    color: '#DA5E42',
    fontSize: 19,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  postsCountSubTitleText: {
    marginTop: 2,
    color: '#757779',
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#E1E2E4',
  },
});

export default HomeScreen;
