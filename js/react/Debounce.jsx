import React, { useState, useEffect, useRef } from 'react';

export default function DebouncedSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const latestRequest = useRef(null);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const controller = new AbortController();
        latestRequest.current = controller;

        const timeoutRequest = setTimeout(async () => {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`, {
                    signal: controller.signal,
                });
                const data = await response.json();
                setResults(data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Fetch error:', error);
                }
            }
        }, 1000);

        return () => {
            clearTimeout(timeoutRequest);
            controller.abort();
        };
    }, [query]);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    return (
        <div>
            <h1>Debounced Search</h1>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
            />
            <div>
                {results.map((item, index) => (
                    <div key={crypto.randomUUID()}>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}