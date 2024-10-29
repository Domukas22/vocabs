// async function CLEAN_dirtyItems(user_id: string | undefined = "") {
//   try {
//     // Fetch all lists from the database
//     const allLists = await Lists_DB.query().fetch();
//     // Filter lists where user_id is not "user1"
//     const listsToDelete = allLists.filter((list) => list.user_id !== user_id);
//     // Get the IDs of valid lists (those that are not marked for deletion)
//     const validListIds = allLists
//       .filter((list) => list.user_id === user_id)
//       .map((list) => list.id);
//     // Fetch all vocabs from the database
//     const allVocabs = await Vocabs_DB.query().fetch();
//     // Filter vocabs whose list_id is not in the valid list IDs
//     const vocabsToDelete = allVocabs.filter(
//       (vocab) => !validListIds.includes(vocab?.list_id || "")
//     );
//     // Perform batch deletion in a single transaction
//     if (listsToDelete.length > 0 || vocabsToDelete.length > 0) {
//       await db.write(async () => {
//         await db.batch(
//           // Mark the lists as deleted
//           ...listsToDelete.map((list) => list.prepareMarkAsDeleted()),
//           // Mark the vocabs as deleted
//           ...vocabsToDelete.map((vocab) => vocab.prepareMarkAsDeleted())
//         );
//       });
//     }
//     console.log("Cleaned up dirty items successfully.");
//   } catch (error) {
//     console.error("Error cleaning dirty items:", error);
//   }
// }
