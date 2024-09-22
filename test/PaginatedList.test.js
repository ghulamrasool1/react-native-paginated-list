import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import PaginatedList from '../src/PaginatedList';
import { Text } from 'react-native'; 

jest.mock('axios', () => ({
  get: jest.fn(),
}));

const createTestQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,  // Disable retries for tests 
                cacheTime: 0, // Clear cache   
            },
        },
    });
};

const createWrapper = () => {
    const queryClient = createTestQueryClient();
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('PaginatedList', () => {
  const mockCardComponent = ({ item }) => 
    <Text>{item.name}</Text>;

  const mockEndpoint = 'https://api.myverycool.app/items';
   
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders items when data is fetched successfully', async () => {
    const mockData = {
      data: {
        data: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
        meta: { pagination: { page: 1, pageCount: 1 } },
      },
    };

    require('axios').get.mockResolvedValueOnce(mockData);

    const { getByText } = render(
      <PaginatedList
        CardComponent={mockCardComponent}
        endpoint={mockEndpoint}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(getByText('Item 1')).toBeTruthy();
      expect(getByText('Item 2')).toBeTruthy();
    });
  });
 
  test('renders empty message when no items are found', async () => {
    const mockEmptyData = {
      data: {
        data: [],
        meta: { pagination: { page: 1, pageCount: 0 } },
      },
    };
 
    require('axios').get.mockResolvedValueOnce(mockEmptyData);
  
    const { getByText } = render(
      <PaginatedList
        CardComponent={mockCardComponent}
        endpoint={mockEndpoint}
        emptyMessageEntity="products"
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(getByText('No products found.')).toBeTruthy();
    });
  }); 

  test('displays error message when API call fails', async () => {
    const mockError = new Error('Failed to fetch data');
    mockError.response = { status: 500 }; // Simulate server error
  
    // Mock Axios to throw an error
    require('axios').get.mockImplementationOnce(() => Promise.reject(mockError));
    const { getByText } = render(
        <PaginatedList
          CardComponent={mockCardComponent}
          endpoint={mockEndpoint}
          refetchKey={3} // Unique key
        />,
        { wrapper: createWrapper() }
      );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(getByText('Error: Failed to fetch data')).toBeTruthy();
    });
  });
 
});
