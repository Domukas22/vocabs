//
//
//

import { useState } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

export const USE_showListHeaderTitle = () => {
  const [showTitle, setShowTitle] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    // Safely access contentOffset.y by providing a default value of 0
    const scrollY = contentOffset?.y ?? 0; // If contentOffset is undefined or null, fallback to 0
    setShowTitle(scrollY > 40);
  };

  return { showTitle, handleScroll };
};
