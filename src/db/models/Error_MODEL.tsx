//
//
//
import { Model } from "@nozbe/watermelondb";
import { date, readonly, text, json } from "@nozbe/watermelondb/decorators";

const sanitizeJSON = (json: JSON) => json;

export default class Error_MODEL extends Model {
  static table = "errors";

  // user id is not included here, becasue we populate it automatically on supabase

  @text("message") message!: string;
  @text("function") function!: string;
  @json("details", sanitizeJSON) details!: string | undefined;
  @readonly @date("created_at") createdAt!: number;
}
