#!/usr/bin/python2

p1_num = 1
p2_num = 2

class ConnectFour:
    def __init__(self):
        self.grid = [0]*42
        self.cols = [[j*7+i for j in range(6)][::-1] for i in range(7)]
        
        
    def update(self, data, player):
        col = data.get('move')
        for i in self.cols[col]:
            if not self.grid[i]:
                self.grid[i] = player
                break

    def available_moves(self, player):
        return filter(lambda x: not all([self.grid[i] for i in self.cols[x]]), range(7))

    def get_state(self):
        return {'board', self.grid}

    def winner(self):
        board = zip(*(iter(self.grid),)*7)

        p1_pieces = [(i/7,i%7) for i,v in enumerate(self.grid) if v == p1_num]
        p2_pieces = [(i/7,i%7) for i,v in enumerate(self.grid) if v == p2_num]

        dirs = [(-1,1),(0,1),(1,1),(1,0),(1,-1),(0,-1),(-1,-1),(-1,0)]

        for piece in p1_pieces:
            for d in dirs:
                if 0<=piece[0]+3*d[1]<6 and 0<=piece[1]+3*d[0]<7:
                    
                
        
    def print_board(self):
        brd = self.grid[:]
        print ('   \033[4m')+' '.join("0123456")+'\033[0m'
        for i in range(6):
            print '%d|' % i,
            for j in range(7):
                print (' ','X','0')[brd[7*i+j]],
            print
