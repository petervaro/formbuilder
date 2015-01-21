/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.525 (20150121)                       **
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
    this._varUnits = [];
    this._fixUnits = [
        new g.units.TextButtonUnit(
            {captionText: 'remove',
             classPrefix: this._classPrefix + '-remove',
             eventCallbacks:
                /* TODO: decide if we need to set this to:
                    (function () {window.setTimeout( <function goes here>, 0 );}) */
                {click: (function () {this._root.removeBlockIstance(this);}).bind(this)}})];


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
    this.serialise = function ()
    {
        var dataUnits = [],
            thisUnits = [this._fixUnits, this._varUnits];

        /* Collect all data from units */
        var j,
            data,
            unit,
            units;
        for (var i=0; i<thisUnits.length; i++)
        {
            data  = [];
            units = thisUnits[i];
            for (j=0; j<units.length; j++)
            {
                unit = units[j];
                if (unit.serialise)
                    data.push(units[j].serialise());
            }
            if (data.length)
                dataUnits.push(data);
        }

        /* Return the serialisation */
        return {type  : this._type,
                units : dataUnits};
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function (inputData)
    {
        var thisUnits = [this._fixUnits, this._varUnits],
            dataUnits = inputData.units;

        /* Pass serialised data back to the units */
        var j,
            data,
            unit,
            units;
        for (var i=0; i<thisUnits.length; i++)
        {
            data  = dataUnits[i] || [];
            units = thisUnits[i];
            for (j=0; j<data.length; j++)
            {
                unit = units[j] || this.addVarUnit();
                if (unit.deserialise)
                    unit.deserialise(data[j]);
            }
        }
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function (parent)
    {
        var i,
            units,
            element,
            elements;

        /* Create container for fix and variable unit containers */
        elements = this._rootElement = document.createElement('div');
        elements.className = this._classPrefix;
        parent.appendChild(elements);

        /* Create container for fix units */
        element = this._fixUnitsElement = document.createElement('div');
        element.className = this._classPrefix + '-fix';
        elements.appendChild(element);

        /* Build fixed units */
        units = this._fixUnits;
        for (i=0; i<units.length; i++)
            units[i].render(element);

        /* Create container for variable unit and
           build variable units if block has any */
        if (this._hasVarUnits)
        {
            element = this._varUnitsElement = document.createElement('div');
            element.className = this._classPrefix + '-var';
            elements.appendChild(element);
            units = this._varUnits;
            for (i=0; i<units.length; i++)
                units[i].render(element);
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
    FormBlockObject.call(this, args);

    /* Set inputs of this block */
    this._fixUnits.push(
        new g.units.StaticTextUnit(
            {captionText: args.inputLabel,
             classPrefix: this._classPrefix}));
    this._fixUnits.push(
        new g.units.SingleLineTextInputUnit(
            {defaultText: args.inputText,
             classPrefix: this._classPrefix}));
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
    this._fixUnits.push(
        new g.units.StaticTextUnit(
            {captionText: args.inputLabel,
             classPrefix: this._classPrefix}));
    this._fixUnits.push(
        new g.units.MultiLineTextInputUnit(
            {defaultText: args.inputText,
             classPrefix: this._classPrefix}));
    this._fixUnits.push(
        new g.units.SingleLineTextInputUnit(
            {defaultText: args.helpText,
             classPrefix: this._classPrefix}));
},



/*----------------------------------------------------------------------------*/
/*  */
ChoiceBlockWithHelp: function (args)
{
    /* Initialisation: Part 1 */
    args = args || {};
    FormBlockObject.call(this, args);
    this._hasVarUnits = true;

    /* Set inputs of this block */
    this._fixUnits.push(
        new g.units.StaticTextUnit(
            {captionText: args.inputLabel,
             classPrefix: this._classPrefix}));
    this._fixUnits.push(
        new g.units.MultiLineTextInputUnit(
            {defaultText: args.inputText,
             classPrefix: this._classPrefix}));
    this._fixUnits.push(
        new g.units.SingleLineTextInputUnit(
            {defaultText: args.helpText,
             classPrefix: this._classPrefix}));
    this._fixUnits.push(
        new g.units.TextButtonUnit(
            {captionText: 'append',
             classPrefix: this._classPrefix + '-option-append',
             eventCallbacks: {click: (function () {this.addVarUnit();}).bind(this)}}));
    this._fixUnits.push(
        new g.units.TextButtonUnit(
            {captionText: 'remove',
             classPrefix: this._classPrefix + '-option-remove',
             eventCallbacks: {click: (function () {this.removeVarUnit();}).bind(this)}}));


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.addVarUnit = function ()
    {
        var i    = this._varUnits.length + 1,
            unit = new g.units.SingleLineTextInputUnit({defaultText: 'option ' + i,
                                                        classPrefix: this._classPrefix});
        this._varUnits.push(unit);
        unit.render(this._varUnitsElement);
        return unit;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.removeVarUnit = function ()
    {
        this._varUnits.pop();
        this._varUnitsElement.removeChild(this._varUnitsElement.lastChild);
    };
},



/*----------------------------------------------------------------------------*/
/*  */
GroupWithHelp: function (args)
{
    /* Initialisation */
    args = args || {};
    FormBlockObject.call(this, args);

    console.log(Object.keys(blocks));

    /* Set inputs of this block */
    // this._fixUnits.push(new g.units.StaticTextUnit({captionText: args.inputLabel,
    //                                                 classPrefix: this._classPrefix}));
    // this._fixUnits.push(new g.units.MultiLineTextInputUnit({defaultText: args.inputText,
    //                                                         classPrefix: this._classPrefix}));
},

}; /* End of 'blocks' name-space */
/* Make 'blocks' accessible from globals */
g.blocks = blocks;
})();
