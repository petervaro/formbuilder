/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.304 (20150111)                       **
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

    /* Name-space */
    var ns = 'fb-content';

    /* Application */
    var fb = new g.formbuilder.FormBuilder({
        menu   : document.getElementById('menu'),
        blocks : document.getElementById('blocks'),
    });

    /* HACK: This is here for testing purpose only!!! */
    fb._lang  = 'hu';
    fb._title = 'test form';

    /* Specify section-block */
    fb.registerBlockPrototype({
        object    : g.blocks.SingleTextInputBlock,
        details   : {
            blockName   : 'Section Block',
            inputLabel  : 'Label:',
            inputText   : 'Title of this section...',
            classPrefix : ns,
        }}, 'section');

    /* Specify label-block */
    fb.registerBlockPrototype({
        object    : g.blocks.SingleTextInputBlockWithHelp,
        details   : {
            blockName   : 'Question Block',
            inputLabel  : 'Question:',
            inputText   : 'A question goes here...',
            helpText    : 'Add hints to the question...',
            classPrefix : ns,
        }}, 'question');

    /* Render application */
    fb.render();

    /* Create block-instances */
    fb.newBlockInstance('section');
    fb.newBlockInstance('question');
    fb.newBlockInstance('question');

    /* Serialise what we have so far */
    // console.log(JSON.stringify(fb.serialise()));
    fb.saveData();
    fb.loadData();
}
