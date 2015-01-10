/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.266 (20150110)                       **
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
/* Base-class of all block-objects */
function FormBlockObject(blockName)
{

    /* Set default values */
    this._name  = blockName || 'Unnamed Block';
    this._inputs = [];

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.getStruct = function()
    {
        return this._struct;
    };

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.buildHTML = function(parent)
    {
        return;
    };
}


/*----------------------------------------------------------------------------*/
function addBlockOptions(parent, blockOptions)
{
    if (blockOptions)
    {
        /* Add hint field to the block */
        if (blockOptions.hasHint)
        {
            element = document.createElement('p');
            element.className = 'fb-content-form-block-caption';
            element.innerHTML = 'Hint:';
            parent.appendChild(element);

            element = document.createElement('textarea');
            element.className = 'fb-content-form-block-field';
            element.value = 'Help text for this input';
            parent.appendChild(element);
        }

        /* Add limiter field to the block */
        if (blockOptions.hasLimiter)
        {
            element = document.createElement('p');
            element.className = 'fb-content-form-block-caption';
            element.innerHTML = 'Limit maximum length:';
            parent.appendChild(element);

            element = document.createElement('input');
            element.className = 'fb-content-form-block-field';
            element.type = 'text';
            element.value = 0;
            parent.appendChild(element);
        }
    }
}

/* Public objects (in 'blocks' name-space) */
var blocks = {

/*----------------------------------------------------------------------------*/
SingleTextInputBlock: function(blockName, blockType, inputLabel)
{
    /* Initialisation */
    var args = Array.prototype.slice(arguments).slice(1);
    FormBlockObject.apply(this, args);

    /* Set default values */
    this._units = [
        new g.units.SingleLineTextFormUnit(),
    ];
    this._inputLabel = inputLabel || 'Untitled Input';

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.getStruct = function()
    {
        /* Construct output */
        return;
    };

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.buildHTML = function(parent)
    {
        /* Build all units */
        var units = this._units;
        for (var i=0; i<units.length; i++)
            units[i].buildHTML(parent);
    };
},


/*----------------------------------------------------------------------------*/
SingleTextInputBlockWithHelp: function(inputLabel)
{
    /* Initialisation */
    var args = Array.prototype.slice(arguments).slice(1);
    FormBlockObject.apply(this, args);

    /* Set default values */
    this._inputLabel = inputLabel || 'Untitled Input';
},

}; /* End of 'blocks' name-space */
/* Make 'blocks' accessible from globals */
g.blocks = blocks;
})();
