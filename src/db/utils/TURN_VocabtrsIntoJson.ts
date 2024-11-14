//
//
//

import { Vocab_MODEL } from "../watermelon_MODELS";

export default function TURN_VocabtrsIntoJson(vocabs: {
  created?: Vocab_MODEL[];
  updated?: Vocab_MODEL[];
  deleted?: string[];
}) {
  return {
    ...vocabs,
    updated:
      vocabs.updated?.map((vocab) => ({
        ...vocab,
        trs: JSON.stringify(vocab.trs), // Convert trs array to JSON string
      })) || [], // Default to an empty array if undefined
    created:
      vocabs.created?.map((vocab) => ({
        ...vocab,
        trs: JSON.stringify(vocab.trs), // Convert trs array to JSON string
      })) || [], // Default to an empty array if undefined
  };
}
