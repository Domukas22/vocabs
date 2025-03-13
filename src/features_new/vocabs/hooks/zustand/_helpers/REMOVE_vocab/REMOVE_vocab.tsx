//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function REMOVE_vocab(vocab_ID: string) {
  return (state: any) => ({
    z_vocabs: state.z_vocabs.filter((x: Vocab_TYPE) => x.id !== vocab_ID),
    z_unpaginated_COUNT: state.z_unpaginated_COUNT - 1,
  });
}
