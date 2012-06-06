#!/usr/bin/env node

/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var assert = require('assert'),
    path = require('path'),
    util = require('util'),
    fs = require('fs');

var Automata = require('../../lib/automata');

var WORDS_FILE = path.join(__dirname, 'data/words.txt'),
    MISSING_WORDS = path.join(__dirname, 'data/missing.txt');

function loadWordsFromFile(filepath) {
    var data = fs.readFileSync(filepath, 'utf8');
    return data.toLowerCase().trim().split('\n');
}

function lookupExistingWords(dict, words) {
    for (var i = 0; i < words.length; i++) {
        assert.ok(dict.contains(words[i]));
    }
}

function lookupMissingWords(dict, words) {
    for (var i = 0; i < words.length; i++) {
        assert.ok(!dict.contains(words[i]));
    }
}

function timeExecution(fn, handler) {
    var start = Date.now();
    fn.call(handler);
    return Date.now() - start;
}

function main() {
    var words = loadWordsFromFile(WORDS_FILE),
        missingWords = loadWordsFromFile(MISSING_WORDS);

    var dict = new Automata();

    util.log(util.format('Populate: %dms', timeExecution(function() {
        dict.addAll(words);
    })));

    util.log(util.format('Nodes   : %d', dict.getNumNodes()));

    util.log(util.format('Lookup existing: %dms', timeExecution(function() {
        lookupExistingWords(dict, words);
    })));

    util.log(util.format('Lookup missing : %dms', timeExecution(function() {
        lookupMissingWords(dict, missingWords);
    })));
};

main();
