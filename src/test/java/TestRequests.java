
import java.sql.SQLException;

import org.json.JSONObject;
import org.junit.Ignore;
import org.junit.Test;
import org.zuppy.webapp.Requests;
import static org.hamcrest.CoreMatchers.isA;
import static org.hamcrest.MatcherAssert.assertThat;

public class TestRequests {
	/** Method to send test requests class **/
	@Ignore
	public void testSendRequest() throws SQLException {
		JSONObject data = new JSONObject();
		data.put("sender", 8);
		data.put("receiver", 1);
		data.put("rq_type", "new");
		
		Requests request = new Requests();
		Boolean result = request.sendRequest(data.toString());
		System.out.println(result);
		assertThat(result, isA(Boolean.class));
	}

	@Ignore
	public void testGetRequests() throws SQLException {
		int me = 1;
		String rq_type = "get-requests";

		Requests request = new Requests();
		String result = request.getRequests(me, rq_type);
		System.out.println(result);
	}
	
	@Test
	public void testGetContacts() throws SQLException {
		int me = 1;
		String rq_type = "get-contacts";

		Requests request = new Requests();
		String result = request.getRequests(me, rq_type);
		System.out.println(result);
	}
}
