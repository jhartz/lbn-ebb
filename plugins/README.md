# Plugin File Readme

These files are referenced by the LBN Electronic Bulletin Board if they are listed in `plugins.js` in the root directory. When executed, the plugin file should append a JavaScript object to an array `ebb.plugins`. This object, called a *plugin definition* below, should have these properties:

- `name` (required) - string - a name for the plugin; must be unique
- `description` (optional) - string - a description for the plugin that is used in place of the plugin's content in the preview on the control page
- `content` (required) - the HTML of the content (see "Defining Slide Content" below)
- `className` (optional) - string - any extra CSS classes to apply to the slide(s) for this plugin
- `position` (optional) - string - a custom position in the 3D space that holds the slides in the presentation; only define this if you know what you're doing! (example in `title.js` and `datetime.js`)
- `noborder` (optional) - boolean - if true, the slide will not have the background and border that makes it look like a slide
- `options` (optional) - array - an array of objects in which each object defines a customizable option for the plugin (see "Plugin Options" below)
- `update`, `update_interval` (optional) - see "Content-Updating Plugins" below

## Defining Slide Content

The value of `content` in a plugin definition can have two possible syntaxes:

- an array in which each string in the array defines a slide
- an object with the following properties:
    - `template` - a generic HTML template for the slides
    - `variable` - the name of a variable (from `options`) that contains the content for the slides; a new slide is created for each double line break in the content of this variable

## Content-Updating Plugins

Any plugin that wishes to have its content updated automatically on an interval should define two properties in the plugin definition:

- `update` - a function to update the plugin
- `update_interval` - the number of milliseconds between updates

The `update` function should call `ebb.send_update(data)` where `data` is an array in which each member is an object that defines updates to a specific HTML element. `data` should have the following properties:

- `className` (required) - string - the class name of the HTML element inside the plugin's content to update (standard convention is to use something like "PLUGIN_pluginname_elementname")
- `useParent` (optional) - boolean - if true, update the parent of the element instead of the element itself
- `html` (optional) - string - new HTML content of the element
- `text` (optional) - string - new text content of the element (any HTML is escaped)
- `attributes` (optional) - object - HTML attributes to change on the element
- `style` (optional) - object - CSS styles to change on the element

The `update` function is called with one argument, which is an object that contains the values for each of the plugin's options.

## Plugin Options

The value of `options` in a plugin definition is an array of objects. Each object in this array defines one option for the plugin. It should have the following properties:

- `name` (required) - string - the name of the option
- `type` (required) - string - the type of option (see below)
- `variable` (optional) - string - a variable that can be used in `content` (in the plugin definition) that will be replaced with the value of the option
- `value` (optional) - string - the default value of the option (if not specified, default values for specific types are in `ebb.options.js`)

The value of `type` must be one of the following:

- `bool` - checkbox (value is true or false)
- `text` - one-line textbox (shown as entered, all HTML is escaped)
- `textarea` - multi-line textarea (shown as entered, all HTML is escaped)
- `filteredtextarea` - multi-line textarea (input filtered - see filter code in util.js)
- `html` - multi-line textarea (HTML not escaped)

To use the values for these options, include an option's variable in the plugin definiton's `content` or use the object passed to the `update` function in the plugin's definition.