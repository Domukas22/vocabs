//
//
//
import { Model } from "@nozbe/watermelondb";
import { date, readonly, text, field } from "@nozbe/watermelondb/decorators";

export default class Notifications_MODEL extends Model {
  static table = "notifications";

  @text("user_id") user_id!: string;
  @text("title") title!: string;
  @text("paragraph") paragraph!: string;
  @text("type") type!:
    | "vocabsAdded"
    | "list_publication_accepted"
    | "list_published"
    | "changedUsername"
    | "changedEmail"
    | "changedPassword"
    | "warning";
  @field("is_read") is_read!: boolean;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;
}
