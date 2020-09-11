package org.zuppy.webapp;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.MatrixParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

@Path("logout")
/** Logout class, for logging users out from the application **/
public class Logout {
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	/** Logout method **/
	public String doLogout(String jsonStr,@MatrixParam("device") String device,@Context ServletContext context, @Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException {

		device = device !=null ? device:"web";
		Validate_Session.revokeAccess(device, request, response);
		JSONObject result = new JSONObject();
		result.put("result", true);
		result.put("device", device);
		result.put("path",context.getContextPath());
		return result.toString();
	}
}
