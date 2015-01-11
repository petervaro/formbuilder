/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.304 (20150111)                       **
**                       File: static/js/formbuilder.js                       **
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

(function(){
'use strict';

/* Public objects (in 'formbuilder' name-space) */
var formbuilder = {

/*----------------------------------------------------------------------------*/
/* FormBuilder is the manager object. It stores all the information of the
   application itself, it reads and writes the form-serialisation. */
FormBuilder: function(args)
{
    /* Automatic identifiers for prototypes of block-objects */
    this._protoId = 0;
    /* Block-object prototypes */
    this._protos = {};
    /* Identifier for instances of block-objects */
    this._blockId = 0;
    /* Instanced block-objects */
    this._blocks = [];

    /* DOM parents */
    this._controlParent = args.menu;
    this._blocksParent  = args.blocks;

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function()
    {
        // pass
    };

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.registerBlockPrototype = function(prototype, reference)
    {
        /* Get or set reference, store prototype and return it*/
        reference = reference || this._protoId++;
        this._protos[reference] = prototype || {};
        return reference;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.newBlockInstance = function(reference)
    {
        /* Get prototype and details */
        try
        {
            /* Get object-prototype and details and create a new instance */
            var prototype = this._protos[reference];
            var block = new prototype.object(prototype.details);

            /* Provide new identifier to the new block-object and store it */
            block.setId(this._id++);
            block.setType(reference);
            this._blocks.push(block);

            /* Render HTML */
            block.render(this._blocksParent);
        }
        catch (exception)
        {
            console.log('FormBuilder.newBlockInstance()  =>  ' +
                        'Invalid reference to prototype or ' +
                        'insufficient prototype options', exception);
        }
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.pullBlock = function()
    {
        // pass
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function(data)
    {
        // pass
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function()
    {
        var blocks = this._blocks,
            data   = {title  : this._title,
                      lang   : this._lang,
                      blocks : []};

        /* Collect all data from blocks */
        var data_blocks = data.blocks;
        for (var i=0; i<blocks.length; i++)
        {
            data_blocks.push(blocks[i].serialise());
        }

        /* Return the serialisation */
        return data;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.saveData = function()
    {
        var request = new XMLHttpRequest();
        request.open('POST', '/data', true);
        request.setRequestHeader('Content-Type',
                                 'application/x-www-form-urlencoded;'+
                                 'charset=UTF-8');
        request.send(JSON.stringify(this.serialise()));
    }


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.loadData = function()
    {
        var request = new XMLHttpRequest();
        request.open('GET', '/data', true);

        request.onload = function()
        {
            /* If successful */
            if (this.status >= 200 && this.status < 400)
            {
                console.log(JSON.parse(this.response));
                // this.deserialise(JSON.parse(this.response));
            }
            else
            {
                // pass
            }
        };

        request.onerror = function()
        {
            // There was a connection error of some sort
        };

        request.send();
    }
},

}; /* End of 'formbuilder' name-space */
/* Make 'formbuilder' accessible from globals */
g.formbuilder = formbuilder;
})();
