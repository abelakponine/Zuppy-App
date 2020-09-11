package org.zuppy.webapp;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SignatureException;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;
import org.zuppy.secure.ZuppySecure;

/* Session validation class */
public class Validate_Session {
	private static JSONObject result = new JSONObject();
	private static String deviceTarget = "web";
	/** Session validation constructor **/
	public static JSONObject check(String device, String user, HttpServletRequest request, HttpServletResponse response, String user_access) throws IOException, InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException, SignatureException {
		deviceTarget = device != null ? device:"web";
		String userSession = null, session_key = null, line = null;
		String path = request.getServletContext().getRealPath("./");
		StringBuilder signature = new StringBuilder();
		FileInputStream stream = null;
		
		try {
			ZuppySecure zps = new ZuppySecure();
			// load saved signature
			stream = new FileInputStream(path+"/users/"+user+"/"+device+"_session_signature.signed");
			InputStreamReader streamReader = new InputStreamReader(stream);
			@SuppressWarnings("resource")
			BufferedReader reader = new BufferedReader(streamReader);
			while((line = reader.readLine()) != null) {
				signature.append(line);
			}
			//get user session
			HttpSession session = request.getSession(false);
			userSession = (String) session.getAttribute("user_session");
			// hash session id and signature
			session_key = zps.hash("SHA-256", session.getId()+signature.toString());

			if (session_key.equals(userSession) && user_access.equals("true")){
				result.put("device", deviceTarget);
				result.put("result", true);
				return result;
			}
			else {
				System.out.println("Invalid Session");
				// revoke user access
				return revokeAccess(deviceTarget, request, response);
			}
		}catch(JSONException | NullPointerException | FileNotFoundException e) { // if user_session returns null
			System.out.println("@Null Session");
			// revoke user access
			return revokeAccess(deviceTarget, request, response);
		}
	}
	public static JSONObject revokeAccess(String device, HttpServletRequest request, HttpServletResponse response) throws IOException {
		deviceTarget = device != null ? device:"web";
		// revoke user access
		Cookie cookie = new Cookie("user_access","false");
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		cookie = new Cookie("avatar", "avatar.png");
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		cookie = new Cookie("id", null);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		cookie = new Cookie("username", null);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		request.getSession(true).invalidate();
		result.put("device", deviceTarget);
		result.put("result", false);
		return result;
	}
}
