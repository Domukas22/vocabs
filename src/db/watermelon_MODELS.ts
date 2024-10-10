import { Model, Q } from "@nozbe/watermelondb";
import {
  children,
  date,
  field,
  immutableRelation,
  json,
  reader,
  readonly,
  relation,
  text,
  writer,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

export class List_MODEL extends Model {
  static table = "lists";
  static associations: Associations = {
    vocabs: { type: "has_many", foreignKey: "list_id" },
  };

  @children("vocabs") vocabs!: Vocab_MODEL[];

  @text("user_id") user_id!: string | undefined;
  @text("name") name!: string;
  @field("default_LANGS") default_LANGS!: string[]; // Array of language ids

  @readonly @date("created_at") created_at!: number;
  @readonly @date("updated_at") updated_at!: number;
  @readonly @date("deleted_at") deleted_at!: number;

  @reader async GET_vocabCounts(list_id: string) {
    const vocabs = (await this.collections
      .get("vocabs")
      .query(Q.where("list_id", list_id))
      .fetch()) as Vocab_MODEL[];

    // Count vocabs by difficulty
    return vocabs.reduce(
      (counts, vocab) => {
        if (vocab.difficulty === 1) {
          counts.difficulty_1 += 1;
        } else if (vocab.difficulty === 2) {
          counts.difficulty_2 += 1;
        } else if (vocab.difficulty === 3) {
          counts.difficulty_3 += 1;
        }
        counts.total += 1;
        return counts;
      },
      {
        total: 0,
        difficulty_1: 0,
        difficulty_2: 0,
        difficulty_3: 0,
      }
    );
  }
}
// ---------------------------------------------------------------
export class Vocab_MODEL extends Model {
  static table = "vocabs";
  static associations: Associations = {
    list: { type: "belongs_to", key: "list_id" },
    translations: { type: "has_many", foreignKey: "vocab_id" },
  };

  @children("translations") translations!: Translation_MODEL[];
  @relation("lists", "list_id") list!: List_MODEL;

  @text("user_id") user_id!: string | undefined;
  @field("difficulty") difficulty!: 1 | 2 | 3 | undefined;
  @text("description") description!: string | undefined;
  @field("image") image!: string | undefined;
  @field("is_public") is_public!: boolean;

  @readonly @date("created_at") created_at!: number;
  @readonly @date("updated_at") updated_at!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
// ---------------------------------------------------------------
const SANITIZE_highlights = (rawHighlights: number[]) => {
  return Array.isArray(rawHighlights) ? rawHighlights.map(String) : [];
};
export class Translation_MODEL extends Model {
  static table = "translations";

  static associations: Associations = {
    vocab: { type: "belongs_to", key: "vocab_id" },
  };

  @relation("vocabs", "vocab_id") vocab!: Vocab_MODEL;

  @text("user_id") user_id!: string | undefined;
  @field("lang_id") lang_id!: string;
  @text("text") text!: string;
  @json("highlights", SANITIZE_highlights) highlights!: number[] | undefined;
  @field("is_public") is_public!: boolean;

  @readonly @date("created_at") created_at!: number;
  @readonly @date("updated_at") updated_at!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
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

  @readonly @date("created_at") created_at!: number;
  @readonly @date("updated_at") updated_at!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
