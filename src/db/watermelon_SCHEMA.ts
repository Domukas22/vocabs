import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "users",
      columns: [
        { name: "username", type: "string", isIndexed: true },
        { name: "email", type: "string" },
        { name: "max_vocabs", type: "number" },
        { name: "preferred_lang_id", type: "string" },

        { name: "list_submit_attempt_count", type: "number" },
        { name: "accepted_list_submit_count", type: "number" },

        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number", isOptional: true },
      ],
    }),

    tableSchema({
      name: "lists",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },
        { name: "original_creator_id", type: "string" },

        { name: "name", type: "string" },
        { name: "default_lang_ids", type: "string", isOptional: true },
        { name: "is_submitted_for_publish", type: "boolean" },
        { name: "has_been_submitted", type: "boolean" },
        { name: "type", type: "string" },

        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number", isOptional: true },
      ],
    }),

    tableSchema({
      name: "list_access",
      columns: [
        { name: "list_id", type: "string", isIndexed: true },
        { name: "participant_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "vocabs",
      columns: [
        { name: "list_id", type: "string", isIndexed: true },

        { name: "difficulty", type: "number" },
        { name: "description", type: "string", isOptional: true },
        { name: "trs", type: "string", isOptional: true },
        { name: "lang_ids", type: "string", isOptional: true },
        { name: "searchable", type: "string", isOptional: true },

        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number", isOptional: true },
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
        { name: "deleted_at", type: "number", isOptional: true },
      ],
    }),

    tableSchema({
      name: "notifications",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },

        { name: "title", type: "string" },
        { name: "paragraph", type: "string" },
        { name: "type", type: "string" },
        { name: "is_read", type: "boolean" },

        { name: "created_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "payments",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },

        { name: "item", type: "string" },
        { name: "amount", type: "number" },
        { name: "payment_method", type: "string" },

        { name: "created_at", type: "number" },
      ],
    }),
  ],
});
