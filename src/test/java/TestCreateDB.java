import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.zuppy.webapp.Console;
import org.zuppy.webapp.CreateDB;

/** Test method for CreateDB class **/
public class TestCreateDB {
	@Test
	public void testCreateDB() {
		CreateDB createDB = new CreateDB();
		String expected = Console.log("Output: Database creation completed successfully.")
				+"Output: Database creation completed successfully.";
		assertEquals(expected,createDB.createDatabase());
	}
}