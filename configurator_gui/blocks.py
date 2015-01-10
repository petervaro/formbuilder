## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.266 (20150110)                       ##
##                      File: configurator_gui/blocks.py                      ##
##                                                                            ##
##               For more information about the project, visit                ##
##                <https://github.com/petervaro/formbuilder>.                 ##
##                       Copyright (C) 2014 Peter Varo                        ##
##                                                                            ##
##  This program is free software: you can redistribute it and/or modify it   ##
##   under the terms of the GNU General Public License as published by the    ##
##       Free Software Foundation, either version 3 of the License, or        ##
##                    (at your option) any later version.                     ##
##                                                                            ##
##    This program is distributed in the hope that it will be useful, but     ##
##         WITHOUT ANY WARRANTY; without even the implied warranty of         ##
##            MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.            ##
##            See the GNU General Public License for more details.            ##
##                                                                            ##
##     You should have received a copy of the GNU General Public License      ##
##     along with this program, most likely a file in the root directory,     ##
##        called 'LICENSE'. If not, see <http://www.gnu.org/licenses>.        ##
##                                                                            ##
######################################################################## INFO ##

# Import python modules
from itertools import zip_longest
from collections import OrderedDict
from tkinter import (Frame, Label, Entry, Text, Button, OptionMenu,
                     StringVar, END, X, Y, E, W, BOTH, NONE)

# Import configurator modules
# TODO: remove NumVar as it is not in use anymore.. probably? ;)
from utils import NumVar

#------------------------------------------------------------------------------#
# Module level constants
CON_SPACE = 16
SEPARATOR = '='*5
SEP_THICK = 1
SEP_SPACE = 16
SEP_COLOR_1 = '#303030'
SEP_COLOR_2 = '#C0C0C0'



#------------------------------------------------------------------------------#
def as_separator(text):
    return '{0} {1} {0}'.format(SEPARATOR, text.upper())



#------------------------------------------------------------------------------#
def validator(text):
    return text.replace('\n', ' ')



#------------------------------------------------------------------------------#
# Base class
class Block:

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self):
        # Collection of GUI elements
        self._widgets = []

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def kill(self):
        # Destroy all widgets
        for widget in self._widgets:
            widget.destroy()



#------------------------------------------------------------------------------#
class GenericBlock(Block):

    NAME = '<noname>'

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, master, row_var, member=None):
        super().__init__()

        self._master = master
        self._row_var = row_var = NumVar() if row_var is None else row_var

        # Local references
        widgets = self._widgets

        # Create frame for block
        self._frame = f = Frame(master)
        f.pack(fill=X, padx=CON_SPACE, expand=True)
        f.grid_columnconfigure(0, weight=1)
        f.grid_columnconfigure(1, weight=9)
        widgets.append(f)

        # Create separator-line:
        w = Frame(f, background=SEP_COLOR_2 if member else SEP_COLOR_1, height=SEP_THICK)
        w.grid(row=row_var.value, column=0, columnspan=2, pady=SEP_SPACE, sticky=W+E)
        widgets.append(w)
        row_var += 1

        # Add and Remove buttons
        w = Button(f, text='Remove Block', command=self.kill)
        w.grid(row=row_var.value, column=0)
        widgets.append(w)

        # Create separator-label
        w = Label(f, text=as_separator(self.NAME))
        w.grid(row=row_var.value, column=1, columnspan=2)
        widgets.append(w)
        row_var += 1

        #f.bind('<Configure>', lambda e: print('[ BLOCK  ] => {:4d}'.format(f.cget('width'))))


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def configure(self, event):
        print('[ BLOCK  ] {:4d} ! {:4d}'.format(event.width, self._frame.cget('width')))
        self._frame.configure(width=event.width)



#------------------------------------------------------------------------------#
class SectionBlock(GenericBlock):

    NAME = 'Section'

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, master):
        row_var = NumVar()
        super().__init__(master, row_var, member=False)

        # Get local references
        f = self._frame
        widgets = self._widgets

        # Section properties: label
        w = Label(f, text='Section:')
        w.grid(row=row_var.value, column=0)
        widgets.append(w)

        # Section properties: input
        self._title = w = Entry(f)
        w.grid(row=row_var.value, column=1, sticky=W+E)
        widgets.append(w)
        row_var += 1


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def serialise(self):
        return {'title': validator(self._title.get()),
                'type' : self.NAME}


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def deserialise(self, properties):
        # Store values and update GUI
        self._title.delete(0, END)
        self._title.insert(0, properties['title'])



