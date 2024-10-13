import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "users",
      columns: [
        { name: "username", type: "string", isIndexed: true },
        { name: "email", type: "string" },
        { name: "is_premium", type: "boolean" },
        { name: "is_admin", type: "boolean" },

        { name: "payment_date", type: "string", isOptional: true },
        { name: "payment_amount", type: "number", isOptional: true },
        { name: "payment_type", type: "string", isOptional: true },
        { name: "preferred_lang_id", type: "string" },

        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "lists",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },

        { name: "name", type: "string" },
        { name: "default_lang_ids", type: "string", isOptional: true },

        { name: "is_public", type: "boolean" },
        { name: "is_public_and_private", type: "boolean" },

        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "list_access",
      columns: [
        { name: "list_id", type: "string", isIndexed: true },
        { name: "participant_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "deleted_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "vocabs",
      columns: [
        { name: "list_id", type: "string", isIndexed: true },
        { name: "user_id", type: "string", isIndexed: true },

        { name: "difficulty", type: "number", isOptional: true },
        { name: "description", type: "string", isOptional: true },

        { name: "trs", type: "string", isOptional: true },
        { name: "lang_ids", type: "string", isOptional: true },
        { name: "searchable", type: "string", isOptional: true },

        { name: "is_public", type: "boolean" },

        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "languages",
      columns: [
        { name: "image_url", type: "string" },

        { name: "lang_in_en", type: "string" },
        { name: "lang_in_de", type: "string" },
        { name: "country_in_en", type: "string" },
        { name: "country_in_de", type: "string" },

        { name: "translation_example", type: "string" },
        { name: "translation_example_highlights", type: "string" },
        { name: "description_example", type: "string" },

        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number" },
      ],
    }),
  ],
});
