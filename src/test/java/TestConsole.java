import org.junit.Test;
import static org.junit.Assert.assertEquals;
import org.zuppy.webapp.*;

/** Test method for Console class **/
public class TestConsole {
	@Test
	public void testConsole() {
		String data = "Hello";
		String console = Console.log(data);
		assertEquals("<script>console.log(\""+data+"\");</script>", console);
	}
}
