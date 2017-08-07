export function translate(key: string) {
    if ((window as any).translations) {
        let translations = (window as any).translations;
        if (translations[key]) {
            return translations[key];
        }
    }

    return key;
}