import React from "react";
import { View } from "react-native";
import { FlashList, FlashListProps } from "@shopify/flash-list";

interface StyledFlatListProps<T> extends FlashListProps<T> {
  padding?: number; // Optional padding
  gap?: number; // Optional gap between items
  _ref?: React.RefObject<FlashList<T>>;
}

export default function Styled_FLATLIST<T>({
  data,
  renderItem,
  keyExtractor,
  padding = 12,
  gap = 12,
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
        }}
        ListFooterComponentStyle={{ marginBottom: 50 }}
        ListFooterComponent={<View />} // For bottom padding
        {...rest}
      />
    </View>
  );
}
