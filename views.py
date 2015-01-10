## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.266 (20150110)                       ##
##                               File: views.py                               ##
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

# Import flask modules
from flask import render_template

def build_view(flask_app, data):

    # Render form
    @flask_app.route('/')
    def show_form():
        return render_template('index.html', data=data)
