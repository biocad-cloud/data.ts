/// <reference path="../../../build/linq.d.ts" />
console.log('Hello world');
$ts(function () {
    var a = $ts("<p>").display("Hello world!");
    var b = $ts("<p>", { style: "color: red;" }).display("12345");
    $ts("#panel").append(a, b);
    $ts("#panel").append($ts("<span>", { style: "color: green" }).display("TypeScript"));
    $ts("#panel").append([$ts("<span>", { style: "color: blue" }).display("TypeScript"), $ts("<span>", { style: "color: green" }).display("TypeScript 222333")]);
});
//# sourceMappingURL=dom.test.js.map