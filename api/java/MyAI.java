import java.util.Map;

public class MyAI {
	public void takeTurn(double time, Map<String, Object> state,
			Map<String, Object> result) {

		result.put("copy", state.get("data"));
		result.put("test", "Kenny");
	}
}
