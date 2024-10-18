
-- takes in schema_version: integer, migration: jsonb, last_pulled_at: bigint


DECLARE
    lists_result JSONB;
    vocabs_result JSONB;
BEGIN
    -- Call pull_lists function
    lists_result := pull_lists(schema_version, migration, last_pulled_at);
    
    -- Call pull_vocabs function
    vocabs_result := pull_vocabs(schema_version, migration, last_pulled_at);
    
    -- Merge results from both functions
    RETURN jsonb_build_object(
        'changes', jsonb_build_object(
            'lists', lists_result->'changes'->'lists',
            'vocabs', vocabs_result->'changes'->'vocabs'
        ),
        'timestamp', timestamp_to_epoch(now())  -- Use the current timestamp
    );
END;
