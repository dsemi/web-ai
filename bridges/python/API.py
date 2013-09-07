#!/usr/bin/python2

import json
import sys
import MyAI
from multiprocessing import Process, Pipe

persistent_storage = {}
process = Process()

def start_ai(time):
    if process.is_alive():
        process.terminate()
    
    

def main():
    # sys.stdin.readline()
    complete = False

    while not complete:
        input = sys.stdin.readline()

        if input == 'exit':
            complete = True
        else:
            state = json.loads(input)
            time = state.get('time')
            start_ai(time)

if __name__ == '__main__':
    main()
