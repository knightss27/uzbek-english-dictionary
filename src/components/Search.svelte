<script>
	import dictionary from "../routes/_dictionary";
	import Fuse from "fuse.js";
	import { goto } from '@sapper/app';

	const search_options = Object.keys(dictionary);
	const fuse = new Fuse(search_options, {
		threshold: 0.2,
		includeScore: true,
		findAllMatches: true,
	})

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

			let normalized_term = search_term.toLowerCase();

			results = fuse.search(normalized_term);

			results = results.filter(r => {
				if (r.item.indexOf(normalized_term) == 0) {
					return true;
				}

				const prefix = r.item.substring(0, 2);
				if (prefixes.includes(prefix)) {
					return true;
				}

				return false;
			})

			// console.log(results);

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
            window.location.href = `/search/uz?word=${search_term.toLowerCase()}`
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown} />

<main>
	<form on:submit|preventDefault={handleSearchButton}>
		<input autocomplete="off" bind:value={search_term} on:input={handleSearch} placeholder="so'z" id="result-0" />
		<button type="submit">search</button>
	</form>
	{#if results.length > 0}
	<div>
		{#each results as result, i}
			{#if i < 10}
			<a rel="prefetch" href={`/search/uz?word=${result.item}`} id="result-{i+1}">{result.item}</a>
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
		width: 95%;
		max-width: var(--max-width);
		display: flex;
		flex-direction: column;
		padding-top: 0.5rem;
        z-index: 100;
        position: absolute;
        top: calc(100% + 0.25rem);
        background-color: white;
	}

	a {
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

	a:hover {
		box-shadow: 0.25rem 0.25rem 10px #ddd;
	}

	a:focus {
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
</style>