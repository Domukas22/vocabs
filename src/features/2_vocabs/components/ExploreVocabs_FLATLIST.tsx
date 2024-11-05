//
//
//
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import ExploreVocabBack_BTNS from "./Vocab/Components/ExploreVocabBack_BTNS/ExploreVocabBack_BTNS";
import Vocab from "./Vocab/Vocab";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import React from "react";
import { View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import Skeleton from "@/src/components/Skeleton";
import Skeleton_VIEW from "@/src/components/Skeleton_VIEW";

export default function ExploreVocabs_FLATLIST({
  vocabs,
  listHeader_EL,
  listFooter_EL,
  SAVE_vocab,
  onScroll,
  IS_searching = true,
}: {
  vocabs: Vocab_MODEL[] | undefined;
  listHeader_EL: React.ReactNode;
  listFooter_EL: React.ReactNode;
  SAVE_vocab: (vocab: Vocab_MODEL) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  IS_searching: boolean;
}) {
  return !IS_searching ? (
    <Styled_FLASHLIST
      {...{ onScroll }}
      data={vocabs}
      // extraData={IS_searching}
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
    />
  ) : (
    <Skeleton_VIEW />
  );
}
