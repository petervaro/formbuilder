/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.301 (20150111)                       **
**                          File: static/js/units.js                          **
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

/*----------------------------------------------------------------------------*/
/* Base-class of all unit-objects */
function Unit(args)
{
    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function()
    {
        // pass
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function()
    {
        // pass
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function()
    {
        // pass
    };
}



/* Public objects (in 'units' name-space) */
var units = {
/*----------------------------------------------------------------------------*/
StaticTextUnit: function(args)
{
    /* Initialisation */
    args = args || {};
    Unit.call(this, args);
    this._type = 'StaticTextUnit';

    /* Store values */
    this._captionText = args.captionText || 'Caption';
    this._classPrefix = args.classPrefix || '';


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function(parent)
    {
        /* Add input */
        var element = document.createElement('p');
        element.className = this._classPrefix + '-caption';
        element.innerHTML = this._captionText;
        parent.appendChild(element);
    };
},



/*----------------------------------------------------------------------------*/
/*  */
SingleLineTextInputUnit: function(args)
{
    /* Initialisation */
    args = args || {};
    Unit.call(this, args);
    this._type = 'SingleLineTextInputUnit';

    /* Store values */
    this._captionText = args.captionText || 'Caption';
    this._defaultText = args.defaultText || 'Default text';
    this._classPrefix = args.classPrefix || '';


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function(parent)
    {
        /* Add input */
        var element = this._userValue = document.createElement('input');
        element.className = this._classPrefix + '-field';
        element.type = 'text';
        element.value = this._defaultText;
        parent.appendChild(element);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function()
    {
        return [{type  : this._type,
                 label : this._userValue.value}];
    };
},


/*----------------------------------------------------------------------------*/
MultiLineTextInputUnit: function(args)
{
    /* Initialisation */
    args = args || {};
    Unit.call(this, args);
    this._type = 'MultiLineTextInputUnit';

    /* Store values */
    this._captionText = args.captionText || 'Caption';
    this._defaultText = args.defaultText || 'Default text';
    this._classPrefix = args.classPrefix || '';


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function(parent)
    {
        /* Add textarea */
        var element = this._userValue = document.createElement('textarea');
        element.className = this._classPrefix + '-field';
        element.value = this._defaultText;
        parent.appendChild(element);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function()
    {
        return [{type  : this._type,
                 label : this._userValue.value}];
    };
}

}; /* End of 'units' name-space */
/* Make 'units' accessible from globals */
g.units = units;
})();
