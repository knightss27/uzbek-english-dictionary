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