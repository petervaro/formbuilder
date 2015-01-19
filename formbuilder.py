#!/usr/bin/env python3
## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.449 (20150119)                       ##
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
from filemanager import FileManager

#------------------------------------------------------------------------------#
app = Flask(__name__)
fm  = FileManager()



#------------------------------------------------------------------------------#
@app.route('/')
def index():
    # TODO: authenticate user to get access to builder
    return render_template('formbuilder.html')



#------------------------------------------------------------------------------#
@app.route('/data', methods=['GET', 'POST'])
def data():
    # If client posted a new form
    if request.method == 'POST':
        # If post is about to release a form (closing, beginning a new, etc.)
        try:
            fm.release(request.args['form'])
        # If post is about to send a form
        except KeyError:
            fm.dump(request.get_json(force=True))

        # Return OKAY status
        return jsonify(status=True)

    # If client requested an actual form
    try:
        return jsonify(fm.load(request.args['form']))
    # If client requested the list of available forms
    except KeyError:
        return jsonify(fm.list())



#------------------------------------------------------------------------------#
if __name__ == '__main__':
    app.debug = True
    app.run()
