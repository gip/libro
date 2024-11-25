export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function sortJsonKeys(input: JsonValue): JsonValue {
    // Handle arrays recursively
    if (Array.isArray(input)) {
        return input.map(item => sortJsonKeys(item));
    }
    // Handle objects recursively
    if (input !== null && typeof input === 'object') {
        const sortedObject: { [key: string]: JsonValue } = {};
        const sortedKeys = Object.keys(input).sort();
        
        for (const key of sortedKeys) {
            sortedObject[key] = sortJsonKeys(input[key]);
        }   
        return sortedObject;
    }
    // Return primitive values as is
    return input;
}

export function sortAndStringifyJson(input: JsonValue): string {
    const sortedData = sortJsonKeys(input);
    return JSON.stringify(sortedData);
}

export const isJsonEqual = (a: JsonValue, b: JsonValue): boolean => {
    return sortAndStringifyJson(a) === sortAndStringifyJson(b);
}