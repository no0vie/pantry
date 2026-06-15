import { makeAutoObservable } from "mobx";
import type { ShoppingItem } from "../types";

/**
 * State container for all shopping items.
 * Keeps a flat list of {@link ShoppingItem} and allows lookup by id.
 * Each item knows the recipeId it belongs to via its `recipeId` field.
 */
import { DEMO_SHOPPING_ITEMS, DEMO_RECIPES_DATA } from "../constants/state";

export class ShoppingItemState {
  /** Flat array of all shopping items. */
  // Map from item ID to recipe ID
  private recipeMap: Map<string, string> = new Map();
  private items: ShoppingItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Load a single ShoppingItem by its ID from the mock backend.
   * @param id The ID of the item to load.
   */
  loadById = (id: string): void => {
    const demoItem = DEMO_SHOPPING_ITEMS.find((i) => i.id === id);
    if (!demoItem) return;
    const idx = this.items.findIndex((i) => i.id === id);
    const newItem = { ...demoItem, completed: false } as ShoppingItem;
    if (idx !== -1) {
      this.items[idx] = newItem;
    } else {
      this.items.push(newItem);
    }
    // If we already know recipe mapping from loadByRecipe, preserve it
  };

  /**
   * Load all ShoppingItems belonging to a specific Recipe by recipe ID.
   * This also updates the internal recipeMap.
   * @param recipeId The ID of the recipe whose items should be loaded.
   */
  loadByRecipe = (recipeId: string): void => {
    const recipeData = DEMO_RECIPES_DATA.find((r) => r.id === recipeId);
    if (!recipeData) return;

    // Ensure all items for this recipe are added/updated in state.
    recipeData.shoppingList.forEach((item) => {
      const idx = this.items.findIndex((i) => i.id === item.id);
      const newItem = { ...item, completed: false } as ShoppingItem;
      if (idx !== -1) {
        this.items[idx] = newItem;
      } else {
        this.items.push(newItem);
      }
      this.recipeMap.set(item.id, recipeId);
    });
  };

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
