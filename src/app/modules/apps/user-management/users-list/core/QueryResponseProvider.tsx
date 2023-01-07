/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useContext, useEffect, useMemo, useState} from 'react';
import {useQuery} from 'react-query';
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from '@_metronic/helpers';
import {getCustomers} from './_requests';
import {useQueryRequest} from './QueryRequestProvider';
import {FullInfoUserDto} from "@/app/models/model";

const QueryResponseContext = createResponseContext<FullInfoUserDto>(initialQueryResponse);
const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest();
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery);
    }
  }, [updatedQuery]);

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.USERS_LIST}-${query}`,
    () => {
      return getCustomers().then((response) => {
        console.log('response', {response});
        return response;
      }).catch((error) => {
        console.log(error);
      });
    },
    {cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false}
  );
  return (
    <QueryResponseContext.Provider value={{isLoading: isFetching, refetch, response, query}}>
      {children}
    </QueryResponseContext.Provider>
  );
};

const useQueryResponse = () => useContext(QueryResponseContext);

const useQueryResponseData = () => {
  const {response} = useQueryResponse();
  console.log('response in useQueryResponseData', {response});
  if (!response) {
    return [];
  }

  return response?.data || [];
};

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const {response} = useQueryResponse();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useQueryResponseLoading = (): boolean => {
  const {isLoading} = useQueryResponse();
  return isLoading;
};

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
};
