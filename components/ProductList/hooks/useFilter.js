import { useEffect, useState } from 'react'

const aggregationOptionToDropdownOption = (o) => ({
  label: o.label,
  value: o.value,
  key: o.label
})

export const useFilter = (
  aggregations,
  aggregationCode,
  name,
  defaultValue
) => {
  const defaultValueKey = `all-${name.toLowerCase()}`

  const [value, setValue] = useState(defaultValue ?? defaultValueKey)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (aggregations === undefined) return

    const aggregation = aggregations.find(
      (a) => a.attribute_code === aggregationCode
    )
    aggregation &&
      setItems([
        {
          label: `All ${name}`,
          value: defaultValue ?? defaultValueKey,
          key: defaultValueKey
        },
        ...aggregation.options.map((o) => aggregationOptionToDropdownOption(o))
      ])
  }, [aggregations])

  return {
    items,
    open,
    setItems,
    setOpen,
    setValue,
    value
  }
}
