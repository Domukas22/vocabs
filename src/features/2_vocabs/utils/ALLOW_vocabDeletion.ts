//
//
//

import { User_MODEL } from "@/src/db/models";

export default function ALLOW_vocabDelete({
  is_public,
  user,
  vocab_id,
  list_id,
}: {
  is_public: boolean;
  user: User_MODEL | undefined;
  vocab_id: string | undefined;
  list_id: string | undefined;
}) {
  if (!is_public) {
    if (!user?.id) {
      return {
        allow: false,
        internalMsg: "🔴 User id not defined during private vocab deletion 🔴",
      };
    }
    if (!vocab_id) {
      return {
        allow: false,
        internalMsg: "🔴 Vocab id not defined during private vocab deletion 🔴",
      };
    }
    if (!list_id) {
      return {
        allow: false,
        internalMsg: "🔴 List id not defined during private vocab deletion 🔴",
      };
    }
    return { allow: true, internalMsg: "" };
  }

  if (is_public) {
    if (!user?.id) {
      return {
        allow: false,
        internalMsg: "🔴 User id not defined during public vocab deletion 🔴",
      };
    }
    if (!user?.is_admin) {
      return {
        allow: false,
        internalMsg: "🔴 User is not admin during public vocab deletion 🔴",
      };
    }
    if (!vocab_id) {
      return {
        allow: false,
        internalMsg: "🔴 Vocab id not defined during public vocab deletion 🔴",
      };
    }
    return { allow: true, internalMsg: "" };
  }
  return {
    allow: false,
    internalMsg: "🔴 Something went wrong during public vocab deletion 🔴",
  };
}
