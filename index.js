/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var Automata = require('./lib/automata'),
    Node = require('./lib/node');

/**
 * @param words A list of alphabetically sorted lowercase words.
 * @return The populated automata.
 */
module.exports.createFromWords = function(words) {
    var dict = new Automata();
    dict.addAll(words);
    return dict;
};

/**
 * @param filepath Path to an alphabetically sorted words list.
 * @return The populated automata.
 */
module.exports.loadFromFile = function(filepath) {
    var dict = new Automata(),
        data = fs.readFileSync(filepath, 'utf8');
    dict.addAll(data.toLowerCase().split('\n'));
    return dict;
};

module.exports.Node = Node;

module.exports.Automata = Automata;
