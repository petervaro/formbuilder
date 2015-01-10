/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.266 (20150110)                       **
**                        File: static/js/generator.js                        **
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

/* Script level constants */
var ID = 1;

/*----------------------------------------------------------------------------*/
function _sectionBlock(parent)
{
    'use strict';
    var element;

    element= document.createElement('p');
    element.className = 'fb-content-form-block-caption';
    element.innerHTML = 'Label:';
    parent.appendChild(element);

    element = document.createElement('input');
    element.type = 'text';
    element.className = 'fb-content-form-block-field';
    element.value = 'Title of this section';
    parent.appendChild(element);
}



/*----------------------------------------------------------------------------*/
function _singlelineBlock(parent)
{
    'use strict';
    var element;

    element= document.createElement('p');
    element.className = 'fb-content-form-block-caption';
    element.innerHTML = 'Question:';
    parent.appendChild(element);

    element = document.createElement('input');
    element.type = 'text';
    element.className = 'fb-content-form-block-field';
    element.value = 'Question or label of this input';
    parent.appendChild(element);
}



/*----------------------------------------------------------------------------*/
/* TODO: This is the same as _singlelineBlock() */
function _multilineBlock(parent)
{
    'use strict';
    var element;
}



/*----------------------------------------------------------------------------*/
function _addOption(parent)
{
    'use strict';
    var element = document.createElement('input');
    element = document.createElement('input');
    element.type = 'text';
    element.className = 'fb-content-form-block-field';
    element.value = 'Option ' + (parent.childNodes.length + 1).toString();
    parent.appendChild(element);
}



/*----------------------------------------------------------------------------*/
function _removeOption(parent)
{
    'use strict';
    parent.removeChild(parent.lastChild);
}



/*----------------------------------------------------------------------------*/
function _checkboxBlock(parent)
{
    'use strict';
    var element, container;

    element = document.createElement('p');
    element.className = 'fb-content-form-block-caption';
    element.innerHTML = 'Choices:';
    parent.appendChild(element);

    container = document.createElement('div');
    parent.appendChild(container);

    _addOption(container);

    element = document.createElement('div');
    element.className = 'fb-content-form-block-option-add';
    element.innerHTML = 'add';
    element.onclick = function(){_addOption(container);};
    parent.appendChild(element);

    element = document.createElement('div');
    element.className = 'fb-content-form-block-option-remove';
    element.innerHTML = 'remove';
    element.onclick = function(){_removeOption(container);};
    parent.appendChild(element);
}



/*----------------------------------------------------------------------------*/
/* TODO: This is the same as _checkboxBlock() */
function _radiobuttonBlock(parent)
{
    'use strict';
    var element;
}



/*----------------------------------------------------------------------------*/
function _groupBlock(parent)
{
    'use strict';
    var element;

    /* THIS IS WHERE I LEFT ;) */
}



/*----------------------------------------------------------------------------*/
function _createBlockOptions(parent, blockOptions)
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



/*----------------------------------------------------------------------------*/
function _createBlock(parent, parentId, blockLabel, blockBodyFunc, blockOptions)
{
    'use strict';
    var element;

    /* Label info of block */
    element = document.createElement('div');
    element.className = 'fb-content-form-block-label';
    element.innerHTML = blockLabel;
    parent.appendChild(element);

    /* Remove button of block */
    element = document.createElement('div');
    element.className = 'fb-content-form-block-remove';
    element.onclick = function(){removeBlock(parentId);};
    element.innerHTML = 'remove';
    parent.appendChild(element);

    /* Add block-specific elements */
    element = document.createElement('div');
    element.className = 'fb-content-form-block-body';
    parent.appendChild(element);

    blockBodyFunc(element, blockLabel);
    _createBlockOptions(element, blockOptions);
}



/*------------------------------------------------------------------------------
    Private helper function to generate and add new block to a parent object */
function _addNewBlock(selected, parent, id)
{
    'use strict';
    var block = document.createElement('div');
    block.id = id;
    block.className = 'fb-content-form-block';

    /* Get valus from selection and create new block */
    switch (selected)
    {
        case "1":
            block.className += ' fb-content-form-section';
            _createBlock(block,
                         id,
                         'Section of blocks',
                         _sectionBlock);
            break;
        case "2":
            block.className += ' fb-content-form-singleline';
            _createBlock(block,
                         id,
                         'Single-line block',
                         _singlelineBlock,
                         {hasHint: true,
                          hasLimiter: true});
            break;
        case "3":
            block.className += ' fb-content-form-multiline';
            _createBlock(block,
                         id,
                         'Multi-line block',
                         _singlelineBlock,
                         {hasHint: true,
                          hasLimiter: true});
            break;
        case "4":
            block.className += ' fb-content-form-checkbox';
            _createBlock(block,
                         id,
                         'Check-box block',
                         _checkboxBlock,
                         {hasHint: true});
            break;
        case "5":
            block.className += ' fb-content-form-radiobutton';
            _createBlock(block,
                         id,
                         'Radio-button block',
                         _checkboxBlock,
                         {hasHint: true});
            break;
        case "6":
            block.className += ' fb-content-form-group';
            block.className += ' fb-content-form-radiobutton';
            _createBlock(block,
                         id,
                         'Radio-button block',
                         _groupBlock,
                         {hasHint: true,
                          hasLimiter: true});
            break;
    }
    /* Add new block to forms */
    parent.appendChild(block);
}



/*------------------------------------------------------------------------------
    The action of the add-button */
function addNewSelectedForm(event, element)
{
    'use strict';
    var opts = document.getElementById('fb-menu-parts-add-options');
    _addNewBlock(opts[opts.selectedIndex].value,
                 document.getElementById('fb-content-form'), ID++);

}



/*------------------------------------------------------------------------------
    Remove existing block from its parent */
function removeBlock(id)
{
    'use strict';
    document.getElementById('fb-content-form').removeChild(document.getElementById(id));
}



/*------------------------------------------------------------------------------
    The add-button's block-selection should do nothing, because clicking on the
    add-button itself should add the currently selected block-option */
function doNothingOnSelection(event)
{
    'use strict';
    event.stopPropagation();
}
