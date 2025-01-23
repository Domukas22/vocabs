//
//
//
import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import ExploreVocabBack_BTNS from "../../../1_myVocabs/vocabCards/Components/ExploreVocabBack_BTNS/ExploreVocabBack_BTNS";
import { Vocab } from "../../../1_myVocabs/vocabCards/Vocab";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import React, { useMemo } from "react";

import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import { FetchedSupabaseVocabs_PROPS } from "@/src/features/vocabs/functions/2_exploreVocabs/fetch/hooks/USE_supabaseVocabs/USE_supabaseVocabs";

export function ExploreVocabs_FLATLIST({
  vocabs,
  listHeader_EL,
  listFooter_EL,
  SAVE_vocab,
  onScroll,
  error,
  IS_searching = true,
}: {
  vocabs: FetchedSupabaseVocabs_PROPS[] | undefined;
  listHeader_EL: React.ReactNode;
  listFooter_EL: React.ReactNode;
  error: { value: boolean; msg: string };
  SAVE_vocab: (vocab: Vocab_MODEL) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  IS_searching: boolean;
}) {
  const data = useMemo(() => {
    if (error?.value || IS_searching) return [];
    return vocabs;
  }, [IS_searching, error?.value, vocabs]);

  const Footer = () => {
    if (error?.value) return <Error_BLOCK paragraph={error?.msg} />;
    if (IS_searching)
      return (
        <View style={{ gap: 12, flex: 1 }}>
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
        </View>
      );
    return listFooter_EL;
  };

  const Vocab_BTN = (vocab: Vocab_MODEL) => (
    <Vocab
      vocab={vocab}
      vocabBack_BTNS={(TOGGLE_vocab: () => void) => (
        <ExploreVocabBack_BTNS
          {...{ TOGGLE_vocab }}
          SAVE_vocab={() => SAVE_vocab(vocab)}
          list={vocab?.list}
        />
      )}
      SHOW_list
    />
  );

  return (
    <Styled_FLASHLIST
      {...{ onScroll }}
      data={data}
      renderItem={({ item }) => Vocab_BTN(item)}
      keyExtractor={(item) => "Vocab" + item.id}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={<Footer />}
    />
  );
}
