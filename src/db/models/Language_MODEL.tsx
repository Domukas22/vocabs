//
//
//
import { Model } from "@nozbe/watermelondb";
import { date, readonly, text, json } from "@nozbe/watermelondb/decorators";

const SANITIZE_langIds = (rawLangIds: string[]) => {
  return Array.isArray(rawLangIds)
    ? rawLangIds
        .filter((id) => id !== undefined) // Filter out undefined values
        .map((id) => (typeof id === "string" ? id : String(id)))
    : [];
};

export default class Language_MODEL extends Model {
  static table = "languages";

  @text("lang_id") lang_id!: string;
  @text("lang_in_en") lang_in_en!: string;

  @text("lang_in_de") lang_in_de!: string;
  @text("country_in_en") country_in_en!: string;
  @text("country_in_de") country_in_de!: string;

  @text("translation_example") translation_example!: string;

  @json("translation_example_highlights", SANITIZE_langIds)
  translation_example_highlights!: string[] | undefined;
  @text("description_example") description_example!: string;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;
}
