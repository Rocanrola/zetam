Zetam
-----
Zetam is a middleware for express that makes frontend development easy. It's based on two basic concepts: Pages and Components

Install
-----------

```sh
npm install zetam
```

Pages & Components
----------
Pages and components are pretty the same thing. The main difference is the use. Pages are better for layouts with just few logic. In the other hand, components are very useful for complex and reusable logic pieces ("widgets"). Both have the same structure:

 - **controller.js** Server side logic. Defines the model to be passed to the template
 - **template.html** Mustache template, receives model, i18n and config objects
 - **i18n.json** 
 - **view.js** Client side logic (Common JS module by Browserify - http://browserify.org/)
 - **styles.less** CSS styles by less

View.js and styles.less are compiled by a gulp task. (http://gulpjs.com/) 

Middleware
----------
In order to use zetam, just plug the middleware into your Express project (http://expressjs.com/)

```js
var express = require('express');
var app = express();
var z = require('zetam');

app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

// the potato
app.use(z.middleware);

app.listen(3000,function () {
	console.log('running on port ' + port);
});
```

Pages
----------
Pages are automatically loaded by zetam middleware. Just create a page folder inside the **pages** directory.

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

projectDir

Components
----------
Components are loaded using an HTML tag inside any page template with the **data-component** attribute.

```html
<!-- projectDir/pages/myFirstPage/template.html -->
<h1>A title</h1>
<div data-component="coolComponent" data-lastname="Smith"></div>
```
 - projectDir
	 - components
		 - coolComponent
			 - controller.js
			 - template.html
			 - i18n.json
			 - view.js
			 - styles.less

Controllers
----------

Pages and components has controllers to set the model to be passed to the template. In the case of Pages the method to be executed is the http verb used to request the page.

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
	cb(null,{
		model:{
			name:'John',
			lastname:config['data-lastname']
		}
	});
}

```

Templates
---------
Receives the model and the config objects from the controller. Also receives the i18n object.
```html
<!-- projectDir/pages/myFirstPage/template.html -->
<h1>Hi my name is {{model.name}}</h1>

<span>If this would be a component, this would be the component name: {{config.data-template}} and this would be a the data-lastname attribute of the component tag {{config.data-lastname}}</span>
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
