/** Usage: 
 *      - useClickOutside: Detects clicks outside of a specified element.
 *      - useDebounce: Debounces a value.
 *      - useFetch: Fetches data from a URL.
 *      - useLocalStorage: Stores and retrieves data from local storage.
 *      - useMediaQuery: Detects media query changes.
 *      - usePrevious: Returns the previous value of a state.
 *      - useToggle: Toggles a boolean state.
*/
import { useEffect, useRef, useState } from "react";

type Void = () => void; 

type FetchUrl = string | URL;

type QueryString = string;

type DebounceType<T> = {
	value: T;
	delay: number;
};

type LocalStorageType<T> = {
    key: string;
    initialValue: T;
}


export function useClickOutside(handler: Void) {
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, [handler]);

    return ref;
}

export function useDebounce<T>({ value, delay }: DebounceType<T>): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay);

		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
}

export function useFetch<T>(url: FetchUrl) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch(url);
				const result = await response.json();
				setData(result);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, loading, error };
}

export function useLocalStorage<T>({ key, initialValue }: LocalStorageType<T>) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try { 
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch(err) {
            console.error(err);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error(err);
        }
    };

    return [storedValue, setValue] as const;
};

export function useMediaQuery(query: QueryString) : boolean {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);

        const updateMatch = () => setMatches(mediaQueryList.matches);
        updateMatch();

        mediaQueryList.addEventListener('change', updateMatch);

        return () => mediaQueryList.removeEventListener('change', updateMatch);
    }, [query]);

    return matches;
};

export function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T>(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

export function useToggle(initialState: boolean = false) {
	const [state, setState] = useState<boolean>(initialState);

	const toggle = () => setState((prev) => !prev);

    return [state, toggle] as const;
}