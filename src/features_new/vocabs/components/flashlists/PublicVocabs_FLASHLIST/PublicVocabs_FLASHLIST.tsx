//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import {
  USE_zustand,
  USE_getMyListName,
  USE_getPublicListName,
} from "@/src/hooks";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { USE_vocabZustandActions } from "@/src/features_new/vocabs/hooks/USE_vocabZustandActions/USE_vocabZustandActions";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef } from "react";
import { VocabFlashlist_HEADER } from "../../../../../features/vocabs/components";
import { USE_openVocabs } from "../../../../../features/vocabs/vocabList/USE_openVocabs/USE_openVocabs";
import { Vocab_CARD } from "../../../../../features/vocabs/vocabList/Vocabs_LIST/helpers";
import * as Haptics from "expo-haptics";
import { vocabFetch_TYPES } from "../../../hooks/fetchVocabs/FETCH_vocabs/types";

import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { USE_listIdInParams } from "../../../../../features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import { list_TYPES } from "@/src/features_new/lists/types";
import { z_USE_publicVocabs } from "../../../hooks/zustand/z_USE_publicVocabs/z_USE_publicVocabs";
import { VocabFlatlist_FOOTER } from "../components/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import { raw_Vocab_TYPE, Vocab_TYPE } from "../../../types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";

export default function PublicVocabs_FLASHLIST({
  IS_debouncing = false,
  OPEN_copyVocabModal = () => {},
  handleScroll = () => {},
  Header,
  Footer,
}: {
  IS_debouncing: boolean;
  OPEN_copyVocabModal?: () => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  Header: React.JSX.Element;
  Footer: React.JSX.Element;
}) {
  const flashlist_REF = useRef<FlashList<any>>(null);
  const { z_currentActions } = z_USE_currentActions();

  const {
    z_publicVocabs,
    z_publicVocabsFetch_TYPE,
    z_publicVocabsLoading_STATE,
    z_publicVocabs_ERROR: error,
  } = z_USE_publicVocabs();

  return (
    <Styled_FLASHLIST
      onScroll={handleScroll}
      data={
        IS_debouncing ||
        error ||
        (z_publicVocabsLoading_STATE !== "none" &&
          z_publicVocabsLoading_STATE !== "error" &&
          z_publicVocabsLoading_STATE !== "loading_more")
          ? []
          : z_publicVocabs || []
      }
      flashlist_REF={flashlist_REF}
      renderItem={({ item }: { item: Vocab_TYPE }) => (
        <Vocab_CARD
          vocab={item}
          list_TYPE="public"
          fetch_TYPE={z_publicVocabsFetch_TYPE}
        />
      )}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={[z_currentActions]}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
}
