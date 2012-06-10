/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var Automaton = require('./lib/automaton'),
    Node = require('./lib/node');

/**
 * @param words A list of alphabetically sorted lowercase words.
 * @return The populated automaton.
 */
module.exports.createFromWords = function(words) {
    var dict = new Automaton();
    dict.addAll(words);
    return dict;
};

/**
 * @param filepath Path to an alphabetically sorted words list.
 * @return The populated automaton.
 */
module.exports.loadFromFile = function(filepath) {
    var dict = new Automaton(),
        data = fs.readFileSync(filepath, 'utf8');
    dict.addAll(data.toLowerCase().split('\n'));
    return dict;
};

module.exports.Node = Node;

module.exports.Automaton = Automaton;
