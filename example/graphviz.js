#!/usr/bin/env node

/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var dtrie = require('../index');

var WORDS = [
    'ai',
    'aient',
    'aime',
    'aimer',
    'ais',
    'ait',
];

function collectTerminalIds(automata) {
    var ids = [],
        nodes = [automata],
        terminals = {},
        node;

    while (node = nodes.pop()) {
        if (node.isTerminal()) {
            terminals[node.id] = true;
        }
        node.letters.forEach(function(letter) {
            nodes.push(node.getChild(letter));
        });
    }

    for (var id in terminals) {
        ids.push(id);
    }

    return ids;
};

function getGraphvizSource(automata, stream) {
    var nodes = [automata], node;

    stream.write('digraph dtrie_dafsa {\n');

    stream.write('    rankdir=LR;\n');
    stream.write('    node [shape = doublecircle];');
    collectTerminalIds(automata).forEach(function(id) {
        stream.write(' ' + id);
    });
    stream.write(';\n');
    stream.write('    node [shape = circle];\n');

    while (node = nodes.pop()) {
        node.letters.forEach(function(letter) {
            var child = node.getChild(letter);
            stream.write('    ' + node.id + ' -> ' + child.id + ' [label="' + letter + '"];\n');
            nodes.push(child);
        });
    }

    stream.write('}\n');
};

var trie = dtrie.createFromWords(WORDS);
getGraphvizSource(trie, process.stdout);

