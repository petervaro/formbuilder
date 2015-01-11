/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.298 (20150111)                       **
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

(function(){
'use strict';
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
    this.setType = function(blockType)
    {
        this._type = blockType;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function()
    {
        var output = [],
            units = this._units;

        for (var i=0; i<units.length; i++)
            output.push(units[i].serialise());

        return output;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function(parent)
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
SingleTextInputBlock: function(args)
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


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function()
    {
        var units = this._units,
            data  = {type   : this._type,
                     inputs : []};

        /* Collect all data from units */
        var serial,
            data_inputs = data.inputs;
        for (var i=0; i<units.length; i++)
        {
            serial = units[i].serialise();
            if (serial)
                data_inputs.push(serial);
        }

        /* Return the serialisation */
        return data;
    };
},



/*----------------------------------------------------------------------------*/
/* Valid args-object properties:
    - blockName
    - inputLabel
    - inputText
    - classPrefix */
SingleTextInputBlockWithHelp: function(args)
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
