## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.529 (20150122)                       ##
##                            File: filemanager.py                            ##
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
from pathlib import Path
from pprint import pprint
from itertools import count
from os.path import join, isdir
from os import makedirs, listdir
from string import ascii_letters, digits
from pickle import dump, load, HIGHEST_PROTOCOL

# Import formbuilder modules
from formdict import FormDict

# Module level private constants
_ASCII = ascii_letters + digits
_NAME = '{}_{}'
_PATH = 'forms'
_BIN_FILE   = 'data.form'
_PY_FILE    = 'data.py'
_TITLE_FILE = 'title'
_TITLE_TEXT = '{title} | {lang}'



#------------------------------------------------------------------------------#
def _get_id():
    # Helper method to filter integers
    def toi(value):
        # If value can be interpreted as integer
        try:
            return int(value)
        # If value is not a valid value for int()
        except ValueError:
            return 0
    # If there are folders
    try:
        return max(toi(d.name) for d in Path(_PATH).iterdir() if d.is_dir()) + 1
    # If no form has already been saved
    except (ValueError, FileNotFoundError):
        return 1



#------------------------------------------------------------------------------#
class FileManager:

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self):
        self._id   = count(_get_id())
        self._data = {}


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def load(self, form_id):
        # Create file-path
        path = join(_PATH, str(form_id), _BIN_FILE)

        # If file is already open
        try:
            form = self._data[path]
            if form.is_locked:
                data = {'status': False}
            else:
                data = form.data
                form.lock()

            print('[LOADING] =>', data, form.is_locked)
        # If file is not open
        except KeyError:
            # Open it and load deserialise its content
            with open(path, 'rb') as file:
                data = load(file)
                self._data[path] = FormDict(data, lock=True)
        # Return loaded data
        return data


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def dump(self, data):
        # Get/set form-id
        form_id = data['formId'] = data['formId'] or next(self._id)
        # Create folder-path
        path = join(_PATH, str(form_id))

        for i in range(2):
            try:
                # Save in binary format
                with open(join(path, _BIN_FILE), 'wb') as file:
                    self._data[path] = FormDict(data, lock=True)
                    dump(data, file, protocol=HIGHEST_PROTOCOL)
                # Save title
                with open(join(path, _TITLE_FILE), 'w') as file:
                    file.write(_TITLE_TEXT.format(**data))
                # Save in plain text format
                with open(join(path, _PY_FILE), 'w') as file:
                    pprint(data, stream=file)
                    break
            # If path does not exist
            except FileNotFoundError as e:
                makedirs(path)
        else:
            print('An error occured during saving {}'.format(path))


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def list(self):
        return ''


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def release(self, form_id):
        try:
            self._data[join(_PATH, str(form_id), _BIN_FILE)].release()
        except (KeyError, AttributeError):
            print('[RELEASE] =>', form_id)
            pass
