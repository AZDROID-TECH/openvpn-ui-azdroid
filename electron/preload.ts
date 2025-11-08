import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Credentials } from '../src/types/credentials';

/**
 * Renderer prosesinə təqdim ediləcək təhlükəsiz API.
 * Bu API, main proseslə əlaqə qurmaq üçün istifadə olunur.
 */
export const api = {
  // Main prosesdən gələn hadisələri dinləmək üçün
  on: (channel: string, callback: (data: any) => void) => {
    const subscription = (event: IpcRendererEvent, ...args: any[]) => callback(args[0]);
    ipcRenderer.on(channel, subscription);
    
    // Komponent unmount olduqda listener-i silmək üçün funksiya qaytarırıq
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  // Main prosesə sorğu göndərmək və cavab gözləmək üçün (invoke/handle)
  invoke: (channel: string, ...args: any[]): Promise<any> => {
    return ipcRenderer.invoke(channel, ...args);
  },

  // Main prosesə tək tərəfli mesaj göndərmək üçün (send)
  send: (channel: string, ...args: any[]): void => {
    ipcRenderer.send(channel, ...args);
  },
};

contextBridge.exposeInMainWorld('api', api);

// TypeScript-in renderer prosesində `window.api` obyektini tanıması üçün
// bir tip faylı (renderer.d.ts) yaratmaq lazımdır.
declare global {
  interface Window {
    api: typeof api;
  }
}