//
//
//

import { useState } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

const USE_showListHeaderTitle = () => {
  const [showTitle, setShowTitle] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowTitle(scrollY > 5);
  };

  return { showTitle, handleScroll };
};

export default USE_showListHeaderTitle;
