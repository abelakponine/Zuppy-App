
import java.sql.SQLException;

import org.json.JSONArray;
import org.junit.Test;
import org.zuppy.webapp.FetchMessages;

public class TestFetchMessages {
	
	@Test
	public void testGetMessages() throws SQLException {
		String uid = "1"; // registered user ID
		FetchMessages fetchMessages = new FetchMessages();
		
		String messages = fetchMessages.getMessages(uid);
		JSONArray msgArray = new JSONArray(messages);
		System.out.println(msgArray.get(0));
	}
}
