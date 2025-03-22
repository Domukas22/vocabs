//
//
//

import mitt from "mitt";
import { Vocab_TYPE } from "../features_new/vocabs/types";

type Events = {
  vocabUpdated: Vocab_TYPE;
  vocabCreated: Vocab_TYPE;
  vocabDeleted: string;
  test: string;
};

export const Global_EVENTS = mitt<Events>();
