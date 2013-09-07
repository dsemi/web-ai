#!/usr/bin/python2

import os, sys, time
import json, shlex
from games.tictactoe import TicTacToe
from subprocess import Popen, PIPE

class Runner:
    
    def __init__(self):
        self.game = TicTacToe()
        # Should be json
        args = ' '.join(sys.argv[1:])
        # Command line params
        # game
        # number of players
        # language file-to-run
        
        self.process1 = 'java -jar bridges/java/sauce.jar'
        self.process2 = 'java -jar bridges/java/sauce.jar'
        self.processes = {}

    def send_data(self, index, data):
        self.processes[index].stdin.write(json.dumps(data)+'\n') # possibly need to convert to string
        self.processes[index].stdin.flush()

    def get_data(self, index):
        return json.loads(self.processes[index].stdout.readline())

    def run(self):
        # if elses for which language is running
        self.processes[1]  = Popen(shlex.split(self.process1), stdout=PIPE, stdin=PIPE)
        self.processes[-1] = Popen(shlex.split(self.process2), stdout=PIPE, stdin=PIPE)
        
        player = 1
        while not self.game.winner():
            self.send_data(player, self.game.get_state())
            self.game.update(self.get_data(player), player)
            self.game.print_board()
            print
            player = -player
        for t in self.processes.values():
            t.stdin.write('exit\n')
            t.stdin.flush()

        print "There's a winner: " + str(self.game.winner())
        



if __name__ == '__main__':
    runner = Runner()
    runner.run()
