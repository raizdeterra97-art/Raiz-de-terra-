// preload.js
// This script runs in the context of the renderer process,
// enabling secure communication between the main process and the renderer process.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    sendMessage: (channel, data) => {
        // whitelist channels
        let validChannels = ['toMain'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receiveMessage: (channel, func) => {
        let validChannels = ['fromMain'];
        if (validChannels.includes(channel)) {
            // Strip off the 'fromMain' prefix
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});
