package org.zuppy.webapp;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SignatureException;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Calendar;
import java.util.Locale;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.mysql.jdbc.Driver;

import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.MatrixParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;

@Path("profile/{user}")
/** Application Profile Class **/
public class Profile {
	@GET
	@Produces(MediaType.TEXT_HTML)
	/** Method which starts the messenger client **/
	public String startMessenger(@MatrixParam("device") String mtDevice, @Context ServletContext context, @Context HttpHeaders headers, @CookieParam("avatar") String avatar, @CookieParam("device") String device, @CookieParam("username") String user, @Context HttpServletRequest request, @Context HttpServletResponse response, @CookieParam("user_access") String user_access) throws IOException, InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException, SignatureException, SQLException {
		
		device = mtDevice != null ? mtDevice: mtDevice != "null" ? device:device != null ? device:"web";
		String home = context.getContextPath();
		
		// validate user session
		JSONObject validator = Validate_Session.check(device,user,request,response,user_access);
		
		if (validator.getBoolean("result")) {
			
			// load app
			FileLoader app = new FileLoader();
			app.include("header-main.html", Profile.class);
			app.include("messenger.html", Profile.class);
			app.include("footer-main.html", Profile.class);
			app.setVar("{{user}}", Ucfirst.capitalize(user));

			// get user data from database
			DriverManager.registerDriver(new Driver());
			Statement stat = ZuppyDB.getConnection();
			ResultSet result = stat.executeQuery("SELECT * FROM users U, profile P WHERE username = '"+user+"' AND P.UID = U.ID");
			String userCheck = null;
			while (result.next()) {
				userCheck = (String)result.getObject("username");
				app.setVar("{{firstname}}", (String)result.getObject("firstname"));
				app.setVar("{{lastname}}", (String)result.getObject("lastname"));
				app.setVar("{{dob}}", result.getObject("dob").toString());
				app.setVar("{{gender}}", (String)result.getObject("gender"));
				app.setVar("{{email}}", (String)result.getObject("email"));
				app.setVar("{{telephone}}", (String)result.getObject("telephone"));
				app.setVar("{{country}}", (String)result.getObject("country"));
				app.setVar("{{username}}", (String)result.getObject("username"));
				app.setVar("{{date_created}}", result.getObject("datecreated").toString());
				app.setVar("{{JobTitle}}", (String)result.getObject("JobTitle"));
				app.setVar("{{WorkPlace}}", (String)result.getObject("WorkPlace"));
				app.setVar("{{HighestEducation}}", (String)result.getObject("HighestEducation"));
				app.setVar("{{Relationship}}", (String)result.getObject("Relationship"));
				app.setVar("{{Blockquote}}", (String)result.getObject("Blockquote"));
				app.setVar("{{home}}", home);
				String bday = result.getObject("dob").toString();
				int year = Integer.parseInt(bday.split("-")[0]);
				int month = Integer.parseInt(bday.split("-")[1]);
				int day = Integer.parseInt(bday.split("-")[2]);
				Calendar date = Calendar.getInstance();
				date.set(year,month-1,day);
				bday = date.getDisplayName(Calendar.MONTH, Calendar.SHORT, Locale.getDefault())+" "
						+day;
				app.setVar("{{Birthday}}", bday);
				app.setVar("{{Age}}", String.valueOf(DateUtil.getYear()-year));
				app.setVar("{{last_updated}}", result.getObject("lastupdated").toString());
				// set user avatar link
				String avatar_url = null;
				if (!result.getObject("avatar").equals("avatar.png")) {
					avatar_url = result.getObject("username")+"/avatar/"+result.getObject("avatar");
				}
				else {
					avatar_url = "avatar.png";
				}
				response.addCookie(new Cookie("avatar", avatar_url));
				app.setVar("{{avatar}}", avatar_url);
				// load emojis
				FileLoader Emojis = new FileLoader(), Smileys = new FileLoader();
				Emojis.include("emojis.txt", Profile.class);
				Smileys.include("smileys.txt", Profile.class);
				app.setVar("{{Emojis}}", Emojis.getContent());
				app.setVar("{{Smileys}}", Smileys.getContent());
			}

			if (userCheck != null) {
				return app.getContent();
			}
			else { // if user account was deleted.
				String error = "account not found, please login or register.";
				// redirect user to login page if account has been deleted.
				return "<script>location.href='"+home+"/app/login;device="+device+";error="+error+"';</script>";
			}
		}
		else {
			String error = "invalid session";
			// redirect user to login page if invalid session.
			return "<script>location.href='"+home+"/app/login;device="+device+";error="+error+"';</script>";
		}
	}
}
