# react-native-paginated-list

A reusable paginated list component for React Native that handles infinite scrolling, API data fetching, and renders components generically in a list.

You can pass a custom card component to render the list items, the API endpoint to fetch data from, the number of items per page, and a few other props, and this component will handle the following:

- Fetching data from the specified API endpoint.
- Managing pagination.
- Handling infinite scrolling (i.e., fetching more data as the user scrolls near the end of the current page).
- Rendering the custom card component in a `FlatList`.
- Displaying the list in `n` number of columns, where `n` is passed as a prop.
- Displaying a customizable message if no results are found or if an error occurs.

## Features

- **API Data Fetching**: Fetch data from a given API endpoint using pagination.
- **Infinite Scrolling**: Automatically fetch more data when the user scrolls near the bottom of the list.
- **Custom Rendering**: Pass a custom card component to render each item in the list.
- **Multiple Columns**: Display the list items in a customizable number of columns.
- **Error and Empty State Handling**: Show messages when there is an error or when no data is available.
## Installation

To install the package, run:

```bash
npm install react-native-paginated-list
``` 
 
## Usage
Here’s a simple example of how to use the `PaginatedList` component:

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

The backend response must follow this format:

```json
{
  "data": [],  
  "meta": {
    "pagination": {
      "page": 1,             
      "pageCount": 10        
    }
  }
}

```
- `data` : The array of items that will be displayed in the list. 
- `meta.pagination.page` : The current page number, used to determine the next page to fetch. 
- `meta.pagination.pageCount` : The total number of pages, used to determine when to stop fetching additional data.

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



