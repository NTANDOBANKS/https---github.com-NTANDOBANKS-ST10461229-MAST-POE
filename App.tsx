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
  const [removedDishes, setRemovedDishes] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fancyMenuVisible, setFancyMenuVisible] = useState<boolean>(false);
  const [restoreModalVisible, setRestoreModalVisible] = useState<boolean>(false);
  const [fadeAnim] = useState(new Animated.Value(1)); // Animation state

  const CourseOptions = ["Starter", "Main Course", "Dessert", "Beverage"];
  const FancyMeals = [
    { dish_Name: "Truffle Pasta", description: "Rich truffle-infused pasta.", course: "Main Course", price: 350 },
    { dish_Name: "Caviar Canapé", description: "Luxury starter with fine caviar.", course: "Starter", price: 500 },
    { dish_Name: "Chocolate Fondue", description: "Molten chocolate dessert.", course: "Dessert", price: 250 },
    { dish_Name: "Vintage Wine", description: "Premium aged red wine.", course: "Beverage", price: 800 },
  ];

  const handleSubmit = () => {
    const priceNum = parseFloat(price);
    if (!dishName.trim() || !description.trim() || course === "Select a Course" || isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Input Error", "Please complete all fields correctly.", [{ text: "OK" }]);
      return;
    }

    const newDish = { dish_Name: dishName.trim(), description: description.trim(), course, price: priceNum };
    setDishes((prev) => [...prev, newDish]);
    resetFields();
  };

  const resetFields = () => {
    setDishName("");
    setDescription("");
    setCourse("Select a Course");
    setPrice("");
  };

  const removeDish = (index: number) => {
    const dishToRemove = dishes[index];
    setRemovedDishes((prev) => [...prev, dishToRemove]);

    // Animate fade-out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDishes((prev) => prev.filter((_, i) => i !== index)); // Remove after animation
      fadeAnim.setValue(1); // Reset animation
    });
  };

  const restoreDish = (index: number) => {
    const dishToRestore = removedDishes[index];
    setDishes((prev) => [...prev, dishToRestore]);
    setRemovedDishes((prev) => prev.filter((_, i) => i !== index));
  };

  const addFancyMeal = (meal: any) => {
    setDishes((prev) => [...prev, meal]);
    setFancyMenuVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      //HEADER SPACE
      <View style={styles.headingContainer}>
        <Text style={styles.trackerName}>PRIVATE CHEF{"\n"}CHRISTOFFEL MENU</Text>
      </View>

    //FORM SPACE
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
        <TouchableOpacity style={styles.fancyMenuButton} onPress={() => setFancyMenuVisible(true)}>
          <Text style={styles.fancyMenuButtonText}>View Fancy Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={() => setRestoreModalVisible(true)}
        >
          <Text style={styles.restoreButtonText}>Restore Removed Dishes</Text>
        </TouchableOpacity>
      </View>

      //MENU SPACE
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryHeading}>CURRENT MENU</Text>
        <Text style={styles.totalDishes}>Total Dishes: {dishes.length}</Text>
        <FlatList
          data={dishes}
          renderItem={({ item, index }) => (
            <Animated.View style={[styles.dishItem, { opacity: fadeAnim }]}>
              <Text style={styles.dishText}>{item.dish_Name}</Text>
              <Text style={styles.dishText}>{item.description}</Text>
              <Text style={styles.dishText}>{item.course}</Text>
              <Text style={styles.dishText}>R{item.price.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeDish(index)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      //MODAL SPACE
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select a Course</Text>
            {CourseOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => {
                  setCourse(option);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      //FANCY MENU SPACE
      <Modal animationType="slide" transparent={true} visible={fancyMenuVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Fancy Meals</Text>
            {FancyMeals.map((meal, index) => (
              <View key={index} style={styles.fancyMealItem}>
                <Text style={styles.fancyMealText}>{meal.dish_Name}</Text>
                <Text style={styles.fancyMealText}>{meal.description}</Text>
                <Text style={styles.fancyMealText}>R{meal.price}</Text>
                <TouchableOpacity
                  style={styles.addFancyButton}
                  onPress={() => addFancyMeal(meal)}
                >
                  <Text style={styles.addFancyButtonText}>Add to Menu</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFancyMenuVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      //RESTORE SPACE
      <Modal
        animationType="slide"
        transparent={true}
        visible={restoreModalVisible}
        onRequestClose={() => setRestoreModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Removed Dishes</Text>
            {removedDishes.length > 0 ? (
              <FlatList
                data={removedDishes}
                renderItem={({ item, index }) => (
                  <View style={styles.dishItem}>
                    <Text style={styles.dishText}>{item.dish_Name}</Text>
                    <Text style={styles.dishText}>{item.course}</Text>
                    <TouchableOpacity
                      style={styles.restoreDishButton}
                      onPress={() => restoreDish(index)}
                    >
                      <Text style={styles.restoreDishButtonText}>Put Back</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <Text style={styles.noDishesText}>No removed dishes to restore.</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setRestoreModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
// sTYLING SPACE AND STYLING TESTING
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
  fancyMenuButton: { backgroundColor: "#444", height: 50, justifyContent: "center", alignItems: "center", borderRadius: 8 },
  fancyMenuButtonText: { fontSize: 20, color: "#FFD700", fontWeight: "bold" },
  restoreButton: { backgroundColor: "#444", height: 50, justifyContent: "center", alignItems: "center", borderRadius: 8 },
  restoreButtonText: { fontSize: 20, color: "#FFD700", fontWeight: "bold" },
  summaryContainer: { marginTop: 20 },
  summaryHeading: { fontSize: 28, fontWeight: "bold", color: "#FFD700", textAlign: "center" },
  totalDishes: { fontSize: 22, fontWeight: "bold", marginTop: 10, color: "#FFD700", textAlign: "center" },
  dishItem: { backgroundColor: "#333", padding: 15, marginBottom: 10, borderRadius: 8 },
  dishText: { color: "#FFD700", fontSize: 18 },
  removeButton: { marginTop: 10, backgroundColor: "#FF4500", padding: 10, borderRadius: 8 },
  removeButtonText: { fontSize: 18, color: "#FFF" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" },
  modalView: { width: "80%", backgroundColor: "#FFF", borderRadius: 20, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  optionButton: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#FFD700", width: "100%", alignItems: "center" },
  optionText: { fontSize: 18, color: "#000" },
  closeButton: { marginTop: 20, backgroundColor: "#FFD700", padding: 10, borderRadius: 8 },
  closeButtonText: { fontSize: 18, color: "#000" },
  fancyMealItem: { backgroundColor: "#DDD", padding: 15, marginBottom: 10, borderRadius: 8 },
  fancyMealText: { fontSize: 18, color: "#333" },
  addFancyButton: { marginTop: 10, backgroundColor: "#FFD700", padding: 10, borderRadius: 8 },
  addFancyButtonText: { fontSize: 18, color: "#000" },
  restoreDishButton: { marginTop: 10, backgroundColor: "#32CD32", padding: 10, borderRadius: 8 },
  restoreDishButtonText: { fontSize: 18, color: "#FFF" },
  noDishesText: { fontSize: 18, color: "#FFF", textAlign: "center", marginTop: 20 },
});
