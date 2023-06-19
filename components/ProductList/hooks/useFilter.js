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

  const [valueToLabel, setValueToLabel] = useState({})
  const [value, setValue] = useState(defaultValue ?? defaultValueKey)
  const [displayValue, setDisplayValue] = useState(undefined)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    setDisplayValue(valueToLabel[value])
  }, [value, valueToLabel])

  useEffect(() => {
    if (aggregations === undefined) return

    const aggregation = aggregations.find(
      (a) => a.attribute_code === aggregationCode
    )
    if (aggregation) {
      const itemDefaultValue = defaultValue ?? defaultValueKey
      const items = [
        {
          label: `All ${name}`,
          value: itemDefaultValue,
          key: defaultValueKey
        },
        ...aggregation.options.map((o) => aggregationOptionToDropdownOption(o))
      ]
      setItems(items)
      setValueToLabel(
        items.reduce(
          (acc, i) => ({
            ...acc,
            [i.value]: i.value === itemDefaultValue ? undefined : i.label
          }),
          {}
        )
      )
    }
  }, [aggregations])

  return {
    label: name,
    items,
    open,
    setItems,
    setOpen,
    setValue,
    value,
    displayValue
  }
}
