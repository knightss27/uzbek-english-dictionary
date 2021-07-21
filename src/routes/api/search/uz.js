import Fuse from 'fuse.js';
import axios from "axios";
import FormData from "form-data";
import cheerio from "cheerio";
import { Word, connectToDB } from "../../../_utils";

// https://savodxon.uz/api/get_definition

// Possible prefixes
const prefixes = ["ba", "be", "fi"];

export async function get(req, res, next) {
	// Get the word from our url parameters
    const word = req.query.word;
    let slug = word;

    // If we actually have the parameter
	if (word) {
        // Tell the response what we are sending
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

        await connectToDB();
        const word_from_db = await Word.findOne({"uzbek_word": word});
        
        // Initialize the data (SearchResult)
		const data = {
			word: word,
			word_info: word_from_db ? word_from_db : null,
			related_words: word_from_db ? word_from_db.related_words : [],
            ctild_data: null,
		}

        if ((word_from_db && !word_from_db.dne_in_ctild && !word_from_db.ctild_data.uzbek_word) || !word_from_db) {
            
            // Debugging
            if (word_from_db) {
                console.log(`Creating new CTILD cache for: ${word_from_db.uzbek_word}`)
            }

            // Create FormData object to send to CTILD's site
            let formData = new FormData();
            formData.append("do", "search");
            formData.append("search", word);

            // Send a request to CTILD's site
            const form_res = await axios.post(`https://ctild.sitehost.iu.edu/dict/ajax.php`, formData, {
                headers: formData.getHeaders()
            })
            
            // If CTILD has it, we need to parse the request
            if (form_res.data != "-2" && form_res.data != "-1") {
                
                // Initialize our form data
                data.ctild_data = {};

                // Debugging
                // console.log(form_res.data)
                
                // Initialize the html we got
                const $ = cheerio.load(form_res.data);
                // Find the actual word (not currently used)
                data.ctild_data.uzbek_word = $('div.headword').text();
                // Determine the part of speech
                data.ctild_data.part_of_speech = null;
                $('span.pos').each((i, span) => {
                    // Some pages have two definitions, so we just take the second p.o.s. for now.
                    data.ctild_data.part_of_speech = $(span).text();
                });
                
                // Keep track of definitions and their indices in our array of definitions
                let pairings = {};

                // Start our list of definitions
                data.ctild_data.english_definitions = [];
                $('a.gloss').each((i, el) => {
                    // Get the text from each "gloss"
                    let text = $(el).text();
                    // If it has a number on the left, remove it
                    // NOTE: this will break if there inclues a ) and no #
                    if (text.includes(")")) {
                        text = text.substring(text.indexOf(")")+1);
                    }

                    // Add the definition to our list
                    data.ctild_data.english_definitions.push(
                        {
                            definition: text,
                            examples: [],
                        }
                    )
                    // Keep track of the definitions and it's index
                    // NOTE: this could be done using .indexOf() below, but a dictionary provides better O(1) access
                    pairings[text] = data.ctild_data.english_definitions.length-1;
                })

                // Find all the examples
                $('div.examples').each((i, el) => {
                    $('div.example', $(el).html()).each((j, ex) => {
                        // Find the associated definition by looking at the sibling text
                        let associated_def = $(el).prev('.gloss').text();
                        if (associated_def.includes(")")) {
                            associated_def = associated_def.substring(associated_def.indexOf(")")+1);
                        }

                        // Add the example to our list
                        data.ctild_data.english_definitions[pairings[associated_def]].examples.push({
                            uzbek: $('span.uz', $(ex).html()).text(),
                            english: $('span.en', $(ex).html()).text(),
                        })
                    })
                })

                if (word_from_db) {
                    word_from_db.ctild_data = data.ctild_data;
                    await word_from_db.save();
                }
            } else if (word_from_db) {
                word_from_db.dne_in_ctild = true;
                await word_from_db.save();
            }
        } else if (word_from_db && word_from_db.ctild_data.uzbek_word) {
            data.ctild_data = word_from_db.ctild_data;
        }

        // If we don't have the word in any source, say so
        if (data.word_info == undefined && !data.ctild_data) {
            res.end(JSON.stringify({
                message: `Not found`
            }));
            return;
        }

        // Now only fuzzy search if we don't already know the term
        if (data.word_info == undefined && data.ctild_data) {
            // For fuzzy searching verbs, we don't want the "-"
            if (slug.includes("-")) {
                slug = slug.replace("-", "");
            }
            
            const options = Word.find({});
            const fuse = new Fuse(options, {
                keys: ['uzbek_word']
            });

            // Fuzzy search for similar words
            let results = fuse.search(slug);
            results = results.filter(r => {
                // Allow the fuzzy search if the word starts with the same letters
                // This is useful as prefixes are quite rare in Uzbek
                if (r.item.indexOf(slug) == 0 && r.item !== word) {
                    return true;
                }
                
                // Just in case, check whether we have a prefix, if so we keep it
                const prefix = r.item.substring(0, 2);
                if (prefixes.includes(prefix) && r.item.indexOf(slug) !== -1) {
                    return true;
                }
                
                return false;
            })

            // Take the top 10 results, and add their links
            data.related_words = results.slice(0, 10).map(result => {
                result.href = `/search/uz?word=${result.item}`;
                return result;
            })
        }
        

        // Debugging
        // console.log(data);

        // Return the final data
		res.end(JSON.stringify(data));
	} else {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify({
			message: `Not found`
		}));
	}
}
