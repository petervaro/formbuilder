/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.592 (20150126)                       **
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
    this.toString = function ()
    {
        return '[object Unit]';
    };

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function ()
    {
        // pass
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.update = function ()
    {
        /* All Units' properties are stored as closured functions, so
           encapsulating object can bind any of its own variables. This approach
           makes it very easy to change any values in the encapulating object,
           while one has to only call the Units.update() method to change the
           values */

        // pass
    };
}



/*----------------------------------------------------------------------------*/
function SerialisableUnit(args)
{
    /* Initialisation */
    Unit.call(this, args);


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object SerialisableUnit]';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function ()
    {
        // pass
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function ()
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
    this._getCaptionText = args.captionText || doNothing;
    this._getClassPrefix = args.classPrefix || doNothing;


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object units.StaticTextUnit]';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.update = function ()
    {
        this._captionText = this._getCaptionText() || 'Caption';
        this._classPrefix = this._getClassPrefix() || '';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        /* Get latest values */
        this.update();

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

    this._getCaptionText = args.captionText    || doNothing;
    this._getClassPrefix = args.classPrefix    || doNothing;
    this._eventCallbacks = args.eventCallbacks || [];


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object units.TextButtonUnit]';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.update = function ()
    {
        this._captionText = this._getCaptionText() || 'Button';
        this._classPrefix = this._getClassPrefix() || '';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        /* Get latest values */
        this.update();

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
TextButtonWithOptionsUnit: function (args)
{
    /* Initialisation */
    args = args || {};
    Unit.call(this, args);
    this._type = 21;

    this._getPreCaptionText  = args.preCaptionText  || doNothing;
    this._getPostCaptionText = args.postCaptionText || doNothing;
    this._getClassPrefix     = args.classPrefix     || doNothing;
    this._getOptionTexts     = args.optionTexts     || doNothing;
    this._eventCallbacks     = args.eventCallbacks  || [];


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object units.TextButtonWithOptionsUnit]';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.update = function ()
    {
        this._preCaptionText  = this._getPreCaptionText()  || 'Button';
        this._postCaptionText = this._getPostCaptionText() || 'options';
        this._classPrefix     = this._getClassPrefix()     || '';
        this._optionTexts     = this._getOptionTexts()     || [];
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        /* Get latest values */
        this.update();

        var classPrefix = this._classPrefix;

        var div = document.createElement('div');
        div.className = classPrefix += '-button';
        div.appendChild(document.createTextNode(this._preCaptionText));

        var select = document.createElement('select');
        select.className = classPrefix + '-options';

        /* If clicking on the selection box => do nothing */
        select.addEventListener('click',
        function (event)
        {
            event.stopPropagation();
        });

        /* Construct options in selection */
        var i,
            option,
            optionText,
            optionTexts = this._optionTexts;
        for (i=0; i<optionTexts.length; i++)
        {
            optionText = optionTexts[i];
            option = document.createElement('option');
            option.value = optionText[0];
            option.innerHTML = optionText[1];
            select.appendChild(option);
        }

        /* Bind event callbacks to the whole button */
        var event,
            eventCallbacks = this._eventCallbacks,
            events = Object.keys(this._eventCallbacks);
        function newCallback(event)
        {
            return function ()
            {
                eventCallbacks[event](select.value);
            };
        }

        for (i=0; i<events.length; i++)
        {
            event = events[i];
            div.addEventListener(event, newCallback(event));
        }

        /* Construct DOM hierarchy from the new elements */
        div.appendChild(select);
        div.appendChild(document.createTextNode(this._postCaptionText));
        parent.appendChild(div);
    };
},



/*----------------------------------------------------------------------------*/
SingleLineTextInputUnit: function (args)
{
    /* Initialisation */
    args = args || {};
    SerialisableUnit.call(this, args);
    this._type = 30;

    /* Store values */
    this._getCaptionText = args.captionText || doNothing;
    this._getDefaultText = args.defaultText || doNothing;
    this._getClassPrefix = args.classPrefix || doNothing;


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object units.SingleLineTextInputUnit]';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.update = function ()
    {
        this._captionText = this._getCaptionText() || 'Caption';
        this._defaultText = this._getDefaultText() || 'Default text';
        this._classPrefix = this._getClassPrefix() || '';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        /* Get latest values */
        this.update();

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
    SerialisableUnit.call(this, args);
    this._type = 31;

    /* Store values */
    this._getCaptionText = args.captionText || doNothing;
    this._getDefaultText = args.defaultText || doNothing;
    this._getClassPrefix = args.classPrefix || doNothing;


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object units.MultiLineTextInputUnit]';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.update = function ()
    {
        this._captionText = this._getCaptionText() || 'Caption';
        this._defaultText = this._getDefaultText() || 'Default text';
        this._classPrefix = this._getClassPrefix() || '';
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        /* Get latest values */
        this.update();

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
