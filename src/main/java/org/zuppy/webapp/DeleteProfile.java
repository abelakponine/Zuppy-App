package org.zuppy.webapp;

import java.sql.SQLException;
import java.sql.Statement;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("deleteProfile")
public class DeleteProfile {
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean deleteProfile(@CookieParam("username") String user) throws SQLException {
		Statement stat = ZuppyDB.getConnection();
		boolean result = stat.execute("DELETE FROM users WHERE username = '"+user+"'");
		return result;
	}
}
