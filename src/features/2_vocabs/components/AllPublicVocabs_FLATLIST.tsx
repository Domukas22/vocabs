import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import PublicVocabBack_BTNS from "./Vocab/Components/PublicVocabBack_BTNS/PublicVocabBack_BTNS";
import Vocab from "./Vocab/Vocab";

export default function AllPublicVocabs_FLATLIST({
  vocabs,
  bottom_SECTION,
  SAVE_vocab,
}: {
  vocabs: Vocab_MODEL[] | undefined;
  bottom_SECTION: React.ReactNode;
  SAVE_vocab: (vocab: Vocab_MODEL) => void;
}) {
  return (
    <Styled_FLATLIST
      data={vocabs}
      renderItem={({ item }) => {
        return (
          <Vocab
            vocab={item}
            vocabBack_BTNS={(TOGGLE_vocab: () => void) => (
              <PublicVocabBack_BTNS
                {...{ TOGGLE_vocab }}
                SAVE_vocab={() => SAVE_vocab(item)}
                list={item?.list}
              />
            )}
            SHOW_list
          ></Vocab>
        );
      }}
      keyExtractor={(item) => "PublicVocab" + item.id}
      ListFooterComponent={<>{bottom_SECTION}</>}
    />
  );
}
