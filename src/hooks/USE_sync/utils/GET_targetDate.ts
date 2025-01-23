//
//
//

import User_MODEL from "@/src/db/models/User_MODEL";
import { NEW_timestampWithTimeZone } from "@/src/utils";

export const GET_targetDate = ({
  PULL_EVERYTHING = false,
  user,
}: {
  PULL_EVERYTHING: boolean;
  user: User_MODEL | undefined;
}) =>
  PULL_EVERYTHING
    ? new Date(new Date().setFullYear(new Date().getFullYear() - 100))
    : user?.last_pulled_at
    ? user.last_pulled_at
    : NEW_timestampWithTimeZone();
