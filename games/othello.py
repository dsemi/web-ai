#!/usr/bin/python2


def cross(A,B):
    return [a+b for a in A for b in B]


def units(s):
    sright = [s[0]+cols[i] for i in range(cols.find(s[1])+1,len(cols))]
    sup = [rows[i]+s[1] for i in range(rows.find(s[0]))][::-1]
    sleft = [s[0]+cols[i] for i in range(cols.find(s[1]))][::-1]
    sdown = [rows[i]+s[1] for i in range(rows.find(s[0])+1,len(rows))] 
    sup_right = [u[0]+r[1] for u,r in zip(sup,sright)]
    sup_left = [u[0]+l[1] for u,l in zip(sup,sleft)]
    sdown_left = [d[0]+l[1] for d,l in zip(sdown,sleft)]
    sdown_right = [d[0]+r[1] for d,r in zip(sdown,sright)]
    return [sright,sup_right,sup,sup_left,sleft,sdown_left,sdown,sdown_right]


def surrounding(s):
    return [u[0] for u in dirs[s] if u]


rows = 'ABCDEFGH'
cols = '12345678'
squares = cross(rows,cols)
dirs = dict((s, units(s)) for s in squares)
surs = dict((s, surrounding(s)) for s in squares)
p1_num = 1
p2_num = 2
# TOTAL_MOVES = 60
# moves_left = TOTAL_MOVES
# depth = 6


class Othello:
    def __init__(self):
        self.brd =  dict((s, 0) for s in squares)
        self.brd['D4'] = 2
        self.brd['D5'] = 1
        self.brd['E4'] = 1
        self.brd['E5'] = 2


    def available_moves(self, player):
        starts = [k for k,v in self.brd.items() if v == player]
        checked = dict((k, [0,0,0,0,0,0,0,0]) for k in squares)
        validmoves = []
        for start in starts:
            for i,di in enumerate(dirs[start]):
                for j,move in enumerate(di):
                    if checked[move][i]:
                        break
                    elif self.brd[move] == player:
                        checked[move][i] = 1
                        checked[move][(i+4) % 8] = 1
                        continue
                    elif self.brd[move] != 0:
                        continue
                    elif self.brd[move] == 0:
                        if j > 0 and self.brd[di[j-1]] != player:
                            checked[move] = [1,1,1,1,1,1,1,1]
                            validmoves.append(move)
                        break
        return validmoves

    def winner(self):
        if self.available_moves(p1_num) or self.available_moves(p2_num):
            return 0 # More moves left
        board_vals = self.brd.values()
        p1s = board_vals.count(p1_num)
        p2s = board_vals.count(p2_num)
        if p1s > p2s:
            return 1 # P1 Wins
        elif p2s > p1s:
            return -1 # P2 Wins
        else:
            return 3 # Tie


    def get_state(self):
        return {'board': self.brd}


    def update(self, data, player):
        move = data.get('move')
        board = self.brd.copy()
        board[move] = player
        for di in dirs[move]:
            go = False
            flips = []
            for m in di:
                if board[m] == 0:
                    break
                elif board[m] == player:
                    go = True
                    break
                flips.append(m)
            if go:
                for i in flips:
                    board[i] = player
        self.brd = board.copy()
            

    def print_board(self):
        board = self.brd.copy()
        print ('   \033[4m')+' '.join(cols)+'\033[0m'
        for r in rows:
            print '%s|' % r,
            for c in cols:
                print (' ','B','W')[board[r+c]],
            print

