export const isBlank = (value) => !String(value ?? "").trim();

export const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());

export const isValidVietnamPhone = (value) =>
    /^0(3|5|7|8|9)\d{8}$/.test(String(value ?? "").trim());

export const isValidCitizenId = (value) =>
    /^(\d{9}|\d{12})$/.test(String(value ?? "").trim());

export const isFutureDate = (value) => {
    if (!value) return false;
    const inputDate = new Date(value);
    const today = new Date();
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return inputDate > today;
};

export const isPositiveNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number > 0;
};

export const isNonNegativeNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0;
};

export const isPositiveInteger = (value) => {
    const number = Number(value);
    return Number.isInteger(number) && number > 0;
};

export const isNonNegativeInteger = (value) => {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0;
};

export const isValidImageFile = (file) => {
    if (!file) return true;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    return allowedTypes.includes(file.type) && file.size <= maxSize;
};

export const isValidUrlOrPath = (value) => {
    const text = String(value ?? "").trim();
    if (!text) return true;
    if (text.startsWith("/")) return true;

    try {
        const url = new URL(text);
        return ["http:", "https:"].includes(url.protocol);
    } catch (error) {
        return false;
    }
};
