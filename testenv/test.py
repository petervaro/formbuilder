#!/usr/bin/env python3
## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.457 (20150120)                       ##
##                           File: testenv/test.py                            ##
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

# Import python
from random import choice
from string import digits, ascii_letters

# Import sqlalchemy modules
from sqlalchemy.orm import sessionmaker

# Import test-db modules
from base import engine, Base
from tables import User, Mails

#------------------------------------------------------------------------------#
# Module level contants
ASCII = digits + ascii_letters

# Helper function to generate passwords
def randstr(length):
    return ''.join(choice(ASCII) for i in range(length))



#- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)


#- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
my_session = Session()
user = User(name='peter', fullname='Peter Varo', password=randstr(16))
my_session.add(user)
user = User(name='gabor', fullname='Gabor Labbancz', password=randstr(16))
my_session.add(user)
user = User(name='skeam', fullname='Andras Purcl', password=randstr(16))
my_session.add(user)

my_session.add_all([User(name='benji', fullname='Benjamin Balla', password=randstr(16)),
                    User(name='judit', fullname='Judit Boros', password=randstr(16)),
                    User(name='aniko', fullname='Aniko Fejes', password=randstr(16)),])


#- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
user_query = my_session.query(User).filter_by(name='peter').first()
print('peter old pass =>', user_query.password)
user_query.password = randstr(16)
print('peter new pass =>', user_query.password)
print(my_session.dirty)
print(my_session.new)

my_session.commit()

for id, name, fullname in my_session.query(User.id, User.name, User.fullname).order_by(User.id)[1:4]:
    print(id, name, fullname)

for user in my_session.query(User).filter(User.name == 'peter'):
    print(user)


#- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
nickfmt = '{0.name}@kitchenbudapest.hu'
fullfmt = '{}@kitchenbudapest.hu'
for user in my_session.query(User).all():
    user.mails = [Mails(address=nickfmt.format(user)),
                  Mails(address=fullfmt.format('.'.join(map(str.lower, user.fullname.split()))))]
my_session.commit()

for user in my_session.query(User).all():
    print(user.name, '=>', user.mails)

my_session.\
join(Address, User.mails)