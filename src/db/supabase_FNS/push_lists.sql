
-- takes in changes: jsonb


DECLARE
    new_list jsonb;
    updated_list jsonb;
BEGIN
    -- Create lists
    FOR new_list IN
        SELECT jsonb_array_elements((changes->'lists'->'created'))
    LOOP
        PERFORM create_list(
            (new_list->>'id')::uuid,
            (new_list->>'user_id')::uuid,
            (new_list->>'original_creator_id')::uuid,  -- Include original_creator_id
            (new_list->>'name'),
            (new_list->>'description'),
            (new_list->>'default_lang_ids')::jsonb,  -- Convert to JSONB
            (new_list->>'is_submitted_for_publish')::boolean,
            (new_list->>'was_accepted_for_publish')::boolean,
            (new_list->>'type'),
            epoch_to_timestamp(new_list->>'created_at'),
            epoch_to_timestamp(new_list->>'updated_at'),
            epoch_to_timestamp(new_list->>'deleted_at')  -- Handle if needed
        );
    END LOOP;

    -- Delete lists
    WITH deleted_lists AS (
        SELECT jsonb_array_elements_text(changes->'lists'->'deleted')::uuid AS deleted
    )
    DELETE FROM lists
    WHERE lists.id IN (SELECT deleted FROM deleted_lists);

    -- Update lists
    WITH updated_lists AS (
        SELECT jsonb_array_elements((changes->'lists'->'updated')) AS updated
    )
    UPDATE lists
    SET 
        name = (updated->>'name'),
        description = (updated->>'description'),
        default_lang_ids = (updated->>'default_lang_ids')::jsonb,  -- Ensure this is JSONB
        is_submitted_for_publish = (updated->>'is_submitted_for_publish')::boolean,
        was_accepted_for_publish = (updated->>'was_accepted_for_publish')::boolean,
        type = (updated->>'type'),
        updated_at = now()  -- Or use epoch_to_timestamp if needed
    FROM updated_lists
    WHERE lists.id = (updated->>'id')::uuid;

END;

