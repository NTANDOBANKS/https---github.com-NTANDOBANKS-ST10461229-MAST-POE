import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const FilterPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Filter Options</Text>
      {/* Add filter options components here */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
  },
});

export default FilterPage;