import { useCallback } from "react";
import { NavigateOptions, To, useNavigate } from "react-router";

/**
 * "Синтаксический сахар" для навигации по страницам при помощи useNavigate
 * @param to Путь до страницы
 * @returns Функция навигации
 */
export const useNavigateTo = (to: To, options?: NavigateOptions) => {
    const navigate = useNavigate();
    return useCallback(() => navigate(to, options), [navigate, options, to]);
};

