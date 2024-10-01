import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

const NUM_SQUARES = 20; // Total number of squares
const SQUARE_SIZE = 60; // Size of each square
const GRID_SIZE = Math.ceil(Math.sqrt(NUM_SQUARES)); // Calculate grid size

const MultiSelectGrid = () => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Function to toggle selection based on touch location
  const handleTouch = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    // Calculate the index of the square based on touch location
    const xIndex = Math.floor(locationX / SQUARE_SIZE);
    const yIndex = Math.floor(locationY / SQUARE_SIZE);
    const squareIndex = yIndex * GRID_SIZE + xIndex;

    // Check if the touch is within bounds
    if (squareIndex >= 0 && squareIndex < NUM_SQUARES) {
      const newSelectedIds = new Set(selectedIds);
      if (newSelectedIds.has(squareIndex)) {
        newSelectedIds.delete(squareIndex); // Unselect if already selected
      } else {
        newSelectedIds.add(squareIndex); // Select if not selected
      }
      setSelectedIds(newSelectedIds);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={styles.container}>
        {Array.from({ length: NUM_SQUARES }, (_, index) => (
          <View
            key={index}
            style={[
              styles.square,
              { backgroundColor: selectedIds.has(index) ? "blue" : "gray" },
            ]}
          />
        ))}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: GRID_SIZE * SQUARE_SIZE,
    height: GRID_SIZE * SQUARE_SIZE,
    borderWidth: 1,
    borderColor: "black",
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    margin: 2,
  },
});

export default MultiSelectGrid;
