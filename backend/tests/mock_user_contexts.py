mock_user_contexts = [
    {
        "calorie_target": 3200,
        "calories_consumed_today": 1850,
        "macro_targets": {
            "protein_g": 210,
            "carbs_g": 350,
            "fat_g": 85
        },
        "macros_consumed_today": {
            "protein_g": 118,
            "carbs_g": 195,
            "fat_g": 46
        },
        "goal": "muscle_gain",
        "conditions": [],
        "preferences": ["high_protein", "meal_prep_friendly"],
        "candidate_foods": [
            {"id": 101, "name": "Grilled Chicken Breast", "calories": 165, "protein_g": 31, "carbs_g": 0, "fat_g": 3.6, "category": "meat"},
            {"id": 102, "name": "Whole Egg Omelette (3 eggs)", "calories": 210, "protein_g": 18, "carbs_g": 1.5, "fat_g": 14, "category": "dairy"},
            {"id": 103, "name": "Whey Protein Shake", "calories": 160, "protein_g": 30, "carbs_g": 6, "fat_g": 2.5, "category": "snacks"},
            {"id": 104, "name": "Brown Rice (1 cup cooked)", "calories": 215, "protein_g": 5, "carbs_g": 45, "fat_g": 1.8, "category": "carbs"},
            {"id": 105, "name": "Sweet Potato (medium)", "calories": 103, "protein_g": 2.3, "carbs_g": 24, "fat_g": 0.1, "category": "carbs"},
            {"id": 106, "name": "Canned Tuna in Water", "calories": 120, "protein_g": 26, "carbs_g": 0, "fat_g": 1, "category": "meat"},
            {"id": 107, "name": "Cottage Cheese (1 cup)", "calories": 206, "protein_g": 28, "carbs_g": 8, "fat_g": 4.5, "category": "dairy"},
            {"id": 108, "name": "Peanut Butter (2 tbsp)", "calories": 190, "protein_g": 8, "carbs_g": 6, "fat_g": 16, "category": "snacks"},
            {"id": 109, "name": "Beef Burger (no bun)", "calories": 330, "protein_g": 28, "carbs_g": 0, "fat_g": 23, "category": "meat"},
            {"id": 110, "name": "Pepperoni Pizza Slice", "calories": 298, "protein_g": 12, "carbs_g": 34, "fat_g": 13, "category": "fast_food"},
            {"id": 111, "name": "Broccoli (1 cup steamed)", "calories": 55, "protein_g": 3.7, "carbs_g": 11, "fat_g": 0.6, "category": "vegetables"},
            {"id": 112, "name": "Banana (large)", "calories": 121, "protein_g": 1.5, "carbs_g": 31, "fat_g": 0.4, "category": "fruits"}
        ]
    },
    {
        "calorie_target": 1500,
        "calories_consumed_today": 820,
        "macro_targets": {
            "protein_g": 120,
            "carbs_g": 130,
            "fat_g": 45
        },
        "macros_consumed_today": {
            "protein_g": 58,
            "carbs_g": 74,
            "fat_g": 22
        },
        "goal": "weight_loss",
        "conditions": ["obesity"],
        "preferences": ["low_calorie", "high_fiber"],
        "candidate_foods": [
            {"id": 201, "name": "Grilled Salmon Fillet", "calories": 208, "protein_g": 28, "carbs_g": 0, "fat_g": 10, "category": "meat"},
            {"id": 202, "name": "Spinach Salad (2 cups)", "calories": 14, "protein_g": 1.8, "carbs_g": 2.2, "fat_g": 0.2, "category": "vegetables"},
            {"id": 203, "name": "Hard Boiled Egg", "calories": 78, "protein_g": 6, "carbs_g": 0.6, "fat_g": 5.3, "category": "dairy"},
            {"id": 204, "name": "Apple (medium)", "calories": 95, "protein_g": 0.5, "carbs_g": 25, "fat_g": 0.3, "category": "fruits"},
            {"id": 205, "name": "Greek Yogurt (non-fat, 170g)", "calories": 100, "protein_g": 17, "carbs_g": 6, "fat_g": 0.7, "category": "dairy"},
            {"id": 206, "name": "Celery Sticks with Hummus", "calories": 80, "protein_g": 3, "carbs_g": 9, "fat_g": 4, "category": "snacks"},
            {"id": 207, "name": "McDonald's Big Mac", "calories": 563, "protein_g": 26, "carbs_g": 44, "fat_g": 33, "category": "fast_food"},
            {"id": 208, "name": "Coca-Cola (330ml can)", "calories": 139, "protein_g": 0, "carbs_g": 35, "fat_g": 0, "category": "sugary_drinks"},
            {"id": 209, "name": "Zucchini Noodles (1 cup)", "calories": 20, "protein_g": 1.4, "carbs_g": 3.5, "fat_g": 0.2, "category": "vegetables"},
            {"id": 210, "name": "Boiled Chicken Breast (skinless)", "calories": 140, "protein_g": 26, "carbs_g": 0, "fat_g": 3, "category": "meat"},
            {"id": 211, "name": "Whole Wheat Bread (1 slice)", "calories": 80, "protein_g": 4, "carbs_g": 15, "fat_g": 1, "category": "carbs"},
            {"id": 212, "name": "Potato Chips (small bag, 28g)", "calories": 152, "protein_g": 2, "carbs_g": 15, "fat_g": 10, "category": "snacks"}
        ]
    },
    {
        "calorie_target": 1800,
        "calories_consumed_today": 960,
        "macro_targets": {
            "protein_g": 90,
            "carbs_g": 180,
            "fat_g": 60
        },
        "macros_consumed_today": {
            "protein_g": 42,
            "carbs_g": 105,
            "fat_g": 28
        },
        "goal": "maintenance",
        "conditions": ["type2_diabetes"],
        "preferences": ["low_glycemic", "low_sugar"],
        "candidate_foods": [
            {"id": 301, "name": "Grilled Chicken Thigh (skinless)", "calories": 180, "protein_g": 22, "carbs_g": 0, "fat_g": 9.5, "category": "meat"},
            {"id": 302, "name": "Quinoa (1 cup cooked)", "calories": 222, "protein_g": 8, "carbs_g": 39, "fat_g": 3.5, "category": "carbs"},
            {"id": 303, "name": "Steamed Broccoli & Cauliflower Mix", "calories": 60, "protein_g": 4.5, "carbs_g": 12, "fat_g": 0.5, "category": "vegetables"},
            {"id": 304, "name": "Canned Cola (regular, 330ml)", "calories": 139, "protein_g": 0, "carbs_g": 35, "fat_g": 0, "category": "sugary_drinks"},
            {"id": 305, "name": "Glazed Donut", "calories": 269, "protein_g": 3, "carbs_g": 33, "fat_g": 15, "category": "snacks"},
            {"id": 306, "name": "Lentil Soup (1 cup)", "calories": 165, "protein_g": 12, "carbs_g": 28, "fat_g": 0.6, "category": "vegetables"},
            {"id": 307, "name": "Whole Grain Oats (50g dry)", "calories": 190, "protein_g": 7, "carbs_g": 32, "fat_g": 3.5, "category": "carbs"},
            {"id": 308, "name": "Avocado (half)", "calories": 120, "protein_g": 1.5, "carbs_g": 6, "fat_g": 11, "category": "fruits"},
            {"id": 309, "name": "White Rice (1 cup cooked)", "calories": 206, "protein_g": 4.3, "carbs_g": 45, "fat_g": 0.4, "category": "carbs"},
            {"id": 310, "name": "Blueberries (1 cup)", "calories": 84, "protein_g": 1.1, "carbs_g": 21, "fat_g": 0.5, "category": "fruits"},
            {"id": 311, "name": "Peanut Butter Candy Bar", "calories": 280, "protein_g": 5, "carbs_g": 35, "fat_g": 14, "category": "snacks"},
            {"id": 312, "name": "Baked Tilapia Fillet", "calories": 145, "protein_g": 29, "carbs_g": 0, "fat_g": 3, "category": "meat"}
        ]
    },
    {
        "calorie_target": 2000,
        "calories_consumed_today": 1100,
        "macro_targets": {
            "protein_g": 70,
            "carbs_g": 260,
            "fat_g": 65
        },
        "macros_consumed_today": {
            "protein_g": 32,
            "carbs_g": 148,
            "fat_g": 34
        },
        "goal": "maintenance",
        "conditions": [],
        "preferences": ["vegan", "gluten_free"],
        "candidate_foods": [
            {"id": 401, "name": "Tofu Stir-fry (100g firm tofu)", "calories": 144, "protein_g": 15, "carbs_g": 3.5, "fat_g": 8.5, "category": "vegetables"},
            {"id": 402, "name": "Black Bean & Corn Bowl", "calories": 220, "protein_g": 12, "carbs_g": 40, "fat_g": 2, "category": "vegetables"},
            {"id": 403, "name": "Almond Milk (250ml unsweetened)", "calories": 30, "protein_g": 1, "carbs_g": 1.5, "fat_g": 2.5, "category": "dairy"},
            {"id": 404, "name": "Chickpea Salad", "calories": 190, "protein_g": 10, "carbs_g": 28, "fat_g": 5, "category": "vegetables"},
            {"id": 405, "name": "Avocado Toast on GF Bread", "calories": 230, "protein_g": 4, "carbs_g": 24, "fat_g": 14, "category": "carbs"},
            {"id": 406, "name": "Mixed Berry Smoothie (no dairy)", "calories": 175, "protein_g": 2, "carbs_g": 42, "fat_g": 1, "category": "fruits"},
            {"id": 407, "name": "Vegan Burger Patty (Beyond Meat)", "calories": 250, "protein_g": 20, "carbs_g": 5, "fat_g": 18, "category": "meat"},
            {"id": 408, "name": "French Fries (medium, fast food)", "calories": 365, "protein_g": 4, "carbs_g": 48, "fat_g": 17, "category": "fast_food"},
            {"id": 409, "name": "Edamame (1 cup shelled)", "calories": 188, "protein_g": 18, "carbs_g": 14, "fat_g": 8, "category": "snacks"},
            {"id": 410, "name": "Mango (1 cup chunks)", "calories": 107, "protein_g": 0.8, "carbs_g": 28, "fat_g": 0.4, "category": "fruits"},
            {"id": 411, "name": "Cashew Nuts (30g)", "calories": 163, "protein_g": 5, "carbs_g": 9, "fat_g": 13, "category": "snacks"},
            {"id": 412, "name": "Sweetened Oat Milk Latte (large)", "calories": 220, "protein_g": 2, "carbs_g": 38, "fat_g": 6, "category": "sugary_drinks"}
        ]
    },
    {
        "calorie_target": 1900,
        "calories_consumed_today": 1040,
        "macro_targets": {
            "protein_g": 85,
            "carbs_g": 220,
            "fat_g": 55
        },
        "macros_consumed_today": {
            "protein_g": 40,
            "carbs_g": 118,
            "fat_g": 30
        },
        "goal": "weight_loss",
        "conditions": ["hypertension"],
        "preferences": ["low_sodium", "low_fat"],
        "candidate_foods": [
            {"id": 501, "name": "Baked Skinless Chicken Breast", "calories": 165, "protein_g": 31, "carbs_g": 0, "fat_g": 3.6, "category": "meat"},
            {"id": 502, "name": "Steamed Asparagus (1 cup)", "calories": 27, "protein_g": 2.9, "carbs_g": 5, "fat_g": 0.2, "category": "vegetables"},
            {"id": 503, "name": "Canned Soup - Cream of Chicken (1 cup)", "calories": 190, "protein_g": 7, "carbs_g": 20, "fat_g": 9, "category": "snacks"},
            {"id": 504, "name": "Instant Ramen Noodles (1 pack)", "calories": 380, "protein_g": 9, "carbs_g": 54, "fat_g": 14, "category": "fast_food"},
            {"id": 505, "name": "Boiled Egg (1 large)", "calories": 78, "protein_g": 6, "carbs_g": 0.6, "fat_g": 5.3, "category": "dairy"},
            {"id": 506, "name": "Unsalted Brown Rice Cake (2 cakes)", "calories": 70, "protein_g": 1.5, "carbs_g": 15, "fat_g": 0.5, "category": "carbs"},
            {"id": 507, "name": "Sliced Turkey Breast (deli, 85g)", "calories": 90, "protein_g": 18, "carbs_g": 2, "fat_g": 1, "category": "meat"},
            {"id": 508, "name": "Banana (medium)", "calories": 105, "protein_g": 1.3, "carbs_g": 27, "fat_g": 0.4, "category": "fruits"},
            {"id": 509, "name": "Low-Sodium Vegetable Soup (1 cup)", "calories": 80, "protein_g": 3, "carbs_g": 13, "fat_g": 1.5, "category": "vegetables"},
            {"id": 510, "name": "Salted Pretzel Snack Pack", "calories": 110, "protein_g": 3, "carbs_g": 23, "fat_g": 1, "category": "snacks"},
            {"id": 511, "name": "Watermelon (2 cups diced)", "calories": 86, "protein_g": 1.7, "carbs_g": 21, "fat_g": 0.4, "category": "fruits"},
            {"id": 512, "name": "Low-Fat Plain Yogurt (150g)", "calories": 90, "protein_g": 9, "carbs_g": 11, "fat_g": 1.5, "category": "dairy"}
        ]
    }
]
