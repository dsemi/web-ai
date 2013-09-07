#!/usr/bin/python2

import argparse
from flask import Flask

app = Flask(__name__)

@app.route('/')
def root():
    return 'Hello World!'

def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--port",
                        help="port number on which to listen",
                        type=int,
                        default=80)
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_arguments
    app.run(host="0.0.0.0", port=args.port)
