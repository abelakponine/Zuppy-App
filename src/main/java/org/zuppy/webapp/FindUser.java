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

/** Find User Class, used for location user account in database.
 ** It accepts a GET method and uses a username string to find user. **/
@Path("finduser")
public class FindUser {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	/** Method to get user data from database **/
	// 'me' represents the active user's ID
	// 'user' represents the query string for finding a particular user
	// searchType is either null or requests, represents a user search type or a request search
	public String getUserData(@QueryParam("me") String me, @QueryParam("user") String user, @QueryParam("searchType") String searchType) throws SQLException {
		Statement zdb = ZuppyDB.getConnection();
		ResultSet result = null;
		if (searchType == null) {/** if search type is null (find users details in general) **/
			result = zdb.executeQuery(
				"SELECT * FROM "
					+ "(Select *, CONCAT(firstname,' ',lastname) AS fullname "
						+ "From users U, profile P WHERE "
						// search user in IDs
						+ "ID = '"+user+"' AND P.UID = U.ID AND U.ID != '"+me+"' "
						// search user in usernames
						+ "OR username LIKE '%"+user+"%' AND P.UID = U.ID AND U.ID != '"+me+"' "
						// search user in firstnames
						+ "OR firstname LIKE '%"+user+"%' AND P.UID = U.ID AND U.ID != '"+me+"' "
						// search user in lastnames
						+ "OR lastname LIKE '%"+user+"%' AND P.UID = U.ID AND U.ID != '"+me+"' "
						// search user in fullnames
						+ "OR CONCAT(firstname,' ',lastname) LIKE '%"+user+"%' AND P.UID = U.ID "
						+ "AND U.ID != '"+me+"') UserData "
				// Left Join Requests data to userdata
				+ "LEFT JOIN (SELECT RQID, Sender, Receiver, STATUS AS RQ_STATUS FROM requests "
					+ "WHERE Sender = "+me+" OR Receiver = "+me+") REQ "
						+ "ON REQ.Receiver = UserData.ID OR REQ.Sender = UserData.ID");
		}
		else if (searchType.equals("requests")) {/** if search type is for new requests **/
	
			// find new users for requests
			result = zdb.executeQuery(
					"SELECT * FROM "
						// fetch details of found users not in list
						+ "(Select *, CONCAT(firstname,' ',lastname) AS fullname "
							+ "FROM users U, profile P WHERE "
							+ "P.UID = U.ID AND U.ID != "+me+" AND ID IN "
							
							// find users not in my request list
							+ "(SELECT DISTINCT(ID) FROM (SELECT ID FROM users U "
									+ "WHERE ID = '"+user+"' OR firstname LIKE '%"+user+"%' "
									+ "OR lastname LIKE '%"+user+"%' "
									+ "OR username LIKE '%"+user+"%' "
									+ "OR CONCAT(firstname,' ',lastname) LIKE '%"+user+"%') UID "
								+ "WHERE UID.ID NOT IN (SELECT Sender FROM requests "
								+ "WHERE Receiver = "+me+") "
										+ "AND UID.ID != "+me+" AND UID.ID NOT IN (SELECT Receiver "
								+ "FROM requests WHERE Sender = "+me+"))) UserData "

					// Left Join Requests data to userdata
					+ "LEFT JOIN (SELECT RQID, Sender, Receiver, STATUS AS RQ_STATUS FROM requests "
						+ "WHERE Sender = "+me+" OR Receiver = "+me+") REQ "
							+ "ON REQ.Receiver = UserData.ID OR REQ.Sender = UserData.ID");
		}

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
			rowData.put("rqid", result.getObject("RQID"));
			rowData.put("rq_status", result.getObject("RQ_Status"));
			int year = Integer.parseInt(result.getObject("dob").toString().split("-")[0]);
			rowData.put("age", String.valueOf(DateUtil.getYear()-year));
			userData.add(rowData);
		}
		zdb.close();

		if (userData.isEmpty())
			return null;
		else return userData.toString();
	}
}