#------------------------------------------------------------------------------#
# Base class
class QuestionBlock(GenericBlock):

    LABEL = (None,)

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, master, row_var, member):
        super().__init__(master, row_var, member)

        # Data items
        self._inputs = []

        # Get local references
        f = self._frame
        row_var = self._row_var
        widgets = self._widgets

        w = Button(f, text='Add Sub Entry', command=self._add_input)
        w.grid(row=row_var.value, column=1)
        widgets.append(w)
        row_var += 1

        # If block is a member of a group
        if not member:
            # Hint properties: label
            w = Label(f, text='Hint:')
            w.grid(row=row_var.value, column=0)
            widgets.append(w)

            # Hint properties: input
            self._hint = w = Entry(f)
            w.grid(row=row_var.value, column=1, sticky=W+E)
            widgets.append(w)
            row_var += 1

        # Add the first question
        self._add_input()


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def _add_input(self):
        # Get local references
        f = self._frame
        j = len(self._inputs)
        row_var = self._row_var
        widgets = self._widgets

        # Question property
        try:
            l = self.LABEL[j]
        except IndexError:
            l = self.LABEL[1]

        w = Label(f, text='{}:'.format(l))
        w.grid(row=row_var.value, column=0)
        widgets.append(w)

        w = Entry(f)
        self._inputs.append(w)
        w.grid(row=row_var.value, column=1, sticky=W+E)
        widgets.append(w)
        row_var += 1

        # Return entry widget
        return w


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def serialise(self):
        data = {'inputs'  : [validator(i.get()) for i in self._inputs],
                'type'    : self.NAME}
        # If block is stand-alone
        try:
            data['hint'] = validator(self._hint.get())
        # If block is a member => don't have _hint attr
        except AttributeError:
            pass
        return data


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def deserialise(self, properties):
        # If block is stand-alone
        try:
            self._hint.delete(0, END)
            self._hint.insert(0, properties['hint'])
        # If block is a member of a group
        except AttributeError:
            pass
        # Update GUI
        for entry, value in zip_longest(self._inputs, properties['inputs']):
            # If entry is a widget
            try:
                entry.delete(0, END)
            # If entry is None
            except AttributeError:
                entry = self._add_input()
            entry.insert(0, value)



#------------------------------------------------------------------------------#
class SingleLineTextBlock(QuestionBlock):

    NAME  = 'Single Line Texts'
    LABEL = 'Question', 'Label'

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, master, row_var=None, member=False):
        super().__init__(master, row_var, member)



#------------------------------------------------------------------------------#
class MultiLineTextBlock(QuestionBlock):

    NAME  = 'Multi Line Texts'
    LABEL = 'Question', 'Label'

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, master, row_var=None, member=False):
        super().__init__(master, row_var, member)



#------------------------------------------------------------------------------#
class CheckBoxesBlock(QuestionBlock):

    NAME  = 'Check Boxes'
    LABEL = 'Question', 'Option'

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, master, row_var=None, member=False):
        super().__init__(master, row_var, member)



#------------------------------------------------------------------------------#
class RadioButtonBlock(QuestionBlock):

    NAME  = 'Radio Buttons'
    LABEL = 'Question', 'Option'

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, master, row_var=None, member=False):
        super().__init__(master, row_var, member)



#------------------------------------------------------------------------------#
_BLOCKS = tuple((b.NAME, b) for b in (SectionBlock,
                                      SingleLineTextBlock,
                                      MultiLineTextBlock,
                                      CheckBoxesBlock,
                                      RadioButtonBlock))

#------------------------------------------------------------------------------#
class GroupBlock(GenericBlock):

    NAME  = 'Group'
    LABEL = 'Question', 'Option'
    BLOCKS = OrderedDict(_BLOCKS[1:])

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, master):
        row_var = NumVar()
        super().__init__(master, row_var, member=False)

        # Data items
        self._inputs = []
        self._blocks = []

        # Get local references
        f = self._frame
        widgets = self._widgets

        # Create Add button
        w = Button(f, text='Add Sub Block', command=self._add_block)
        w.grid(row=row_var.value, column=1)
        widgets.append(w)

        # Group-menu
        self._var = var = StringVar(master)
        block_names = tuple(self.BLOCKS.keys())
        var.set(block_names[0])
        w = OptionMenu(f, var, *block_names)
        w.config(width=max(map(len, block_names)))
        w.grid(row=row_var.value, column=0, sticky=W+E)
        widgets.append(w)
        row_var += 1

        # Hint properties: label
        w = Label(f, text='Hint:')
        w.grid(row=row_var.value, column=0)
        widgets.append(w)

        # Hint properties: input
        self._hint = w = Entry(f)
        w.grid(row=row_var.value, column=1, sticky=W+E)
        widgets.append(w)
        row_var += 1


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def _add_block(self, name=None):
        # Add new instance of selected block-type
        block = self.BLOCKS[name or self._var.get()](master  = self._master,
                                                     row_var = self._row_var,
                                                     member  = True)
        self._blocks.append(block)

        # Return newly created block
        return block


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def kill(self):
        # Destroy all widgets in all blocks
        for block in self._blocks:
            block.kill()
        # Destroy group-block
        super().kill()


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def serialise(self):
        return {'blocks': [b.serialise() for b in self._blocks],
                'hint'  : validator(self._hint.get()),
                'type'  : self.NAME}


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def deserialise(self, properties):
        # Update GUI
        self._hint.delete(0, END)
        self._hint.insert(0, properties['hint'])
        # Add blocks and deserialise them
        for block_properties in properties['blocks']:
            b = self._add_block(block_properties['type'])
            b.deserialise(block_properties)



#------------------------------------------------------------------------------#
BLOCKS = _BLOCKS + ((GroupBlock.NAME, GroupBlock),)
