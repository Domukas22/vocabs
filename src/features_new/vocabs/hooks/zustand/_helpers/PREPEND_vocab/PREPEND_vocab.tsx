//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function PREPEND_vocab(new_VOCAB: Vocab_TYPE) {
  return (state: any) => ({
    z_vocabs: [new_VOCAB, ...state.z_vocabs],
    z_unpaginated_COUNT: state.z_unpaginated_COUNT + 1,
  });
}
