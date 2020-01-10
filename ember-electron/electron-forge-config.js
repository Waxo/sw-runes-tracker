module.exports = {
  make_targets: {
    win32: ['squirrel'],
    darwin: ['zip'],
    linux: ['deb', 'rpm']
  },
  electronPackagerConfig: {
    packageManager: 'yarn'
  },
  electronWinstallerConfig: {
    name: 'sw_runes_tracker',
    authors: 'Waxo'
  },
  electronInstallerDebian: {},
  electronInstallerRedhat: {},
  github_repository: {
    owner: '',
    name: ''
  },
  windowsStoreConfig: {
    packageName: '',
    name: 'swrunestracker'
  }
};
