# First time setup:

### Clone this repo:
```
git clone https://github.com/tjk1021/oceexceltopdf
```
### Run following commands:
```
cd oceexceltopdf
```
```
npm install
```
```
bower install
```
```
browserify -r ./main.js:myPDF > bundle.js
```
now you can open index.html file in browser and use.

Note: each time you make changes to the js, run the browserify command:

browserify -r ./main.js:myPDF > bundle.js

This browserifys everything to bundle, but leaves the myPDF module from main.js open to the application.
