# DOM query

The DOM query operation in Linq.js library is consist with 3 kinds of expression:

## Get by id and get by class

## Get by CSS selector

The css selector is works based on the ``context.querySelectorAll`` or the ``document.querySelector``, which accept the css query text and then given a set of node collection of a single node element.

> The ``context`` object could be a html ``Document`` object or a specific ``HTMLElement`` for limits the value range.

Apply a CSS node element selectin is keeps the same as select by class id, query through the ``$ts.select`` symbol function is recommended. Example as:

```ts
// selector will returns a collection of html link element with https url
let links: DOMEnumerator<HTMLAnchorElement> = $ts.select('a[src^="https"]');
```

### Query meta tag value

There is a kind of special css query in ``Linq.js`` framework: query the &lt;meta> tag value via expression syntax ``@tag_name``. For an instance example, there is a meta tag which is named ``app`` in your html file:

```html
<meta name="app" content="The_App_Name" />
```

Then you can get the string content value of the ``app`` meta tag with the query like:

```ts
let app: string = <any>$ts("@app");

// will print content string in your developer console: The_App_Name
console.log(app);
```

The query of the meta tag value is special when compares it with other css selector operation in Linq.js library, as it is recommended that query through ``$ts`` static symbol directory, not recommended from the ``$ts.select`` symbol function. The query expression result of the meta tag value is not a html element node but a single string value, and its query expression syntax is not a valid css query syntax.

For implements the meta tag value query in ``$ts`` static symbol function, the ``Linq.js`` library first trim the ``@`` character get the meta tag name attribute value, and then create a new css query expression in example as ``meta[name~="${name}"]``. So that the meta tag value query is still a css query operation in Linq.js library.

## Create new node



