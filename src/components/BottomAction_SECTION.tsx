//
//
//

import { ActivityIndicator, View } from "react-native";
import { MyColors } from "../constants/MyColors";
import Btn from "./Btn/Btn";
import { Styled_TEXT } from "./Styled_TEXT/Styled_TEXT";
import { useMemo } from "react";
import { ICON_X } from "./icons/icons";

export default function BottomAction_SECTION({
  type = "list",
  search = "",
  IS_debouncing = false,
  IS_loadingMore = false,
  HAS_reachedEnd = false,
  activeFilter_COUNT = 0,
  totalFilteredResults_COUNT = 0,
  createBtn_ACTION,
  LOAD_more = async () => {},
  RESET_search = () => {},
  RESET_filters = () => {},
}: {
  type: "list" | "vocabs" | "users";
  search: string;
  IS_debouncing: boolean;
  IS_loadingMore: boolean;
  HAS_reachedEnd: boolean;
  activeFilter_COUNT: number;
  totalFilteredResults_COUNT: number;
  LOAD_more: () => Promise<void>;
  RESET_search: () => void;
  createBtn_ACTION?: () => void;
  RESET_filters?: () => void;
}) {
  return (
    <View style={{ gap: 16 }}>
      {HAS_reachedEnd && totalFilteredResults_COUNT > 0 && (
        <>
          <View
            style={{
              width: "100%",
              height: 2,
              borderColor: MyColors.border_white_005,
              borderTopWidth: 2,
            }}
          />
          {/* {createBtn_ACTION && (
            <Btn
              type="seethrough_primary"
              iconLeft={<ICON_X big color="primary" />}
              text={`Create new ${type === "list" ? "list" : "vocab"}`}
              onPress={createBtn_ACTION}
            />
          )} */}
        </>
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
              text={!IS_loadingMore ? "Load more" : ""}
              iconLeft={
                IS_loadingMore ? <ActivityIndicator color="white" /> : null
              }
              onPress={async () => {
                if (!IS_loadingMore) {
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
