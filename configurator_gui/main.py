#!/usr/bin/env python
## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.266 (20150110)                       ##
##                       File: configurator_gui/main.py                       ##
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
from pprint import pprint
from platform import system
from os.path import dirname, join
from pickle import dump, load, HIGHEST_PROTOCOL
from tkinter.filedialog import askdirectory, askopenfilename
from tkinter import (Tk, Frame, Menu, OptionMenu, StringVar, Label, Entry, PanedWindow,
                     BOTH, TOP, BOTTOM, X, N, S, E, W, VERTICAL, LEFT, END)

# Import configurator modules
from blocks import BLOCKS
from frame import ScrollableFrame


#------------------------------------------------------------------------------#
# Module level constants
DEV  = True
SYS  = system()
BIN  = 'questions_{}.bin_form'
TXT  = 'questions_{}.txt_form'
LANG = 'HU', 'EN'


#------------------------------------------------------------------------------#
class ConfiguratorApp(Tk):

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, *args, **kwargs):
        # Initialise parent object
        Tk.__init__(self, *args, **kwargs)

        # If on linux, bind the quit method
        # (although Alt+F4 works out of the box)
        if SYS == 'Linux':
            self.bind('<Control-q>', self._quit)
        # If on Mac, bring window to front
        # (although it is not possible to get focus)
        elif DEV and SYS == 'Darwin':
            self.attributes('-topmost', True)

        # Create the menu
        menu_bar = Menu(self)

        # Create the file-menu
        file_menu = Menu(menu_bar, tearoff=0)
        file_menu.add_command(label='Open', command=self._open)
        file_menu.add_command(label='Save', command=self._save)
        menu_bar.add_cascade(label='File', menu=file_menu)

        # Create the add-menu
        edit_menu = Menu(menu_bar, tearoff=0)
        for label, block in BLOCKS:
            edit_menu.add_command(label=label,
                                  command=lambda b=block: self._add(b))
        menu_bar.add_cascade(label='Add', menu=edit_menu)

        # Set window size
        self.minsize(1024, 512)

        # Add menu to window
        self.config(menu=menu_bar)

        # Make sure form-builder stretches
        self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1)

        # Upper part => global menu
        f = Frame(self, height=20)
        f.grid(row=0, sticky=W+E)
        f.grid_columnconfigure(0, weight=1)
        f.grid_columnconfigure(1, weight=1)
        f.grid_columnconfigure(2, weight=1)
        f.grid_columnconfigure(3, weight=1)

        # Title properties
        w = Label(f, text='Page Title:')
        w.grid(row=0, column=0, sticky=W+E)

        self._title = w = Entry(f)
        w.grid(row=0, column=1, sticky=W+E)

        # Language properties
        w = Label(f, text='Language:')
        w.grid(row=0, column=2, sticky=W+E)

        self._lang = lang = StringVar(self)
        lang.set(LANG[0])

        w = OptionMenu(f, lang, *LANG)
        w.grid(row=0, column=3, sticky=W+E)

        # Lower part => form-builder
        self._sframe = f = ScrollableFrame(self, borderwidth=0, highlightthickness=0)
        f.grid(row=1, column=0, sticky=N+S+W+E)
        self._frame = f.get_inner_frame_object()

        # Create container for questions
        self._blocks = []


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def _quit(self, event):
        # Kill all global-preferences widgets
        # TODO: <kill menu, title and language here>

        # Kill all form-widgets
        for block in self._blocks:
            block.kill()
        self.destroy()


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def _add(self, block_class):
        block = block_class(self._frame)
        self._sframe.register_configurable_object(block.configure)
        self._blocks.append(block)
        return block


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def _save(self):
        if DEV and SYS == 'Darwin':
            self.attributes('-topmost', False)
        path = askdirectory(initialdir=dirname(__file__))
        lang = self._lang.get()

        # Create data object which will be serialised
        data = [{'title': self._title.get(), 'lang' : lang}]
        data.extend(block.serialise() for block in self._blocks)

        # Pickle data (binary)
        try:
            with open(join(path, BIN.format(lang.lower())), 'wb') as file:
                dump(obj=data,
                     file=file,
                     protocol=HIGHEST_PROTOCOL)
        # If path-selection was cancelled
        except TypeError:
            return
        # Pickle data (plain text)
        with open(join(path, TXT.format(lang.lower())), 'w') as file:
            pprint(data, stream=file)


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def _open(self):
        if DEV and SYS == 'Darwin':
            self.attributes('-topmost', False)
        # Remove blocks if there is any
        for block in self._blocks:
            block.kill()
        # Load pickled data
        blocks = dict(BLOCKS)
        try:
            with open(askopenfilename(), 'rb') as file:
                # Load file
                head, *data = load(file)
                # Get and set global values
                self._title.delete(0, END)
                self._title.insert(0, head['title'])
                self._lang.set(head['lang'].upper())
                # Load form-data
                for properties in data:
                    block = self._add(blocks[properties['type']])
                    block.deserialise(properties)
        # If file-open was cancelled
        except TypeError:
            return

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def run(self):
        self.mainloop()



#------------------------------------------------------------------------------#
def main():
    ConfiguratorApp().run()



#------------------------------------------------------------------------------#
if __name__ == '__main__':
    main()
