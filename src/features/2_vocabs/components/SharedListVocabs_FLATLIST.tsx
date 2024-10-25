//
//

import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import PublicVocabBack_BTNS from "./Vocab/Components/PublicVocabBack_BTNS/PublicVocabBack_BTNS";
import Vocab from "./Vocab/Vocab";
import SharedVocabBack_BTNS from "./SharedVocabBack_BTNS";

//
export default function SharedListVocabs_FLATLIST({
  vocabs,
  bottom_SECTION,
  SAVE_vocab,
}: {
  vocabs: Vocab_MODEL[];
  bottom_SECTION: React.ReactNode;
  SAVE_vocab: (vocab: Vocab_MODEL) => void;
}) {
  return (
    <Styled_FLATLIST
      data={vocabs}
      renderItem={({ item }) => {
        // const [open, TOGGLE_open] = USE_toggle(false);

        return (
          <Vocab
            vocab={item}
            vocabBack_BTNS={(TOGGLE_vocab: () => void) => (
              <SharedVocabBack_BTNS
                {...{ TOGGLE_vocab }}
                SAVE_vocab={() => SAVE_vocab(item)}
                list={item?.list}
              />
            )}
            SHOW_list
          />
        );
      }}
      keyExtractor={(item) => "SharedVocab" + item.id}
      ListFooterComponent={<>{bottom_SECTION}</>}
    />
  );
}
