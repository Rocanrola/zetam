Zetam
-----
Zetam is a middleware for express that makes frontend development easy. It's based on two basic concepts: Pages and Components

Install
-----------

```sh
npm install zetam
```

YO Generator
----------
To start a basic project use the Yeoman generator: https://www.npmjs.org/package/generator-zetam


```sh
# install yeoman, zetam generator and gulp globally
npm install -g yo generator-zetam gulp

# init a new project
yo zetam

# run gulp
gulp
```

Pages & Components
----------
Pages and components are pretty the same thing. The main difference is the use. Pages are better for layouts with just few logic. In the other hand, components are very useful for complex and reusable logic pieces ("widgets"). Both have the same structure:

 - **controller.js** Server side logic. Defines the model to be passed to the template
 - **template.html** Mustache template, receives model, i18n and config objects
 - **i18n.json** it's passed to the template like a **i18n** object
 - **view.js** Client side logic (Common JS module by Browserify - http://browserify.org/)
 - **styles.less** CSS styles by less

View.js and styles.less are compiled by a gulp task. (http://gulpjs.com/) 

Middleware
----------
In order to use zetam, just plug the middleware into your Express project (http://expressjs.com/)

```js
// projectDir/app.js
var express = require('express');
var app = express();
var z = require('zetam');

app.use(express.static(__dirname + '/public'));

// the potato
app.use(z.middleware);

app.listen(3000,function () {
	console.log('running on port ' + port);
});
```

Pages
----------
Pages are controllers too. These are automatically loaded by zetam middleware. Just create a page folder inside the **pages** directory.

	projectDir > pages > myFirstPage

Create at least the controller and the template files and browse:

http://localhost:3000/myFirstPage

Page files structure:

 - projectDir
	 - pages
		 - myFirstPage
			 - controller.js
			 - template.html
			 - i18n.json
			 - view.js
			 - styles.less

Pages can be created running a yeoman command:
```sh
yo zetam:page
```

Components
----------
Components are loaded using an HTML tag inside any template with the **data-component** attribute.

```html
<!-- projectDir/pages/myFirstPage/template.html -->
<h1>A title</h1>
<div data-component="coolComponent" data-lastname="Smith"></div>
```

Components files structure:

 - projectDir
	 - components
		 - coolComponent
			 - controller.js
			 - template.html
			 - i18n.json
			 - view.js
			 - styles.less

it's possible create a new component running a yeoman command:
```sh
yo zetam:component
```

Controllers (controller.js)
----------

Pages and components has controllers to set the model to be passed to the template. In the case of Pages the method to be executed is the http verb used to request the page.

Controllers receive three parameter:

 - config: In the case of components, config are all the attributes of the HTML tag , and also receive the inner html content. In the case of pages is basic info about the page 
 - req: express request object
 - cb : callback(error,response). The response could be an empty object, or it can has the model to be passed to the template

Example: If the request is a POST request to http://localhost:3000/myFirstPage the way to handle this is:

Page:

```js
// projectDir/pages/myFirstPage/controller.js

exports.post = function(config,req,cb){
	cb(null,{
		model:{
			name:'John'
		}
	});
}

```

In the case of components included by a HTML tag, the method is always **init** method.

Component:
```js
// projectDir/components/coolComponent/controller.js

exports.init = function(config,req,cb){
	// in this case config receive all the attributes
	// For example, if the tag would be 
	// <div data-component="coolComponent" data-extra="great"></div>
	// config would have an data-extra atribute
	// config also receives an innerHTML attribute
	
	cb(null,{
		model:{
			name:'John',
			lastname:config['data-lastname']
		}
	});
}

```
Components can also send a second parameter in order to override some config options, for example: the template name.

```js
// projectDir/components/coolComponent/controller.js

exports.init = function(config,req,cb){
	cb(null,{
		model:{
			name:'John',
			lastname:config['data-lastname']
		},
		config:{
			'data-template':'otherTemplate'
		}
	});
}

```

This tells zetam use **otherTemplate.html** instead the default **template.html** file inside the component directory.


i18n (i18n.json)
---------
i18n.json file works with components and pages in the same way. In order to use it it's necesary set a **req.config.locale** variable before middleware loads. 

```js
// projectDir/app.js
var express = require('express');
var app = express();
var z = require('zetam');

app.use(express.static(__dirname + '/public'));

// the potato
app.use(function(req,res,next){
	req.config = { locale:'ar'}
	next();
});

app.use(z.middleware);

app.listen(3000,function () {
	console.log('running on port ' + port);
});
```
Inside the i18n.json file there would be to exist at least the **all**  object, it will be merged with the current locale object.

```js
// projectDir/components/coolComponent/i18n.json

{
	"all":{
		"greeting": "Hi there",
		"goodbay": "Come back !"
	},
	"ar":{
		"greetings": "Hola, como estas?"
	}
}

```

Templates (template.html)
---------
Receives the model and the config objects from the controller. Also receives the i18n object.
```html
<!-- projectDir/pages/myFirstPage/template.html -->
<h1>{{i18n.greeting}} my name is {{model.name}}</h1>

<span>If this would be a component, this would be the component name: {{config.data-template}} and this would be a the data-lastname attribute of the component tag {{config.data-lastname}}</span>

{{i18n.goodbay}}
```

Gulp
----------
In order to compile view.js and styles.less files into the **public** directory, use the gulp task provided:

```js
var gulp = require('gulp');
var z = require('zetam');

// this create a 'zetam' task
z.gulp(gulp);

gulp.task('default', ['zetam']);
```

After this several task are available, the default task ('zetam') is for development, it compiles an watch.

The is also **zetam-build**, this doesn't watch and minifies/uglifies everything.

```sh
# for dev
gulp 
```


```sh
# for prod
gulp zetam-build
```


Main Controllers (Alternative to Pages)
---------

There is a more basic way to handle URLs: Main controllers

Example: If the request is a GET request to http://localhost:3000/superCoolController the way to handle this is:

```js
// projectDir/controllers/superCoolController.js

exports.get = function(req,res,next){
	res.json({hi:"world"});
}

```
It's basically is a middleware for an specific URL. If would be a Main controller and a Page with the same name , the controller will be loaded.