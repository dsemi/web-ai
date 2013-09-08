#!/usr/bin/python2

import uuid
import json, shlex, random
import sendgrid, os
from pymongo import MongoClient
from games.tictactoe import TicTacToe
from games.othello import Othello
from subprocess import Popen, PIPE



class Runner:
    def __init__(self):
        self.db = MongoClient('mongodb://localhost:27017/').ai_data
        self.process_strings = []
        self.emails = []
        
        count = 2
        for person in self.db.posts.find({'game':'tic tac toe'}):
            if not count:
                break
            if person['lang'] == 'java':
                with open('bridges/java/src/com/ai/api/MyAI.java', 'w') as f:
                    f.write(person['code'])
                os.chdir('bridges/java')
                p = Popen(shlex.split('mvn install'))
                p.communicate()
                os.chdir('../..')
                self.process_strings.append('java -jar bridges/java/target/JavaAPI-0.0.1-SNAPSHOT-jar-with-dependencies.jar')
                self.emails.append(person['email'])
            elif person['lang'] == 'javascript':
                with open('bridges/javascript/myAI.js', 'w') as f:
                    f.write(person['code'])
                self.process_strings.append('node bridges/javascript/bridge.js')
                self.emails.append(person['email'])
            else:
                pass
            count -= 1

        while len(self.process_strings) < 2:
            self.process_strings.append(('java -jar bridges/java/target/JavaAPI-0.0.1-SNAPSHOT-jar-with-dependencies.jar', 'node bridges/javascript/bridge.js')[random.randint(0,1)])
            
        self.game = TicTacToe()
        self.processes = []

    def send_data(self, index, data):
        self.processes[index].stdin.write(json.dumps(data)+'\n') # possibly need to convert to string
        self.processes[index].stdin.flush()

    def get_data(self, index):
        return json.loads(self.processes[index].stdout.readline())

    def run(self):
        for process in self.process_strings:
            self.processes.append(Popen(shlex.split(process), stdout=PIPE, stdin=PIPE))
    
        player_index = 0
        output = []
        while not self.game.winner():
            if self.game.available_moves(player_index+1):
                d = self.game.get_state()
                d['player'] = player_index+1
                self.send_data(player_index, d)
                self.game.update(self.get_data(player_index), player_index+1)
            else:
                print "Player %d cannot move" % player_index+1
            print self.game.print_board()
            output.append(self.game.print_brd())
            print
            player_index = (player_index+1) % len(self.processes) 

        for t in self.processes:
            t.stdin.write('exit\n')
            t.stdin.flush()

        print "The game is over, and %s" % ("Error","the winner is player 1","the winner is player 2","it was a tie")[self.game.winner()]
        ident = uuid.uuid4()
        self.db.posts.insert({'id':ident, 'states':output, 'type':'tic tac toe'})

        if self.emails:
            s = sendgrid.Sendgrid('semi225599', os.environ['SENDGRID_PW'], secure=True)
            message = sendgrid.Message("ai@osai.com", "AI Results", "Your AI code has finished running:<br>", 'http://127.0.0.1:5000/static/replay.html?id='+str(ident))
            for email in self.emails:
                message.add_to(email)

            s.smtp.send(message)


if __name__ == '__main__':
    runner = Runner()
    runner.run()
