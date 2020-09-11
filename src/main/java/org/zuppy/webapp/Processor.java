package org.zuppy.webapp;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SignatureException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import org.glassfish.jersey.internal.util.ExceptionUtils;
import org.json.JSONObject;
import org.zuppy.secure.ZuppySecure;

@Path("processor")
/** User login and registration class **/
public class Processor {
	private Map<String, Object> userMap = new HashMap<>();
	private JSONObject userError = new JSONObject();
	private JSONObject data = new JSONObject();
	
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.TEXT_PLAIN)

	/* Method to process user login and registration ***/
	public String userLogin(@CookieParam("device") String device, @Context ServletContext context, @CookieParam("JSESSIONID") String session, @Context HttpServletRequest request, @Context HttpServletResponse response,
			@FormParam("firstname") String firstname,
			@FormParam("lastname") String lastname,
			@FormParam("email") String email,
			@FormParam("gender") String gender,
			@FormParam("dob") String dob,
			@FormParam("country") String country,
			@FormParam("telephone") String telephone,
			@FormParam("username") String username,
			@FormParam("password") String password,
			@FormParam("formType") String formType,
			@CookieParam("cookies") String cookies) {

		try {
			response.addHeader("Access-Control-Allow-Origin", "*"); // page access control.
			
			ZuppySecure zps = new ZuppySecure(); // security algorithms
			// fetch user data if exists, users can login with email or username.
			Statement sql = ZuppyDB.getConnection();

			ResultSet resultSet = sql.executeQuery("SELECT ID,Avatar,Email,Username,Password, COUNT(*) AS user_count FROM users U,profile P WHERE email = '"+username+"' AND P.UID = U.ID  OR "
					+ "username = '"+username+"' AND P.UID = U.ID");
			// create userMap for user database results
			while (resultSet.next()){
				userMap.put("id", resultSet.getObject("ID"));
				userMap.put("user", resultSet.getObject("username"));
				userMap.put("password", resultSet.getObject("password"));
				userMap.put("user_count", resultSet.getInt("user_count"));
				userMap.put("user_avatar", resultSet.getObject("avatar"));
			}
			
			/** process user login **/
			if (formType.equals("login")) {
				
				if ((int)userMap.get("user_count") > 0){
					
					// verify user password if user account exists
					password = zps.hash("SHA-256", password);
					
					if (password.equals(userMap.get("password"))) {

						response.addCookie(new Cookie("user_access","true"));
						response.addCookie(new Cookie("id", userMap.get("id").toString()));
						response.addCookie(new Cookie("username", (String)userMap.get("user")));
						
						device = device !=null ? device:"web";
						// start new session
						new StartSession(device, (String)userMap.get("user"), request);

						data.put("status", "success");
						data.put("description", "user logged in successfully.");
						data.put("user", userMap.get("user"));
						data.put("device", device);
						return data.toString();
					}
					else {
						userError.put("status", "failed");
						userError.put("description", "invalid credentials used.");
						userError.put("device", device);
						return userError.toString();
					}
				}
				else {
					userError.put("status", "failed");
					userError.put("description", "user account does not exist.");
					userError.put("device", device);
					return userError.toString();
				}
			}
			
			/** process user registration **/
			if (formType.equals("signup")) {
				
				if ((int)userMap.get("user_count") > 0){
					JSONObject error = new JSONObject();
					error.put("status", "failed");
					error.put("description", "user account already exist.");
					error.put("device", device);
					return error.toString();
				}
				else {
					// encrypt user password
					password = zps.hash("SHA-256", password);
					// create user account database
					int account = sql.executeUpdate("INSERT INTO users ("
							+ "Firstname,Lastname,Email,DOB,Gender,Country,Telephone,Username,Password,DateCreated)"
							+ "VALUES ('"
							+ firstname+"','"+lastname+"','"+email+"','"+dob+"','"
							+ gender+"','"+country+"','"+telephone+"','"+username+"','"+password+"','"
							+ DateUtil.getFullDate()+"')");
					// create profile database
					int profile = sql.executeUpdate("INSERT INTO profile (UID,LastUpdated) VALUES ("
							+ "(SELECT ID FROM users WHERE username = '"+username+"'),'"
							+ DateUtil.getFullDate()+"')");
					
					if (account == 1 && profile == 1) {
						
						resultSet = sql.executeQuery("SELECT ID,Avatar,Email,Username,Password, COUNT(*) AS user_count FROM users U,profile P WHERE email = '"+username+"' AND P.UID = U.ID  OR "
								+ "username = '"+username+"' AND P.UID = U.ID");
						// create new userMap for user database results
						while (resultSet.next()){
							userMap.put("id", resultSet.getObject("ID"));
							userMap.put("user", resultSet.getObject("username"));
							userMap.put("password", resultSet.getObject("password"));
							userMap.put("user_count", resultSet.getInt("user_count"));
							userMap.put("user_avatar", resultSet.getObject("avatar"));
						}
						
						// set user avatar link
						String avatar_url = "avatar.png";

						response.addCookie(new Cookie("user_access","true"));
						response.addCookie(new Cookie("id", userMap.get("id").toString()));
						response.addCookie(new Cookie("username", username));
						response.addCookie(new Cookie("avatar", avatar_url));
						
						device = device !=null ? device:"web";
						// start new session
						new StartSession(device, username, request);
						
						data.put("status", "success");
						data.put("description","user account created successfully.");
						data.put("user", username);
						data.put("device", device);
						return data.toString();
					}
				}
			}
		}
		catch (SQLException | IOException | NoSuchAlgorithmException | InvalidKeyException | NoSuchPaddingException | IllegalBlockSizeException | BadPaddingException | InvalidAlgorithmParameterException | SignatureException e){
			return e.getLocalizedMessage()+"<p>Message:</p>"+e.getMessage()
				+"<p>Exception:</p>"+ExceptionUtils.exceptionStackTraceAsString(e);
		}
		return null;
	}	
}