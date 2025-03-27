//
//
//

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { TextInput } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { USE_getActiveFilterCount } from "@/src/hooks";
import { useRouter } from "expo-router";
import { t } from "i18next";

interface ListHeader_PROPS {
  list_NAME: string;
  SHOW_listName: boolean;
  IS_vocabSelectionOn?: boolean;
  selectedVocab_COUNT?: number;
  children: React.ReactNode;
}

export default function FlashlistPage_NAV({
  list_NAME = t("header.noListFound"),
  SHOW_listName,
  children,
  IS_vocabSelectionOn = false,
  selectedVocab_COUNT = 0,
}: ListHeader_PROPS) {
  const [IS_searchOpen, SET_searchOpen] = useState(false);
  const search_REF = useRef<TextInput>(null);
  const { activeFilter_COUNT } = USE_getActiveFilterCount("vocabs");
  const router = useRouter();

  const headerTranslateY = useSharedValue(-34);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate header and title visibility
    headerTranslateY.value = withTiming(SHOW_listName ? 0 : -34, {
      duration: 300,
    }); // Move header up or down
    titleOpacity.value = withTiming(SHOW_listName ? 1 : 0, { duration: 300 }); // Fade in/out title
  }, [SHOW_listName]);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  useEffect(() => {
    if (IS_searchOpen) {
      search_REF?.current?.focus();
    } else {
      // Keyboard.dismiss();
    }
  }, [search_REF, IS_searchOpen]);

  return (
    <View
      style={{
        position: "relative",
        width: "100%",
        height: 62,
        zIndex: 50,
      }}
    >
      <Animated.View style={[s.all_WRAP, animatedHeaderStyle]}>
        <View style={s.listName_WRAP}>
          <Animated.View style={animatedTitleStyle}>
            <Styled_TEXT
              type="list_title"
              numberOfLines={1}
              style={{
                height: 34,
                color: IS_vocabSelectionOn
                  ? MyColors.text_primary
                  : MyColors.text_white,
              }}
            >
              {IS_vocabSelectionOn
                ? `${selectedVocab_COUNT} ${t("title.selectedVocabs")}`
                : list_NAME}
            </Styled_TEXT>
          </Animated.View>
        </View>
        {children}
        {/* {!IS_searchOpen && (
          <View style={s.btn_WRAP}>
            <Btn
              onPress={() => router.back()}
              iconLeft={<ICON_arrow direction="left" />}
              style={{ flex: IS_searchBig ? 0 : 1 }}
            />
            {OPEN_listSettings && (
              <Btn
                onPress={OPEN_listSettings}
                iconLeft={<ICON_settings />}
                style={{ flex: IS_searchBig ? 0 : 1 }}
              />
            )}
            {search !== undefined && SET_search && IS_searchBig && (
              <SearchBar
                _ref={search_REF}
                value={search}
                SET_value={SET_search}
              />
            )}
            {search !== undefined && SET_search && !IS_searchBig && (
              <Btn
                onPress={() => SET_searchOpen(true)}
                iconLeft={<ICON_search />}
                style={{ flex: IS_searchBig ? 0 : 1 }}
              />
            )}

            {OPEN_displaySettings && (
              <Btn
                onPress={OPEN_displaySettings}
                iconLeft={<ICON_displaySettings />}
                style={{ flex: IS_searchBig ? 0 : 1 }}
                topRightIconCount={activeFilter_COUNT}
              />
            )}

            {OPEN_create && (
              <Btn
                type="simple_primary_text"
                onPress={OPEN_create}
                iconLeft={<ICON_X color="primary" big />}
                style={{ flex: IS_searchBig ? 0 : 1 }}
              />
            )}
            {SAVE_list && (
              <Btn
                onPress={SAVE_list}
                type="action"
                iconLeft={<ICON_download />}
                style={{ flex: IS_searchBig ? 0 : 1 }}
              />
            )}
          </View>
        )}
        {IS_searchOpen &&
          !IS_searchBig &&
          search !== undefined &&
          SET_search && (
            <View style={s.btn_WRAP}>
              <SearchBar
                _ref={search_REF}
                value={search}
                SET_value={SET_search}
              />
              <Btn
                text="Cancel"
                onPress={() => {
                  SET_searchOpen(false);
                  SET_search("");
                }}
              />
            </View>
          )} */}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  all_WRAP: {
    paddingHorizontal: 12,
    // height: 62,
    minHeight: 62,
    paddingTop: 12,
    paddingBottom: 8,
    borderColor: MyColors.border_white_005,
    borderBottomWidth: 1,
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: MyColors.fill_bg,
    zIndex: 10,
  },
  btn_WRAP: {
    flexDirection: "row",
    gap: 8,
  },
  listName_WRAP: {
    paddingHorizontal: 1,
  },
});
