//
//
//
import React from "react";
import { FlatList, View } from "react-native";
import { FlatListProps, ListRenderItemInfo } from "react-native";

interface StyledFlatListProps<T> extends FlatListProps<T> {
  padding?: number; // Optional padding
  gap?: number; // Optional gap between items
  _ref?: React.RefObject<FlatList>;
}

export default function Styled_FLATLIST<T>({
  data,
  renderItem,
  keyExtractor,
  style,
  padding = 12,
  gap = 12,
  _ref,
  ...rest
}: StyledFlatListProps<T>) {
  return (
    <FlatList
      ref={_ref}
      data={data}
      renderItem={(info: ListRenderItemInfo<T>) => (
        <View style={[{ marginBottom: gap }]}>
          {renderItem ? renderItem(info) : null}
        </View>
      )}
      keyExtractor={keyExtractor}
      style={[{ padding, flex: 1, paddingBottom: 20 }, style]}
      ListFooterComponentStyle={{ marginBottom: 50 }}
      ListFooterComponent={<View />} // For bottom padding
      {...rest}
    />
  );
} //
