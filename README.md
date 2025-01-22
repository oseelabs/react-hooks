# A React Hooks Library

A library of custom react hooks to simplify React for easy developer exprerience.

## Installation

Using **npm**

```sh
    npm install @oseelabs/react-hooks
```

```sh
    npm i @oseelabs/react-hooks
```

Using **pnpm**

```sh
    pnpm add @oseelabs/react-hooks
```

Using **yarn**

```sh
    yarn add @oseelabs/react-hooks
```

## Usage

### 1. useFetch

Fetches data from a URL.

```ts
    const { data, loading, error } = useFetch<User[]>('/api/users');

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <ul>
            {data?.map(user => <li key={user.id}>{user.username}</li>)}
        </ul>
    )
```

### 2. useDebounce

Debounces a value.

```ts
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    useeffect(() => {
        if (debouncedSearch) {
            // Trigger API or other action
        }
    }, [debouncedSearch])
```

### 3. useToggle

Toggles a boolean state.

```ts
    const [isModalOpen, toggleModdle] = useToggle();

    return (
        <div>
            <button onClick={toggleModal}>
                Toggle Modal
            </button>
            { isModalOpen && <p>Modal Content</p>}
        </div>
    );
```

### 4. useLocalStorage

**(For Browsers only)**

Stores and retrieves data from local storage.

```ts
    const [theme, setTheme] = useLocalStorage('theme', 'light');

    return (
        <button onclick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Toggle Theme
        </button>
    );
```

### 5. usePrevious

Returns the previous value of a state.

```ts
    const [count, setCount] = useState(0);
    const prevCount = usePrevious(count);

    return (
        <p>
            Now: {count}, Before: {prevCount}
        </p>
    );
```

### 6. useClickOutside

**(Browser only)**

Detects clicks outside of a specified element.

```ts
    const ref = useClickOutside(() => setDropdownOpen(false));

    return (
        <div ref={ref}>
            {dropdownOpen && <p>Dropdown Content</p>}
        </div>
    );
```

### 7. useMediaQuery

Detects media query changes.

* (Browser only)

```ts
    const isMobile = useMediaQuery('(max-width: 768px)');

    return <p>{isMobile ? 'Mobile View' : 'Desktop View'}</p>;
```
