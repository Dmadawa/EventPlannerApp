import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const PostsScreen = ({ route, navigation }) => {
  const { posts } = route.params;

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => navigation.navigate('Comments', { postId: item.id })}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postBody: {
    fontSize: 14,
    color: '#666',
  },
});

export default PostsScreen;
