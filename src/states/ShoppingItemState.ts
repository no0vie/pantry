import { makeAutoObservable } from "mobx";
import type { ShoppingItem } from "../types";

/**
 * State container for all shopping items.
 * Keeps a flat list of {@link ShoppingItem} and allows lookup by id.
 * Each item knows the recipeId it belongs to via its `recipeId` field.
 */
export class ShoppingItemState {
  /** Flat array of all shopping items. */
  // Map from item ID to recipe ID
  private recipeMap: Map<string, string> = new Map();
  private items: ShoppingItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  /* ---------- Utility getters ---------- */
  get byId(): Map<string, ShoppingItem> {
    const map = new Map<string, ShoppingItem>();
    this.items.forEach((i) => map.set(i.id, i));
    return map;
  }

  /** Get all items for a specific recipe. */
  getByRecipe(recipeId: string): ShoppingItem[] {
    return this.items.filter((i) => this.recipeMap.get(i.id) === recipeId);
  }

  /** Get the recipe ID for a shopping item. */
  getRecipeForItem(id: string): string | undefined {
    return this.recipeMap.get(id);
  }

  /* ---------- Mutations ---------- */
  addItem = (
    recipeId: string,
    item: Omit<ShoppingItem, "id" | "completed">,
  ): void => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      completed: false,
      ...item,
    };
    this.items.push(newItem);
    this.recipeMap.set(newItem.id, recipeId);
  };

  toggleCompleted = (id: string): void => {
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      this.items[idx].completed = !this.items[idx].completed;
    }
  };

  updateItem = (
    id: string,
    values: Partial<Pick<ShoppingItem, "name" | "amount" | "tags">>,
  ): void => {
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      this.items[idx] = { ...this.items[idx], ...values };
    }
  };

  deleteItem = (id: string): void => {
    this.items = this.items.filter((i) => i.id !== id);
    this.recipeMap.delete(id);
  };
}

export const shoppingItemState = new ShoppingItemState();
