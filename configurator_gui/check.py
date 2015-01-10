## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.266 (20150110)                       ##
##                      File: configurator_gui/check.py                       ##
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
from pickle import dump, load, HIGHEST_PROTOCOL

#------------------------------------------------------------------------------#
# Module level constants
FILE_BIN = 'questions_hu.bin_form'
FILE_TXT = 'questions_hu.txt_form'


#------------------------------------------------------------------------------#
def show():
    # Pretty print form-data
    with open(FILE_BIN, 'rb') as file:
        pprint(load(file))


#------------------------------------------------------------------------------#
def save():
    with open(FILE_TXT) as file:
        locals_dict = {}
        exec('data=' + file.read(), {}, locals_dict)
        with open(FILE_BIN, 'wb') as file:
            dump(locals_dict['data'], file, protocol=HIGHEST_PROTOCOL)


#------------------------------------------------------------------------------#
if __name__ == '__main__':
    # save()
    show()
