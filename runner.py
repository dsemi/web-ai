#!/usr/bin/python2

import os, sys, time
import json, shlex
from tictactoe import TicTacToe
from subprocess import Popen, PIPE


class Runner:
    
    def __init__(self):
        self.game = TicTacToe()        
        self.process1 = 'java -jar sauce.jar'
        self.process2 = 'java -jar sauce.jar'
        self.processes = {}

    def send_data(self, index, data):
        self.processes[index].stdin.write(json.dumps(data)+'\n') # possibly need to convert to string
        self.processes[index].stdin.flush()

    def get_data(self, index)
        return json.loads(self.processes[index].stdout.readline())

    def run(self):
        # if elses for which language is running
        self.processes[1]  = (Popen(shlex(self.process1), stdout=PIPE, stdin=PIPE))
        self.processes[-1] = (Popen(shlex(self.process2), stdout=PIPE, stdin=PIPE))
        
        player = 1
        while not self.game.winner():
            self.send_data(player, game.get_state())
            self.game.update(self.get_data(player), player)
            self.game.print_board()
            time.sleep(2)
            player = -player

        print "yo bitch, there's a winner: "+self.game.winner()
        



if __name__ == '__main__':
    runner = Runner()
    runner.run()
