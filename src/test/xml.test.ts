import { assert } from "./utils";

describe("XML document", function () {
  it("Normal XML", function () {
    assert(
      `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:ev="http://purl.org/rss/1.0/modules/event/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:taxo="http://purl.org/rss/1.0/modules/taxonomy/" xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:syn="http://purl.org/rss/1.0/modules/syndication/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:admin="http://webns.net/mvcb/">
  <channel rdf:about="https://github.com/fb55/htmlparser2/">
    <title><![CDATA[A title to parse and remember]]></title>
    <link>https://github.com/fb55/htmlparser2/</link>
    <items>
      <rdf:Seq>
        <rdf:li rdf:resource="http://somefakesite/path/to/something.html" />
      </rdf:Seq>
    </items>
  </channel>
  <item rdf:about="http://somefakesite/path/to/something.html">
    <dc:type>text</dc:type>
    <dcterms:issued>2011-11-04T09:34:54-07:00</dcterms:issued>
  </item>
</rdf:RDF>`,
      [
        {
          type: "tag",
          name: "?xml",
          properties: { version: "1.0", encoding: "UTF-8" },
        },
        { type: "text", text: "\n" },
        {
          type: "tag",
          name: "rdf:RDF",
          properties: {
            "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            xmlns: "http://purl.org/rss/1.0/",
            "xmlns:ev": "http://purl.org/rss/1.0/modules/event/",
            "xmlns:content": "http://purl.org/rss/1.0/modules/content/",
            "xmlns:taxo": "http://purl.org/rss/1.0/modules/taxonomy/",
            "xmlns:dc": "http://purl.org/dc/elements/1.1/",
            "xmlns:syn": "http://purl.org/rss/1.0/modules/syndication/",
            "xmlns:dcterms": "http://purl.org/dc/terms/",
            "xmlns:admin": "http://webns.net/mvcb/",
          },
          children: [
            { type: "text", text: "\n  " },
            {
              type: "tag",
              name: "channel",
              properties: {
                "rdf:about": "https://github.com/fb55/htmlparser2/",
              },
              children: [
                { type: "text", text: "\n    " },
                {
                  type: "tag",
                  name: "title",
                  children: [
                    {
                      type: "tag",
                      name: "![CDATA[",
                      children: [{ type: "text", text: "A title to parse and remember" }],
                    },
                  ],
                },
                { type: "text", text: "\n    " },
                {
                  type: "tag",
                  name: "link",
                  children: [
                    {
                      type: "text",
                      text: "https://github.com/fb55/htmlparser2/",
                    },
                  ],
                },
                { type: "text", text: "\n    " },
                {
                  type: "tag",
                  name: "items",
                  children: [
                    { type: "text", text: "\n      " },
                    {
                      type: "tag",
                      name: "rdf:Seq",
                      children: [
                        { type: "text", text: "\n        " },
                        {
                          type: "tag",
                          name: "rdf:li",
                          properties: {
                            "rdf:resource": "http://somefakesite/path/to/something.html",
                          },
                        },
                        { type: "text", text: "\n      " },
                      ],
                    },
                    { type: "text", text: "\n    " },
                  ],
                },
                { type: "text", text: "\n  " },
              ],
            },
            { type: "text", text: "\n  " },
            {
              type: "tag",
              name: "item",
              properties: {
                "rdf:about": "http://somefakesite/path/to/something.html",
              },
              children: [
                { type: "text", text: "\n    " },
                {
                  type: "tag",
                  name: "dc:type",
                  children: [{ type: "text", text: "text" }],
                },
                { type: "text", text: "\n    " },
                {
                  type: "tag",
                  name: "dcterms:issued",
                  children: [{ type: "text", text: "2011-11-04T09:34:54-07:00" }],
                },
                { type: "text", text: "\n  " },
              ],
            },
            { type: "text", text: "\n" },
          ],
        },
      ],
    );
  });

  it("on HTML mode, <link> is void tag", function () {
    assert("<link>hello</link>", [
      { type: "tag", name: "link" },
      { type: "text", text: "hello" },
    ]);
  });

  it("on XML mode, <link> contains body", function () {
    assert(
      "<link>hello</link>",
      [
        {
          type: "tag",
          name: "link",
          children: [{ type: "text", text: "hello" }],
        },
      ],
      {
        xmlMode: true,
      },
    );
  });
});
