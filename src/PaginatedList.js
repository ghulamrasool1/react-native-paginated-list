import React, { useCallback, useMemo } from 'react';
import { FlatList, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import defaultAxios from 'axios';     
import { useInfiniteQuery } from 'react-query';
    
const PaginatedList = ({
  CardComponent,
  endpoint,
  itemsPerPage = 30,
  collectionPath = 'data',  // Path to collection in response data
  refetchKey = 0,
  columns = 1,
  emptyMessageEntity = 'items',  //  customizable empty message entity e.g. No "items" found , No "products" found etc 
  axiosInstance = defaultAxios,  // Allow passing custom Axios instance
  loaderColor = 'lightgrey',  // Prop for setting ActivityIndicator color
}) => {
  const fetchItems = useCallback(async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(endpoint, {
      params: {
        'pagination[page]': pageParam,
        'pagination[pageSize]': itemsPerPage,
      },
    });

    return {
      data: response.data[collectionPath],  // Using collectionPath to get data
      nextPage: response.data.meta.pagination.page + 1,
      totalPages: response.data.meta.pagination.pageCount,
    };
  }, [endpoint, itemsPerPage, collectionPath, axiosInstance]);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery(
    ['items', endpoint, refetchKey],
    fetchItems,
    {
      getNextPageParam: (lastPage) =>
        lastPage.nextPage <= lastPage.totalPages ? lastPage.nextPage : undefined,
      enabled: !!endpoint, 
      select: useCallback((data) => ({
        ...data,
        pages: data.pages.flatMap((page) => page.data),
      }), []),      
    }
  );

  const itemList = data?.pages || []; 

  const renderItem = useCallback(({ item }) => (
    <CardComponent item={item} />
  ), [CardComponent]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return <ActivityIndicator style={styles.loader} size="large" color={loaderColor} />;
  }, [isFetchingNextPage, loaderColor]);

  const keyExtractor = useCallback((item) =>
    item.id?.toString() ?? Math.random().toString(),
    []
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <ActivityIndicator style={styles.loader} size="large" color={loaderColor} />;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  if (itemList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyMessage}>
          No {emptyMessageEntity} found.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={itemList}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      numColumns={columns}
      onEndReachedThreshold={0.7}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyMessage: {
    fontSize: 18,
    color: 'gray',
  },
});

export default PaginatedList;
