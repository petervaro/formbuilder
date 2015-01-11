#!/usr/bin/env python3
## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.311 (20150112)                       ##
##                            File: formbuilder.py                            ##
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

# Import flask modules and functions
from flask import Flask, render_template, jsonify, request

# Import formbuilder modules
from data import save_file, load_file

#------------------------------------------------------------------------------#
app = Flask(__name__)



#------------------------------------------------------------------------------#
@app.route('/')
def index():
    return render_template('formbuilder.html')



#------------------------------------------------------------------------------#
@app.route('/data', methods=['GET', 'POST'])
def data():
    if request.method == 'POST':
        save_file(request.get_json(force=True))
        return ''
    else:
        return jsonify(load_file('forms/test_form_hu'))



#------------------------------------------------------------------------------#
if __name__ == '__main__':
    app.debug = True
    app.run()
