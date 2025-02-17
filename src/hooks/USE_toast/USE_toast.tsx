//
//
//

import { Toast_TYPE } from "@/src/types/general_TYPES";
import { useCallback } from "react";
import { useToast } from "react-native-toast-notifications";

export function USE_toast() {
  const toast = useToast();

  const TOAST = useCallback(
    (
      type: Toast_TYPE,
      message: string,
      placement: "top" | "bottom",
      duration?: number
    ) => {
      toast.show(message, {
        type,
        placement,
        duration: duration || 2000,
      });
    },
    []
  );

  return { TOAST };
}
