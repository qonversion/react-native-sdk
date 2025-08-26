import React from 'react';
import { Offerings, Product, RemoteConfigList, User } from '@qonversion/react-native-sdk';
import Entitlement from '../../../src/dto/Entitlement';

// Global Store (Redux-like pattern)
export interface AppState {
  products: Map<string, Product> | null;
  offerings: Offerings | null;
  entitlements: Map<string, Entitlement> | null;
  remoteConfigs: RemoteConfigList | null;
  userInfo: User | null;
  loading: boolean;
  navigationStack: string[];
  noCodesEvents: string[];
  qonversionInitStatus: 'not_initialized' | 'initializing' | 'success' | 'error';
  selectedProduct: Product | null;
  selectedEntitlement: Entitlement | null;
  isQonversionInitialized: boolean;
}

export type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Map<string, Product> }
  | { type: 'SET_OFFERINGS'; payload: Offerings }
  | { type: 'SET_ENTITLEMENTS'; payload: Map<string, Entitlement> }
  | { type: 'SET_REMOTE_CONFIGS'; payload: RemoteConfigList }
  | { type: 'SET_USER_INFO'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'PUSH_SCREEN'; payload: string }
  | { type: 'POP_SCREEN' }
  | { type: 'REPLACE_SCREEN'; payload: string }
  | { type: 'ADD_NOCODES_EVENT'; payload: string }
  | { type: 'SET_QONVERSION_INIT_STATUS'; payload: 'not_initialized' | 'initializing' | 'success' | 'error' }
  | { type: 'SET_SELECTED_PRODUCT'; payload: Product | null }
  | { type: 'SET_SELECTED_ENTITLEMENT'; payload: Entitlement | null }
  | { type: 'SET_QONVERSION_INITIALIZED'; payload: boolean };

export const initialState: AppState = {
  products: null,
  offerings: null,
  entitlements: null,
  remoteConfigs: null,
  userInfo: null,
  loading: false,
  navigationStack: ['main'],
  noCodesEvents: [],
  qonversionInitStatus: 'not_initialized',
  selectedProduct: null,
  selectedEntitlement: null,
  isQonversionInitialized: false,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_OFFERINGS':
      return { ...state, offerings: action.payload };
    case 'SET_ENTITLEMENTS':
      return { ...state, entitlements: action.payload };
    case 'SET_REMOTE_CONFIGS':
      return { ...state, remoteConfigs: action.payload };
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'PUSH_SCREEN':
      return { 
        ...state, 
        navigationStack: [...state.navigationStack, action.payload]
      };
    case 'POP_SCREEN':
      return { 
        ...state, 
        navigationStack: state.navigationStack.length > 1 
          ? state.navigationStack.slice(0, -1) 
          : state.navigationStack
      };
    case 'REPLACE_SCREEN':
      return { 
        ...state, 
        navigationStack: state.navigationStack.length > 0 
          ? [...state.navigationStack.slice(0, -1), action.payload]
          : [action.payload]
      };
    case 'ADD_NOCODES_EVENT':
      return { ...state, noCodesEvents: [...state.noCodesEvents, action.payload] };
    case 'SET_QONVERSION_INIT_STATUS':
      return { ...state, qonversionInitStatus: action.payload };
    case 'SET_SELECTED_PRODUCT':
      return { ...state, selectedProduct: action.payload };
    case 'SET_SELECTED_ENTITLEMENT':
      return { ...state, selectedEntitlement: action.payload };
    case 'SET_QONVERSION_INITIALIZED':
      return { ...state, isQonversionInitialized: action.payload };
    default:
      return state;
  }
}

// Helper function to get current screen from navigation stack
export const getCurrentScreen = (state: AppState): string => {
  return state.navigationStack[state.navigationStack.length - 1] || 'main';
};

// Global store context
export const AppContext = React.createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);
