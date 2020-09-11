
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.junit.Ignore;
import org.junit.Test;

import jakarta.ws.rs.core.MediaType;

/** Test for processor class **/
public class TestProcessor {
	/** Test method for processor login **/
	
	@Ignore
	public void testProcessorLogin() throws IOException {
		String link = "http://localhost:8080/zuppy/app/processor";
		String username = "zuppytest";
		String password = "zuppytest";
		byte[] data = ("username="+username+"&password="+password+"&formType=login").getBytes();

		URL url = new URL(link);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("POST");
		conn.setRequestProperty("Content-type", MediaType.APPLICATION_FORM_URLENCODED);
        conn.setRequestProperty("Content-Length", String.valueOf(data.length));
        conn.setInstanceFollowRedirects(false);
        conn.setRequestProperty("charset", "UTF-8");
        conn.setDoOutput(true);
        conn.setDoInput(true);

        // send post data
        DataOutputStream outputStream = new DataOutputStream(conn.getOutputStream());
        outputStream.write(data);
        outputStream.flush();
        
        // get post response status
        StringBuilder response = new StringBuilder();
        InputStream inputStream = conn.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
        String line;
        while ((line = reader.readLine()) != null){
            response.append(line);
        }
        System.out.println("Response: "+response);
	}

	/** Test method for processor signup **/
	@Test
	public void testProcessorSignup() throws IOException {
		String link = "http://localhost:8080/zuppy/app/processor";
		String firstname = "Zuppy";
		String lastname = "Test";
		String email = "test@zuppy.ml";
		String gender = "Male";
		String dob = "2020/04/17";
		String country = "Nigeria";
		String telephone = "+234701234";
		String username = "zuppytest2";
		String password = "zuppytest";
		
		byte[] data = ("firstname="+firstname+"&lastname="+lastname+"&email="+email
				+"&gender="+gender+"&dob="+dob+"&country="+country+"&telephone="+telephone
				+"&username="+username+"&password="+password
				+"&formType=signup").getBytes();

		URL url = new URL(link);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("POST");
		conn.setRequestProperty("Content-type", MediaType.APPLICATION_FORM_URLENCODED);
        conn.setRequestProperty("Content-Length", String.valueOf(data.length));
        conn.setInstanceFollowRedirects(false);
        conn.setRequestProperty("charset", "UTF-8");
        conn.setDoOutput(true);
        conn.setDoInput(true);

        // send post data
        DataOutputStream outputStream = new DataOutputStream(conn.getOutputStream());
        outputStream.write(data);
        outputStream.flush();
        
        // get post response status
        StringBuilder response = new StringBuilder();
        InputStream inputStream = conn.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
        String line;
        while ((line = reader.readLine()) != null){
            response.append(line);
        }
        System.out.println("Response: "+response);
	}
}