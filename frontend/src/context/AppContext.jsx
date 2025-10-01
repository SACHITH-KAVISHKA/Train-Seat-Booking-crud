import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Initial state
const initialState = {
  // UI state
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchModalOpen: false,
  
  // Theme and preferences
  theme: 'light',
  language: 'en',
  
  // Notifications
  notifications: [],
  
  // Loading states
  globalLoading: false,
  
  // Error states
  globalError: null,
  
  // App settings
  settings: {
    autoSave: true,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      analytics: true,
      cookies: true,
    },
  },
};

// Action types
const APP_ACTIONS = {
  // UI actions
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  TOGGLE_MOBILE_MENU: 'TOGGLE_MOBILE_MENU',
  TOGGLE_SEARCH_MODAL: 'TOGGLE_SEARCH_MODAL',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_MOBILE_MENU_OPEN: 'SET_MOBILE_MENU_OPEN',
  SET_SEARCH_MODAL_OPEN: 'SET_SEARCH_MODAL_OPEN',
  
  // Theme and preferences
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  
  // Notifications
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  
  // Loading and error
  SET_GLOBAL_LOADING: 'SET_GLOBAL_LOADING',
  SET_GLOBAL_ERROR: 'SET_GLOBAL_ERROR',
  CLEAR_GLOBAL_ERROR: 'CLEAR_GLOBAL_ERROR',
  
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_SETTINGS: 'RESET_SETTINGS',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    // UI actions
    case APP_ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
      
    case APP_ACTIONS.TOGGLE_MOBILE_MENU:
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
      
    case APP_ACTIONS.TOGGLE_SEARCH_MODAL:
      return { ...state, searchModalOpen: !state.searchModalOpen };
      
    case APP_ACTIONS.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };
      
    case APP_ACTIONS.SET_MOBILE_MENU_OPEN:
      return { ...state, mobileMenuOpen: action.payload };
      
    case APP_ACTIONS.SET_SEARCH_MODAL_OPEN:
      return { ...state, searchModalOpen: action.payload };
      
    // Theme and preferences
    case APP_ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
      
    case APP_ACTIONS.SET_LANGUAGE:
      return { ...state, language: action.payload };
      
    // Notifications
    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
      
    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };
      
    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };
      
    // Loading and error
    case APP_ACTIONS.SET_GLOBAL_LOADING:
      return { ...state, globalLoading: action.payload };
      
    case APP_ACTIONS.SET_GLOBAL_ERROR:
      return { ...state, globalError: action.payload };
      
    case APP_ACTIONS.CLEAR_GLOBAL_ERROR:
      return { ...state, globalError: null };
      
    // Settings
    case APP_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
      
    case APP_ACTIONS.RESET_SETTINGS:
      return { ...state, settings: initialState.settings };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// AppProvider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Persistent storage for theme and settings
  const [persistentTheme, setPersistentTheme] = useLocalStorage('theme', 'light');
  const [persistentSettings, setPersistentSettings] = useLocalStorage('appSettings', initialState.settings);

  // UI actions
  const toggleSidebar = () => {
    dispatch({ type: APP_ACTIONS.TOGGLE_SIDEBAR });
  };

  const toggleMobileMenu = () => {
    dispatch({ type: APP_ACTIONS.TOGGLE_MOBILE_MENU });
  };

  const toggleSearchModal = () => {
    dispatch({ type: APP_ACTIONS.TOGGLE_SEARCH_MODAL });
  };

  const setSidebarOpen = (open) => {
    dispatch({ type: APP_ACTIONS.SET_SIDEBAR_OPEN, payload: open });
  };

  const setMobileMenuOpen = (open) => {
    dispatch({ type: APP_ACTIONS.SET_MOBILE_MENU_OPEN, payload: open });
  };

  const setSearchModalOpen = (open) => {
    dispatch({ type: APP_ACTIONS.SET_SEARCH_MODAL_OPEN, payload: open });
  };

  // Theme actions
  const setTheme = (theme) => {
    dispatch({ type: APP_ACTIONS.SET_THEME, payload: theme });
    setPersistentTheme(theme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Language actions
  const setLanguage = (language) => {
    dispatch({ type: APP_ACTIONS.SET_LANGUAGE, payload: language });
    // Update document language
    document.documentElement.lang = language;
  };

  // Notification actions
  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const notificationWithId = {
      id,
      type: 'info',
      autoClose: true,
      duration: 4000,
      ...notification,
    };
    
    dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: notificationWithId });
    
    // Auto remove notification
    if (notificationWithId.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, notificationWithId.duration);
    }
    
    return id;
  };

  const removeNotification = (id) => {
    dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATIONS });
  };

  // Notification helpers
  const showSuccess = (message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      autoClose: false,
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options,
    });
  };

  // Loading and error actions
  const setGlobalLoading = (loading) => {
    dispatch({ type: APP_ACTIONS.SET_GLOBAL_LOADING, payload: loading });
  };

  const setGlobalError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_GLOBAL_ERROR, payload: error });
  };

  const clearGlobalError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_GLOBAL_ERROR });
  };

  // Settings actions
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...state.settings, ...newSettings };
    dispatch({ type: APP_ACTIONS.UPDATE_SETTINGS, payload: newSettings });
    setPersistentSettings(updatedSettings);
  };

  const resetSettings = () => {
    dispatch({ type: APP_ACTIONS.RESET_SETTINGS });
    setPersistentSettings(initialState.settings);
  };

  // Initialize theme from localStorage
  React.useEffect(() => {
    if (persistentTheme !== state.theme) {
      setTheme(persistentTheme);
    }
  }, [persistentTheme, state.theme]);

  // Initialize settings from localStorage
  React.useEffect(() => {
    if (JSON.stringify(persistentSettings) !== JSON.stringify(state.settings)) {
      dispatch({ type: APP_ACTIONS.UPDATE_SETTINGS, payload: persistentSettings });
    }
  }, [persistentSettings, state.settings]);

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // UI actions
    toggleSidebar,
    toggleMobileMenu,
    toggleSearchModal,
    setSidebarOpen,
    setMobileMenuOpen,
    setSearchModalOpen,
    
    // Theme actions
    setTheme,
    toggleTheme,
    
    // Language actions
    setLanguage,
    
    // Notification actions
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Loading and error actions
    setGlobalLoading,
    setGlobalError,
    clearGlobalError,
    
    // Settings actions
    updateSettings,
    resetSettings,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

export { AppContext };