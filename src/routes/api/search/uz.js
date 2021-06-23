// DOES NOT WORK WITH EXPORT

import dictionary from '../../_dictionary.js';
import Fuse from 'fuse.js';

const prefixes = ["ba", "be", "fi"];

export function get(req, res, next) {
	const word = req.query.word;
    let slug = word;

    const options = Object.keys(dictionary);
    const fuse = new Fuse(options, {})

	if (word && dictionary[slug]) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

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

		let related_words = results.slice(0, 10).map(result => {
			result.href = `/search/uz?word=${result.item}`;
			return result;
		})

		const data = {
			word: word,
			word_info: dictionary[word],
			related_words,
		}

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
