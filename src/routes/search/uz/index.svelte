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

	const gram_categories = [
		"ad",
		"adj",
		"adv",
		"n",
		"num",
		"post",
		"pron",
		"v.int",
		"v.t",
		"meas",
		"neg"
	]
</script>

<svelte:head>
	<title>Uzbek-English Dictionary</title>
</svelte:head>

<main>
	<Search search_term={data.word} results={results} />
	{#if not_found}
		<h1 class="error">No results.</h1>
	{:else}
		<h2>{data.word}
			{#if data.word_info}
			<p>
			{@html data.word_info.cyrillic_suggestion}
			</p>
			{/if}
		</h2>
			{#if data.word_info}
				{#each data.word_info.english_definitions as def, i}
					<div>
						{#if def.form}
						<h4><i>{def.form.includes("|") ? def.form.split("|")[0] : (gram_categories.includes(def.form) ? def.form : "")}</i>{def.form.includes("|") ? " | " + def.form.split("|")[1] : (gram_categories.includes(def.form) ? "" : def.form)}</h4>
						{/if}
						<h3>{def.definition}</h3>
					</div>
				{/each}
				<div class="with-key">
					<a class="source" href="/key" target="_blank">Abbreviation Key</a>
					<a class="source" href="https://github.com/Herve-Guerin/uzbek-glossary" target="_blank">Hervé Guérin's Uzbek Glossary</a>
				</div>
			{/if}
			{#if data.ctild_data}
				<div class="ctild">
					<h4><i>{data.ctild_data.part_of_speech}</i></h4>
				</div>
				{#each data.ctild_data.english_definitions as def, i}
					<div>
						<h3><i>{i+1}. </i>{def.definition}</h3>
						{#each def.examples as example}
							<span class="ctild">
								<h5 class="ctild uz">{example.uzbek}</h5>
								<h5 class="ctild en">{example.english}</h5>
							</span>
						{/each}
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
				{#if data.word_info.examples.length == 0}
					<span style="text-align: center;">No examples.</span>
				{:else}
				<a class="source" href="https://github.com/Herve-Guerin/uzbek-glossary" target="_blank">Hervé Guérin's Uzbek Glossary</a>
				{/if}
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
		padding-bottom: 10rem;
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
		font-size: 1.25rem;
		padding-left: 1rem;
		line-height: 1;
	}

	h4 {
		font-weight: 300;
		font-size: 1.25rem;
	}

	div {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		max-width: var(--max-width);
		padding-left: 0.5rem;
		padding-top: 0.5rem;
	}

	h2 p {
		margin: 0px;
		padding-left: 1rem;
		margin-left: 1rem;
		font-weight: 500;
		font-size: 1.25rem;
		line-height: 1;
		display: flex;
		align-items: center;
		border-left: 1px solid gray;
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

	h5.ctild {
		font-size: 1rem;
		padding-left: 2rem;
		display: flex;
		flex-wrap: nowrap;
		overflow: visible;
		white-space: nowrap;
	}

	span.ctild {
		display: flex;
		flex-direction: row;
		padding-left: 1rem;
	}

	span.ctild .uz {
		font-weight: 600;
	}

	a.source {
		padding: 1rem;
		width: 100%;
		text-align: right;
	}

	div.ctild {
		border-top: 1px solid #ccc;
	}

	h3 i {
		font-size: 1.25rem;
		font-weight: 600;
	}

	div.with-key {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-between;
		padding: 1rem;
	}

	div.with-key a {
		display: flex;
		padding: 0px;
	}

	div.with-key :last-child {
		justify-content: flex-end;
	}
</style>