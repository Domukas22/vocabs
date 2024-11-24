//
//
//
import { Model } from "@nozbe/watermelondb";
import { date, readonly, text } from "@nozbe/watermelondb/decorators";

export default class ContactMessages_MODEL extends Model {
  static table = "contact_messages";

  @text("user_id") user_id!: string;

  @text("name") name!: string;
  @text("email") email!: string;
  @text("message") message!: string;
  @text("message_type") message_type!: string;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;
}
