//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function REPLACE_vocab(updated_VOCAB: Vocab_TYPE) {
  return (state: any) => ({
    z_vocabs: state.z_vocabs.map((existing_VOCAB: Vocab_TYPE) =>
      existing_VOCAB.id === updated_VOCAB.id ? updated_VOCAB : existing_VOCAB
    ),
  });
}
