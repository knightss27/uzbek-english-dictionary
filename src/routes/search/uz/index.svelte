<script context="module" lang="ts">
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
	<Search search_term={data.word} results={results} />
	{#if not_found}
		<h1 class="error">No results.</h1>
	{:else}
		<h2>{data.word}</h2>
			{#if data.word_info}
				{#each data.word_info.grammatical_forms as form, i}
					<div>
						<h4>{form}</h4><h3>{data.word_info.english_definition[i]}</h3>
					</div>
				{/each}
				<a class="source" href="https://github.com/Herve-Guerin/uzbek-glossary" target="_blank">Hervé Guérin's Uzbek Glossary</a>
			{/if}
			{#if data.ctild_data}
				<div class="ctild">
					<h4>{data.ctild_data.part_of_speech}</h4>
				</div>
				{#each data.ctild_data.english_definitions as def, i}
					<div>
						<h3>{def.definition}</h3>
					</div>
				{/each}
				<a class="source" href="https://ctild.indiana.edu/Main/Uzbek-EnglishDictionary" target="_blank">CTILD Uzbek-English Dictionary</a>
			{/if}
		<h2 class="example">Examples</h2>
		{#if data.word_info}
			<span class="examples">
				{#each data.word_info.examples as example}
					<span>
						<h5 class="uz">{example.uzbek}</h5>
						<h5 class="en">{example.english}</h5>
					</span>
				{/each}
			</span>
		{/if}
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
		max-width: var(--max-width);
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
		padding-bottom: 1rem;
	}

	span.examples span:last-child {
		padding-bottom: 0rem;
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

	a.source {
		padding: 1rem;
		width: 100%;
		text-align: right;
	}

	div.ctild {
		border-top: 1px solid #ccc;
	}
</style>