
import java.sql.SQLException;
import java.sql.Statement;

import org.junit.Test;
import org.zuppy.webapp.ZuppyDB;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.isA;

/** Test database connection class **/
public class TestZuppyDB {
	
	@Test
	public void testZuppyDB() throws SQLException {
		Statement zuppyDB = ZuppyDB.getConnection();
		assertThat(zuppyDB, isA(Statement.class));
	}
}
