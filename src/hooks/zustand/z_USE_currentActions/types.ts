//
//
//

export type currentActionItem_TYPE = "list" | "vocab";

export type listAction_TYPE = {
  item_TYPE: "list";
  item_ID: string;
  item_ACTION:
    | "deleting"
    | "updating_name"
    | "resetting_difficulties"
    | "updating_default_lang_ids"
    | "updating_updated_at"
    | "recollecting_lang_ids";
};
export type vocabAction_TYPE = {
  item_TYPE: "vocab";
  item_ID: string;
  item_ACTION:
    | "deleting"
    | "updating"
    | "updating_difficulty"
    | "updating_marked"
    | "moving"
    | "copying";
};

export type currentAction_TYPE = listAction_TYPE | vocabAction_TYPE;

type ADD_currentAction_TYPE = {
  (
    item_TYPE: "list",
    item_ID: string,
    item_ACTION: listAction_TYPE["item_ACTION"]
  ): void;
  (
    item_TYPE: "vocab",
    item_ID: string,
    item_ACTION: vocabAction_TYPE["item_ACTION"]
  ): void;
};

export type z_USE_currentActions_PROPS = {
  z_currentActions: currentAction_TYPE[];
  ADD_currentAction: ADD_currentAction_TYPE;
  REMOVE_currentAction: (
    item_ID: string,
    item_ACTION:
      | listAction_TYPE["item_ACTION"]
      | vocabAction_TYPE["item_ACTION"]
  ) => void;
  IS_inAction: (
    item_TYPE: currentActionItem_TYPE,
    item_ID: string,
    item_ACTION:
      | listAction_TYPE["item_ACTION"]
      | vocabAction_TYPE["item_ACTION"]
      | "any"
  ) => boolean;
};
