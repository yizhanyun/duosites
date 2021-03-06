import chalk from 'chalk'
import path from 'path'
import { pathToFileURL } from 'url'

/**
 * Boot a template's static props with params
 * @param {Object} options - param options
 * @param {string} file - template file, root is 'pages'
 * @param {Object} params - params
 * @param {string []} whichOnes - array of ['static', 'server', 'paths']
 * @param {Object} _yx - yx object
 * @param {Object} request - request object
 * @param {Object} reply - reply object -
 */

const bootTemplateProps = async options => {
  const { file, params, _yx, request, reply, whichOnes } = options

  const {
    site: { root: siteRoot, engine },
    global,
  } = _yx

  const i18nm = global.i18nMessages

  const bootJsPath = path.join(siteRoot, 'pages', file + '.boot.mjs')
  let bootJs
  try {
    bootJs = await import(pathToFileURL(bootJsPath))
  } catch (e) {
    // console.log(e)
  }
  // if (bootJs && bootJs.getServerProps && bootJs.getStaticProps)
  //   throw new Error('Cannot have both getServerProps and getStaticProps')

  const booted = {}

  for (const type of whichOnes || []) {
    if (Array.isArray(type)) {
      // load by priorities

      for (const _type of type) {
        if (_type === 'server' && bootJs && bootJs.getServerProps) {
          booted.serverProps = await bootJs.getServerProps({
            _yx,
            params,
            request,
            reply,
          })
          break
        }

        if (_type === 'static' && bootJs && bootJs.getStaticProps) {
          booted.staticProps = await bootJs.getStaticProps({
            _yx,
            params,
            request,
            reply,
          })
          break
        }
      }
    }
    if (type === 'static' && bootJs && bootJs.getStaticProps) {
      booted.staticProps = await bootJs.getStaticProps({
        _yx,
        params,
        request,
        reply,
      })
    }
    if (type === 'server' && bootJs && bootJs.serverProps) {
      booted.serverProps = await bootJs.getServerProps({
        _yx,
        params,
        request,
        reply,
      })
    }

    if (type === 'paths' && bootJs && bootJs.getStaticPaths) {
      const pathsGot = (await bootJs.getStaticPaths({ _yx })) || {}
      booted.staticPaths = pathsGot.paths
      booted.fallback = pathsGot.fallback
    }
  }

  return booted
}

/**
 * Boot boot template's static paths
 * @param {Object} options - param options
 * @param {string} file - template file
 * @param {Object} _yx - yx object
 * @param {Object} request - request object
 * @param {Object} reply - reply object -
 */

const bootTemplateStaticPaths = async options => {
  const { file, _yx, request, reply } = options

  let bootJs, staticPaths, fallback
  const {
    site: { root: siteRoot, engine },
    global,
  } = _yx

  const i18nm = global.i18nMessages

  try {
    bootJs = await import(
      pathToFileURL(path.join(siteRoot, 'pages', file + '.boot.mjs'))
    )
  } catch (e) {
    // console.log(e)
  }
  if (bootJs && bootJs.getStaticProps) {
    const pathsGot = (await bootJs.getStaticPaths({ _yx })) || {}
    staticPaths = pathsGot.paths
    fallback = pathsGot.fallback
  }

  return {
    staticPaths,
    fallback,
  }
}

/**
 * Server a template with already booted value
 * @param {Object} options - param options
 * @param {Object} params - routing parameters
 * @param {Object} _yx - yx object
 * @param {Object} booted - already booted
 * @param {Object} request - request object
 * @param {Object} reply - reply object -
 */

const serveTemplate = async options => {
  const { params, _yx, booted, request, reply, file: _file } = options
  const file = path.join('pages', _file)
  const {
    site: { root: siteRoot, engine },
    global,
  } = _yx

  const i18nm = global.i18nMessages

  reply.headers({ 'Content-Type': 'text/html' })

  if (engine.renderToStream) {
    const htmlStream = engine.renderToStream(file, {
      ...booted,
      params,
      _ctx: { request, reply, _yx },
    })

    reply.send(htmlStream)
  } else if (engine.renderToStringAsync) {
    const htmlString = await engine.renderToStringAsync(file, {
      ...booted,
      params,
      _ctx: { request, reply, _yx },
    })
    reply.send(htmlString)
  } else if (engine.renderToString) {
    const htmlString = engine.renderToStringAsync(file, {
      ...booted,
      params,
      _ctx: { request, reply, _yx },
    })
    reply.send(htmlString)
  } else {
    throw new Error('View engine fails')
  }
}

/**
 * Build a template to file with provided booted value
 * @param {Object} options - param options
 * @param {string} outputFileName - output file name
 * @param {string} file - inputfile name
 * @param {Object} _yx - yx object
 * @param {Object} booted - already booted
 */

const buildToFile = async options => {
  const { outputFileName, file, _yx, booted } = options

  const {
    site: { root: siteRoot, engine },
    global,
  } = _yx

  const i18nm = global.i18nMessages

  if (engine.renderToFileAsync) {
    try {
      const outputHtmlPath = path.join(
        siteRoot,
        '.production',
        'pages',
        outputFileName + '.html'
      )
      console.log(chalk.blue(i18nm.info), i18nm.buildStaticRender(file))
      await engine.renderToFileAsync(
        path.join('pages', file),
        {
          ...booted,
          _ctx: { _yx },
        },
        outputHtmlPath
      )
      console.log(chalk.blue(i18nm.info), i18nm.writeBuildFile(outputHtmlPath))
    } catch (e) {
      console.log(e)
    }
  } else if (engine.renderToFile) {
    try {
      const outputHtmlPath = path.join(
        siteRoot,
        '.production',

        'pages',
        outputFileName + '.html'
      )
      console.log(chalk.blue(i18nm.info), i18nm.buildStaticRender(file))

      engine.renderToFile(
        path.join('pages', file),
        {
          ...booted,
          _ctx: { _yx },
        },
        outputHtmlPath
      )
      console.log(chalk.blue(i18nm.info), i18nm.writeBuildFile(outputHtmlPath))
    } catch (e) {
      // console.log(e)
    }
  }
}

export {
  bootTemplateProps,
  bootTemplateStaticPaths,
  serveTemplate,
  buildToFile,
}
