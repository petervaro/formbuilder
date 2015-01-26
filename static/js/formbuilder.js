/* INFO ************************************************************************
**                                                                            **
**                                formbuilder                                 **
**                                ===========                                 **
**                                                                            **
**                      Online Form Building Application                      **
**                       Version: 0.3.01.607 (20150126)                       **
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

(function ()
{
'use strict';

/* Include order check */
if (!g.collections)
    throw "'formbuilder.js' has to be placed after 'collections.js'";

/* Public objects (in 'formbuilder' name-space) */
var formbuilder = {

/*----------------------------------------------------------------------------*/
/* FormBuilder is the manager object. It stores all the information of the
   application itself, it reads and writes the form-serialisation. */
FormBuilder: function (args)
{
    /* Temporary storage */
    var variable,
        body = document.body;

    if (!body)
        throw "'document' is missing 'body' object";

    /* CSS name-space */
    variable = args.classPrefix;
    var classPrefix = this._classPrefix = (typeof variable === 'string' ||
                                           variable instanceof String) ? variable : '';

    /* DOM parent for menu items */
    variable = body.appendChild(document.createElement('div'));
    variable.id = classPrefix + (classPrefix ? '-' : '') + 'menu';
    this._menuParent = variable;

    /* DOM parent for block items */
    variable = body.appendChild(document.createElement('div'));
    variable.id = classPrefix + (classPrefix ? '-' : '') + 'blocks';
    this._blockParent = variable;

    /* Create main collection, which will
       collect blocks and other collections */
    this._rootCollection = new g.collections.Collection({
        notRemovable : true,
        rootElement  : this._blockParent,
        classPrefix  : classPrefix,
    });

    /* Set languages */
    variable = args.languages;
    this._languages = variable instanceof Object ? variable : {en: 'English'};
    this._lang = Object.keys(this._languages)[0];


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.toString = function ()
    {
        return '[object formbuilder.FormBuilder]';
    };


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

        /* Remove blocks from root collection */
        this._rootCollection.removeAllBlockInstances();

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
    this.registerBlockPrototype = function ()
    {
        return this._rootCollection.registerVarItemPrototype.apply(this._rootCollection, arguments);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.newBlockInstance = function ()
    {
        return this._rootCollection.newVarItem.apply(this._rootCollection, arguments);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.removeBlockIstance = function ()
    {
        return this._rootCollection.delVarItem.apply(this._rootCollection, arguments);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.deserialise = function ()
    {
        return this._rootCollection.deserialise.apply(this._rootCollection, arguments);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    this.serialise = function ()
    {
        return this._rootCollection.serialise.apply(this._rootCollection, arguments);
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
        items.className = classPrefix += '-items';

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

        /* Render collections' menu element */
        this._rootCollection.render({fixRoot : items,
                                     optRoot : items,
                                     varRoot : this._blockParent,});
        menu.appendChild(items);
    };
},

}; /* End of 'formbuilder' name-space */
/* Make 'formbuilder' accessible from globals */
g.formbuilder = formbuilder;
})();
