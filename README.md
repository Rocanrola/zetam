Zetam
-----
Zetam is a middleware for express that makes frontend development easy. It's based on two basic concepts: Pages and Components

Install
-----------

```sh
npm install zetam
```
Plug the middleware in your app.

```js
var z = require('zetam');
var express = require('express');
var app = new express();

app.use(function(req,res,next){
    req.config.locale = 'es';
    next();
});

// set 'public' static folder
app.use(express.static(__dirname + '/public'));

// the potato
app.use(z.middleware);

app.listen(3000,function () {
    console.log('running on port ' + port);
});
```
Ready ! Start to create Pages and Components.

Pages & Components
-------------
Pages and components are pretty similar. The main difference is the use of each. Pages should have minimum amount of business logic and are pretty much a layout to hold components. Components, in the other side, are ideal to reusable pieces with logic and many templates.

Pages
-------------
Pages are the initial logic piece for every URL. Each one has it own templates, server and client side logic. 

Example page directory structure:

 - **project**
     - app.js
     - **pages**
         - **example**
             - controller.js
             - i18n.json (optional)
             - template.html
             - bundle.less
             - view.js

In order to see **example** Page, browse http://localhost:3000/example

```js
//project/pages/example/controller.js
// In this case the request is a GET request 
// so, Zetam will load get method from Controller

exports.get = function (conf,cb) {
    // conf: has globals object (req.config), and resource object (pathname)
    // both comes from the middleware.
    
    // cb: callback function. It receives two parameters: 
    // error and model object (plain object to be passed to the template)
    
    console.log(conf);
    console.log(conf.globals); // this comes from req.cofig
    console.log(conf.resource); // this represents the URL
    
    var model = {
        title:'page title'
    }
    
    cb(null,model)
}
```

```js
//project/pages/example/i18n.json

// Zetam will merge this two objects based on 
// req.config.locale value ("es" for this example)

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
//project/pages/example/bundle.less

// has page LESS styles, and also import 
// all the components LESS stylesheets used on the page. 
// It's automatically compiled to public directory 
// (public/css/pages/example.css) if you use zetam.gulp task.

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
    
    <div data-component="coolComponent" data-param="Apple rocks"></div>
    <!-- This inject the coolComponent component (see Components section) -->
    
    <footer>
        {{i18n.bye}}
        <!-- This will print "Bye bye !!! Please come back" -->
    </footer>

    <script src="/js/pages/example.js"></script>
</body>
</html>
```
```js
// project/pages/example/view.js

// It's a browserify module, so you can import and use node modules. 
// Also it is helpfull to import component view logic. 
// it's also compiled by the zetam.gulp task into the public directory
// (public/js/pages/example.js).

// importing coolComponent client side logic
var signup = require('../../components/coolComponent/view');


// page client side logic
document.getElementsByTagName('h2')[0].innerText = ('how you doing?');

// if you are using zetam-client module to create Components 
// client side logic, this is necessary
var z = require('zetam-client');
z.initDomComponents();
```
Components
-------------
Components are pieces with it's own server and client side logic, templates, styles and i18n. 

It's possible preview a component using the special **component** controller (it comes with Zetam)


http://localhost:3000/components/coolComponent?preview=true



Example component directory structure:

 - **project**
     - app.js
     - **components**
         - **coolComponent**
             - controller.js
             - i18n.json (optional)
             - template.html
             - bundle.less
             - view.js


```js
//project/components/coolComponent/controller.js

exports.init = function (conf,cb) {
    // conf: has globals object (req.config) and
    // all the attributes in the html tag
    
    // cb: callback function. It receives two parameters: 
    // error and model object (plain object to be passed to the template)
    
    console.log(conf);
    console.log(conf.globals); // this comes from req.cofig
    console.log(conf['data-param']); // this comes from the html tag
    
    var model = {
        text:conf['data-param']
    }
    
    cb(null,model)
}
```

```js
//project/components/coolComponent/i18n.json

// Zetam will merge this object (all and es)  on 
// req.config.locale value ("es" for this example)

{
    "all": {
        "hey": "Hey you !"
    },
    "es": {
        "hey": "Hola !"
    }
}

```
```css
//project/components/coolComponent/bundle.less

// has page LESS styles
// It's automatically compiled to public directory 
// (public/css/pages/coolComponent.css) if you use zetam.gulp task.


[data-component=coolComponent]{
    height: 50px;
    padding: 1px;
    background-color: blue;
    border:solid 2px red;
    
    button.main{
        background-color: white;
        padding:20px;
    }
}

```

```html
<!--project/components/coolComponent/template.html-->
<span>{{i18n.hey}}</span> <strong> {{model.text }}</strong>
<button class="main">Message</button>
```
```js
// project/components/coolComponent/view.js

// It's a browserify module, so you can import and use node modules. 
// it's also compiled by the zetam.gulp task into the public directory
// (public/js/components/coolComponent.js).
// it's highly recommended use zetam-client module
// https://www.npmjs.org/package/zetam-client

var z = require('zetam-client');

z.registerComponent({
    name:'coolComponent', 
    init:function () {
        this.bindEvent('button.main','click','showMessage')
    },
    showMessage:function(){
        alert('Message');
    }
})

// This register a new componen but not create an instance.
// In order to create an instance an link the instance with the 
// dom element is necessary run z.initDomComponents();
// it's recommended run this command from the Page view.js
// because it has to be run once, when the dom is ready.
```

## Using Components ##

In order to insert a component in a Page an HTML tag. Components can only be embedded from Pages like this:

```html
<div data-component="coolComponent"></div>
```
 Al the attributes added to the tag are passed to the Component controller in the first parameter.

 ```html 
<div data-component="coolComponent" data-param="Apple rocks"></div>
```

The **data-template**  modify which template file will be used.

```html
<div data-component="coolComponent" data-param="Apple rocks" data-template="small"></div>
```

Says to zetam: use **small.html** file instead the default **template.html**


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
    req.config.siteName = 'Example Website';
    next();
});

// set 'public' static folder
app.use(express.static(__dirname + '/public'));

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


conf.globals
----------
All Pages and Components receive a **conf** (first) parameter in the controller. This is a copy of req.config and also includes some other helpful resources:

 - **resource** : Object that represent the current URL
 - **cookies** : Cookies from the request

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

// set 'public' static folder
app.use(express.static(__dirname + '/public'));

// the potato
app.use(z.middleware);

app.listen(3000,function () {
    console.log('running on port ' + port);
});
```

req.config object is the way to send data to all pages and components. For example **req.config.locale** is used to choice the language and render i18n.json objects inside templates. Also all the req.config is passed to the pages and components controllers like the **globals** object.

## Gulp support ##

Zetam has a helper that automatically compile JS and CSS into the **public** directory:

```js
// gulpfile.js (example)
var gulp = require('gulp');
var z = require('zetam');

// this creates a zetam task
z.gulp(gulp);

// set the zetam task as the default
gulp.task('default', ['zetam']);
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