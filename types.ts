
export enum AppID {
  FINDER = 'finder',
  SAFARI = 'safari',
  TERMINAL = 'terminal',
  CALCULATOR = 'calculator',
  SETTINGS = 'settings',
  PHOTOS = 'photos',
  TIC_TAC_TOE = 'tictactoe',
  NOTES = 'notes',
}

export interface WindowState {
  id: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data?: any; // For passing URLs to Safari or other data
}

export interface IconProps {
  className?: string;
  size?: number;
  onClick?: () => void;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  wallpaper: string;
  setWallpaper: (url: string) => void;
}
