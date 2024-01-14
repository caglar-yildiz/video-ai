import 'server-only';

const dictionaries = {
    en: async () => (await import('../../dictionaries/en.json')).default,
    tr: async () => (await import('../../dictionaries/tr.json')).default,
};
export const getDictionary = async (locale: "en" | "tr") => {
    try {
        return await dictionaries[locale]();
    } catch (error) {
        console.error(error);
        // Handle the error here, such as returning a default dictionary or showing an error message
    }
};
