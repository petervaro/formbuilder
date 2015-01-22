/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.558 (20150122)                       **
**                       File: static/js/collections.js                       **
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

/* Include order check */
if (!g.blocks)
    throw "'collections.js' has to be placed after 'blocks.js'";

/* Public objects (in 'collections' name-space) */
var collections = {

/*----------------------------------------------------------------------------*/
/*  */
Collection: function (args)
{
    /* Automatic identifiers for prototypes of block-objects */
    this._protoId = 0;
    /* Block-object prototypes */
    this._protos = args.blockPrototypes || {};
    /* Identifier for instances of block-objects */
    this._blockId = 0;
    /* Instanced block-objects */
    this._blocks = [];

    /* Set properties based on arguments */
    this._primary = args.primary;
    this._rootElement = args.rootElement;
    this._classPrefix = args.classPrefix;


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.setId = function (blockId)
    {
        this._id = blockId;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.setType = function (blockType)
    {
        this._type = blockType;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.setRoot = function (root)
    {
        this._root = root;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.getRootElement = function ()
    {
        return this._rootElement;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.setRootElement = function (rootElement)
    {
        this._rootElement = rootElement;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.registerBlockPrototype = function (prototype, reference)
    {
        /* Get or set reference, store prototype and return it*/
        reference = reference || this._protoId++;
        prototype = prototype || {};

        var details = prototype.details = prototype.details || {};

        /* Leave or set CSS class-prefix */
        details.classPrefix = details.classPrefix ||
                              this._classPrefix +
                              (this._classPrefix ? '-' : '') + 'blocks';

        /* Store new prototype and return reference */
        this._protos[reference] = prototype;
        return reference;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.newBlockInstance = function (reference)
    {
        /* Get object-prototype and details and create a new instance */
        var prototype = this._protos[reference];
        var block = new prototype.object(prototype.details);

        /* Provide new identifier to the new block-objct and store it */
        block.setId(this._id++);
        block.setType(reference);
        block.setRoot(this);
        this._blocks.push(block);
        block.setRootElement(this._rootElement);

        /* Render HTML */
        block.render(this._rootElement);

        /* Return new block object */
        return block;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.removeBlockIstance = function (block)
    {
        /* Remove from DOM */
        this._rootElement.removeChild(block.getRootElement());
        /* Remove from structure */
        this._blocks.splice(this._blocks.indexOf(block));
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.removeAllBlockInstances = function ()
    {
        /* Remove existing data */
        var rootElement = this._rootElement;
        while (rootElement.firstChild)
            rootElement.removeChild(rootElement.firstChild);

        /* Reset storage and counter */
        this._blocks = [];
        this._blockId = 0;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function (data)
    {
        /* Re/set basic informations */
        this.resetForm(data.lang, data.title, data.formId);
        console.log('[DESERIALISE] formId = ', data.formId);

        /* Rebuild form from serialised data */
        var block,
            blockData,
            blocks = data.blocks;
        for (var i=0; i<blocks.length; i++)
        {
            /* Create new block */
            blockData = blocks[i];
            block = this.newBlockInstance(blockData.type);
            /* Pass serialised data to block */
            block.deserialise(blockData);
        }
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function ()
    {
        var dataBlocks = [],
            thisBlocks = this._blocks;

        /* Collect all data from blocks */
        for (var i=0; i<thisBlocks.length; i++)
            dataBlocks.push(thisBlocks[i].serialise());

        console.log('[ SERIALISE ] formId = ', this._formId || null);

        /* Return the serialisation */
        return {title  : this._title,
                lang   : this._lang,
                formId : this._formId || null,
                blocks : dataBlocks};
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (menuElement, classPrefix)
    {
        /* If menuElement did not set */
        menuElement = menuElement || this._rootElement;

        var i,
            div,
            key,
            object,
            option,
            select,
            objectKeys,
            subClassPrefix;
            // classPrefix = this._classPrefix;

        /* ---------------------
           Create menu-items-add */
        div = document.createElement('div');
        div.className = subClassPrefix = classPrefix + '-add';
        div.appendChild(document.createTextNode('append new'));

        /* -----------------------------
           Create menu-items-add-options */
        select = document.createElement('select');
        select.className = subClassPrefix + '-options';

        /* If clicking on the selection */
        select.addEventListener('click',
        function (event)
        {
            event.stopPropagation();
        });

        /* Construct options in selection */
        object = this._protos;
        objectKeys = Object.keys(object);
        for (i=0; i<objectKeys.length; i++)
        {
            key = objectKeys[i];
            option = document.createElement('option');
            option.value = key;
            option.innerHTML = object[key].details.blockName;
            select.appendChild(option);
        }

        /* If clicking on the add-div itself */
        div.addEventListener('click',
        (function ()
        {
            this.newBlockInstance(select.value);
        }).bind(this, select));

        /* Add newly created elements to structure */
        div.appendChild(select);
        div.appendChild(document.createTextNode('block'));
        menuElement.appendChild(div);
    };
}

}; /* End of 'collections' name-space */
/* Make 'collections' accessible from globals */
g.collections = collections;
})();
