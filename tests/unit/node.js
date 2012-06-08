/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var Node = require('../../lib/node');

function makePath(node, path) {
    path.split('').forEach(function(letter) {
        node = node.addChild(letter);
    });
    node.markTerminal();
}

function appendRandomLetter(word) {
    return word + 's';
}

function removeLastLetter(word) {
    return word.slice(0, word.length - 1);
}

module.exports['Node'] = {

    setUp: function(callback) {
        this.node = new Node();
        callback();
    },

    "addChild should create and insert a new node for a given letter": function(test) {
        this.node.addChild('a');
        test.ok(this.node.child('a'));
        test.done();
    },

    "addChild should return the created/existing node when called": function(test) {
        var child = this.node.addChild('a');
        test.equal(this.node.addChild('a'), child);
        test.done();
    },

    "hasChild should return true when node contains a transition for a given letter": function(test) {
        this.node.addChild('a');
        test.ok(this.node.hasChild('a'));
        test.done();
    },

    "hasChild should return false when node contains no transition for a given letter": function(test) {
        test.ok(!this.node.hasChild('a'));
        test.done();
    },

    "hasChildren should return true when node has any children": function(test) {
        this.node.addChild('a');
        test.ok(this.node.hasChildren());
        test.done();
    },

    "hasChildren should return false when node has no children": function(test) {
        test.ok(!this.node.hasChildren());
        test.done();
    },

    "child should return the child node for the given transition": function(test) {
        var child = this.node.addChild('a');
        test.equal(this.node.child('a'), child);
        test.done();
    },

    "child should return the undefined when child exists for the given transition": function(test) {
        test.ok(!this.node.child('a'));
        test.done();
    },

    "lastChild should return the last child based on the alphabetical order": function(test) {
        var first = this.node.addChild('d'),
            second = this.node.addChild('e'),
            last = this.node.addChild('f');
        test.equal(this.node.lastChild(), last);
        test.done();
    },

    "setLastChild should replace the last child inserted": function(test) {
        var first = this.node.addChild('a'),
            second = this.node.addChild('c'),
            last = this.node.addChild('e');

        var replacement = new Node();
        this.node.setLastChild(replacement);

        test.equal(this.node.lastChild(), replacement);
        test.done();
    },

    "markTerminal should mark the node as terminal": function(test) {
        this.node.markTerminal();
        test.ok(this.node.isTerminal());
        test.done();
    },

    "markRegistered should mark the node as registered": function(test) {
        this.node.markRegistered();
        test.ok(this.node.isRegistered());
        test.done();
    },

    "pathExists should return true if a path exists from a given node": function(test) {
        var path = 'mzefds';
        makePath(this.node, path);
        test.ok(this.node.pathExists(path));
        test.done();
    },

    "pathExists should return false if a path does not exist from a given node": function(test) {
        var path = 'mzefds';
        makePath(this.node, path);
        test.ok(!this.node.pathExists(appendRandomLetter(path)));
        test.ok(!this.node.pathExists(removeLastLetter(path)));
        test.done();
    },

    "getClass should return equal classes for empty nodes": function(test) {
        var node1 = new Node(),
            node2 = new Node();

        test.ok(node1.getClass() == node2.getClass());
        test.done();
    },

    "getClass should return equal classes for nodes with same children": function(test) {
        var node1 = new Node();
        node1.addChild('a', 1);
        node1.addChild('b', 2);

        var node2 = new Node();
        node2.addChild('a', 1);
        node2.addChild('b', 2);

        test.ok(node1.getClass() == node2.getClass());
        test.done();
    },

    "getClass should return different classes for nodes with different children": function(test) {
        var node1 = new Node();
        node1.addChild('a', 1);
        node1.addChild('b', 2);

        var node2 = new Node();
        node2.addChild('a', 1);
        node2.addChild('b', 3); // Mismatch.

        test.ok(node1.getClass() != node2.getClass());
        test.done();
    },

    "getClass should return different classes for terminal/non-terminal nodes": function(test) {
        var node1 = new Node(),
            node2 = new Node();

        node1.markTerminal();

        test.ok(node1.getClass() != node2.getClass());
        test.done();
    }
};
