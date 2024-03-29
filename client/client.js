const pageInfo = `
  page_info {\n
    current_page\n
    total_pages\n
    __typename\n
  }\n
`

const aggregations = `
  aggregations {\n
    attribute_code\n
    label\n
    count\n
    options {\n
      label\n
      value\n
      count\n
      __typename\n
    }\n
    __typename\n
  }\n
`

const productListItems = `
  items {\n
    sku\n
    item_title\n
    category_hierarchy {\n
      id\n
      name\n
      __typename\n
    }\n
    primary_image\n
    primary_image_meta {\n
      url\n
      metadata\n
      __typename\n
    }\n
    sales_size\n
    sales_uom_description\n
    price_range {\n
      minimum_price {\n
        final_price {\n
          currency\n
          value\n
          __typename\n
        }\n
        __typename\n
      }\n
      __typename\n
    }\n
    retail_price\n
    fun_tags\n
    item_characteristics\n
    __typename\n
  }\n
`

export const getProductCategories = () =>
  fetch('https://www.traderjoes.com/api/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      variables: {},
      query: `{\n
          categoryList(filters: {ids: {in: ["2"]}})
          {\n
            id\n
            level\n
            name\n
            path\n
            url_key\n
            product_count\n
            children {\n
              id\n
              level\n
              name\n
              path\n
              url_key\n
              product_count\n
              children {\n
                id\n
                level\n
                name\n
                path\n
                url_key\n
                product_count\n
                children {\n
                  id\n
                  level\n
                  name\n
                  path\n
                  url_key\n
                  product_count\n
                  children {\n
                    id\n
                    level\n
                    name\n
                    path\n
                    url_key\n
                    product_count\n
                    __typename\n
                  }\n
                  __typename\n
                }\n
                __typename\n
              }\n
              __typename\n
            }\n
            __typename\n
          }\n
        }\n`
    })
  }).then((response) => response.json())

export const getAllProducts = async (storeCode) => {
  const variables = { storeCode }
  const query = `
  query SearchProducts(
    $storeCode: String,
  ) {\n
      products(\n
        filter: {
          store_code: {eq: $storeCode},
          published: {eq: "1"},
          availability: {match: "1"},
          category_id: {eq: "2"},
        }\n
        currentPage: 1\n
        pageSize: 10000\n
      )
      {\n
        items {\n
          sku\n
          primary_image\n
        }\n
      }\n
    }\n`

  return fetch('https://www.traderjoes.com/api/graphql', {
    method: 'POST',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0',
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operationName: 'SearchProducts',
      variables,
      query
    })
  }).then((response) => response.json())
}
export const getProducts = async (
  storeCode,
  categoryId,
  currentPage,
  search = undefined,
  characteristics = undefined,
  funTags = undefined,
  pageSize = 16
) => {
  const variables = {
    storeCode,
    availability: '1',
    published: '1',
    categoryId,
    currentPage,
    pageSize
  }
  if (search) {
    variables.search = search
  }
  if (characteristics) {
    variables.characteristics = characteristics
  }
  if (funTags) {
    variables.funTags = funTags
  }
  const query = `
    query SearchProducts(
      $categoryId: String,
      $currentPage: Int,
      $pageSize: Int,
      ${search ? '$search: String,' : ''}
      ${characteristics ? '$characteristics: [String], ' : ''}
      ${funTags ? '$funTags: [String], ' : ''}
      $storeCode: String,
      $availability: String = "1",
      $published: String = "1"
    ) {\n
        products(\n
          ${search ? 'search: $search' : ''}
          filter: {
            store_code: {eq: $storeCode},
            published: {eq: $published},
            availability: {match: $availability},
            category_id: {eq: $categoryId},
            ${funTags ? 'fun_tags: {in: $funTags}, ' : ''}
            ${
              characteristics
                ? 'item_characteristics: {in: $characteristics}'
                : ''
            }
          }\n
          currentPage: $currentPage\n
          pageSize: $pageSize\n
        )
        {\n
          ${productListItems}
          total_count\n
          ${pageInfo}
          ${aggregations}
          __typename\n
        }\n
      }\n`

  return fetch('https://www.traderjoes.com/api/graphql', {
    method: 'POST',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0',
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operationName: 'SearchProducts',
      variables,
      query
    })
  }).then((response) => response.json())
}

export const getProductBySku = async (storeCode, sku) =>
  fetch('https://www.traderjoes.com/api/graphql', {
    method: 'POST',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0',
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operationName: 'SearchProduct',
      variables: {
        storeCode,
        published: '1',
        sku
      },
      query:
        'query SearchProduct($sku: String, $storeCode: String, $published: String = "1") {\n  products(\n    filter: {sku: {eq: $sku}, store_code: {eq: $storeCode}, published: {eq: $published}}\n  ) {\n    items {\n      category_hierarchy {\n        id\n        url_key\n        description\n        name\n        position\n        level\n        created_at\n        updated_at\n        product_count\n        __typename\n      }\n      item_story_marketing\n      product_label\n      fun_tags\n      primary_image\n      primary_image_meta {\n        url\n        metadata\n        __typename\n      }\n      other_images\n      other_images_meta {\n        url\n        metadata\n        __typename\n      }\n      context_image\n      context_image_meta {\n        url\n        metadata\n        __typename\n      }\n      published\n      sku\n      url_key\n      name\n      item_description\n      item_title\n      item_characteristics\n      item_story_qil\n      use_and_demo\n      sales_size\n      sales_uom_code\n      sales_uom_description\n      country_of_origin\n      availability\n      new_product\n      promotion\n      price_range {\n        minimum_price {\n          final_price {\n            currency\n            value\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      retail_price\n      nutrition {\n        display_sequence\n        panel_id\n        panel_title\n        serving_size\n        calories_per_serving\n        servings_per_container\n        details {\n          display_seq\n          nutritional_item\n          amount\n          percent_dv\n          __typename\n        }\n        __typename\n      }\n      ingredients {\n        display_sequence\n        ingredient\n        __typename\n      }\n      allergens {\n        display_sequence\n        ingredient\n        __typename\n      }\n      created_at\n      first_published_date\n      last_published_date\n      updated_at\n      related_products {\n        sku\n        item_title\n        primary_image\n        primary_image_meta {\n          url\n          metadata\n          __typename\n        }\n        price_range {\n          minimum_price {\n            final_price {\n              currency\n              value\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        retail_price\n        sales_size\n        sales_uom_description\n        category_hierarchy {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    total_count\n    page_info {\n      current_page\n      page_size\n      total_pages\n      __typename\n    }\n    __typename\n  }\n}\n'
    })
  }).then((response) => response.json())

export const getNearbyStores = (zipCode) =>
  fetch('https://alphaapi.brandify.com/rest/locatorsearch', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      request: {
        appkey: '8BC3433A-60FC-11E3-991D-B2EE0C70A832',
        formdata: {
          geoip: false,
          dataview: 'store_default',
          limit: 4,
          geolocs: {
            geoloc: [
              {
                addressline: zipCode,
                country: 'US',
                latitude: '',
                longitude: ''
              }
            ]
          },
          searchradius: '500',
          where: {
            warehouse: {
              distinctfrom: '1'
            }
          },
          false: '0'
        }
      }
    })
  })
    .then((response) => response.json())
    .then((jsonResponse) => jsonResponse.response)
