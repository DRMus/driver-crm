import { Context, useContext } from "react";

/**
 * Хук для обработки ошибки при неподключенном провайдере
 * @param contextFrom Экземпляр createContext
 * @param providerName Имя провайдера {default "ContextProvider"}
 * @returns
 */
export const useHandleContext = <T>(
    contextFrom: Context<T>,
    providerName: string = "ContextProvider"
) => {
    const context = useContext(contextFrom);

    if (!context) {
        throw new Error(`${providerName} не подключен!`);
    }

    return context;
};

