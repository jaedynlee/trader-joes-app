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

export const getProducts = async (
  categoryId,
  currentPage,
  characteristics = undefined,
  funTags = undefined,
  pageSize = 16
) => {
  const variables = {
    storeCode: "561",
    availability: "1",
    published: "1",
    categoryId: categoryId,
    currentPage: currentPage,
    pageSize: pageSize,
  };
  if (characteristics) {
    variables.characteristics = characteristics;
  }
  if (funTags) {
    variables.funTags = funTags;
  }
  const query = `query SearchProducts($categoryId: String, $currentPage: Int, $pageSize: Int, ${
    characteristics ? "$characteristics: [String], " : ""
  }${
    funTags ? "$funTags: [String], " : ""
  }$storeCode: String = "561", $availability: String = "1", $published: String = "1") {\n  products(\n    filter: {store_code: {eq: $storeCode}, published: {eq: $published}, availability: {match: $availability}, category_id: {eq: $categoryId}, ${
    funTags ? "fun_tags: {in: $funTags}, " : ""
  }${
    characteristics ? "item_characteristics: {in: $characteristics}" : ""
  }}\n    currentPage: $currentPage\n    pageSize: $pageSize\n  ) {\n    items {\n      sku\n      item_title\n      category_hierarchy {\n        id\n        name\n        __typename\n      }\n      primary_image\n      primary_image_meta {\n        url\n        metadata\n        __typename\n      }\n      sales_size\n      sales_uom_description\n      price_range {\n        minimum_price {\n          final_price {\n            currency\n            value\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      retail_price\n      fun_tags\n      item_characteristics\n      __typename\n    }\n    total_count\n    pageInfo: page_info {\n      currentPage: current_page\n      totalPages: total_pages\n      __typename\n    }\n    aggregations {\n      attribute_code\n      label\n      count\n      options {\n        label\n        value\n        count\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n`;

  return fetch("https://www.traderjoes.com/api/graphql", {
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
    },
    body: JSON.stringify({
      operationName: "SearchProducts",
      variables: {
        storeCode: "561",
        availability: "1",
        published: "1",
        categoryId: categoryId,
        currentPage: currentPage,
        pageSize: pageSize,
        characteristics: characteristics,
        funTags: funTags,
      },
      query: query,
    }),
  }).then((response) => response.json());
};

export const getProductBySku = async (sku) =>
  fetch("https://www.traderjoes.com/api/graphql", {
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
    },
    body: JSON.stringify({
      operationName: "SearchProduct",
      variables: {
        storeCode: "561",
        published: "1",
        sku: sku,
      },
      query:
        'query SearchProduct($sku: String, $storeCode: String = "561", $published: String = "1") {\n  products(\n    filter: {sku: {eq: $sku}, store_code: {eq: $storeCode}, published: {eq: $published}}\n  ) {\n    items {\n      category_hierarchy {\n        id\n        url_key\n        description\n        name\n        position\n        level\n        created_at\n        updated_at\n        product_count\n        __typename\n      }\n      item_story_marketing\n      product_label\n      fun_tags\n      primary_image\n      primary_image_meta {\n        url\n        metadata\n        __typename\n      }\n      other_images\n      other_images_meta {\n        url\n        metadata\n        __typename\n      }\n      context_image\n      context_image_meta {\n        url\n        metadata\n        __typename\n      }\n      published\n      sku\n      url_key\n      name\n      item_description\n      item_title\n      item_characteristics\n      item_story_qil\n      use_and_demo\n      sales_size\n      sales_uom_code\n      sales_uom_description\n      country_of_origin\n      availability\n      new_product\n      promotion\n      price_range {\n        minimum_price {\n          final_price {\n            currency\n            value\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      retail_price\n      nutrition {\n        display_sequence\n        panel_id\n        panel_title\n        serving_size\n        calories_per_serving\n        servings_per_container\n        details {\n          display_seq\n          nutritional_item\n          amount\n          percent_dv\n          __typename\n        }\n        __typename\n      }\n      ingredients {\n        display_sequence\n        ingredient\n        __typename\n      }\n      allergens {\n        display_sequence\n        ingredient\n        __typename\n      }\n      created_at\n      first_published_date\n      last_published_date\n      updated_at\n      related_products {\n        sku\n        item_title\n        primary_image\n        primary_image_meta {\n          url\n          metadata\n          __typename\n        }\n        price_range {\n          minimum_price {\n            final_price {\n              currency\n              value\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        retail_price\n        sales_size\n        sales_uom_description\n        category_hierarchy {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    total_count\n    page_info {\n      current_page\n      page_size\n      total_pages\n      __typename\n    }\n    __typename\n  }\n}\n',
    }),
  }).then((response) => response.json());

export const searchProducts = async (
  search,
  storeCode = "561",
  availabile = true,
  published = true
) =>
  fetch("https://www.traderjoes.com/api/graphql", {
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
    },
    body: JSON.stringify({
      operationName: "SearchProducts",
      variables: {
        storeCode: storeCode,
        availability: availabile ? "1" : "0",
        published: published ? "1" : "0",
        search: search,
        currentPage: 0,
        pageSize: 15,
      },
      query:
        'query SearchProducts($search: String, $pageSize: Int, $currentPage: Int, $storeCode: String = "561", $availability: String = "1", $published: String = "1") {\n  products(\n    search: $search\n    filter: {store_code: {eq: $storeCode}, published: {eq: $published}, availability: {match: $availability}}\n    pageSize: $pageSize\n    currentPage: $currentPage\n  ) {\n    items {\n      category_hierarchy {\n        id\n        url_key\n        description\n        name\n        position\n        level\n        created_at\n        updated_at\n        product_count\n        __typename\n      }\n      item_story_marketing\n      product_label\n      fun_tags\n      primary_image\n      primary_image_meta {\n        url\n        metadata\n        __typename\n      }\n      other_images\n      other_images_meta {\n        url\n        metadata\n        __typename\n      }\n      context_image\n      context_image_meta {\n        url\n        metadata\n        __typename\n      }\n      published\n      sku\n      url_key\n      name\n      item_description\n      item_title\n      item_characteristics\n      item_story_qil\n      use_and_demo\n      sales_size\n      sales_uom_code\n      sales_uom_description\n      country_of_origin\n      availability\n      new_product\n      promotion\n      price_range {\n        minimum_price {\n          final_price {\n            currency\n            value\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      retail_price\n      nutrition {\n        display_sequence\n        panel_id\n        panel_title\n        serving_size\n        calories_per_serving\n        servings_per_container\n        details {\n          display_seq\n          nutritional_item\n          amount\n          percent_dv\n          __typename\n        }\n        __typename\n      }\n      ingredients {\n        display_sequence\n        ingredient\n        __typename\n      }\n      allergens {\n        display_sequence\n        ingredient\n        __typename\n      }\n      created_at\n      first_published_date\n      last_published_date\n      updated_at\n      related_products {\n        sku\n        item_title\n        primary_image\n        primary_image_meta {\n          url\n          metadata\n          __typename\n        }\n        price_range {\n          minimum_price {\n            final_price {\n              currency\n              value\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        retail_price\n        sales_size\n        sales_uom_description\n        category_hierarchy {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    total_count\n    page_info {\n      current_page\n      page_size\n      total_pages\n      __typename\n    }\n    __typename\n  }\n}\n',
    }),
  }).then((response) => response.json());
