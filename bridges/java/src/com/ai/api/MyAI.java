package com.ai.api;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Collections;

public class MyAI {

    private static final int[][] units = {
        {0,1,2},
        {3,4,5},
        {6,7,8},
        {0,3,6},
        {1,4,7},
        {2,5,8},
        {0,4,8},
        {2,4,6}
    };

    private static int depth;

    public void takeTurn(double time, Map<String, Object> state,
                         Map<String, Object> output) {
            
        ArrayList<Double> board = (ArrayList<Double>) state.get("board");
        int move = getRandomMove(board, (int)((double)((Double) state.get("player"))));

        output.put("move", move);
    }

    private List<Integer> getValid(List<Double> board) {
        List<Integer> valid = new ArrayList<Integer>();

        for (int i = 0; i < board.size(); i++) {
            if (Math.abs(board.get(i)) < 0.1)
                valid.add(i);
        }

        return valid;
    }

    private int getRandomMove(ArrayList<Double> board, int player) {
        List<Integer> valid = getValid(board);

        return valid.get((int) (Math.random() * valid.size()));
    }

    private int getSmartMove(ArrayList<Double> newBoard, int player) {
        List<Double> board = new ArrayList<Double>(newBoard);
        for (int i=0; i<board.size(); i++) {
            if (board.get(i) == 2) {
                board.set(i, -1.0);
            }
        }
        
        List<List<Double>> children = childNodes(board, player);

        List<Integer> weights = new ArrayList<Integer>();
        int alpha = Integer.MIN_VALUE;
        depth = 0;
        for (List<Double> child : children) {
            alpha = Math.max(alpha, -negamax(child, Integer.MIN_VALUE, Integer.MAX_VALUE, -player));
            weights.add(alpha);
        }

        List<Double> nextState = null;
        int maxVal = Collections.max(weights);
        for (int i=0; i<weights.size(); i++) {
            if (weights.get(i) == maxVal) {
                nextState = children.get(i);
                break;
            }
        }
        
        
        for (int i=0; i<board.size(); i++) {
            if (board.get(i) != nextState.get(i)) {
                return i;
            }
        }
        return -1;
    }

    private List<List<Double>> childNodes(List<Double> board, int player) {
        List<List<Double>> nodes = new ArrayList<List<Double>>();
        List<Integer> moves = getValid(board);
        for (int i=0; i<moves.size(); i++) {
            board.set(i, (double) player);
            nodes.add(new ArrayList<Double>(board));
            board.set(i, 0.0);
        }
        return nodes;
    }

    private int getWinner(List<Double> board) {
        for (int[] u : units) {
            if (board.get(u[0]) == board.get(u[1]) && board.get(u[1]) == board.get(u[2]) && board.get(u[0]) != 0) {
                return (int)((double) board.get(u[0]));
            }
        }
        for (double d : board) {
            if (d == 0) {
                return 0;
            }
        }
        return 3;
    }

    private int negamax(List<Double> board, int alpha, int beta, int player) {
        // depth++;
        // System.err.println(depth);
        int winner = getWinner(board);
        if (winner != 0) {
            if (winner == 1 || winner == -1) {
                // depth--;
                return player*winner;
            }
            else {
                // depth--;
                return 0;
            }
        }
        for (List<Double> child : childNodes(board, player)) {
            alpha = Math.max(alpha, -negamax(child, -beta, -alpha, -player));
            if (alpha >= beta) {
                // depth--;
                return alpha;
            }
        }
        // depth--;
        return alpha;

    }
}
