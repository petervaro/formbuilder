/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.632 (20150126)                       **
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
if (!g.container)
    throw "'collection.js' has to be placed after 'container.js'";
if (!g.blocks)
    throw "'collections.js' has to be placed after 'blocks.js'";

/* Public objects (in 'collections' name-space) */
var collections = {

/*----------------------------------------------------------------------------*/
/*  */
Collection: function (args)
{
    /* Initialisation */
    g.container.Container.call(this, args);

    this._hasVarItems = true;

    /* Automatic identifiers for prototypes of block-objects */
    this._protoId = 0;
    /* Block-object prototypes */
    this._protos = args.blockPrototypes || {};

    /* Set properties based on arguments */
    this._rootElement  = args.rootElement;
    this._classPrefix  = args.classPrefix || '';
    this._notRemovable = args.notRemovable;

    /* If collections is removable => add a remove button */
    if (!this._notRemovable)
        this._fixItems.push(
            new g.units.TextButtonUnit(
                {
                    captionText : function ()
                    {
                        return 'remove';
                    },
                    classPrefix : (function ()
                    {
                        return this._classPrefix + '-remove';
                    }).bind(this),
                    eventCallbacks :
                    /* TODO: decide if we need to set this to:
                        (function () {window.setTimeout( <function goes here>, 0 );}) */
                    {
                        click: (function ()
                        {
                            this.getRoot().delVarItem(this);
                        }).bind(this),
                    },
                }));

    /* Add an 'add' button */
    this._fixItems.push(
        new g.units.TextButtonWithOptionsUnit(
            {
                preCaptionText : function ()
                {
                    return 'add new';
                },
                postCaptionText : function ()
                {
                    return 'block';
                },
                classPrefix : function ()
                {
                    return '';
                },
                optionTexts : (function ()
                {
                    var key,
                        texts = [],
                        protos = this._protos,
                        protosKeys = Object.keys(protos);

                    for (var i=0; i<protosKeys.length; i++)
                    {
                        key = protosKeys[i];
                        texts.push([key, protos[key].details.blockName]);
                    }

                    return texts;
                }).bind(this),
                eventCallbacks :
                /* TODO: decide if we need to set this to:
                        (function () {window.setTimeout( <function goes here>, 0 );}) */
                {
                    click: (function (value)
                    {
                        this.newVarItem(value);
                    }).bind(this)
                }
            }));


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object collections.Collection]';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.registerVarItemPrototype = function (prototype, reference)
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
    this.newVarItem = function (reference)
    {
        /* Get object-prototype and details and create a new instance */
        var prototype = this._protos[reference];
        var item = new prototype.object(prototype.details);

        /* Provide new identifier to the new item-objct and store it */
        item.setType(reference);
        item.setRoot(this);
        this._varItems.push(item);

        /* Render HTML */
        item.render({parentElement: this.getVarRootElement()});

        /* Return new item object */
        return item;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.delVarItem = function (item)
    {
        /* Remove from DOM */
        this.getVarRootElement().removeChild(item.getRootElement());
        /* Remove from structure */
        this._varItems.splice(this._varItems.indexOf(item));
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.delAllVarItems = function ()
    {
        /* Remove existing data */
        var rootElement = this.getRootElement();
        while (rootElement.firstChild)
            rootElement.removeChild(rootElement.firstChild);

        /* Reset storage and counter */
        this._varItems = [];
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function (data)
    {
        /* Rebuild form from serialised data */
        var block,
            blockData,
            blocks = data.blocks;
        for (var i=0; i<blocks.length; i++)
        {
            /* Create new block */
            blockData = blocks[i];
            block = this.newVarItem(blockData.type);
            /* Pass serialised data to block */
            block.deserialise(blockData);
        }
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function ()
    {
        var dataBlocks = [],
            thisBlocks = this._varItems;

        /* Collect all data from blocks */
        for (var i=0; i<thisBlocks.length; i++)
            dataBlocks.push(thisBlocks[i].serialise());

        /* Return the serialisation */
        return {type   : this.getType(),
                blocks : dataBlocks,};
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (args)
    {
        var i,
            items,
            parent  = args.parentElement,
            root    = args.rootElement,
            fixRoot = args.fixRoot,
            optRoot = args.optRoot,
            varRoot = args.varRoot;

        /* If removable */
        if (!this._notRemovable)
        {
            if (!parent)
                throw 'Collection.render() missing parent argument';

            /* Create root if it is not defined */
            if (!root)
            {
                root = document.createElement('div');
                root.className = this._classPrefix;
                parent.appendChild(root);
            }
            this.setRootElement(root);
        }

        /* Create fixed items */
        if (!fixRoot)
        {
            fixRoot = document.createElement('div');
            fixRoot.className = this._classPrefix + '-fix';
            root.appendChild(fixRoot);
        }
        this.setFixRootElement(fixRoot);

        items = this._fixItems;
        for (i=0; i<items.length; i++)
            items[i].render(fixRoot);

        /* If there are optional items */
        items = this._optItems;
        if (items.length)
        {
            if (!optRoot)
            {
                optRoot = document.createElement('div');
                optRoot.className = this._classPrefix + '-opt';
                root.appendChild(optRoot);
            }
            this.setOptRootElement(optRoot);

            for (i=0; i<items.length; i++)
                items[i].render(optRoot);
        }

        /* If there are variable number items */
        items = this._varItems;
        if (this._hasVarItems)
        {
            if (!varRoot)
            {
                varRoot = document.createElement('div');
                varRoot.className = this._classPrefix + '-var';
                root.appendChild(varRoot);
            }
            this.setVarRootElement(varRoot);

            for (i=0; i<items.length; i++)
                items[i].render(varRoot);
        }

        // var elems = [fixRoot,
        //              optRoot,
        //              varRoot,];

        // function newElementInRoot(setterFunc)
        // {
        //     var div = setterFunc(document.createElement('div'));
        //     root.appendChild(div);
        //     return div;
        // }

        // var i,
        //     j,
        //     div,
        //     item,
        //     items = [this._fixItems,
        //              this._optItems,
        //              this._varItems,],
        //     funcs = [this.setFixRootElement,
        //              this.setOptRootElement,
        //              this.setVarRootElement,],
        //     classPrefix = this._classPrefix,
        //     prefs = [classPrefix + '-fix',
        //              classPrefix + '-opt',
        //              classPrefix + '-var',];

        // for (i=0; i<items.length; i++)
        // {
        //     item = items[i];
        //     div  = elems[i] || newElementInRoot(funcs[i]);
        //     for (j=0; j<item.length; j++)
        //     {
        //         item[j].render(div);
        //     }
        // }
    };
}

}; /* End of 'collections' name-space */
/* Make 'collections' accessible from globals */
g.collections = collections;
})();
