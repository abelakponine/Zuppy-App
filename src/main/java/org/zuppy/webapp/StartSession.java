package org.zuppy.webapp;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SignatureException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import jakarta.ws.rs.core.Context;

import org.zuppy.secure.ZuppySecure;

public class StartSession {
	
	public StartSession(String device, String username, @Context HttpServletRequest request) throws NoSuchAlgorithmException, InvalidKeyException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException, SignatureException, IOException {
		ServletContext context = request.getServletContext();
		ZuppySecure zps = new ZuppySecure(); // generates new keyPair for every session
		
		// start new user session
		HttpSession newSession = request.getSession(true);
		String session_signature = zps.sign(newSession.getId(), zps.getKeyPair().getPrivate());
		newSession.setAttribute("user_session", zps.hash("SHA-256", newSession.getId()+session_signature));

		if (device.toLowerCase().equals("web") || device.toLowerCase().equals("computer") || device.toLowerCase().equals("smartphone")) {
			// save new private key for user session: used for session validation (key changes at every new session).
			FilePath file = new FilePath(context);
			file.makedir(username);
			file.saveToFile(username+"/"+device+"_session_signature.signed", session_signature);
		}
	}
}
