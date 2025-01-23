import errorTranslations from "./errorTranslations";

type ErrorTranslations = {
    [key: string]: string;
};

export function translateError(errorMessage: string) {
    const translations: ErrorTranslations = errorTranslations;
    return translations[errorMessage] || errorMessage;
}
