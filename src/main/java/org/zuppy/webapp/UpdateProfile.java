package org.zuppy.webapp;

import java.sql.SQLException;
import java.sql.Statement;
import java.util.Calendar;
import java.util.Locale;

import org.json.JSONObject;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("updateProfile")
public class UpdateProfile {
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public String doUpdate(@CookieParam("id") String uid,@FormParam("firstname") String firstname,@FormParam("lastname") String lastname,
				@FormParam("jobTitle") String jobTitle,@FormParam("workplace") String workplace,
				@FormParam("highestEducation") String highestEducation,@FormParam("relationship") String relationship,
				@FormParam("dob") String dob,@FormParam("blockQuote") String blockQuote,
				@FormParam("country") String country) throws SQLException {

		Statement stat = ZuppyDB.getConnection();
		JSONObject response = new JSONObject();
		
		int update = stat.executeUpdate("UPDATE users SET Firstname = '"+firstname+"', "
				+ "Lastname = '"+lastname+"', DOB = '"+dob+"', Country = '"+country+"' WHERE ID = '"+uid+"'");
		
		if (update == 1) {
			
			update = stat.executeUpdate("UPDATE profile SET JobTitle = '"+jobTitle+"', WorkPlace = '"+workplace+"', "
				+ "HighestEducation = '"+highestEducation+"', Relationship = '"+relationship+"', "
				+ "Blockquote = '"+blockQuote+"' WHERE UID = '"+uid+"'");

			if (update == 1) {
				System.out.println("Profile Updated.");
				response.put("status", true);
				response.put("firstname", firstname);
				response.put("lastname", lastname);
				response.put("country", country);
				response.put("dob", dob);
				response.put("highestEducation", highestEducation);
				response.put("jobTitle", jobTitle);
				response.put("workplace", workplace);
				response.put("blockQuote", blockQuote);
				response.put("relationship", relationship);
				String bday = dob;
				int year = Integer.parseInt(bday.split("-")[0]);
				int month = Integer.parseInt(bday.split("-")[1]);
				int day = Integer.parseInt(bday.split("-")[2]);
				Calendar date = Calendar.getInstance();
				date.set(year,month-1,day);
				bday = date.getDisplayName(Calendar.MONTH, Calendar.SHORT, Locale.getDefault())+" "
						+day;
				response.put("birthday", bday);
				response.put("age", String.valueOf(DateUtil.getYear()-year));
			}
		}
		
		return response.toString();
	}
}
