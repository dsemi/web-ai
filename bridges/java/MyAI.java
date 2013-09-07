package com.ai.api;

import java.util.ArrayList;
import java.util.Map;

public class MyAI {
	public void takeTurn(double time, Map<String, Object> state,
			Map<String, Object> output) {

		ArrayList<Double> board = (ArrayList<Double>) state.get("board");
		int move = getRandomMove(board);

		output.put("move", move);
	}

	private ArrayList<Integer> getValid(ArrayList<Double> board) {
		ArrayList<Integer> valid = new ArrayList<Integer>();

		for (int i = 0; i < board.size(); i++) {
			if (Math.abs(board.get(i)) < 0.1)
				valid.add(i);
		}

		return valid;
	}

	private int getRandomMove(ArrayList<Double> board) {
		ArrayList<Integer> valid = getValid(board);

		return valid.get((int) (Math.random() * valid.size()));
	}
}
