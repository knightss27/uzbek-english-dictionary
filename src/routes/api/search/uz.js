// DOES NOT WORK WITH EXPORT

import dictionary from '../../_dictionary.js';
import Fuse from 'fuse.js';
import axios from "axios";
import FormData from "form-data";
import cheerio from "cheerio";

const prefixes = ["ba", "be", "fi"];

export async function get(req, res, next) {
	const word = req.query.word;
    let slug = word;

    const options = Object.keys(dictionary);
    const fuse = new Fuse(options, {})

	if (word) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		const data = {
			word: word,
			word_info: dictionary[word] ? dictionary[word] : null,
			related_words: [],
            ctild_data: null,
		}

        let formData = new FormData();
		formData.append("do", "search");
		formData.append("search", word);

		const form_res = await axios.post(`https://ctild.sitehost.iu.edu/dict/ajax.php`, formData, {
            headers: formData.getHeaders()
        })
		
        if (form_res.data != "-2" && form_res.data != "-1") {
            data.ctild_data = {};
            // console.log(form_res.data)
            const $ = cheerio.load(form_res.data);
            data.ctild_data.uzbek_word = $('div.headword').text();
            data.ctild_data.part_of_speech = $('span.pos').text();
            
            data.ctild_data.english_definitions = [];
            $('a.gloss').each((i, el) => {
                let text = $(el).text();
                if (text.includes(")")) {
                    text = text.substring(text.indexOf(")")+1);
                }
                data.ctild_data.english_definitions.push(
                    {
                        definition: text,
                        examples: [],
                    }
                )
            })

            $('div.examples').each((i, el) => {
                $('div.example', $(el).html()).each((j, ex) => {
                    data.ctild_data.english_definitions[i].examples.push({
                        uzbek: $('span.uz', $(ex).html()).text(),
                        english: $('span.en', $(ex).html()).text(),
                    })
                })
            })
        }

        if (data.word_info == undefined && !data.ctild_data) {
            res.end(JSON.stringify({
                message: `Not found`
            }));
            return;
        }

        
        if (slug.includes("-")) {
            slug = slug.replace("-", "");
        }

        let results = fuse.search(slug);
        results = results.filter(r => {
            if (r.item.indexOf(slug) == 0 && r.item !== word) {
                return true;
            }
    
            const prefix = r.item.substring(0, 2);
            if (prefixes.includes(prefix) && r.item.indexOf(slug) !== -1) {
                return true;
            }
    
            return false;
        })

		data.related_words = results.slice(0, 10).map(result => {
			result.href = `/search/uz?word=${result.item}`;
			return result;
		})

        // console.log(data);
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
