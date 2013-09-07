#!/usr/bin/python2

import os
import json
import sys
import shlex
from subprocess import Popen, PIPE


class Runner:
    
    def __init__(self, process_string):
        self.process_string = process_string
    
    def send_data(self, process, data):
        pass
    
    def update(self):
        pass

    def run(self):
        self.game_type = sys.argv[1]
        self.process = Popen(shlex.split(self.process_string), stdin=PIPE, stdout=PIPE)
        



if __name__ == '__main__':
    runner = Runner("xxxxxx")
    runner.run()
