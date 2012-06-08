# Trie implementation based on a Minimal Acyclic Finite-State Automata for Node.js

Trie implementation based on a Minimal Acyclic Finite-State Automata for
Node.js.

Implementation based on "Incremental Construction of Minimal Acyclic
Finite-State Automata" by Jan Daciuk, Stoyan Mihov, Bruce W. Watson and
Richard E. Watson.

## Installation

```
npm install dtrie
```

## Usage

Basic dictionary usage:

```js
var dtrie = require('dtrie');

var trie = dtrie.createFromWords(['ai', 'aient', 'aime', 'aimer']);

assert.ok(trie.contains('ai'));
assert.ok(!trie.contains('aimerait'));
```

## API

### dtrie.loadFromFile(filepath)

- filepath: path to dictionary (one word per line, unix eol)

Construct a dictionary from a file.

### dtrie.createFromWords(words)

- words: a list of lowercase words

Construct a dictionary from a list of words.

### Class Node

#### new Node([id])

- id: overwrite the generated id

Construct a new node.

#### node.id

Node's id, unique to each node.

#### node.letters

Node's transitions.

#### node.hasChild(letter)

- letter: transition label

Return true if this node has a child for the given transition.

#### node.child(letter)

- letter: transition label

Return the node child.

#### node.pathExists(suffix)

- suffix: a suffix to check

Check if this node recognize the given suffix.

#### node.isTerminal()

Return true if the current node is a terminal node.

### Class Automata

This class is a subclass of Node.

#### new Automata()

Construct a new automata.

#### automata.addAll(words)

- words: an alphabetically sorted list of lowercase words

Populate the automata from an alphabetically sorted list of lowercase
words. This method should only be called once per automata. Words must
contain letters within range [a-z].

#### automata.contains(word)

- word: the word to lookup

Return true if the automata recognize the given word.

#### automata.getNumNodes()

Return the number of nodes in the automata.

## License

This code is free to use under the terms of the [MIT license](http://mturcotte.mit-license.org/).
