//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_myTinyLists_ARGS, MyTinyListQuery_TYPE } from "../../types";
import { BUILD_myTinyListFilterQuery } from "../BUILD_myTinyListFilterQuery/BUILD_myTinyListFilterQuery";
import { THROW_postgressError } from "@/src/utils";

const function_NAME = "FETCH_unpaginatedMyTinyListCount";

export async function FETCH_unpaginatedMyTinyListCount(
  query: MyTinyListQuery_TYPE,
  args: FETCH_myTinyLists_ARGS
): Promise<{ unpaginated_COUNT: number }> {
  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  const filtered_QUERY = BUILD_myTinyListFilterQuery(query, args);
  const { error, count } = await filtered_QUERY.abortSignal(args?.signal);

  if (error) THROW_postgressError(error, function_NAME);

  return { unpaginated_COUNT: count || 0 };
}
