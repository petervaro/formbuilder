/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.635 (20150126)                       **
**                          File: static/js/main.js                           **
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

/* Globals */
var g = g || {};

/*----------------------------------------------------------------------------*/
function main()
{
    'use strict';

    /* Application */
    var fb = new g.formbuilder.FormBuilder(
    {
        classPrefix : 'fb',
        languages   :
        {
            hu : 'Magyar',
            en : 'English'
        },
    });

    /* Specify section-block */
    fb.registerBlockPrototype(
    {
        object  : g.blocks.SingleTextInputBlock,
        details :
        {
            blockName   : 'Section Block',
            inputLabel  : 'Label:',
            inputText   : 'Title of this section...',
        }
    },
    'section');

    /* Specify label-block */
    fb.registerBlockPrototype(
    {
        object  : g.blocks.SingleTextInputBlockWithHelp,
        details :
        {
            blockName   : 'Question Block',
            inputLabel  : 'Question:',
            inputText   : 'A question goes here...',
            helpText    : 'Add hints to this question...',
        }
    },
    'question');

    /* Specify radio-block */
    fb.registerBlockPrototype(
    {
        object  : g.blocks.ChoiceBlockWithHelp,
        details :
        {
            blockName   : 'Radio-button Block',
            inputLabel  : 'Question:',
            inputText   : 'A question goes here...',
            helpText    : 'Add hints to this question...',
        }
    },
    'radio');

    /* Specify radio-block */
    fb.registerBlockPrototype(
    {
        object  : g.collections.Collection,
        details :
        {
            blockName       : 'Group Block',
            inputLabel      : 'Question:',
            inputText       : 'A question goes here...',
            helpText        : 'Add hints to this question...',
            blockPrototypes :
            {
                'group-question' :
                {
                    object  : g.blocks.SingleTextInputBlockWithHelp,
                    details :
                    {
                        blockName  : 'Group-Question',
                        inputLabel : 'Group Question Question:',
                        inputText  : 'A group-question-question goes here...',
                        helpText   : 'Add group-question-hints to this question...',
                    }
                },
                'group-radio' :
                {
                    object  : g.blocks.ChoiceBlockWithHelp,
                    details :
                    {
                        blockName  : 'Group-Radio',
                        inputLabel : 'Group Radio Question:',
                        inputText  : 'A group-radio-question goes here...',
                        helpText   : 'Add group-radio-hints to this question...',
                    }
                },
            },
        }
    },
    'group');


    /* Render application */
    fb.render();

    // HACK: for testing purposes only
    g.fb = fb;

    // HACK: for testing purposes only
    fb.newBlockInstance('section');
    fb.newBlockInstance('question');
    var b = fb.newBlockInstance('radio');
    for (var i=0; i<5; i++)
        b.newVarItem();
    fb.newBlockInstance('group')

    // TODO: 1) 'blocks' => `items' => rename everywhere even in serialisation
    //       2) add render to container => remove render from Block and Collection

    // >>> TODO:
    //  1) Create all kinds of units
    //  2) Create all types of blocks (with remove buttons)
    //  6) Save and Load buttons for menu
    //  7) Serialise
    //  8) Deserialise
    //  9) Create the python-form-builder
    // 10) Create the database
    // 11) Create the authentication
    // 12) Document database => connect to admin
}
