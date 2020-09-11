import java.sql.SQLException;

import org.junit.Test;
import org.zuppy.webapp.DeleteProfile;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.isA;

public class TestDeleteProfile {
	
	@Test
	public void testDeleteProfile() throws SQLException {
		DeleteProfile deleteProfile = new DeleteProfile();
		String user = "zuppytest2";
		boolean result = deleteProfile.deleteProfile(user);
		assertThat(result, isA(Boolean.class));
	}
}
