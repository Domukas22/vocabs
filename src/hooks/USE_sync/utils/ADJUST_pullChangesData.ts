//
//
//

import TURN_langExampleHighlightsIntoJson from "./TURN_langExampleHighlightsIntoJson";
import TURN_VocabtrsIntoJson from "./TURN_VocabtrsIntoJson";

export default function ADJUST_pullChangesData(changes: any) {
  const updatedChanges = {
    ...changes,
    vocabs: TURN_VocabtrsIntoJson(changes.vocabs),
    languages: TURN_langExampleHighlightsIntoJson(changes.languages),
  };

  return updatedChanges;
}
