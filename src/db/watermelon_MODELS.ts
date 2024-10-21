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
  if (!rawHighlights) return [];
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
  @field("max_vocabs") max_vocabs!: number;
  @text("preferred_lang_id") preferred_lang_id!: string;

  @field("list_submit_attempt_count") list_submit_attempt_count!: number;
  @field("accepted_list_submit_count") accepted_list_submit_count!: number;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
// ===================================================================================
export class List_MODEL extends Model {
  static table = "lists";
  static associations: Associations = {
    vocabs: { type: "has_many", foreignKey: "list_id" },
  };
  @children("vocabs") vocabs!: Vocab_MODEL[];

  /////////////////////////////////////////////////////////////////
  // Becasue we don't really need to fetch lists by users,
  // we provide simple text strings instead of WatermelonDB relations
  @text("user_id") user_id!: string;
  @text("original_creator_id") original_creator_id!: string;
  /////////////////////////////////////////////////////////////////

  @text("name") name!: string;
  @text("description") description!: string;
  @json("default_lang_ids", sanitize) default_lang_ids!: string[] | undefined;
  @field("is_submitted_for_publish") is_submitted_for_publish!: boolean;
  @field("was_accepted_for_publish") was_accepted_for_publish!: boolean;
  @text("type") type!: "private" | "public" | "shared" | "draft";

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

  @text("owner_id") owner_id!: string;
  @text("participant_id") participant_id!: string;
  @text("list_id") list_id!: string;

  @readonly @date("created_at") createdAt!: number;
}
// ===================================================================================
export class Vocab_MODEL extends Model {
  static table = "vocabs";
  static associations: Associations = {
    list: { type: "belongs_to", key: "list_id" },
  };

  @relation("lists", "list_id") list!: List_MODEL;

  @field("difficulty") difficulty!: 1 | 2 | 3;
  @text("description") description!: string | undefined;
  @json("trs", sanitizeTranslations) trs!: tr_PROPS[] | undefined;
  @text("lang_ids") lang_ids!: string | undefined;
  @text("searchable") searchable!: string | undefined;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
// ===================================================================================
export class Language_MODEL extends Model {
  static table = "languages";

  @text("lang_id") lang_id!: string;
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
export class Notifications_MODEL extends Model {
  static table = "notifications";

  static associations: Associations = {
    user: { type: "belongs_to", key: "user_id" },
  };

  @immutableRelation("users", "user_id") user!: User_MODEL;

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
}

export class Paymentss_MODEL extends Model {
  static table = "payments";

  static associations: Associations = {
    user: { type: "belongs_to", key: "user_id" },
  };

  @immutableRelation("users", "user_id") user!: User_MODEL;

  @text("item") item!: string;
  @text("amount") amount!: number;
  @text("payment_method") payment_method!: string;

  @readonly @date("created_at") createdAt!: number;
}
