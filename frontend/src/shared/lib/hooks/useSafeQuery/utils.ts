import { isAxiosError } from "axios";
import { ErrorMessages } from "./types";

interface HandleErrorOptions {
    defaultMessage?: string;
    devConcatMessage?: string;
    customNotification?: (value: string) => void;
}

/**
 * Обработчик ошибок, полученных после запроса к бэкенду
 * @param error Экземпляр ошибки
 * @param errorMessages Пары ключ-значения с сообщениями об ошибке, либо `string`, выводимый при любой Axios-ошибке
 */
export const handleError = (
    error: unknown,
    errorMessages: ErrorMessages | string,
    options: HandleErrorOptions = {}
) => {
    const {
        defaultMessage = "Неизвестная ошибка",
        customNotification = () => {}, // TODO: Добавить стандартный обработчик уведомления
    } = options;

    if (!isAxiosError(error) || !error.response?.status) {
        customNotification(defaultMessage);
        if (import.meta.env.PROD) {
            console.error(error);
        }
        return;
    }

    if (typeof errorMessages === "string") {
        customNotification(errorMessages);
        return;
    }

    customNotification(errorMessages[error.response.status] || defaultMessage);
};

