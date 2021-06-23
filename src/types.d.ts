type SearchResult = {
    word: string,
    word_info: WordInfo,
    related_words: {
        item: string,
        refIndex: number,
        href: string,
    }[],
    message?: string,
    ctild_data: CTILDInfo,
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

type CTILDInfo = {
    uzbek_word: string,
    part_of_speech: string,
    english_definitions: {
        definition: string,
        examples: {
            uzbek: string,
            english: string,
        }[]
    }[],
}