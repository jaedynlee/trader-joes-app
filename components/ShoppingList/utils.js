import { CATEGORY_NAMES } from './constants'

const getShareableProducts = (section) => {
  let ret = ''

  for (const [key, value] of Object.entries(section)) {
    if (key === 'products') {
      value.forEach(
        ([, item]) => (ret += `${item.count}x ${item.item_title}\n`)
      )
    } else {
      ret += getShareableProducts(value)
    }
  }

  return ret
}

export const getShareableListSections = (listSections) => {
  let ret = ''

  Object.entries(listSections).forEach(([name, section]) => {
    ret += `--- ${name.toUpperCase()} ---\n`
    ret += getShareableProducts(section)
  })

  return ret
}

const EMPTY_SECTION = {
  products: []
}

const addItemToSection = (item, section, hierarchy) => {
  if (hierarchy.length === 0) {
    return { ...section, products: [...section.products, item] }
  }

  const subsectionKey = hierarchy[0]
  const isExistingSection = Object.keys(section).includes(subsectionKey)
  const subsection = isExistingSection ? section[subsectionKey] : EMPTY_SECTION
  const subsectionWithItemAdded = addItemToSection(
    item,
    subsection,
    hierarchy.slice(1)
  )

  return {
    ...section,
    [subsectionKey]: subsectionWithItemAdded
  }
}

export const shoppingListToSections = (shoppingList) => {
  let sections = CATEGORY_NAMES.reduce(
    (acc, name) => ({ ...acc, [name]: EMPTY_SECTION }),
    {}
  )

  for (const [sku, product] of Object.entries(shoppingList)) {
    const item = {
      ...product,
      sku
    }

    sections = addItemToSection(
      item,
      sections,
      product.hierarchy.slice(0, Math.min(product.hierarchy.length, 2))
    )
  }

  return sections
}
