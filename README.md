formbuilder
===========

Formbuilder is full-scale application, to create, maintain and run a form
generator and to build, publish and use generated forms.

Formbuilder was developed by Peter Varo at
[Kitchen Budapest (kibu)](http://www.kibu.hu).

It is and always will be a free (libre) and open-source software.



Dependencies
------------

The easiest way to install the dependencies of formbuilder is to use package
managers. This description will provide samlples for Windows (`chocolatey`),
Mac OS X (`homebrew`), Ubuntu (`apt-get`) and Arch Linux (`pacman`).

1. `Python 3.4+` and `pip`:

  Windows:

        C:\> choco install python

  Mac OS X:

        $ brew install python3

  Ubuntu:

        $ apt-get install python3

  Arch Linux:

        # pacman -S python


2. `Flask` micro-ramework:

  Arch Linux:

        # sudo pip install Flask



Create a new formbuilder application
------------------------------------

First create a global variable or check if one already exists. Conventionally
formbuilder uses the lowercase letter `g` which stands for `globals`:

    var g = g || {};

The next step is to create the formbuilder application itself:

    var fb = new g.formbuilder.FormBuilder();

The object `g.formbuilder.FormBuilder` can take a single argument, which has to
be an object. This argument-object can specify the CSS class-prefix which will
be used form-wide. It can also set the available languages of the form. (The
default value, when it is not specified is english.)

    var fb = new g.formbuilder.FormBuilder({
        classPrefix : 'fb',
        languages   : {hu : 'hungarian',
                       en : 'english',
                       is : 'icelandic'}
    });



Extend formbuilder
------------------

Formbuilder has three levels of objects: form, which is a set blocks; block
which is a bunch of units; and unit which is the smallest part of the system.

Units (can be found in `static/units.js`) are basically the elements the users
who generates a form will interact with.

Blocks (can be found in `static/blocks.js`) represents the elements the users
of the generated form will interact with.



License
-------

Copyright &copy; 2014 Peter Varo

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program, most likely a file in the root directory, called 'LICENSE'.
If not, see [http://www.gnu.org/licenses](http://www.gnu.org/licenses).
