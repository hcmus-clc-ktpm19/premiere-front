/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  QueryState,
  stringifyRequestQuery,
  WithChildren,
} from '@_metronic/helpers';
import { getEmployees } from './_requests';
import { useQueryRequest } from './QueryRequestProvider';
import { FullInfoUserDto } from '@/app/models/model';

const QueryResponseContext = createResponseContext<FullInfoUserDto>(initialQueryResponse);
const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();
  console.log('state in QueryResponseProvider', { state });
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery);
    }
  }, [updatedQuery]);

  const { isFetching, refetch, data } = useQuery(
    `${QUERIES.EMPLOYEES_LIST}-${query}`,
    () => {
      return getEmployees()
        .then((data) => {
          console.log('data', { data });
          return data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false }
  );
  const response = filterData(data || [], state);

  return (
    <QueryResponseContext.Provider value={{ isLoading: isFetching, refetch, response, query }}>
      {children}
    </QueryResponseContext.Provider>
  );
};

const useQueryResponse = () => useContext(QueryResponseContext);

const useQueryResponseData = () => {
  const { response } = useQueryResponse();

  if (!response) {
    return [];
  }

  return response || [];
};

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useQueryResponse();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const filterData = (data: FullInfoUserDto[], state: QueryState) => {
  if (state.search) {
    data = data.filter(
      (item) => item.email.toLowerCase().indexOf(state.search?.toLowerCase() || '') > -1
    );
  }

  if (state.sort && state.order) {
    const columnToSort = state.sort as keyof FullInfoUserDto;
    data = data.sort((a, b) => {
      if (state.order === 'asc') {
        // @ts-ignore
        return a[columnToSort] < b[columnToSort] ? -1 : 1;
      } else {
        // @ts-ignore
        return a[columnToSort] < b[columnToSort] ? 1 : -1;
      }
    });
  }

  if (state.filter) {
    // @ts-ignore
    data = data.filter(
      (item) =>
        item.enabled === state.filter.enabled &&
        (item.gender === state.filter.gender || state.filter.gender === 'ALL')
    );
  }

  return data;
};

const useQueryResponseLoading = (): boolean => {
  const { isLoading } = useQueryResponse();
  return isLoading;
};

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
};
