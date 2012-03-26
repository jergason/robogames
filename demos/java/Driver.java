import com.ning.http.client.AsyncCompletionHandler;
import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.Response;


class Driver {
	public static void main (String [] args) throws Exception {
		new AsyncHttpClient().prepareGet("http://www.google.com/").execute(new AsyncCompletionHandler<Response>(){

		    @Override
		    public Response onCompleted(Response response) throws Exception{
		    	System.out.println(response.getResponseBody());
		        return response;
		    }

		    @Override
		    public void onThrowable(Throwable t){
		    }
		});
	}
}
