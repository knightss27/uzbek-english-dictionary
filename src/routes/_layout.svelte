<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	main {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 100vh;
	}
</style>

<main>
	<slot></slot>
</main>