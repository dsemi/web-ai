#!/usr/bin/python2

from game import Game

class TicTacToe(Game):
    
    units = [
        (0,1,2),
        (3,4,5),
        (6,7,8),
        (0,3,6),
        (1,4,7),
        (2,5,8),
        (0,4,8),
        (2,4,6)
    ]
    
    def __init__(self):
        self.board = [0 for i in range(9)]

    def update(self, data):
        # should add other things like error-checking and maybe return statement
        self.board[data['player']] = data['move']

    def available_moves(self):
        return [i for i,v in enumerate(self.board) if v == 0]
 
    def get_state(self):
        return self.board[:]

    def winner(self):
        for u in self.units:
            spaces = [self.board[i] for i in u]
            if spaces[0] and spaces.count(spaces[0]) == len(spaces):
                return spaces[0]
        if not self.available_moves():
            return 3 # Tie
        return 0 # Game not over

    # Just for us to see output
    def print_board(self):
        brd = self.board[:]
        for k in brd:
            if brd[k] == -1:
                brd[k] = 2
        print ('   \033[4m')+' '.join("123")+'\033[0m'
        for i in range(3):
            print '%d|' % (i+1),
            for j in range(3):
                print (' ','X','0')[brd[3*i+j]],
            print
