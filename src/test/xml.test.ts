import { assert } from "./utils";

describe("XML document", function() {
  it("Normal XML", function() {
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
          tagName: "?xml",
          properties: { version: "1.0", encoding: "UTF-8" }
        },
        "\n",
        {
          tagName: "rdf:RDF",
          properties: {
            "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            xmlns: "http://purl.org/rss/1.0/",
            "xmlns:ev": "http://purl.org/rss/1.0/modules/event/",
            "xmlns:content": "http://purl.org/rss/1.0/modules/content/",
            "xmlns:taxo": "http://purl.org/rss/1.0/modules/taxonomy/",
            "xmlns:dc": "http://purl.org/dc/elements/1.1/",
            "xmlns:syn": "http://purl.org/rss/1.0/modules/syndication/",
            "xmlns:dcterms": "http://purl.org/dc/terms/",
            "xmlns:admin": "http://webns.net/mvcb/"
          },
          children: [
            "\n  ",
            {
              tagName: "channel",
              properties: {
                "rdf:about": "https://github.com/fb55/htmlparser2/"
              },
              children: [
                "\n    ",
                {
                  tagName: "title",
                  children: [
                    {
                      tagName: "![CDATA[",
                      children: ["A title to parse and remember"]
                    }
                  ]
                },
                "\n    ",
                {
                  tagName: "link",
                  children: ["https://github.com/fb55/htmlparser2/"]
                },
                "\n    ",
                {
                  tagName: "items",
                  children: [
                    "\n      ",
                    {
                      tagName: "rdf:Seq",
                      children: [
                        "\n        ",
                        {
                          tagName: "rdf:li",
                          properties: {
                            "rdf:resource":
                              "http://somefakesite/path/to/something.html"
                          }
                        },
                        "\n      "
                      ]
                    },
                    "\n    "
                  ]
                },
                "\n  "
              ]
            },
            "\n  ",
            {
              tagName: "item",
              properties: {
                "rdf:about": "http://somefakesite/path/to/something.html"
              },
              children: [
                "\n    ",
                {
                  tagName: "dc:type",
                  children: ["text"]
                },
                "\n    ",
                {
                  tagName: "dcterms:issued",
                  children: ["2011-11-04T09:34:54-07:00"]
                },
                "\n  "
              ]
            },
            "\n"
          ]
        }
      ]
    );
  });

  it("on HTML mode, <link> is void tag", function() {
    assert("<link>hello</link>", [{ tagName: "link" }, "hello"]);
  });

  it("on XML mode, <link> contains body", function() {
    assert(
      "<link>hello</link>",
      [
        {
          tagName: "link",
          children: ["hello"]
        }
      ],
      {
        xml: true
      }
    );
  });
});
