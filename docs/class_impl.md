# Class implementation in WebAssembly

WebAssembly only have 4 primitive type that available to its users. The class object in VisualBasic is an kind of advance type

## Class memory structure

The class object for VisualBasic compiles into WebAssembly is a kind of memory pointer, the class object instance its memory layout in WebAssembly runtime looks like:

```R
# class definition
class_id parent_class_id 

# object instance
i32       byte varient  byte varient  byte varient
class_id (flag slot1)  (flag slot2)  (flag slot3) ...
```

Here is the details about the memory layout:

+ ``class_id`` (i32) The class object its hash id in generated webassembly, so if two object instance its ``class_id`` value equals to each other, that means they have the exactly identical type definition. Comparison between the class_id is equivalent to type comparison in VisualBasic: ``a.GetType() Is b.GetType()``
+ ``flag`` (byte) The field/property data type flag: (0) byte, (1) i32, (2) i64, (3) f32, (4) f64 and (5) reference
+ ``slot`` 