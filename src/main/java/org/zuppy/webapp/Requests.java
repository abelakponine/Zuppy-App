package org.zuppy.webapp;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import org.json.JSONObject;

import com.mysql.jdbc.Statement;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("doRequest")
public class Requests {
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	/** Method to send new request **/
	public boolean sendRequest(String jsonStr) throws SQLException {
		JSONObject data = new JSONObject(jsonStr);
		Statement sql = (Statement) ZuppyDB.getConnection();
		int result = 0;
		// new request
		if (data.getString("rq_type").equals("new")) {
			result = sql.executeUpdate("INSERT INTO requests (Sender, Receiver, DateCreated) "
					+ "VALUES ('"+data.getInt("sender")+"','"+data.getInt("receiver")+"','"
							+ DateUtil.getFullDate()+"')");
		}
		// accept pending request
		else if (data.getString("rq_type").equals("approval")) {
			result = sql.executeUpdate("UPDATE requests SET Status = 'friends' "
					+ "WHERE RQID = '"+data.getInt("rq_id")+"' "
					+ "AND Receiver =  '"+data.getInt("sender")+"'");
		}
		// decline pending request or delete users from contacts
		else if (data.getString("rq_type").equals("decline") || data.getString("rq_type").equals("delete")) {
			result = sql.executeUpdate("DELETE FROM requests "
					+ "WHERE RQID = '"+data.getInt("rq_id")+"' ");
		}
		// block user from contacts
		else if (data.getString("rq_type").equals("block")) {
			result = sql.executeUpdate("UPDATE requests SET Status = 'blocked', "
					+ "Blocked_by = '"+data.getInt("sender")+"' "
					+ "WHERE RQID = '"+data.getInt("rq_id")+"'");
		}

		if (result == 1)
			return true;
		else return false;
	}
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	/** Method to get pending requests **/
	public String getRequests(@QueryParam("me") int me, @QueryParam("rq_type") String rq_type) throws SQLException {
		Statement sql = (Statement) ZuppyDB.getConnection();
		ResultSet result = null;

		if (rq_type.equals("get-contacts")) {
			result = sql.executeQuery("SELECT *, CONCAT(firstname,' ',lastname) AS fullname "
					+ "FROM requests R, users U, profile P WHERE "
					+ "R.Sender = '"+me+"' AND R.Status = 'friends' AND P.UID = U.ID "
					+ "AND U.ID = R.Receiver AND U.ID != '"+me+"' "
					+ "OR R.Receiver = '"+me+"' AND R.Status = 'friends' AND P.UID = U.ID "
					+ "AND U.ID = R.Sender AND U.ID != '"+me+"'");

			ArrayList<JSONObject> userData = new ArrayList<>();

			while (result.next()) {
				JSONObject rowData = new JSONObject();
				rowData.put("id", result.getInt("ID"));
				rowData.put("firstname", result.getObject("firstname"));
				rowData.put("lastname", result.getObject("lastname"));
				rowData.put("fullname", result.getObject("fullname"));
				rowData.put("dob", result.getObject("dob").toString());
				rowData.put("gender", result.getObject("gender"));
				rowData.put("country", result.getObject("country"));
				rowData.put("username", result.getObject("username"));
				rowData.put("JobTitle", result.getObject("JobTitle"));
				rowData.put("WorkPlace", result.getObject("WorkPlace"));
				rowData.put("HighestEducation", result.getObject("HighestEducation"));
				rowData.put("Relationship", result.getObject("Relationship"));
				rowData.put("Blockquote", result.getObject("Blockquote"));
				rowData.put("Avatar", result.getObject("Avatar"));
				rowData.put("rqid", result.getObject("R.RQID"));
				rowData.put("rq_status", result.getObject("R.Status"));
				int year = Integer.parseInt(result.getObject("dob").toString().split("-")[0]);
				rowData.put("age", String.valueOf(DateUtil.getYear()-year));
				userData.add(rowData);
			}

			// add zuppy account to contact list
			result = sql.executeQuery("SELECT *, CONCAT(firstname,' ',lastname) AS fullname FROM users U, profile P WHERE email = 'support@zuppy.ml' AND P.UID = U.ID");

			while (result.next()) {
				JSONObject rowData = new JSONObject();
				rowData.put("id", result.getInt("ID"));
				rowData.put("firstname", result.getObject("firstname"));
				rowData.put("lastname", result.getObject("lastname"));
				rowData.put("fullname", result.getObject("fullname"));
				rowData.put("dob", result.getObject("dob").toString());
				rowData.put("gender", result.getObject("gender"));
				rowData.put("country", result.getObject("country"));
				rowData.put("username", result.getObject("username"));
				rowData.put("JobTitle", result.getObject("JobTitle"));
				rowData.put("WorkPlace", result.getObject("WorkPlace"));
				rowData.put("HighestEducation", result.getObject("HighestEducation"));
				rowData.put("Relationship", result.getObject("Relationship"));
				rowData.put("Blockquote", result.getObject("Blockquote"));
				rowData.put("Avatar", result.getObject("Avatar"));
				rowData.put("rqid", 0);
				rowData.put("rq_status", "friends");
				int year = Integer.parseInt(result.getObject("dob").toString().split("-")[0]);
				rowData.put("age", String.valueOf(DateUtil.getYear()-year));
				userData.add(rowData);
			}
			sql.close();
			if (userData.isEmpty())
				return null;
			else return userData.toString();
		}
		
		else if (rq_type.equals("get-requests")) {
			result = sql.executeQuery("SELECT * FROM requests WHERE "
				+ "Sender = '"+me+"' AND Status = 'pending' OR "
				+ "Receiver = '"+me+"' AND Status = 'pending'");

			JSONObject request = new JSONObject();
			
			while (result.next()) {
				if (result.getInt("Sender") == me)
					request.append("pending", result.getInt("Receiver"));
				else if (result.getInt("Receiver") == me)
					request.append("incoming", result.getInt("Sender"));
			}
				
			return request.toString();
		}
		
		return null;
	}
}
