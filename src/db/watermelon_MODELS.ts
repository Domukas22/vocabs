import { Model, Q } from "@nozbe/watermelondb";
import {
  children,
  date,
  field,
  immutableRelation,
  json,
  lazy,
  readonly,
  relation,
  text,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { tr_PROPS } from "./props";

const sanitize = (rawHighlights: number[]) => {
  return Array.isArray(rawHighlights) ? rawHighlights.map(String) : [];
};
const sanitizeTranslations = (rawTranslations: tr_PROPS[]) => {
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
// ===================================================================================
export class User_MODEL extends Model {
  static table = "users";
  static associations: Associations = {
    vocabs: { type: "has_many", foreignKey: "user_id" },
    lists: { type: "has_many", foreignKey: "user_id" },
  };

  @children("vocabs") vocabs!: Vocab_MODEL[];
  @children("lists") lists!: List_MODEL[];

  @text("username") username!: string;
  @text("email") email!: string;

  @field("is_admin") is_admin!: boolean;
  @field("is_premium") is_premium!: boolean;

  @text("payment_date") payment_date!: string;
  @text("payment_amount") payment_amount!: number;
  @text("payment_type") payment_type!: string;
  @text("preferred_lang_id") preferred_lang_id!: string;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
// ===================================================================================
export class List_MODEL extends Model {
  static table = "lists";
  static associations: Associations = {
    user: { type: "belongs_to", key: "user_id" },
    vocabs: { type: "has_many", foreignKey: "list_id" },
  };

  @immutableRelation("users", "user_id") user!: User_MODEL | undefined;
  @children("vocabs") vocabs!: Vocab_MODEL[];

  @text("name") name!: string;
  @json("default_lang_ids", sanitize) default_lang_ids!: string[] | undefined;

  @field("is_public") is_public!: boolean;
  @field("is_public_and_private") is_public_and_private!: boolean;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;

  @lazy diff_1 = this.vocabs.extend(Q.where("difficulty", 1)).observeCount();
  @lazy diff_2 = this.vocabs.extend(Q.where("difficulty", 2)).observeCount();
  @lazy diff_3 = this.vocabs.extend(Q.where("difficulty", 3)).observeCount();
  @lazy totalVocabs = this.vocabs.observeCount();
}
// ===================================================================================
export class ListAccess_MODEL extends Model {
  static table = "list_access";
  static associations: Associations = {
    list: { type: "belongs_to", key: "list_id" },
    user: { type: "belongs_to", key: "participant_id" },
  };

  @immutableRelation("lists", "list_id") list!: List_MODEL | undefined;
  @immutableRelation("users", "participant_id") participant!:
    | User_MODEL
    | undefined;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
// ===================================================================================
export class Vocab_MODEL extends Model {
  static table = "vocabs";
  static associations: Associations = {
    user: { type: "belongs_to", key: "user_id" },
    list: { type: "belongs_to", key: "list_id" },
  };

  @immutableRelation("users", "user_id") user!: User_MODEL | undefined;
  @relation("lists", "list_id") list!: List_MODEL | undefined;

  @field("difficulty") difficulty!: 1 | 2 | 3 | undefined;
  @text("description") description!: string | undefined;

  @json("trs", sanitizeTranslations) trs!: tr_PROPS[] | undefined;
  @text("lang_ids") lang_ids!: string | undefined;
  @text("searchable") searchable!: string | undefined;

  @field("is_public") is_public!: boolean;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
// ===================================================================================
export class Language_MODEL extends Model {
  static table = "languages";

  @text("lang_in_en") lang_in_en!: string;
  @text("lang_in_de") lang_in_de!: string;
  @text("country_in_en") country_in_en!: string;
  @text("country_in_de") country_in_de!: string;

  @text("translation_example") translation_example!: string;
  @field("translation_example_highlights")
  translation_example_highlights!: number[];
  @text("description_example") description_example!: string;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
