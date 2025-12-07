import { create } from "zustand";

// Ключи модальных окон
const MODAL_NAMES = [
    "test"
] as const;

// Тип всех ключей
type ModalName = (typeof MODAL_NAMES)[number];

// Шаблон объекта для каждого ключа
interface ModalValues {
    open: boolean;
    data?: unknown;
}

// Кастомные данные для определенных ключей (обязательно объединять объекты с ModalValues)
interface ModalData extends Record<ModalName, unknown> {
    test: ModalValues & {data?: string}
}

type ModalState = Record<ModalName, ModalValues> & ModalData;

interface ModalWindowsStore extends ModalState {
    openModal: <T extends ModalName>(
        name: T,
        payload?: ModalState[T]["data"]
    ) => void;
    closeModal: (name: ModalName) => void;
}

const initialStore: ModalState = MODAL_NAMES.reduce((acc, key) => {
    acc[key] = { open: false };
    return acc;
}, {} as ModalState);

export const useModalStore = create<ModalWindowsStore>((set) => ({
    ...initialStore,
    openModal: (name, payload) =>
        set({ [name]: { open: true, data: payload } }),
    closeModal: (name) => set({ [name]: { open: false } }),
}));

