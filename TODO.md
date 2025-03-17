//
//
//

- Inside hooks like "USE_softDeleteVocabs", use multiple try/catch block for separarte functions. Deleting the vocab is one fucntion. then updating the ui is a nother separate function.

- Remove all cases like this --- z_user?.id || "" ---, instead, do ----user_id: string | undefined ----

5. Deleted vocabs should be sorted by delete date

///////////////////

1. Create vocab modal + function
2. Update vocab modal + function

Functions:

--> When you open a new personal list, check the colelcted_lang_ids array. If the current frontTrLang_ID inside 'z_USE_myVocabDisplaySettings' is not one of those, then change it on list load/insertion.

--> Create list
--> Update list
--> Create vocab
--> Update vocab

--> Create a "copy vocab" function
--> Create a "copy list and its vocabs" function

--> Create 4 separate states:
----> z_USE_myListsDisplaySettings
----> z_USE_myVocabsDisplaySettings
----> z_USE_publicListsDisplaySettings
----> z_USE_publicVocabsDisplaySettings

--> Create list
--> Create vocab
--> Update list
--> Update vocab

--> Fix general page

// ------------------------------------
--> Offer vocabs for a completed survey
