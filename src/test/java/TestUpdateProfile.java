
import java.sql.SQLException;

import org.junit.Test;
import org.zuppy.webapp.UpdateProfile;

public class TestUpdateProfile {

	@Test
	public void testUpdateProfile() throws SQLException {
		
		String firstname = "Zuppy";
		String lastname = "Test";
		String dob = "2020-04-17";
		String country = "Nigeria";
		String jobTitle = "Software Developer";
		String workplace = "Zuppy Tech";
		String highestEducation = "Masters";
		String relationship = "Single";
		String blockQuote = "Hello World!";
		
        UpdateProfile updateProfile = new UpdateProfile();
        String result = updateProfile.doUpdate("8", firstname, lastname, jobTitle, workplace, highestEducation, relationship, dob, blockQuote, country);
        
        System.out.println(result);
	}
}
