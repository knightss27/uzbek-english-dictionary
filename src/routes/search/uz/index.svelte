<script context="module" lang="ts">
	import dictionary from "../../_dictionary";
	import Fuse from "fuse.js";

	export async function preload(page, session) {
		// Sneaky tricks to let `sapper export` work properly
		const { word } = page.query;
		const slug = word;
		
		const res = await this.fetch(`api/search/uz?word=${slug}`);
		const data = await res.json();

		let not_found = true;
		if (!data.message) {
			not_found = false;
		}

		return { data, not_found };
	}
</script>

<script lang="ts">
	export let data: SearchResult;
	export let not_found: boolean;
	import Search from "../../../components/Search.svelte";

	import { stores } from "@sapper/app";

	const { page } = stores();
	const { word } = $page.query;

	// console.log(data, not_found);

	let results = [];

	$: result = data.word_info;
	$: if (data) {
		results = [];
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
		<h2 class="example">Examples</h2>
		<span class="examples">
			{#each result.examples as example}
				<span>
					<h5 class="uz">{example.uzbek}</h5>
					<h5 class="en">{example.english}</h5>
				</span>
			{/each}
		</span>
		<h2 class="related">Similar words</h2>
		<span class="related-items">
			{#each data.related_words as related, i}
				<a class="related-item" href={related.href}>{related.item}</a>
			{/each}
		</span>
	{/if}
</main>

<style>
	main {
		display: flex;
		width: 95%;
		margin: 0 auto;
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

	h3 {
		font-size: 1.5rem;
		padding-left: 1rem;
		line-height: 1;
	}

	h4 {
		font-weight: 300;
		font-style: italic;
		font-size: 1.25rem;
		padding-top: 0.5rem;
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

	h2.related, h2.example {
		font-weight: 500;
		font-size: 1rem;
		margin-top: 2rem;
	}

	span.related-items {
		display: flex;
		width: 100%;
		max-width: var(--max-width);
		flex-wrap: wrap;
	}

	span.examples {
		display: flex;
		width: 100%;
		max-width: var(--max-width);
		flex-direction: column;
	}

	span.examples span {
		display: flex;
		flex-direction: column;
	}

	h5 {
		margin: 0rem;
		font-size: 1rem;
		padding-left: 1rem;
	}

	h5.uz {
		font-size: 1.4rem;
	}

	h5.en {
		font-weight: 300;
		font-style: italic;
		padding-left: 2rem;
		font-size: 1.15rem;
	}
</style>