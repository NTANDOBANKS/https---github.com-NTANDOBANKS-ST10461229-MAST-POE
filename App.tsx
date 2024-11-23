import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";

export default function App() {
  const [dishName, setDishName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [course, setCourse] = useState<string>("Select a Course");
  const [price, setPrice] = useState<string>("");
  const [dishes, setDishes] = useState<any[]>([]);
  const [totalDishes, setTotalDishes] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [filteredDishes, setFilteredDishes] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("");

  const CourseOptions = ["Starter", "Main Course", "Dessert", "Beverage"];

  const handleSubmit = () => {
    const priceNum = parseFloat(price);
    if (!dishName || !description || course === "Select a Course" || isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Input Error", "Please complete all fields correctly.", [{ text: "OK" }]);
      return;
    }
    const newDish = { dish_Name: dishName, description, course, price: priceNum };
    setDishes((prev) => [...prev, newDish]);
    setTotalDishes((prev) => prev + 1);
    resetFields();
  };

  const resetFields = () => {
    setDishName("");
    setDescription("");
    setCourse("Select a Course");
    setPrice("");
  };

  const applyFilter = (filter: string) => {
    setActiveFilter(filter);
    setFilteredDishes(dishes.filter((dish) => dish.course === filter));
    setFilterVisible(false);
  };

  const clearFilter = () => {
    setActiveFilter("");
    setFilteredDishes([]);
  };

  const toggleFilter = (visible: boolean) => {
    setFilterVisible(visible);
  };

  const renderDishes = activeFilter ? filteredDishes : dishes;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.trackerName}>PRIVATE CHEF{"\n"}CHRISTOFFEL MENU</Text>
      </View>

      //Input Fields of Dish data
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Dish Name"
          placeholderTextColor="#BBB"
          value={dishName}
          onChangeText={setDishName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#BBB"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={styles.coursePicker} onPress={() => setModalVisible(true)}>
          <Text style={styles.courseText}>{course}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Price"
          placeholderTextColor="#BBB"
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>Add Dish</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => toggleFilter(true)}>
          <Text style={styles.filterButtonText}>Filter by Course</Text>
        </TouchableOpacity>
      </View>

    //LIST OF DISHES SECTION AND SUMMARY SECTION 
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryHeading}>SELECTION SUMMARY</Text>
        <FlatList
          data={renderDishes}
          renderItem={({ item }) => (
            <View style={styles.dishItem}>
              <Text style={styles.dishText}>{item.dish_Name}</Text>
              <Text style={styles.dishText}>{item.description}</Text>
              <Text style={styles.dishText}>{item.course}</Text>
              <Text style={styles.dishText}>R{item.price.toFixed(2)}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <Text style={styles.totalDishes}>Total Dishes: {totalDishes}</Text>
      </View>

      //MODAL FOR COURSE SELECTION AND FILTERING
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select a Course</Text>
            {CourseOptions.map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionButton} onPress={() => setCourse(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      //MODAL FOR COURSE FILTERING AND RESETTING
      <Modal animationType="slide" transparent={true} visible={filterVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Filter by Course</Text>
            {CourseOptions.map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionButton} onPress={() => applyFilter(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.resetButton} onPress={clearFilter}>
              <Text style={styles.resetButtonText}>Clear Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => toggleFilter(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
// SECTION THAT DEALS WITH AND AESTHECTICS

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },

  headingContainer: { marginBottom: 20 },

  trackerName: { fontSize: 32, fontWeight: "bold", color: "#FFD700", textAlign: "center" },

  inputContainer: { marginBottom: 20 },
  input: { height: 50, borderColor: "#FFD700", borderWidth: 2, borderRadius: 8, marginBottom: 10, paddingLeft: 10, color: "#FFF", backgroundColor: "#222", fontSize: 18 },
  coursePicker: { height: 50, borderColor: "#FFD700", borderWidth: 2, borderRadius: 8, marginBottom: 10, justifyContent: "center", paddingLeft: 10, backgroundColor: "#222" },
  courseText: { color: "#FFF", fontSize: 18 },
  
  addButton: { backgroundColor: "#FFD700", height: 50, justifyContent: "center", alignItems: "center", borderRadius: 8, marginBottom: 10 },
  addButtonText: { fontSize: 20, color: "#000", fontWeight: "bold" },

  filterButton: { backgroundColor: "#555", height: 50, justifyContent: "center", alignItems: "center", borderRadius: 8 },

  filterButtonText: { fontSize: 20, color: "#FFD700", fontWeight: "bold" },
  summaryContainer: { marginTop: 20 },
  summaryHeading: { fontSize: 28, fontWeight: "bold", color: "#FFD700", textAlign: "center" },

  dishItem: { backgroundColor: "#333", padding: 15, marginBottom: 10, borderRadius: 8 },
  dishText: { color: "#FFD700", fontSize: 18 },
  
  totalDishes: { fontSize: 22, fontWeight: "bold", marginTop: 10, color: "#FFD700", textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" },
  modalView: { width: "80%", backgroundColor: "#FFF", borderRadius: 20, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  optionButton: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#FFD700", width: "100%", alignItems: "center" },
  optionText: { fontSize: 18, color: "#000" },
  closeButton: { marginTop: 20, backgroundColor: "#FFD700", padding: 10, borderRadius: 8 },
  closeButtonText: { fontSize: 18, color: "#000" },
  resetButton: { marginTop: 10, backgroundColor: "#FF4500", padding: 10, borderRadius: 8 },
  resetButtonText: { fontSize: 18, color: "#FFF" },
});
