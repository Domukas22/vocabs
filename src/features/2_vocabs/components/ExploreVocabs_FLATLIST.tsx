//
//
//
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import ExploreVocabBack_BTNS from "./Vocab/Components/ExploreVocabBack_BTNS/ExploreVocabBack_BTNS";
import Vocab from "./Vocab/Vocab";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import React, { useMemo } from "react";

import Skeleton_VIEW from "@/src/components/Skeleton_VIEW";
import Error_SECTION from "@/src/components/Error_SECTION";
import { FetchedSupabaseVocabs_PROPS } from "@/src/hooks/USE_supabaseVocabs";

export default function ExploreVocabs_FLATLIST({
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
    if (error?.value) return <Error_SECTION paragraph={error?.msg} />;
    if (IS_searching) return <Skeleton_VIEW />;
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
