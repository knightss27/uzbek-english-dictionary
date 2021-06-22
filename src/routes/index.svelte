<script>
	import dictionary from "./_dictionary";
	import Fuse from "fuse.js";

	const search_options = Object.keys(dictionary);
	const fuse = new Fuse(search_options, {
		threshold: 0.2,
		includeScore: true,
		findAllMatches: true,
	})

	// Persian prefixes (sometimes used)
	const prefixes = ["ba", "be", "fi"];

	let search_term = null;
	let bottom_text = "";
	let results = [];

	let cursor = 0;

	const handleKeyDown = (e) => {
		if (results.length < 1 || (e.keyCode !== 38 &&  e.keyCode !== 40)) {
			return;
		}
		if (e.keyCode === 38 && cursor > 0) {
			cursor--;
		} else if (e.keyCode === 40 && cursor < 10) {
			cursor++;
		}
		if (cursor >= 0) {
			document.getElementById(`result-${cursor}`).focus();
		}
	}

	const handleSearch = () => {
		if (search_term && search_term.length > 1) {
			console.log("fuzzy searching for: " + search_term);
			cursor = 0;

			results = fuse.search(search_term);

			results = results.filter(r => {
				if (r.item.indexOf(search_term) == 0) {
					return true;
				}

				const prefix = r.item.substring(0, 2);
				if (prefixes.includes(prefix)) {
					return true;
				}

				return false;
			})

			console.log(results);

			if (results.length == 0) {
				bottom_text = "No results."
			} else {
				bottom_text = `and ${results.length-10 > 0 ? results.length-10 : 0} more.`
			}

		} else if (search_term && search_term.length <= 1) {
			results = [];
			cursor = 0;
		}
	}
</script>

<svelte:head>
	<title>Uzbek-English Dictionary</title>
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

<main>
	<h1>Uzbek-English Dictionary</h1>
	<form on:submit|preventDefault="">
		<input bind:value={search_term} on:input={handleSearch} placeholder="s'oz" id="result-0" />
		<button type="submit">search</button>
	</form>
	{#if results.length > 0}
	<div>
		{#each results as result, i}
			{#if i < 10}
			<a href={`/search/uz/${result.item}.json`} id="result-{i+1}">{result.item}</a>
			{/if}
		{/each}
		<span>
			{bottom_text}
		</span>
	</div>
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
	}

	form {
		display: flex;
		width: 95%;
		max-width: 330px;
	}

	input {
		margin-right: 0.25rem;
		display: flex;
		flex-basis: 280px;
	}

	div {
		width: 330px;
		display: flex;
		flex-direction: column;
		padding-top: 0.5rem;
	}

	a {
		margin: 0.25rem 0rem;
		padding-left: 0.25rem;
		border: 1px solid lightgray;
		border-radius: 0.25rem;
		width: calc(100% - 50px);
		transition: ease box-shadow 0.3s;
	}

	a:hover {
		box-shadow: 0.25rem 0.25rem 10px #ddd;
	}

	a:focus {
		border: 1px solid blue;
	}

	span {
		width: calc(100% - 50px);
		border-radius: 0.25rem;
		background-color: #ccc;
		text-align: center;
		font-size: 12px;
		padding: 0.25rem 0rem;
	}
</style>