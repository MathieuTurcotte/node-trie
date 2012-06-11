/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var path = require('path'),
    fs = require('fs');

var dtrie = require('../../index');

var WORDS = ['aient', 'ais', 'ait', 'zoo'],
    FILEPATH = path.join(__dirname, 'dict.txt');

module.exports['dtrie'] = {

    "loadFromFile should instantiate/populate a trie from a file": function(test) {
        var trie = dtrie.loadFromFile(FILEPATH);
        test.ok(trie.contains('aient'));
        test.done();
    },

    "createFromWords should instantiate/populate a trie from a list of words": function(test) {
        var trie = dtrie.createFromWords(WORDS);
        test.ok(trie.contains('aient'));
        test.done();
    }
};

