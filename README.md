
[中文](#中文)

# duosite

Duosite (duo: 多, many in Simplified Chinese) is a web server that aims to host and run many sub sites, each with its own sub setting, folder structure and template / view engine, and file system based routing (in progress)  as Nextjs.

 Duosite is built on top of the excellent [fastify](https://github.com/fastify/fastify) webserver.

## Why duosite?

The reason to develop duosite is simple: I need a web server that allows me to experiment html / css / js, with each site and setup indepent of each other.

The same goal can be achieved by checkouting out different branches with a different setup. The problem is that then each branch would not be visible to eachother at the same time.

Say I would like to expriment a subsite with ejs template engine and another one with marko engine. I don't want to swith branches. The two should coexist harmony. And I can visit `site-ejs.localhost` and `site-marko.localhost` at the same time. That's the starting idea of duosite.

## Usage

### Install

Yarn:

`yarn add duosite`

Npm:

`npm install duosite`

This project uses yarn. So documentation below uses yarn too.


### List templates

`yarn duosite ls`

### Create new site from template

`yarn duosite new <template-name> <new-site-name>`

The new site name is subdomain name so it must comply with subdomain rules

### Run development server

`yarn duosite dev`

### Visit a subdomain:

Open your browser and visit `<sub-domain-name>.localhost:5000`.

Duosite uses 5000 as default site. You can change it by modifying `settings.js`


## Current goal

The current goal is to provide a convinient environment for expirementing, studing and demoing web technology that allow co-exist of multiple subsites.

When it matures, duosite may target production depoyment. But that is NOT the goal yet.

## Subsite

Each subsite is indepent.

Duosite doens't make much many assumptions about subsites, each three simple folder structure rules:

- <site-root>/pages : where to put html / template engine etc.
- <site-root>/public/static: where to put assets that don't require processing.
- <site-root>/public/bundle: where to put assets generated by bundle tools or compilers.

But if you choose so you can put any static contents in side `pages` folders as well.

## Templates

Duosite will gradually add template set up for typical frameworks or libraries.

It provides commands to create new sites from templates.

Now following are included.

`template-tailwind` - template for tailwind

`template-alpine` - template for alpine

You can run `yarn duosite ls` to show list of templates.

You can also run `yarn duosite new <template-name> <target-site-name>` to create a site with a template.

You are welcome to submit pull request to add more templates.

## Why choose fastify as the base server

Of course because I used it before and liked it, but also some of its cool features.

### rewriteUrl

This one cool feature rewriteUrl allows duosite to rewrite a request like `my-site-in-ejs.localhost/index.ejs` to `localhost/my-site-in-ejs/index.ejs`.

### plugin with prefix and isoloated subserver

Fastify supports plugin with `prefix`, each a subserver isoldated with others, which makes it perfect to handle each subsite's request indepently.


## Design and development ideas

This section logs important designs, ideas, reationale and choices along the development. As duosite is still at early stage, this section is NOT intended to be complete and well structured but rather to reflect design ideas and choices down the road.

### Duosite Project Folder structure

```
duosite project root
 |- server.js : server source code
 |- settings.js : shared settings accross environment
 |- settings.development.js: settings for development only
 |- settings.production.js` : settings for production
 |- src : server source code  folder
    |- utils.js : utils used by server
    |- lang : i18n dictionary
        |- messages : folder for message dictionaries
          |- zh-cn : Simplified Chinese
          |- en : English
          |- ...
    |- engines : source code for view / template engines
 |- sites : root for sites
    |- www : default site
    |- site1 : sub site
       |- settings.js : shared settings accross environment
       |- settings.development.js: settings for development only
       |- settings.production.js` : settings for production
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

Duosite mandates url starts with `/static/`  or `/bundle/` as static files and will be served as is, not subject to any other interpretation or redirect.

`static` is intended for static files requiring no processing. They should be managed by source control tools.

`bundle` is intended for static files that are generated by bundle tools for example webpack or compilers. They should NOT be managed by source control tools. They can be put in .gitignore.

Please refer to folder structure of actual location in file system.

#### Non-static files

The current release supports `GET` only.

The server will serve files with follwing try rules in order, a term borrowed from nginx:

```
site-1.abc.com/ or site-1.abc.com/abcd/.../ - <site-root>/<url>/index.html, then <site-root>/<url>/index.[view-ext]

site-1.abc.com/<segments>/abc -
    <site-root>/<segments>/abc.html, then <site-root>/<segments>/abc.[view-ext],
    then <site-root>/<segments>/abc/index.html, then
    <site-root>/<segments>/abc/index.[view-ext]

site-1.abc.com/<segments>/abc.ext - <site-root>/<segments>/abc.ext


```

Root folder of each site is <site-name>/pages.



### Duosite server settings

Duosite server settings are composed of three files:

```
- settings.js : shared settings accross environment
- settings.development.js: settings for development only
- settings.production.js : settings for production
```

Eventual setting will be a deep merge of `settings.js` and`settings.[development|production].js`.

### Subsite setting

Each subsite's settings for renderring each subsite.

Similar to duosite server, it has:

```
- settings.js : shared settings accross environment
- settings.development.js: settings for development only
- settings.production.js : settings for production
```

### Request decoration to add  `_duosite` to `request`

When duosite is booted, each subsite's settings, view engines, plugins etc. should be initiated and passed down as property `_duosite` of `request` to handlers.

### Boot duosite

Duosite is booted with following steps:

1. load server settings
2. scan sites folder, load site list and site settings
3. initiate view engine and other plugins with site settings
4. enhance `request` with `_duosite` property, which is a object with properties and methods for the subsite's handlers to use.

### Practical Functional Programming

Duosite follows pratical functional programming principles:

1. Avoid side effects unless absolutely necessary
2. Avoid closure / external variables unless absolutely necessary
3. Avoid too much functional abstraction for code readability

### Booting functions

1. loadGlobalSettings: siteRoot => globalSettingsObject
2. enhanceGlobalSettings: globalSettingsObject => globalSettingsObject
3. buildGlobalServices: globalSettingObject => globalServicesObject
4. enahceGlobalServicesObject: (globalSettingsObject, globalServicesObject) => globalServicesObject
5. loadLocalSettings: siteRoot => localSettingObject
6. enhanceLocalSettings: localSettingObject => localSettingObject
7. buildLocalSerServices: (localSettingObject, globalServicesObject) => localServicesObject
8. enhanceLocalServices: (localSettingObject, globalServicesObject, localSericesObject) => localServicesObject

### GET try rules

When a request hit, the URL will be resovled to a handler. The handler needs to decide the rules to try different resources. Duosite follows the following rules:

1. ends with `.[non view engine / template ext]`: server static file.
2. ends with `.[view engine ext]`: run engine, render file and serve output
3. ends with `/` : try `/index.html`, `/index.[view engine ext]`
4. ends with `/abc`, try `/abc.html`, `/abc.[view engine ext]`, `/abc/index.html`, `/index.[view engine ext]`
5. when resolve to view template, try to locate `abc.ext.boot.js`, run `getServerProps, getStaticProps`

### `_duosite` object

`request._duosite` has following shape:

```
{
  settings: {...}  // merged subsite settings
  engine: {...} // instantiated engine instance
  ... // TBD along development
}

```

### i18n

i18n is supported by dictionary of message or function per key to generate message for each locale with following folder structure:

```
<duosite-root>
  |- src
    |- lang
      |- messages  // for server and application messages

```

i18n will be merged in the order of <duosite-source>/src/lang and <site-root>/src/lang/
site i18n will loaded from site.

```
<subsite-root>
  |- src
    |- lang
      |- handlers  // for handlers

```

### RewriteUrl

Leveraging fastify's `rewriteUrl` function, http request to `subsite.abc.com/...` is rewritten to `abc.com/subsite/...`


### Duosite enhancers

Duosite should allow developers to enhance fasity server:

- global enhancer: enhance the global fastify server
- site enhancer: enhance the local site server

### globalSettings

Sometimes server needs to pass down some sharedSettings to all subsites. Site settings can set globalSettings property.

### globalServices

Sometimes server needs to pass down global services such as database connection etc. to all subsites. Duosite booter will require this file `<root>/src/globalServices.js`, which should export default `buildGlobalServices` function with following signature:

```
const buildGlobalServices = (settings, root) => Object
```


#### Global enhancer

Booter will require this file `<root>/src/enhancer.js` to get the enhancer function, which should have following signature:

```
const enhancer = (fastify, duositeRoot, duositeSettings, globalServices) => void
```

Server booter will call enhancer with the global fastify object, siteRoot,  siteSettings and globalServices

### Local enhancer

Booter will require this file `<root>/sites/<subsite>/src/enhancer.js` to get the site enhancer function, which should have following signature:

```
const enhancer = (fastify, subsiteRoot, siteSettings, globalSettings, globalServices) => void
```

Subsite server booter will call enhancer with the global fastify object, subsiteRoot,  siteSettings, globalSettings and globalServices.

### Local view engine first, then global default view engine

Duosite provides global default view engines. Developers can bring their own view engines.

Each subsite can provide its own engines through this file:

```
<site-root>
 |- src
    |- engines.js
```

`engines.js` should expose a default function build with signature of
```
const build = (siteRoot, name, ext, options, lang, i18n)  => engineObject
```

engine object should has at least one async method: renderFile with signature of:

```
async renderFile(filepath)
```

`filepath` is relative path under site root.

# 中文

准备中
