//
//
//

import { privateOrPublic_TYPE } from "@/src/types/general_TYPES";
import { VocabBack_BTNS, VocabBack_TEXT, VocabBack_TRS } from "./_parts";
import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function Vocab_BACK({
  vocab,
  fetch_TYPE,
  list_TYPE,
  TOGGLE_vocabCard = () => {},
  OPEN_updateVocabModal = () => {},
  OPEN_vocabCopyModal = () => {},
}: {
  vocab: Vocab_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  list_TYPE: privateOrPublic_TYPE;
  TOGGLE_vocabCard: () => void;
  OPEN_updateVocabModal: () => void;
  OPEN_vocabCopyModal: () => void;
}) {
  return (
    <>
      <VocabBack_TRS vocab={vocab} />
      <VocabBack_TEXT
        vocab={vocab}
        fetch_TYPE={fetch_TYPE}
        list_TYPE={list_TYPE}
      />

      <VocabBack_BTNS
        {...{ vocab, list_TYPE, fetch_TYPE }}
        TOGGLE_vocabCard={TOGGLE_vocabCard}
        OPEN_updateVocabModal={OPEN_updateVocabModal}
        OPEN_vocabCopyModal={OPEN_vocabCopyModal}
      />
    </>
  );
}
