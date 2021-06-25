<script>
	import Search from "../components/Search.svelte";


</script>

<svelte:head>
	<title>Uzbek-English Dictionary</title>
</svelte:head>

<main>
	<Search />
</main>

<a hidden href="/search/uz">Uzbek Search</a>
<!-- <a hidden href="/api/word/test.json">Uzbek Search API</a> -->

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
</style>