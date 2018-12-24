/* eslint-disable */
import { app, BrowserWindow,ipcMain,Menu } from 'electron'
import menuArray from './menu'

/* eslint-enable */
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

let mainWindow
let winURL = 'http://localhost:9080'

if (process.env.NODE_ENV === 'development') {
  try {
    // eslint-disable-next-line
    require('electron-debug')({
      showDevTools: true,
    })
  } catch (err) {
    console.log(
      'Failed to install `electron-debug`: Please set `NODE_ENV=production` before build to avoid installing debugging packages. ',
    )
  }
} else {
  winURL = `file://${__dirname}/index.html`

  /**
   * Set `__static` path to static files in production
   * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
   */
  // eslint-disable-next-line
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\') // eslint-disable-line
}

function installDevTools() {
  try {
    require('devtron').install() //eslint-disable-line
    require('vue-devtools').install() //eslint-disable-line
  } catch (err) {
    console.log(
      'Failed to install `devtron` & `vue-devtools`: Please set `NODE_ENV=production` before build to avoid installing debugging packages. ',
    )
  }
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 1200,
    height: 700,
    minWidth: 500,
    minHeight: 350,
    fullscreen: false,
    backgroundColor: '#fff',
    center:true,
    resizable:true,
    minimizable:true,
    maximizable:true,
    closable:true,
    focusable:true,
    alwaysOnTop:false,
    skipTaskbar:true,
    title:'OA系统',
    opacity:0.975,
    webPreferences: {
      nodeIntegrationInWorker: true,
      webSecurity: false,
    },
    show: false
  })

  // mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)

  // 设置软件菜单
  let menu = Menu.buildFromTemplate(menuArray)
  Menu.setApplicationMenu(menu)

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    let {dialog} = require('electron')
    dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
    mainWindow.webContents.send('message', '检查完毕，当前为最新版本');
    if (
      process.env.ELECTRON_ENV === 'development' ||
      process.argv.indexOf('--debug') !== -1
    ) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
  if (process.env.NODE_ENV === 'development') {
    installDevTools()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


import { autoUpdater } from 'electron-updater'

let uploadUrl = "http://localhost:8080/verson/"; //更新文件地址
autoUpdater.setFeedURL(uploadUrl); //设置更新文件地址


autoUpdater.on('update-downloaded', () => {
  // 开始更新
  menuArray[2].submenu[1].enable=true;
  autoUpdater.quitAndInstall()
});

autoUpdater.on('download-progress', function (progressObj) {
  // 更新下载进度
  mainWindow.webContents.send('downloadProgress', progressObj)
})

autoUpdater.on('error', function (error) {
  mainWindow.webContents.send('message', '检查更新出错')
});

autoUpdater.on('checking-for-update', function () {
  menuArray[2].submenu[1].enable=false;
  mainWindow.webContents.send('message', '正在检查客户端版本')
});

autoUpdater.on('update-available', function (info) {
  mainWindow.webContents.send('message', '检查到新版本，正在更新')
});

autoUpdater.on('update-not-available', function (info) {
  mainWindow.webContents.send('message', '检查完毕，当前为最新版本')
});

ipcMain.on("checkForUpdate",()=>{
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates() //执行自动检查更新
  }
})

// app.on('ready', () => {
//   console.log(ipcMain)
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates() //执行自动检查更新
// })

