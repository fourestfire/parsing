function HTMLParser() {
  // Variables shared by the parsing functions
  // to keep track of the data
  var pos = 0,
    input = '';

  // Used in your parser to throw errors
  var assert = function(condition) {
    if (!condition) {
      throw new Error("test failed");
    }
  }

  function parse(html) {
    pos = 0;
    input = html;

    var nodes = parseNodes();

    // wrap nodes in HTML if not a single root node
    if (nodes.length === 1) {
      return nodes[0];
    } else {
      return new ElementNode('html', [], nodes);
    }
  }

  // parse a sequence of sibling nodes
  function parseNodes() {
    var nodes = [];
    for(var i=0; i< 100; i++) {
      consumeWhiteSpace();
      if (eof() === true || startsWith('</') === true) {
        break;
      }

      nodes.push(parseNode());
    }
    return nodes;
  }

  // Step 1:
  // Parse a single node, either an element or text node
  function parseNode() {
    // if the first char is a <, parse an Element
    if (nextChar() === '<') {
      // debugger;
      return parseElement();
      // debugger;
    } else {
      return parseText();
    }
    // else parseText
  }


  // Step 2:
  // Parse a single element tag
  function parseElement() {
    // check that we're starting with a <
    assert(consumeChar() === '<');

    // parseTagName
    var tagName = parseTagName();

    // TODO: parseAttributes
    var attrs = parseAttributes();

    // check that we've got an end >
    //
    // <div class="MyClass"><h1>adsfs</h1>aflsdajkflsjdfkldjfkladsf</div>
    assert(consumeChar() === '>');

    // TODO: Parse all it's children Nodes (using parseNodes)
    var children = parseNodes();
    // debugger;

    // check that we have a matching end tag
    // and that the tag is the same
    // hint:
    //   use parseTagName to get the tagName and match it to the previous one
    assert(consumeChar() === '<');
    assert(consumeChar() === '/');
    assert(parseTagName() === tagName);
    assert(consumeChar() === '>');

    return new ElementNode(tagName, attrs, children);
  }

  // this will return the tagName as a String
  function parseTagName() {
    function isTagNameChar(str) {
      var nextChar = str.charAt(0);
      return /[A-Za-z0-9]/.test(nextChar);
    }

    return consumeWhile(isTagNameChar);
  }

  // Step 3: Parse a set of attributes inside the element
  // e.g. class="my-class" id="testId"
  // Hint:
  // - You have continue parsing until you find the >
  // - Consume White Space until you find an Attribute
  //
  // attributes = attr*
  function parseAttributes() {
    var attributes = {};
    // PARSE ATTRIBUTES
    while (nextChar() !== '>') {
      consumeWhiteSpace();
      var attr = parseAttribute();  // { name: 'name' value: 'value' }
      attributes[attr.name] = attr.value;
      consumeWhiteSpace();
    }
    return attributes;
  }

  // Step 4: Parse a single attribute assignment
  // e.g. class="myClass"
  function parseAttribute() {
    var name = '', value;

    while (nextChar() !== '=') {
        name += consumeChar();
    }

    consumeChar(); // eat '='

    //  "myClass"
    value = parseAttributeValue();

    return {
      name: name,
      value: value
    };
  }


  // Step 5: Parse a Quoted Value "myClass"
  // class="sectionTitle slider-image"
  function parseAttributeValue() {
    // check for a quote
    // similar to parseTagName - get everything that's not an end-quote: "
    // check for end quote
    var value = '';
    assert(consumeChar() === '"');

    while (nextChar() !== '"') {
      value += consumeChar();
    }

    assert(consumeChar() === '"');

    return value;
  }

  /*
    Consume text and create a TextNode
   */
  function parseText() {
    var innerText = consumeWhile(isTextChar);
    return new TextNode(innerText);
  }


  // Given Utility Functions for your Parser
  // These should be pretty clear

  //returns bool: is character not '<'
  function isTextChar(c) {
    return c !== '<';
  }

  function consumeWhiteSpace() {
    consumeWhile(isWhiteSpace);
  }

  function isWhiteSpace(c) {
    return c === ' ' || c === '\n';
  }

//return result: takes function that returns bool, which returns result
  function consumeWhile(testFn) {
    var result = '';

    while (!eof() && testFn(nextChar())) {
      result += consumeChar();
    }
    return result;
  }

//returns character at current position and increments after returning
  function consumeChar() {
    return input.charAt(pos++);
  }

//returns character at current position
  function nextChar() {
    return input.charAt(pos);
  }

//returns bool: if string is at start of current position
  function startsWith(str) {
    return input.substr(pos).indexOf(str) === 0;
  }

//returns bool: index of end of file is greater than or equal to input length
  function eof() {
    return pos >= input.length;
  }

  return {
    parse: parse
  }

}
