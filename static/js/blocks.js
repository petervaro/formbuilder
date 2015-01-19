/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.427 (20150119)                       **
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
if (!g.units)
    throw "'blocks.js' has to be placed after 'units.js'";

/* Private objects */

/*----------------------------------------------------------------------------*/
/* Base-class of all block-objects, requires:
    - blockName */
function FormBlockObject(args)
{
    /* Set default values */
    this._name  = args.blockName || 'Unnamed Block';
    this._classPrefix = (args.classPrefix || '') + '-block';
    this._units = [];


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.setId = function(blockId)
    {
        this._id = blockId;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.setType = function (blockType)
    {
        this._type = blockType;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function ()
    {
        var dataUnits = [],
            thisUnits  = this._units;

        /* Collect all data from units */
        for (var i=0; i<thisUnits.length; i++)
            dataUnits.push(thisUnits[i].serialise());

        /* Return the serialisation */
        return {type  : this._type,
                units : dataUnits};
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function (data)
    {
        var thisUnits = this._units,
            dataUnits = data.units;

        /* Pass serialised data back to the units */
        for (var i=0; i<dataUnits.length; i++)
            thisUnits[i].deserialise(dataUnits[i]);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        /* Create container for block */
        var element = this._element = document.createElement('div');
        element.className = this._classPrefix;
        parent.appendChild(element);

        /* Build all units */
        var units = this._units;
        for (var i=0; i<units.length; i++)
            units[i].render(element);
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
    FormBlockObject.call(this, args);

    /* Set inputs of this block */
    this._units = [
        new g.units.StaticTextUnit({captionText: args.inputLabel,
                                    classPrefix: this._classPrefix}),
        new g.units.SingleLineTextInputUnit({defaultText: args.inputText,
                                             classPrefix: this._classPrefix}),
    ];
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
    FormBlockObject.call(this, args);

    /* Set inputs of this block */
    this._units = [
        new g.units.StaticTextUnit({captionText: args.inputLabel,
                                    classPrefix: this._classPrefix}),
        new g.units.MultiLineTextInputUnit({defaultText: args.inputText,
                                            classPrefix: this._classPrefix}),
    ];
},

}; /* End of 'blocks' name-space */
/* Make 'blocks' accessible from globals */
g.blocks = blocks;
})();
