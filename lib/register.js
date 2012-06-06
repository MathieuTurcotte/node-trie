/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

/**
 * Registry used when building the finite-state automata.
 */
function Register() {
    this.registry = {};
}

/**
 * Register a node.
 *
 * @param node The node to register.
 */
Register.prototype.add = function(node) {
    this.registry[node.getClass()] = node;
};

/**
 * Try to find an equivalent node in the register.
 *
 * @param node The node to check for equivalence.
 * @return The equivalent node if any, null otherwise.
 */
Register.prototype.find = function(node) {
    return this.registry[node.getClass()];
};

module.exports = Register;

