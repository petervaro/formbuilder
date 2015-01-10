/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.266 (20150110)                       **
**                       File: static/js/formbuilder.js                       **
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

/* Public objects (in 'formbuilder' name-space) */
var formbuilder = {

/*----------------------------------------------------------------------------*/
FormBuilder: function()
{

    this._blocks = [];

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.pushBlock = function(blockObject)
    {
        this._blocks.push(blockObject);
    };

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.getAllBlocks = function()
    {
        var output = [],
            blocks = this._blocks;

        for (var i=0; i<blocks.length; i++)
            output.push(blocks[i].getStruct());

        return output;
    };
},

}; /* End of 'formbuilder' name-space */
/* Make 'formbuilder' accessible from globals */
g.formbuilder = formbuilder;
})();
