# react-native-paginated-list

This component renders a list of any custom UI component with populated data and manages pagination and infinite scrolling. Simply provide your API endpoint and card component, and react-native-paginated-list handles data fetching, loading more as you scroll, customizable layouts, and displaying a message when no results are found.
  
It adheres to Separation of Concerns by keeping UI design separate from data logic, follows DRY (Don't Repeat Yourself) by centralizing pagination logic and making it reusable, and applies the Single Responsibility Principle (SRP), focusing solely on pagination and data fetching for easier maintenance and extension.

Provide the API endpoint, card UI component (e.g., product card, notification card, profile card), number of items per page, and a few other props, and the component will:

- Fetching data from the specified API endpoint.
- Managing pagination.
- Handling infinite scrolling (i.e., fetching more data as the user scrolls near the end of the current page).
- Rendering the custom card component in a `FlatList`.
- Displaying the list in `n` number of columns, where `n` is passed as a prop.
- Displaying a customizable message if no results are found or if an error occurs.

## Features

- **API Data Fetching**: Fetch data from a given API endpoint using pagination.
- **Infinite Scrolling**: Automatically fetch more data when the user scrolls near the bottom of the list.
- **Custom Rendering**: Pass a custom UI card component to render each item in the list.
- **Multiple Columns**: Display the list items in a customizable number of columns.
- **Error and Empty State Handling**: Show messages when there is an error or when no data is available.
## Installation

To install the package, run:

```bash
npm install react-native-paginated-list
``` 
 
## Usage
Here’s a simple 3 step example of how to use the `PaginatedList` component:

1. First, you need to design a UI component that represents each item in your list. For example, if you are displaying products from an API, your component might show the product name and price.
Here’s a simple example of a ProductCard component that displays the product’s name and price:
 
```jsx
const ProductCard = ({ item }) => (
  <Text>{item.name}</Text>   <Text>{item.price}</Text>
);
```

2. Your API endpoint should return data in a format like this, where the data array contains a list of products:
 
```json
    {
        "data": [
            { 
                "id": 1, 
                "name": "Product 1" , 
                "price" :10  
            }, 
            { 
                "id": 2, 
                "name": "Product 2" , 
                "price" : 15  
            }
        ],
        "meta": {
            "pagination": {
                "page": 1,
                "pageCount": 1
            }
        }
    };
 ```   
- `data` : The array of items that will be displayed in the list. 
- `meta.pagination.page` : The current page number, used to determine the next page to fetch. 
- `meta.pagination.pageCount` : The total number of pages, used to determine when to stop fetching additional data.

**Important Note"** react-native-paginated-list expects the backend to return data in the specified format, particularly the meta section. This section is crucial as it provides the pagination details used by the component to calculate the next page for infinite scrolling.

3. Use PaginatedList and pass the props (details below)

```jsx
import React from 'react';
import PaginatedList from 'react-native-paginated-list';
import ProductCard from './components/ProductCard';

const ProductsScreen = () => (
  <PaginatedList
    CardComponent={ProductCard}
    endpoint="https://api.example.com/products"
    collectionPath="products"
    emptyMessageEntity="Products"
    loaderColor="blue"
    itemsPerPage={30}
    columns={2}
  />
);

export default ProductsScreen;
```

## Props 

| Prop Name            | Type              | Default     | Description |
|----------------------|-------------------|-------------|-------------|
| `CardComponent`       | `Component`       | **Required**| The component used to render each item in the list. |
| `endpoint`            | `string`          | **Required**| The API endpoint to fetch paginated data from. |
| `collectionPath`      | `string`          | `'data'`    | Path in the response where the list of items is located. |
| `itemsPerPage`        | `number`          | `30`        | Number of items to fetch per page. |
| `refetchKey`          | `number`          | `0`         | Key used to trigger refetching the data. |
| `columns`             | `number`          | `1`         | Number of columns in the `FlatList`. |
| `loaderColor`         | `string`          | `'lightgrey'` | Color of the loading spinner (`ActivityIndicator`). |
| `emptyMessageEntity`  | `string`          | `'Items'`   | The entity name to use in the "No X found" message. |
| `axiosInstance`       | `object`          | `defaultAxios` | Optional custom Axios instance for API calls. |



