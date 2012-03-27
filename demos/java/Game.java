import net.minidev.json.JSONObject;
import net.minidev.json.JSONValue;

import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.Request;
import com.ning.http.client.RequestBuilder;

public class Game {
	private static final String name = "Henry the Programmer";
	private static final String email = "henry@email.com";
	private static final String gameUrl = "http://dev.i.tv:2663";

	// state
	private Piece player = new Piece();
	private Piece target = new Piece();
	private Piece[][] mines;
	private String gameId;
	private int boardWidth;
	private int boardHeight;

	private AsyncHttpClient client = new AsyncHttpClient();

	Game() {
		requestLevel("tiny");
		move("up");
	}

	private void requestLevel(String level) {

		String url = gameUrl + "/minefield/levels/" + level + "/games";
		String body = "{\"username\":\"" + name + "\", \"email\":\"" + email + "\"}";
		String type = "POST";

		String result = sendSynchronousRequest(url, body, type);

		JSONObject object = (JSONObject) JSONValue.parse(result);
		JSONObject state = (JSONObject) object.get("state");
		JSONObject playerObject = (JSONObject) state.get("player");
		JSONObject targetObject = (JSONObject) state.get("target");
		JSONObject sizeObject = (JSONObject) state.get("size");

		gameId = (String) object.get("gameId");

		player.x = ((Integer) playerObject.get("x")).intValue();
		player.y = ((Integer) playerObject.get("y")).intValue();

		target.x = ((Integer) targetObject.get("x")).intValue();
		target.y = ((Integer) targetObject.get("y")).intValue();

		boardWidth = ((Integer) sizeObject.get("w")).intValue();
		boardHeight = ((Integer) sizeObject.get("h")).intValue();

		// probably should parse out the mines
		mines = new Piece[boardWidth][boardHeight];

	}

	private void move(String direction) {
		String url = gameUrl + "/minefield/" + gameId + "/moves";
		String body = "{\"action\":\"" + direction + "\"}";
		String type = "POST";

		String result = sendSynchronousRequest(url, body, type);

		System.out.println(result);
	}

	private String sendSynchronousRequest(String url, String body, String type) {
		
		System.out.println("\n"+type+": "+url+"\n"+body);

		RequestBuilder builder = new RequestBuilder(type);
		builder.addHeader("Content-Type", "application/json");

		builder.setUrl(url);
		builder.setBody(body);
		Request request = builder.build();

		String result = "";
		try {
			result = client.executeRequest(request).get().getResponseBody();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		System.out.println("RESPONSE: "+result);

		return result;
	}

	class Piece {
		public int x;
		public int y;
	}
}