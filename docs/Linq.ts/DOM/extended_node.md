# Extended Html Element

All of the html element that query by id or created from the ``$ts`` static symbol function is an extended html node element. For view the element interface of this extended html node element, please read this source file: [HTMLExtensions](https://github.com/biocad-cloud/data.ts/blob/master/Linq.ts/DOM/Extensions/Abstract.ts)

## Extended Chainning

There is a great programming feature in .NET framework is the extension method, by tagged a ``<Extension>`` custom attribute onto the function declaration, then you can make a pipeline code chaining in VisualBasic.NET programming. Although there is no such ``<Extension>`` attribute in typescript programming, but the Linq.js library try to provides the simulation of this pipeline chainning style programming feature in html node operator.

As we've mention above, by invoke the ``$ts`` static symbol function, you will get a extended html element node after get element by id or create new node operation, so that here is some operation that you can pipeline your code in a caller chaining:

