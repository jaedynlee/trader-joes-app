export const getAllProducts = () =>
  fetch("https://www.traderjoes.com/api/graphql", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      variables: {},
      query:
        '{\n  categoryList(filters: {ids: {in: ["2"]}}) {\n    id\n    level\n    name\n    path\n    url_key\n    product_count\n    children {\n      id\n      level\n      name\n      path\n      url_key\n      product_count\n      children {\n        id\n        level\n        name\n        path\n        url_key\n        product_count\n        children {\n          id\n          level\n          name\n          path\n          url_key\n          product_count\n          children {\n            id\n            level\n            name\n            path\n            url_key\n            product_count\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
    }),
  }).then((response) => response.json());

export const getProductsByCategory = async (categoryId) =>
  fetch("https://www.traderjoes.com/api/graphql", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      operationName: "SearchProducts",
      variables: {
        storeCode: "561",
        availability: "1",
        published: "1",
        categoryId: categoryId,
        currentPage: 1,
        pageSize: 15,
      },
      query:
        'query SearchProducts($categoryId: String, $currentPage: Int, $pageSize: Int, $storeCode: String = "561", $availability: String = "1", $published: String = "1") {\n  products(\n    filter: {store_code: {eq: $storeCode}, published: {eq: $published}, availability: {match: $availability}, category_id: {eq: $categoryId}}\n    currentPage: $currentPage\n    pageSize: $pageSize\n  ) {\n    items {\n      sku\n      item_title\n      category_hierarchy {\n        id\n        name\n        __typename\n      }\n      primary_image\n      primary_image_meta {\n        url\n        metadata\n        __typename\n      }\n      sales_size\n      sales_uom_description\n      price_range {\n        minimum_price {\n          final_price {\n            currency\n            value\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      retail_price\n      fun_tags\n      item_characteristics\n      __typename\n    }\n    total_count\n    pageInfo: page_info {\n      currentPage: current_page\n      totalPages: total_pages\n      __typename\n    }\n    aggregations {\n      attribute_code\n      label\n      count\n      options {\n        label\n        value\n        count\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
    }),
  }).then((response) => response.json());
