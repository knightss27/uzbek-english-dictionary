// DOES NOT WORK WITH EXPORT

import dictionary from '../../_dictionary.js';
import Fuse from 'fuse.js';

const prefixes = ["ba", "be", "fi"];

export function get(req, res, next) {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const { slug } = req.params;

    const options = Object.keys(dictionary);
    const fuse = new Fuse(options, {})

    let results = fuse.search(slug);
	results = results.filter(r => {
		if (r.item.indexOf(slug) == 0 && r.item !== slug) {
			return true;
		}

		const prefix = r.item.substring(0, 2);
		if (prefixes.includes(prefix) && r.item.indexOf(slug) !== -1) {
			return true;
		}

		return false;
	})

	if (dictionary[slug]) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		let related_words = results.slice(0, 10).map(result => {
			result.href = `/search/uz?word=${result.item}`;
			return result;
		})

		const data = {
			word: slug,
			word_info: dictionary[slug],
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
