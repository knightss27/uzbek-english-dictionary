<script lang="ts">
	import Nav from '../components/Nav.svelte';

	export let segment: string;
</script>

<style>
	main {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 100vh;
	}

	p {
		position: absolute;
		bottom: 0;
		left: 0;
		text-align: center;
		width: 100%;
		z-index: 1000;
	}
</style>

<main>
	<slot></slot>
	<p><a href="https://github.com/knightss27/uzbek-english-dictionary">source</a> | all translations are the work of their respective creators</p>
</main>