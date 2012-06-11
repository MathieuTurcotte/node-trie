/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var Automaton = require('../../lib/automaton');

var WORDS = ['aient', 'ais', 'ait', 'zoo'],
    MISSING_WORDS = ['ai', 'aie', 'aise', 'zo'];

var EXPECTED_NUM_NODES = 8;

module.exports['Automaton'] = {

    setUp: function(callback) {
        this.automaton = new Automaton();
        this.automaton.populate(WORDS);
        callback();
    },

    "populating from an empty list should throw an error": function(test) {
        var automaton = new Automaton();
        test.throws(function() {
            automaton.populate([]);
        });
        test.done();
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

    "getSize should return the number of nodes in the automaton": function(test) {
        var numNodes = this.automaton.getSize();
        test.equal(numNodes, EXPECTED_NUM_NODES);
        test.done();
    }
};

