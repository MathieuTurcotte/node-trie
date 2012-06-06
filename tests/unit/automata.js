/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var Automata = require('../../lib/automata');

var WORDS = ['aient', 'ais', 'ait', 'zoo'],
    MISSING_WORDS = ['ai', 'aie', 'aise', 'zo'];

var EXPECTED_NUM_NODES = 8;

module.exports['Automata'] = {

    setUp: function(callback) {
        this.automaton = new Automata();
        this.automaton.addAll(WORDS);
        callback();
    },

    "contains should return true when words exists": function(test) {
        WORDS.forEach(function(word) {
            test.ok(this.automaton.contains(word));
        }, this);
        test.done();
    },

    "contains should return false when words don't exists": function(test) {
        MISSING_WORDS.forEach(function(word) {
            test.ok(!this.automaton.contains(word));
        }, this);
        test.done();
    },

    "contains should return false for an empty word": function(test) {
        test.ok(!this.automaton.contains(''));
        test.done();
    },

    "child should return nothing if no child match the given letter": function(test) {
        test.ok(!this.automaton.child('b'));
        test.done();
    },

    "child should return the descendent node": function(test) {
        test.ok(this.automaton.child('z'));
        test.done();
    },

    "the letters attribute should return all node's letters": function(test) {
        var letters = this.automaton.letters;
        test.equal(letters.length, 2);
        test.ok(letters.indexOf('a') != -1);
        test.ok(letters.indexOf('z') != -1);
        test.done();
    },

    "getNumNodes should return the number of nodes in the automata": function(test) {
        var numNodes = this.automaton.getNumNodes();
        test.equal(numNodes, EXPECTED_NUM_NODES);
        test.done();
    }
};

