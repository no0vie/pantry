import { computed, makeAutoObservable } from "mobx";
import type { ShoppingItem } from "../types";

/**
 * State container for all shopping items.
 * Keeps a flat list of {@link ShoppingItem} and allows lookup by id.
 * Each item knows the recipeId it belongs to via its `recipeId` field.
 */
import { DEMO_SHOPPING_ITEMS } from "../constants/state";

export class ShoppingItemState {
  items: ShoppingItem[] = [];

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  get quantityItemMap() {
    return this.items.reduce(
      (
        acc: { [x: ShoppingItem["name"]]: Array<ShoppingItem["quantity"]> },
        item,
      ) => {
        const curQuantities = acc[item.name] || [];
        if (!curQuantities.includes(item.quantity)) {
          curQuantities.push(item.quantity);
        }

        acc[item.name] = curQuantities;

        return acc;
      },
      {},
    );
  }

  /** Load a single ShoppingItem by its ID from the mock backend. */
  loadById = async (id: string, storeToLocalStorage = true): Promise<void> => {
    // Simulate backend delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    const demoItem = DEMO_SHOPPING_ITEMS.find((i) => i.id === id);
    if (!demoItem) return;
    const idx = this.items.findIndex((i) => i.id === id);
    const newItem = { ...demoItem, completed: false } as ShoppingItem;
    if (idx !== -1) {
      this.items[idx] = newItem;
    } else {
      this.items.push(newItem);
    }

    if (storeToLocalStorage) {
      this.saveToLocalStorage();
    }
  };

  /** Load multiple shopping items by their IDs */
  loadByIds = async (ids: string[]): Promise<void> => {
    await Promise.all(ids.map((id) => this.loadById(id, false)));

    this.saveToLocalStorage();
  };

  private initialize(): void {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("shopping_items")
        : null;
    if (stored) {
      try {
        this.items = JSON.parse(stored);
      } catch (_) {}
    }
  }

  /** Persist items to localStorage and record timestamp */
  private saveToLocalStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("shopping_items", JSON.stringify(this.items));
      localStorage.setItem("shopping_items_last_saved", Date.now().toString());
    } catch (_) {}
  }

  /* ---------- Mutations ---------- */
  addItem = (item: Omit<ShoppingItem, "id" | "completed">): ShoppingItem => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      completed: false,
      ...item,
    };
    this.items.push(newItem);
    this.saveToLocalStorage();
    return newItem;
  };

  toggleCompleted = (id: string): void => {
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      this.items[idx].completed = !this.items[idx].completed;
      this.saveToLocalStorage();
    }
  };

  updateItem = (
    id: string,
    values: Partial<Pick<ShoppingItem, "name" | "quantity" | "value" | "tags">>,
  ): void => {
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      this.items[idx] = { ...this.items[idx], ...values };
      this.saveToLocalStorage();
    }
  };

  deleteItem = (id: string): void => {
    this.items = this.items.filter((i) => i.id !== id);
    this.saveToLocalStorage();
  };
}

export const shoppingItemState = new ShoppingItemState();
