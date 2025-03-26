//
//
//

import { SetStateAction, useEffect } from "react";
import {
  USE_deleteOneListFromUi,
  USE_prependOneListIntoUi,
  USE_updateOneListInUi,
} from "./helpers";
import { List_EVENTS } from "@/src/mitt/mitt";
import { List_TYPE } from "@/src/features_new/lists/types";

export function USE_handleMyListsSideEffects({
  lists = [],
  SET_lists = () => {},
  SET_unpaginatedCount = () => {},
  highlight = () => {},
}: {
  lists: List_TYPE[];
  SET_lists: (value: SetStateAction<List_TYPE[]>) => void;
  SET_unpaginatedCount: (value: SetStateAction<number>) => void;
  highlight: (id: string | undefined) => void;
}) {
  const { PREPEND_oneListIntoUi } = USE_prependOneListIntoUi({
    highlight,
    SET_unpaginatedCount,
    SET_lists: SET_lists,
  });

  const { DELETE_oneListFromUi } = USE_deleteOneListFromUi({
    SET_lists,
    SET_unpaginatedCount,
  });

  const { UPDATE_oneListInUi } = USE_updateOneListInUi({
    lists,
    SET_lists,
  });

  useEffect(() => {
    const handler = (list: List_TYPE) => UPDATE_oneListInUi(list);

    List_EVENTS.on("updated", handler);
    return () => List_EVENTS.off("updated", handler);
  }, []);

  useEffect(() => {
    const handler = (list: List_TYPE) => PREPEND_oneListIntoUi(list);
    List_EVENTS.on("created", handler);
    List_EVENTS.on("copied", handler);
    return () => {
      List_EVENTS.off("created", handler);
      List_EVENTS.off("copied", handler);
    };
  }, []);

  useEffect(() => {
    const handler = (list_ID: string) => DELETE_oneListFromUi(list_ID);
    List_EVENTS.on("deleted", handler);
    return () => List_EVENTS.off("deleted", handler);
  }, []);
}
