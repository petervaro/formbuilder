/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.518 (20150121)                       **
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

/* TODO: does fb really needs the Unit._type property? What for? */
/* Explanation of the Unit instances.
    Properties:
        this._type
            It is only meaningful when the formbuilder rebuilds the
            form->block->unit, so it can choose the proper unit-object.
            The number has to be unique, but can be anything.

            The convention is:
                1x => static, no events
                2x => static, with events
                3x => dynamic, no events
                4x => dynamic, with events
*/

(function (){
'use strict';

/*----------------------------------------------------------------------------*/
function doNothing() {}

/*----------------------------------------------------------------------------*/
/* Base-class of all unit-objects */
function Unit(args)
{
    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function ()
    {
        // pass
    };
}



/* Public objects (in 'units' name-space) */
var units = {
/*----------------------------------------------------------------------------*/
StaticTextUnit: function (args)
{
    /* Initialisation */
    args = args || {};
    Unit.call(this, args);
    this._type = 10;

    /* Store values */
    this._captionText = args.captionText || 'Caption';
    this._classPrefix = args.classPrefix || '';


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        /* Add input */
        var element = document.createElement('p');
        element.className = this._classPrefix + '-caption';
        element.innerHTML = this._captionText;
        parent.appendChild(element);
    };
},



/*----------------------------------------------------------------------------*/
TextButtonUnit: function (args)
{
    /* Initialisation */
    args = args || {};
    Unit.call(this, args);
    this._type = 20;

    this._captionText = args.captionText || 'Button';
    this._classPrefix = args.classPrefix || '';
    this._eventCallbacks = args.eventCallbacks || [];

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        /* Add textarea */
        var element = this._userValue = document.createElement('div');
        element.className = this._classPrefix + '-button';
        element.innerHTML = this._captionText;

        /* Bind event callbacks to button */
        var event,
            eventCallbacks = this._eventCallbacks,
            events = Object.keys(this._eventCallbacks);
        for (var i=0; i<events.length; i++)
        {
            event = events[i];
            element.addEventListener(event, eventCallbacks[event]);
        }
        parent.appendChild(element);
    };
},



/*----------------------------------------------------------------------------*/
SingleLineTextInputUnit: function (args)
{
    /* Initialisation */
    args = args || {};
    Unit.call(this, args);
    this._type = 30;

    /* Store values */
    this._captionText = args.captionText || 'Caption';
    this._defaultText = args.defaultText || 'Default text';
    this._classPrefix = args.classPrefix || '';


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        /* Add input */
        var element = this._userValue = document.createElement('input');
        element.className = this._classPrefix + '-field';
        element.type = 'text';
        element.value = this._defaultText;
        parent.appendChild(element);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function ()
    {
        return {type  : this._type,
                label : this._userValue.value};
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function (data)
    {
        this._userValue.value = data.label;
    };
},



/*----------------------------------------------------------------------------*/
MultiLineTextInputUnit: function (args)
{
    /* Initialisation */
    args = args || {};
    Unit.call(this, args);
    this._type = 31;

    /* Store values */
    this._captionText = args.captionText || 'Caption';
    this._defaultText = args.defaultText || 'Default text';
    this._classPrefix = args.classPrefix || '';


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        /* Add textarea */
        var element = this._userValue = document.createElement('textarea');
        element.className = this._classPrefix + '-field';
        element.value = this._defaultText;
        parent.appendChild(element);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function ()
    {
        return {type  : this._type,
                label : this._userValue.value};
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function (data)
    {
        this._userValue.value = data.label;
    };
},


}; /* End of 'units' name-space */
/* Make 'units' accessible from globals */
g.units = units;
})();
