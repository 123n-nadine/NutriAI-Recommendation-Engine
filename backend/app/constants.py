# Category sets used across filtering rules

MEAT_CATEGORIES: frozenset[str] = frozenset({
    "high_protein_meat",
    "high_protein_fish",
    "high_protein_seafood",
    "vegan_incompatible",
    "specialty_dish",   # may contain meat – flagged conservatively; individual check below
})

DAIRY_EGG_CATEGORIES: frozenset[str] = frozenset({
    "high_protein_eggs_dairy",
    "fermented",        # yogurt / kefir
})

SUGARY_CATEGORIES: frozenset[str] = frozenset({
    "sugary_drinks",
    "dessert",
    "candy",
    "ultra_processed",
    "snacks",           # chips, pastries, etc. – filtered for diabetes
})

HIGH_SODIUM_CATEGORIES: frozenset[str] = frozenset({
    "fast_food",
    "ultra_processed",
    "condiment",
})

GLUTEN_CATEGORIES: frozenset[str] = frozenset({
    "gluten_containing",
})

# Keywords that mark a specialty dish as meat-containing (vegan / vegetarian filter)
MEAT_KEYWORDS: tuple[str, ...] = (
    "beef", "chicken", "lamb", "turkey", "pork", "duck", "venison",
    "fish", "tuna", "salmon", "prawn", "shrimp", "lobster", "crab",
    "seafood", "squid", "mussel", "oyster", "scallop", "anchovy",
    "liver", "kofta", "sausage", "ham", "bacon", "meat", "kofta",
    "hawawshi", "kabab", "squab", "hamam", "bamya okra meat",
)
