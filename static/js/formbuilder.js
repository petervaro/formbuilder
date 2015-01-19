/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.453 (20150119)                       **
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

/* Include order check */
if (!g.blocks)
    throw "'formbuilder.js' has to be placed after 'blocks.js'";

/* Public objects (in 'formbuilder' name-space) */
var formbuilder = {

/*----------------------------------------------------------------------------*/
/* FormBuilder is the manager object. It stores all the information of the
   application itself, it reads and writes the form-serialisation. */
FormBuilder: function (args)
{
    /* Automatic identifiers for prototypes of block-objects */
    this._protoId = 0;
    /* Block-object prototypes */
    this._protos = {};
    /* Identifier for instances of block-objects */
    this._blockId = 0;
    /* Instanced block-objects */
    this._blocks = [];

    /* Temporary storage */
    var variable,
        body = document.body;

    if (!body)
        throw "'document' is missing 'body' object";

    /* CSS name-space */
    variable = args.classPrefix;
    this._classPrefix = (typeof variable === 'string' ||
                         variable instanceof String) ? variable : '';

    var classPrefix = this._classPrefix + (this._classPrefix ? '-' : '');

    /* DOM parent for menu items */
    variable = body.appendChild(document.createElement('div'));
    variable.id = classPrefix + 'menu';
    this._menuParent = variable;

    /* DOM parent for block items */
    variable = body.appendChild(document.createElement('div'));
    variable.id = classPrefix + 'blocks';
    this._blocksParent = variable;

    /* Set languages */
    variable = args.languages;
    this._languages = variable instanceof Object ? variable : {en: 'English'};
    this._lang = Object.keys(this._languages)[0];


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.setLang = function (lang)
    {
        this._lang = lang;
        this._langInput.value = lang;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.setTitle = function (title)
    {
        this._title = title;
        this._titleInput.value = title;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.registerBlockPrototype = function (prototype, reference)
    {
        /* Get or set reference, store prototype and return it*/
        reference = reference || this._protoId++;
        prototype = prototype || {};

        var details = prototype.details = prototype.details || {};

        /* Leave or set CSS class-prefix */
        details.classPrefix = details.classPrefix ||
                              this._classPrefix +
                              (this._classPrefix ? '-' : '') + 'blocks';

        /* Store new prototype and return reference */
        this._protos[reference] = prototype;
        return reference;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.newBlockInstance = function (reference)
    {
        /* Get object-prototype and details and create a new instance */
        var prototype = this._protos[reference];
        var block = new prototype.object(prototype.details);

        /* Provide new identifier to the new block-object and store it */
        block.setId(this._id++);
        block.setType(reference);
        this._blocks.push(block);

        /* Render HTML */
        block.render(this._blocksParent);

        /* Return new block object */
        return block;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.pullBlock = function ()
    {
        // pass
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function (data)
    {
        /* Re/set basic informations */
        this.resetForm(data.lang, data.title, data.formId);
        console.log('[DESERIALISE] formId = ', data.formId);

        /* Rebuild form from serialised data */
        var block,
            blockData,
            blocks = data.blocks;
        for (var i=0; i<blocks.length; i++)
        {
            /* Create new block */
            blockData = blocks[i];
            block = this.newBlockInstance(blockData.type);
            /* Pass serialised data to block */
            block.deserialise(blockData);
        }
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function ()
    {
        var dataBlocks = [],
            thisBlocks = this._blocks;

        /* Collect all data from blocks */
        for (var i=0; i<thisBlocks.length; i++)
            dataBlocks.push(thisBlocks[i].serialise());

        console.log('[ SERIALISE ] formId = ', this._formId || null);

        /* Return the serialisation */
        return {title  : this._title,
                lang   : this._lang,
                formId : this._formId || null,
                blocks : dataBlocks};
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.saveForm = function ()
    {
        var request = new XMLHttpRequest();
        request.open('POST', '/data', true);
        request.setRequestHeader('Content-Type',
                                 'application/x-www-form-urlencoded;'+
                                 'charset=UTF-8');
        request.send(JSON.stringify(this.serialise()));
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.closeForm = function (formId)
    {
        var request = new XMLHttpRequest();

        // >>> SOMETHING IS NOT WORKING HERE :(:(:(

        request.open('POST', '/data?form=' + (formId || this._formId), true);
        request.setRequestHeader('Content-Type',
                                 'application/x-www-form-urlencoded;'+
                                 'charset=UTF-8');
        request.send();
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.resetForm = function (lang, title, id)
    {
        /* Request release of current form */
        this.closeForm();

        /* Remove existing data */
        var blocksParent = this._blocksParent;
        while (blocksParent.firstChild)
            blocksParent.removeChild(blocksParent.firstChild);

        /* Reset storage and counter */
        this._blocks = [];
        this._blockId = 0;

        /* Reset form-id, langauge and title */
        this._formId = id || undefined;
        this.setLang(lang || Object.keys(this._languages)[0]);
        this.setTitle(title || 'untitled');
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.loadForm = function (formId)
    {
        var request = new XMLHttpRequest();
        request.open('GET', '/data?form=' + formId, true);

        /* If the response has been loaded */
        request.addEventListener('load',
        (function ()
        {
            /* If successful */
            if (request.status >= 200 && request.status < 400)
            {
                var response = JSON.parse(request.response);
                /* If form is already open */
                if ('status' in response)
                {
                    alert('Ooups! It looks like someone ' +
                          'is already editing this form');
                    return;
                }
                /* If form is not open */
                this.deserialise(response);
            }
            else
            {
                // pass
            }
        }).bind(this));

        /* If there was an error during the connection */
        request.addEventListener('error',
        function ()
        {
            // pass
        });

        request.send();
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.loadList = function ()
    {
        var request = new XMLHttpRequest();
        request.open('GET', '/data', true);

        /* If the response has been loaded */
        request.addEventListener('load',
        (function ()
        {
            /* If successful */
            if (request.status >= 200 && request.status < 400)
            {
                this.deserialise(JSON.parse(request.response));
            }
            else
            {
                // pass
            }
        }).bind(this));

        /* If there was an error during the connection */
        request.addEventListener('error',
        function ()
        {
            // pass
        });

        request.send();
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.render = function ()
    {
        var i,
            key,
            div,
            form,
            input,
            select,
            option,
            object,
            objectKeys,
            subClassPrefix,
            menu = this._menuParent,
            classPrefix = this._classPrefix;

        /* Create menu */
        menu.id = classPrefix = classPrefix + (classPrefix ? '-' : '') + 'menu';

        /* -----------------
           Create menu-items */
        var items = document.createElement('div');
        items.className = classPrefix = classPrefix + '-items';

        /* ----------------------
           Create menu-items-info */
        form = document.createElement('form');
        form.className = subClassPrefix = classPrefix + '-info';
        items.appendChild(form);

        /* ----------------------------
           Create menu-items-info-title */
        div = document.createElement('div');
        div.className = subClassPrefix + '-title';
        div.appendChild(document.createTextNode('form title:'));

        /* Construct input field */
        input = this._titleInput = document.createElement('input');
        input.type = 'text';

        /* Set event for user changing value and set default value */
        input.addEventListener('change',
        (function (input)
        {
            this._title = input.value;
        }).bind(this, input));
        this._title = input.value = 'untitled';

        /* Add newly created elements to structure */
        div.appendChild(input);
        form.appendChild(div);

        /* -------------------------------
           Create menu-items-info-language */
        div = document.createElement('div');
        div.className = subClassPrefix = subClassPrefix + '-language';
        div.appendChild(document.createTextNode('form langauge:'));

        /* ----------------------------------------
           Create menu-items-info-languages-options */
        select = this._langInput = document.createElement('select');
        select.className = subClassPrefix + '-options';

        /* Set event for user changing value */
        select.addEventListener('change',
        (function (select)
        {
            this._lang = select.value;
        }).bind(this, select));

        /* Construct options in selection */
        object = this._languages;
        objectKeys = Object.keys(object);
        for (i=0; i<objectKeys.length; i++)
        {
            key = objectKeys[i];
            option = document.createElement('option');
            option.value = key;
            option.innerHTML = object[key];
            select.appendChild(option);
        }

        /* Set default value */
        this._lang = select.value;

        /* Add newly created elements to structure */
        div.appendChild(select);
        form.appendChild(div);

        /* ---------------------
           Create menu-items-add */
        div = document.createElement('div');
        div.className = subClassPrefix = classPrefix + '-add';
        div.appendChild(document.createTextNode('add new'));

        /* -----------------------------
           Create menu-items-add-options */
        select = document.createElement('select');
        select.className = subClassPrefix + '-options';

        /* If clicking on the selection */
        select.addEventListener('click',
        function (event)
        {
            event.stopPropagation();
        });

        /* Construct options in selection */
        object = this._protos;
        objectKeys = Object.keys(object);
        for (i=0; i<objectKeys.length; i++)
        {
            key = objectKeys[i];
            option = document.createElement('option');
            option.value = key;
            option.innerHTML = object[key].details.blockName;
            select.appendChild(option);
        }

        /* If clicking on the div itself */
        div.addEventListener('click',
        (function (select)
        {
            this.newBlockInstance(select.value);
        }).bind(this, select));

        /* Add newly created elements to structure */
        div.appendChild(select);
        div.appendChild(document.createTextNode('block'));
        items.appendChild(div);

        /* -----------------------------------------
           Remove children from menu if there is any */
        while (menu.firstChild)
            menu.removeChild(menu.firstChild);
        /* Add the new menu to DOM */
        menu.appendChild(items);
    };
},

}; /* End of 'formbuilder' name-space */
/* Make 'formbuilder' accessible from globals */
g.formbuilder = formbuilder;
})();
