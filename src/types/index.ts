export type TagType = 'bakaleya' | 'conservy' | 'ovoshi' | 'myaso' | 'molochnoe' | 'frukty' | 'specy' | 'drinks';

export interface Tag {
  id: TagType;
  name: string;
  color: string;
  icon: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  tags: TagType[];
  completed: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  cookingTime?: number;
  servings?: number;
  shoppingList: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type GroupByType = 'recipe' | 'tag' | 'none';

export interface GroupedItems {
  [key: string]: ShoppingItem[];
}

export interface RecipeFormValues {
  title: string;
  description?: string;
  cookingTime?: number;
  servings?: number;
}