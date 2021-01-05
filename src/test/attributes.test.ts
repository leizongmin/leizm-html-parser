import { assert } from "./utils";

describe("Attribute values", function () {
  it("Empty attribute syntax", function () {
    assert("<tag a b hello world />", [
      {
        type: "tag",
        name: "tag",
        properties: {
          a: true,
          b: true,
          hello: true,
          world: true,
        },
      },
    ]);
  });

  it("Unquoted attribute value syntax", function () {
    assert("<input type=image value=yes src=http://example.com title=button>", [
      {
        type: "tag",
        name: "input",
        properties: {
          src: "http://example.com",
          title: "button",
          type: "image",
          value: "yes",
        },
      },
    ]);
  });

  it("Single-quoted attribute value syntax", function () {
    assert("<input type='image' value='yes' src='http://example.com \" space' title='image button'>", [
      {
        type: "tag",
        name: "input",
        properties: {
          src: 'http://example.com " space',
          title: "image button",
          type: "image",
          value: "yes",
        },
      },
    ]);
  });

  it("Double-quoted attribute value syntax", function () {
    assert('<input type="image" value="yes" src="http://example.com \' space" title="image button">', [
      {
        type: "tag",
        name: "input",
        properties: {
          src: "http://example.com ' space",
          title: "image button",
          type: "image",
          value: "yes",
        },
      },
    ]);
  });

  it("Namespace attribute value syntax", function () {
    assert('<svg xlink:href="hello.svg" xlink:title="hello world"></svg>', [
      {
        type: "tag",
        name: "svg",
        properties: {
          "xlink:href": "hello.svg",
          "xlink:title": "hello world",
        },
        children: [],
      },
    ]);
  });

  it("Attribute value includes <>", function () {
    assert('<tag attr="<>" />', [
      {
        type: "tag",
        name: "tag",
        properties: { attr: "<>" },
      },
    ]);
  });

  it("Obnormal attributes", function () {
    assert("<tag abc= cdef />", [
      {
        type: "tag",
        name: "tag",
        properties: { abc: true, cdef: true },
      },
    ]);
    assert('<tag a="1"b="2"></tag>', [
      {
        type: "tag",
        name: "tag",
        properties: { a: "1", b: "2" },
        children: [],
      },
    ]);
    assert('<tag a="1"b="2"/>', [
      {
        type: "tag",
        name: "tag",
        properties: { a: "1", b: "2" },
      },
    ]);
  });
});
