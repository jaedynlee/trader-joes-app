import { useCallback } from "react";
import { useFilter } from "./useFilter";

export const useProductFilters = (aggregations, categoryId) => {
  const category = useFilter(
    aggregations,
    "category_id",
    "Categories",
    categoryId
  );
  const characteristic = useFilter(
    aggregations,
    "item_characteristics",
    "Characteristics",
    undefined
  );
  const funTag = useFilter(aggregations, "fun_tags", "Tags", undefined);

  const onCategoryOpen = useCallback(() => {
    characteristic.setOpen(false);
    funTag.setOpen(false);
  }, []);

  const onCharacteristicOpen = useCallback(() => {
    category.setOpen(false);
    funTag.setOpen(false);
  }, []);

  const onFunTagOpen = useCallback(() => {
    category.setOpen(false);
    characteristic.setOpen(false);
  }, []);

  return {
    categoryFilter: {
      onOpen: onCategoryOpen,
      ...category,
    },
    characteristicFilter: {
      onOpen: onCharacteristicOpen,
      ...characteristic,
    },
    funTagFilter: {
      onOpen: onFunTagOpen,
      ...funTag,
    },
  };
};
