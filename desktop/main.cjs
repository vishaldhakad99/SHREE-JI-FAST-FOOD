const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 420,
    minHeight: 600,
    title: 'Shree Ji Fast Food',
    backgroundColor: '#FAF7F2',
    icon: path.join(__dirname, '../client/public/icon-512.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Remove standard default menu bar for clean modern restaurant app look
  win.setMenuBarVisibility(false);

  // In development, load local Vite dev server; in production, load built static file
  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:5173';

  win.loadURL(startUrl).catch(() => {
    // Fallback to built dist if server not active
    const indexPath = path.join(__dirname, '../client/dist/index.html');
    win.loadFile(indexPath).catch((err) => {
      console.log('Waiting for dev server to start...', err);
    });
  });

  // Open external links (like WhatsApp, Google Maps) in default system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://wa.me') || url.startsWith('http://wa.me') || url.includes('maps.google.com')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
