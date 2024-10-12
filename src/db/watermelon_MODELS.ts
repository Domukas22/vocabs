import { Model, Q } from "@nozbe/watermelondb";
import {
  children,
  date,
  field,
  immutableRelation,
  json,
  lazy,
  reader,
  readonly,
  relation,
  text,
  writer,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

const sanitize = (rawHighlights: number[]) => {
  return Array.isArray(rawHighlights) ? rawHighlights.map(String) : [];
};
const sanitizeTranslations = (
  rawTranslations: any[]
): { lang_id: string; text: string; highlights: number[] }[] => {
  if (!Array.isArray(rawTranslations)) return [];

  return rawTranslations?.map((item) => {
    // Ensure each translation item has the correct structure
    return {
      lang_id: typeof item.lang_id === "string" ? item.lang_id : "",
      text: typeof item.text === "string" ? item.text : "",
      highlights: Array.isArray(item.highlights)
        ? item.highlights.map((highlight: number) =>
            typeof highlight === "number" ? highlight : 0
          )
        : [],
    };
  });
};

export class List_MODEL extends Model {
  static table = "lists";
  static associations: Associations = {
    vocabs: { type: "has_many", foreignKey: "list_id" },
  };

  @children("vocabs") vocabs!: Vocab_MODEL[];

  @text("user_id") user_id!: string | undefined;
  @text("name") name!: string;
  @json("default_LANGS", sanitize) default_LANGS!: string[] | undefined;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;

  @lazy diff_1 = this.vocabs.extend(Q.where("difficulty", 1)).observeCount();
  @lazy diff_2 = this.vocabs.extend(Q.where("difficulty", 2)).observeCount();
  @lazy diff_3 = this.vocabs.extend(Q.where("difficulty", 3)).observeCount();
  @lazy totalVocabs = this.vocabs.observeCount();
}
// ---------------------------------------------------------------
export class Vocab_MODEL extends Model {
  static table = "vocabs";
  static associations: Associations = {
    list: { type: "belongs_to", key: "list_id" },
  };

  @relation("lists", "list_id") list!: List_MODEL | undefined;

  @field("difficulty") difficulty!: 1 | 2 | 3 | undefined;
  @text("description") description!: string | undefined;
  @field("image") image!: string | undefined;
  @field("is_public") is_public!: boolean;

  @json("trs", sanitizeTranslations) trs!: string[] | undefined;
  @text("lang_ids") lang_ids!: string | undefined;
  @text("searchable") searchable!: string | undefined;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// ---------------------------------------------------------------
// ---------------------------------------------------------------
export class Language_MODEL extends Model {
  static table = "languages";

  @text("lang_in_en") lang_in_en!: string;
  @text("lang_in_de") lang_in_de!: string;
  @text("country_in_en") country_in_en!: string;
  @text("country_in_de") country_in_de!: string;
  @text("translation_example") translation_example!: string;
  @field("translation_example_highlights")
  translation_example_highlights!: number[];

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
