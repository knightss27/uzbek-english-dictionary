<script>
  import Search from "../components/Search.svelte";
  import SvelteSeo from "svelte-seo";
</script>

<SvelteSeo
  title="Uzbek-English Composite Dictionary | O'zbekcha-inglizcha Lug'at"
  description="Uzbek-English Dictionary and English-Uzbek Dictionary that allows users to search for Uzbek definitions in both cyrillic and latin.  | O'zbekcha-inglizcha va inglizcha-o'zbekcha lug'at, o'zbekcha-inglizcha ma'nolar"
  openGraph={{
    title: "Uzbek-English Composite Dictionary | O'zbekcha-inglizcha Lug'at",
    description: "Uzbek-English Dictionary and English-Uzbek Dictionary that allows users to search for Uzbek definitions in both cyrillic and latin.  | O'zbekcha-inglizcha va inglizcha-o'zbekcha lug'at, o'zbekcha-inglizcha ma'nolar",
    url: "https://www.uzbek-dictionary.org/",
    type: "website",
    images: [
      {
        url: "https://www.uzbek-dictionary.org/logo-512.png",
        width: 512,
        height: 512,
		    alt: "UECD Logo"
      },
    ],
  }}
/>

<main>
  <Search />
</main>

<a hidden href="/search/uz">Uzbek Search</a>

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
