#!/usr/bin/python2

import os, sys
import json, shlex
from tictactoe import TicTacToe
from subprocess import Popen, PIPE


class Runner:
    
    def __init__(self, process_string, p1, p2):
        self.process_string = process_string
        self.game_type = sys.argv[1]
        self.process = None
        self.players = [p1,p2]

    def send_data(self, data):
        self.process.stdin.write(data)
        self.process.stdin.flush()

    def get_data(self)
        return json.loads(self.process.stdout.readline())

    def update(self):
        pass

    def run(self):
        self.process = Popen(shlex.split(self.process_string), stdin=PIPE, stdout=PIPE)
        



if __name__ == '__main__':
    runner = Runner("xxxxxx", "player1", "player2")
    runner.run()
