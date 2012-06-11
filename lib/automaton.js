/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var util = require('util');

var Register = require('./register'),
    Node = require('./node');

/**
 * Deterministic acyclic finite-state automaton (DAFSA).
 *
 * Implementation based on "Incremental Construction of Minimal Acyclic
 * Finite-State Automata" by Jan Daciuk, Stoyan Mihov, Bruce W. Watson and
 * Richard E. Watson.
 */
function Automaton() {
    Node.call(this);
}
util.inherits(Automaton, Node);

/**
 * Populate the automaton from a sorted list of lowercase words.
 * This method should be called exactly once for a given instance.
 *
 * @param words A sorted list of words.
 */
Automaton.prototype.populate = function(words) {
    if (!words || !words.length) {
        throw new Error('Populate from empty list.');
    }
    var register = new Register();
    for (var i = 0; i < words.length; i++) {
        this.insert_(words[i], register);
    }
    this.replaceOrRegister(register);
};

/**
 * Add an entry in the automaton.
 *
 * @param word The word to add.
 * @param register The node register.
 */
Automaton.prototype.insert_ = function(word, register) {
    if (!word.length) {
        return;
    }

    var letters = word.split(''),
        node = null,
        last = this,
        letter;

    // Find last common state.
    while ((letter = letters.shift()) &&
           (node = last.getChild(letter))) {
        last = node;
    }

    // Minimize.
    if (last.hasChildren()) {
        last.replaceOrRegister(register);
    }

    // Add suffix.
    while (letter) {
        last = last.addChild(letter);
        letter = letters.shift();
    }

    last.markTerminal();
};

/**
 * Check if the given word is accepted by the automaton.
 *
 * @param word The word to check.
 */
Automaton.prototype.contains = function(word) {
    return this.accepts(word);
};

/**
 * Get the number of nodes in the automaton.
 *
 * @return The number of nodes in the automaton.
 */
Automaton.prototype.getSize = function() {
    var ids = this.collectIds_();
    return this.countIds_(ids);
};

/**
 * Collect nodes' id.
 *
 * @return A sorted list of node's ids (with duplicate).
 */
Automaton.prototype.collectIds_ = function() {
    var ids = [],
        queue = [],
        node = this;

    do {
        ids.push(node.id);
        for (var i = 0; i < node.letters.length; i++) {
            queue.push(node.getChild(node.letters[i]));
        }
    } while (node = queue.pop());

    return ids.sort();
};

/**
 * Count nodes' id, skipping duplicates.
 *
 * @param ids A sorted array of ids.
 * @return The number of unique id.
 */
Automaton.prototype.countIds_ = function(ids) {
    var count = 0;

    for (var i = 0; i < ids.length; i++, count++) {
        while (ids[i] == ids[i + 1]) {
            i++; // Skip duplicate.
        }
    }

    return count;
};

module.exports = Automaton;

