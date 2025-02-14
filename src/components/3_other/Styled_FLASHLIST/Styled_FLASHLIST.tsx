//
//
//

import React from "react";
import { View } from "react-native";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { HEADER_MARGIN } from "@/src/constants/globalVars";
import { MyColors } from "@/src/constants/MyColors";

interface StyledFlatListProps<T> extends FlashListProps<T> {
  padding?: number; // Optional padding
  gap?: number; // Optional gap between items
  flashlist_REF?: React.RefObject<FlashList<T>>;
  headerPadding?: boolean;
}

export default function Styled_FLASHLIST<T>({
  data,
  renderItem,
  keyExtractor,
  padding = 12,
  gap = 12,
  headerPadding = false,
  flashlist_REF,
  onScroll,
  ...rest
}: StyledFlatListProps<T>) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: MyColors.fill_bg,
        width: "100%",
      }}
    >
      <FlashList
        keyboardShouldPersistTaps="always"
        onScroll={onScroll}
        ref={flashlist_REF}
        data={data}
        renderItem={({ item }) => (
          <View style={[{ marginBottom: gap, flex: 1, width: "100%" }]}>
            {renderItem ? renderItem({ item }) : null}
          </View>
          // <View style={[{ marginBottom: gap, flex: 1 }]}>
          //   {renderItem ? renderItem({ item }) : null}
          // </View>
        )}
        keyExtractor={keyExtractor}
        estimatedItemSize={100}
        contentContainerStyle={{
          padding,
          paddingBottom: 40,
          paddingTop: headerPadding ? HEADER_MARGIN || 80 : 0,
        }}
        ListFooterComponentStyle={{ marginBottom: 50 }}
        {...rest}
      />
    </View>
  );
}
