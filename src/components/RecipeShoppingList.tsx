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

  const handleAdd = () => {
    setIsItemModalVisible(true);
  };

  // Prepare aggregated data when in 'none' group
  const mergedItems: (ShoppingItem & { originalRecipeId?: string })[] =
    recipes.flatMap((r) =>
      r.shoppingList.map((item) => ({ ...item, originalRecipeId: r.id })),
    );
  const virtualRecipe: Recipe = {
    id: "all",
    title: "Общий список",
    description: "",
    cookingTime: 0,
    servings: 0,
    shoppingList: mergedItems as ShoppingItem[],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const itemToRecipeMap = new Map<string, string>();
  mergedItems.forEach((item) => {
    if (item.originalRecipeId) {
      itemToRecipeMap.set(item.id, item.originalRecipeId);
    }
  });

  const openEdit = (recipeId?: string) => (item: ShoppingItem) => {
    setEditingRecipeId(recipeId || (item as any).originalRecipeId!);
    setEditingItem(item);
    setIsItemModalVisible(true);
  };

  const handleDeleteAggregated = (id: string) => {
    const rid = itemToRecipeMap.get(id);
    if (rid) recipeState.deleteShoppingItem(rid, id);
  };

  const handleToggleAggregated = (id: string) => {
    const rid = itemToRecipeMap.get(id);
    if (rid) recipeState.toggleShoppingItem(rid, id);
  };

  if (!recipes.length) return <div>Нет рецептов для отображения.</div>;

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
            onDelete={(id: string) => recipeState.deleteShoppingItem(r.id, id)}
            onToggle={(id: string) => recipeState.toggleShoppingItem(r.id, id)}
          />
        ))
      ) : (
        <ShoppingList
          selectedRecipe={virtualRecipe}
          groupBy={groupBy}
          searchText={searchText}
          onEdit={openEdit()}
          onDelete={(id: string) => handleDeleteAggregated(id)}
          onToggle={(id: string) => handleToggleAggregated(id)}
        />
      )}
      {isItemModalVisible && (
        <RecipeItemModal
          visible={isItemModalVisible}
          onClose={() => setIsItemModalVisible(false)}
          recepies={recipes}
          onSubmit={(values) => {
            const recipeId = values.recipe;
            if (!recipeId) {
              // no selection, error handling maybe
              return;
            }
            if (editingRecipeId && editingItem) {
              recipeState.updateShoppingItem(editingRecipeId, editingItem.id, {
                name: values.name,
                amount: values.amount,
                tags: values.tags || [],
              });
            } else if (editingRecipeId) {
              // adding to specific recipe from list view
              recipeState.addShoppingItem(editingRecipeId, {
                name: values.name,
                amount: values.amount,
                tags: values.tags || [],
              });
            } else {
              // adding when not editing a recipe; use selected recipe id
              const selectedRecipeId = values.recipe;
              recipeState.addShoppingItem(selectedRecipeId, {
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
