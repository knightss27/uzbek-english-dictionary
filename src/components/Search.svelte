<script>
	import Fuse from "fuse.js";
	import he from "he";
	import { onMount } from "svelte";

	let fuse;
	let fuseEnglish;

	const setupSearch = async () => {
		let search_options = await fetch(`/api/list`);
		search_options = await search_options.json();

		let search_options_english = [];
		search_options.forEach(option => {
			for (const def of option.english_definitions) {
				search_options_english.push({
					definition: def.definition,
					uzbek_word: option.uzbek_word,
				})
			}
		})

		fuse = new Fuse(search_options, {
			threshold: 0.2,
			includeScore: true,
			findAllMatches: true,
			includeMatches: true,
			keys: ['uzbek_word', 'cyrillic_suggestion'],
			getFn: (obj, keys) => {
				return keys.map(key => {
					return he.decode(obj[key]);
				});
			}
		})

		fuseEnglish = new Fuse(search_options_english, {
			threshold: 0.2,
			includeScore: true,
			findAllMatches: true,
			includeMatches: true,
			keys: ['definition'],
		})
	}

	// Persian prefixes (sometimes used)
	const prefixes = ["ba", "be", "fi"];

	export let search_term = null;
	let bottom_text = "";
	export let results = [];

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
			const useEnglish = primaryLanguage == 'english';

			let normalized_term = search_term.toLowerCase().replace("’", "'");
			results = useEnglish ? fuseEnglish.search(normalized_term) : fuse.search(normalized_term);

			if (!useEnglish) {
				results = results.filter(r => {
					if (r.item.uzbek_word.indexOf(normalized_term) == 0
					|| (r.item.cyrillic_suggestion && he.decode(r.item.cyrillic_suggestion).indexOf(normalized_term) == 0)) {
						return true;
					}

					const prefix = r.item.uzbek_word.substring(0, 2);
					if (prefixes.includes(prefix)) {
						return true;
					}

					return false;
				})
			}
			

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

    const handleSearchButton = () => {
        if (search_term) {
            window.location.href = `/search/uz?word=${search_term.toLowerCase().replace("’", "'")}`
        }
    }

	const chooseResultForm = (result) => {
		return result.matches[0].value;
	}

	let sessionStorage;
	let primaryLanguage = 'uzbek';
	onMount(() => {
		setupSearch();

		sessionStorage = window.sessionStorage;
		if (sessionStorage.getItem('primaryLanguage') == null) {
			sessionStorage.setItem('primaryLanguage', primaryLanguage);
		} else {
			primaryLanguage = sessionStorage.getItem('primaryLanguage');
		}
	})

	const changeLanguage = () => {
		primaryLanguage = primaryLanguage == 'english' ? 'uzbek' : 'english';
		sessionStorage.setItem('primaryLanguage', primaryLanguage);
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<a class="title" href="/"><img src="logo.png" alt="Uzbek-English Dictionary" /></a>
<main>
	<p on:click={changeLanguage} >
		{primaryLanguage == 'english' ? "English" : "Uzbek"} 
		<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 24 24" width="20px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/></svg> 
		{primaryLanguage == 'english' ? "Uzbek" : "English"} 
	</p>
	<form on:submit|preventDefault={handleSearchButton}>
		<input autocomplete="off" bind:value={search_term} on:input={handleSearch} placeholder="so'z" id="result-0" />
		<button type="submit">search</button>
	</form>
	{#if primaryLanguage == 'english'}
		<p>
			*note: English-Uzbek translation is still a work in progress
		</p>
	{/if}
	{#if results.length > 0}
	<div>
		{#each results as result, i}
			{#if i < 10}
			<a rel="prefetch" class="result" on:click={() => {results = []}} href={`/search/uz?word=${result.item.uzbek_word}`} id="result-{i+1}">{chooseResultForm(result)}</a>
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
        position: relative;
	}

	form {
		display: flex;
		width: 100%;
		max-width: var(--max-width);
	}

	input {
		margin-right: 0.25rem;
		display: flex;
		flex-basis: calc(var(--max-width) - 50px);
        height: 2.5rem;
        font-size: 1.5rem;
        border-radius: 0.25rem;
        border: 1px solid gray;
        padding-left: 0.25rem;
	}

    input:focus {
        border: 1px solid blue;
        outline: none;
    }

    button {
        cursor: pointer;
        font-size: 1rem;
        padding: 0rem 1rem;
    }

	div {
		width: 100%;
		max-width: var(--max-width);
		display: flex;
		flex-direction: column;
		padding-top: 0.5rem;
        z-index: 100;
        position: absolute;
        top: calc(100% + 0.25rem);
        background-color: white;
	}

	a.result {
		margin: 0.25rem 0rem;
		padding-left: 0.25rem;
		border: 1px solid lightgray;
		border-radius: 0.25rem;
		width: 100%;
		transition: ease box-shadow 0.3s;
        background-color: white;
        height: 2.5rem;
        font-size: 1.5rem;
	}

	a.result:hover {
		box-shadow: 0.25rem 0.25rem 10px #ddd;
	}

	a.result:focus {
		border: 1px solid blue;
	}

	span {
		width: 100%;
		border-radius: 0.25rem;
		background-color: #ccc;
		text-align: center;
		font-size: 0.8rem;
		padding: 0.25rem 0rem;
	}

	img {
		max-width: 95%;
		padding: 1rem 0rem 0.5rem;
	}

	a {
		width: 100%;
		max-width: var(--max-width);
	}

	p {
		display: flex;
		margin: 0px;
		padding: 0px;
		width: 100%;
		justify-content: flex-start;
		align-items: center;
		cursor: pointer;
		max-width: var(--max-width);
	}
</style>