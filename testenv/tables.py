## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.457 (20150120)                       ##
##                          File: testenv/tables.py                           ##
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

# Import sqlalchemy modules
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Column, Integer, String, ForeignKey

# Import test-db modules
from base import Base

# Module level private constants
_USER_REPR = '<User(name={0.name!r}, fullname={0.fullname!r}, password={0.password!r})>'
_MAIL_REPR = '<Mail(address={0.address!r})>'



#------------------------------------------------------------------------------#
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    fullname = Column(String)
    password = Column(String)


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __repr__(self):
        return _USER_REPR.format(self)



#------------------------------------------------------------------------------#
class Mails(Base):
    __tablename__ = 'mails'

    id = Column(Integer, primary_key=True)
    address = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))

    user = relationship('User', backref=backref('mails', order_by=id))


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __repr__(self):
        return _MAIL_REPR.format(self)
