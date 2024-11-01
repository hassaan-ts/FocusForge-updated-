const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  saveData: (data) => ipcRenderer.send('save-data', data),
  loadData: () => ipcRenderer.invoke('load-data')
});