
export const getCategoryList = async () => {
    try {
        const response = await fetch('https://www.traderjoes.com/api/graphql/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: {
                "variables": {},
                "query": "{\n  categoryList(filters: {ids: {in: [\"2\"]}}) {\n    id\n    level\n    name\n    path\n    url_key\n    product_count\n    children {\n      id\n      level\n      name\n      path\n      url_key\n      product_count\n      children {\n        id\n        level\n        name\n        path\n        url_key\n        product_count\n        children {\n          id\n          level\n          name\n          path\n          url_key\n          product_count\n          children {\n            id\n            level\n            name\n            path\n            url_key\n            product_count\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
            }
        });
        return response.json();
    } catch (error) {
        console.error(error);
    }
}