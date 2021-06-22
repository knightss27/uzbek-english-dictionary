<script context="module">
	export async function preload(page, session) {
		// the `slug` parameter is available because this file
		// is called [slug].svelte
		const { slug } = page.params;

		const res = await this.fetch(`search/uz/${slug}.json`);
		const data = await res.json();

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
	<h1><a href="/">Uzbek-English Dictionary</a></h1>
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

	a {
		text-decoration: none;
		color: black;
	}
</style>