#!/usr/bin/python2

import os, sys, time
import json, shlex
from games.tictactoe import TicTacToe
from subprocess import Popen, PIPE

class Runner:

    def __init__(self):
        self.game = TicTacToe()
        # Should be json
        # args = json.loads(' '.join(sys.argv[1:]))
        # Command line params
        # game
        # language file-to-run
        
        self.process1 = 'java -jar bridges/java/sauce.jar'
        self.process2 = 'java -jar bridges/java/sauce.jar'
        self.processes = []

    def send_data(self, index, data):
        self.processes[index].stdin.write(json.dumps(data)+'\n') # possibly need to convert to string
        self.processes[index].stdin.flush()

    def get_data(self, index):
        return json.loads(self.processes[index].stdout.readline())

    def run(self):
        # if elses for which language and probably game is running
        self.processes.append(Popen(shlex.split(self.process1), stdout=PIPE, stdin=PIPE))
        self.processes.append(Popen(shlex.split(self.process2), stdout=PIPE, stdin=PIPE))
    
        player_index = 0
        while not self.game.winner():
            self.send_data(player_index, self.game.get_state())
            self.game.update(self.get_data(player_index), player_index+1)
            self.game.print_board()
            print
            player_index = (player_index+1) % len(self.processes) 

        for t in self.processes:
            t.stdin.write('exit\n')
            t.stdin.flush()

        print "There's a winner: " + str(self.game.winner())
        



if __name__ == '__main__':
    runner = Runner()
    runner.run()
