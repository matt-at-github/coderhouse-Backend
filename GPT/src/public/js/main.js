// Your JavaScript code goes here

// Example: Load a Handlebars template
const templateSource = document.getElementById('example-template').innerHTML;
const template = Handlebars.compile(templateSource);
const context = { name: 'John' };
const html = template(context);

// Append the rendered HTML to the app div
document.getElementById('app').innerHTML = html;
