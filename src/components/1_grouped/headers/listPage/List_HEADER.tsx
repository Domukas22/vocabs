import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_3dots,
  ICON_arrow,
  ICON_displaySettings,
  ICON_download,
  ICON_search,
  ICON_settings,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import SearchBar from "@/src/components/1_grouped/inputs/SearchBar/SearchBar";
import { TextInput } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { USE_getActiveFilterCount } from "@/src/hooks";

interface ListHeader_PROPS {
  SHOW_listName: boolean;

  IS_searchBig?: boolean;
  list_NAME?: string;
  search: string | undefined;
  SET_search: React.Dispatch<React.SetStateAction<string>> | undefined;
  GO_back?: () => void | undefined;
  OPEN_listSettings?: () => void | undefined;
  OPEN_create?: () => void | undefined;
  OPEN_displaySettings?: () => void | undefined;
  SAVE_list?: () => void | undefined;
  oneList: boolean;
}

export default function List_HEADER({
  SHOW_listName,
  list_NAME = "INSERT LIST NAME",
  search,
  IS_searchBig = false,
  SET_search,
  GO_back,
  OPEN_listSettings,
  OPEN_create,
  OPEN_displaySettings,
  SAVE_list,
  oneList = true,
}: ListHeader_PROPS) {
  const [IS_searchOpen, SET_searchOpen] = useState(false);
  const search_REF = useRef<TextInput>(null);
  const { activeFilter_COUNT } = USE_getActiveFilterCount(
    oneList ? "vocabs" : "lists"
  );

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
    }
  }, [search_REF, IS_searchOpen]);

  return (
    <View
      style={{
        position: "relative",
        width: "100%",
        height: 62,
        // borderWidth: 1,
        // borderColor: "yellow",
        zIndex: 50,
      }}
    >
      <Animated.View style={[s.all_WRAP, animatedHeaderStyle]}>
        <View style={s.listName_WRAP}>
          <Animated.View style={animatedTitleStyle}>
            <Styled_TEXT
              type="list_title"
              numberOfLines={1}
              style={{ height: 34 }}
            >
              {list_NAME}
            </Styled_TEXT>
          </Animated.View>
        </View>

        {!IS_searchOpen && (
          <View style={s.btn_WRAP}>
            {GO_back && (
              <Btn
                onPress={GO_back}
                iconLeft={<ICON_arrow direction="left" />}
                style={{ flex: IS_searchBig ? 0 : 1 }}
              />
            )}
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
          )}
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
