import React from "react";
import { View } from "react-native";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { HEADER_MARGIN } from "@/src/constants/globalVars";

interface StyledFlatListProps<T> extends FlashListProps<T> {
  padding?: number; // Optional padding
  gap?: number; // Optional gap between items
  _ref?: React.RefObject<FlashList<T>>;
  headerPadding?: boolean;
}

export default function Styled_FLASHLIST<T>({
  data,
  renderItem,
  keyExtractor,
  padding = 12,
  gap = 12,
  headerPadding = false,
  _ref,
  onScroll,
  ...rest
}: StyledFlatListProps<T>) {
  return (
    <View style={{ flex: 1 }}>
      <FlashList
        keyboardShouldPersistTaps="always"
        onScroll={onScroll}
        ref={_ref}
        data={data}
        renderItem={({ item }) => (
          <View style={[{ marginBottom: gap, flex: 1 }]}>
            {renderItem ? renderItem({ item }) : null}
          </View>
          // <View style={[{ marginBottom: gap, flex: 1 }]}>
          //   {renderItem ? renderItem({ item }) : null}
          // </View>
        )}
        keyExtractor={keyExtractor}
        estimatedItemSize={100} // Adjust based on the approximate size of your items
        contentContainerStyle={{
          padding,
          paddingBottom: 40,
          paddingTop: headerPadding ? HEADER_MARGIN || 80 : 0,
        }}
        ListFooterComponentStyle={{ marginBottom: 50 }}
        ListFooterComponent={<View />} // For bottom padding
        {...rest}
      />
    </View>
  );
}
