import { DemoRecipeData } from "../types";

import type { ShoppingItem } from "../types";

export const DEMO_SHOPPING_ITEMS: ShoppingItem[] = [];

export const DEMO_RECIPES_DATA: DemoRecipeData[] = [
  {
    id: "1",
    title: "Борщ украинский",
    description: "Традиционный украинский борщ с мясом и овощами",
    cookingTime: 90,
    servings: 6,
    shoppingList: [
      {
        id: "1-1",
        name: "Свекла",
        quantity: "г",
        value: 200,
        tags: ["ovoshi"],
        completed: false,
      },
      {
        id: "1-2",
        name: "Капуста",
        quantity: "г",
        value: 200,
        tags: ["ovoshi"],
        completed: false,
      },
      {
        id: "1-3",
        name: "Картофель",
        quantity: "г",
        value: 200,
        tags: ["ovoshi"],
        completed: false,
      },
      {
        id: "1-4",
        name: "Говядина",
        quantity: "г",
        value: 500,
        tags: ["myaso"],
        completed: false,
      },
      {
        id: "1-5",
        name: "Томатная паста",
        quantity: "ст.л.",
        value: 2,
        tags: ["conservy"],
        completed: false,
      },
      {
        id: "1-6",
        name: "Морковь",
        quantity: "г",
        value: 100,
        tags: ["ovoshi"],
        completed: false,
      },
      {
        id: "1-7",
        name: "Лук",
        quantity: "г",
        value: 50,
        tags: ["ovoshi"],
        completed: false,
      },
    ],
  },
  {
    id: "2",
    title: "Оливье классический",
    description: "Любимый новогодний салат",
    cookingTime: 60,
    servings: 8,
    shoppingList: [
      {
        id: "2-1",
        name: "Картофель",
        quantity: "г",
        value: 500,
        tags: ["ovoshi"],
        completed: false,
      },
      {
        id: "2-2",
        name: "Морковь",
        quantity: "г",
        value: 150,
        tags: ["ovoshi"],
        completed: false,
      },
      {
        id: "2-3",
        name: "Яйца",
        quantity: "шт",
        value: 6,
        tags: ["molochnoe"],
        completed: false,
      },
      {
        id: "2-4",
        name: "Колбаса докторская",
        quantity: "г",
        value: 300,
        tags: ["myaso"],
        completed: true,
      },
      {
        id: "2-5",
        name: "Огурцы маринованные",
        quantity: "г",
        value: 200,
        tags: ["conservy"],
        completed: false,
      },
      {
        id: "2-6",
        name: "Горошек зеленый",
        quantity: "банка",
        value: 1,
        tags: ["conservy"],
        completed: false,
      },
      {
        id: "2-7",
        name: "Майонез",
        quantity: "г",
        value: 200,
        tags: ["bakaleya"],
        completed: false,
      },
    ],
  },
  {
    id: "3",
    title: "Паста Карбонара",
    description: "Классическая итальянская паста",
    cookingTime: 30,
    servings: 4,
    shoppingList: [
      {
        id: "3-1",
        name: "Спагетти",
        quantity: "г",
        value: 400,
        tags: ["bakaleya"],
        completed: false,
      },
      {
        id: "3-2",
        name: "Бекон",
        quantity: "г",
        value: 200,
        tags: ["myaso"],
        completed: false,
      },
      {
        id: "3-3",
        name: "Яйца",
        quantity: "шт",
        value: 3,
        tags: ["molochnoe"],
        completed: false,
      },
      {
        id: "3-4",
        name: "Сыр Пармезан",
        quantity: "г",
        value: 100,
        tags: ["molochnoe"],
        completed: false,
      },
      {
        id: "3-5",
        name: "Сливки",
        quantity: "мл",
        value: 200,
        tags: ["molochnoe"],
        completed: false,
      },
      {
        id: "3-6",
        name: "Чеснок",
        quantity: "зубчика",
        value: 2,
        tags: ["ovoshi"],
        completed: false,
      },
    ],
  },
];

// Build shopping items array from demo recipes
DEMO_RECIPES_DATA.forEach((recipe) => {
  recipe.shoppingList.forEach((item) => {
    DEMO_SHOPPING_ITEMS.push({ ...item });
  });
});
