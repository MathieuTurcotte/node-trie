/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var util = require('util');

var Register = require('./register'),
    Node = require('./node');

/**
 * Deterministic acyclic finite-state automata (DAFSA).
 *
 * Implementation based on "Incremental Construction of Minimal Acyclic
 * Finite-State Automata" by Jan Daciuk, Stoyan Mihov, Bruce W. Watson and
 * Richard E. Watson.
 */
function Automata() {
    Node.call(this);
}
util.inherits(Automata, Node);

/**
 * Populate the automata from a sorted list of lowercase words.
 * This method should be called exactly once for a given instance.
 *
 * @param words A sorted list of words.
 */
Automata.prototype.addAll = function(words) {
    var register = new Register();
    for (var i = 0; i < words.length; i++) {
        this.add_(words[i], register);
    }
    this.replaceOrRegister(register);
};

/**
 * Add an entry in the automata.
 *
 * @param word The word to add.
 * @param register The node register.
 */
Automata.prototype.add_ = function(word, register) {
    if (!word.length) {
        return;
    }

    var letters = word.split(''),
        node = null,
        last = this,
        letter;

    // Find last common state.
    while ((letter = letters.shift()) &&
           (node = last.child(letter))) {
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
 * Check if the given word is accepted by the automata.
 *
 * @param word The word to check.
 */
Automata.prototype.contains = function(word) {
    return this.pathExists(word);
};

/**
 * Get the number of nodes in the automata.
 *
 * @return The number of nodes in the automata.
 */
Automata.prototype.getNumNodes = function() {
    var i = 0,
        ids = [],
        queue = [],
        node = this,
        numNodes = 0;

    // Following transitions recursively, collect ids from
    // all reachable nodes. Duplicate ids will be collected.
    do {
        ids.push(node.id);
        for (i = 0; i < node.children.length; i++) {
            if (node.children[i]) {
                queue.push(node.children[i]);
            }
        }
    } while (node = queue.pop());

    ids.sort();

    // Count ids, skipping duplicate entries.
    for (i = 0; i < ids.length; i++) {
        numNodes++;
        while (ids[i] == ids[i + 1]) {
            i++;
        }
    }

    return numNodes;
};

module.exports = Automata;

