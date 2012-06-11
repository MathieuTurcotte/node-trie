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

    "letters attribute should contain outgoing transition labels": function(test) {
        this.node.addChild('a');
        this.node.addChild('z');
        test.equal(this.node.letters.length, 2);
        test.ok(this.node.letters.indexOf('a') != -1);
        test.ok(this.node.letters.indexOf('z') != -1);
        test.done();
    },

    "addChild should create and insert a new node for a given letter": function(test) {
        this.node.addChild('a');
        test.ok(this.node.getChild('a'));
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

    "getChild should return the child node for the given transition": function(test) {
        var child = this.node.addChild('a');
        test.equal(this.node.getChild('a'), child);
        test.done();
    },

    "getChild should return the undefined when child exists for the given transition": function(test) {
        test.ok(!this.node.getChild('a'));
        test.done();
    },

    "getLastChild should return the last inserted child": function(test) {
        var first = this.node.addChild('d'),
            second = this.node.addChild('e'),
            last = this.node.addChild('f');
        test.equal(this.node.getLastChild(), last);
        test.done();
    },

    "setLastChild should replace the last inserted child": function(test) {
        var first = this.node.addChild('a'),
            second = this.node.addChild('c'),
            last = this.node.addChild('e');

        var replacement = new Node();
        this.node.setLastChild(replacement);

        test.equal(this.node.getLastChild(), replacement);
        test.done();
    },

    "isTerminal should return false for new node": function(test) {
        test.ok(!this.node.isTerminal());
        test.done();
    },

    "isRegistered should return false for new node": function(test) {
        test.ok(!this.node.isRegistered());
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

    "accepts should return true if a path exists from a given node": function(test) {
        var path = 'mzefds';
        makePath(this.node, path);
        test.ok(this.node.accepts(path));
        test.done();
    },

    "accepts should return false if a path does not exist from a given node": function(test) {
        var path = 'mzefds';
        makePath(this.node, path);
        test.ok(!this.node.accepts(appendRandomLetter(path)));
        test.ok(!this.node.accepts(removeLastLetter(path)));
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
