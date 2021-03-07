export default {
  buildHtml: file => `Build html ${file}`,
  buildStaticTemplate: file => `Build static template ${file}`,
  cleanPreviousBuild: 'Clean previous build',
  copyFolder: folder => `Copy ${folder}`,
  copySettings: 'Copy settings',
  createNewSiteDone: site => `Create new site ${site} done`,
  duositeNewSiteExists: '\n!!Error: New site already exists',
  duositeNewUsage:
    '\n!Error: Wrong arguments. \nUsage: \n  duosite new <template-name> <new-site-name>',
  duositeSubdomainError: '\n!!Error: Not a legal subdomain name',
  duositeTemplateNotFound: '\n!!Error: Template not found',
  duositeUsage:
    '\n!Error:Wrong argument. \nUsage:\n  duosite ls - show templates\n  duosite dev - run devevelopment\n  duosite prod = run production\n  duosite new - create new site from template',
  duositeWrongTemplateName: '\n!!Error: Wrong template name',
  engineNotSupported: 'Unsupported view engine',
  finishedBuilding: 'Finished building. Shutting down...',
  nodemonQuit: 'Nodemon: duosite quit',
  nodemonRestart: 'Nodemon: duosite restarted duo to:',
  nodemonStarted: 'Nodemon: duosite started',
  productionNotReady: '!Warning: Production build is not released yet',
  runningGlobalEnhancer: 'Running global enhancer',
  runningSiteEnhancer: site => `Running ${site} subsite enhancer`,
  serverDownFor: 'Server is shutting down for：',
  serverReady: 'Server ready',
  serverShuttingDown: 'Server is shutting down',
  siteNotFound: 'Site not found',
  siteNotProvided: 'Site not provided',
  startBuildingSite: site => `Start building site ${site}`,
  startMessage: port => `Server started at port ${port}`,
  useCustomNodemonJson: 'Use custom nodemon configuration',
  useDefaultNodemonJson: 'Use defaultnodemon configuration',
  writeBuildFile: file => `Write build output ${file}`,
}