#!/usr/bin/python2


class Game:

    def __init__(self): # This is the constructor
        pass

    def update(self):
        pass

    def get_state(self):
        pass

# Just code that I had from tictactoe test earlier, may be useful
'''
class Game:
    def __init__(self):
        self.make_move = {
            -1: self.computermove,
            1: self.humanmove
        }

    def computermove(self, board):
        global times
        x = time.time()
        print 'Computer is attempting to move...'
        print
        p = Popen(['python2','ai.py', pickle.dumps(board)], stdout=PIPE)
        data,_ = p.communicate()
        optimal_move = pickle.loads(data)
        finished_time = time.time()-x
        times.append(finished_time)
        print 'Elapsed time is {0} seconds'.format(finished_time)
        print
        return optimal_move


    def done(self, won):
        global times
        if won == human_num:
            print 'Human won'
        elif won == comp_num:
            print 'Computer won'
        else:
            print 'Tie'
    
        print
        print 'The longest time for the AI to make a move was {0} seconds'.format(max(times))


    def humanmove(self, board):
        usermoves = board.moves()
        print
        print 'Valid moves are: '+str(usermoves)
        usermove = int(raw_input('Enter number: '))
        if not usermove in usermoves:
            print 'Invalid choice'
            return self.humanmove(board)
        return board.playermove(human_num, usermove)
        

    def run(self):
        global times
        times = []
        board = Board([
            0,0,0,
            0,0,0,
            0,0,0
        ])
        board.print_board()
        r = random.randrange(-1,2,2)

        while True:
            board = self.make_move[r](board)
            board.print_board()
            won = board.check4win()
            if won:
                return self.done(won)
            board = self.make_move[-r](board)
            board.print_board()
            won = board.check4win()
            if won:
                return self.done(won)

        
if __name__ == '__main__':
    game = Game()
    game.run()
'''
