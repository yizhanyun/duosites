import fs from 'fs-extra'

import path from 'path'

import chalk from 'chalk'

const buildGeneratedFileName = (table, params) => {
  const segments = table.map(([segName, type]) => {
    if (type === 'static') {
      return segName
    }
    if (type === 'catch') {
      return params[segName]
    }
    if (type === 'catchAll' || type === 'optionalCatchAll') {
      return params[segName] || params['*']
    }
    throw new Error(`Catch variable ${segName}not provided`)
  })

  return path.join(...segments)
}

const buildCatchTemplate = async (routeTable, root, site, _duosite) => {
  const [, table, file] = routeTable

  const {
    site: { root: siteRoot, engine },
    global,
  } = _duosite

  const i18nm = global.i18nMessages

  let booted
  let bootJs
  try {
    bootJs = await import(path.join(siteRoot, 'pages', file + '.boot.mjs'))
  } catch (e) {
    // console.log(e)
  }

  let paths, fallback

  if (bootJs && !bootJs.getServerProps && bootJs.getStaticPaths) {
    const pathsGot = (await bootJs.getStaticPaths({ _duosite })) || {}
    paths = pathsGot.paths
    fallback = pathsGot.fallback
  }

  if (paths && bootJs.getStaticProps) {
    for (const staticPath of paths) {
      const { params } = staticPath
      const outputFileName = buildGeneratedFileName(table, params)
      booted = await bootJs.getStaticProps({ _duosite, params })

      const output = await engine.renderFile(path.join('pages', file), {
        ...booted,
        params,
        _ctx: { _duosite },
      })

      try {
        const outputHtmlPath = path.join(
          siteRoot,
          '.production',
          'pages',
          outputFileName + '.html'
        )
        await fs.outputFile(outputHtmlPath, output)
        console.log(chalk.green(i18nm.writeBuildFile(outputHtmlPath)))
      } catch (e) {
        console.log(e)
      }
    }
  }
  if (!bootJs || bootJs.getServerProps || fallback) {
    const filesForCopy = [file, file + '.boot.mjs']

    filesForCopy.forEach(file => {
      const target = path.join(siteRoot, '.production', 'pages', file)
      try {
        fs.copySync(path.join(siteRoot, 'pages', file), target)
      } catch (e) {
        // console.log(e)
      }
    })
  }
}

export default buildCatchTemplate