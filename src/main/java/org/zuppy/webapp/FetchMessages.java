package org.zuppy.webapp;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.json.JSONObject;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("fetchMessages")
public class FetchMessages {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getMessages(@QueryParam("uid") String query) throws SQLException {

		ArrayList<JSONObject> msgArray = new ArrayList<>();
	
		Statement stat = ZuppyDB.getConnection();
		ResultSet result = stat.executeQuery("SELECT * FROM messages "
				+ "WHERE Sender = '"+query+"' OR Receiver = '"+query+"'");
		
		while (result.next()) {
			JSONObject msgMap = new JSONObject();
			msgMap.put("sender", result.getObject("Sender"));
			msgMap.put("receiver", result.getObject("Receiver"));
			msgMap.put("data", result.getObject("Data"));
			msgMap.put("attachments", result.getObject("Attachments"));
			msgMap.put("type", result.getObject("Type"));
			msgMap.put("date", result.getString("DateCreated").split(" ")[0]);
			msgMap.put("time", result.getString("DateCreated").split(" ")[1].substring(0,5));
			msgArray.add(msgMap);
		}

		return msgArray.toString();
	}
}
