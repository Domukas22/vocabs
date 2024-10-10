import { Model, Q } from "@nozbe/watermelondb";
import {
  children,
  date,
  field,
  reader,
  readonly,
  relation,
  text,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

// ---------------------------------------------------------------
// User Model
export class User_MODEL extends Model {
  static table = "users";

  static associations: Associations = {
    lists: { type: "has_many", foreignKey: "user_id" },
    vocabs: { type: "has_many", foreignKey: "user_id" },
    translations: { type: "has_many", foreignKey: "user_id" },
  };

  @children("lists") lists!: List_MODEL[];
  @children("vocabs") vocabs!: Vocab_MODEL[];
  @children("translations") translations!: Translation_MODEL[];

  @text("email") email!: string;
  @field("is_premium") is_premium!: boolean;
  @field("is_admin") is_admin!: boolean;
  @field("payment_date") payment_date!: string;
  @field("payment_amount") payment_amount!: number;
  @text("payment_type") payment_type!: string;
  @field("app_lang_id") app_lang_id!: "en" | "de";

  @readonly @date("created_at") created_at!: number;
}
// ---------------------------------------------------------------

// Language Model
export class Language_MODEL extends Model {
  static table = "languages";

  @text("image_url") image_url!: string;
  @text("lang_in_en") lang_in_en!: string;
  @text("lang_in_de") lang_in_de!: string;
  @text("country_in_en") country_in_en!: string;
  @text("country_in_de") country_in_de!: string;
  @text("translation_example") translation_example!: string;
  @field("translation_example_highlights")
  translation_example_highlights!: number[];

  @readonly @date("created_at") created_at!: number;
}
// ---------------------------------------------------------------

// List Model
export class List_MODEL extends Model {
  static table = "lists";
  static associations: Associations = {
    user: { type: "belongs_to", key: "user_id" },
    vocabs: { type: "has_many", foreignKey: "list_id" },
  };

  @children("vocabs") vocabs!: Vocab_MODEL[];

  @relation("users", "user_id") user!: User_MODEL;
  @text("name") name!: string;
  @field("default_LANGS") default_LANGS!: string[]; // Array of language ids

  @readonly @date("created_at") created_at!: number;

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

// Vocab Model
export class Vocab_MODEL extends Model {
  static table = "vocabs";
  static associations: Associations = {
    list: { type: "belongs_to", key: "list_id" },
    user: { type: "belongs_to", key: "user_id" },
    translations: { type: "has_many", foreignKey: "vocab_id" },
  };

  @children("translations") translations!: Translation_MODEL[];

  @relation("lists", "list_id") list!: List_MODEL;
  @relation("users", "user_id") user!: User_MODEL;

  @field("difficulty") difficulty!: 1 | 2 | 3 | undefined;
  @text("description") description!: string | undefined;
  @field("image") image!: string | undefined;
  @field("is_public") is_public!: boolean;

  @readonly @date("created_at") created_at!: number;
}
// ---------------------------------------------------------------

// Translation Model
export class Translation_MODEL extends Model {
  static table = "translations";

  static associations: Associations = {
    vocab: { type: "belongs_to", key: "vocab_id" },
    user: { type: "belongs_to", key: "user_id" },
  };

  @relation("vocabs", "vocab_id") vocab!: Vocab_MODEL;
  @relation("users", "user_id") user!: User_MODEL;

  @field("lang_id") lang_id!: string;
  @text("text") text!: string;
  @field("highlights") highlights!: number[] | undefined;
  @field("is_public") is_public!: boolean;

  @readonly @date("created_at") created_at!: number;
}
// ---------------------------------------------------------------
