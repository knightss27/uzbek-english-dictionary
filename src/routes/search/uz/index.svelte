<script context="module" lang="ts">
	import dictionary from "../../_dictionary";
	import Fuse from "fuse.js";

	export async function preload(page, session) {
		// Sneaky tricks to let `sapper export` work properly
		const { word } = page.query;
		const slug = word;
		let data = {};

		if (!slug) {
			data = {
				message: `Not found.`
			}
			return {data}
		}

		const prefixes = ["ba", "be", "fi"];

		const options = Object.keys(dictionary);
		const fuse = new Fuse(options, {})

		let results: any[] = fuse.search(slug);
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
			let related_words = results.slice(0, 10).map(result => {
				result.href = `/search/uz?word=${result.item}`;
				return result;
			})

			data = {
				word: slug,
				word_info: dictionary[slug],
				related_words,
			}
		} else {
			data = {
				message: `Not found.`
			}
		}

		return { data };
	}
</script>

<script lang="ts">
	export let data: SearchResult;
	import Search from "../../../components/Search.svelte";
	let results = [];
	let not_found = false;

	$: result = data.word_info;
	$: if (data) {
		results = [];
	}

	if (data.message) {
		not_found = true;
	}
</script>

<svelte:head>
	<title>Uzbek-English Dictionary</title>
</svelte:head>

<main>
	<h1><a class="title" href="/">Uzbek-English Dictionary</a></h1>
	<Search search_term={not_found ? "" : result.uzbek_word} results={results} />
	{#if not_found}
		<h1 class="error">No results.</h1>
	{:else}
		<h2>{result.uzbek_word}</h2>
			{#each result.grammatical_forms as form, i}
				<div>
					<h4>{form}</h4><h3>{result.english_definition[i]}</h3>
				</div>
			{/each}
		<h2 class="related">Similar words</h2>
		<span>
			{#each data.related_words as related, i}
				<a class="related-item" href={related.href}>{related.item}</a>
			{/each}
		</span>
	{/if}
</main>

<style>
	main {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		top: 0;
		z-index: 1;
	}

	h1.error {
		font-size: 1rem;
		justify-content: center;
	}

	h1.error, h2 {
		display: flex;
		width: 100%;
		max-width: var(--max-width);
		background-color: #ddd;
		padding: 0.1rem 0.5rem;
		border-radius: 0.25rem;
		margin-bottom: 0px;
	}

	h3, h4 {
		margin: 0px;
	}

	h4 {
		font-weight: 300;
		font-style: italic;
		font-size: 1.25rem;
		padding-top: 0.5rem;
	}

	h3 {
		font-size: 1.5rem;
		padding-left: 1rem;
		line-height: 1;
	}

	div {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		max-width: var(--max-width);
		padding-left: 0.5rem;
	}

	a.title {
		text-decoration: none;
		color: black;
	}

	a.related-item {
		padding: 0rem 0.4rem;
	}

	h2.related {
		font-weight: 500;
		font-size: 1rem;
		margin-top: 2rem;
	}
	
	span {
		display: flex;
		width: 100%;
		max-width: var(--max-width);

	}
</style>