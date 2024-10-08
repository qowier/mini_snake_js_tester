//main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

var mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
      contextIsolation: false,
		},
	});
	mainWindow.setMenuBarVisibility(false)
	mainWindow.loadFile('index.html');

	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
	if (mainWindow === null) createWindow();
});