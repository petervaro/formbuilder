## INFO ########################################################################
##                                                                            ##
##                                formbuilder                                 ##
##                                ===========                                 ##
##                                                                            ##
##                      Online Form Building Application                      ##
##                       Version: 0.3.01.266 (20150110)                       ##
##                      File: configurator_gui/utils.py                       ##
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
import operator

#- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
# Unary operators returning value
unary_ops_val = {'__not__'  : operator.not_,
                 '__bool__' : operator.truth,}

# Unary operators returning self
unary_ops_var = {'__abs__' : operator.abs,
                 '__neg__' : operator.neg,
                 '__pos__' : operator.pos,}

#- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
# Binary operators returning a value
binary_ops_val = {'__lt__'  : operator.lt,
                  '__le__'  : operator.le,
                  '__eq__'  : operator.eq,
                  '__ne__'  : operator.ne,
                  '__ge__'  : operator.ge,
                  '__gt__'  : operator.gt,
                  '__or__'  : operator.or_,
                  '__and__' : operator.and_,
                  '__xor__' : operator.xor,}

# Binary operators returning self
binary_ops_var = {'__add__'       : operator.add,
                  '__sub__'       : operator.sub,
                  '__mul__'       : operator.mul,
                  '__pow__'       : operator.pow,
                  '__mod__'       : operator.mod,
                  '__truediv__'   : operator.truediv,
                  '__floordiv__'  : operator.floordiv,
                  '__ior__'       : operator.ior,
                  '__iand__'      : operator.iand,
                  '__ixor__'      : operator.ixor,
                  '__iadd__'      : operator.iadd,
                  '__isub__'      : operator.isub,
                  '__imul__'      : operator.imul,
                  '__ipow__'      : operator.ipow,
                  '__imod__'      : operator.imod,
                  '__itruediv__'  : operator.itruediv,
                  '__ifloordiv__' : operator.ifloordiv,}

#- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
# Reverse binary operators returning value
rbinary_ops_val = {'__ror__'  : operator.or_,
                   '__rand__' : operator.and_,
                   '__rxor__' : operator.xor,}

# Reverse binary operators returning self
rbinary_ops_var = {'__radd__'      : operator.add,
                   '__rsub__'      : operator.sub,
                   '__rmul__'      : operator.mul,
                   '__rpow__'      : operator.pow,
                   '__rmod__'      : operator.mod,
                   '__rtruediv__'  : operator.truediv,
                   '__rfloordiv__' : operator.floordiv,}



#------------------------------------------------------------------------------#
def numvar(cls):
    # Set unary operators
    for name, func in unary_ops_val.items():
        setattr(cls, name, lambda self, f=func: f(self._value))

    for name, func in unary_ops_var.items():
        setattr(cls, name, lambda self, f=func: self(f(self._value)))

    # Set binary operators
    for name, func in binary_ops_val.items():
        setattr(cls, name, lambda self, other, f=func: f(self._value, other))

    for name, func in binary_ops_var.items():
        setattr(cls, name, lambda self, other, f=func: self(f(self._value, other)))

    # Set reversed binary operators
    for name, func in rbinary_ops_val.items():
        setattr(cls, name, lambda self, other, f=func: f(other, self._value))

    for name, func in rbinary_ops_var.items():
        setattr(cls, name, lambda self, other, f=func: self(f(other, self._value)))

    return cls



#------------------------------------------------------------------------------#
@numvar
class NumVar:

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    @property
    def value(self):
        return self._value
    @value.setter
    def value(self, value):
        self._value = value


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, value=0):
        self._value = value


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __call__(self, value):
        self._value = value
        return self


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __repr__(self):
        return str(self._value)


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __str__(self):
        return self.__repr__()


#------------------------------------------------------------------------------#
# TODO: decorate with operators
class BoolVar:

    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    @property
    def value(self):
        return self._value
    @value.setter
    def value(self, value):
        self._value = value


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def __init__(self, value=False):
        self._value = value


    #- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
    def toggle(self):
        value = self._value
        self._value = not value
        return value



#------------------------------------------------------------------------------#
# Run tests
if __name__ == '__main__':
    x = NumVar(10)
    print(x)
    print(x > 12)
    print(x < 12)
    print(x + 2)
    print(2 + x)
    x**=3
    print(x)
