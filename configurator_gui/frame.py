## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.266 (20150110)                       ##
##                      File: configurator_gui/frame.py                       ##
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
from tkinter import (Frame, Canvas, Scrollbar,
                     VERTICAL, LEFT, RIGHT, BOTH, TOP, ALL, NW, X, Y, N, S, W, E)

# Import configurator modules
from utils import BoolVar

#------------------------------------------------------------------------------#
class ScrollableFrame(Frame):

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, master, *args, **kwargs):
        Frame.__init__(self, master, highlightcolor='#FF0000',
                                     highlightbackground='#FF0000',
                                     highlightthickness=1)#, *args, **kwargs)

        self.NEED_MANUAL_CONF = BoolVar()

        # Create "actors"
        self._canvas = canvas = Canvas(self, highlightcolor='#00FF00',
                                             highlightbackground='#00FF00',
                                             highlightthickness=1)

        self._scroll = scroll = Scrollbar(self,
                                          orient=VERTICAL,
                                          command=canvas.yview)

        canvas.pack(side=LEFT, fill=BOTH, expand=True)
        scroll.pack(side=RIGHT, fill=Y)

        canvas.configure(yscrollcommand=scroll.set)

        # Create "container" widget on canvas
        self._frame  = frame  = Frame(canvas, highlightcolor='#000000',
                                              highlightbackground='#000000',
                                              highlightthickness=1, width=512)

        canvas.create_window((0, 0), window=frame, anchor=NW)

        self._conf_callbacks = callbacks = []

        def on_frame_conf(event):
            print('[ FRAME  ] {:4d} * {:4d}'.format(canvas.winfo_width(), event.height))
            canvas.configure(scrollregion=(0, 0, canvas.cget('width'), event.height))
            if self.NEED_MANUAL_CONF:
                for callback in callbacks:
                    callback(event)
                self.NEED_MANUAL_CONF.toggle()

        def on_canvas_conf(event):
            print('[ CANVAS ] {:4d} * {:4d}'.format(event.width, event.height))
            if self.NEED_MANUAL_CONF:
                frame.configure(width=event.width)
                self.NEED_MANUAL_CONF.toggle()

        # Make scrollbar work
        frame.bind('<Configure>', on_frame_conf)
        canvas.bind('<Configure>', on_canvas_conf)


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def get_inner_frame_object(self):
        return self._frame


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def register_configurable_object(self, callback):
        self._conf_callbacks.append(callback)
