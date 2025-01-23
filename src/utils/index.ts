export const getFirstLetter = (str: string | undefined) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase();
};
