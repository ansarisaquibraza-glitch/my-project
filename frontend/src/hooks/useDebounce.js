// frontend/src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Delays updating a value until the user stops typing.
 * Prevents excessive API calls on search inputs.
 */
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
