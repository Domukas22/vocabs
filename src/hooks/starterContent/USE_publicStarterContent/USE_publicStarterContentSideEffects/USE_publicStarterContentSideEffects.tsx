//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SET_publicStarterContent_PROPS } from "../USE_setPublicStarterContent/USE_setPublicStarterContent";
import USE_refetchPublicStarterContent from "./USE_refetchPublicStarterContent/USE_refetchPublicStarterContent";

export default function USE_publicStarterContentSideEffects({
  SET_error = () => {},
  SET_loading = () => {},
  SET_publicStarterContent = () => {},
}: {
  SET_error: Dispatch<SetStateAction<General_ERROR | undefined>>;
  SET_loading: Dispatch<SetStateAction<starterContentLoading_TYPE>>;
  SET_publicStarterContent: (props: SET_publicStarterContent_PROPS) => void;
}) {
  const { REFETCH_publicStarterContent } = USE_refetchPublicStarterContent({
    SET_error,
    SET_loading,
    SET_publicStarterContent,
  });

  useEffect(() => {
    (async () => await REFETCH_publicStarterContent())();
  }, []);
}
