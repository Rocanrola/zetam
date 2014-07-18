Zetam
-----
Zetam is a middleware for express that made frontend development easy. It is based in two basic concepts: Pages and Components

Install
-----------

```sh
npm install zetam
```

Quick look (example)
--------------------

 - **project** (main dir)
     - app.js (has Express app and setup zetam middleware)
     - **components**
         - **header**
             - controller.js - (server-side logic, create model for the template)
             - i18n.js - (has i18n texts)
             - template.html - (default template file, it redener model from the controller and i18n)
             - styles.less - (has css for the component)
             - view.js - (browserify module, clientside logic)
     - **pages**
         - **index** (home page)
             - controller.js - (server side logic and model setup)
             - i18n.js - (has i18n texts)
             - template.html - (render model and i18n, call components)
             - bundle.less - (has css for the page and call all the components less stylesheets)
             - view.js - (has the page client-side logic and call all the view.js files from components an initialize these)
     - **public** (statics folder)
         - **css**
             - **components**
                 - header.css - (compiled css from the component, is used to preview)
             - **pages**
                 - index.css - (compiled from bundle.less it's used from the index template)
         - **js**
             - **components**
                 - header.js - (compiled js from the component, is used to preview)
             - **pages**
                 - index.js - (compiled from view.js it's used from the index template it has all the client-side logix for the page. including components initialization)
         - gulpfile.js - (it use the zetam.gulp process in order to generate static assets (js and css))

Middleware
-------------
Example:

```js
// app.js
var z = require('zetam');
var express = require('express');
var app = new express();

app.use(function(req,res,next){
    // this is needed for i18n
    req.config.locale = 'es';
    next();
});

// the potato
app.use(z.middleware);

app.listen(3000,function () {
	console.log('running on port ' + port);
});
```

Middlware has several functions. The most important: handle URLs and load pages (AKA router).

```sh
GET http://localhost:3000/example
```
Will load **example** page, and execute **get** method (from the controller).

If the url has more sections its sections are created inside a **req.resouce** object.

```sh
POST http://localhost:3000/user/9876/post/1234
```
Will load **user** page, and execute **post** method (from the controller). This is how the **req.resource** would looks like.

```js
{ 
    name: 'user',
    id: '9876',
    subresource: { 
        name: 'post', 
        id: '1234' 
    } 
}
```

Pages
-------------
Pages are the initial logic piece for every URL. Each one has it own templates, server and client side logic.

Example pages directory structure:

 - **project**
     - app.js
     - **pages**
         - **index**
         - **example**
         - **products**

Inside each page directory, five files are needed.

**project/pages/example**

 - controller.js
 - i18n.json (optional)
 - template.html
 - bundle.less
 - view.js

```js
//project/pages/example/controller.js

exports.get = function (req,conf,cb) {

    // req: express requirement object
    // conf: additional conf 
    // cb: callback function. It receives two parameters: error and model object (plain object to be passed to the template)
    
	cb(null,{title:'page title'})
}
```

```js
//project/pages/example/i18n.json
// This file is optional, it takes the req.config.locale variable to determine language selected. In this example
```
 
