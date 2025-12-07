import {
    QueryClient,
    useQuery,
    UseQueryOptions,
    UseQueryResult,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { ErrorMessages } from "./types";
import { handleError } from "./utils";

type THandlerOptions = Parameters<typeof handleError>[2];

interface AdditionalUseQueryOptions {
    queryClient?: QueryClient;
    errorHandler?: {
        errors: ErrorMessages;
        options?: THandlerOptions;
    };
    debug?: boolean;
}

/** Обертка для useQuery с возможностью обработки ошибок */
export function useSafeQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
>(
    options: UseQueryOptions<TQueryFnData, TError, TData>,
    additionalOptions: AdditionalUseQueryOptions = {}
): UseQueryResult<TData, TError> {
    const { errorHandler, queryClient } = additionalOptions;
    const query = useQuery(options, queryClient);
    const { isError, error } = query;

    useEffect(() => {
        if (!isError || !errorHandler) return;

        handleError(error, errorHandler.errors, errorHandler.options);

        // Потому что требуется отлавливать ошибки только единожды
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, error]);

    return query;
}

