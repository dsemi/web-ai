package com.ai.api;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import com.google.gson.Gson;

public class API {
    private static String EXIT_COMMAND = "exit";

    public static Storage storage = new Storage();

    private static MyAI ai;
    private static final Gson gson = new Gson();
    private static Map<String, Object> output = new HashMap<String, Object>();
    private static Map<String, Object> state;
    private static double time;

    private static Thread aiThread;

    @SuppressWarnings("unchecked")
    public static void main(String args[]) {
        ai = new MyAI();

        // Listens to the input streams and commands the AI
        boolean isComplete = false;
        Scanner scanner = new Scanner(System.in);

        while (!isComplete) {
            // Reads the input into the current process
            String input = scanner.nextLine();

            // Tells the runner to stop listening to input
            if (input.equals(EXIT_COMMAND)) {
                isComplete = true;
            }

            // Parses the new game state and sends a turn command to the AI.
            else {
                state = gson.fromJson(input, Map.class);

                if (state.containsKey("time"))
                    time = (Double) state.get("time");

                startAI();
            }
        }
    }

    @SuppressWarnings("deprecation")
    /**
     * Creates a thread that will run the users AI code.  If a previous thread is running then it will be destroyed.
     */
    public static void startAI() {

        // Terminates the previous AI thread if it is still running
        if (aiThread != null && aiThread.isAlive()) {
            aiThread.destroy();
        }

        // Creates the AI command thread
        aiThread = new Thread() {
                @Override
                public void run() {
                    output.clear();
                    ai.takeTurn(time, state, output);
                    System.out.println(gson.toJson(output));
                }
            };

        aiThread.start();
    }

    // Storage class to that enables the AI to save temporary data.
    public static class Storage {
        private final HashMap<String, Object> dataMap = new HashMap<String, Object>();

        @SuppressWarnings("unchecked")
        public <T> T get(String key) {
            return ((T) dataMap.get(key));
        }

        public void put(String key, Object value) {
            dataMap.put(key, value);
        }

        public boolean contains(String key) {
            return dataMap.containsKey(key);
        }
    }
}
