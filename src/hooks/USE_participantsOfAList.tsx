import { useState, useCallback, useMemo, useEffect } from "react";
import { FlatlistError_PROPS } from "../props";
import FETCH_listParticipants from "../features/8_listAccesses/utils/FETCH_listParticipants/FETCH_listParticipants";
import List_MODEL from "@/src/db/models/List_MODEL";

export type FetchedSupabaseVocabs_PROPS = {
  id: any;
  difficulty: any;
  description: any;
  trs: any;
  searchable: any;
  lang_ids: any;
  is_marked: any;
  user_id: any;
  list: {
    id: any;
    name: any;
  }[];
};

export default function USE_listParticipants({
  list,
  owner_id,
  dependencies = [],
}: {
  list: List_MODEL | undefined;
  owner_id: string | undefined;
  dependencies: any[];
}) {
  const [participants, SET_participants] = useState<
    { id: string; username: string }[]
  >([]);
  const [IS_fetchingParticipants, SET_fetching] = useState(false);
  const [fetchParticipants_ERROR, SET_error] = useState<FlatlistError_PROPS>({
    value: false,
    msg: "",
  });
  const errroMsg = useMemo(
    () =>
      `Some kind of error occurred while loading the participants. This error has been recorded and will be reviewed by developers shortly. If the problem persists, please try to re-load the app or contact support. We apologize for the troubles.`,
    []
  );

  const fetch = useCallback(async () => {
    SET_fetching(false);
    SET_error({ value: false, msg: "" });

    if (list?.type !== "shared") {
      SET_participants([]);
      return;
    }

    if (!owner_id) {
      console.error(
        "🔴 Tried fetching participants of a list, but the owner id was undefined 🔴"
      );
      SET_error({
        value: true,
        msg: errroMsg,
      });
      return;
    }
    if (!list) {
      console.error(
        "🔴 Tried fetching participants of a list, but the list was undefined 🔴"
      );
      SET_error({
        value: true,
        msg: errroMsg,
      });
      return;
    }

    try {
      const { data: participants, error } = await FETCH_listParticipants({
        list_id: list?.id,
        owner_id,
      });

      if (error) {
        console.error(
          "🔴 Error when fetching participants of a list: 🔴",
          error
        );
        SET_error({
          value: true,
          msg: errroMsg,
        });
      } else {
        SET_participants(participants || []);
      }
    } catch (error: any) {
      console.error("🔴 Error in USE_participantsOfAList: 🔴", error);
      SET_error({
        value: true,
        msg: errroMsg,
      });
    } finally {
      SET_fetching(false);
    }
  }, []);

  useEffect(() => {
    (async () => await fetch())();
  }, dependencies);

  return {
    participants,
    fetchParticipants_ERROR,
    IS_fetchingParticipants,
    FETCH_participants: fetch,
  };
}
