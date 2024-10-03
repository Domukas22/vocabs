import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import languages from "@/src/constants/languages"; // Adjust based on your project structure
import Highlighted_TEXT from "../Highlighted_TEXT/Highlighted_TEXT";
import { ICON_flag } from "../icons/icons";
import Styled_FLATLIST from "../Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import { USE_searchedLangs } from "@/src/features/4_languages/hooks/USE_searchedLangs/USE_searchedLangs";
import Subnav from "../Subnav/Subnav";
import SearchBar from "../SearchBar/SearchBar";

export default function LangHighlightCheck_FLATLIST() {
  const { languages } = USE_langs();
  const [highlights, setHighlights] = useState(
    languages.map((item) => item.translation_example_highlights || [])
  );

  const { searched_LANGS, search, SEARCH_langs, ARE_langsSearching } =
    USE_searchedLangs(languages);

  const handleHighlightChange = useCallback((index, newHighlights) => {
    setHighlights((prevHighlights) => {
      const updatedHighlights = [...prevHighlights];
      updatedHighlights[index] = newHighlights;
      return updatedHighlights;
    });
  }, []);

  return (
    <>
      <Subnav>
        <SearchBar value={search} SET_value={SEARCH_langs} />
      </Subnav>
      <Styled_FLATLIST
        data={searched_LANGS || []}
        renderItem={({ item, index }) => (
          <HighlightItem
            item={item}
            index={index}
            currentHighlights={highlights[index]}
            onHighlightChange={handleHighlightChange}
          />
        )}
      />
    </>
  );
}

const HighlightItem = React.memo(
  ({ item, index, currentHighlights, onHighlightChange }) => {
    const exampleText = item.translation_example || "";
    const exampleLength = exampleText.length;

    // Calculate initial start and end based on current highlights
    const startHighlight = currentHighlights[0] || 0;
    const endHighlight =
      currentHighlights[currentHighlights.length - 1] ||
      Math.min(exampleLength - 1, 5); // Length - 1 for slider

    return (
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <ICON_flag lang={item.id} />
          <Styled_TEXT>Lang: {item.lang_in_en}</Styled_TEXT>
        </View>
        <Highlighted_TEXT
          text={exampleText}
          highlights={currentHighlights} // Use current highlights for this translation
          modal_DIFF={0}
        />
        <Highlight_SLIDER
          start={startHighlight}
          end={endHighlight}
          max={exampleLength - 1} // Set max to text length - 1
          onChange={(newHighlights) => onHighlightChange(index, newHighlights)} // Update specific highlights
        />
      </View>
    );
  }
);

function Highlight_SLIDER({
  start = 0,
  end = 5,
  max = 20,
  onChange = () => {},
}) {
  const [sliderValues, setSliderValues] = useState([start, end]);

  // Update sliderValues when props change
  useEffect(() => {
    setSliderValues([start, end]);
  }, [start, end]);

  const onValuesChange = (values) => {
    setSliderValues(values);

    // Create the new highlights based on slider values
    const newHighlights = Array.from(
      { length: values[1] - values[0] + 1 },
      (_, i) => i + values[0]
    );
    onChange(newHighlights); // Call the onChange prop with the new highlights
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <MultiSlider
          values={sliderValues}
          onValuesChange={onValuesChange} // Update highlights on value change
          min={0}
          max={max}
          step={1}
          allowOverlap={false}
          isMarkersSeparated={true}
          customMarkerLeft={(e) => (
            <View style={styles.customMarker}>
              <Text>{e.currentValue}</Text>
            </View>
          )}
          customMarkerRight={(e) => (
            <View style={styles.customMarker}>
              <Text>{e.currentValue}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    marginTop: 20,
  },
  customMarker: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: "#1fb28a",
    justifyContent: "center",
    alignItems: "center",
  },
});