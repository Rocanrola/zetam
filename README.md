Zetam
-----
Zetam is a middleware for express that makes frontend development easy. It's based on two basic concepts: Pages and Components

Install
-----------

```sh
npm install zetam
```

Middleware
-------------

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

Middlware has several functions. The most important: routing.

Example:
```sh
GET http://localhost:3000/myFirstPage
```
Will load **myFirstPage** page and execute **get** method (see https://github.com/qzapaia/zetam#pages).


Also, the middleware will transform all the pathname into an **resource** object that is passed to the page controller.

```sh
POST http://localhost:3000/user/9876/post/1234
```
Will load **user** page, and execute **post** method (from the controller). This is how the **resource** would looks like.

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

req.config
----------

```js
// app.js
var z = require('zetam');
var express = require('express');
var app = new express();

app.use(function(req,res,next){
    // this is needed for i18n
    req.config = {
        locale:'es',
        siteName:'mySite'
    }
    next();
});

// the potato
app.use(z.middleware);

app.listen(3000,function () {
    console.log('running on port ' + port);
});
```

req.config object is the way to send data to all pages and components. For example **req.config.locale** is used to choice the language and render i18n.json objects inside templates. Also all the req.config is passed to the pages and components controllers like the **globals** object.

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

exports.get = function (conf,cb) {

    // conf: has globals object (req.config), and resource object (pathname)
    // cb: callback function. It receives two parameters: error and model object (plain object to be passed to the template)
    console.log(conf);
    cb(null,{title:'page title'})
}
```

```js
//project/pages/example/i18n.json
// Zetam will merge this two objects based on req.config.locale value ("es" for this example) and pass it to the template

{
    "all": {
        "greetings": "Howdy stranger !",
        "bye": "Bye bye !!! Please come back",
    },
    "es": {
        "greetings": "Hola !!"
    }
}

```
```css
// has page LESS styles, and also import all the components LESS stylesheets used on the page. It's automatically compiled to public directory (public/css/pages/example.css) if you use zetam.gulp task.

@import "components/signup/styles";
@import "less/globals/colors";

body{
    background-color:@mainColor;
    font-family: sans-serif;
    
    header {
        height: 6rem;
        margin: auto;
    }
}
```

```html
<!--project/pages/example/template.html-->

<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="stylesheet" href="/css/pages/example.css">
    <title>{{model.title}}</title>
    <!-- model object comes from controller reponse -->
</head>
<body data-country="{{i18n.locale}}">
    <header>
        <h1>
           {{i18n.greetings}}
           <!-- This will print "Hola !!" -->
        </h1>
        <h2></h2>
    </header>
    
    <div data-component="homePage"></div>
    <!-- This inject the homePage component (see Components section) -->
    
    <footer>
        {{i18n.bye}}
        <!-- This will print "Bye bye !!! Please come back" -->
    </footer>

    <script src="/js/pages/example.js"></script>
</body>
</html>
```
```js
// It's a browserify module, so you can import and use node modules. Also it is helpfull to import component view logic (bundle). it's also compiled by the zetam.gulp task into the public directory (public/js/pages/example.js).

// importing homePage client side logic
var signup = require('../../components/homePage/view');


// page client side logic
document.getElementsByTagName('h2')[0].innerText = ('how you doing?');
```


Quick look (example project)
--------------------

 - **project** (main dir)
     - app.js (has Express app and setup zetam middleware)
     - **components**
         - **header**
             - controller.js - (server-side logic, create model for the template)
             - i18n.js - (has i18n texts)
             - template.html - (default template file, it render model that comes from the controller and i18n)
             - styles.less - (has css for the component)
             - view.js - (browserify module, clientside logic)
     - **pages**
         - **index** (home page)
             - controller.js - (server side logic and model setup)
             - i18n.js - (has i18n texts)
             - template.html - (default template file, it render model that comes from the controller and i18n)
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