import { useEffect, useRef } from "react";

/**
 * Кастомный хук, аналогичный useEffect, но не срабатывающий при первом рендере
 * @param effect Эффект-функция
 * @param deps Массив зависимостей
 */
export const useUpdateEffect = (
    effect: React.EffectCallback,
    deps: React.DependencyList
) => {
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        return effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

