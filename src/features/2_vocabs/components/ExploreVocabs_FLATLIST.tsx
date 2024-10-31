import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import ExploreVocabBack_BTNS from "./Vocab/Components/ExploreVocabBack_BTNS/ExploreVocabBack_BTNS";
import Vocab from "./Vocab/Vocab";
import ExploreVocabsFlatlistBottom_SECTION from "./ExploreVocabsFlatlistBottom_SECTION";
import Flatlist_HEADER from "@/src/components/Flatlist_HEADER";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import React from "react";
import {
  z_setVocabDisplaySettings_PROPS,
  z_vocabDisplaySettings_PROPS,
} from "@/src/zustand";
import Btn from "@/src/components/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_flag,
  ICON_X,
} from "@/src/components/icons/icons";
import VocabsFlatlistHeader_SECTION from "./VocabsFlatlistHeader_SECTION";
import { HEADER_MARGIN } from "@/src/constants/globalVars";

export default function ExploreVocabs_FLATLIST({
  vocabs,
  listHeader_EL,
  listFooter_EL,
  SAVE_vocab,
  onScroll,
}: {
  vocabs: Vocab_MODEL[] | undefined;
  listHeader_EL: React.ReactNode;
  listFooter_EL: React.ReactNode;
  SAVE_vocab: (vocab: Vocab_MODEL) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  return (
    <Styled_FLATLIST
      {...{ onScroll }}
      data={vocabs}
      renderItem={({ item }) => {
        return (
          <Vocab
            vocab={item}
            vocabBack_BTNS={(TOGGLE_vocab: () => void) => (
              <ExploreVocabBack_BTNS
                {...{ TOGGLE_vocab }}
                SAVE_vocab={() => SAVE_vocab(item)}
                list={item?.list}
              />
            )}
            SHOW_list
          />
        );
      }}
      keyExtractor={(item) => "PublicVocab" + item.id}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={listFooter_EL}
      // ListFooterComponent={
      //   <ExploreVocabsFlatlistBottom_SECTION
      //     {...{
      //       IS_loadingMore,
      //       HAS_reachedEnd,
      //       ARE_vocabsFetching,
      //       LOAD_more,
      //     }}
      //   />
      // }
    />
  );
}
