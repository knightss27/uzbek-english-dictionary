<script>

    const grammatical_categories = [
        ["ad", "adjective or adverb"],
        ["adj", "adjective"],
        ["adv", "adverb"],
        ["n", "name"],
        ["num", "number"],
        ["post", "postposition"],
        ["pron", "pronoun"],
        ["v.int", "intransitive verb"],
        ["v.t", "transitive verb"],
        ["meas", "measure"],
        ["neg", "negative"],
    ]

    const args = [
        ["N", "Noun phrase"],
        ["V", "Verb phrase"],
        ["A", "Adjective"],
        ["num", "number"],
        ["C", "Clause"]
    ]

    const cases = [
        ["+ni", "direct object / accusative"],
        ["+ga", "dative"],
        ["+da", "locative"],
        ["+dan", "ablative"],
        ["+ning", "genitive"]
    ]
</script>

<main>
    <h2>Hervé Guérin's Uzbek Glossary</h2>
    <p class="header top">Abbreviation key for definitions sourced from <a class="source" href="https://github.com/Herve-Guerin/uzbek-glossary" target="_blank">Hervé Guérin's Uzbek Glossary</a>.</p>
    <h2 class="sub">Grammatical Categories</h2>
    {#each grammatical_categories as category}
        <div>
            <p><i>{category[0]}</i>{category[1]}</p>
        </div>
    {/each}
    <h2 class="sub">Arguments</h2>
    <p class="header">When the word may function as the head of a syntactic unit (clause, noun phrase...) with one or several dependant arguments, the arguments’ marking is mentioned. This is more often the case for verbs (with subject, direct object, indirect object, etc.), but may be also the case of some adjectives or nouns. Distinctions between core and peripheral arguments are not made.</p>
    <p class="header">An argument appears in the following form: nature of the argument + reference of the argument + case. Arguments are referenced as X, Y, Z, beginning with core arguments.</p>
    <span class="arguments">
        <span>
            <p class="header">Natures:</p>
            {#each args as arg}
                <div>
                    <p><i>{arg[0]}</i>{arg[1]}</p>
                </div>
            {/each}
        </span>
    </span>
    <span class="arguments">
        <span>
            <p class="header">Cases:</p>
            {#each cases as c}
                <div>
                    <p><i>{c[0]}</i>{c[1]}</p>
                </div>
            {/each}
        </span>
    </span>
    <p class="header">A noun may bear a pronominal suffix. This is noted using its value in the 3rd singular person.</p>
    <span class="arguments">
        <span>
            <div>
                <p><i>+i</i>pronomial suffix</p>
            </div>
            <div>
                <p><i>+si</i>pronomial suffix (if noun ends with a vowel)</p>
            </div>
        </span>
    </span>
    <p class="header">Additionally, the current word is replaced by a '~'.</p>
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

    h2 {
		display: flex;
		width: 100%;
		max-width: var(--max-width);
		background-color: #ddd;
		padding: 0.1rem 0.5rem;
		border-radius: 0.25rem;
		margin-bottom: 0px;
        margin-bottom: 1rem;
	}

    h2.sub {
		font-weight: 500;
		font-size: 1rem;
		margin-top: 2rem;
        margin-bottom: 1rem;
	}

    div {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: flex-start;
        padding-left: 0.5rem;
        margin-left: 1.5rem;
        border-left: 1px solid gray;
    }

    div i {
        display: flex;
        width: 50px;
    }

    p {
        margin: 0px;
        display: flex;
    }

    p.header {
        padding-left: 1rem;
        padding-bottom: 0.25rem;
        width: 100%;
    }

    span.arguments {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    a.source {
        padding-left: 0.25rem;
    }
</style>