## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.311 (20150112)                       ##
##                               File: data.py                                ##
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

# IMport python modules
from os import makedirs
from os.path import join
from string import ascii_letters, digits
from pickle import dump, load, HIGHEST_PROTOCOL

# Module level private constants
_ASCII = ascii_letters + digits
_NAME = '{}_{}'
_PATH = 'forms'

#------------------------------------------------------------------------------#
def _format_file_name(string, lang):
    return _NAME.format(''.join(c if c in _ASCII else '_' for c in string), lang)


#------------------------------------------------------------------------------#
def save_file(data):
    path = join(_PATH, _format_file_name(data['title'], data['lang']))
    for i in range(2):
        try:
            with open(path, 'wb') as file:
                dump(data, file, protocol=HIGHEST_PROTOCOL)
                break
        except FileNotFoundError as e:
            makedirs(_PATH)
    else:
        print('An error occured during saving {}'.format(path))


#------------------------------------------------------------------------------#
def load_file(path):
    with open(path, 'rb') as file:
        return load(file)
