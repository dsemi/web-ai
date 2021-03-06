#!/usr/bin/python2

class TicTacToe:

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

    def update(self, data, player):
        # should add other things like error-checking and maybe return statement
        self.board[data['move']] = player

    def available_moves(self, player):
        return [i for i,v in enumerate(self.board) if v == 0]
 
    def get_state(self):
        return {'board': self.board[:]}

    def winner(self):
        for u in self.units:
            spaces = [self.board[i] for i in u]
            if spaces[0] and spaces.count(spaces[0]) == len(spaces):
                return spaces[0]
        if not self.available_moves(1):
            return 3 # Tie
        return 0 # Game not over


    def print_brd(self):
        return self.board[:]
        
    # Just for us to see output
    def print_board(self):
        brd = self.board[:]
        output = []
        output.append(('   \033[4m')+' '.join("123")+'\033[0m\n')
        for i in range(3):
            output = output + ['%d|' % (i+1)] + [('  ',' X',' 0')[brd[3*i+j]] for j in range(3)]+['\n']
        return ''.join(output)
