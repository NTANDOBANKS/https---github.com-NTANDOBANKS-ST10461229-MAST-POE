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
  const [dishes, setDishes] = useState<DishDetails[]>([]);
  const [totalDishes, setTotalDishes] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const CourseOptions = ["Starter", "Main Course", "Dessert", "Beverage"];
  const FancyMeals = [
    { dish_Name: "Truffle Pasta", description: "Rich and creamy truffle-infused pasta.", course: "Main Course", price: 350 },
    { dish_Name: "Caviar Canapé", description: "Luxury starter with fine caviar.", course: "Starter", price: 500 },
    { dish_Name: "Chocolate Fondue", description: "Decadent molten chocolate dessert.", course: "Dessert", price: 250 },
    { dish_Name: "Vintage Wine", description: "Premium aged red wine.", course: "Beverage", price: 800 },
  ];

  const handleSubmit = () => {
    const priceNum = parseFloat(price);

    if (!dishName || !description || course === "Select a Course" || isNaN(priceNum) || priceNum <= 0) {
      const errorMessage = !dishName || !description || course === "Select a Course"
        ? "Please fill in all the fields."
        : "Price must be a valid number greater than 0!";
      Alert.alert("Input Error", errorMessage, [{ text: "OK" }]);
      return;
    }

    const newDish: DishDetails = {
      dish_Name: dishName,
      description,
      course,
      price: priceNum,
    };

    setDishes((prevDishes) => [...prevDishes, newDish]);
    setTotalDishes((prevTotal) => prevTotal + 1);
    resetFields();
  };

  const resetFields = () => {
    setDishName("");
    setDescription("");
    setCourse("Select a Course");
    setPrice("");
  };

  const selectCourse = (selectedCourse: string) => {
    setCourse(selectedCourse);
    setModalVisible(false);
  };

  const toggleModal = (visible: boolean) => {
    if (visible) {
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  };

  const toggleMenu = (visible: boolean) => {
    setMenuVisible(visible);
  };

  const handleAddRandomMeal = () => {
    const randomMeal = FancyMeals[Math.floor(Math.random() * FancyMeals.length)];
    setDishes((prevDishes) => [...prevDishes, randomMeal]);
    setTotalDishes((prevTotal) => prevTotal + 1);
    toggleMenu(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.trackerName}>PRIVATE CHEF{"\n"}CHRISTOFFEL MENU</Text>
      </View>

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
        <TouchableOpacity
          style={styles.coursePicker}
          onPress={() => toggleModal(true)}
        >
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
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add Dish</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => toggleMenu(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.menuButtonText}>Fancy Menu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryHeading}>ITEMS SUMMARY</Text>
        <FlatList
          data={dishes}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => toggleModal(false)}
      >
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select a Course</Text>
            {CourseOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => selectCourse(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => toggleModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => toggleMenu(false)}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menuView}>
            <Text style={styles.menuTitle}>Fancy Meals</Text>
            <FlatList
              data={FancyMeals}
              renderItem={({ item }) => (
                <View style={styles.fancyDishItem}>
                  <Text style={styles.fancyDishText}>{item.dish_Name}</Text>
                  <Text style={styles.fancyDishText}>{item.description}</Text>
                  <Text style={styles.fancyDishText}>R{item.price}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
              style={styles.addRandomButton}
              onPress={handleAddRandomMeal}
            >
              <Text style={styles.addRandomButtonText}>Add Random Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeMenuButton}
              onPress={() => toggleMenu(false)}
            >
              <Text style={styles.closeMenuButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  headingContainer: { marginBottom: 20 },
  trackerName: { fontSize: 32, fontWeight: "bold", color: "#FFD700", textAlign: "center" },
  inputContainer: { marginBottom: 20 },
  input: {
    height: 50, borderColor: "#FFD700", borderWidth: 2, borderRadius: 8, marginBottom: 10, paddingLeft: 10, color: "#FFF", backgroundColor: "#222", fontSize: 18,
  },
  coursePicker: { height: 50, borderColor: "#FFD700", borderWidth: 2, borderRadius: 8, marginBottom: 10, justifyContent: "center", paddingLeft: 10, backgroundColor: "#222" },
  courseText: { color: "#FFF", fontSize: 18 },
  addButton: { backgroundColor: "#FFD700", height: 50, justifyContent: "center", alignItems: "center", borderRadius: 8, marginBottom: 10 },
  addButtonText: { fontSize: 20, color: "#000", fontWeight: "bold" },
  menuButton: { backgroundColor: "#555", height: 50, justifyContent: "center", alignItems: "center", borderRadius: 8 },
  menuButtonText: { fontSize: 20, color: "#FFD700", fontWeight: "bold" },
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
  menuContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" },
  menuView: { width: "80%", backgroundColor: "#FFF", borderRadius: 20, padding: 20, alignItems: "center" },
  menuTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  fancyDishItem: { backgroundColor: "#DDD", padding: 15, marginBottom: 10, borderRadius: 8 },
  fancyDishText: { color: "#333", fontSize: 18 },
  addRandomButton: { marginTop: 10, backgroundColor: "#FFD700", padding: 10, borderRadius: 8 },
  addRandomButtonText: { fontSize: 18, color: "#000" },
  closeMenuButton: { marginTop: 20, backgroundColor: "#555", padding: 10, borderRadius: 8 },
  closeMenuButtonText: { fontSize: 18, color: "#FFD700" },
});
