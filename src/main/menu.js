import { autoUpdater } from 'electron-updater'

export default [
  {
    label: '编辑',
    submenu: [
      {role: 'undo',label:'清空'},
      {role: 'redo',label:'撤销'},
      {type: 'separator'},
      {role: 'cut',label:'剪切'},
      {role: 'copy',label:'复制'},
      {role: 'paste',label:'无格式粘贴'},
      {role: 'pasteandmatchstyle',label:'粘贴'},
      {role: 'delete',label:'删除'},
      {role: 'selectall',label:'全选'},
      {type: 'separator'},
      {role: 'quit',label:'退出应用'}
    ]
  },
  {
    label: '视图',
    submenu: [
      {role: 'reload',label:'刷新'},
      {role: 'forcereload',label:'深度刷新'},
      {type: 'separator'},
      {role: 'resetzoom',label:'缩放至默认大小'},
      {role: 'zoomin',label:'放大'},
      {role: 'zoomout',label:'缩小'},
      {type: 'separator'},
      {role: 'togglefullscreen',label:'全屏切换'},
      {role: 'minimize',label:'最小化'},
      {role: 'close',label:'关闭当前窗口'}
    ]
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '关于我们',
        click () { require('electron').shell.openExternal('https://weadmin.maiyawx.cn/#/') }
      },
      {
        label: '检查更新',
        enable:true,
        click(){
          autoUpdater.checkForUpdates()
        }
      }
    ]
  }
]
