/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.620 (20150126)                       **
**                         File: static/js/blocks.js                          **
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

(function () {
'use strict';

/* Include order check */
if (!g.container)
    throw "'blocks.js' has to be placed after 'container.js'";
if (!g.units)
    throw "'blocks.js' has to be placed after 'units.js'";

/* Private objects */

/*----------------------------------------------------------------------------*/
/* Base-class of all block-objects, requires:
    - blockName */
function Block(args)
{
    /* Initialisation */
    g.container.Container.call(this, args);

    /* Set default values */
    this._name  = args.blockName || 'Unnamed Block';
    this._classPrefix = (args.classPrefix || '') + '-block';
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
                    click : (function ()
                    {
                        this._root.delVarItem(this);
                    }).bind(this)
                }
            }));

    /* TODO: handle this._optItems */


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object Block]';
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

        if (!parent)
            throw 'Block.render() missing parent argument';

        /* Create root if it is not defined */
        if (!root)
        {
            root = document.createElement('div');
            root.className = this._classPrefix;
            parent.appendChild(root);
        }
        this.setRootElement(root);

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
    };
}



/* Public objects (in 'blocks' name-space) */
var blocks = {

/*----------------------------------------------------------------------------*/
/* Valid args-object properties:
    - blockName
    - inputLabel
    - inputText
    - classPrefix */
SingleTextInputBlock: function (args)
{
    /* Initialisation */
    args = args || {};
    Block.call(this, args);

    /* Set inputs of this block */
    this._fixItems.push(
        new g.units.StaticTextUnit(
            {
                captionText : function ()
                {
                    return args.inputLabel;
                },
                classPrefix : (function () {
                    return this._classPrefix;
                }).bind(this)
            }));

    this._fixItems.push(
        new g.units.SingleLineTextInputUnit(
            {
                defaultText : function ()
                {
                    return args.inputText;
                },
                classPrefix : (function ()
                {
                    return this._classPrefix;
                }).bind(this),
            }));


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object blocks.SingleTextInputBlock]';
    };
},



/*----------------------------------------------------------------------------*/
/* Valid args-object properties:
    - blockName
    - inputLabel
    - inputText
    - classPrefix */
SingleTextInputBlockWithHelp: function (args)
{
    /* Initialisation */
    args = args || {};
    Block.call(this, args);

    /* Setup label of block */
    this._fixItems.push(
        new g.units.StaticTextUnit(
            {
                captionText : function ()
                {
                    return args.inputLabel;
                },
                classPrefix : (function ()
                {
                    return this._classPrefix;
                }).bind(this),
            }));

    /* Setup main-input (eg. a question) */
    this._fixItems.push(
        new g.units.MultiLineTextInputUnit(
            {
                defaultText : function ()
                {
                    return args.inputText;
                },
                classPrefix : (function ()
                {
                    return this._classPrefix;
                }).bind(this),
            }));

    /* Setup sub-input (eg. a question's hint) */
    this._fixItems.push(
        new g.units.SingleLineTextInputUnit(
            {
                defaultText : function ()
                {
                    return args.helpText;
                },
                classPrefix : (function ()
                {
                    return this._classPrefix;
                }).bind(this),
            }));


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object blocks.SingleTextInputBlockWithHelp]';
    };
},



/*----------------------------------------------------------------------------*/
/*  */
ChoiceBlockWithHelp: function (args)
{
    /* Initialisation: Part 1 */
    args = args || {};
    Block.call(this, args);
    this._hasVarItems = true;

    /* Setup label of block */
    this._fixItems.push(
        new g.units.StaticTextUnit(
            {
                captionText : function ()
                {
                    return args.inputLabel;
                },
                classPrefix : (function ()
                {
                    return this._classPrefix;
                }).bind(this),
            }));

    /* Setup main-input (eg. a question) */
    this._fixItems.push(
        new g.units.MultiLineTextInputUnit(
            {
                defaultText : function ()
                {
                    return args.inputText;
                },
                classPrefix : (function ()
                {
                    return this._classPrefix;
                }).bind(this),
            }));

    /* Setup sub-input (eg. a question's hint) */
    this._fixItems.push(
        new g.units.SingleLineTextInputUnit(
            {
                defaultText : function ()
                {
                    return args.helpText;
                },
                classPrefix : (function ()
                {
                    return this._classPrefix;
                }).bind(this),
            }));

    /* Setup variable number of inputs' add button */
    this._fixItems.push(
        new g.units.TextButtonUnit(
            {
                captionText : function ()
                {
                    return 'append';
                },
                classPrefix : (function ()
                {
                    return this._classPrefix + '-option-append';
                }).bind(this),
                eventCallbacks :
                {
                    click: (function ()
                    {
                        this.newVarItem();
                    }).bind(this),
                },
            }));

    /* Setup variable number of inputs' remove button */
    this._fixItems.push(
        new g.units.TextButtonUnit(
            {
                captionText : function ()
                {
                    return 'remove';
                },
                classPrefix : (function ()
                {
                    return this._classPrefix + '-option-remove';
                }).bind(this),
                eventCallbacks :
                {
                    click: (function ()
                    {
                        this.delVarItem();
                    }).bind(this),
                },
            }));


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object blocks.ChoiceBlockWithHelp]';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.newVarItem = function ()
    {
        var unit = new g.units.SingleLineTextInputUnit(
            {
                defaultText : (function ()
                {
                    return 'option ' + (this._varItems.length + 1);
                }).bind(this),
                classPrefix : (function ()
                {
                    return this._classPrefix;
                }).bind(this),
            });

        this._varItems.push(unit);
        unit.render(this.getVarRootElement());
        return unit;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.delVarItem = function ()
    {
        this._varItems.pop();
        var varRootElement = this.getVarRootElement();
        if (varRootElement.lastChild)
            varRootElement.removeChild(varRootElement.lastChild);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.delAllVarItems = function ()
    {
        /* Remove elements from varItems' parent DOM object */
        var varRootElement = this.getVarRootElement();
        while (varRootElement.firstChild)
            varRootElement.removeChild(varRootElement.firstChild);

        /* Reset storage */
        this._varItems = [];
    };
},


}; /* End of 'blocks' name-space */
/* Make 'blocks' accessible from globals */
g.blocks = blocks;
})();
