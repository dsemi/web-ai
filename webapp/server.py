#!/usr/bin/python2

import argparse
from urllib import quote
from flask import Flask, redirect, url_for, request
from werkzeug import secure_filename

app = Flask(__name__)

@app.route('/')
def root():
    return redirect(url_for('static', filename='index.html'))


@app.route('/upload_file', methods=['GET','POST'])
def upl_file():
    if request.method == 'POST':
        f = request.files['file']
        return quote(''.join([line for line in f]))
    else:
        with open('static/upload.html') as fi:
            contents = fi.read()
        return contents

    
@app.route('/submit_code', methods=['POST'])
def subcode():
    code  = request.form.get('code')
    email = request.form.get('email')
    game  = request.form.get('game')
    lang  = request.form.get('lang')
    # Run the code 

def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--port",
                        nargs='?',
                        help="port number on which to listen",
                        type=int,
                        default=5000)
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_arguments()
    app.debug = True
    app.run(host="0.0.0.0", port=args.port)
