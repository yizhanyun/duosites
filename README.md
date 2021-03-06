
![logo](./logo/yx-logo.png)

[中文](#中文)

**0.2.4 Update**

Duosite has been renamed to `yx`, for only one reason, shorter to run as a cli.

Now `yx` could be interpreted as `You Xia` server, `You Xia, 游侠` means ranger or sword man in Chinese.

**0.2.0 Update**

Now yx reached a milestone of 0.2.0. Livereload has been added supporting live reload of html, ejs, alpine, tailwind and EAT stack (Ejs, Alpine, Tailwind) templates.

When you run `yarn yx new template-blank site-1`, launch server with `yarn yx dev`, and edit your index.html under `site-1/pages`, your browser will live reload your page and your edit will be effective immediately.


# 游侠 yx

`yx` is a web server that aims to host and run many sub sites, each with its own sub setting, folder structure and template / view engine, file system based routing, static site generation but also supports advanced nodejs server side programming.

yx is built on top of the excellent [fastify](https://github.com/fastify/fastify) webserver. yx borrowed many ideas from [Nextjs](https://github.com/vercel/next.js). I'd like to thank both teams for their greate work and contribution to open source software.

yx embraces **ECMAScript modules** thus requires Node **15** and uses `mjs` for JS source code.

yx is functioning now but still under heavy development. You are welcome to try it and submit any suggestions or issues.

## Core yx features

### Pages of both static HTML and view templates

Like Next.js, yx renders and serves pages from `<site>/pages` folder. Unlike Next.js, yx supports static HTML files and also renders template engine files, for example [liquidjs](https://github.com/harttle/liquidjs) and [ejs](https://github.com/mde/ejs).

### Filebased routing

yx supports Nextjs style file based routing, in the format of `/<segments>/[route1]/[route2]/[[...captureAll]].[template-ext]`.

It also supports three dat feteching methods for template renderring, and static html generation, `getStaticProps`, `getServerProps` and `getStaticPaths`.

### Companion boot.mjs to unify data loading

yx has one unique design, a companion `boot.mjs` for loading data for template renderring.

One common task is to load initial data for template renderring. To support file based routing, when renderring template under pages, yx would look up a companion js file, `<template-file-name>.boot.mjs`, which should export one or all of three async functions: `getStaticProps`, `getServerProps`, `getStaticPaths`

### Server enhancement

Drawing on `fastify`'s plugin based design, yx allows deep customization and enhancement of built-in server. It allows developers to provide global service builder and site service builder to added shared services, allow global enhancer and site enhancer to enrich web server and add any routing rules and handlers to build-in server.

### Subsites and indepent engines

yx supports subsites and allow each subsite to have its own template engines and renderrers. You can hve one site of `ejs` engine and another of `liquidjs` engine for experiments, benchmarking, testing and production.

### Compile to generate full static site or mixed static and dynamic site

Like Nextjs, yx expose a `yarn yx build <site-name>` command, which will scan page folder to decide if a template file should and could be renderred to static html file or files, or should be dynamicly renddered and served.

## Usage

yx embraces ECMAScript modules thus requires node15 and uses `mjs` for JS source code.

### Install

Yarn:

`yarn add yx`

Npm:

`npm install yx`

This project uses yarn. So documentation below uses yarn too.


### List templates

`yarn yx ls`

### Create new site from template

`yarn yx new <template-name> <new-site-name>`

The new site name is subdomain name so it must comply with subdomain rules

### Run development server

`yarn yx dev`

### Visit a subsite:

Open your browser and visit `<sub-site-name>.localhost:5000`.

yx uses 5000 as default port. You can change it by modifying `settings.mjs`

### Custom settings


#### Global / cross site settings

You can create custom global settings by creating two files at root your project:

1. settings.mjs

```
// shared settings
export default {
  defaultSite: 'www', // default site name
  lang: 'en', // locale
  port: 5000, // server port number
}
```

2. settings.development.mjs

```
//  settings for development environment
export default {
// any settings
}
```

Eventual setting is a deep merge of `settings.mjs` and `settings.development.mjs, the latter overwrites the former.

Currently yx only uses `defaultSite`, `lang` and `port`.

In future it may support more settings


#### Subsite site settings

You can create subsite settings by creating two files at root the subsite:

1. settings.mjs

```
// shared settings
export default {
  viewEngine: {
    name: 'liquid', // template name
    ext: '.liquid', // template extension
    options: {
      // options to be passed to view engine
    },
  },
}
```

2. settings.development.mjs

```
//  settings for development environment
export default {
// any settings
}
```

Currently yx only uses `viewEngine`.

Eventual setting is a deep merge of `settings.mjs` and `settings.development.mjs`, the latter overwrites the former.

In future it may support more settings



## Current goal and most important concepts

The current goal is to provide a convinient environment for expirementing, studing and demoing web technology that allow co-exist of multiple subsites.

When it matures, yx may target production depoyment. But that is NOT the goal yet.

### Subsite

Each subsite is indepent.

yx doens't make much many assumptions about subsites, only three simple folder structure rules and one special reserved extensions:

- <site-root>/pages : where to put html / template files etc.
- <site-root>/public/static: where to put assets that don't require processing.
- <site-root>/public/bundle: where to put assets generated by bundle tools or compilers.
- <site-root>/pages/**/<filename>.boot.mjs: this file extension is specially reserved for booting data for templates. yx will NOT server files from pages folder with this exention. But it will serve this file from `static` and `bundle` folder


But if you choose so you can put any static contents in side `pages` folders as well.

And if you are a `fastify` developer who wants to further enhance your subsite, you can add routers and handlers to subsite. More documentation is coming for this.

### Structured booting

To power multiple sites, support customization and enhancement at global level and subsite level, yx took a very structure booting process to prepare the server:

```
-- start server
|- load global settings
  |- lang
  |- port
  |- default site
  |- fastify options
|- load global i18n resources
|- load subsite list
|-> |- build globalServices
    |- build global enhancer
    |- build fastify server
    |- run global enhancer
    |-> for each subsite
      |- load subsite settings
      |- build subsiteServices
      |- build subsiteEnhancer
      |- build subsiteEngine
      |- decorate `request._yx` object with
        |- global
          |- settings
          |- services
          |- i18n
          |- root
          |- lang
        |- site
          |- settings
          |- services
          |- i18n
          |- root
          |- engine
      |- add static file router
      |- add default router
      |- run subsite enhancer
```
### Template Projects

yx will gradually add template project set up for typical frameworks or libraries,  to save you time.

Now following templates are included.

`template-alpine` - bare alpine template project

`template-eat` - template of Ejs, Alpinejs, Tailwind stack

**Note** This is by far the most concise and also power stack in my oppion that is close to raw HTML with power of templating with ejs and css with Tailwind. I will write a blog about it later.

`template-blank` - bare html template project

`template-ejs` - template of Ejs

`template-ejs-alpine` - template of Ejs and alpine.

`template-html` -  html template project based on [HTML boilerplat](https://github.com/h5bp/html5-boilerplate)

`template-tailwind` - template for tailwind

`template-alpine` - template for alpine js

`template-marko` - template for marko js

`template-marko-tailwind` - template for marko js and tailwind

`template-liquid` - template for liquidjs template engine

`template-nextjs` - template of nextjs.

**Note** Because of nextjs' desgin and complexity, it is NOT possible to run nextjs as an engine so in order to support unified nextjs development experience, yx will run as proxy to nextjs server, when a request such as `http://next-js-site.localhost:5000/post` arrives, the quest is proxied to the next server running at subsite `next-js-site`. If you want to run multiple nextjs subsites, they should be configred with different port and the port should be configred in the settings of the subsite.

You can run `yarn yx ls` to show list of templates.

You can also run `yarn yx new <template-name> <target-site-name>` to create a site with a template.

You are welcome to submit pull request to add more templates.

### View Engine / Template Engine

One goal of yx is to allow users to experiment view engines easily.

Currently it only provides rudimental support for liquid engine developed of [harttle/liquidjs](https://github.com/harttle/liquidjs).

More is coming.

### Unified booting view / template

When yx renders a template file, let's say `index.liquid`, it will look at the same folder a file named `index.liquid.boot.mjs`, which should export an asycn function getServerProps with following signature:

```
const getServerProps = async (ctx) => data
```

`ctx` has following properties that are to be expanded down the road:

```
{
  request: // fastify request object
  reply: // fastify reply object
}
```

yx will pass down `{...data, _ctx: ctx}` to the template engine


You can try with below:

`yarn yx new template-liquid liquid-1`

`yarn yx dev`

Visit `liquid-1.localhost:5000`

It will show following page:

```
Hello from boot.mjs

Below is from template

Alice
Bob
Carol

```

The first line is from data from `index.liquid.boot.mjs`:

```
const getServerProps = async ctx => {
  return {
    text: 'Hello from index.liquid.boot.mjs ',
  }
}

export default {
  getServerProps,
}

```


### yx enhancers

yx should allow developers to enhance fasity server:

- global enhancer: enhance the global fastify server
- site enhancer: enhance the local site server

#### Global enhancer

Booter will require this file `<root>/src/enhancer.mjs` to get the enhancer function, which should have following signature:

```
const enhancer = (fastify, yxRoot, yxSettings, globalServices) => void
```

Server booter will call enhancer with the global fastify object, siteRoot,  siteSettings and globalServices

#### Local enhancer

Booter will require this file `<root>/sites/<subsite>/src/enhancer.mjs` to get the site enhancer function, which should have following signature:

```
const enhancer = (fastify, subsiteRoot, siteSettings, globalSettings, globalServices) => void
```

Subsite server booter will call enhancer with the global fastify object, subsiteRoot,  siteSettings, globalSettings and globalServices.

#### Local view engine first, then global default view engine

yx provides global default view engines. Developers can bring their own view engines.

Each subsite can provide its own engines through this file:

```
<site-root>
 |- src
    |- engines.mjs
```

`engines.mjs` should expose a default function build with signature of
```
const build = (siteRoot, name, ext, options, lang, i18n)  => engineObject
```

engine object should has at least one async method: renderFile with signature of:

```
async renderFile(filepath, data)
```

`filepath` is relative path under site root.


### globalSettings

Sometimes server needs to pass down some sharedSettings to all subsites. Site settings can set globalSettings property.

### globalServices

Sometimes server needs to pass down global services such as database connection etc. to all subsites. yx booter will require this file `<root>/src/globalServices.mjs`, which should export default `buildGlobalServices` function with following signature:

```
const buildGlobalServices = (settings, root) => Object
```


## Why choose fastify as the base server

Of course because I used it before and liked it, but also some of its cool features.

### rewriteUrl

This one cool feature rewriteUrl allows yx to rewrite a request like `my-site-in-ejs.localhost/index.ejs` to `localhost/my-site-in-ejs/index.ejs`. This allows yx to use Fasity's plugin with a prefix feature that makes it transparent to develop router and handlers for subsite like a normal request without a subsite context.

### plugin with prefix and isoloated subserver

Fastify supports plugin with `prefix`, with each plugin's fastify server indepedent and isolated with others, which makes it perfect to handle each subsite's request indepently.


## Design and development ideas

This section logs important designs, ideas, reationale and choices along the development. As yx is still at early stage, this section is NOT intended to be complete and well structured but rather to reflect design ideas and choices down the road.

### yx Project Folder structure

```
<yx project root>
 |- prod.mjs : code to start production server
 |- build.mjs : code to start building processproduction server
 |- dev.mjs : code to start development server
 |- yx.mjs : code for yx bin
 |- settings.mjs : shared settings accross environment
 |- settings.development.mjs: settings for development only
 |- settings.production.mjs` : settings for production
 |- src : server source code  folder
    |- bootServer.mjs : code to boot server
    |- utils.mjs : utils used by server
    |- lang : i18n dictionary
        |- messages : folder for message dictionaries
          |- zh-cn : Simplified Chinese
          |- en : English
          |- ...
    |- engines : source code for view / template engines
 |- sites : root for sites
    |- www : default site
    |- site1 : sub site
       |- settings.mjs : shared settings accross environment
       |- settings.development.mjs: settings for development only
       |- settings.production.mjs` : settings for production
       |- public : folders for public files served as is. Use url <sub-site.host>/[static|bundle]/...
          |- static : static files such as images, icons etc that is going to be served as is.
          |- bundle : static files generated by bundlers like webpack or other compilers generated
                      from other sources. bundle folder can be added to `.gitignore`
       |- pages :  static html pages or templates subject to individual engine's
                   interpretation
       |- src : source code (html / template etc.)
         |- lang : i18n dictonary for handlers
           |- zh-cn : Simplified Chinese
           |- en : English
           |- ...
         |- views / templates / includes / components : source code / templates etc. subject to each individual engine's interpretation
```

### Url try rules

#### Static files

yx mandates url starts with `/static/`  or `/bundle/` as static files and will be served as is, not subject to any other interpretation or redirect.

`static` is intended for static files requiring no processing. They should be managed by source control tools.

`bundle` is intended for static files that are generated by bundle tools for example webpack or compilers. They should NOT be managed by source control tools. They can be put in .gitignore.

Root forlder of the two is `<site-root>/public`

#### Non-static files

The current release supports `GET` only.

The server will serve files with follwing try rules in order, a term borrowed from nginx. `view-ext` means each subsite's view engine's extension. `ext` is any file extension other then view engine file extension.

- `site-1.abc.com/` or `site-1.abc.com/abcd/.../` - `<site-root>/<url>/index.html`, then `<site-root>/<url>/index.[view-ext]`

- `site-1.abc.com/<segments>/abc` - `<site-root>/<segments>/abc.html`, then `<site-root>/<segments>/abc.[view-ext]`, then `<site-root>/<segments>/abc/index.html`, then `<site-root>/<segments>/abc/index.[view-ext]`

- `site-1.abc.com/<segments>/abc.[ext]` - `<site-root>/<segments>/abc.[ext]`



Root folder of each site's pages is `<site-name>/pages`.


### yx server settings

yx server settings are composed of three files:

```
- settings.mjs : shared settings accross environment
- settings.development.mjs: settings for development only
- settings.production.mjs : settings for production
```

Eventual setting will be a deep merge of `settings.mjs` and`settings.[development|production].mjs`, the latter has higher priority.

### Subsite setting

Each subsite's settings for renderring each subsite.

Similar to yx server, it has:

```
- settings.mjs : shared settings accross environment
- settings.development.mjs: settings for development only
- settings.production.mjs : settings for production
```

Eventual setting will be a deep merge of `settings.mjs` and`settings.[development|production].mjs`, the latter has higher priority.

### Request decoration to add  `_yx` to `request`

When yx is booted, each subsite's settings, view engines, plugins etc. should be initiated and passed down as property `_yx` of `request` to handlers.

### Boot yx

yx is booted with following steps:

1. load server settings
2. scan sites folder, load site list and site settings
3. initiate view engine and other plugins with site settings
4. enhance `request` with `_yx` property, which is a object with properties and methods for the subsite's handlers to use.

### Booting functions

1. loadGlobalSettings: siteRoot => globalSettingsObject
2. enhanceGlobalSettings: globalSettingsObject => globalSettingsObject
3. buildGlobalServices: globalSettingObject => globalServicesObject
4. enahceGlobalServicesObject: (globalSettingsObject, globalServicesObject) => globalServicesObject
5. loadLocalSettings: siteRoot => localSettingObject
6. enhanceLocalSettings: localSettingObject => localSettingObject
7. buildLocalSerServices: (localSettingObject, globalServicesObject) => localServicesObject
8. enhanceLocalServices: (localSettingObject, globalServicesObject, localSericesObject) => localServicesObject

### GET try rules in more detail

When a request hit, the URL will be resovled to a handler. The handler needs to decide the rules to try different resources. yx follows the following rules:

1. ends with `.[non view engine / template ext]`: server static file.
2. ends with `.[view engine ext]`: run engine, render file and serve output
3. ends with `/` : try `/index.html`, `/index.[view engine ext]`
4. ends with `/abc`, try `/abc.html`, `/abc.[view engine ext]`, `/abc/index.html`, `/index.[view engine ext]`
5. when resolve to view template, try to locate `abc.ext.boot.mjs`, run `getServerProps, getStaticProps`

### `_yx` object

Duosit's boot process builds up `_yx` object, which contains all settings, services and engines built up by yx. It is also passed down as `request._yx` for routers to use.

```
{
  url: string // subsite url. availabel only in subsite's routes
  global: {
    root: string // project root
    settings : Object //global settings
    services: Object // services built up by serviceBuilder
    i18nMessages: Object// messages used for alerts
    lang: string //language
  },
  site: {
    root: string // site root
    settings: Object // subsite settings
    name: string // subsite name
    engine: Object // subsite template engine
    services: Object // services built by site's service enhancer
  }
}

```

### i18n

i18n is supported by dictionary of message or function per key to generate message for each locale with following folder structure:

```
<yx-root>
  |- src
    |- lang
      |- messages  // for server and application messages

```

i18n will be merged in the order of <yx-source>/src/lang and <site-root>/src/lang/
site i18n will loaded from site.

```
<subsite-root>
  |- src
    |- lang
      |- handlers  // for handlers

```



## License

MIT

# 中文

# yx
`yx`， 游侠，是一个可以支持独立多子站点的web服务器。每个子站点有自己的独立设置、目录、模板(template) / View引擎，同时也支持基于文件的路由（类似于nextjs）（该特性还在开发中）

yx基于[fastify](https://github.com/fastify/fastify) web服务器开发。游侠 yx也从[Nextjs](https://github.com/vercel/next.js)借鉴了大量的设计理念。这里我要对两个团队对开源软件届的贡献表示感谢。

## 游侠yx核心特征

### 同时支持静态HTML与模板引擎页面

和Next.js一样, yx从 `<site>/pages` 目录渲染和发送页面. 和 Next.js 不同, 游侠yx支持静态 HTML 文件，也支持渲染模板引擎文件，例如 [liquidjs](https://github.com/harttle/liquidjs).

### 基于文件的路由

yx支持 Nextjs风格的基于文件的路由，格式为 `/<segments>/[route1]/[route2]/[[...captureAll]].[template-ext]`.

yx也支持3种获取数据、渲染模板文件、生成静态页面的方法, `getStaticProps`, `getServerProps` and `getStaticPaths`.

### 使用伴侣boot.mjs文件统一数据加载

yx有一个独一无二的设计，使用伴侣 `boot.mjs` 文件来加载数，渲染模板。

模板渲染的一个共同任务是加载初始数据来渲染模板。为支持基于文件的路由，在`pages`目录下渲染模板时， yx首先会查找是否有 `<template-file-name>.boot.mjs`名的伴侣文件, 该文件应该发布三个异步函数: `getStaticProps`, `getServerProps`, `getStaticPaths`中的一个或多个。

### 强化服务器

利用 `fastify`的 plugin设计， yx 支持对标准服务器的深度定制和强化， 允许开发者提供全局和站点服务构建器，以及全集和站点增强器，来强化服务器，增加任何路由规则和处理程序。

### 子站点与独立引擎

yx支持子站点，允许每个子站点有独立的模板引擎和渲染器。例如允许一个站点使用 `ejs` 引擎，另外一个使用 `liquidjs` 引擎。

### 编译生成融合静态站点和动态站点的生产版本

借鉴Nextjs，yx支持编译命令, `yarn yx build <site-name>`。编译器将会根据文件路由规则、模板引擎的伴侣文件发布的获取数据的方法，自动判断是否生成静态文件、或需要动态渲染。

## 用法

### 安装

Yarn:

Yarn:

`yarn add yx`

Npm:

`npm install yx`

本项目使用yarn，所以后续文档也使用yarn作为说明。

### 列举模板

`yarn yx ls`

### 使用模板创建新站点

`yarn yx new <template-name> <new-site-name>`

新站点的名字是子域名，所以必须服务子域名的规则。

### 运行开发服务器

`yarn yx dev`

### 访问子站点

打开浏览器，访问`<sub-site-name>.localhost:5000`.

游侠yx使用5000作为默认端口。可以修改`settings.mjs`设置不同端口。

#### 全局 （跨站点）设置

您可以在自己项目的根目录下创建自定义全局设置文件，配置项目。

1. settings.mjs

```
// 开发、生产环境共享设置
export default {
  defaultSite: 'www', // 默认站点名称
  lang: 'en', // 语言locale
  port: 5000, // 服务端口
}
```

2. settings.development.mjs

```
//  开发环境设置
export default {
// 任何设置
}
```

3. settings.production.mjs 暂时不使用


最终设置为`settings.mjs` 与 `settings.development.mjs`的深度合并, 后者覆盖前者。

目前 游侠 yx 只使用 `defaultSite`, `lang` 与 `port`.

未来会使用更多设置。

## 当前目标与最重要概念

本项目的当前目标是提供一个允许多子站点并存、方便的实验、学习与演示web技术的服务器环境。

当时机成熟时，yx可能会瞄准生成部署。但这不是当前目标。

### 子站点

每个子站点之间独立。

游侠 yx 对子站点不做过多假设，只有三个简单的目录结构要求和一个保留文件后缀名。

- <site-root>/pages : 用于html / 模板文件等
- <site-root>/public/static: 用于不需要额外处理的静态文件
- <site-root>/public/bundle: 用于使用打包工具或编译工具生成静态文件
- <site-root>/pages/**/<filename>.boot.mjs:`.boot.mjs`文件扩展用作为模板预加载数据。 游侠 yx不会从`pages`目录发送该后缀的文件，但会从 `static` 与 `bundle` 目录发送该后缀的文件。


不过如果您愿意，也可以在 `pages` 目录放置任何静态文件。

如果您是 `fastify` 开发者，想进一步增强您的子站点, 您可以给子站点增加路由与请求处理器。后续将增加这一部分文档。

### 结构化boot服务器

为了支撑多站点，支持定制，支持全局以及子站点强化服务器，游侠采用结构化启动流程准备服务器：

```
-- 启动服务器
|- 加载全局设置
|- 加载全局 i18n多语言资源
|- 加载子站点清单
|-> |- 构建全局服务
    |- 构建全局增强器
    |- 运行全集增强器
    |-> 对每个子站点
      |- 加载子站点设置
      |- 加载子站点i18n多语言资源
      |- 构建子站点服务
      |- 构建子站点增强器
      |- 构建子站点模板/view引擎
      |- 装饰/生成 `request._yx` 对象，属性包括
        |- lang
        |- global
          |- settings
          |- services
          |- i18n
          |- root
        |- site
          |- settings
          |- services
          |- i18n
          |- root
          |- engine
      |- 添加静态文件router
      |- 添加默认routers
      |- 运行子站点增强器
```

### 项目模板

游侠 yx 后续将逐步为典型的框架和库增加预设置的项目模板，为您节省时间。

目前包括:

`template-html` - 原生html开发

`template-tailwind` - tailwind

`template-alpine` - alpinejs

`template-liquid` - liquidjs模板引擎

您可以运行`yarn yx ls` 显示项目模板列表。

您也可以运行 `yarn yx new <项目模板名template-name> <目标站点名target-site-name>`， 使用模板创建新项目。

欢迎您提交pull请求，增加更多模板。

### HTML View引擎 / 模板引擎

游侠的一个目标是方便实验不同的HTML view引擎 / 模板引擎。

当前只配置了对[harttle/liquidjs](https://github.com/harttle/liquidjs)引擎的基本支持。

后续将增加更多引擎。

### 统一的初始化view / template方法

当 游侠 yx 渲染一个html模板时，比如 `index.liquid`, 会首先在同一目录下寻找 `index.liquid.boot.mjs`文件。该文件应该export提供一个名为`getServerProps` 的异步函数，该函数有如下签名：

```
const getServerProps = async (ctx) => data
```

`ctx` 有如下属性，后续会进一步增加更多属性。

```
{
  request: // fastify request object
  reply: // fastify reply object
}
```

游侠将会把 `{...data, _ctx: ctx}` 发送给模板引擎。


您可以尝试一下：

`yarn yx new template-liquid liquid-1`

`yarn yx dev`

访问 `liquid-1.localhost:5000`

浏览器将显示：

```
Hello from boot.mjs

Below is from template

Alice
Bob
Carol

```

第一行是 `index.liquid.boot.mjs`返回的数据:

```
const getServerProps = async ctx => {
  return {
    text: 'Hello from index.liquid.boot.mjs ',
  }
}

export default {
  getServerProps,
}

```

### 游侠yx增强器

游侠yx支持fastify开发者强化fastify服务：

- 全局强化器：增强全局fastify服务器
- 站点强化器: 增强子站点服务器
- 站点模板/view 引擎替代：子站点可以提供自己的引擎，取代yx默认引擎

#### 全局enhancer

游侠yx booter将会 require文件 `<root>/src/enhancer.mjs` 获得强化器函数，该函数应该有如下签名：

```
const enhancer = (fastify, yxRoot, yxSettings, globalServices) => void
```

服务器booter将使用全局fastify服务器调用该函数。

#### 子站点enhancer

游侠yx booter将会require文件 `<root>/sites/<subsite>/src/enhancer.mjs` 获得子站点强化器函数，该函数有如下签名：

```
const enhancer = (fastify, subsiteRoot, siteSettings, globalSettings, globalServices) => void
```

子站点服务器将在每个子站点调用该函数。

#### 本地模板/view引擎有限，然后yx默认引擎

游侠提供一组默认模板/view引擎。开发者可以提供自己的引擎。

每个子站点通过如下文件提供引擎：

```
<site-root>
 |- src
    |- engines.mjs
```

`engines.mjs` 应该发布默认函数`build`，签名如下：
```
const build = (siteRoot, name, ext, options, lang, i18n)  => engineObject
```

引擎对象应该起码提供一个异步函数：

```
async renderFile(filepath, data)
```

`filepath` 是相对于子站点的模板文件目录。


#### 全局设置

有时服务器需要向子站点发布全局共享设置，可以在设置文件中设置`globalSettings`属性。

#### globalServices

有时服务器需要将全局服务例如数据库连接发送到每个子站点服务器。游侠yx将require本文件`<root>/src/globalServices.mjs`, 该文件应该export默认 `buildGlobalServices` 函数。 函数签名应为:

```
const buildGlobalServices = (settings, root) => serviceObject
```


## 为什么选择Fastify为基础开发游侠 yx

当然因为我们用过Fastify，而且也觉得Fastify不错，不过更主要是因为它的一些很不错的功能。

### rewriteUrl

 rewriteUrl 让游侠yx可以把其一个类似于 `my-site-in-ejs.localhost/index.ejs` 的请求重写为 `localhost/my-site-in-ejs/index.ejs`. 这个功能结合下面描述的支持前缀的plugin功能，让一休yx可以就像没有子站点一样，方便的开发路由器与handler。

### 带前缀与独立子服务器的plugin

Fastify支持带有 `prefix`的plugin, 每个plugin的fastify是个独立的子服务器，和其他分开，非常时独立的处理每个子站点的请求。


## 设计与开发思想

这部分记录yx开发中的重要的设计，想法，理念与选择决定。 由于一休 yx正在早期阶段，本部分不追求完备性和良好的结构，而是及时反应开发中设计理念和决定。

### 一休yx 代码目录结构

```
<yx代码根目录>
 |- server.mjs : 启动服务器代码
 |- bootServer.mjs : 初始化服务器代码
 |- dev.mjs : 开发环境启动服务器代码
 |- settings.mjs : 跨环境共享设置
 |- settings.development.mjs: 开发环境设置
 |- settings.production.mjs` : 生产环境设置
 |- src : 服务器端代码目录
    |- utils.mjs : 服务器使用的一些功能库
    |- lang : i18n国际化辞典
        |- messages : 消息辞典
          |- zh-cn : 简体中文
          |- en : 英文
          |- ...
    |- engines : view / template模板引擎代码
 |- sites : 各站点根目录
    |- www : 默认站点
    |- site1 : 子站点
       |- settings.mjs : 跨环境共享设置
       |- settings.development.mjs: 开发环境设置
       |- settings.production.mjs` : 生产环境设置
       |- public : 公开静态文件. 使用链接 <sub-site.host>/[static|bundle]/...
          |- static : 类似图片、图标等不需要二次处理的静态内容
          |- bundle : 通过打包工具如webpack、编译器等从其他文件生成的静态文件
                       bundle可以被添加到 `.gitignore`中。
       |- pages :  静态html页面或有不同引擎渲染的模板
       |- src : 源代码 (html / template等.)
         |- lang : router/handler需要i18n字典
           |- zh-cn : 简体中文
           |- en : 英文
           |- ...
         |- views / templates / includes / components : 模板源代码
         |- ... 更多
```

### Url try 规则

#### 静态文件

一休yx 规定 以 `/static/`或`/bundle/` 开始的url，都指向静态文件，直接发送，不会进行任何解析处理。

`static` 用作不需要额外处理的文件，应该使用代码管理工具如git等管理。

`bundle` 用作由打包工具如webpack、或浏览器生成的文件。一般不使用代码管理工具管理，可以被放到.gitignore里。

这两个目录的根目录是 `<site-root>/public`

#### 非静态文件

当前只支持 `GET` 方法。

服务器使用如下规则，寻找、渲染文件。其中view-ext为每个子站点的模板引擎的后缀，ext为一般后缀

- `site-1.abc.com/` 或者 `site-1.abc.com/<...url>/.../` - `<site-root>/<...url>/index.html`, 然后 `<site-root>/<...url>/index.[view-ext]`

- `site-1.abc.com/<...segments>/abc` - `<site-root>/<...segments>/abc.html`, 然后 `<site-root>/<...segments>/abc.[view-ext]`, 然后 `<site-root>/<segments>/abc/index.html`, 然后 `<site-root>/<segments>/abc/index.[view-ext]`

- `site-1.abc.com/<segments>/abc.[ext]` - `<site-root>/<segments>/abc.[ext]`



页面文件根目录为 `<site-name>/pages`.

### 一休yx服务器配置

一休服务器配置有三个部分构成：

```
- settings.mjs : 跨环境配置
- settings.development.mjs: 开发环境配置
- settings.production.mjs : 生产环境配置
```

最终配置是 `settings.mjs` 与 `settings.[development|production].mjs`的深度合并，其中后者有更高优先级。

### 子站点配置

每个子站点的配置用作渲染每个子站点。

与一休yx服务器相似：


```
- settings.mjs : 跨环境配置
- settings.development.mjs: 开发环境配置
- settings.production.mjs : 生产环境配置
```

最终配置是 `settings.mjs` 与 `settings.[development|production].mjs`的深度合并，其中后者有更高优先级。

### 启动服务的主要函数

1. loadGlobalSettings: siteRoot => globalSettingsObject
2. enhanceGlobalSettings: globalSettingsObject => globalSettingsObject
3. buildGlobalServices: globalSettingObject => globalServicesObject
4. enahceGlobalServicesObject: (globalSettingsObject, globalServicesObject) => globalServicesObject
5. loadLocalSettings: siteRoot => localSettingObject
6. enhanceLocalSettings: localSettingObject => localSettingObject
7. buildLocalSerServices: (localSettingObject, globalServicesObject) => localServicesObject
8. enhanceLocalServices: (localSettingObject, globalServicesObject, localSericesObject) => localServicesObject

### GET try规则细节

当请求到来时， URL被解析到处理器handler。该handler按照以下规则尝试不同解析规则:

1. 以 `.[ext]`结尾: 发送静态文件
2. 以 `.[view=ext]`: 调用模板引擎，渲染文件，发送结果
3. 以 `/`结尾 : 尝试 `/index.html`, `/index.[view-ext]`
4. 以 `/abc`结尾, 尝试 `/abc.html`, `/abc.[view-ext]`, `/abc/index.html`, `/index.[view-ext]`
5. 当解析到模板时，同目录下寻找boot.mjs文件 `[filename].boot.mjs`, 运行 `getServerProps, getStaticProps`

### `_yx` object

`request._yx` 有如下属性

```
{
  settings: {...}  // 合并 subsite settings
  engine: {...} // instantiated engine instance
  ... // TBD along development
}

```

### i18n

i18n 通过字典方式实现，每个key对应的值为字符串，或返回字符串的函数。一休服务器运行消息i18n的目录为：

```
<yx-root>
  |- src
    |- lang
      |- messages
        |- zh-cn.mjs
        |- en.mjs
        |- ...

```

子站点i18n用作handler，文件结构为：

```
<subsite-root>
  |- src
    |- lang
      |- zh-cn.mjs
      |- en.mjs
      |- ...

```



## License

MIT
