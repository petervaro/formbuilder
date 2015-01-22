/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.543 (20150122)                       **
**                          File: static/js/utils.js                          **
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

/*----------------------------------------------------------------------------*/
/* Example:
    // do something
    debug(new Error());
    // do another thing
    debug(new Error(), 16); */
function debug()
{
    'use strict';
    var args  = Array.prototype.slice.call(arguments),
        first = args[0],
        rest  = args.slice(1);

    if (first instanceof Error)
    {
        console.log('[DEBUG] file: '  + first.fileName     +
                    ' in line: '      + first.lineNumber   +
                    ' in column: '    + first.columnNumber);
        var item,
            output = [];
        for (var i=0; i<rest.length; i++)
        {
            item = rest[i];
            output.push(item === undefined ? 'undefined' : item === null ? 'null' : item);
        }
        console.log('       value: ' + output.join(' '));
    }
    else
        console.log('[DEBUG] ' + args.length ? args.join(' ') : undefined);
}
