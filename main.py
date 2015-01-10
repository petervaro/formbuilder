#!/usr/bin/env python
## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.266 (20150110)                       ##
##                               File: main.py                                ##
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
from configparser import ConfigParser

# Import flask modules
from flask import Flask

# Import appform modules
from form import Form
from views import build_view

#------------------------------------------------------------------------------#
def main():
    # Get user's configuration INI file
    user_config = ConfigParser()
    user_config.read('config.ini')
    user_config_default = user_config['DEFAULT']

    #
    form_config = ConfigParser()
    form_config.read('form.ini')

    # Create flask application
    app = Flask(__name__)
    app.config['DEBUG'] = bool(user_config_default['DEBUG'])
    app.config['SECRET_KEY'] = 'srlzC8nkuZqJrKVnyMvevzSfTukQ0Czn4wsPFxNrHBu97st'

    build_view(app, Form(form_config))

    # Run server
    app.run()

#------------------------------------------------------------------------------#
# If script is running as main
if __name__ == '__main__':
    main()
