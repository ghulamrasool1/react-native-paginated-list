# react-native-paginated-list

This component renders a list of any custom UI component with data fetched from an API, efficiently managing pagination and infinite scrolling. Just provide your API endpoint and card component, and `react-native-paginated-list` takes care of data fetching, loading additional content as you scroll, customizable layouts, and displaying messages when no results are found.
  
The library centralizes pagination logic and is designed to be reusable across different scenarios, reducing repetitive code (following DRY—Don’t Repeat Yourself). It also adheres to the Single Responsibility Principle (SRP), focusing exclusively on handling pagination and data fetching, which simplifies both maintenance and extensibility.

You provide the API endpoint, the card UI component (e.g., product card, notification card, profile card), the number of items per page, and a few other props, and the component will:

- Fetch data from the provided API endpoint.
- Manage pagination efficiently.
- Handle infinite scrolling (automatically fetching more data when the user scrolls near the end of the list).
- Render the custom card component using a FlatList.
- Display the list in a customizable number of columns.
- Show a customizable message when no results are found or when an error occurs.

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
  <Text>{item.name}</Text>   
  <Text>{item.price}</Text>
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
    } 
 ```    
- `data` : The array of items that will be displayed in the list. 
- `meta.pagination.page` : The current page number, used to determine the next page to fetch. 
- `meta.pagination.pageCount` : The total number of pages, used to determine when to stop fetching additional data.

**Important Note"** react-native-paginated-list expects the backend to return data in the specified format, particularly the meta section. This section is crucial as it provides the pagination details used by the component to calculate the next page for infinite scrolling.
- It is also important to have a unique `id` as part of the item being fetched from backend,

3. Use PaginatedList and pass the props (details below), wrapping it in a QueryClientProvider (required by react-query, which is used by the PaginatedList component)

```jsx
import React from 'react';
import { PaginatedList } from 'react-native-paginated-list';
import { QueryClient, QueryClientProvider } from 'react-query';
import ProductCard from './components/ProductCard';

// Create a QueryClient instance
const queryClient = new QueryClient();
  
const ProductsScreen = () => (
  // Wrap your component tree with QueryClientProvider
  <QueryClientProvider client={queryClient}>
    <PaginatedList
      CardComponent={ProductCard}
      endpoint="https://api.example.com/products"
      itemsPerPage  
      collectionPath="products"
      refetchKey
      columns={2}
      emptyMessageEntity = 'items' 
      axiosInstance
      loaderColor="lightgrey"
    />
  </QueryClientProvider>
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

## Roadmap 

- Make the pagination params flexible 
- Add querying filter params 
- Pull to refresh functionality. 
- More customizable styling of empty message and error message.  
- More battle testing. 
- Probably Horizontal/Vertical scrolling prop? 
- Other ideas are welcome. 

