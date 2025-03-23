//
//
//

import { Vocab_EVENTS, List_EVENTS } from "@/src/mitt/mitt";
import { General_ERROR } from "@/src/types/error_TYPES";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";
import { Dispatch, SetStateAction, useEffect } from "react";
import USE_refetchMyStarterContent from "./USE_refetchMyStarterContent/USE_refetchMyStarterContent";
import { SET_myStarterContent_PROPS } from "../USE_setMyStarterContent/USE_setMyStarterContent";

export default function USE_myStarterContentSideEffects({
  SET_error = () => {},
  SET_loading = () => {},
  SET_myStarterContent = () => {},
}: {
  SET_error: Dispatch<SetStateAction<General_ERROR | undefined>>;
  SET_loading: Dispatch<SetStateAction<starterContentLoading_TYPE>>;
  SET_myStarterContent: (props: SET_myStarterContent_PROPS) => void;
}) {
  const { REFETCH_myStarterContent } = USE_refetchMyStarterContent({
    SET_error,
    SET_loading,
    SET_myStarterContent,
  });

  useEffect(() => {
    const handler = () => REFETCH_myStarterContent();

    Vocab_EVENTS.on("*", handler);
    List_EVENTS.on("*", handler);
    return () => {
      Vocab_EVENTS.off("*", handler);
      List_EVENTS.off("*", handler);
    };
  }, []);

  useEffect(() => {
    (async () => await REFETCH_myStarterContent())();
  }, []);
}
