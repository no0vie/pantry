import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import type { GroupByType, Recipe, ShoppingItem } from "../types";
import { recipeState } from "../states/RecipeState";
import ShoppingListHeader from "./ShoppingListHeader";
import ShoppingList from "./ShoppingList";
import RecipeItemModal from "./RecipeItemModal";

const RecipeShoppingList: React.FC = observer(() => {
  const { recipes } = recipeState;
  const [groupBy, setGroupBy] = useState<GroupByType>("recipe");
  const [searchText, setSearchText] = useState("");

  // Modal state for editing items
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  // Add action placeholder (not functional in this view)
  const handleAdd = () => {
    console.log("Add item button clicked");
  };

  const openEdit = (recipeId: string) => (item: ShoppingItem) => {
    setEditingRecipeId(recipeId);
    setEditingItem(item);
    setIsItemModalVisible(true);
  };

  const handleDelete = (recipeId: string) => (id: string) => {
    recipeState.deleteShoppingItem(recipeId, id);
  };

  const handleToggle = (recipeId: string) => (id: string) => {
    recipeState.toggleShoppingItem(recipeId, id);
  };

  if (recipes.length === 0) {
    return <div>Нет рецептов для отображения.</div>;
  }

  // Merge all shopping items for aggregated view
  const mergedItems: ShoppingItem[] = recipes.flatMap((r) => r.shoppingList);
  const virtualRecipe: Recipe = {
    id: "all",
    title: "Общий список",
    description: "",
    cookingTime: 0,
    servings: 0,
    shoppingList: mergedItems,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div style={{ padding: "16px" }}>
      <ShoppingListHeader
        searchText={searchText}
        setSearchText={setSearchText}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        onAdd={handleAdd}
      />
      {groupBy === "recipe" ? (
        recipes.map((r) => (
          <ShoppingList
            key={r.id}
            selectedRecipe={r}
            groupBy={groupBy}
            searchText={searchText}
            onEdit={openEdit(r.id)}
            onDelete={handleDelete(r.id)}
            onToggle={handleToggle(r.id)}
          />
        ))
      ) : (
        <ShoppingList
          selectedRecipe={virtualRecipe}
          groupBy={groupBy}
          searchText={searchText}
          onEdit={() => {}}
          onDelete={() => {}}
          onToggle={() => {}}
        />
      )}
      {isItemModalVisible && (
        <RecipeItemModal
          visible={isItemModalVisible}
          onClose={() => setIsItemModalVisible(false)}
          onSubmit={(values) => {
            if (editingRecipeId && editingItem) {
              recipeState.updateShoppingItem(editingRecipeId, editingItem.id, {
                name: values.name,
                amount: values.amount,
                tags: values.tags || [],
              });
            } else if (editingRecipeId) {
              // Adding new item to recipe
              recipeState.addShoppingItem(editingRecipeId, {
                name: values.name,
                amount: values.amount,
                tags: values.tags || [],
              });
            }
            setIsItemModalVisible(false);
          }}
          editingItem={editingItem}
        />
      )}
    </div>
  );
});

export default RecipeShoppingList;
