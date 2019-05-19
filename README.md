# select-posts-dropdown
A react component for listing and selecting wordpress posts using wp-api 

SelectPostsDropdown is a React component to render a dropdown that will be populated with the posts, of the type specificed, and allows the user to search through items. This components takes care of updating the state of the dropdown menu
and uses render props to fetch and then load the posts listed by title.

## Install
```bash
  yarn install select-posts-dropdown
```

## Usage


```jsx
import SelectPostsDropdown from 'select-posts-dropdown';

const PostDropdown = () => (
  <SelectPostsDropdown
    onChange={ ( { id, title } ) => {
      console.log( 'post selected', { id, title } )
    } }
  />
);
```

## Props

The component accepts the following props. Props not included in this set will be applied to the element wrapping Popover content.

### className

className of the outermost container

- Type: `String`
- Required: No

### onChange

A callback invoked when a selection is made on the dropdown menu.

- Type: `Function`
- Required: Yes

The first argument of the callback is an object containing the following properties:

 - `title`: The title of the post
 - `id`: The ID of the post

### options

The values to load on initial render. These options will be replaced when the api call returns with data.

 - Type: `Array`
 - Required: No

### placeholder

The text to place into the dropdown on it's initial state when no selection is active

- Type: `String`
- Required: No

### saveToWpData

If `Boolean` :: true, whenever a request is made from the wp-api the resulting posts are saving in a window object `window.wpData.[postType]`

If `string` :: !empty, resulting posts data is saved to the window under this name (eg: `data` == window.data)

- Type: `Boolean` or `string`
- Required: No
- Default: `true`

### selectedValue

The value to set the dropdown to after render.

- Type: `String`
- Required: No

### heading

Some text to place above the dropdown, if left empty no text will appear.

- Type: `string`
- Required: No

### limit

For a multiple selection dropdown, limit to only this number of selected items

- Type: `number`
- Required: No

## License & Attribution

GPL3 © [Ken Eucker](http://keneucker.com/).

This project is inspired by the hard work of everyone at Auttomatic and their dedication to open source software.


