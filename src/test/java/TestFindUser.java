
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.either;
import java.sql.SQLException;

import org.junit.Test;
import org.zuppy.webapp.FindUser;

/** Find User Class, used for location user account in database. **/
public class TestFindUser {
	@Test
	public void testFindUser() throws SQLException {
		FindUser findUser = new FindUser();
		String firstname = "Abel";
		String lastname = "Akponine";
		String fullname = firstname+" "+lastname;
		String myID = "7";
		
		String result = findUser.getUserData(myID, fullname, null);
		
		// search if result contains user's fullname or lastname
		assertThat(result, either(containsString(fullname))
				.or(containsString(lastname)));
	}
}
