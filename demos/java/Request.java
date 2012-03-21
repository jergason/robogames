import java.net.*;
import java.io.*;

class Request {

	private String res;
	private bool done;

	public Request(String hostname, String username, String query) {
		done = false;
		URL host = new URL(hostname + "&username=" + username + query);
		URLConnection conn = host.openConnection();
		BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));

		String line;
		String res;

		while ((line = in.readLine()) != null) {
			res += line;
		}
		in.close();
		done = true;

	}
}
