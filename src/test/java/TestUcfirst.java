import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.zuppy.webapp.Ucfirst;

public class TestUcfirst {
	/** Method to capitalize first letter of a string **/
	public static String capitalize(String data) {
		return data.substring(0,1).toUpperCase()+data.substring(1, data.length()).toLowerCase();
	}
	@Test
	public void testUcFirst() {
		assertEquals("Abel", Ucfirst.capitalize("abel"));
	}
}
