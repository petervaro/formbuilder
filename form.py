## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.266 (20150110)                       ##
##                               File: form.py                                ##
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
from collections import OrderedDict

# Module level constants
Q = 'question'
H = 'hint'
T = 'type'
I = 'index'

ENTRIES = Q, H, T
HINT = {'en': 'hint',
        'hu': 'tipp'}

#------------------------------------------------------------------------------#
class Form:

    def __init__(self, data):
        # Set static values
        try:
            self.HINT = HINT[data['PAGE']['lang']]
        except KeyError:
            self.HINT = HINT['en']

        # Set form title
        try:
            self.title = data['PAGE']['title']
        except KeyError:
            self.title = 'Untitled Form'

        self.blocks = blocks = OrderedDict()
        block = None

        # Separate empty sections and questions
        for section in data.sections():
            section_data = data[section]
            # If section is a block-title
            if not len(section_data):
                blocks[section] = block = []
                continue
            # If section contains a question
            try:
                question = {I: section}
                block.append(question)
                for entry in ENTRIES:
                    question[entry] = section_data.get(entry, None)
            # If block does not exist yet
            except AttributeError:
                continue
