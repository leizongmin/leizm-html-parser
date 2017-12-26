import { assert } from "./utils";

describe("Attribute values", function() {
  it("Empty attribute syntax", function() {
    assert("<tag a b hello world />", [
      {
        tagName: "tag",
        properties: {
          a: true,
          b: true,
          hello: true,
          world: true
        }
      }
    ]);
  });

  it("Unquoted attribute value syntax", function() {
    assert("<input type=image value=yes src=http://example.com title=button>", [
      {
        tagName: "input",
        properties: {
          src: "http://example.com",
          title: "button",
          type: "image",
          value: "yes"
        }
      }
    ]);
  });

  it("Single-quoted attribute value syntax", function() {
    assert(
      "<input type='image' value='yes' src='http://example.com \" space' title='image button'>",
      [
        {
          tagName: "input",
          properties: {
            src: 'http://example.com " space',
            title: "image button",
            type: "image",
            value: "yes"
          }
        }
      ]
    );
  });

  it("Double-quoted attribute value syntax", function() {
    assert(
      '<input type="image" value="yes" src="http://example.com \' space" title="image button">',
      [
        {
          tagName: "input",
          properties: {
            src: "http://example.com ' space",
            title: "image button",
            type: "image",
            value: "yes"
          }
        }
      ]
    );
  });

  it("Namespace attribute value syntax", function() {
    assert('<svg xlink:href="hello.svg" xlink:title="hello world"></svg>', [
      {
        tagName: "svg",
        properties: {
          "xlink:href": "hello.svg",
          "xlink:title": "hello world"
        },
        children: []
      }
    ]);
  });

  it("Attribute value includes <>", function() {
    assert('<tag attr="<>" />', [
      {
        tagName: "tag",
        properties: { attr: "<>" }
      }
    ]);
  });
});
