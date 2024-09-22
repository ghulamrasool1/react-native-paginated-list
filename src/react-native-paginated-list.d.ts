declare module 'react-native-paginated-list' {
    import { ComponentType } from 'react';
  
    interface PaginatedListProps {
      CardComponent: ComponentType<any>;
      endpoint: string;
      itemsPerPage?: number;
      collectionPath?: string;
      refetchKey?: number;
      columns?: number;
      emptyMessageEntity?: string;
      axiosInstance?: any;
      loaderColor?: string;
    } 
  
    const PaginatedList: ComponentType<PaginatedListProps>;
  
    export default PaginatedList;
  }
  