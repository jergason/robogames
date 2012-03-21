; (function () {











// Copyright 2004 Erik Arvidsson. All Rights Reserved.
//
// This code is triple licensed using Apache Software License 2.0,
// Mozilla Public License or GNU Public License
//
///////////////////////////////////////////////////////////////////////////////
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License.  You may obtain a copy
// of the License at http://www.apache.org/licenses/LICENSE-2.0
//
///////////////////////////////////////////////////////////////////////////////
//
// The contents of this file are subject to the Mozilla Public License
// Version 1.1 (the "License"); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://www.mozilla.org/MPL/
//
// Software distributed under the License is distributed on an "AS IS"
// basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
// License for the specific language governing rights and limitations
// under the License.
//
// The Original Code is Simple HTML Parser.
//
// The Initial Developer of the Original Code is Erik Arvidsson.
// Portions created by Erik Arvidssson are Copyright (C) 2004. All Rights
// Reserved.
//
///////////////////////////////////////////////////////////////////////////////
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
///////////////////////////////////////////////////////////////////////////////

/*
var handler ={
    startElement:   function (sTagName, oAttrs) {},
    endElement:     function (sTagName) {},
    characters:     function (s) {},
    comment:        function (s) {}
};
*/

function SimpleHtmlParser()
{
}

SimpleHtmlParser.prototype = {

    handler:    null,

    // regexps

    startTagRe: /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m,
    endTagRe:   /^<\/([^>\s]+)[^>]*>/m,
    attrRe:     /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm,

    parse:  function (s, oHandler)
    {
        if (oHandler)
            this.contentHandler = oHandler;

        var i = 0;
        var res, lc, lm, rc, index;
        var treatAsChars = false;
        var oThis = this;
        while (s.length > 0)
        {
            // Comment
            if (s.substring(0, 4) == "<!--")
            {
                index = s.indexOf("-->");
                if (index != -1)
                {
                    this.contentHandler.comment(s.substring(4, index));
                    s = s.substring(index + 3);
                    treatAsChars = false;
                }
                else
                {
                    treatAsChars = true;
                }
            }

            // end tag
            else if (s.substring(0, 2) == "</")
            {
                if (this.endTagRe.test(s))
                {
                    lc = RegExp.leftContext;
                    lm = RegExp.lastMatch;
                    rc = RegExp.rightContext;

                    lm.replace(this.endTagRe, function ()
                    {
                        return oThis.parseEndTag.apply(oThis, arguments);
                    });

                    s = rc;
                    treatAsChars = false;
                }
                else
                {
                    treatAsChars = true;
                }
            }
            // start tag
            else if (s.charAt(0) == "<")
            {
                if (this.startTagRe.test(s))
                {
                    lc = RegExp.leftContext;
                    lm = RegExp.lastMatch;
                    rc = RegExp.rightContext;

                    lm.replace(this.startTagRe, function ()
                    {
                        return oThis.parseStartTag.apply(oThis, arguments);
                    });

                    s = rc;
                    treatAsChars = false;
                }
                else
                {
                    treatAsChars = true;
                }
            }

            if (treatAsChars)
            {
                index = s.indexOf("<");
                if (index == -1)
                {
                     this.contentHandler.characters(s);
                    s = "";
                }
                else
                {
                    this.contentHandler.characters(s.substring(0, index));
                    s = s.substring(index);
                }
            }

            treatAsChars = true;
        }
    },

    parseStartTag:  function (sTag, sTagName, sRest)
    {
        var attrs = this.parseAttributes(sTagName, sRest);
        this.contentHandler.startElement(sTagName, attrs);
    },

    parseEndTag:    function (sTag, sTagName)
    {
        this.contentHandler.endElement(sTagName);
    },

    parseAttributes:    function (sTagName, s)
    {
        var oThis = this;
        var attrs = [];
        s.replace(this.attrRe, function (a0, a1, a2, a3, a4, a5, a6)
        {
            attrs.push(oThis.parseAttribute(sTagName, a0, a1, a2, a3, a4, a5, a6));
        });
        return attrs;
    },

    parseAttribute: function (sTagName, sAttribute, sName)
    {
        var value = "";
        if (arguments[7])
            value = arguments[8];
        else if (arguments[5])
            value = arguments[6];
        else if (arguments[3])
            value = arguments[4];

        var empty = !value && !arguments[3];
        return {name: sName, value: empty ? null : value};
    }
};















    function Mold (str) {
        if (str) this.makeParseTree(str.replace(/^\s+|\s+$/g, "")) // trim the string
        this.domState = {}
    }

    Mold.prototype = {
        // if there was a way to make this parse tree without using the http parser that would be sweet
        makeParseTree: function (str) {
            this.tree = []
            var branch = {children: this.tree}
            var parents = [branch]
            var elem
            var endElement


            new SimpleHtmlParser().parse(str, {
                startElement: function (tag, attrs) {
                    elem = {
                        tag: tag,
                        attrs: attrs,
                        children:[]
                    }
                    branch.children.push(elem)

                    parents.push(elem)
                    branch = elem

                    if (tag === "img" || tag === "input") endElement() // self closing, is there a better way to do this?
                },
                endElement: endElement = function (tag) {
                    parents.pop()
                    branch = parents[parents.length - 1]
                },
                characters: function (str) {
                    branch.children.push({
                        tag: "TextNode",
                        html: str
                    })
                },
                comment: function (str) {}
            })

            return this.tree
        },

        // walks tree and makes update object and dom element for each node in the tree
        create: function () {
            this.updates = []
            this.doms = []
            this.domState = {} // reset this state

            for (var i = 0; i < this.tree.length; i++) {
                this.doms.push(this.createUpdatesTree(this.tree[i], this.updates))
            }

            this.trimStaticUpdates()
            this.indexUpdates()

            return this.doms
        },

        // finds and updates and removes updates that will never change
        trimStaticUpdates: function () {
            var update
            for (var i = 0; i < this.updates.length; i++) {
                update = this.updates[i]
                if (!update.dependencies.length) {
                    this.updateOne(update, {})
                    this.updates.splice(i, 1)
                    i--
                }
            }
        },

        // puts updates into buckets by dependency
        indexUpdates: function () {
            var update, dependency
            this.updatesByDependency = {}
            for (var i = 0; i < this.updates.length; i++) {
                update = this.updates[i]
                if (!update.dependencies) continue
                for (var j = 0; j < update.dependencies.length; j++) {
                    dependency = update.dependencies[j]
                    if (!this.updatesByDependency[dependency]) this.updatesByDependency[dependency] = []
                    this.updatesByDependency[dependency].push(update)
                }
            }
        },

        createUpdatesTree: function (node, updates) {
            var i, attr, ents, dom

            if (node.tag === "TextNode") {
                dom = document.createTextNode("")
                ents = this.entitize(node.html)
                
                updates.push({
                    type: "html",
                    dependencies: ents.dependencies,
                    entities: ents.entities,
                    dom: dom,
                    index: updates.length
                })
            }
            else {
                dom = document.createElement(node.tag)
                if (node.attrs && node.attrs.length) {
                    for (i = 0; i < node.attrs.length; i++) {
                        attr = node.attrs[i]
                        ents = this.entitize(attr.value)

                        updates.push({
                            type: "attribute",
                            name: attr.name,
                            value: attr.value,
                            entities: ents.entities,
                            dependencies: ents.dependencies,
                            dom: dom,
                            index: updates.length
                        })
                    }
                }
            }

            if (node.children && node.children.length) {
                for (i = 0; i < node.children.length; i++) {
                    dom.appendChild(this.createUpdatesTree(node.children[i], updates))
                }
            }

            return dom
        },

        update: function (obj) {
            var update
            var updated = {} // don't double update 1 update if it has 2 changed variables
            for (var name in obj) {
                if (!this.updatesByDependency[name] || this.domState[name] === obj[name]) continue
                for (var i = 0; i < this.updatesByDependency[name].length; i++) {
                    update = this.updatesByDependency[name][i]
                    if (updated[update.index]) continue
                    this.updateOne(update, obj)
                    updated[update.index] = true
                }
                this.domState[name] = obj[name]
            }

            return this
        },

        updateOne: function (update, obj) {
            if (update.type === "html") {
                update.dom.nodeValue = this.renderEntities(update.entities, obj)
            }
            else if (update.type === "attribute") {
                update.dom.setAttribute(update.name, this.renderEntities(update.entities, obj))
            }
        },

        entitize: function (str) {
            if (!str) return {entities: [], dependencies: []}
            var findHotspotsRegex = /\{\{[^\}]*\}\}/g // cache me
            var entities = []
            var lastHotspot = 0
            var dependencies = []
            var hotspotName

            str.replace(findHotspotsRegex, function (hotspot, index) {
                // chars before the found hotspot
                entities.push({
                    type: "text",
                    text: str.substr(lastHotspot, index - lastHotspot)
                })
                lastHotspot += index - lastHotspot

                // the hotspot
                hotspotName = hotspot.replace("{{", "").replace("}}", "")
                entities.push({
                    type: "variable",
                    name: hotspotName
                })
                dependencies.push(hotspotName)
                lastHotspot += hotspot.length
            })

            // stuff after the last hotspot
            if (lastHotspot !== str.length) {
                entities.push({
                    type: "text",
                    text: str.substr(lastHotspot, str.length - lastHotspot)
                })
            }

            return {
                entities: entities,
                dependencies: dependencies
            }
        },

        renderEntities: function (entities, data) {
            var str = ""
            var entity

            for (var i = 0; i < entities.length; i++) {
                entity = entities[i]
                if (entity.type === "text") {
                    str += entity.text
                }
                else if (entity.type === "variable") {
                    if (data[entity.name] !== undefined) {
                        str += data[entity.name]
                    }
                }
            }
            
            return str  
        }
    }

    if (typeof define !== 'undefined' && define.amd) define(function () { return Mold }) // AMD
    else window.Mold = Mold // old skool browser
}())