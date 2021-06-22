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
</style>

<main>
	<slot></slot>
</main>