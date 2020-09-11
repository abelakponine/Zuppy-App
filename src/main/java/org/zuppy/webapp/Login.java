package org.zuppy.webapp;

import java.io.IOException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.MatrixParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

@Path("login")
/** The getLogin method in this class returns the login and registration page **/
public class Login {
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String getLogin(@CookieParam("username") String user, @CookieParam("user_access") String user_access, @CookieParam("device") String active_device, @MatrixParam("device") String device_type, @Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException {
		
		// check for active session
		try {
			String session = (String) request.getSession(false).getAttribute("user_session");
			if (session != null && user != null && user_access != null) {
				active_device = device_type !=null ? device_type: (active_device != null) ? device_type:"web";
				response.sendRedirect("profile/"+user+";device="+active_device);
				return null;
			}
		} catch(NullPointerException e) { // proceed to login if no active session
			FileLoader login = new FileLoader();
			// construct page
			login.include("header.html", Login.class);
			login.include("portal.html", Login.class);
			login.include("footer.html", Login.class);
			// load countries
			FileLoader country = new FileLoader();
			country.include("countries.txt", Login.class);
			// set page variables
			login.setVar("{{country_list}}", country.getContent());
			login.setVar("{{title}}", "Login");
	
			String device = (device_type != null && device_type != "") ? device_type:"web";
			response.addCookie(new Cookie("device", device));
	
			return login.getContent();
		}
		return null;
	}
}
