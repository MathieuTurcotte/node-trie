/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

/**
 * Represents an automaton node.
 *
 * Children are stored in an array indexed from 0 to 25 as an optimization.
 * Fast letters lookups is ensured by storing them separately.
 */
function Node(id) {
    this.id = id || Node.IdCounter++;
    this.end = false;
    this.letters = [];
    this.children = [];
    this.registered = false;
}

/**
 * Counter used to produce a unique id for each node.
 */
Node.IdCounter = 0;

/**
 * Add a child for this transition.
 *
 * @param letter Child's transition letter.
 * @return The added node.
 */
Node.prototype.addChild = function(letter) {
    return this.child(letter) || this.addChild_(letter);
};

/**
 * Helper method to perform the actual child insertion.
 *
 * @param letter Child's transition letter.
 * @return The added node.
 */
Node.prototype.addChild_ = function(letter) {
    var node = new Node(),
        index = this.childIndex(letter);
    this.children[index] = node;
    this.letters.push(letter);
    return node;
};

/**
 * Check if a child exists for this path.
 *
 * @param letter Child's transition letter.
 * @return True if a child exists for this path.
 */
Node.prototype.hasChild = function(letter) {
    return !!this.child(letter);
};

/**
 * @return True if this node has at least on child.
 */
Node.prototype.hasChildren = function() {
    return this.letters.length > 0;
};

/**
 * Retrieve the child associated to this transition.
 *
 * @param letter Child's transition letter.
 * @return The child node if any.
 */
Node.prototype.child = function(letter) {
    var index = this.childIndex(letter);
    return this.children[index];
};

/**
 * Get the index for this letter in the children list.
 * Note that this function assumes an ASCII character set.
 * Could easily be generalized: http://mzl.la/LoNWgA
 *
 * @param letter The letter to check.
 * @return The letter's index in the children array.
 */
Node.prototype.childIndex = function(letter) {
    return letter.charCodeAt(0) - 'a'.charCodeAt(0);
};

/**
 * Retrieve the last inserted child.
 *
 * @return The last inserted child based on the transition label.
 */
Node.prototype.lastChild = function() {
    return this.children[this.lastChildIndex()];
};

/**
 * Replace the last child with the given node.
 *
 * @param node The replacement node.
 */
Node.prototype.setLastChild = function(node) {
    this.children[this.lastChildIndex()] = node;
};

/**
 * @return The index of the last inserted child and undefined
 *         if this node has no children.
 */
Node.prototype.lastChildIndex = function() {
    for (var i = this.children.length - 1; i >= 0; i--) {
        if (this.children[i]) {
            return i;
        }
    }
};

/**
 * Check if 'word' path exists from this node.
 *
 * @param word The path to follow.
 * @return True if a path exists.
 */
Node.prototype.pathExists = function(word) {
    for (var i = 0, node = this; i < word.length; i++) {
        node = node.child(word[i]);
        if (!node) {
            return false;
        }
    }
    return node.isTerminal();
};

/**
 * Mark this node as terminal.
 */
Node.prototype.markTerminal = function() {
    this.end = true;
};

/**
 * Check if this node is terminal.
 *
 * @return True if this node is terminal.
 */
Node.prototype.isTerminal = function() {
    return this.end;
};

/**
 * Mark this node as registered.
 * Used during the automata's construction.
 */
Node.prototype.markRegistered = function() {
    this.registered = true;
};

/**
 * Check if this node has been registered.
 * Used during the automata's construction.
 *
 * @return True is this node has been registered.
 */
Node.prototype.isRegistered = function() {
    return this.registered;
};

/**
 * Replace or register last node.
 *
 * @param register The node registry.
 */
Node.prototype.replaceOrRegister = function(register) {
    var child = this.lastChild(), q;

    if (child.isRegistered()) {
        return;
    }

    if (child.hasChildren()) {
        child.replaceOrRegister(register);
    }

    if (q = register.find(child)) {
        this.setLastChild(q);
    } else {
        register.add(child);
        child.markRegistered();
    }
};

/**
 * Obtain a string representing the equivalence class for this node, knowing
 * that two states p and q belongs to the same class if and only if:
 *  1. they are either both final or both nonfinal; and
 *  2. they have the same number of outgoing transitions; and
 *  3. corresponding outgoing transitions have the same labels; and
 *  4. corresponding transitions lead to the same states.
 *
 * @return The equivalence class.
 */
Node.prototype.getClass = function() {
    var id = this.isTerminal() ? ['$'] : [],
        length = this.letters.length;
    for (var i = 0; i < length; i++) {
        id.push(this.letters[i]);
        id.push(this.child(this.letters[i]).id);
    }
    return id.join('');
};

module.exports = Node;

