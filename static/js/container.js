/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.629 (20150126)                       **
**                        File: static/js/container.js                        **
**                                                                            **
**               For more information about the project, visit                **
**                <https://github.com/petervaro/formbuilder>.                 **
**                       Copyright (C) 2014 Peter Varo                        **
**                                                                            **
**  This program is free software: you can redistribute it and/or modify it   **
**   under the terms of the GNU General Public License as published by the    **
**       Free Software Foundation, either version 3 of the License, or        **
**                    (at your option) any later version.                     **
**                                                                            **
**    This program is distributed in the hope that it will be useful, but     **
**         WITHOUT ANY WARRANTY; without even the implied warranty of         **
**            MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.            **
**            See the GNU General Public License for more details.            **
**                                                                            **
**     You should have received a copy of the GNU General Public License      **
**     along with this program, most likely a file in the root directory,     **
**        called 'LICENSE'. If not, see <http://www.gnu.org/licenses>.        **
**                                                                            **
************************************************************************ INFO */

(function ()
{
'use strict';

/* Public objects (in 'container' name-space) */
var container = {

/*----------------------------------------------------------------------------*/
/* Base class of all kinds of containers (eg. collections or blocks) across
   the formbuilder system. This class makes it possible, to have the same
   properties and methods all the containers in a form, therefore every
   container can contain any other containers => the form itself is a container
   as well */
Container: function (args)
{
    /* Basic informations => essential items */
    this._fixItems = [];
    /* Optional informations => settings items */
    this._optItems = [];
    /* Variable number of items */
    this._varItems = [];

    /* Construct setter */
    function newSetter(property)
    {
        return function (value)
        {
            return this[property] = value;
        };
    };

    /* Construct getter */
    function newGetter(property)
    {
        return function ()
        {
            return this[property];
        };
    };


    /* Construct getters and setters */
    var property,
        Property,
        properties = ['type',
                      'root',
                      'rootElement',
                      'fixRootElement',
                      'optRootElement',
                      'varRootElement',];
    for (var i=0; i<properties.length; i++)
    {
        /* Format property and method names */
        property = properties[i];
        Property = property.charAt(0).toUpperCase() + property.slice(1);
        property = '_' + property;

        /* New methods */
        this['set' + Property] = newSetter(property);
        this['get' + Property] = newGetter(property);
    }


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object container.Container]';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.newFixItem = function ()
    {
        /* This problem occurs, when the serialised data has more values, then
           the newly created deserialised object. The cause could be: the
           serialised data was serialised from an older object-structure */
        throw 'Container.newFixItem(): fixItem is missing from container';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.newVarItem = function ()
    {
        // pass
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.newOptItem = function ()
    {
        // pass
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function ()
    {
        var dataItems = [],
            thisItems = [this._fixItems,
                         this._optItems,
                         this._varItems,];

        /* Collect all serialised data from items */
        var j,
            data,
            item,
            items;
        for (var i=0; i<thisItems.length; i++)
        {
            data  = [];
            items = thisItems[i];
            for (j=0; j<items.length; j++)
            {
                item = items[j];
                if (item.serialise)
                    data.push(items[j].serialise());
            }
            if (data.length)
                dataItems.push(data);
        }

        /* Return the serialisation */
        return {type  : this.getType(),
                items : dataItems};
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function (inputData)
    {
        var dataItems = inputData.items,
            thisItems = [this._fixItems,
                         this._optItems,
                         this._varItems,],
            newFuncs  = [this.newFixItem,
                         this.newOptItem,
                         this.newVarItem,];

        /* Reload all deserialised data to items */
        var j,
            data,
            func,
            item,
            items;
        for (var i=0; i<thisItems.length; i++)
        {
            data  = dataItems[i] || [];
            func  = newFuncs[i];
            items = thisItems[i];
            for (j=0; j<data.length; j++)
            {
                item = items[j] || func(data[j].type);
                if (item && item.deserialise)
                    item.deserialise(data[j]);
            }
        }
    };
},

}; /* End of 'container' name-space */
/* Make 'container' accessible from globals */
g.container = container;
})();
