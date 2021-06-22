type SearchResult = {
    word: string,
    word_info: WordInfo,
    related_words: {
        item: string,
        refIndex: number,
        href: string,
    }[],
    message?: string,
}

type WordInfo = {
    uzbek_word: string,
    grammatical_categories: string[],
    grammatical_forms: string[],
    english_definition: string[],
    examples: {
        uzbek: string,
        english: string,
    }[],
    section: string,
}