import { RefObject, useEffect, useRef, useState } from "react";

/**
 * A type representing a function that returns void.
 */
type Void = () => void; 

/**
 * A type representing a URL to fetch data from, which can be a string or a URL object.
 */
type FetchUrl = string | URL;

/**
 * A type representing a query string.
 */
type QueryString = string;

/**
 * A type representing the parameters for the debounce hook.
 *
 * @template T - The type of the value to debounce.
 */
type DebounceType<T> = {
    value: T;
    delay: number;
};

/**
 * A type representing the parameters for the local storage hook.
 *
 * @template T - The type of the initial value.
 */
type LocalStorageType<T> = {
    key: string;
    initialValue: T;
}


/**
 * Custom hook that triggers a handler function when a click occurs outside the referenced element.
 *
 * @param {() => void} handler - The function to be called when a click outside the referenced element is detected.
 * @returns {React.RefObject<HTMLElement>} - A React ref object to be attached to the element to detect outside clicks.
 *
 * @example
 * const ref = useClickOutside(() => {
 *   console.log('Clicked outside');
 * });
 *
 * return <div ref={ref}>Click outside me</div>;
 */
export function useClickOutside(handler: Void): RefObject<HTMLElement | null> {
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



/**
 * Custom hook that debounces a value by a specified delay.
 *
 * @template T - The type of the value to debounce.
 * @param {DebounceType<T>} params - An object containing the value to debounce and the delay in milliseconds.
 * @param {T} params.value - The value to debounce.
 * @param {number} params.delay - The debounce delay in milliseconds.
 * @returns {T} - The debounced value.
 *
 * @example
 * const debouncedValue = useDebounce({ value: searchTerm, delay: 500 });
 */
export function useDebounce<T>({ value, delay }: DebounceType<T>): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay);

		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
}


/**
 * Custom hook to fetch data from a given URL.
 *
 * @template T - The type of the data to fetch.
 * @param {FetchUrl} url - The URL to fetch data from.
 * @returns {{ data: T | null, loading: boolean, error: Error | null }} - An object containing the fetched data, loading state, and error state.
 *
 * @example
 * const { data, loading, error } = useFetch<MyDataType>('https://api.example.com/data');
 */
export function useFetch<T>(url: FetchUrl): { data: T | null, loading: boolean, error: Error | null } {
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


/**
 * Custom hook to manage state synchronized with local storage.
 *
 * @template T - The type of the stored value.
 * @param {LocalStorageType<T>} params - An object containing the key and initial value for local storage.
 * @param {string} params.key - The key under which the value is stored in local storage.
 * @param {T} params.initialValue - The initial value to be stored.
 * @returns {[T, (value: T) => void]} - An array containing the stored value and a function to update it.
 *
 * @example
 * const [value, setValue] = useLocalStorage({ key: 'myKey', initialValue: 'defaultValue' });
 */
export function useLocalStorage<T>({ key, initialValue }: LocalStorageType<T>): [T, (value: T) => void] {
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


/**
 * Custom hook to determine if a media query matches the current viewport.
 *
 * @param {QueryString} query - The media query string to evaluate.
 * @returns {boolean} - A boolean indicating whether the media query matches.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 600px)');
 */
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


/**
 * Custom hook to get the previous value of a state or prop.
 *
 * @template T - The type of the value.
 * @param {T} value - The current value.
 * @returns {T | undefined} - The previous value.
 *
 * @example
 * const previousValue = usePrevious(currentValue);
 */
export function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T>(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}


/**
 * Custom hook to toggle a boolean state.
 *
 * @param {boolean} [initialState=false] - The initial state value.
 * @returns {[boolean, () => void]} - An array containing the current state and a function to toggle it.
 *
 * @example
 * const [isToggled, toggle] = useToggle(false);
 */
export function useToggle(initialState: boolean = false): [boolean, () => void] {
	const [state, setState] = useState<boolean>(initialState);

	const toggle = () => setState((prev) => !prev);

    return [state, toggle] as const;
}