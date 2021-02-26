// requires

const deepmerge = require('deepmerge')

const path = require('path')

const fastifyStatic = require('fastify-static')

const { getDirectories } = require('./src/utils')

const chalk = require('chalk')

// consts

const sitesRoot = 'sites'
const staticRoot = 'static'

const requireOption = path => {
  try {
    return require(path)
  } catch (e) {
    return undefined
  }
}

// loading sites list and config

const sites = getDirectories(path.join(__dirname, sitesRoot))

// load global settings

const sharedSetting = requireOption('./settings') || {}
const byEnironmentSetting =
  process.env.NODE_ENV === 'production'
    ? requireOption('./settings.production') || {}
    : requireOption('./settings.development') || {}

const settings = deepmerge(sharedSetting, byEnironmentSetting)

const { defaultSite = 'www', lang = 'en', port = 5000 } = settings

// load lang

const i18n = requireOption(`./src/lang/${lang}`)

// load engine getter

const { buildEngine } = require('./src/engines')

// Get subsite list

const fastify = requireOption('fastify')({
  logger: true,
  rewriteUrl(req) {
    const subsite = req.headers.host.split('.')[0]
    if (!subsite) return '/' + defaultSite + req.url
    else return '/' + subsite + req.url
  },
})

// Prepare decoration
fastify.decorateRequest('_duosite', null)

// Register static file handlers

const siteSettings = {}

const siteEngines = {}

for (const site of sites) {
  const sharedSetting = requireOption(`./sites/${site}/settings`) || {}
  const byEnironmentSetting =
    process.env.NODE_ENV === 'production'
      ? requireOption(`./sites/${site}/settings.production`) || {}
      : requireOption(`./sites/${site}/settings.development`) || {}

  const siteSetting = deepmerge(sharedSetting, byEnironmentSetting)
  siteSettings[site] = siteSetting

  const { viewEngine } = siteSetting

  const engine = buildEngine(viewEngine, lang)
  siteEngines[site] = engine

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, sitesRoot, site, staticRoot),
    prefix: `/${site}/${staticRoot}`,
    decorateReply: false, // the reply decorator has been added by the first plugin registration
  })
}

// Decorate _duosite

fastify.addHook('preHandler', (request, reply, done) => {
  const subsite = request.headers.host.split('.')[0] || defaultSite

  const settings = siteSettings[subsite]
  const engine = siteEngines[subsite]

  request._duosite = { settings, engine }

  done()
})

// Declare a route
fastify.get('/hello', function (request, reply) {
  reply.send({ hello: 'world...' })
})

// Declare a route
fastify.get('/www/hello', function (request, reply) {
  console.log('======>>>', request._duosite, siteSettings)

  reply.send({ hello: 'world from www' })
})

// Declare a route
fastify.get('/r/hello', function (request, reply) {
  reply.send({ hello: 'world from /r/hello' })
})

// Run the server!
fastify.listen(port, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(chalk.green(i18n.startMessage(port)))
})