//
//
//

import { ActivityIndicator, View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { useCallback } from "react";
import { USE_getActiveFilterCount, USE_zustand } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/features/vocabs/functions/1_myVocabs/fetch/hooks/USE_myVocabs/USE_myVocabs";

export default function BottomAction_BLOCK({
  type = "list",
  loading_STATE,
  search = "",
  IS_debouncing = false,
  HAS_reachedEnd = false,
  LOAD_more = async () => {},

  totalFilteredResults_COUNT = 0,
  createBtn_ACTION,
  RESET_search = () => {},
}: {
  type: "list" | "vocabs" | "users";
  loading_STATE: loadingState_TYPES;
  search: string;
  IS_debouncing: boolean;
  HAS_reachedEnd: boolean;
  LOAD_more: () => Promise<void>;

  totalFilteredResults_COUNT: number;
  RESET_search: () => void;
  createBtn_ACTION?: () => void;
}) {
  const { z_SET_listDisplaySettings, z_SET_vocabDisplaySettings } =
    USE_zustand();
  const { activeFilter_COUNT } = USE_getActiveFilterCount("lists");

  const RESET_filters = useCallback(() => {
    if (type === "list") {
      z_SET_listDisplaySettings({ langFilters: [] });
    }
    if (type === "vocabs") {
      z_SET_vocabDisplaySettings({ langFilters: [], difficultyFilters: [] });
    }
  }, [z_SET_listDisplaySettings]);

  return (
    <View style={{ gap: 16 }}>
      {HAS_reachedEnd && totalFilteredResults_COUNT > 0 && (
        <View
          style={{
            width: "100%",
            height: 2,
            borderColor: MyColors.border_white_005,
            borderTopWidth: 2,
          }}
        />
      )}

      {totalFilteredResults_COUNT === 0 && (
        <View
          style={{
            paddingVertical: 24,
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: MyColors.border_white_005,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Styled_TEXT type="label">
            {type === "vocabs"
              ? "No vocabs found"
              : type === "list"
              ? "No lists found"
              : "No users found"}
          </Styled_TEXT>
        </View>
      )}

      <View style={{ gap: 8 }}>
        {search &&
          activeFilter_COUNT === 0 &&
          HAS_reachedEnd &&
          !IS_debouncing && (
            <Btn
              text={`Clear search '${search}'`}
              onPress={RESET_search}
              type="delete"
            />
          )}
        {activeFilter_COUNT > 0 &&
          !search &&
          HAS_reachedEnd &&
          !IS_debouncing && (
            <Btn
              text={`Clear ${activeFilter_COUNT} active filters`}
              onPress={RESET_filters}
              type="delete"
            />
          )}

        {activeFilter_COUNT > 0 && search !== "" && !IS_debouncing && (
          <Btn
            text="Clear search and filters"
            onPress={() => {
              RESET_filters();
              RESET_search();
            }}
            type="delete"
          />
        )}

        {!HAS_reachedEnd &&
          totalFilteredResults_COUNT > 0 &&
          !IS_debouncing && (
            <Btn
              text={loading_STATE !== "loading_more" ? "Load more" : ""}
              iconLeft={
                loading_STATE === "loading_more" ? (
                  <ActivityIndicator color="white" />
                ) : null
              }
              onPress={async () => {
                if (loading_STATE !== "loading_more") {
                  await LOAD_more();
                }
              }}
              type="seethrough"
            />
          )}
      </View>
    </View>
  );
}
