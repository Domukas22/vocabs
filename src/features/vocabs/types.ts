//
//
//

export interface currentVocabAction_TYPE {
  vocab_ID: string;
  action:
    | "deleting"
    | "updating"
    | "updating_difficulty"
    | "updating_marked"
    | "moving"
    | "copying";
  new_DIFFICULTY?: number;
}
