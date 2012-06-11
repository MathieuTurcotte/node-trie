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
    this.end_ = false;
    this.letters = [];
    this.children_ = [];
    this.registered_ = false;
}

/**
 * Counter used to generate a unique id for each node.
 */
Node.IdCounter = 0;

/**
 * Add a child for this transition.
 *
 * @param letter Child's transition letter.
 * @param id Child's id.
 * @return The added node.
 */
Node.prototype.addChild = function(letter, id) {
    return this.getChild(letter) || this.addChild_(letter, id);
};

/**
 * Helper method to perform the actual child insertion.
 *
 * @param letter Child's transition letter.
 * @param id Child's id.
 * @return The added node.
 */
Node.prototype.addChild_ = function(letter, id) {
    var node = new Node(id),
        index = this.childIndex_(letter);
    this.children_[index] = node;
    this.letters.push(letter);
    return node;
};

/**
 * Check if this node has a child for this transition.
 *
 * @param letter Transition's label.
 * @return True if a child exists for this transition's label.
 */
Node.prototype.hasChild = function(letter) {
    return !!this.getChild(letter);
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
Node.prototype.getChild = function(letter) {
    var index = this.childIndex_(letter);
    return this.children_[index];
};

/**
 * Get the index for this letter in the children list.
 * Note that this function assumes an ASCII character set.
 * Could easily be generalized: http://mzl.la/LoNWgA
 *
 * @param letter The letter to check.
 * @return The letter's index in the children array.
 */
Node.prototype.childIndex_ = function(letter) {
    return letter.charCodeAt(0) - 'a'.charCodeAt(0);
};

/**
 * Retrieve the last inserted child.
 *
 * @return The last inserted child based on the transition label.
 */
Node.prototype.getLastChild = function() {
    return this.children_[this.lastChildIndex_()];
};

/**
 * Replace the last child with the given node.
 *
 * @param node The replacement node.
 */
Node.prototype.setLastChild = function(node) {
    this.children_[this.lastChildIndex_()] = node;
};

/**
 * @return The index of the last inserted child and undefined
 *         if this node has no children.
 */
Node.prototype.lastChildIndex_ = function() {
    for (var i = this.children_.length - 1; i >= 0; i--) {
        if (this.children_[i]) {
            return i;
        }
    }
};

/**
 * Check if this node recognize the given suffix.
 *
 * @param suffix The suffix to check.
 * @return True if this node recognize the given suffix.
 */
Node.prototype.accepts = function(suffix) {
    for (var i = 0, node = this; i < suffix.length; i++) {
        if (!(node = node.getChild(suffix[i]))) {
            return false;
        }
    }
    return node.isTerminal();
};

/**
 * Mark this node as terminal.
 */
Node.prototype.markTerminal = function() {
    this.end_ = true;
};

/**
 * Check if this node is terminal.
 *
 * @return True if this node is terminal.
 */
Node.prototype.isTerminal = function() {
    return this.end_;
};

/**
 * Mark this node as registered.
 * Used during the automaton's construction.
 */
Node.prototype.markRegistered = function() {
    this.registered_ = true;
};

/**
 * Check if this node has been registered.
 * Used during the automaton's construction.
 *
 * @return True is this node has been registered.
 */
Node.prototype.isRegistered = function() {
    return this.registered_;
};

/**
 * Replace or register last node.
 *
 * @param register The node registry.
 */
Node.prototype.replaceOrRegister = function(register) {
    var child = this.getLastChild(), q;

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
        id.push(this.getChild(this.letters[i]).id);
    }
    return id.join('');
};

module.exports = Node;

