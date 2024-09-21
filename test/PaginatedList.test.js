import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import PaginatedList from '../src/PaginatedList';  // Adjust this path to your PaginatedList location

// Simple mock card component for testing
const ProductCard = ({ item }) => (
  <Text>{item.name}</Text>
);

const mock = new MockAdapter(axios);

describe('PaginatedList Component', () => {

  // Test for rendering the component
  it('renders correctly with provided props', () => {
    const { getByTestId } = render(
      <PaginatedList
        CardComponent={ProductCard}
        endpoint="https://api.example.com/products"
        collectionPath="products"
        itemsPerPage={30}
        columns={2}
      />
    );

    expect(getByTestId('paginated-list')).toBeTruthy();
  });

  // Test for fetching data from the API
  it('fetches data and renders items correctly', async () => {
    mock.onGet('https://api.example.com/products').reply(200, {
      data: [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }],
      meta: {
        pagination: {
          page: 1,
          pageCount: 1
        }
      }
    });

    const { getByText } = render(
      <PaginatedList
        CardComponent={ProductCard}
        endpoint="https://api.example.com/products"
        collectionPath="data"
        itemsPerPage={30}
        columns={2}
      />
    );

    await waitFor(() => {
      expect(getByText('Product 1')).toBeTruthy();
      expect(getByText('Product 2')).toBeTruthy();
    });
  });

  // Test for handling empty data
  it('displays empty message when no data is found', async () => {
    mock.onGet('https://api.example.com/products').reply(200, {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageCount: 1
        }
      }
    });

    const { getByText } = render(
      <PaginatedList
        CardComponent={ProductCard}
        endpoint="https://api.example.com/products"
        collectionPath="data"
        emptyMessageEntity="Products"
      />
    );

    await waitFor(() => {
      expect(getByText('No Products found')).toBeTruthy();
    });
  });

  // Test for handling API errors
  it('displays error message on API failure', async () => {
    mock.onGet('https://api.example.com/products').reply(500);

    const { getByText } = render(
      <PaginatedList
        CardComponent={ProductCard}
        endpoint="https://api.example.com/products"
        collectionPath="data"
      />
    );

    await waitFor(() => {
      expect(getByText(/Error/)).toBeTruthy(); // Adjust this based on the actual error message
    });
  });
});
