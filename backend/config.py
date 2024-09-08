import os
import sys

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'todo.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
