#!/usr/bin/python2

import argparse
from flask import Flask, redirect, url_for

app = Flask(__name__)

@app.route('/')
def root():
    return redirect(url_for('static', 'index.html'))

def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--port",
                        nargs='?',
                        help="port number on which to listen",
                        type=int,
                        default=80)
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_arguments()
    app.debug = True
    app.run(host="0.0.0.0", port=args.port)
