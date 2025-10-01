import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage management
 * @param {string} key - LocalStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {Array} [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Set value in localStorage and state
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove value from localStorage and reset state
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

/**
 * Custom hook for sessionStorage management
 * @param {string} key - SessionStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {Array} [value, setValue, removeValue]
 */
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

/**
 * Custom hook for persistent state across browser sessions
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @param {boolean} useSession - Use sessionStorage instead of localStorage
 * @returns {Array} [value, setValue, removeValue]
 */
export const usePersistentState = (key, initialValue, useSession = false) => {
  return useSession 
    ? useSessionStorage(key, initialValue)
    : useLocalStorage(key, initialValue);
};

/**
 * Custom hook for managing form data persistence
 * @param {string} formKey - Unique form identifier
 * @param {object} initialData - Initial form data
 * @returns {Array} [formData, setFormData, clearFormData, saveFormData]
 */
export const usePersistentForm = (formKey, initialData = {}) => {
  const [formData, setFormData, clearFormData] = useLocalStorage(
    `form_${formKey}`,
    initialData
  );

  // Auto-save form data
  const saveFormData = (data) => {
    setFormData(data);
  };

  // Update specific field
  const updateField = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Reset form to initial state
  const resetForm = () => {
    clearFormData();
  };

  return [
    formData,
    saveFormData,
    clearFormData,
    updateField,
    resetForm
  ];
};

/**
 * Custom hook for managing search preferences
 * @returns {object} Search preferences management functions
 */
export const useSearchPreferences = () => {
  const [preferences, setPreferences, clearPreferences] = useLocalStorage(
    'searchPreferences',
    {
      recentSearches: [],
      favoriteRoutes: [],
      defaultFilters: {},
      sortPreference: 'departure_asc'
    }
  );

  // Add recent search
  const addRecentSearch = (searchData) => {
    setPreferences(prev => ({
      ...prev,
      recentSearches: [
        searchData,
        ...prev.recentSearches.filter(
          search => !(search.from === searchData.from && search.to === searchData.to)
        )
      ].slice(0, 10) // Keep only last 10 searches
    }));
  };

  // Add favorite route
  const addFavoriteRoute = (route) => {
    setPreferences(prev => ({
      ...prev,
      favoriteRoutes: [
        route,
        ...prev.favoriteRoutes.filter(
          fav => !(fav.from === route.from && fav.to === route.to)
        )
      ].slice(0, 5) // Keep only 5 favorites
    }));
  };

  // Remove favorite route
  const removeFavoriteRoute = (route) => {
    setPreferences(prev => ({
      ...prev,
      favoriteRoutes: prev.favoriteRoutes.filter(
        fav => !(fav.from === route.from && fav.to === route.to)
      )
    }));
  };

  // Update default filters
  const updateDefaultFilters = (filters) => {
    setPreferences(prev => ({
      ...prev,
      defaultFilters: { ...prev.defaultFilters, ...filters }
    }));
  };

  // Update sort preference
  const updateSortPreference = (sortBy) => {
    setPreferences(prev => ({
      ...prev,
      sortPreference: sortBy
    }));
  };

  return {
    preferences,
    addRecentSearch,
    addFavoriteRoute,
    removeFavoriteRoute,
    updateDefaultFilters,
    updateSortPreference,
    clearPreferences
  };
};

/**
 * Custom hook for theme preferences
 * @returns {Array} [theme, setTheme]
 */
export const useThemePreference = () => {
  const [theme, setTheme] = useLocalStorage('themePreference', 'light');
  
  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1e293b' : '#ffffff');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return [theme, setTheme, toggleTheme];
};

/**
 * Custom hook for language preferences
 * @returns {Array} [language, setLanguage]
 */
export const useLanguagePreference = () => {
  const [language, setLanguage] = useLocalStorage('languagePreference', 'en');
  
  useEffect(() => {
    // Update document lang attribute
    document.documentElement.lang = language;
  }, [language]);

  return [language, setLanguage];
};

/**
 * Custom hook for user preferences
 * @returns {object} User preferences management
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      shareData: false,
      marketing: false
    },
    display: {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    }
  });

  const updatePreferences = (category, updates) => {
    setPreferences(prev => ({
      ...prev,
      [category]: { ...prev[category], ...updates }
    }));
  };

  const resetPreferences = () => {
    setPreferences({
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        shareData: false,
        marketing: false
      },
      display: {
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      }
    });
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences
  };
};