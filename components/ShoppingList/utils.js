
const getShareableProducts = (section) => {
    let ret = ''

    const products = Object.entries(section.products)
    if (products.length > 0) {
      products.forEach(
        ([, item]) => (ret += `${item.count}x ${item.item_title}\n`)
      )
    }
    if (section.subsections) {
      section.subsections.forEach(
        (subsection) => (ret += getShareableProducts(subsection))
      )
    }

    return ret
  }

  export const getShareableListSections = (listSections) => {
    let ret = ''

    listSections.forEach((section) => {
      ret += `--- ${section.name.toUpperCase()} ---\n`
      ret += getShareableProducts(section)
    })

    return ret
  }

  export const shoppingListToSections = (shoppingList) => {
    const sections = []
    for (const [key, value] of Object.entries(shoppingList)) {
      if (key === 'products') {
        continue
      }

      const item = {}
      item.name = key
      item.products = value.products ?? {}
      item.subsections = shoppingListToSections(value)

      sections.push(item)
    }

    return sections
  }