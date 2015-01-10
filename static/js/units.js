/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.266 (20150110)                       **
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
function FormUnit()
{

}

/* Public objects (in 'units' name-space) */
var units = {
/*----------------------------------------------------------------------------*/
/*  */
SingleLineTextFormUnit: function(captionText, defaultText, classPrefix)
{
    /* Inherit from base-class */
    FormUnit.apply(this);

    /* Store values */
    this._captionText = captionText || 'Caption';
    this._defaultText = defaultText || 'Default text';
    this._classPrefix = classPrefix || '';

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.buildHTML = function(parent)
    {
        var element;
        element = document.createElement('p');
        element.className = this._classPrefix + 'caption';
        element.innerHTML = this._captionText;
        parent.appendChild(element);

        element = document.createElement('');
        element.className = this._classPrefix + 'field';
        element.value = this._defaultText;
        parent.appendChild(element);
    };
}


/*----------------------------------------------------------------------------*/
MultiLineTextFormUnit: function(captionText, defaultText, classPrefix)
{
    /* Inherit from base-class */
    FormUnit.apply(this);

    /* Store values */
    this._captionText = captionText || 'Caption';
    this._defaultText = defaultText || 'Default text';
    this._classPrefix = classPrefix || '';

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.buildHTML = function(parent)
    {
        var element;
        element = document.createElement('p');
        element.className = this._classPrefix + 'caption';
        element.innerHTML = this._captionText;
        parent.appendChild(element);

        element = document.createElement('textarea');
        element.className = this._classPrefix + 'field';
        element.value = this._defaultText;
        parent.appendChild(element);
    };
}

}; /* End of 'units' name-space */
/* Make 'units' accessible from globals */
g.units = units;
})();
