import { Updater, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Хук для работы с "оптимистичными обновлениями" в useMutation
 * @param queryKey - Ключ, для работы с состоянием запроса useQuery
 * @returns Функции для внедрения в useMutation (onMutate, onError, onSettled)
 */
export const useOptimisticUpdate = <T>(queryKey: unknown[]) => {
    const queryClient = useQueryClient();

    const onMutate = useCallback(
        async (
            newValue: Updater<NoInfer<T> | undefined, NoInfer<T> | undefined>
        ) => {
            await queryClient.cancelQueries({
                queryKey,
            });

            // Сохраняем предыдущее значение на случай отката
            const previousValue = queryClient.getQueryData<T>(queryKey);

            // Оптимистично обновляем кэш
            queryClient.setQueryData<T>(queryKey, newValue);

            // Возвращаем контекст с предыдущим значением для отката
            return previousValue;
        },
        [queryClient, queryKey]
    );

    const onError = useCallback(
        (previousValue: T | undefined) => {
            queryClient.setQueryData(queryKey, previousValue);
        },
        [queryClient, queryKey]
    );

    const onSettled = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey,
        });
    }, [queryClient, queryKey]);

    return { onMutate, onError, onSettled };
};

