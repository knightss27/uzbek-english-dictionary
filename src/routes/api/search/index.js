import Fuse from "fuse.js";
import { Word, connectToDB } from "../../../_utils";
import he from "he";

let words = null;
let fuse = null;
let fuseEnglish = null;

// Persian prefixes (sometimes used)
const prefixes = ["ba", "be", "fi"];

export async function get(req, res, next) {
    await connectToDB();

    if (!words) {
        words = await Word.find(
            {},
            {
                _id: 0,
                uzbek_word: 1,
                cyrillic_suggestion: 1,
                english_definitions: 1,
            }
        );
    }

    if (!fuse || !fuseEnglish) {
        let search_options = words;
        let search_options_english = [];
        search_options.forEach((option) => {
            for (const def of option.english_definitions) {
                search_options_english.push({
                    definition: def.definition,
                    uzbek_word: option.uzbek_word,
                });
            }
        });

        fuse = new Fuse(search_options, {
            threshold: 0.2,
            includeScore: true,
            findAllMatches: true,
            includeMatches: true,
            keys: ["uzbek_word", "cyrillic_suggestion"],
            getFn: (obj, keys) => {
                return keys.map((key) => {
                    return he.decode(obj[key]);
                });
            },
        });

        fuseEnglish = new Fuse(search_options_english, {
            threshold: 0.2,
            includeScore: true,
            findAllMatches: true,
            includeMatches: true,
            keys: ["definition"],
        });
    }

    let results = null;
    let nMatches = 0;

    const search_term = req.query.word;
    const concatenate = req.query.type != "long";
    const primaryLanguage = req.query.lang;

    if (search_term && search_term.length > 1) {
        // console.log("fuzzy searching for: " + search_term);
        const useEnglish = primaryLanguage == "english";

        let normalized_term = search_term.toLowerCase().replace("’", "'");
        results = useEnglish
            ? fuseEnglish.search(normalized_term)
            : fuse.search(normalized_term);

        nMatches = results.length;
        
        if (!useEnglish) {
            results = results.filter((r, i) => {
                // Bit of an arbitrary cut off to minimize data sent to the user (we only show top 10 anyways)
                if (concatenate && i >= 20) {
                    return false;
                }
                
                if (
                    r.item.uzbek_word.indexOf(normalized_term) == 0 ||
                    (r.item.cyrillic_suggestion &&
                        he
                            .decode(r.item.cyrillic_suggestion)
                            .indexOf(normalized_term) == 0)
                ) {
                    return true;
                }

                const prefix = r.item.uzbek_word.substring(0, 2);
                if (prefixes.includes(prefix)) {
                    return true;
                }

                return false;
            });
        } else {
            if (concatenate) {
                results = results.slice(0, 20);
            }
        }
    }

    res.json({
        results,
        nMatches
    });
}
