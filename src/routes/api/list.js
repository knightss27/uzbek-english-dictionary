import mongoose from "mongoose";
import { connectToDB, Word } from "../../_utils";

export async function get(req, res, next) {
  await connectToDB();

  // Fun stuff to return a covered index
//   const words = await Word.find(
//     {uzbek_word: {$ne: null}, cyrillic_suggestion: {$ne: null}},
//     {
//       _id: 0,
//       uzbek_word: 1,
//       cyrillic_suggestion: 1,
//       english_definitions: 1
//     }
//   ).explain();

  const words = await Word.find(
    {},
    {
      _id: 0,
      uzbek_word: 1,
      cyrillic_suggestion: 1,
      english_definitions: 1
    }
  );

  res.json(words);
}
